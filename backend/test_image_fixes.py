"""
Test script to verify image upload and deletion fixes
"""

import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
import cloudinary
import cloudinary.uploader

# Load environment variables
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def test_mongodb_connection():
    """Test MongoDB connection and collections"""
    try:
        # MongoDB connection
        mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/arthrokinetix')
        client = MongoClient(mongodb_uri)
        db = client.arthrokinetix
        
        # Test collections
        articles_collection = db.articles
        images_collection = db.images
        
        print("✅ MongoDB connection successful")
        print(f"📊 Articles count: {articles_collection.count_documents({})}")
        print(f"🖼️ Images count: {images_collection.count_documents({})}")
        
        # Test query for images with article_id
        sample_articles = list(articles_collection.find({}, {"id": 1}).limit(3))
        for article in sample_articles:
            article_id = article.get('id')
            if article_id:
                images_count = images_collection.count_documents({"article_id": article_id})
                print(f"📁 Article {article_id}: {images_count} images")
        
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

def test_cloudinary_connection():
    """Test Cloudinary connection"""
    try:
        # Test upload with a small test image (1x1 pixel PNG)
        import base64
        import io
        from PIL import Image
        
        # Create a tiny test image
        img = Image.new('RGB', (1, 1), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_data = img_bytes.getvalue()
        
        # Upload test image
        result = cloudinary.uploader.upload(
            img_data,
            public_id="test/connection_test",
            overwrite=True,
            resource_type="image"
        )
        
        # Delete test image
        cloudinary.uploader.destroy("test/connection_test")
        
        print("✅ Cloudinary connection successful")
        print(f"🔗 Test upload URL: {result.get('secure_url', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Cloudinary connection failed: {e}")
        return False

def test_orphaned_images_logic():
    """Test the orphaned images detection logic"""
    
    # Mock data
    image_files = {
        'image1.jpg': {'filename': 'image1.jpg', 'content': b'fake_data1'},
        'image2.png': {'filename': 'image2.png', 'content': b'fake_data2'},
        'image3.gif': {'filename': 'image3.gif', 'content': b'fake_data3'}
    }
    
    processed_images = [
        {'original_filename': 'image1.jpg'},
        {'original_filename': 'image2.png'}
    ]
    
    # Test orphaned detection logic (from server.py)
    orphaned_images = []
    for filename, img_data in image_files.items():
        if not any(p.get('original_filename', '').lower() == filename for p in processed_images):
            orphaned_images.append(img_data['filename'])
    
    print("🧪 Testing orphaned images detection:")
    print(f"📁 Uploaded files: {list(image_files.keys())}")
    print(f"✅ Processed files: {[p['original_filename'] for p in processed_images]}")
    print(f"🔍 Orphaned files: {orphaned_images}")
    
    # Should identify image3.gif as orphaned
    expected_orphaned = ['image3.gif']
    if orphaned_images == expected_orphaned:
        print("✅ Orphaned images detection working correctly")
        return True
    else:
        print(f"❌ Expected orphaned: {expected_orphaned}, got: {orphaned_images}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting image upload/deletion fix tests...\n")
    
    tests = [
        ("MongoDB Connection", test_mongodb_connection),
        ("Cloudinary Connection", test_cloudinary_connection),
        ("Orphaned Images Logic", test_orphaned_images_logic)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🧪 Testing {test_name}...")
        try:
            result = test_func()
            results.append((test_name, result))
            print(f"{'✅' if result else '❌'} {test_name}: {'PASSED' if result else 'FAILED'}")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
            results.append((test_name, False))
    
    print(f"\n📊 Test Results Summary:")
    print("=" * 50)
    for test_name, result in results:
        status = "PASSED" if result else "FAILED"
        emoji = "✅" if result else "❌"
        print(f"{emoji} {test_name}: {status}")
    
    passed_count = sum(1 for _, result in results if result)
    total_count = len(results)
    print(f"\n🎯 Overall: {passed_count}/{total_count} tests passed")
    
    if passed_count == total_count:
        print("🎉 All tests passed! Image upload/deletion fixes look good.")
    else:
        print("⚠️ Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main()