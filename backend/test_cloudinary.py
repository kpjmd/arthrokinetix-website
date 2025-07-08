#!/usr/bin/env python3
"""
Quick test script to verify Cloudinary integration
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

def test_cloudinary_config():
    """Test that Cloudinary configuration is working"""
    print("🔧 Testing Cloudinary configuration...")
    
    # Check environment variables
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    
    if not all([cloud_name, api_key, api_secret]):
        print("❌ Missing Cloudinary environment variables")
        return False
    
    print(f"✅ Cloud Name: {cloud_name}")
    print(f"✅ API Key: {api_key[:10]}...")
    print(f"✅ API Secret: {'*' * len(api_secret)}")
    
    # Test Cloudinary import
    try:
        import cloudinary
        import cloudinary.uploader
        import cloudinary.utils
        print("✅ Cloudinary library imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import Cloudinary: {e}")
        print("Run: pip install cloudinary>=1.36.0")
        return False
    
    # Test configuration
    try:
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        print("✅ Cloudinary configured successfully")
    except Exception as e:
        print(f"❌ Failed to configure Cloudinary: {e}")
        return False
    
    # Test CloudinaryImageHandler import
    try:
        from cloudinary_handler import CloudinaryImageHandler
        handler = CloudinaryImageHandler()
        print("✅ CloudinaryImageHandler created successfully")
    except Exception as e:
        print(f"❌ Failed to create CloudinaryImageHandler: {e}")
        return False
    
    return True

def test_url_generation():
    """Test URL generation without uploading"""
    print("\n🔗 Testing URL generation...")
    
    try:
        import cloudinary.utils
        
        # Test URL generation
        url, options = cloudinary.utils.cloudinary_url(
            "test/sample",
            width=400,
            height=400,
            crop="limit",
            quality="auto:good"
        )
        
        print(f"✅ Generated URL: {url}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to generate URL: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Cloudinary Integration Test\n")
    
    config_ok = test_cloudinary_config()
    url_ok = test_url_generation()
    
    if config_ok and url_ok:
        print("\n🎉 All tests passed! Cloudinary integration is ready.")
        sys.exit(0)
    else:
        print("\n💥 Some tests failed. Please check the errors above.")
        sys.exit(1)