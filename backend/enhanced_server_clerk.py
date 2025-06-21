from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import uuid
from typing import List, Dict, Optional
import anthropic
import base64
from pathlib import Path
import requests
from backend.clerk_auth import clerk_auth
from backend.web3_auth import web3_auth

# Load environment variables
load_dotenv('/app/backend/.env')

app = FastAPI(title="Arthrokinetix API with Clerk Authentication")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://arthrokinetix.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection with consistent naming
mongodb_uri = os.environ.get('MONGODB_URI')
if mongodb_uri:
    client = MongoClient(
        mongodb_uri,
        serverSelectionTimeoutMS=5000,  # 5 second timeout
        connectTimeoutMS=5000,
        socketTimeoutMS=5000
    )
    # Force consistent database naming - use lowercase
    db = client.arthrokinetix
    print("MongoDB connected successfully to arthrokinetix database")
    
    # Test connection and ensure collections exist
    try:
        # Ping the database
        client.admin.command('ping')
        
        # Ensure collections exist and create indexes if needed
        db.articles.create_index("id")
        db.artworks.create_index("id") 
        db.algorithm_states.create_index("timestamp")
        db.users.create_index("clerk_user_id")  # Updated for Clerk
        db.users.create_index("email")
        db.feedback.create_index("article_id")
        
        print("Database collections initialized successfully")
    except Exception as e:
        print(f"Database initialization warning: {e}")
        
else:
    print("No MONGODB_URI found")
    db = None

# Anthropic client
anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY')
if anthropic_api_key:
    anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)
    print("Claude API client initialized")
else:
    print("No ANTHROPIC_API_KEY found")
    anthropic_client = None

# Collections
articles_collection = db.articles
artworks_collection = db.artworks
users_collection = db.users
feedback_collection = db.feedback
algorithm_states_collection = db.algorithm_states

@app.get("/")
async def root():
    return {"message": "Arthrokinetix API with Clerk Authentication - Emotional Medical Content & Art Generation"}

# ========== CLERK AUTHENTICATION ENDPOINTS ==========

@app.post("/api/webhooks/clerk")
async def clerk_webhook(request: Request):
    """Handle Clerk webhook events for user management"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        # Verify webhook (simplified for demo)
        event_data = await clerk_auth.verify_webhook(request)
        
        if not event_data:
            raise HTTPException(status_code=400, detail="Invalid webhook")

        event_type = event_data.get('type')
        user_data = event_data.get('data')

        print(f"Received Clerk webhook: {event_type}")

        if event_type == 'user.created':
            # Create new user record
            user_record = clerk_auth.create_user_from_clerk_data(user_data)
            
            # Check if user already exists
            existing_user = users_collection.find_one({"clerk_user_id": user_data.get('id')})
            if not existing_user:
                users_collection.insert_one(user_record)
                print(f"Created user record for {user_record.get('email')}")
            
            return {"success": True, "message": "User created successfully"}

        elif event_type == 'user.updated':
            # Update existing user record
            user_record = clerk_auth.create_user_from_clerk_data(user_data)
            
            users_collection.update_one(
                {"clerk_user_id": user_data.get('id')},
                {
                    "$set": {
                        **user_record,
                        "last_active": datetime.utcnow()
                    }
                },
                upsert=True
            )
            print(f"Updated user record for {user_record.get('email')}")
            
            return {"success": True, "message": "User updated successfully"}

        elif event_type == 'user.deleted':
            # Handle user deletion
            users_collection.delete_one({"clerk_user_id": user_data.get('id')})
            print(f"Deleted user record for {user_data.get('id')}")
            
            return {"success": True, "message": "User deleted successfully"}

        else:
            print(f"Unhandled webhook event type: {event_type}")
            return {"success": True, "message": f"Received {event_type} event"}

    except Exception as e:
        print(f"Clerk webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/sync-user")
async def sync_clerk_user(user_data: dict):
    """Manually sync a Clerk user (for testing)"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        user_record = clerk_auth.create_user_from_clerk_data(user_data)
        
        # Upsert user record
        users_collection.update_one(
            {"clerk_user_id": user_data.get('id')},
            {"$set": user_record},
            upsert=True
        )
        
        user_record["_id"] = str(user_record.get("_id", ""))
        return {
            "success": True,
            "user": user_record,
            "message": "User synced successfully"
        }

    except Exception as e:
        print(f"User sync error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users/profile/{clerk_user_id}")
async def get_user_profile(clerk_user_id: str):
    """Get user profile by Clerk user ID"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        user = users_collection.find_one({"clerk_user_id": clerk_user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user["_id"] = str(user["_id"])
        return user

    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== ENHANCED FEEDBACK ENDPOINTS ==========

@app.post("/api/feedback")
async def submit_feedback_enhanced(feedback_data: dict):
    """Enhanced feedback submission with Clerk and Web3 authentication"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        email = feedback_data.get("user_email")
        clerk_user_id = feedback_data.get("clerk_user_id")
        wallet_address = feedback_data.get("wallet_address")
        
        # Check authentication
        has_access = False
        access_type = "none"
        user_record = None
        
        # Check Clerk authentication
        if clerk_user_id:
            user_record = users_collection.find_one({"clerk_user_id": clerk_user_id})
            if user_record and user_record.get("email_verified"):
                has_access = True
                access_type = "email_verified"
        
        # Check Web3 NFT authentication
        if not has_access and wallet_address:
            web3_user = users_collection.find_one({"wallet_address": wallet_address.lower()})
            if web3_user and web3_user.get("nft_verified"):
                has_access = True
                access_type = "nft_verified"
                user_record = web3_user
        
        # For demo purposes, allow anonymous feedback
        if not has_access:
            has_access = True
            access_type = "demo"
        
        if not has_access:
            raise HTTPException(status_code=403, detail="Feedback access requires authentication")
        
        feedback = {
            "id": str(uuid.uuid4()),
            "article_id": feedback_data.get("article_id"),
            "emotion": feedback_data.get("emotion"),
            "user_email": email,
            "clerk_user_id": clerk_user_id,
            "wallet_address": wallet_address,
            "access_type": access_type,
            "timestamp": datetime.utcnow(),
            "influence_weight": 1.0 if access_type in ["email_verified", "nft_verified"] else 0.5
        }
        
        feedback_collection.insert_one(feedback)
        
        # Update algorithm state with feedback
        await update_algorithm_with_feedback(feedback_data.get("emotion"))
        
        feedback["_id"] = str(feedback["_id"])
        return {
            "feedback": feedback,
            "message": f"Feedback submitted successfully ({access_type} access)"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Feedback submission error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== WEB3 NFT AUTHENTICATION ENDPOINTS ==========

@app.post("/api/web3/verify-nft")
async def verify_nft_ownership(wallet_data: dict):
    """Verify NFT ownership for Web3 authentication"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        wallet_address = wallet_data.get("address")
        if not wallet_address:
            raise HTTPException(status_code=400, detail="Wallet address is required")

        # Verify NFT ownership via Alchemy
        verification_result = await web3_auth.verify_nft_ownership(wallet_address)
        
        if verification_result.get("verified"):
            # Create or update user record
            user_record = web3_auth.create_user_from_web3_data(wallet_address, verification_result)
            
            # Upsert user record
            users_collection.update_one(
                {"wallet_address": wallet_address.lower()},
                {"$set": user_record},
                upsert=True
            )
            
            print(f"NFT verification successful for {wallet_address}")
            
            return {
                "verified": True,
                "feedback_access": True,
                "wallet_address": wallet_address,
                "erc721_balance": verification_result.get("erc721_balance", 0),
                "erc1155_balance": verification_result.get("erc1155_balance", 0),
                "contracts_owned": verification_result.get("contracts_owned", []),
                "message": "NFT ownership verified successfully"
            }
        else:
            # Still create a user record but without verification
            user_record = web3_auth.create_user_from_web3_data(wallet_address, verification_result)
            user_record["feedback_access"] = False
            user_record["access_type"] = "web3_connected"
            
            users_collection.update_one(
                {"wallet_address": wallet_address.lower()},
                {"$set": user_record},
                upsert=True
            )
            
            return {
                "verified": False,
                "feedback_access": False,
                "wallet_address": wallet_address,
                "erc721_balance": 0,
                "erc1155_balance": 0,
                "contracts_owned": [],
                "message": "No qualifying NFTs found",
                "error": verification_result.get("error")
            }

    except HTTPException:
        raise
    except Exception as e:
        print(f"NFT verification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/web3/verify-and-sync")
async def verify_and_sync_wallet(wallet_data: dict):
    """Verify NFT ownership and sync user data"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        wallet_address = wallet_data.get("address")
        if not wallet_address:
            raise HTTPException(status_code=400, detail="Wallet address is required")

        # Verify NFT ownership
        verification_result = await web3_auth.verify_nft_ownership(wallet_address)
        
        # Create user record
        user_record = web3_auth.create_user_from_web3_data(wallet_address, verification_result)
        
        # Update user record in database
        result = users_collection.update_one(
            {"wallet_address": wallet_address.lower()},
            {"$set": user_record},
            upsert=True
        )
        
        # Get the updated user record
        updated_user = users_collection.find_one({"wallet_address": wallet_address.lower()})
        if updated_user:
            updated_user["_id"] = str(updated_user["_id"])
        
        return {
            "success": True,
            "user": updated_user,
            "verification": verification_result,
            "message": "Wallet verification and sync completed"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Wallet sync error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/web3/user/{wallet_address}")
async def get_web3_user_profile(wallet_address: str):
    """Get Web3 user profile by wallet address"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        user = users_collection.find_one({"wallet_address": wallet_address.lower()})
        if not user:
            raise HTTPException(status_code=404, detail="Web3 user not found")

        user["_id"] = str(user["_id"])
        return user

    except HTTPException:
        raise
    except Exception as e:
        print(f"Get Web3 user profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Feedback submission error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def update_algorithm_with_feedback(emotion: str):
    """Update algorithm state based on user feedback"""
    try:
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        
        if current_state:
            # Get current emotional mix
            emotional_mix = current_state["emotional_state"]["emotional_mix"]
            
            # Boost the feedback emotion slightly
            emotion_boost = 0.05
            if emotion in emotional_mix:
                emotional_mix[emotion] = min(1.0, emotional_mix[emotion] + emotion_boost)
            
            # Normalize to maintain balance
            total = sum(emotional_mix.values())
            if total > 0:
                for key in emotional_mix:
                    emotional_mix[key] = emotional_mix[key] / total
            
            # Find new dominant emotion
            dominant_emotion = max(emotional_mix, key=emotional_mix.get)
            
            # Create new state
            new_state = {
                "emotional_state": {
                    "dominant_emotion": dominant_emotion,
                    "emotional_intensity": emotional_mix[dominant_emotion],
                    "emotional_mix": emotional_mix
                },
                "visual_representation": generate_visual_representation(dominant_emotion, emotional_mix[dominant_emotion]),
                "timestamp": datetime.utcnow(),
                "articles_processed": current_state.get("articles_processed", 0),
                "feedback_influences": current_state.get("feedback_influences", []) + [emotion]
            }
            
            algorithm_states_collection.insert_one(new_state)
            print(f"Algorithm updated with feedback emotion: {emotion}")
            
    except Exception as e:
        print(f"Error updating algorithm with feedback: {e}")

# ========== ADMIN ENDPOINTS ==========

@app.get("/api/admin/users")
async def get_users_admin():
    """Get all users for admin dashboard"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")

        users = list(users_collection.find({}).sort("created_at", -1))
        
        for user in users:
            user["_id"] = str(user["_id"])
            
            # Add feedback count
            feedback_count = feedback_collection.count_documents({"clerk_user_id": user.get("clerk_user_id")})
            user["feedback_count"] = feedback_count
            
        return {
            "users": users,
            "total": len(users),
            "email_verified": len([u for u in users if u.get("email_verified")]),
            "nft_verified": len([u for u in users if u.get("nft_verified")])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Import all the existing endpoints from the original server.py
# (Algorithm state, articles, artworks, etc.)

@app.get("/api/algorithm-state")
async def get_algorithm_state():
    """Get current emotional state of the algorithm"""
    try:
        if db is None:
            raise HTTPException(status_code=500, detail="Database not connected")
            
        # Get latest state or create default
        latest_state = algorithm_states_collection.find_one(
            {}, sort=[("timestamp", -1)]
        )
        
        if not latest_state:
            print("Creating initial algorithm state...")
            # Create initial state
            initial_state = {
                "emotional_state": {
                    "dominant_emotion": "confidence",
                    "emotional_intensity": 0.6,
                    "emotional_mix": {
                        "hope": 0.4,
                        "confidence": 0.6,
                        "healing": 0.3,
                        "innovation": 0.2,
                        "tension": 0.1,
                        "uncertainty": 0.2
                    }
                },
                "visual_representation": {
                    "shape": "circle",
                    "color": "#3498db",
                    "glow_intensity": 0.6,
                    "pulse_rate": 1.2
                },
                "timestamp": datetime.utcnow(),
                "articles_processed": 0,
                "feedback_influences": []
            }
            
            result = algorithm_states_collection.insert_one(initial_state)
            latest_state = algorithm_states_collection.find_one({"_id": result.inserted_id})
            print("Initial algorithm state created successfully")
        
        # Convert ObjectId to string for JSON serialization
        latest_state["_id"] = str(latest_state["_id"])
        return latest_state
        
    except Exception as e:
        print(f"Algorithm state error: {e}")
        # Return basic fallback state instead of failing
        return {
            "emotional_state": {
                "dominant_emotion": "confidence",
                "emotional_intensity": 0.6,
                "emotional_mix": {
                    "hope": 0.4,
                    "confidence": 0.6,
                    "healing": 0.3,
                    "innovation": 0.2,
                    "tension": 0.1,
                    "uncertainty": 0.2
                }
            },
            "visual_representation": {
                "shape": "circle",
                "color": "#3498db",
                "glow_intensity": 0.6,
                "pulse_rate": 1.2
            },
            "timestamp": datetime.utcnow().isoformat(),
            "articles_processed": 0,
            "feedback_influences": [],
            "_id": "fallback_state"
        }

def generate_visual_representation(dominant_emotion: str, intensity: float) -> dict:
    """Generate visual representation for algorithm mood indicator"""
    emotion_visuals = {
        "hope": {"shape": "circle", "color": "#27ae60"},
        "confidence": {"shape": "square", "color": "#3498db"},
        "breakthrough": {"shape": "star", "color": "#f39c12"},
        "healing": {"shape": "hexagon", "color": "#16a085"},
        "tension": {"shape": "triangle", "color": "#e74c3c"},
        "uncertainty": {"shape": "diamond", "color": "#95a5a6"}
    }
    
    base_visual = emotion_visuals.get(dominant_emotion, emotion_visuals["confidence"])
    
    return {
        "shape": base_visual["shape"],
        "color": base_visual["color"],
        "glow_intensity": intensity,
        "pulse_rate": 0.5 + intensity,
        "scale": 0.8 + intensity * 0.4
    }

# Add basic article endpoints for compatibility
@app.get("/api/articles")
async def get_articles(subspecialty: Optional[str] = None):
    """Get all articles with optional filtering"""
    try:
        query = {}
        if subspecialty:
            query["subspecialty"] = subspecialty
            
        articles = list(articles_collection.find(query).sort("published_date", -1))
        
        # Convert ObjectIds to strings
        for article in articles:
            article["_id"] = str(article["_id"])
            
        return {"articles": articles}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/articles/{article_id}")
async def get_article(article_id: str):
    """Get specific article by ID"""
    try:
        article = articles_collection.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
            
        article["_id"] = str(article["_id"])
        return article
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    
    # Railway provides PORT environment variable
    port = int(os.environ.get("PORT", 8001))
    print(f"Starting Clerk-enhanced server on port {port}")
    
    uvicorn.run(
        "enhanced_server_clerk:app",
        host="0.0.0.0", 
        port=port,
        reload=False
    )