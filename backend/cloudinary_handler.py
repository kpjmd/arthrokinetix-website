"""
Cloudinary Image Handler for Arthrokinetix
Replaces MongoDB base64 storage with cloud-based image management
"""

import os
import io
import base64
import hashlib
from typing import List, Dict, Optional, Union
from datetime import datetime
import uuid
from PIL import Image
import cloudinary
import cloudinary.uploader
import cloudinary.utils
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import requests

class CloudinaryImageHandler:
    def __init__(self):
        # Configure Cloudinary
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
            api_key=os.getenv('CLOUDINARY_API_KEY'),
            api_secret=os.getenv('CLOUDINARY_API_SECRET')
        )
        
        self.supported_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
        self.max_image_size = 10 * 1024 * 1024  # 10MB
        
        # Cloudinary transformation presets
        self.transformations = {
            'thumbnail': {'width': 300, 'height': 300, 'crop': 'fill', 'quality': 'auto:good'},
            'small': {'width': 400, 'height': 400, 'crop': 'limit', 'quality': 'auto:good'},
            'medium': {'width': 800, 'height': 800, 'crop': 'limit', 'quality': 'auto:good'},
            'large': {'width': 1200, 'height': 1200, 'crop': 'limit', 'quality': 'auto:best'},
            'original': {'quality': 'auto:best', 'fetch_format': 'auto'}
        }

    def extract_images_from_html(self, html_content: str, base_url: Optional[str] = None) -> List[Dict]:
        """Extract images from HTML content - same as original but for Cloudinary"""
        images = []
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Find all img tags
        for img in soup.find_all('img'):
            image_info = {
                'src': img.get('src', ''),
                'alt': img.get('alt', ''),
                'title': img.get('title', ''),
                'width': img.get('width', ''),
                'height': img.get('height', ''),
                'type': 'embedded'
            }
            
            # Handle relative URLs
            if base_url and image_info['src'] and not image_info['src'].startswith(('http://', 'https://', 'data:')):
                image_info['src'] = urljoin(base_url, image_info['src'])
            
            # Extract data URLs
            if image_info['src'].startswith('data:'):
                image_info['type'] = 'data_url'
                image_info['data'] = self._extract_data_url(image_info['src'])
            
            images.append(image_info)
        
        return images

    def _extract_data_url(self, data_url: str) -> str:
        """Extract base64 data from data URL"""
        if 'base64,' in data_url:
            return data_url.split('base64,')[1]
        return ''

    def download_external_image(self, url: str) -> Optional[Dict]:
        """Download external image for processing"""
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                return {
                    'data': base64.b64encode(response.content).decode('utf-8'),
                    'content_type': response.headers.get('content-type', 'image/jpeg')
                }
        except Exception as e:
            print(f"Failed to download image {url}: {e}")
        return None

    def upload_to_cloudinary(self, image_data: bytes, image_id: str, folder: str = "articles") -> Dict:
        """
        Upload image to Cloudinary and return URLs for different sizes
        
        Args:
            image_data: Raw image bytes
            image_id: Unique identifier for the image
            folder: Cloudinary folder to organize images
            
        Returns:
            Dict with Cloudinary URLs and metadata
        """
        try:
            # Validate image data
            if not image_data or len(image_data) == 0:
                print(f"❌ Empty image data for {image_id}")
                return None
                
            if len(image_data) > self.max_image_size:
                print(f"❌ Image {image_id} too large: {len(image_data)} bytes")
                return None
            
            # Create a unique public_id for Cloudinary
            public_id = f"{folder}/{image_id}"
            print(f"🔄 Uploading to Cloudinary with public_id: {public_id}")
            
            # Upload original image to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image_data,
                public_id=public_id,
                overwrite=True,
                resource_type="image",
                **self.transformations['original']
            )
            
            print(f"✅ Cloudinary upload successful: {upload_result.get('secure_url', 'No URL')}")
            
            # Generate URLs for different sizes
            urls = {}
            for size_name, transformation in self.transformations.items():
                if size_name == 'original':
                    urls[size_name] = upload_result['secure_url']
                else:
                    url, _ = cloudinary.utils.cloudinary_url(
                        public_id,
                        **transformation
                    )
                    urls[size_name] = url
            
            # Get image metadata
            image = Image.open(io.BytesIO(image_data))
            
            return {
                'id': image_id,
                'public_id': public_id,
                'urls': urls,
                'cloudinary_data': {
                    'public_id': upload_result['public_id'],
                    'version': upload_result['version'],
                    'format': upload_result['format'],
                    'resource_type': upload_result['resource_type'],
                    'secure_url': upload_result['secure_url']
                },
                'metadata': {
                    'width': upload_result['width'],
                    'height': upload_result['height'],
                    'format': upload_result['format'],
                    'bytes': upload_result['bytes'],
                    'original_format': image.format.lower() if image.format else 'unknown'
                },
                'created_at': datetime.utcnow().isoformat(),
                'hash': hashlib.md5(image_data).hexdigest()
            }
            
        except Exception as e:
            print(f"❌ Error uploading {image_id} to Cloudinary: {e}")
            import traceback
            print(f"📋 Traceback: {traceback.format_exc()}")
            return None

    def process_article_images(self, images: List[Dict], article_id: str) -> Dict:
        """
        Process all images for an article using Cloudinary
        
        Args:
            images: List of extracted images
            article_id: Article ID for organization
            
        Returns:
            Dict with processed images and metadata
        """
        processed_images = []
        cover_image_candidates = []
        
        for idx, img in enumerate(images):
            try:
                # Skip if no actual image data
                if not img.get('data') and not img.get('src'):
                    continue
                
                # Get image data
                image_data = None
                if img.get('data'):
                    # Already have data (from PDF or data URL)
                    if isinstance(img['data'], str):
                        image_data = base64.b64decode(img['data'])
                    else:
                        image_data = img['data']
                elif img.get('src') and img['src'].startswith('http'):
                    # Download external image
                    downloaded = self.download_external_image(img['src'])
                    if downloaded:
                        image_data = base64.b64decode(downloaded['data'])
                
                if not image_data:
                    continue
                
                # Generate unique image ID
                image_id = f"img_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"
                
                # Upload to Cloudinary
                cloudinary_result = self.upload_to_cloudinary(
                    image_data, 
                    image_id, 
                    folder=f"articles/{article_id}"
                )
                
                if not cloudinary_result:
                    continue
                
                # Add article metadata
                cloudinary_result['article_id'] = article_id
                cloudinary_result['index'] = idx
                cloudinary_result['alt'] = img.get('alt', '')
                cloudinary_result['title'] = img.get('title', '')
                cloudinary_result['source_type'] = img.get('type', 'unknown')
                
                # Determine if this could be a cover image
                # Cover images are typically larger and appear early
                is_potential_cover = (
                    idx < 3 and  # Early in the article
                    cloudinary_result['metadata']['width'] > 400 and
                    cloudinary_result['metadata']['height'] > 300
                )
                
                if is_potential_cover:
                    cover_image_candidates.append(cloudinary_result)
                
                processed_images.append(cloudinary_result)
                
            except Exception as e:
                print(f"Error processing image {idx}: {e}")
                continue
        
        # Select best cover image
        cover_image = None
        if cover_image_candidates:
            # Prefer larger images for cover
            cover_image = max(
                cover_image_candidates,
                key=lambda x: x['metadata']['width'] * x['metadata']['height']
            )
        elif processed_images:
            cover_image = processed_images[0]
        
        return {
            'images': processed_images,
            'cover_image': cover_image,
            'total_count': len(processed_images),
            'cover_image_id': cover_image['id'] if cover_image else None
        }

    def analyze_images_for_algorithm(self, images: List[Dict]) -> Dict:
        """
        Analyze images for algorithm processing - same as original
        """
        analysis = {
            'total_images': len(images),
            'has_medical_imagery': False,
            'image_types': [],
            'dominant_colors': [],
            'complexity_score': 0.0
        }
        
        for img in images:
            # Basic type analysis
            if img.get('alt', '').lower():
                alt_text = img['alt'].lower()
                if any(term in alt_text for term in ['anatomy', 'surgery', 'medical', 'bone', 'muscle', 'joint']):
                    analysis['has_medical_imagery'] = True
                
                # Categorize image types
                if 'diagram' in alt_text or 'chart' in alt_text:
                    analysis['image_types'].append('diagram')
                elif 'x-ray' in alt_text or 'scan' in alt_text:
                    analysis['image_types'].append('scan')
                elif 'anatomy' in alt_text:
                    analysis['image_types'].append('anatomy')
        
        # Calculate complexity based on number and types
        analysis['complexity_score'] = min(1.0, len(images) * 0.2)
        
        return analysis

    def get_image_url(self, image_id: str, size: str = 'medium') -> Optional[str]:
        """
        Get Cloudinary URL for an image by ID and size
        
        Args:
            image_id: The image ID
            size: Size variant (thumbnail, small, medium, large, original)
            
        Returns:
            Cloudinary URL or None if not found
        """
        # This would typically query the database for the image record
        # and return the appropriate URL from the stored urls dict
        # For now, we'll construct it from the public_id pattern
        public_id = f"articles/{image_id}"
        
        if size in self.transformations and size != 'original':
            url, _ = cloudinary.utils.cloudinary_url(
                public_id,
                **self.transformations[size]
            )
            return url
        else:
            # Return original or construct URL
            url, _ = cloudinary.utils.cloudinary_url(
                public_id,
                **self.transformations['original']
            )
            return url