from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from arthrokinetix_algorithm import process_article_with_manual_algorithm, process_content_with_adapters

# Import content adapters
try:
    from content_adapters import process_content, ContentAdapterFactory
    HAS_CONTENT_ADAPTERS = True
    print("✅ Content adapters loaded successfully")
except ImportError as e:
    HAS_CONTENT_ADAPTERS = False
    print(f"⚠️ Content adapters not available: {e}")
    print("   Using legacy HTML processing only")
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
import math
import random
from image_handler import ImageHandler

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
        
        # Process content based on type using content adapters
        processed_content = ""
        html_content = ""
        adapter_data = None
        file_data = None
        
        if content_type == "text" and content:
            # Process text content using adapters if available
            if HAS_CONTENT_ADAPTERS:
                try:
                    adapter_element = process_content(content, "text")
                    processed_content = adapter_element.text_content
                    adapter_data = {
                        "text_content": adapter_element.text_content,
                        "structure": adapter_element.structure if hasattr(adapter_element, 'structure') else {},
                        "metadata": adapter_element.metadata if hasattr(adapter_element, 'metadata') else {},
                        "content_type": "text"
                    }
                    print(f"📝 Text processed with adapter: {len(processed_content)} characters")
                except Exception as e:
                    print(f"⚠️ Text adapter failed, using legacy: {e}")
                    processed_content = content
            else:
                processed_content = content
            print(f"📝 Text content length: {len(processed_content)} characters")
            
        elif content_type in ["html", "pdf"] and file:
            # Read and store file content
            file_content = await file.read()
            print(f"📂 File uploaded: {file.filename} ({len(file_content)} bytes)")
            
            if content_type == "html":
                # Process HTML using adapters if available
                html_content = file_content.decode('utf-8')
                
                # Extract images from HTML
                image_handler = ImageHandler()
                extracted_images = image_handler.extract_images_from_html(html_content)
                image_analysis = image_handler.analyze_images_for_algorithm(extracted_images)
                print(f"🖼️ Extracted {len(extracted_images)} images from HTML")
                
                if HAS_CONTENT_ADAPTERS:
                    try:
                        adapter_element = process_content(html_content, "html")
                        processed_content = adapter_element.text_content
                        adapter_data = {
                            "text_content": adapter_element.text_content,
                            "structure": adapter_element.structure if hasattr(adapter_element, 'structure') else {},
                            "metadata": adapter_element.metadata if hasattr(adapter_element, 'metadata') else {},
                            "content_type": "html"
                        }
                        print(f"🌐 HTML processed with adapter: {len(processed_content)} characters")
                    except Exception as e:
                        print(f"⚠️ HTML adapter failed, using legacy: {e}")
                        processed_content = re.sub('<[^<]+?>', '', html_content)
                else:
                    # Fallback to legacy HTML processing
                    processed_content = re.sub('<[^<]+?>', '', html_content)
                
                print(f"🔤 Extracted text length: {len(processed_content)} characters")
                
                # Store file data with image information
                file_data = {
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "size": len(file_content),
                    "content": html_content,
                    "images": extracted_images,
                    "image_analysis": image_analysis
                }
                
            elif content_type == "pdf":
                # Extract images from PDF
                image_handler = ImageHandler()
                extracted_images = image_handler.extract_images_from_pdf(file_content)
                image_analysis = image_handler.analyze_images_for_algorithm(extracted_images)
                print(f"🖼️ Extracted {len(extracted_images)} images from PDF")
                
                # Process PDF using adapters if available
                if HAS_CONTENT_ADAPTERS:
                    try:
                        adapter_element = process_content(file_content, "pdf")
                        processed_content = adapter_element.text_content
                        adapter_data = {
                            "text_content": adapter_element.text_content,
                            "structure": adapter_element.structure if hasattr(adapter_element, 'structure') else {},
                            "metadata": adapter_element.metadata if hasattr(adapter_element, 'metadata') else {},
                            "content_type": "pdf"
                        }
                        print(f"📄 PDF processed with adapter: {len(processed_content)} characters")
                    except Exception as e:
                        print(f"⚠️ PDF adapter failed, storing for manual processing: {e}")
                        processed_content = f"PDF content from {file.filename} (processing failed)"
                        adapter_data = None
                else:
                    processed_content = f"PDF content from {file.filename} (no adapter available)"
                
                # Store file data with image information
                file_data = {
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "size": len(file_content),
                    "content": base64.b64encode(file_content).decode('utf-8'),
                    "images": extracted_images,
                    "image_analysis": image_analysis
                }
                print(f"📄 PDF file stored with {len(extracted_images)} images")
                
        else:
            raise HTTPException(status_code=400, detail="Invalid content type or missing content/file")
        
        # Show content preview for debugging
        content_preview = processed_content[:500] + "..." if len(processed_content) > 500 else processed_content
        print(f"📖 Content preview:\n{content_preview}")
        
        # Process article with enhanced Arthrokinetix algorithm using adapters
        print("\n🧠 Starting emotional analysis...")
        
        # Use content adapters if available and we have adapter data
        if HAS_CONTENT_ADAPTERS and adapter_data:
            try:
                print(f"🔄 Using adapter-enhanced processing for {content_type}")
                emotional_data = process_content_with_adapters(adapter_data, content_type)
                print("✅ Adapter-enhanced processing completed")
            except Exception as e:
                print(f"⚠️ Adapter processing failed, using legacy: {e}")
                emotional_data = await process_article_emotions(processed_content)
        else:
            # Fallback to legacy processing
            print("🔄 Using legacy emotional analysis")
            emotional_data = await process_article_emotions(processed_content)
        
        print(f"\n💭 Emotional analysis results:")
        for key, value in emotional_data.items():
            if isinstance(value, (int, float)):
                print(f"   {key}: {value:.3f}")
            else:
                print(f"   {key}: {value}")
        
        print("\n🔮 Generating emotional signature...")
        signature_data = generate_emotional_signature(emotional_data)
        
        # Enhance emotional data with image analysis if available
        if file_data and 'image_analysis' in file_data:
            image_analysis = file_data['image_analysis']
            emotional_data['image_complexity'] = image_analysis.get('complexity_score', 0.0)
            emotional_data['medical_imagery_confidence'] = image_analysis.get('medical_imagery_confidence', 0.0)
            emotional_data['visual_elements_count'] = image_analysis.get('total_images', 0)
            print(f"🎨 Enhanced emotional data with image analysis")
        
        # Create article record with adapter enhancements
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
            "evidence_strength": emotional_data.get("evidence_strength", 0.5),  # Use algorithm-detected evidence strength
            "meta_description": meta_description,
            "read_time": calculate_read_time(processed_content),
            
            # Enhanced fields from content adapters
            "adapter_data": adapter_data,
            "processing_method": "content_adapters" if adapter_data else "legacy",
            "adapter_version": adapter_data.get("metadata", {}).get("adapter_version") if adapter_data else None
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
    """Generate artwork using the ACTUAL manual algorithm"""
    artwork_id = str(uuid.uuid4())
    
    # Get the article content
    article = articles_collection.find_one({"id": article_id})
    if not article:
        content = "Sample medical content for processing"
    else:
        content = article.get('html_content') or article.get('content', '')
    
    print(f"🎨 Processing with MANUAL algorithm: {len(content)} characters")
    
    # Use the ACTUAL manual algorithm
    manual_algorithm_output = process_article_with_manual_algorithm(content)
    
    print(f"🔍 Manual algorithm output keys: {list(manual_algorithm_output.keys())}")
    print(f"🧠 Manual emotional journey: {manual_algorithm_output.get('emotional_journey', {})}")
    
    artwork = {
        "id": artwork_id,
        "article_id": article_id,
        "title": f"Algorithmic Synthesis #{signature_data['id']}",
        "subspecialty": manual_algorithm_output.get("subspecialty", "sportsMedicine"),
        "dominant_emotion": manual_algorithm_output.get("dominant_emotion", "confidence"),
        "created_date": datetime.utcnow(),
        
        # USE DIRECT MANUAL ALGORITHM OUTPUT
        "algorithm_parameters": manual_algorithm_output,
        
        "metadata": {
            "signature_id": signature_data["id"],
            "rarity_score": signature_data["rarity_score"],
            "generation_timestamp": datetime.utcnow().isoformat(),
            "algorithm_version": "2.0-manual-direct",
            "content_source": article.get('content_type', 'text') if article else 'fallback'
        },
        
        "nft_status": "available",
        "download_formats": ["svg", "png", "metadata"]
    }
    
    artworks_collection.insert_one(artwork)
    artwork["_id"] = str(artwork["_id"])
    
    print(f"✅ Generated artwork using MANUAL algorithm")
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

# NEW ENDPOINTS FOR WEEK 2: SVG GENERATION AND METADATA ANALYSIS

@app.post("/api/artworks/{artwork_id}/generate-svg")
async def generate_artwork_svg(artwork_id: str):
    """Generate SVG for existing artwork"""
    try:
        artwork = artworks_collection.find_one({"id": artwork_id})
        if not artwork:
            raise HTTPException(status_code=404, detail="Artwork not found")
        
        # Get algorithm parameters
        algorithm_params = artwork.get("algorithm_parameters", {})
        metadata = artwork.get("metadata", {})
        visual_elements = algorithm_params.get("visual_elements", [])
        
        # Generate SVG using the SVG generator
        from svg_generator import ArthrokinetixSVGGenerator
        svg_generator = ArthrokinetixSVGGenerator()
        
        svg_string = svg_generator.generate_svg(
            visual_elements,
            metadata,
            algorithm_params
        )
        
        # Update artwork with SVG data
        svg_data = {
            "svg_string": svg_string,
            "file_size": len(svg_string.encode('utf-8')),
            "generation_timestamp": datetime.utcnow(),
            "download_count": artwork.get("svg_data", {}).get("download_count", 0)
        }
        
        artworks_collection.update_one(
            {"id": artwork_id},
            {"$set": {"svg_data": svg_data}}
        )
        
        return {
            "svg_string": svg_string,
            "file_size": svg_data["file_size"],
            "generation_timestamp": svg_data["generation_timestamp"].isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/artworks/{artwork_id}/download-svg")
async def download_artwork_svg(artwork_id: str):
    """Download SVG file for artwork (ADMIN ONLY)"""
    try:
        artwork = artworks_collection.find_one({"id": artwork_id})
        if not artwork:
            raise HTTPException(status_code=404, detail="Artwork not found")
        
        svg_data = artwork.get("svg_data", {})
        if not svg_data.get("svg_string"):
            # Generate SVG if not exists
            svg_response = await generate_artwork_svg(artwork_id)
            svg_string = svg_response["svg_string"]
        else:
            svg_string = svg_data["svg_string"]
        
        # Increment download counter
        artworks_collection.update_one(
            {"id": artwork_id},
            {"$inc": {"svg_data.download_count": 1}}
        )
        
        # Generate filename
        signature_id = artwork.get("metadata", {}).get("signature_id", artwork_id)
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        filename = f"{signature_id}_{timestamp}_arthrokinetix.svg"
        
        from fastapi.responses import Response
        return Response(
            content=svg_string,
            media_type="image/svg+xml",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/metadata-analysis")
async def get_metadata_analysis():
    """Get comprehensive metadata analysis for admin dashboard"""
    try:
        # Aggregate metadata statistics
        pipeline = [
            {
                "$group": {
                    "_id": "$subspecialty",
                    "count": {"$sum": 1},
                    "avg_uniqueness": {"$avg": "$comprehensive_metadata.ai_analysis_data.uniqueness_factors.overall_uniqueness"},
                    "avg_complexity": {"$avg": "$comprehensive_metadata.visual_characteristics.pattern_complexity"},
                    "pattern_types": {"$addToSet": "$comprehensive_metadata.pattern_usage.tree_pattern_signature"}
                }
            }
        ]
        
        subspecialty_analysis = list(artworks_collection.aggregate(pipeline))
        
        # Pattern frequency analysis
        pattern_frequency_pipeline = [
            {"$unwind": "$comprehensive_metadata.pattern_usage.tree_pattern_signature"},
            {"$group": {
                "_id": "$comprehensive_metadata.pattern_usage.tree_pattern_signature",
                "frequency": {"$sum": 1}
            }},
            {"$sort": {"frequency": -1}},
            {"$limit": 20}
        ]
        
        pattern_frequency = list(artworks_collection.aggregate(pattern_frequency_pipeline))
        
        # Recent evolution trends
        recent_artworks = list(artworks_collection.find(
            {},
            {"comprehensive_metadata": 1, "created_date": 1, "subspecialty": 1, "id": 1}
        ).sort("created_date", -1).limit(50))
        
        # Convert ObjectIds to strings
        for artwork in recent_artworks:
            artwork["_id"] = str(artwork["_id"])
        
        # Calculate metadata completeness
        total = artworks_collection.count_documents({})
        with_metadata = artworks_collection.count_documents({
            "comprehensive_metadata.visual_characteristics": {"$exists": True, "$ne": {}}
        })
        
        metadata_completeness = {
            "total_artworks": total,
            "with_comprehensive_metadata": with_metadata,
            "completeness_percentage": (with_metadata / max(1, total)) * 100
        }
        
        return {
            "subspecialty_analysis": subspecialty_analysis,
            "pattern_frequency": pattern_frequency,
            "recent_trends": recent_artworks,
            "total_artworks": total,
            "metadata_completeness": metadata_completeness
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/artworks/{artwork_id}/regenerate")
async def regenerate_artwork(artwork_id: str):
    """Regenerate artwork with updated algorithm for a specific article"""
    try:
        # Find the artwork
        existing_artwork = artworks_collection.find_one({"id": artwork_id})
        if not existing_artwork:
            raise HTTPException(status_code=404, detail="Artwork not found")
        
        # Find the associated article
        article_id = existing_artwork.get("article_id")
        article = articles_collection.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Associated article not found")
        
        print(f"🔄 Regenerating artwork {artwork_id} for article {article_id}")
        
        # Get content for reprocessing
        content = article.get('html_content') or article.get('content', '')
        
        # Reprocess with updated algorithm
        manual_algorithm_output = process_article_with_manual_algorithm(content)
        
        # Update artwork with new algorithm output
        update_data = {
            "algorithm_parameters": manual_algorithm_output,
            "regenerated_date": datetime.utcnow(),
            "metadata.algorithm_version": "2.0-manual-regenerated",
            "metadata.regeneration_timestamp": datetime.utcnow().isoformat(),
            "dominant_emotion": manual_algorithm_output.get("dominant_emotion", "confidence"),
            "subspecialty": manual_algorithm_output.get("subspecialty", existing_artwork.get("subspecialty"))
        }
        
        # Clear any existing SVG data to force regeneration
        update_data["svg_data"] = {}
        
        result = artworks_collection.update_one(
            {"id": artwork_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            print(f"✅ Artwork regenerated successfully")
            
            # Generate new SVG
            svg_response = await generate_artwork_svg(artwork_id)
            
            return {
                "status": "success",
                "artwork_id": artwork_id,
                "article_id": article_id,
                "new_parameters": manual_algorithm_output,
                "svg_generated": True,
                "svg_size": svg_response.get("file_size", 0)
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update artwork")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error regenerating artwork: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/svg-batch-generate")
async def batch_generate_svgs():
    """Generate SVGs for all artworks that don't have them (ADMIN ONLY)"""
    try:
        # Find artworks without SVG data
        artworks_without_svg = list(artworks_collection.find({
            "svg_data.svg_string": {"$exists": False}
        }, {"id": 1, "title": 1}))
        
        generated_count = 0
        failed_count = 0
        results = []
        
        for artwork in artworks_without_svg:
            try:
                result = await generate_artwork_svg(artwork["id"])
                generated_count += 1
                results.append({
                    "artwork_id": artwork["id"],
                    "title": artwork.get("title", "Unknown"),
                    "status": "success",
                    "file_size": result["file_size"]
                })
            except Exception as e:
                failed_count += 1
                results.append({
                    "artwork_id": artwork["id"],
                    "title": artwork.get("title", "Unknown"),
                    "status": "failed",
                    "error": str(e)
                })
        
        return {
            "total_processed": len(artworks_without_svg),
            "generated_count": generated_count,
            "failed_count": failed_count,
            "results": results
        }
        
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
