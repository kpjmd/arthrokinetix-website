from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient, errors
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
import hashlib
from typing import List, Dict, Optional
import anthropic
import base64
from pathlib import Path
import re
import math
import random
import asyncio
import threading
from image_handler import ImageHandler
from cloudinary_handler import CloudinaryImageHandler
from bs4 import BeautifulSoup

# Load environment variables - use default path for Railway
load_dotenv()

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

# Global variables for database connection
client = None
db = None
database_initialized = False

# Initialize as None - will be set during startup
articles_collection = None
artworks_collection = None
users_collection = None
feedback_collection = None
algorithm_states_collection = None
images_collection = None

# Anthropic client with correct environment variable name
anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY')  # Changed from CLAUDE_API_KEY
if anthropic_api_key:
    anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)
    print("Claude API client initialized")
else:
    print("No ANTHROPIC_API_KEY found")
    anthropic_client = None

# Collections will be initialized during startup

# Database migration function
def migrate_articles():
    """Migrate articles to ensure consistent field naming"""
    if articles_collection is None:
        print("[MIGRATION] Skipping - database not initialized")
        return
        
    try:
        # Find articles that have '_id' but no 'id' field
        articles_to_fix = list(articles_collection.find({"id": {"$exists": False}}))
        
        if articles_to_fix:
            print(f"[MIGRATION] Found {len(articles_to_fix)} articles to migrate")
            
            for article in articles_to_fix:
                # Add 'id' field using _id value
                article_id = str(article["_id"])
                articles_collection.update_one(
                    {"_id": article["_id"]},
                    {"$set": {"id": article_id}}
                )
                print(f"[MIGRATION] Updated article: {article.get('title', 'Unknown')}")
            
            print(f"[MIGRATION] Migration complete - fixed {len(articles_to_fix)} articles")
        else:
            print("[MIGRATION] No articles need migration")
            
        # Also check for date field inconsistencies
        articles_with_created_at = list(articles_collection.find({
            "created_at": {"$exists": True},
            "published_date": {"$exists": False}
        }))
        
        if articles_with_created_at:
            print(f"[MIGRATION] Found {len(articles_with_created_at)} articles with date field issues")
            for article in articles_with_created_at:
                articles_collection.update_one(
                    {"_id": article["_id"]},
                    {
                        "$set": {"published_date": article["created_at"]},
                        "$unset": {"created_at": ""}
                    }
                )
            print(f"[MIGRATION] Fixed date fields for {len(articles_with_created_at)} articles")
            
    except Exception as e:
        print(f"[MIGRATION ERROR] {e}")
        import traceback
        traceback.print_exc()

# Function to remove duplicate articles
def remove_duplicate_articles():
    """Remove duplicate articles keeping the most recent one"""
    if articles_collection is None:
        print("[DEDUP] Skipping - database not initialized")
        return
        
    try:
        # Find all articles and group by title
        pipeline = [
            {"$group": {
                "_id": "$title",
                "count": {"$sum": 1},
                "ids": {"$push": "$_id"},
                "docs": {"$push": "$$ROOT"}
            }},
            {"$match": {"count": {"$gt": 1}}}
        ]
        
        duplicates = list(articles_collection.aggregate(pipeline))
        
        if duplicates:
            print(f"[DEDUP] Found {len(duplicates)} groups of duplicate articles")
            total_removed = 0
            
            for group in duplicates:
                docs = group["docs"]
                # Sort by published_date or _id to keep the most recent
                docs.sort(key=lambda x: x.get("published_date", x["_id"]), reverse=True)
                
                # Keep the first (most recent) and remove the rest
                to_remove = docs[1:]
                for doc in to_remove:
                    articles_collection.delete_one({"_id": doc["_id"]})
                    total_removed += 1
                    print(f"[DEDUP] Removed duplicate: {doc.get('title', 'Unknown')[:50]}...")
            
            print(f"[DEDUP] Removed {total_removed} duplicate articles")
        else:
            print("[DEDUP] No duplicate articles found")
            
    except Exception as e:
        print(f"[DEDUP ERROR] {e}")
        import traceback
        traceback.print_exc()

# Flag to track if migrations have been completed
migration_completed = False

def run_migrations_async():
    """Run migrations in a separate thread"""
    global migration_completed
    try:
        print("[STARTUP] Running database migrations in background...")
        migrate_articles()
        remove_duplicate_articles()
        migration_completed = True
        print("[STARTUP] Database migrations completed successfully")
    except Exception as e:
        print(f"[STARTUP ERROR] Migration failed: {e}")
        import traceback
        traceback.print_exc()

@app.on_event("startup")
async def startup_event():
    """Initialize database connection and collections on startup"""
    global client, db, database_initialized
    global articles_collection, artworks_collection, users_collection
    global feedback_collection, algorithm_states_collection, images_collection
    
    print("[STARTUP] Initializing database connection...")
    
    mongodb_uri = os.environ.get('MONGODB_URI')
    if not mongodb_uri:
        print("[STARTUP] No MONGODB_URI found - running without database")
        database_initialized = False
        return
    
    try:
        # Create MongoDB client
        client = MongoClient(
            mongodb_uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=5000
        )
        
        # Use the database
        db = client.arthrokinetix
        
        # Quick ping to verify connection
        client.admin.command('ping')
        print("[STARTUP] MongoDB connected successfully")
        
        # Initialize collections
        articles_collection = db.articles
        artworks_collection = db.artworks
        users_collection = db.users
        feedback_collection = db.feedback
        algorithm_states_collection = db.algorithm_states
        images_collection = db.images
        
        database_initialized = True
        
        # Start index creation and migrations in background
        def init_database_async():
            try:
                print("[STARTUP] Creating database indexes...")
                
                # Helper function to safely create unique index
                def create_unique_index(collection, field, index_name=None):
                    try:
                        # Get existing indexes
                        indexes = list(collection.list_indexes())
                        field_key = f"{field}_1"
                        
                        # Check if a non-unique index exists with the same field
                        for idx in indexes:
                            if field_key in idx.get('name', '') and not idx.get('unique', False):
                                print(f"[STARTUP] Dropping non-unique index {idx['name']} on {collection.name}")
                                collection.drop_index(idx['name'])
                        
                        # Create the unique index
                        collection.create_index(field, unique=True, name=index_name or f"{field}_unique")
                        print(f"[STARTUP] Created unique index on {collection.name}.{field}")
                    except errors.DuplicateKeyError as e:
                        print(f"[STARTUP] Unique index on {collection.name}.{field} already exists")
                    except Exception as e:
                        print(f"[STARTUP] Warning: Could not create index on {collection.name}.{field}: {e}")
                
                # Create unique indexes with error handling
                create_unique_index(db.articles, "id")
                create_unique_index(db.artworks, "id")
                create_unique_index(db.images, "id")
                create_unique_index(db.newsletter_subscribers, "email")
                
                # Create non-unique indexes
                try:
                    db.algorithm_states.create_index("timestamp")
                    db.feedback.create_index("article_id")
                    db.images.create_index("article_id")
                except Exception as e:
                    print(f"[STARTUP] Warning: Some non-unique indexes may already exist: {e}")
                
                # Compound indexes
                try:
                    db.articles.create_index([("subspecialty", 1), ("published_date", -1)])
                    db.artworks.create_index([("subspecialty", 1), ("created_date", -1)])
                    db.artworks.create_index([("article_id", 1)])
                    db.algorithm_states.create_index([("timestamp", -1), ("articles_processed", 1)])
                    db.images.create_index([("article_id", 1), ("id", 1)])
                except Exception as e:
                    print(f"[STARTUP] Warning: Some compound indexes may already exist: {e}")
                
                print("[STARTUP] Database indexes created successfully")
                
                # Run migrations
                migrate_articles()
                remove_duplicate_articles()
                
            except Exception as e:
                print(f"[STARTUP ERROR] Database initialization failed: {e}")
                import traceback
                traceback.print_exc()
        
        # Run database initialization in background thread
        init_thread = threading.Thread(target=init_database_async)
        init_thread.daemon = True
        init_thread.start()
        
    except Exception as e:
        print(f"[STARTUP ERROR] Failed to connect to MongoDB: {e}")
        database_initialized = False

@app.get("/")
async def root():
    return {
        "message": "Arthrokinetix API - Emotional Medical Content & Art Generation",
        "status": "healthy",
        "migration_completed": migration_completed
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway - always returns healthy for liveness"""
    return {
        "status": "healthy",
        "database_initialized": database_initialized,
        "migration_completed": migration_completed
    }

@app.get("/ready")
async def readiness_check():
    """Readiness check endpoint - verifies database is connected"""
    if not database_initialized:
        raise HTTPException(status_code=503, detail="Database not initialized")
    
    return {
        "status": "ready",
        "database_initialized": database_initialized,
        "migration_completed": migration_completed
    }

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
        
        # Check for duplicate articles by title
        existing_article = articles_collection.find_one({"title": title})
        if existing_article:
            print(f"⚠️ Article with title '{title}' already exists")
            raise HTTPException(
                status_code=409, 
                detail=f"An article with the title '{title}' already exists. Please use a different title."
            )
        
        # Generate unique ID
        article_id = str(uuid.uuid4())
        
        # Process content based on type using content adapters
        processed_content = ""
        html_content = ""
        adapter_data = None
        file_data = None
        processed_image_data = None
        
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
                
                # Extract and process images from HTML using Cloudinary
                cloudinary_handler = CloudinaryImageHandler()
                extracted_images = cloudinary_handler.extract_images_from_html(html_content)
                print(f"🖼️ Extracted {len(extracted_images)} images from HTML")
                
                # Process images with Cloudinary upload
                processed_image_data = cloudinary_handler.process_article_images(extracted_images, article_id)
                print(f"✅ Processed {processed_image_data['total_count']} images to Cloudinary")
                
                # Store processed images metadata in database
                if processed_image_data['images']:
                    for img in processed_image_data['images']:
                        images_collection.insert_one(img)
                    print(f"💾 Stored {len(processed_image_data['images'])} images metadata in database")
                
                # Analyze images for algorithm
                image_analysis = cloudinary_handler.analyze_images_for_algorithm(extracted_images)
                
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
                # Extract and process images from PDF
                image_handler = ImageHandler()
                extracted_images = image_handler.extract_images_from_pdf(file_content)
                print(f"🖼️ Extracted {len(extracted_images)} images from PDF")
                
                # Process images with WebP conversion
                processed_image_data = image_handler.process_article_images(extracted_images, article_id)
                print(f"✅ Processed {processed_image_data['total_count']} images to WebP format")
                
                # Store processed images in separate collection
                if processed_image_data['images']:
                    for img in processed_image_data['images']:
                        images_collection.insert_one(img)
                    print(f"💾 Stored {len(processed_image_data['images'])} images in database")
                
                # Analyze images for algorithm
                image_analysis = image_handler.analyze_images_for_algorithm(extracted_images)
                
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
            
            # Image processing fields
            "cover_image_id": processed_image_data['cover_image_id'] if processed_image_data else None,
            "image_count": processed_image_data['total_count'] if processed_image_data else 0,
            "has_images": bool(processed_image_data and processed_image_data['total_count'] > 0),
            
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

# Multi-file article upload endpoint
@app.post("/api/articles/multi-upload")
async def create_article_multi_file(
    title: str = Form(...),
    subspecialty: str = Form("sportsMedicine"),
    evidence_strength: float = Form(0.5),
    meta_description: Optional[str] = Form(None),
    files: List[UploadFile] = File(...)
):
    """
    Create article with HTML file and multiple local image files.
    First file must be HTML, remaining files are images.
    """
    try:
        print(f"\n🆕 Creating article with multi-file upload: {title}")
        print(f"📁 Files received: {len(files)}")
        
        # Check for duplicate articles by title
        existing_article = articles_collection.find_one({"title": title})
        if existing_article:
            print(f"⚠️ Article with title '{title}' already exists")
            raise HTTPException(
                status_code=409, 
                detail=f"An article with the title '{title}' already exists. Please use a different title."
            )
        
        # Validate we have at least one file
        if not files:
            raise HTTPException(status_code=400, detail="No files provided")
        
        # First file should be HTML
        html_file = files[0]
        if not html_file.filename.lower().endswith(('.html', '.htm')):
            raise HTTPException(status_code=400, detail="First file must be HTML")
        
        # Read HTML content
        html_content = await html_file.read()
        html_content = html_content.decode('utf-8')
        print(f"📄 HTML file: {html_file.filename} ({len(html_content)} characters)")
        
        # Process image files (remaining files)
        image_files = {}
        for file in files[1:]:
            # Check if it's an image file
            file_ext = file.filename.lower().split('.')[-1]
            if file_ext in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']:
                file_content = await file.read()
                # Store by filename (case-insensitive key)
                image_files[file.filename.lower()] = {
                    'filename': file.filename,
                    'content': file_content,
                    'content_type': file.content_type
                }
                print(f"🖼️ Image file: {file.filename} ({len(file_content)} bytes)")
        
        print(f"📊 Total images uploaded: {len(image_files)}")
        
        # Generate unique article ID
        article_id = str(uuid.uuid4())
        
        # Extract image references from HTML
        soup = BeautifulSoup(html_content, 'html.parser')
        img_tags = soup.find_all('img')
        print(f"🔍 Found {len(img_tags)} img tags in HTML")
        
        # Cloudinary image handler instance
        cloudinary_handler = CloudinaryImageHandler()
        processed_images = []
        unmatched_references = []
        
        # Process each image reference
        for img in img_tags:
            src = img.get('src', '')
            if not src:
                continue
                
            # Skip URLs and data URIs
            if src.startswith(('http://', 'https://', 'data:')):
                continue
            
            # Extract filename from path (handle relative paths)
            filename = src.split('/')[-1].lower()
            
            print(f"🔎 Looking for image: {src} -> {filename}")
            
            # Try to find matching uploaded file
            if filename in image_files:
                print(f"✅ Matched: {filename}")
                img_data = image_files[filename]
                
                # Calculate image hash to check for duplicates
                image_hash = hashlib.md5(img_data['content']).hexdigest()
                
                # Check if image already exists by hash
                existing_image = images_collection.find_one({'hash': image_hash})
                
                if existing_image:
                    print(f"♻️ Reusing existing image with hash: {image_hash}")
                    # Create a reference to the existing image for this article
                    cloudinary_result = existing_image.copy()
                    cloudinary_result['_id'] = None  # Remove _id to create new document
                    cloudinary_result['article_id'] = article_id
                    cloudinary_result['original_filename'] = img_data['filename']
                    cloudinary_result['alt'] = img.get('alt', '')
                    cloudinary_result['title'] = img.get('title', '')
                else:
                    # Generate unique image ID
                    image_id = f"img_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"
                    
                    # Upload to Cloudinary
                    cloudinary_result = cloudinary_handler.upload_to_cloudinary(
                        img_data['content'], 
                        image_id, 
                        folder=f"articles/{article_id}"
                    )
                
                if cloudinary_result:
                    # Add metadata
                    cloudinary_result['article_id'] = article_id
                    cloudinary_result['original_filename'] = img_data['filename']
                    cloudinary_result['alt'] = img.get('alt', '')
                    cloudinary_result['title'] = img.get('title', '')
                    
                    # Store in database (metadata only, not image data)
                    images_collection.insert_one(cloudinary_result)
                    processed_images.append(cloudinary_result)
                    
                    # Update HTML with Cloudinary URL
                    img['src'] = cloudinary_result['urls']['medium']
                    img['data-original-src'] = src
                    img['data-image-id'] = cloudinary_result['id']
            else:
                print(f"⚠️ Unmatched reference: {src}")
                unmatched_references.append(src)
        
        # Process any orphaned images (uploaded but not referenced)
        orphaned_images = []
        for filename, img_data in image_files.items():
            if not any(p.get('original_filename', '').lower() == filename for p in processed_images):
                print(f"📎 Processing orphaned image: {img_data['filename']}")
                
                # Calculate image hash to check for duplicates
                image_hash = hashlib.md5(img_data['content']).hexdigest()
                
                # Check if image already exists by hash
                existing_image = images_collection.find_one({'hash': image_hash})
                
                if existing_image:
                    print(f"♻️ Reusing existing orphaned image with hash: {image_hash}")
                    # Create a reference to the existing image for this article
                    cloudinary_result = existing_image.copy()
                    cloudinary_result['_id'] = None  # Remove _id to create new document
                    cloudinary_result['article_id'] = article_id
                    cloudinary_result['original_filename'] = img_data['filename']
                    cloudinary_result['orphaned'] = True
                else:
                    # Generate unique image ID for orphaned image
                    image_id = f"img_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"
                    
                    # Upload to Cloudinary
                    cloudinary_result = cloudinary_handler.upload_to_cloudinary(
                        img_data['content'], 
                        image_id, 
                        folder=f"articles/{article_id}/orphaned"
                    )
                
                if cloudinary_result:
                    cloudinary_result['article_id'] = article_id
                    cloudinary_result['original_filename'] = img_data['filename']
                    cloudinary_result['orphaned'] = True
                    images_collection.insert_one(cloudinary_result)
                    orphaned_images.append(cloudinary_result)
        
        # Get updated HTML
        updated_html = str(soup)
        
        # Extract text content for processing
        processed_content = re.sub('<[^<]+?>', '', updated_html)
        print(f"🔤 Extracted text length: {len(processed_content)} characters")
        
        # Process with algorithm
        algorithm_result = process_article_with_manual_algorithm(
            content=processed_content
        )
        
        # Create article document
        article = {
            "id": article_id,  # Use 'id' for consistency
            "title": title,
            "subspecialty": subspecialty,
            "content": processed_content,
            "html_content": updated_html,
            "meta_description": meta_description or f"Medical research on {title}",
            "evidence_strength": evidence_strength,
            "published_date": datetime.utcnow(),  # Use 'published_date' for consistency
            "content_type": "html",
            "file_data": {
                "filename": html_file.filename,
                "content_type": html_file.content_type,
                "size": len(html_content),
                "content": updated_html,
                "image_processing": {
                    "total_uploaded": len(image_files),
                    "matched": len(processed_images),
                    "orphaned": len(orphaned_images),
                    "unmatched_references": unmatched_references
                }
            },
            "algorithm_result": algorithm_result,
            "view_count": 0
        }
        
        # Insert article
        articles_collection.insert_one(article)
        print(f"💾 Article saved with ID: {article_id}")
        
        # Process emotional data
        emotional_data = await process_article_emotions(processed_content)
        
        # Generate emotional signature
        signature_data = generate_emotional_signature(emotional_data)
        
        # Generate artwork
        artwork = await generate_artwork(article_id, emotional_data, signature_data)
        
        # Update algorithm state
        await update_algorithm_state(emotional_data)
        
        # MongoDB automatically adds _id, convert it to string for JSON serialization
        if "_id" in article:
            article["_id"] = str(article["_id"])
        
        print(f"\n✅ Multi-file article creation complete!")
        print(f"   Images matched: {len(processed_images)}/{len(img_tags)}")
        print(f"   Orphaned images: {len(orphaned_images)}")
        print(f"   Unmatched references: {len(unmatched_references)}")
        
        return {
            "article": article,
            "artwork": artwork,
            "image_processing": {
                "matched": len(processed_images),
                "orphaned": len(orphaned_images),
                "unmatched": unmatched_references,
                "total_uploaded": len(image_files)
            }
        }
        
    except Exception as e:
        print(f"❌ Error in multi-file upload: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/articles")
async def get_articles(
    subspecialty: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    fields: Optional[str] = None
):
    """Get articles with optional filtering and pagination"""
    try:
        # Build query
        query = {}
        if subspecialty:
            query["subspecialty"] = subspecialty
        
        # Build projection (exclude heavy fields for list views)
        projection = {}
        if fields:
            field_list = fields.split(',')
            projection = {field: 1 for field in field_list}
            projection["_id"] = 1
        else:
            # Default: exclude heavy content fields
            projection = {
                "content": 0,
                "html_content": 0,
                "algorithm_parameters.statistical_data": 0
            }
        
        # Calculate pagination
        skip = (page - 1) * limit
        
        # Get total count for pagination info
        total = articles_collection.count_documents(query)
        
        # Get articles with pagination
        articles = list(articles_collection
                       .find(query, projection)
                       .sort("published_date", -1)
                       .skip(skip)
                       .limit(limit))
        
        # Convert ObjectIds to strings
        for article in articles:
            article["_id"] = str(article["_id"])
            
        return {
            "articles": articles,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/articles/{article_id}")
async def get_article(article_id: str):
    """Get specific article by ID"""
    try:
        # Try to find by 'id' field first, then by '_id' field for backwards compatibility
        article = articles_collection.find_one({"$or": [{"id": article_id}, {"_id": article_id}]})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
            
        article["_id"] = str(article["_id"])
        return article
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/artworks")
async def get_artworks(
    subspecialty: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    fields: Optional[str] = None
):
    """Get artworks with optional filtering and pagination"""
    try:
        # Build query
        query = {}
        if subspecialty:
            query["subspecialty"] = subspecialty
        
        # Build projection (exclude heavy fields for list views)
        projection = {}
        if fields:
            field_list = fields.split(',')
            projection = {field: 1 for field in field_list}
            projection["_id"] = 1
        else:
            # Default: exclude heavy algorithm parameters
            projection = {
                "algorithm_parameters.statistical_data": 0,
                "algorithm_parameters.raw_emotional_data": 0
            }
        
        # Calculate pagination
        skip = (page - 1) * limit
        
        # Get total count for pagination info
        total = artworks_collection.count_documents(query)
        
        # Get artworks with pagination
        artworks = list(artworks_collection
                       .find(query, projection)
                       .sort("created_date", -1)
                       .skip(skip)
                       .limit(limit))
        
        # Convert ObjectIds to strings
        for artwork in artworks:
            artwork["_id"] = str(artwork["_id"])
            
        return {
            "artworks": artworks,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
        
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

@app.get("/api/articles/{article_id}/images")
async def get_article_images(article_id: str):
    """Get all images associated with an article"""
    try:
        # Verify article exists - check both 'id' and '_id' fields
        article = articles_collection.find_one({"$or": [{"id": article_id}, {"_id": article_id}]})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Get images from the images collection
        images = list(images_collection.find({"article_id": article_id}))
        
        # Convert ObjectIds to strings and prepare response
        for img in images:
            img["_id"] = str(img["_id"])
            # Remove large data fields for list view
            if "versions" in img:
                for version in img["versions"]:
                    if "data" in img["versions"][version]:
                        del img["versions"][version]["data"]
        
        return {
            "article_id": article_id,
            "images": images,
            "total_count": len(images),
            "cover_image_id": article.get("cover_image_id")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/images/{image_id}")
async def get_image(image_id: str, version: str = "medium"):
    """Get specific image by ID with requested version - redirects to Cloudinary URL"""
    try:
        image = images_collection.find_one({"id": image_id})
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Validate version
        if version not in ["thumbnail", "small", "medium", "large", "original"]:
            version = "medium"
        
        # For Cloudinary images, return URL instead of data
        if "urls" in image and version in image["urls"]:
            from fastapi.responses import RedirectResponse
            return RedirectResponse(url=image["urls"][version], status_code=302)
        
        # Fallback for legacy base64 images (if any exist)
        elif "versions" in image and version in image["versions"]:
            version_data = image["versions"][version]
            return {
                "id": image["id"],
                "article_id": image.get("article_id"),
                "version": version,
                "format": "webp",
                "dimensions": version_data["dimensions"],
                "size": version_data["size"],
                "data": version_data["data"],
                "alt": image.get("alt", ""),
                "title": image.get("title", "")
            }
        else:
            raise HTTPException(status_code=404, detail=f"Version '{version}' not found")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/articles/{article_id}/cover-image")
async def update_article_cover_image(article_id: str, image_data: dict):
    """Update the cover image for an article"""
    try:
        # Verify article exists
        article = articles_collection.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        image_id = image_data.get("image_id")
        
        # Verify image exists and belongs to this article
        if image_id:
            image = images_collection.find_one({"id": image_id, "article_id": article_id})
            if not image:
                raise HTTPException(status_code=404, detail="Image not found or does not belong to this article")
        
        # Update article with new cover image
        articles_collection.update_one(
            {"id": article_id},
            {"$set": {"cover_image_id": image_id}}
        )
        
        return {
            "article_id": article_id,
            "cover_image_id": image_id,
            "message": "Cover image updated successfully"
        }
        
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
        print(f"[ADMIN API] Found {len(articles)} articles in database")
        
        # Convert ObjectIds to strings and add admin metadata
        for article in articles:
            article["_id"] = str(article["_id"])
            
            # Convert datetime objects to ISO format strings
            if "published_date" in article and hasattr(article["published_date"], "isoformat"):
                article["published_date"] = article["published_date"].isoformat()
            if "created_date" in article and hasattr(article["created_date"], "isoformat"):
                article["created_date"] = article["created_date"].isoformat()
            if "updated_date" in article and hasattr(article["updated_date"], "isoformat"):
                article["updated_date"] = article["updated_date"].isoformat()
            
            # Get article ID (handle both 'id' and '_id' formats)
            article_id = article.get("id") or article.get("_id")
            
            if article_id:
                # Add associated artwork count
                artwork_count = artworks_collection.count_documents({"article_id": article_id})
                article["artwork_count"] = artwork_count
                
                # Add feedback count
                feedback_count = feedback_collection.count_documents({"article_id": article_id})
                article["feedback_count"] = feedback_count
                
                # Ensure article has 'id' field for frontend compatibility
                if "id" not in article:
                    article["id"] = article_id
            else:
                print(f"[ADMIN API WARNING] Article missing ID: {article.get('title', 'Unknown')}")
                article["artwork_count"] = 0
                article["feedback_count"] = 0
            
        print(f"[ADMIN API] Returning {len(articles)} articles with metadata")
        return {"articles": articles, "total": len(articles)}
        
    except Exception as e:
        print(f"[ADMIN API ERROR] {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
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
                    "avg_uniqueness": {"$avg": "$algorithm_parameters.comprehensive_metadata.ai_analysis_data.uniqueness_factors.overall_uniqueness"},
                    "avg_complexity": {"$avg": "$algorithm_parameters.comprehensive_metadata.visual_characteristics.pattern_complexity"},
                    "pattern_types": {"$addToSet": "$algorithm_parameters.comprehensive_metadata.pattern_usage.tree_pattern_signature"}
                }
            }
        ]
        
        subspecialty_analysis = list(artworks_collection.aggregate(pipeline))
        
        # Pattern frequency analysis
        pattern_frequency_pipeline = [
            {"$unwind": "$algorithm_parameters.comprehensive_metadata.pattern_usage.tree_pattern_signature"},
            {"$group": {
                "_id": "$algorithm_parameters.comprehensive_metadata.pattern_usage.tree_pattern_signature",
                "frequency": {"$sum": 1}
            }},
            {"$sort": {"frequency": -1}},
            {"$limit": 20}
        ]
        
        pattern_frequency = list(artworks_collection.aggregate(pattern_frequency_pipeline))
        
        # Recent evolution trends
        recent_artworks = list(artworks_collection.find(
            {},
            {"algorithm_parameters.comprehensive_metadata": 1, "created_date": 1, "subspecialty": 1, "id": 1}
        ).sort("created_date", -1).limit(50))
        
        # Convert ObjectIds to strings
        for artwork in recent_artworks:
            artwork["_id"] = str(artwork["_id"])
        
        # Calculate metadata completeness
        total = artworks_collection.count_documents({})
        with_metadata = artworks_collection.count_documents({
            "algorithm_parameters.comprehensive_metadata.visual_characteristics": {"$exists": True, "$ne": {}}
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
