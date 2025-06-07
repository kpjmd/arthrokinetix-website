"""
Enhanced Arthrokinetix Server with Modular Architecture
Proper separation between Claude AI and Arthrokinetix Algorithm
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import uuid
from typing import List, Dict, Optional
import sys
sys.path.append('/app/backend')

try:
    from services.claude_analysis import ClaudeAnalysisService
    from services.arthrokinetix_engine import ArthrokinetixEngine
    SERVICES_AVAILABLE = True
except ImportError as e:
    print(f"Service import error: {e}")
    SERVICES_AVAILABLE = False

# Load environment variables
load_dotenv()

app = FastAPI(title="Arthrokinetix API - Enhanced", version="2.1")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = MongoClient(mongo_url)
db = client.arthrokinetix

# Initialize services
claude_service = ClaudeAnalysisService(db)
arthrokinetix_engine = ArthrokinetixEngine(db)

# Collections
articles_collection = db.articles
artworks_collection = db.artworks
users_collection = db.users
feedback_collection = db.feedback
algorithm_states_collection = db.algorithm_states

@app.get("/")
async def root():
    return {
        "message": "Arthrokinetix API - Enhanced Architecture",
        "version": "2.1",
        "services": {
            "claude_analysis": "available",
            "arthrokinetix_engine": "operational"
        }
    }

# =============================================================================
# CLAUDE AI EMOTIONAL ANALYSIS ENDPOINTS
# =============================================================================

@app.post("/api/analysis/emotional")
async def analyze_emotional_content(analysis_request: dict):
    """
    Perform emotional analysis using Claude AI with fallback
    Separated from Arthrokinetix algorithm
    """
    try:
        content = analysis_request.get("content")
        metadata = analysis_request.get("metadata", {})
        
        if not content:
            raise HTTPException(status_code=400, detail="Content is required")
        
        # Perform Claude AI analysis
        analysis_result = claude_service.analyze_medical_content(content, metadata)
        
        return {
            "analysis": analysis_result,
            "service": "claude_analysis",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.get("/api/analysis/stats")
async def get_analysis_stats():
    """Get Claude analysis service statistics"""
    try:
        stats = claude_service.get_analysis_stats()
        return {"analysis_stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/analysis/cache")
async def clear_analysis_cache():
    """Clear Claude analysis cache (admin function)"""
    try:
        result = db.analysis_cache.delete_many({})
        return {
            "message": f"Cleared {result.deleted_count} cached analyses",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# ARTHROKINETIX ALGORITHM ENDPOINTS
# =============================================================================

@app.post("/api/algorithm/signature")
async def generate_emotional_signature(signature_request: dict):
    """
    Generate emotional signature using Arthrokinetix proprietary algorithm
    """
    try:
        emotional_data = signature_request.get("emotional_data")
        article_metadata = signature_request.get("article_metadata", {})
        
        if not emotional_data:
            raise HTTPException(status_code=400, detail="Emotional data is required")
        
        # Generate signature using Arthrokinetix engine
        signature = arthrokinetix_engine.generate_emotional_signature(
            emotional_data, 
            article_metadata
        )
        
        return {
            "signature": signature,
            "engine": "arthrokinetix",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signature generation error: {str(e)}")

@app.post("/api/algorithm/artwork")
async def generate_artwork(artwork_request: dict):
    """
    Generate Andry Tree artwork using Arthrokinetix algorithm
    """
    try:
        signature_data = artwork_request.get("signature_data")
        emotional_data = artwork_request.get("emotional_data")
        
        if not signature_data or not emotional_data:
            raise HTTPException(status_code=400, detail="Both signature and emotional data required")
        
        # Generate artwork
        artwork = arthrokinetix_engine.generate_andry_tree_artwork(
            signature_data,
            emotional_data
        )
        
        return {
            "artwork": artwork,
            "engine": "arthrokinetix",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Artwork generation error: {str(e)}")

@app.get("/api/algorithm/state")
async def get_algorithm_state():
    """Get current Arthrokinetix algorithm state"""
    try:
        # Get latest algorithm state
        latest_state = algorithm_states_collection.find_one(
            {}, sort=[("timestamp", -1)]
        )
        
        if not latest_state:
            # Create initial state
            initial_state = {
                "emotional_state": {
                    "dominant_emotion": "confidence",
                    "emotional_intensity": 0.6,
                    "emotional_mix": {
                        "hope": 0.4,
                        "confidence": 0.6,
                        "healing": 0.3,
                        "innovation": 0.2
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
                "feedback_influences": [],
                "algorithm_version": arthrokinetix_engine.VERSION
            }
            
            algorithm_states_collection.insert_one(initial_state)
            latest_state = initial_state
        
        # Convert ObjectId to string for JSON serialization
        latest_state["_id"] = str(latest_state["_id"])
        
        return latest_state
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/algorithm/stats")
async def get_algorithm_stats():
    """Get Arthrokinetix engine statistics"""
    try:
        stats = arthrokinetix_engine.get_engine_stats()
        return {"algorithm_stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# ARTICLES ENDPOINTS (Enhanced)
# =============================================================================

@app.post("/api/articles")
async def create_article_enhanced(article_data: dict):
    """Enhanced article creation with modular processing"""
    try:
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Step 1: Claude AI emotional analysis
        content = article_data.get("content", "")
        article_metadata = {
            "subspecialty": article_data.get("subspecialty", "general"),
            "evidence_strength": article_data.get("evidence_strength", 0.5),
            "citations": article_data.get("research_citations", 0)
        }
        
        emotional_data = claude_service.analyze_medical_content(content, article_metadata)
        
        # Step 2: Arthrokinetix signature generation
        signature_data = arthrokinetix_engine.generate_emotional_signature(
            emotional_data, 
            article_metadata
        )
        
        # Step 3: Arthrokinetix artwork generation
        artwork_data = arthrokinetix_engine.generate_andry_tree_artwork(
            signature_data,
            emotional_data
        )
        
        # Step 4: Create article record
        article = {
            "id": article_id,
            "title": article_data.get("title"),
            "content": content,
            "subspecialty": article_data.get("subspecialty", "general"),
            "published_date": datetime.utcnow(),
            "evidence_strength": article_data.get("evidence_strength", 0.5),
            "research_citations": article_data.get("research_citations", 0),
            "meta_description": article_data.get("meta_description", ""),
            
            # Analysis results
            "emotional_data": emotional_data,
            "signature_data": signature_data,
            "artwork_id": artwork_data["id"],
            
            # Metadata
            "read_time": calculate_read_time(content),
            "processing_pipeline": {
                "claude_analysis": emotional_data.get("analysis_source"),
                "arthrokinetix_signature": signature_data["algorithm_version"],
                "artwork_generation": artwork_data["algorithm_version"]
            }
        }
        
        articles_collection.insert_one(article)
        
        # Update algorithm state
        await update_algorithm_state(emotional_data)
        
        # Convert ObjectId to string for JSON serialization
        if "_id" in article:
            article["_id"] = str(article["_id"])
        
        return {
            "article": article,
            "signature": signature_data,
            "artwork": artwork_data,
            "processing_info": {
                "claude_source": emotional_data.get("analysis_source"),
                "arthrokinetix_version": arthrokinetix_engine.VERSION
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Article creation error: {str(e)}")

@app.get("/api/articles")
async def get_articles_enhanced(
    subspecialty: Optional[str] = None,
    emotion: Optional[str] = None,
    min_rarity: Optional[float] = None,
    limit: Optional[int] = 20
):
    """Enhanced article retrieval with filtering"""
    try:
        query = {}
        if subspecialty:
            query["subspecialty"] = subspecialty
        if emotion:
            query["emotional_data.dominant_emotion"] = emotion
        if min_rarity:
            query["signature_data.rarity_score"] = {"$gte": min_rarity}
            
        articles = list(articles_collection.find(query).sort("published_date", -1).limit(limit))
        
        # Convert ObjectIds to strings
        for article in articles:
            article["_id"] = str(article["_id"])
            
        return {
            "articles": articles,
            "count": len(articles),
            "filters_applied": {
                "subspecialty": subspecialty,
                "emotion": emotion,
                "min_rarity": min_rarity
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/articles/{article_id}")
async def get_article_enhanced(article_id: str):
    """Get enhanced article with full processing information"""
    try:
        article = articles_collection.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
            
        article["_id"] = str(article["_id"])
        
        # Get associated artwork
        artwork = artworks_collection.find_one({"id": article.get("artwork_id")})
        if artwork:
            artwork["_id"] = str(artwork["_id"])
            article["artwork"] = artwork
        
        return article
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# ARTWORK ENDPOINTS (Enhanced)
# =============================================================================

@app.get("/api/artworks")
async def get_artworks_enhanced(
    subspecialty: Optional[str] = None,
    emotion: Optional[str] = None,
    min_rarity: Optional[float] = None,
    limit: Optional[int] = 20
):
    """Enhanced artwork retrieval"""
    try:
        # Get artworks from Arthrokinetix engine collection
        query = {}
        if subspecialty:
            query["tree_parameters.complexity_factors.subspecialty"] = subspecialty
        if emotion:
            query["dominant_emotion"] = emotion
        if min_rarity:
            query["rarity_score"] = {"$gte": min_rarity}
            
        artworks = list(arthrokinetix_engine.artworks_collection.find(query).sort("created_date", -1).limit(limit))
        
        # Convert ObjectIds to strings
        for artwork in artworks:
            artwork["_id"] = str(artwork["_id"])
            
        return {
            "artworks": artworks,
            "count": len(artworks),
            "engine_version": arthrokinetix_engine.VERSION
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/artworks/{artwork_id}")
async def get_artwork_enhanced(artwork_id: str):
    """Get enhanced artwork with generation parameters"""
    try:
        artwork = arthrokinetix_engine.artworks_collection.find_one({"id": artwork_id})
        if not artwork:
            raise HTTPException(status_code=404, detail="Artwork not found")
            
        artwork["_id"] = str(artwork["_id"])
        
        # Get associated signature
        signature = arthrokinetix_engine.signatures_collection.find_one({"id": artwork.get("signature_id")})
        if signature:
            signature["_id"] = str(signature["_id"])
            artwork["signature"] = signature
        
        return artwork
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# FEEDBACK ENDPOINTS (Enhanced)
# =============================================================================

@app.post("/api/feedback")
async def submit_feedback_enhanced(feedback_data: dict):
    """Enhanced feedback with algorithm influence tracking"""
    try:
        email = feedback_data.get("user_email")
        
        # Check access permissions
        has_access = False
        access_type = "none"
        influence_weight = 0.5
        
        if email:
            subscription = db.newsletter_subscribers.find_one({"email": email, "status": "active"})
            if subscription:
                has_access = True
                access_type = "subscriber"
                influence_weight = 1.0
        
        # TODO: Add NFT verification here
        
        # Demo access
        if not has_access:
            has_access = True
            access_type = "demo"
            influence_weight = 0.3
        
        if not has_access:
            raise HTTPException(status_code=403, detail="Feedback access requires subscription or NFT ownership")
        
        feedback = {
            "id": str(uuid.uuid4()),
            "article_id": feedback_data.get("article_id"),
            "emotion": feedback_data.get("emotion"),
            "user_email": email,
            "access_type": access_type,
            "influence_weight": influence_weight,
            "timestamp": datetime.utcnow(),
            "algorithm_version": arthrokinetix_engine.VERSION
        }
        
        feedback_collection.insert_one(feedback)
        
        # Update algorithm state with feedback influence
        await process_feedback_influence_enhanced(feedback)
        
        feedback["_id"] = str(feedback["_id"])
        return {
            "feedback": feedback,
            "influence_applied": True,
            "access_type": access_type,
            "influence_weight": influence_weight
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/feedback/influence/{article_id}")
async def get_feedback_influence(article_id: str):
    """Get feedback influence statistics for an article"""
    try:
        feedback_list = list(feedback_collection.find({"article_id": article_id}))
        
        # Calculate influence statistics
        total_feedback = len(feedback_list)
        emotion_distribution = {}
        total_influence = 0
        
        for feedback in feedback_list:
            emotion = feedback["emotion"]
            weight = feedback.get("influence_weight", 0.5)
            
            emotion_distribution[emotion] = emotion_distribution.get(emotion, 0) + weight
            total_influence += weight
        
        return {
            "article_id": article_id,
            "total_feedback_count": total_feedback,
            "total_influence_weight": total_influence,
            "emotion_distribution": emotion_distribution,
            "average_influence": total_influence / max(total_feedback, 1)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =============================================================================
# ADMIN ENDPOINTS (Enhanced)
# =============================================================================

@app.post("/api/admin/authenticate")
async def admin_authenticate(credentials: dict):
    """Admin authentication"""
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

@app.get("/api/admin/system-stats")
async def get_system_stats():
    """Get comprehensive system statistics"""
    try:
        # Get service statistics
        claude_stats = claude_service.get_analysis_stats()
        arthrokinetix_stats = arthrokinetix_engine.get_engine_stats()
        
        # Get database statistics
        article_count = articles_collection.count_documents({})
        feedback_count = feedback_collection.count_documents({})
        subscriber_count = db.newsletter_subscribers.count_documents({"status": "active"})
        
        return {
            "system_overview": {
                "total_articles": article_count,
                "total_feedback": feedback_count,
                "active_subscribers": subscriber_count,
                "system_version": "2.1"
            },
            "claude_analysis": claude_stats,
            "arthrokinetix_engine": arthrokinetix_stats,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Newsletter endpoints (unchanged)
@app.post("/api/newsletter/subscribe")
async def newsletter_subscribe(subscription_data: dict):
    """Subscribe to newsletter"""
    try:
        email = subscription_data.get('email')
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        existing_subscription = db.newsletter_subscribers.find_one({"email": email})
        if existing_subscription:
            return {"message": "Email already subscribed", "status": "existing"}
        
        subscription = {
            "id": str(uuid.uuid4()),
            "email": email,
            "subscribed_date": datetime.utcnow(),
            "status": "active",
            "verified": True,  # Auto-verify for demo
            "preferences": {
                "algorithm_updates": True,
                "new_articles": True,
                "feedback_access": True
            }
        }
        
        db.newsletter_subscribers.insert_one(subscription)
        subscription["_id"] = str(subscription["_id"])
        
        return {
            "subscription": subscription,
            "message": "Successfully subscribed to newsletter",
            "status": "subscribed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def calculate_read_time(content: str) -> int:
    """Calculate estimated read time in minutes"""
    words = len(content.split())
    return max(1, round(words / 200))

async def update_algorithm_state(emotional_data: dict):
    """Update algorithm state with new emotional data"""
    try:
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        
        if current_state:
            # Blend emotions with new data
            new_emotional_mix = {}
            emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
            
            for emotion in emotions:
                current_value = current_state["emotional_state"]["emotional_mix"].get(emotion, 0.5)
                new_value = emotional_data.get(emotion, 0.5)
                blended_value = current_value * 0.8 + new_value * 0.2
                new_emotional_mix[emotion] = round(blended_value, 3)
            
            dominant_emotion = max(new_emotional_mix, key=new_emotional_mix.get)
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
                "feedback_influences": current_state.get("feedback_influences", []),
                "algorithm_version": arthrokinetix_engine.VERSION
            }
            
            algorithm_states_collection.insert_one(new_state)
            
    except Exception as e:
        print(f"Error updating algorithm state: {e}")

async def process_feedback_influence_enhanced(feedback: dict):
    """Enhanced feedback processing with tracking"""
    try:
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        
        if current_state:
            feedback_emotion = feedback["emotion"]
            influence_weight = feedback.get("influence_weight", 0.5)
            current_mix = current_state["emotional_state"]["emotional_mix"].copy()
            
            if feedback_emotion in current_mix:
                adjustment = influence_weight * 0.05
                current_mix[feedback_emotion] = min(1.0, current_mix[feedback_emotion] + adjustment)
                
                # Normalize to ensure sum doesn't exceed reasonable bounds
                total = sum(current_mix.values())
                if total > 4.0:  # Reasonable upper bound
                    for emotion in current_mix:
                        current_mix[emotion] = current_mix[emotion] / total * 4.0
                
                new_state = current_state.copy()
                new_state["emotional_state"]["emotional_mix"] = current_mix
                new_state["timestamp"] = datetime.utcnow()
                new_state["feedback_influences"].append({
                    "feedback_id": feedback["id"],
                    "emotion": feedback_emotion,
                    "weight": influence_weight,
                    "access_type": feedback.get("access_type"),
                    "timestamp": datetime.utcnow()
                })
                
                algorithm_states_collection.insert_one(new_state)
                
    except Exception as e:
        print(f"Error processing feedback influence: {e}")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
