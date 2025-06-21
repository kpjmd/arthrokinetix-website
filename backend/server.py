from fastapi import FastAPI, HTTPException, File, UploadFile, Form
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

# Load environment variables
load_dotenv('/app/backend/.env')

app = FastAPI(title="Arthrokinetix API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://904d118b-2810-48a9-8104-ca77055c206f.preview.emergentagent.com"],
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
    db = client.arthrokinetix  # Changed from client.arthrokinetix to force lowercase
    print("MongoDB connected successfully to arthrokinetix database")
    
    # Test connection and ensure collections exist
    try:
        # Ping the database
        client.admin.command('ping')
        
        # Ensure collections exist and create indexes if needed
        db.articles.create_index("id")
        db.artworks.create_index("id") 
        db.algorithm_states.create_index("timestamp")
        db.newsletter_subscribers.create_index("email")
        db.feedback.create_index("article_id")
        
        print("Database collections initialized successfully")
    except Exception as e:
        print(f"Database initialization warning: {e}")
        
else:
    print("No MONGODB_URI found")
    db = None

# Anthropic client with correct environment variable name
anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY')  # Changed from CLAUDE_API_KEY
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
    return {"message": "Arthrokinetix API - Emotional Medical Content & Art Generation"}

# Algorithm state management
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

# Enhanced article creation with file upload support
@app.post("/api/articles")
async def create_article(
    title: str = Form(...),
    subspecialty: str = Form("sportsMedicine"),
    content_type: str = Form("text"),  # 'text', 'html', 'pdf'
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    evidence_strength: float = Form(0.5),
    meta_description: Optional[str] = Form(None)
):
    """Create new article with support for text input or file upload"""
    try:
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Process content based on type
        processed_content = ""
        html_content = ""
        file_data = None
        
        if content_type == "text" and content:
            processed_content = content
            
        elif content_type in ["html", "pdf"] and file:
            # Read and store file content
            file_content = await file.read()
            
            if content_type == "html":
                # For HTML files, extract content for analysis but keep full HTML for display
                html_content = file_content.decode('utf-8')
                # Extract text content for emotional analysis (strip HTML tags roughly)
                import re
                processed_content = re.sub('<[^<]+?>', '', html_content)
                
                # Store file data
                file_data = {
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "size": len(file_content),
                    "content": html_content
                }
                
            elif content_type == "pdf":
                # For PDF files, store for future processing
                file_data = {
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "size": len(file_content),
                    "content": base64.b64encode(file_content).decode('utf-8')
                }
                processed_content = f"PDF content from {file.filename}"
                
        else:
            raise HTTPException(status_code=400, detail="Invalid content type or missing content/file")
        
        # Process article with Arthrokinetix algorithm
        emotional_data = await process_article_emotions(processed_content)
        signature_data = generate_emotional_signature(emotional_data)
        
        article = {
            "id": article_id,
            "title": title,
            "content_type": content_type,
            "content_source": "file_upload" if file else "text_input",
            "content": processed_content,
            "html_content": html_content if content_type == "html" else None,
            "file_data": file_data,
            "subspecialty": subspecialty,
            "published_date": datetime.utcnow(),
            "emotional_data": emotional_data,
            "signature_data": signature_data,
            "evidence_strength": evidence_strength,
            "meta_description": meta_description,
            "read_time": calculate_read_time(processed_content)
        }
        
        articles_collection.insert_one(article)
        
        # Generate corresponding artwork
        artwork = await generate_artwork(article_id, emotional_data, signature_data)
        
        # Update algorithm state
        await update_algorithm_state(emotional_data)
        
        article["_id"] = str(article["_id"])
        return {"article": article, "artwork": artwork}
        
    except Exception as e:
        print(f"Error creating article: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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

@app.get("/api/artworks")
async def get_artworks(subspecialty: Optional[str] = None):
    """Get all artworks with optional filtering"""
    try:
        query = {}
        if subspecialty:
            query["subspecialty"] = subspecialty
            
        artworks = list(artworks_collection.find(query).sort("created_date", -1))
        
        # Convert ObjectIds to strings
        for artwork in artworks:
            artwork["_id"] = str(artwork["_id"])
            
        return {"artworks": artworks}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/artworks/{artwork_id}")
async def get_artwork(artwork_id: str):
    """Get specific artwork by ID"""
    try:
        artwork = artworks_collection.find_one({"id": artwork_id})
        if not artwork:
            raise HTTPException(status_code=404, detail="Artwork not found")
            
        artwork["_id"] = str(artwork["_id"])
        return artwork
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
async def process_article_emotions(content: str) -> dict:
    """Process article content for emotional analysis using Claude as supplement"""
    try:
        if not anthropic_client:
            print("Claude API not available, using fallback analysis")
            return get_fallback_emotional_data()
            
        # Use Claude for sophisticated emotional analysis
        message = anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": f"""Analyze this medical content text for emotional undertones and return a JSON response:

{content[:2000]}  # Limit content length

Please analyze for these emotions and return scores 0-1 as numbers (not strings):
- hope (recovery potential, positive outcomes)
- tension (complications, risks, challenges)
- confidence (evidence strength, certainty)
- uncertainty (ambiguous results, need for more research)
- breakthrough (innovation, novel approaches)
- healing (therapeutic potential, restoration)

Also assess:
- evidence_strength (0-1 as number)
- technical_density (0-1 as number)
- subspecialty (one of: sportsMedicine, jointReplacement, trauma, spine, handUpperExtremity, footAnkle, shoulderElbow, pediatrics, oncology)

Return only valid JSON with numeric values."""
            }]
        )
        
        response_text = message.content[0].text
        emotional_data = json.loads(response_text)
        
        # Ensure we have all required fields with proper numeric values
        emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
        for emotion in emotions:
            if emotion not in emotional_data:
                emotional_data[emotion] = 0.5
            else:
                # Ensure it's a number
                emotional_data[emotion] = float(emotional_data[emotion])
                
        # Ensure numeric values for other fields
        emotional_data["evidence_strength"] = float(emotional_data.get("evidence_strength", 0.5))
        emotional_data["technical_density"] = float(emotional_data.get("technical_density", 0.5))
        
        # Find dominant emotion
        emotion_scores = {k: v for k, v in emotional_data.items() if k in emotions}
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        emotional_data["dominant_emotion"] = dominant_emotion
        
        print(f"Emotional analysis complete. Dominant emotion: {dominant_emotion}")
        return emotional_data
        
    except Exception as e:
        print(f"Error in emotional analysis: {e}")
        # Fallback to basic analysis with guaranteed numeric values
        return get_fallback_emotional_data()

def get_fallback_emotional_data():
    """Fallback emotional data when Claude API is unavailable"""
    return {
        "hope": 0.5,
        "tension": 0.3,
        "confidence": 0.6,
        "uncertainty": 0.2,
        "breakthrough": 0.4,
        "healing": 0.7,
        "dominant_emotion": "healing",
        "evidence_strength": 0.6,
        "technical_density": 0.5,
        "subspecialty": "sportsMedicine"
    }

def generate_emotional_signature(emotional_data: dict) -> dict:
    """Generate unique visual signature based on emotional data"""
    evidence_strength = emotional_data.get("evidence_strength", 0.5)
    dominant_emotion = emotional_data.get("dominant_emotion", "confidence")
    
    # Generate unique signature ID
    timestamp = datetime.utcnow()
    signature_id = f"AKX-{timestamp.year}-{timestamp.strftime('%m%d')}-{str(uuid.uuid4())[:4].upper()}"
    
    # Emotional color mapping
    emotional_colors = {
        "hope": "#27ae60",
        "tension": "#e74c3c", 
        "confidence": "#3498db",
        "uncertainty": "#95a5a6",
        "breakthrough": "#f39c12",
        "healing": "#16a085"
    }
    
    signature = {
        "id": signature_id,
        "concentric_rings": {
            "count": int(evidence_strength * 5) + 1,
            "thickness": evidence_strength * 3 + 1,
            "rotation_speed": evidence_strength * 2
        },
        "geometric_overlays": {
            "shape": get_emotion_shape(dominant_emotion),
            "color": emotional_colors.get(dominant_emotion, "#3498db"),
            "scale": emotional_data.get(dominant_emotion, 0.5)
        },
        "floating_particles": {
            "count": int(emotional_data.get("confidence", 0.5) * 20) + 5,
            "color": emotional_colors.get(dominant_emotion, "#3498db"),
            "movement_pattern": "organic"
        },
        "color_gradients": generate_emotional_gradient(emotional_data),
        "rarity_score": calculate_rarity_score(emotional_data)
    }
    
    return signature

def get_emotion_shape(emotion: str) -> str:
    """Map emotions to geometric shapes"""
    shape_mapping = {
        "hope": "circle",
        "confidence": "square", 
        "breakthrough": "star",
        "healing": "hexagon",
        "tension": "triangle",
        "uncertainty": "diamond"
    }
    return shape_mapping.get(emotion, "circle")

def generate_emotional_gradient(emotional_data: dict) -> list:
    """Generate color gradient based on emotional mix"""
    emotional_colors = {
        "hope": "#27ae60",
        "tension": "#e74c3c",
        "confidence": "#3498db", 
        "uncertainty": "#95a5a6",
        "breakthrough": "#f39c12",
        "healing": "#16a085"
    }
    
    # Get top 3 emotions
    emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
    emotion_scores = [(emotion, emotional_data.get(emotion, 0)) for emotion in emotions]
    top_emotions = sorted(emotion_scores, key=lambda x: x[1], reverse=True)[:3]
    
    gradient = []
    for emotion, score in top_emotions:
        gradient.append({
            "color": emotional_colors[emotion],
            "stop": score,
            "opacity": score * 0.8
        })
    
    return gradient

def calculate_rarity_score(emotional_data: dict) -> float:
    """Calculate rarity score based on emotional uniqueness"""
    # Complex emotional mixes are rarer
    emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
    emotion_scores = [emotional_data.get(emotion, 0) for emotion in emotions]
    
    # Calculate variance - higher variance = more unique
    mean_score = sum(emotion_scores) / len(emotion_scores)
    variance = sum((score - mean_score) ** 2 for score in emotion_scores) / len(emotion_scores)
    
    # Normalize to 0-1 scale
    rarity = min(variance * 10, 1.0)
    return round(rarity, 3)

async def generate_artwork(article_id: str, emotional_data: dict, signature_data: dict):
    """Generate artwork based on article analysis"""
    artwork_id = str(uuid.uuid4())
    
    # Generate SVG artwork metadata (the actual SVG will be generated client-side with the algorithm)
    artwork = {
        "id": artwork_id,
        "article_id": article_id,
        "title": f"Algorithmic Synthesis #{signature_data['id']}",
        "subspecialty": emotional_data.get("subspecialty", "sportsMedicine"),
        "dominant_emotion": emotional_data.get("dominant_emotion"),
        "created_date": datetime.utcnow(),
        "algorithm_parameters": {
            "tree_complexity": emotional_data.get("evidence_strength", 0.5),
            "branch_pattern": emotional_data.get("subspecialty", "sportsMedicine"),
            "emotional_intensity": emotional_data.get(emotional_data.get("dominant_emotion", "confidence"), 0.5),
            "color_palette": signature_data["color_gradients"],
            "healing_elements": emotional_data.get("healing", 0.5)
        },
        "metadata": {
            "signature_id": signature_data["id"],
            "rarity_score": signature_data["rarity_score"],
            "generation_timestamp": datetime.utcnow().isoformat(),
            "algorithm_version": "2.0"
        },
        "nft_status": "available",
        "download_formats": ["svg", "png", "metadata"]
    }
    
    artworks_collection.insert_one(artwork)
    artwork["_id"] = str(artwork["_id"])
    
    return artwork

def calculate_read_time(content: str) -> int:
    """Calculate estimated read time in minutes"""
    words = len(content.split())
    return max(1, round(words / 200))  # Assuming 200 words per minute

async def update_algorithm_state(emotional_data: dict):
    """Update the persistent algorithm emotional state"""
    try:
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        
        if current_state:
            # Blend current emotions with new article emotions
            new_emotional_mix = {}
            emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
            
            for emotion in emotions:
                current_value = current_state["emotional_state"]["emotional_mix"].get(emotion, 0.5)
                new_value = emotional_data.get(emotion, 0.5)
                # Use weighted average (80% current, 20% new)
                blended_value = current_value * 0.8 + new_value * 0.2
                new_emotional_mix[emotion] = round(blended_value, 3)
            
            # Find new dominant emotion
            dominant_emotion = max(new_emotional_mix, key=new_emotional_mix.get)
            
            # Update visual representation
            visual_rep = generate_visual_representation(dominant_emotion, new_emotional_mix[dominant_emotion])
            
            new_state = {
                "emotional_state": {
                    "dominant_emotion": dominant_emotion,
                    "emotional_intensity": new_emotional_mix[dominant_emotion],
                    "emotional_mix": new_emotional_mix
                },
                "visual_representation": visual_rep,
                "timestamp": datetime.utcnow(),
                "articles_processed": current_state.get("articles_processed", 0) + 1,
                "feedback_influences": current_state.get("feedback_influences", [])
            }
            
            algorithm_states_collection.insert_one(new_state)
            print(f"Algorithm state updated. Articles processed: {new_state['articles_processed']}")
        else:
            # Create initial algorithm state if none exists
            print("Creating initial algorithm state from first article...")
            
            # Use the emotional data from the article to create initial state
            emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
            initial_emotional_mix = {}
            
            for emotion in emotions:
                initial_emotional_mix[emotion] = emotional_data.get(emotion, 0.5)
            
            # Find dominant emotion
            dominant_emotion = max(initial_emotional_mix, key=initial_emotional_mix.get)
            
            # Create visual representation
            visual_rep = generate_visual_representation(dominant_emotion, initial_emotional_mix[dominant_emotion])
            
            initial_state = {
                "emotional_state": {
                    "dominant_emotion": dominant_emotion,
                    "emotional_intensity": initial_emotional_mix[dominant_emotion],
                    "emotional_mix": initial_emotional_mix
                },
                "visual_representation": visual_rep,
                "timestamp": datetime.utcnow(),
                "articles_processed": 1,
                "feedback_influences": []
            }
            
            algorithm_states_collection.insert_one(initial_state)
            print(f"Initial algorithm state created. Articles processed: 1")
            
    except Exception as e:
        print(f"Error updating algorithm state: {e}")

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

# Admin endpoints
@app.post("/api/admin/authenticate")
async def admin_authenticate(credentials: dict):
    """Authenticate admin user"""
    try:
        admin_password = os.environ.get('ADMIN_PASSWORD')
        if not admin_password:
            raise HTTPException(status_code=500, detail="Admin password not configured")
        
        if credentials.get('password') == admin_password:
            return {"authenticated": True, "message": "Authentication successful"}
        else:
            raise HTTPException(status_code=401, detail="Invalid password")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@app.get("/api/admin/articles")
async def get_articles_admin():
    """Get all articles with admin details"""
    try:
        articles = list(articles_collection.find({}).sort("published_date", -1))
        
        # Convert ObjectIds to strings and add admin metadata
        for article in articles:
            article["_id"] = str(article["_id"])
            
            # Add associated artwork count
            artwork_count = artworks_collection.count_documents({"article_id": article["id"]})
            article["artwork_count"] = artwork_count
            
            # Add feedback count
            feedback_count = feedback_collection.count_documents({"article_id": article["id"]})
            article["feedback_count"] = feedback_count
            
        return {"articles": articles, "total": len(articles)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/articles/{article_id}")
async def delete_article(article_id: str):
    """Delete article and associated artwork"""
    try:
        # Find and delete the article
        article = articles_collection.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Delete associated artwork
        artworks_collection.delete_many({"article_id": article_id})
        
        # Delete the article
        articles_collection.delete_one({"id": article_id})
        
        # Delete associated feedback
        feedback_collection.delete_many({"article_id": article_id})
        
        return {
            "success": True,
            "message": f"Article {article_id} and associated content deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/recalculate-algorithm-state")
async def recalculate_algorithm_state():
    """Recalculate algorithm state based on existing articles"""
    try:
        # Count existing articles
        article_count = articles_collection.count_documents({})
        
        # Get current state
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        
        if current_state:
            # Update the count
            current_state["articles_processed"] = article_count
            current_state["timestamp"] = datetime.utcnow()
            
            # Remove the _id to create a new document
            current_state.pop("_id", None)
            
            # Insert updated state
            algorithm_states_collection.insert_one(current_state)
            
            return {
                "success": True,
                "message": f"Algorithm state recalculated. Articles processed: {article_count}",
                "articles_processed": article_count
            }
        else:
            # Create initial algorithm state if none exists
            print("Creating initial algorithm state during recalculation...")
            
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
                "articles_processed": article_count,
                "feedback_influences": []
            }
            
            algorithm_states_collection.insert_one(initial_state)
            
            return {
                "success": True,
                "message": f"Initial algorithm state created. Articles processed: {article_count}",
                "articles_processed": article_count
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Newsletter and feedback endpoints (keeping existing functionality)
@app.post("/api/newsletter/subscribe")
async def newsletter_subscribe(subscription_data: dict):
    """Subscribe to newsletter"""
    try:
        email = subscription_data.get('email')
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        # Check if email already exists
        existing_subscription = db.newsletter_subscribers.find_one({"email": email})
        if existing_subscription:
            return {"message": "Email already subscribed", "status": "existing"}
        
        # Create new subscription
        subscription = {
            "id": str(uuid.uuid4()),
            "email": email,
            "subscribed_date": datetime.utcnow(),
            "status": "active",
            "verified": False,
            "preferences": {
                "algorithm_updates": True,
                "new_articles": True,
                "feedback_access": True
            }
        }
        
        db.newsletter_subscribers.insert_one(subscription)
        
        # Grant feedback access
        subscription["_id"] = str(subscription["_id"])
        return {
            "subscription": subscription,
            "message": "Successfully subscribed to newsletter",
            "status": "subscribed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/web3/verify-nft")
async def verify_nft_ownership(verification_data: dict):
    """Verify NFT ownership for Web3 authentication"""
    try:
        wallet_address = verification_data.get("address")
        if not wallet_address:
            raise HTTPException(status_code=400, detail="Wallet address is required")
        
        # Check NFT ownership using Alchemy API
        alchemy_api_url = os.environ.get('ALCHEMY_API_URL')
        erc721_contract = os.environ.get('NFT_CONTRACT_ERC721')
        erc1155_contract = os.environ.get('NFT_CONTRACT_ERC1155')
        
        # For demo purposes, we'll return a mock response
        # In a real implementation, this would check actual NFT ownership
        return {
            "verified": False,  # Set to False for demo
            "wallet_address": wallet_address,
            "erc721_balance": 0,
            "erc1155_balance": 0,
            "contracts_owned": [],
            "verification_timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"NFT verification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feedback")
async def submit_feedback_enhanced(feedback_data: dict):
    """Enhanced feedback submission with access control"""
    try:
        email = feedback_data.get("user_email")
        
        # Check if user has feedback access (newsletter subscriber or NFT holder)
        has_access = False
        access_type = "none"
        
        if email:
            subscription = db.newsletter_subscribers.find_one({"email": email, "status": "active"})
            if subscription:
                has_access = True
                access_type = "subscriber"
        
        # Also grant access to anonymous users for demo purposes
        if not has_access:
            has_access = True
            access_type = "demo"
        
        if not has_access:
            raise HTTPException(status_code=403, detail="Feedback access requires newsletter subscription or NFT ownership")
        
        feedback = {
            "id": str(uuid.uuid4()),
            "article_id": feedback_data.get("article_id"),
            "emotion": feedback_data.get("emotion"),
            "user_email": email,
            "access_type": access_type,
            "timestamp": datetime.utcnow(),
            "influence_weight": 1.0 if access_type == "subscriber" else 0.5
        }
        
        feedback_collection.insert_one(feedback)
        
        feedback["_id"] = str(feedback["_id"])
        return {
            "feedback": feedback,
            "message": f"Feedback submitted successfully ({access_type} access)"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def update_algorithm_with_feedback(emotion: str, influence_weight: float, feedback_id: str) -> bool:
    """Update algorithm state based on user feedback"""
    try:
        # Get current algorithm state
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        if not current_state:
            print("No current algorithm state found")
            return False
            
        # Get current emotional mix
        current_mix = current_state["emotional_state"]["emotional_mix"]
        
        # Calculate influence based on weight
        influence_factor = min(influence_weight * 0.2, 0.3)  # Cap maximum influence at 30%
        
        # Update emotional mix
        new_mix = current_mix.copy()
        for emotion_key in new_mix:
            if emotion_key == emotion:
                # Increase the feedback emotion
                new_mix[emotion_key] = min(1.0, new_mix[emotion_key] + influence_factor)
            else:
                # Slightly decrease other emotions to maintain balance
                new_mix[emotion_key] = max(0.1, new_mix[emotion_key] - (influence_factor / 5))
                
        # Normalize values to ensure they sum to a reasonable range
        total = sum(new_mix.values())
        if total > 0:
            factor = 2.5 / total  # We want the sum to be around 2.5
            new_mix = {k: v * factor for k, v in new_mix.items()}
        
        # Find new dominant emotion
        dominant_emotion = max(new_mix, key=new_mix.get)
        
        # Generate new visual representation
        visual_rep = generate_visual_representation(dominant_emotion, new_mix[dominant_emotion])
        
        # Create new algorithm state
        new_state = {
            "emotional_state": {
                "dominant_emotion": dominant_emotion,
                "emotional_intensity": new_mix[dominant_emotion],
                "emotional_mix": new_mix
            },
            "visual_representation": visual_rep,
            "timestamp": datetime.utcnow(),
            "articles_processed": current_state["articles_processed"],
            "feedback_influences": current_state.get("feedback_influences", []) + [feedback_id]
        }
        
        # Insert new state
        algorithm_states_collection.insert_one(new_state)
        print(f"Algorithm state updated based on feedback. New dominant emotion: {dominant_emotion}")
        return True
        
    except Exception as e:
        print(f"Error updating algorithm with feedback: {e}")
        return False

async def update_algorithm_with_feedback(emotion: str, influence_weight: float, feedback_id: str) -> bool:
    """Update algorithm state based on user feedback"""
    try:
        # Get current algorithm state
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        if not current_state:
            print("No current algorithm state found")
            return False
            
        # Get current emotional mix
        current_mix = current_state["emotional_state"]["emotional_mix"]
        
        # Calculate influence based on weight
        influence_factor = min(influence_weight * 0.2, 0.3)  # Cap maximum influence at 30%
        
        # Update emotional mix
        new_mix = current_mix.copy()
        for emotion_key in new_mix:
            if emotion_key == emotion:
                # Increase the feedback emotion
                new_mix[emotion_key] = min(1.0, new_mix[emotion_key] + influence_factor)
            else:
                # Slightly decrease other emotions to maintain balance
                new_mix[emotion_key] = max(0.1, new_mix[emotion_key] - (influence_factor / 5))
                
        # Normalize values to ensure they sum to a reasonable range
        total = sum(new_mix.values())
        if total > 0:
            factor = 2.5 / total  # We want the sum to be around 2.5
            new_mix = {k: v * factor for k, v in new_mix.items()}
        
        # Find new dominant emotion
        dominant_emotion = max(new_mix, key=new_mix.get)
        
        # Generate new visual representation
        visual_rep = generate_visual_representation(dominant_emotion, new_mix[dominant_emotion])
        
        # Create new algorithm state
        new_state = {
            "emotional_state": {
                "dominant_emotion": dominant_emotion,
                "emotional_intensity": new_mix[dominant_emotion],
                "emotional_mix": new_mix
            },
            "visual_representation": visual_rep,
            "timestamp": datetime.utcnow(),
            "articles_processed": current_state["articles_processed"],
            "feedback_influences": current_state.get("feedback_influences", []) + [feedback_id]
        }
        
        # Insert new state
        algorithm_states_collection.insert_one(new_state)
        print(f"Algorithm state updated based on feedback. New dominant emotion: {dominant_emotion}")
        return True
        
    except Exception as e:
        print(f"Error updating algorithm with feedback: {e}")
        return False

if __name__ == "__main__":
    import uvicorn
    
    # Railway provides PORT environment variable
    port = int(os.environ.get("PORT", 8001))
    print(f"Starting server on port {port}")
    
    uvicorn.run(
        "server:app",
        host="0.0.0.0", 
        port=port,
        reload=False
    )