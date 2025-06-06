from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import uuid
from typing import List, Dict, Optional
import anthropic

# Load environment variables
load_dotenv()

app = FastAPI(title="Arthrokinetix API")

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

# Anthropic client for supplementary AI analysis
anthropic_client = anthropic.Anthropic(
    api_key=os.environ.get('CLAUDE_API_KEY')
)

# Collections
articles_collection = db.articles
artworks_collection = db.artworks
users_collection = db.users
feedback_collection = db.feedback
algorithm_states_collection = db.algorithm_states

@app.get("/")
async def root():
    return {"message": "Arthrokinetix API - Emotional Medical Research & Art Generation"}

# Algorithm state management
@app.get("/api/algorithm-state")
async def get_algorithm_state():
    """Get current emotional state of the algorithm"""
    try:
        # Get latest state or create default
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
                "feedback_influences": []
            }
            
            algorithm_states_collection.insert_one(initial_state)
            latest_state = initial_state
        
        # Convert ObjectId to string for JSON serialization
        latest_state["_id"] = str(latest_state["_id"])
        return latest_state
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/articles")
async def create_article(article_data: dict):
    """Create new article and generate emotional signature"""
    try:
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Process article with Arthrokinetix algorithm (simulated)
        emotional_data = await process_article_emotions(article_data.get("content", ""))
        signature_data = generate_emotional_signature(emotional_data)
        
        article = {
            "id": article_id,
            "title": article_data.get("title"),
            "content": article_data.get("content"),
            "subspecialty": article_data.get("subspecialty", "sportsMedicine"),
            "published_date": datetime.utcnow(),
            "emotional_data": emotional_data,
            "signature_data": signature_data,
            "evidence_strength": emotional_data.get("evidence_strength", 0.5),
            "read_time": calculate_read_time(article_data.get("content", ""))
        }
        
        articles_collection.insert_one(article)
        
        # Generate corresponding artwork
        artwork = await generate_artwork(article_id, emotional_data, signature_data)
        
        # Update algorithm state
        await update_algorithm_state(emotional_data)
        
        article["_id"] = str(article["_id"])
        return {"article": article, "artwork": artwork}
        
    except Exception as e:
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

@app.post("/api/feedback")
async def submit_feedback(feedback_data: dict):
    """Submit emotional feedback for an article"""
    try:
        feedback = {
            "id": str(uuid.uuid4()),
            "article_id": feedback_data.get("article_id"),
            "emotion": feedback_data.get("emotion"),
            "user_id": feedback_data.get("user_id"),
            "timestamp": datetime.utcnow(),
            "influence_weight": 1.0  # Base weight, can be adjusted based on user type
        }
        
        feedback_collection.insert_one(feedback)
        
        # Update algorithm state based on feedback
        await process_feedback_influence(feedback)
        
        feedback["_id"] = str(feedback["_id"])
        return feedback
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
async def process_article_emotions(content: str) -> dict:
    """Process article content for emotional analysis using Claude as supplement"""
    try:
        # Use Claude for sophisticated emotional analysis
        message = anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": f"""Analyze this medical research text for emotional undertones and return a JSON response:

{content[:2000]}  # Limit content length

Please analyze for these emotions and return scores 0-1:
- hope (recovery potential, positive outcomes)
- tension (complications, risks, challenges)
- confidence (evidence strength, certainty)
- uncertainty (ambiguous results, need for more research)
- breakthrough (innovation, novel approaches)
- healing (therapeutic potential, restoration)

Also assess:
- evidence_strength (0-1)
- technical_density (0-1)
- subspecialty (sportsMedicine, jointReplacement, trauma, spine, handUpperExtremity, footAnkle)

Return only valid JSON."""
            }]
        )
        
        response_text = message.content[0].text
        emotional_data = json.loads(response_text)
        
        # Ensure we have all required fields
        emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
        for emotion in emotions:
            if emotion not in emotional_data:
                emotional_data[emotion] = 0.5
                
        # Find dominant emotion
        emotion_scores = {k: v for k, v in emotional_data.items() if k in emotions}
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        emotional_data["dominant_emotion"] = dominant_emotion
        
        return emotional_data
        
    except Exception as e:
        print(f"Error in emotional analysis: {e}")
        # Fallback to basic analysis
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

async def process_feedback_influence(feedback: dict):
    """Process user feedback to influence algorithm state"""
    try:
        # Weight feedback based on user type (for now, all equal)
        influence_weight = feedback.get("influence_weight", 1.0)
        
        # Update algorithm state slightly based on feedback
        current_state = algorithm_states_collection.find_one({}, sort=[("timestamp", -1)])
        
        if current_state:
            feedback_emotion = feedback["emotion"]
            current_mix = current_state["emotional_state"]["emotional_mix"]
            
            # Slight adjustment based on feedback
            if feedback_emotion in current_mix:
                adjustment = influence_weight * 0.05  # Small adjustment
                current_mix[feedback_emotion] = min(1.0, current_mix[feedback_emotion] + adjustment)
                
                # Create new state with feedback influence
                new_state = current_state.copy()
                new_state["emotional_state"]["emotional_mix"] = current_mix
                new_state["timestamp"] = datetime.utcnow()
                new_state["feedback_influences"].append({
                    "feedback_id": feedback["id"],
                    "emotion": feedback_emotion,
                    "weight": influence_weight,
                    "timestamp": datetime.utcnow()
                })
                
                algorithm_states_collection.insert_one(new_state)
                
    except Exception as e:
        print(f"Error processing feedback influence: {e}")

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
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Only catch unexpected exceptions
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@app.post("/api/admin/infographics")
async def create_infographic(infographic_data: dict):
    """Create new infographic"""
    try:
        infographic = {
            "id": str(uuid.uuid4()),
            "title": infographic_data.get("title"),
            "html_content": infographic_data.get("htmlContent"),
            "linked_article_id": infographic_data.get("linkedArticleId"),
            "created_date": datetime.utcnow(),
            "status": "active"
        }
        
        # Store in database (you can create an infographics collection)
        # For now, we'll just return success
        
        return {"infographic": infographic}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/artworks")
async def upload_artwork():
    """Upload SVG artwork with metadata"""
    try:
        # Handle file upload and metadata parsing
        # This would need proper file handling in a real implementation
        
        artwork = {
            "id": str(uuid.uuid4()),
            "title": "Manual Upload",
            "file_type": "svg",
            "uploaded_date": datetime.utcnow(),
            "status": "uploaded"
        }
        
        return {"artwork": artwork}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Newsletter Management
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
            "verified": False,  # In production, send verification email
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

@app.get("/api/newsletter/status/{email}")
async def get_newsletter_status(email: str):
    """Check newsletter subscription status"""
    try:
        subscription = db.newsletter_subscribers.find_one({"email": email})
        if subscription:
            subscription["_id"] = str(subscription["_id"])
            return {"subscribed": True, "subscription": subscription}
        else:
            return {"subscribed": False}
            
    except Exception as e:
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
        
        # TODO: Add NFT verification here
        # For now, also grant access to anonymous users for demo purposes
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
        
        # Update algorithm state based on feedback
        await process_feedback_influence(feedback)
        
        feedback["_id"] = str(feedback["_id"])
        return {
            "feedback": feedback,
            "message": f"Feedback submitted successfully ({access_type} access)"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
