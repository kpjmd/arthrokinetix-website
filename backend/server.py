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
import re

# Load environment variables
load_dotenv('/app/backend/.env')

app = FastAPI(title="Arthrokinetix API")

# Get CORS origins from environment variable
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000")
cors_origins = [origin.strip() for origin in cors_origins_env.split(",")]

# Add some debug logging
print(f"🔧 CORS Origins configured: {cors_origins}")

# CORS middleware with environment-based origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Add this after your app definition for debugging
@app.get("/debug/cors")
async def debug_cors():
    return {
        "cors_origins": cors_origins,
        "cors_origins_env": cors_origins_env,
        "admin_password_set": bool(os.getenv("ADMIN_PASSWORD"))
    }

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
    content_type: str = Form("text"),
    content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    evidence_strength: float = Form(0.5),
    meta_description: Optional[str] = Form(None)
):
    """Enhanced article creation with detailed debugging"""
    try:
        print(f"\n🆕 Creating new article: {title}")
        print(f"📁 Content type: {content_type}")
        print(f"🏥 Input subspecialty: {subspecialty}")
        
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Process content based on type
        processed_content = ""
        html_content = ""
        file_data = None
        
        if content_type == "text" and content:
            processed_content = content
            print(f"📝 Text content length: {len(processed_content)} characters")
            
        elif content_type in ["html", "pdf"] and file:
            # Read and store file content
            file_content = await file.read()
            print(f"📂 File uploaded: {file.filename} ({len(file_content)} bytes)")
            
            if content_type == "html":
                # For HTML files, extract content for analysis but keep full HTML for display
                html_content = file_content.decode('utf-8')
                # Extract text content for emotional analysis (strip HTML tags roughly)
                import re
                processed_content = re.sub('<[^<]+?>', '', html_content)
                print(f"🔤 Extracted text length: {len(processed_content)} characters")
                
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
                print(f"📄 PDF stored for future processing")
                
        else:
            raise HTTPException(status_code=400, detail="Invalid content type or missing content/file")
        
        # Show content preview for debugging
        content_preview = processed_content[:500] + "..." if len(processed_content) > 500 else processed_content
        print(f"📖 Content preview:\n{content_preview}")
        
        # Process article with enhanced Arthrokinetix algorithm
        print("\n🧠 Starting emotional analysis...")
        emotional_data = await process_article_emotions(processed_content)
        
        print(f"\n💭 Emotional analysis results:")
        for key, value in emotional_data.items():
            if isinstance(value, (int, float)):
                print(f"   {key}: {value:.3f}")
            else:
                print(f"   {key}: {value}")
        
        print("\n🔮 Generating emotional signature...")
        signature_data = generate_emotional_signature(emotional_data)
        
        # Create article record
        article = {
            "id": article_id,
            "title": title,
            "content_type": content_type,
            "content_source": "file_upload" if file else "text_input",
            "content": processed_content,
            "html_content": html_content if content_type == "html" else None,
            "file_data": file_data,
            "subspecialty": emotional_data.get("subspecialty", subspecialty),  # Use detected subspecialty
            "published_date": datetime.utcnow(),
            "emotional_data": emotional_data,
            "signature_data": signature_data,
            "evidence_strength": evidence_strength,
            "meta_description": meta_description,
            "read_time": calculate_read_time(processed_content)
        }
        
        print(f"\n💾 Saving article to database...")
        articles_collection.insert_one(article)
        
        # Generate corresponding artwork with enhanced algorithm
        print(f"\n🎨 Generating artwork...")
        artwork = await generate_artwork(article_id, emotional_data, signature_data)
        
        # Update algorithm state
        print(f"\n🔄 Updating algorithm state...")
        await update_algorithm_state(emotional_data)
        
        article["_id"] = str(article["_id"])
        
        print(f"\n✅ Article creation complete!")
        print(f"   Article ID: {article_id}")
        print(f"   Final subspecialty: {article['subspecialty']}")
        print(f"   Dominant emotion: {emotional_data.get('dominant_emotion')}")
        print(f"   Evidence strength: {emotional_data.get('evidence_strength', 0):.3f}")
        
        return {"article": article, "artwork": artwork}
        
    except Exception as e:
        print(f"❌ Error creating article: {e}")
        import traceback
        traceback.print_exc()
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

def detect_subspecialty_from_content(content: str) -> str:
    """Enhanced subspecialty detection with better keyword matching"""
    content_lower = content.lower()
    
    # Enhanced keyword sets with more specific terms
    subspecialty_keywords = {
        "jointReplacement": {
            "primary": ["arthroplasty", "replacement", "prosthesis", "implant", "total knee", "total hip", "tha", "tka"],
            "secondary": ["bearing", "polyethylene", "ceramic", "metal", "revision", "loosening", "wear"],
            "weight": 1.0
        },
        "sportsMedicine": {
            "primary": ["sports", "athlete", "acl", "mcl", "pcl", "meniscus", "rotator cuff", "labrum"],
            "secondary": ["return to play", "athletic", "performance", "season", "competition"],
            "weight": 1.0
        },
        "trauma": {
            "primary": ["fracture", "trauma", "fixation", "plating", "nailing", "external fixator"],
            "secondary": ["nonunion", "malunion", "polytrauma", "emergency", "acute"],
            "weight": 1.0
        },
        "spine": {
            "primary": ["spine", "spinal", "vertebra", "disc", "fusion", "laminectomy", "discectomy"],
            "secondary": ["cervical", "lumbar", "thoracic", "stenosis", "spondylosis", "kyphosis"],
            "weight": 1.0
        },
        "handUpperExtremity": {
            "primary": ["hand", "wrist", "finger", "carpal", "metacarpal", "phalanx", "elbow"],
            "secondary": ["dupuytren", "trigger finger", "carpal tunnel", "cubital tunnel"],
            "weight": 1.0
        },
        "footAnkle": {
            "primary": ["foot", "ankle", "heel", "plantar", "achilles", "bunion", "hallux"],
            "secondary": ["calcaneus", "metatarsal", "tarsal", "flatfoot", "arch"],
            "weight": 1.0
        }
    }
    
    subspecialty_scores = {}
    
    for subspecialty, keyword_data in subspecialty_keywords.items():
        score = 0
        
        # Count primary keywords (higher weight)
        for keyword in keyword_data["primary"]:
            count = len(re.findall(r'\b' + re.escape(keyword) + r'\b', content_lower))
            score += count * 3  # Primary keywords worth 3 points
            if count > 0:
                print(f"🔍 Found '{keyword}' {count} times in {subspecialty}")
        
        # Count secondary keywords (lower weight)
        for keyword in keyword_data["secondary"]:
            count = len(re.findall(r'\b' + re.escape(keyword) + r'\b', content_lower))
            score += count * 1  # Secondary keywords worth 1 point
            if count > 0:
                print(f"🔍 Found '{keyword}' {count} times in {subspecialty}")
        
        subspecialty_scores[subspecialty] = score
        print(f"📊 {subspecialty} total score: {score}")
    
    # Find the subspecialty with the highest score
    detected_subspecialty = max(subspecialty_scores, key=subspecialty_scores.get)
    max_score = subspecialty_scores[detected_subspecialty]
    
    print(f"🎯 Detected subspecialty: {detected_subspecialty} (score: {max_score})")
    
    # If no clear winner (all scores are 0), default to sportsMedicine
    if max_score == 0:
        print("⚠️ No subspecialty keywords found, defaulting to sportsMedicine")
        return "sportsMedicine"
    
    return detected_subspecialty

# Helper functions
async def process_article_emotions(content: str) -> dict:
    """Enhanced emotional analysis with better subspecialty detection"""
    try:
        # First detect subspecialty from content
        detected_subspecialty = detect_subspecialty_from_content(content)
        print(f"🏥 Subspecialty detected from content: {detected_subspecialty}")
        
        if not anthropic_client:
            print("Claude API not available, using fallback analysis")
            fallback_data = get_fallback_emotional_data()
            fallback_data["subspecialty"] = detected_subspecialty
            return fallback_data
            
        # Enhanced Claude prompt with subspecialty context
        message = anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": f"""You are analyzing medical content for emotional undertones. Each article should have DIFFERENT emotional profiles based on its actual content.
                
CONTENT TO ANALYZE (from {detected_subspecialty} subspecialty):
{content[:3000]}

CRITICAL: Analyze the ACTUAL content above and provide varied emotional scores. Don't use generic values.

SCORING GUIDELINES with EXAMPLES:

**Hope (0-1)**: Recovery potential and positive outcomes
- 0.2-0.4: Guarded prognosis, limited recovery options
- 0.5-0.7: Moderate recovery potential, standard outcomes  
- 0.8-0.9: Excellent recovery potential, high success rates

**Tension (0-1)**: Complications, risks, controversy
- 0.1-0.3: Well-established, low-risk procedures
- 0.4-0.6: Some risks or debate in the literature
- 0.7-0.9: High-risk, controversial, or complicated procedures

**Confidence (0-1)**: Evidence strength and certainty
- 0.2-0.4: Limited evidence, case reports only
- 0.5-0.7: Some studies, mixed results
- 0.8-0.9: Strong evidence, multiple high-quality studies

**Uncertainty (0-1)**: Ambiguous results, need for research
- 0.1-0.3: Clear consensus, well-established
- 0.4-0.6: Some areas need clarification
- 0.7-0.9: Many unknowns, conflicting data

**Breakthrough (0-1)**: Innovation and novel approaches  
- 0.1-0.3: Standard, traditional approaches
- 0.4-0.6: Some newer techniques mentioned
- 0.7-0.9: Cutting-edge, revolutionary approaches

**Healing (0-1)**: Therapeutic potential and restoration
- 0.2-0.4: Palliative or limited healing potential
- 0.5-0.7: Good healing and functional restoration
- 0.8-0.9: Excellent healing with return to full function

**Evidence Strength (0-1)**: Quality of research cited
- 0.2-0.4: Case reports, expert opinion
- 0.5-0.7: Some RCTs, systematic reviews
- 0.8-0.9: Multiple high-quality RCTs, meta-analyses

**Technical Density (0-1)**: Complexity of terminology
- 0.2-0.4: Basic medical terminology
- 0.5-0.7: Moderate complexity, some technical terms
- 0.8-0.9: Highly technical, specialized terminology

IMPORTANT: 
- READ the actual content carefully
- VARY the scores based on what you read
- Don't default to middle values (0.5-0.7)
- Make scores reflect the content's actual tone and evidence

Return ONLY this JSON format:
{{
  "hope": <your_analysis_number>,
  "tension": <your_analysis_number>,
  "confidence": <your_analysis_number>, 
  "uncertainty": <your_analysis_number>,
  "breakthrough": <your_analysis_number>,
  "healing": <your_analysis_number>,
  "evidence_strength": <your_analysis_number>,
  "technical_density": <your_analysis_number>,
  "subspecialty": "{detected_subspecialty}"
}}"""
    }]
)
        
        response_text = message.content[0].text.strip()
        print(f"🤖 Claude response: {response_text[:200]}...")
        
        # Clean the response to ensure it's valid JSON
        if response_text.startswith('```json'):
            response_text = response_text.replace('```json', '').replace('```', '').strip()
        
        emotional_data = json.loads(response_text)
        
        # Validate and ensure numeric values
        emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
        for emotion in emotions:
            if emotion not in emotional_data:
                emotional_data[emotion] = 0.5
            else:
                emotional_data[emotion] = max(0.0, min(1.0, float(emotional_data[emotion])))
                
        # Ensure other numeric fields
        emotional_data["evidence_strength"] = max(0.0, min(1.0, float(emotional_data.get("evidence_strength", 0.5))))
        emotional_data["technical_density"] = max(0.0, min(1.0, float(emotional_data.get("technical_density", 0.5))))
        
        # Ensure subspecialty is set
        emotional_data["subspecialty"] = detected_subspecialty
        
        # Find dominant emotion
        emotion_scores = {k: v for k, v in emotional_data.items() if k in emotions}
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        emotional_data["dominant_emotion"] = dominant_emotion
        
        print(f"✅ Emotional analysis complete:")
        print(f"   Subspecialty: {emotional_data['subspecialty']}")
        print(f"   Dominant emotion: {dominant_emotion} ({emotion_scores[dominant_emotion]:.2f})")
        print(f"   Evidence strength: {emotional_data['evidence_strength']:.2f}")
        print(f"   Technical density: {emotional_data['technical_density']:.2f}")
        
        return emotional_data
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
        print(f"Raw response: {response_text}")
        fallback_data = get_fallback_emotional_data()
        fallback_data["subspecialty"] = detect_subspecialty_from_content(content)
        return fallback_data
    except Exception as e:
        print(f"❌ Error in emotional analysis: {e}")
        fallback_data = get_fallback_emotional_data()
        fallback_data["subspecialty"] = detect_subspecialty_from_content(content)
        return fallback_data

def get_fallback_emotional_data():
    """Enhanced fallback with more variation"""
    import random
    
    # Generate more varied fallback data
    base_emotions = {
        "hope": 0.3 + random.random() * 0.4,  # 0.3-0.7
        "tension": 0.1 + random.random() * 0.3,  # 0.1-0.4
        "confidence": 0.4 + random.random() * 0.4,  # 0.4-0.8
        "uncertainty": 0.1 + random.random() * 0.3,  # 0.1-0.4
        "breakthrough": 0.2 + random.random() * 0.4,  # 0.2-0.6
        "healing": 0.4 + random.random() * 0.4,  # 0.4-0.8
    }
    
    dominant_emotion = max(base_emotions, key=base_emotions.get)
    
    return {
        **base_emotions,
        "dominant_emotion": dominant_emotion,
        "evidence_strength": 0.3 + random.random() * 0.5,  # 0.3-0.8
        "technical_density": 0.3 + random.random() * 0.5,  # 0.3-0.8
        "subspecialty": "sportsMedicine"  # Will be overridden by caller
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
    """Generate artwork using the actual Arthrokinetix algorithm parameters"""
    artwork_id = str(uuid.uuid4())
    
    # Get the article content for full algorithm processing
    article = articles_collection.find_one({"id": article_id})
    if not article:
        # Fallback processing
        content = "Sample medical content for processing"
    else:
        # Use HTML content if available, otherwise use regular content
        content = article.get('html_content') or article.get('content', '')
    
    # Process article content with full algorithm analysis
    algorithm_output = process_article_with_full_algorithm(content, emotional_data)
    
    artwork = {
        "id": artwork_id,
        "article_id": article_id,
        "title": f"Algorithmic Synthesis #{signature_data['id']}",
        "subspecialty": emotional_data.get("subspecialty", "sportsMedicine"),
        "dominant_emotion": emotional_data.get("dominant_emotion"),
        "created_date": datetime.utcnow(),
        
        # REAL ALGORITHM PARAMETERS (not simplified tree)
        "algorithm_parameters": {
            # Core Analysis
            "evidence_strength": emotional_data.get("evidence_strength", 0.5),
            "technical_density": emotional_data.get("technical_density", 0.5),
            "subspecialty": emotional_data.get("subspecialty", "sportsMedicine"),
            "dominant_emotion": emotional_data.get("dominant_emotion", "confidence"),
            
            # Andry Tree Structure (abstract, not literal)
            "tree_complexity": emotional_data.get("evidence_strength", 0.5),
            "branch_pattern": emotional_data.get("subspecialty", "sportsMedicine"),
            "root_depth": algorithm_output.get("evidence_foundation", 0.7),
            
            # Emotional Analysis
            "emotional_intensity": emotional_data.get(emotional_data.get("dominant_emotion", "confidence"), 0.5),
            "emotional_mix": {
                "hope": emotional_data.get("hope", 0.4),
                "tension": emotional_data.get("tension", 0.3),
                "confidence": emotional_data.get("confidence", 0.6),
                "uncertainty": emotional_data.get("uncertainty", 0.2),
                "breakthrough": emotional_data.get("breakthrough", 0.4),
                "healing": emotional_data.get("healing", 0.5)
            },
            
            # Medical Content Analysis (REAL DATA FROM ARTICLE)
            "medical_terms": algorithm_output.get("medical_terms", {}),
            "statistical_data": algorithm_output.get("statistics", []),
            "research_citations": algorithm_output.get("citations", []),
            
            # Visual Elements
            "color_palette": signature_data["color_gradients"],
            "visual_elements": algorithm_output.get("visual_elements", []),
            "subspecialty_elements": algorithm_output.get("subspecialty_visuals", {}),
            
            # Complexity and Uniqueness
            "data_complexity": algorithm_output.get("complexity_score", 0.5),
            "uniqueness_factors": algorithm_output.get("uniqueness", {}),
            "article_word_count": len(content.split()),
            "processing_timestamp": datetime.utcnow().isoformat()
        },
        
        "metadata": {
            "signature_id": signature_data["id"],
            "rarity_score": signature_data["rarity_score"],
            "generation_timestamp": datetime.utcnow().isoformat(),
            "algorithm_version": "2.0",
            "content_source": article.get('content_type', 'text') if article else 'fallback',
            "article_analysis": {
                "medical_term_count": len(algorithm_output.get("medical_terms", {})),
                "statistic_count": len(algorithm_output.get("statistics", [])),
                "citation_count": len(algorithm_output.get("citations", [])),
                "complexity_score": algorithm_output.get("complexity_score", 0.5)
            }
        },
        
        "nft_status": "available",
        "download_formats": ["svg", "png", "metadata"]
    }
    
    artworks_collection.insert_one(artwork)
    artwork["_id"] = str(artwork["_id"])
    
    print(f"🎨 Generated REAL algorithm artwork with {len(algorithm_output.get('medical_terms', {}))} medical term categories")
    return artwork

def process_article_with_full_algorithm(content: str, emotional_data: dict):
    """Process article content using the full Arthrokinetix algorithm logic"""
    
    # Medical term extraction with proper categorization
    medical_categories = {
        "procedures": [
            "tenotomy", "tenodesis", "arthroscopy", "repair", "reconstruction", 
            "arthroplasty", "surgery", "surgical", "operation", "procedure",
            "intervention", "treatment", "therapy", "management"
        ],
        "anatomy": [
            "tendon", "ligament", "joint", "bone", "muscle", "cartilage", 
            "meniscus", "labrum", "biceps", "rotator cuff", "shoulder",
            "knee", "hip", "spine", "vertebra", "disc"
        ],
        "outcomes": [
            "success rate", "complication", "recovery", "satisfaction", 
            "function", "pain relief", "improvement", "healing",
            "rehabilitation", "outcome", "result", "effectiveness"
        ],
        "research": [
            "study", "trial", "meta-analysis", "evidence", "randomized",
            "cohort", "systematic review", "clinical trial", "research",
            "analysis", "investigation", "examination"
        ]
    }
    
    extracted_terms = {}
    content_lower = content.lower()
    
    for category, terms in medical_categories.items():
        extracted_terms[category] = {}
        for term in terms:
            # Use word boundaries for accurate matching
            pattern = r'\b' + re.escape(term.lower()) + r'\b'
            matches = re.findall(pattern, content_lower)
            count = len(matches)
            if count > 0:
                extracted_terms[category][term] = {
                    "count": count,
                    "weight": 1.0,
                    "significance": count * 1.0,
                    "context_weight": min(count / 10, 1.0)  # Normalize significance
                }
    
    # Enhanced statistical data extraction
    statistics = []
    patterns = {
        "percentages": r'(\d+(?:\.\d+)?)\s*%',
        "pValues": r'p\s*[<>=]\s*(\d+(?:\.\d+)?)',
        "sampleSizes": r'n\s*=\s*(\d+)',
        "followUp": r'(\d+)\s*(?:months?|years?|weeks?)\s*follow-?up',
        "ages": r'(?:age|aged)\s*(\d+)',
        "satisfaction": r'(\d+(?:\.\d+)?)\s*%\s*(?:satisfied|satisfaction)',
        "success": r'(\d+(?:\.\d+)?)\s*%\s*(?:success|successful)'
    }
    
    for stat_type, pattern in patterns.items():
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            value = float(match.group(1))
            statistics.append({
                "type": stat_type,
                "value": value,
                "context": content[max(0, match.start()-50):match.end()+50],
                "significance": calculate_stat_significance(stat_type, value),
                "position": match.start() / len(content)  # Relative position in text
            })
    
    # Research citations with better detection
    citation_patterns = [
        r'\b(?:\w+\s+)?et al\.?\s*\(?(?:19|20)\d{2}\)?',
        r'\b(?:study|trial|research|analysis|investigation)\b.*?(?:19|20)\d{2}',
        r'\b(?:journal|publication|paper|article)\b.*?(?:medicine|surgery|orthopedic)',
        r'\b(?:meta-analysis|systematic review|randomized|clinical trial)\b',
        r'\([^)]*(?:19|20)\d{2}[^)]*\)'  # Years in parentheses
    ]
    
    citations = []
    for i, pattern in enumerate(citation_patterns):
        matches = re.finditer(pattern, content, re.IGNORECASE)
        for match in matches:
            context = match.group()
            citations.append({
                "type": "research_reference",
                "context": context,
                "importance": 0.3 + (i * 0.15),
                "impact": min(len(context) / 50, 1.0),
                "pattern_type": i,
                "position": match.start() / len(content)
            })
    
    # Visual elements based on content analysis
    visual_elements = []
    
    # Add elements based on medical terms found
    for category, terms in extracted_terms.items():
        if terms:
            total_significance = sum(term_data["significance"] for term_data in terms.values())
            visual_elements.append({
                "type": f"{category}_visualization",
                "count": len(terms),
                "significance": total_significance,
                "color_mapping": get_category_color(category),
                "terms": list(terms.keys())[:5],  # Top 5 terms for visualization
                "density": total_significance / max(len(content.split()), 1)
            })
    
    # Subspecialty-specific visual elements
    subspecialty = emotional_data.get("subspecialty", "sportsMedicine")
    subspecialty_visuals = {
        "shape_style": get_subspecialty_shape(subspecialty),
        "pattern_type": get_subspecialty_pattern(subspecialty),
        "color_emphasis": get_subspecialty_colors(subspecialty),
        "motion_characteristic": get_subspecialty_motion(subspecialty)
    }
    
    # Enhanced uniqueness calculation
    uniqueness = {
        "term_diversity": len(set(term for terms in extracted_terms.values() for term in terms.keys())),
        "statistical_complexity": len(statistics),
        "citation_density": len(citations),
        "emotional_variance": calculate_emotional_variance(emotional_data),
        "content_distribution": calculate_content_distribution(extracted_terms),
        "research_depth": sum(cite.get("impact", 0) for cite in citations)
    }
    
    # Comprehensive complexity score
    complexity_score = calculate_comprehensive_complexity(uniqueness, emotional_data, content)
    
    return {
        "medical_terms": extracted_terms,
        "statistics": statistics,
        "citations": citations,
        "visual_elements": visual_elements,
        "subspecialty_visuals": subspecialty_visuals,
        "uniqueness": uniqueness,
        "complexity_score": complexity_score,
        "evidence_foundation": min(len(citations) / 10, 1.0),
        "content_richness": calculate_content_richness(extracted_terms, statistics, citations)
    }

def calculate_stat_significance(stat_type, value):
    """Calculate significance score for different statistic types"""
    significance_maps = {
        "percentages": lambda x: min(x / 100, 1.0),
        "pValues": lambda x: max(0, 1 - x),  # Lower p-values = higher significance
        "sampleSizes": lambda x: min(x / 1000, 1.0),
        "followUp": lambda x: min(x / 60, 1.0),  # Up to 60 months
        "satisfaction": lambda x: min(x / 100, 1.0),
        "success": lambda x: min(x / 100, 1.0)
    }
    
    calculator = significance_maps.get(stat_type, lambda x: 0.5)
    return calculator(value)

def calculate_content_distribution(extracted_terms):
    """Calculate how evenly distributed different types of medical content are"""
    category_counts = [len(terms) for terms in extracted_terms.values()]
    if not category_counts:
        return 0.0
    
    max_count = max(category_counts)
    min_count = min(category_counts)
    
    # Higher distribution score = more even distribution
    return 1.0 - ((max_count - min_count) / max(max_count, 1))

def calculate_comprehensive_complexity(uniqueness, emotional_data, content):
    """Calculate a comprehensive complexity score"""
    factors = {
        "term_complexity": min(uniqueness["term_diversity"] / 20, 1.0) * 0.25,
        "statistical_complexity": min(uniqueness["statistical_complexity"] / 15, 1.0) * 0.20,
        "research_depth": min(uniqueness["research_depth"] / 5, 1.0) * 0.20,
        "emotional_complexity": uniqueness["emotional_variance"] * 0.15,
        "content_length": min(len(content.split()) / 2000, 1.0) * 0.10,
        "distribution_evenness": uniqueness["content_distribution"] * 0.10
    }
    
    return sum(factors.values())

def calculate_content_richness(extracted_terms, statistics, citations):
    """Calculate overall content richness for artwork generation"""
    term_richness = sum(len(terms) for terms in extracted_terms.values()) / 20
    stat_richness = len(statistics) / 10
    citation_richness = len(citations) / 8
    
    return min((term_richness + stat_richness + citation_richness) / 3, 1.0)

def get_subspecialty_motion(subspecialty):
    """Define motion characteristics for subspecialties"""
    motions = {
        "sportsMedicine": "dynamic_flow",
        "jointReplacement": "mechanical_precision",
        "trauma": "stabilizing_force",
        "spine": "undulating_rhythm",
        "handUpperExtremity": "intricate_articulation",
        "footAnkle": "grounded_stability"
    }
    return motions.get(subspecialty, "dynamic_flow")

def get_category_color(category):
    """Map medical categories to colors"""
    colors = {
        "procedures": "#e74c3c",
        "anatomy": "#3498db", 
        "outcomes": "#27ae60",
        "research": "#f39c12"
    }
    return colors.get(category, "#95a5a6")

def get_subspecialty_shape(subspecialty):
    """Map subspecialties to shape styles"""
    shapes = {
        "sportsMedicine": "dynamic_flow",
        "jointReplacement": "geometric_precision",
        "trauma": "angular_reinforcement",
        "spine": "vertical_segmentation",
        "handUpperExtremity": "intricate_detail",
        "footAnkle": "grounded_support"
    }
    return shapes.get(subspecialty, "dynamic_flow")

def get_subspecialty_pattern(subspecialty):
    """Map subspecialties to pattern types"""
    patterns = {
        "sportsMedicine": "flowing_motion",
        "jointReplacement": "structured_grid",
        "trauma": "fracture_lines",
        "spine": "vertebral_stack",
        "handUpperExtremity": "neural_network",
        "footAnkle": "weight_distribution"
    }
    return patterns.get(subspecialty, "flowing_motion")

def get_subspecialty_colors(subspecialty):
    """Map subspecialties to color emphasis"""
    color_schemes = {
        "sportsMedicine": ["#27ae60", "#3498db", "#e74c3c"],
        "jointReplacement": ["#7f8c8d", "#bdc3c7", "#f39c12"],
        "trauma": ["#e74c3c", "#f1c40f", "#95a5a6"],
        "spine": ["#8e44ad", "#e74c3c", "#f39c12"],
        "handUpperExtremity": ["#16a085", "#e74c3c", "#d35400"],
        "footAnkle": ["#2ecc71", "#e74c3c", "#34495e"]
    }
    return color_schemes.get(subspecialty, color_schemes["sportsMedicine"])

def calculate_emotional_variance(emotional_data):
    """Calculate variance in emotional scores"""
    emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
    scores = [emotional_data.get(emotion, 0.5) for emotion in emotions]
    mean_score = sum(scores) / len(scores)
    variance = sum((score - mean_score) ** 2 for score in scores) / len(scores)
    return min(variance * 2, 1.0)  # Normalize to 0-1

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

@app.get("/api/share/metadata/{content_type}/{content_id}")
async def get_share_metadata(content_type: str, content_id: str):
    """Get sharing metadata for articles or artworks"""
    try:
        if content_type == "article":
            article = articles_collection.find_one({"id": content_id})
            if not article:
                raise HTTPException(status_code=404, detail="Article not found")
            
            article["_id"] = str(article["_id"])
            return {
                "type": "article",
                "title": article["title"],
                "description": article.get("meta_description", f"Evidence-based medical content in {article.get('subspecialty', 'orthopedics')}"),
                "url": f"/articles/{content_id}",
                "image": None,  # Could add article thumbnails in future
                "hashtags": ["Arthrokinetix", "Medicine", "EvidenceBased", article.get("subspecialty"), article.get("emotional_data", {}).get("dominant_emotion")],
                "subspecialty": article.get("subspecialty"),
                "emotion": article.get("emotional_data", {}).get("dominant_emotion")
            }
            
        elif content_type == "artwork":
            artwork = artworks_collection.find_one({"id": content_id})
            if not artwork:
                raise HTTPException(status_code=404, detail="Artwork not found")
            
            artwork["_id"] = str(artwork["_id"])
            rarity_score = artwork.get("metadata", {}).get("rarity_score", 0)
            return {
                "type": "artwork",
                "title": artwork["title"],
                "description": f"Algorithmic art generated from medical research. Emotion: {artwork.get('dominant_emotion', 'unknown')}. Rarity: {round(rarity_score * 100)}%",
                "url": f"/gallery/{content_id}",
                "image": None,  # Could add artwork previews in future
                "hashtags": ["Arthrokinetix", "GenerativeArt", "MedicalArt", "NFT", artwork.get("dominant_emotion"), artwork.get("subspecialty")],
                "subspecialty": artwork.get("subspecialty"),
                "emotion": artwork.get("dominant_emotion"),
                "rarity_score": rarity_score
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid content type. Must be 'article' or 'artwork'")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
