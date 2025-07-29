#!/usr/bin/env python3
"""
Test script to verify image upload fixes
Creates test files and simulates the upload process
"""

import os
import sys
import tempfile
import requests
import json
from pathlib import Path
from PIL import Image
import io

def create_test_html_with_images():
    """Create test HTML file with image references"""
    html_content = """<!DOCTYPE html>
<html>
<head>
    <title>SLAP Repair Test Article</title>
</head>
<body>
    <h1>SLAP Repair Surgical Techniques</h1>
    
    <p>This article covers surgical techniques for SLAP tears.</p>
    
    <h2>Anatomical Overview</h2>
    <img src="anatomy_diagram.jpg" alt="Shoulder anatomy diagram" title="Shoulder Anatomy">
    <p>The shoulder anatomy shows the labrum and biceps attachment.</p>
    
    <h2>Surgical Approach</h2>
    <img src="surgical-approach.png" alt="Surgical approach illustration" title="Surgical Approach">
    <p>The arthroscopic approach provides excellent visualization.</p>
    
    <h2>Repair Techniques</h2>
    <img src="repair_technique_1.gif" alt="Repair technique step 1" title="Repair Step 1">
    <img src="repair technique 2.jpg" alt="Repair technique step 2" title="Repair Step 2">
    <p>Multiple repair techniques are available.</p>
    
    <h2>Post-operative Care</h2>
    <img src="postop%20care.webp" alt="Post-operative care instructions" title="Post-op Care">
    <p>Follow-up care is essential for optimal outcomes.</p>
</body>
</html>"""
    return html_content

def create_test_images():
    """Create test image files with different formats and names"""
    test_images = {}
    
    # Create different colored test images
    colors = [
        ('anatomy_diagram.jpg', 'red'),
        ('surgical-approach.png', 'blue'), 
        ('repair_technique_1.gif', 'green'),
        ('repair technique 2.jpg', 'yellow'),  # Note: space in filename
        ('postop care.webp', 'purple'),       # Note: space and URL encoding test
        ('extra_orphan_image.jpg', 'orange'), # This should be orphaned
        ('another_orphan.png', 'cyan')        # This should also be orphaned
    ]
    
    for filename, color in colors:
        # Create a simple colored image
        img = Image.new('RGB', (100, 100), color)
        img_bytes = io.BytesIO()
        
        # Determine format from extension
        ext = filename.lower().split('.')[-1]
        if ext == 'jpg':
            img.save(img_bytes, format='JPEG')
        elif ext == 'png':
            img.save(img_bytes, format='PNG')
        elif ext == 'gif':
            img.save(img_bytes, format='GIF')
        elif ext == 'webp':
            img.save(img_bytes, format='WEBP')
        else:
            img.save(img_bytes, format='JPEG')
        
        test_images[filename] = img_bytes.getvalue()
    
    return test_images

def test_filename_normalization():
    """Test the filename normalization logic locally"""
    import urllib.parse
    
    def normalize_filename(src_path):
        """Replicate the normalization logic from server"""
        # Handle both forward and backward slashes
        filename = src_path.replace('\\', '/').split('/')[-1]
        
        # Remove query parameters and fragments
        if '?' in filename:
            filename = filename.split('?')[0]
        if '#' in filename:
            filename = filename.split('#')[0]
        
        # URL decode the filename
        try:
            filename = urllib.parse.unquote(filename)
        except:
            pass
        
        return filename.lower().strip()
    
    test_cases = [
        ('anatomy_diagram.jpg', 'anatomy_diagram.jpg'),
        ('images/surgical-approach.png', 'surgical-approach.png'),
        ('repair%20technique%202.jpg', 'repair technique 2.jpg'),
        ('postop%20care.webp?v=123', 'postop care.webp'),
        ('path\\to\\image.jpg', 'image.jpg'),  # Windows path
        ('../images/test.png#anchor', 'test.png')
    ]
    
    print("🧪 Testing filename normalization:")
    all_passed = True
    for src, expected in test_cases:
        result = normalize_filename(src)
        passed = result == expected
        print(f"   {'✅' if passed else '❌'} '{src}' → '{result}' (expected: '{expected}')")
        if not passed:
            all_passed = False
    
    return all_passed

def test_upload_via_api(base_url="http://localhost:8001"):
    """Test the actual upload via API"""
    print(f"\n🚀 Testing upload via API at {base_url}")
    
    # Create test files
    html_content = create_test_html_with_images()
    test_images = create_test_images()
    
    # Prepare multipart form data
    files = [
        ('files', ('test_slap_article.html', html_content, 'text/html'))
    ]
    
    # Add image files
    for filename, image_data in test_images.items():
        files.append(('files', (filename, image_data, 'image/jpeg')))
    
    # Prepare form data
    data = {
        'title': 'Test SLAP Repair Article with Image Fixes',
        'subspecialty': 'sportsMedicine',
        'evidence_strength': 0.8,
        'meta_description': 'Test article to verify image upload fixes'
    }
    
    try:
        print(f"📤 Uploading 1 HTML file + {len(test_images)} images...")
        response = requests.post(
            f'{base_url}/api/articles/multi-upload',
            files=files,
            data=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            article_id = result.get('id')
            print(f"✅ Upload successful! Article ID: {article_id}")
            
            # Print processing summary
            if 'file_data' in result and 'image_processing' in result['file_data']:
                processing = result['file_data']['image_processing']
                print(f"📊 Processing Summary:")
                print(f"   • Total uploaded: {processing.get('total_uploaded', 0)}")
                print(f"   • Matched: {processing.get('matched', 0)}")
                print(f"   • Orphaned: {processing.get('orphaned', 0)}")
                print(f"   • Unmatched: {len(processing.get('unmatched_references', []))}")
                
                if processing.get('unmatched_references'):
                    print(f"   • Unmatched references: {processing['unmatched_references']}")
            
            return True, article_id
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False, None

def test_cleanup_orphaned_images(base_url="http://localhost:8001"):
    """Test the orphaned image cleanup endpoint"""
    print(f"\n🧹 Testing orphaned image cleanup...")
    
    try:
        response = requests.delete(f'{base_url}/api/admin/cleanup-orphaned-images')
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Cleanup successful!")
            print(f"   • Orphaned images found: {result.get('orphaned_count', 0)}")
            print(f"   • Deleted from DB: {result.get('deleted_from_db', 0)}")
            
            if result.get('cloudinary_errors'):
                print(f"   • Cloudinary errors: {len(result['cloudinary_errors'])}")
            
            return True
        else:
            print(f"❌ Cleanup failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False

def main():
    """Run all tests"""
    print("🔧 Testing Image Upload Fixes")
    print("=" * 50)
    
    # Test 1: Filename normalization logic
    norm_test_passed = test_filename_normalization()
    
    # Test 2: Try to upload via API (if server is running)
    upload_test_passed, article_id = test_upload_via_api()
    
    # Test 3: Cleanup orphaned images
    cleanup_test_passed = test_cleanup_orphaned_images()
    
    # Summary
    print(f"\n📊 Test Results:")
    print(f"{'✅' if norm_test_passed else '❌'} Filename normalization: {'PASSED' if norm_test_passed else 'FAILED'}")
    print(f"{'✅' if upload_test_passed else '❌'} API upload test: {'PASSED' if upload_test_passed else 'FAILED'}")
    print(f"{'✅' if cleanup_test_passed else '❌'} Orphaned cleanup test: {'PASSED' if cleanup_test_passed else 'FAILED'}")
    
    if upload_test_passed:
        print(f"\n💡 Check the server logs to see detailed image processing information.")
        print(f"💡 Article ID: {article_id}")
        print(f"💡 Check MongoDB images collection and Cloudinary dashboard to verify all images were uploaded.")
    
    if not upload_test_passed:
        print(f"\n⚠️ API tests failed. Make sure the server is running at http://localhost:8001")
        print(f"💡 You can still run the server and test manually with a real SLAP article upload.")

if __name__ == "__main__":
    main()