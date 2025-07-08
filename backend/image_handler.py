"""
Image Handler for Arthrokinetix
Extracts and processes images from HTML and PDF content
Supports WebP conversion and optimization
"""

import re
import base64
import hashlib
from typing import List, Dict, Optional, Tuple, Union
from urllib.parse import urlparse, urljoin
import requests
from bs4 import BeautifulSoup
import io
from PIL import Image
import PyPDF2
import fitz  # PyMuPDF for better PDF image extraction
from datetime import datetime
import uuid

class ImageHandler:
    def __init__(self):
        self.supported_formats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
        self.max_image_size = 10 * 1024 * 1024  # 10MB
        
    def extract_images_from_html(self, html_content: str, base_url: Optional[str] = None) -> List[Dict]:
        """Extract images from HTML content"""
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
        
        # Find images in CSS background-image
        style_images = self._extract_css_images(html_content, base_url)
        images.extend(style_images)
        
        return images
    
    def extract_images_from_pdf(self, pdf_content: bytes) -> List[Dict]:
        """Extract images from PDF content using PyMuPDF"""
        images = []
        
        try:
            # Open PDF with PyMuPDF
            pdf_document = fitz.open(stream=pdf_content, filetype="pdf")
            
            for page_num, page in enumerate(pdf_document):
                # Get list of images on the page
                image_list = page.get_images()
                
                for img_index, img in enumerate(image_list):
                    # Extract image data
                    xref = img[0]
                    pix = fitz.Pixmap(pdf_document, xref)
                    
                    # Convert to PIL Image
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_data = pix.tobytes("png")
                    else:  # CMYK
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                        img_data = pix.tobytes("png")
                    
                    # Create image info
                    image_info = {
                        'page': page_num + 1,
                        'index': img_index,
                        'width': pix.width,
                        'height': pix.height,
                        'type': 'pdf_embedded',
                        'format': 'png',
                        'data': base64.b64encode(img_data).decode('utf-8'),
                        'hash': hashlib.md5(img_data).hexdigest()
                    }
                    
                    images.append(image_info)
                    pix = None  # Free memory
            
            pdf_document.close()
            
        except Exception as e:
            print(f"Error extracting images from PDF: {e}")
            # Fallback to PyPDF2 if PyMuPDF fails
            images.extend(self._extract_images_pypdf2(pdf_content))
        
        return images
    
    def _extract_images_pypdf2(self, pdf_content: bytes) -> List[Dict]:
        """Fallback PDF image extraction using PyPDF2"""
        images = []
        
        try:
            pdf_file = io.BytesIO(pdf_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            for page_num, page in enumerate(pdf_reader.pages):
                if '/XObject' in page['/Resources']:
                    x_objects = page['/Resources']['/XObject'].get_object()
                    
                    for obj_name in x_objects:
                        obj = x_objects[obj_name]
                        if obj['/Subtype'] == '/Image':
                            # Extract basic image info
                            image_info = {
                                'page': page_num + 1,
                                'name': obj_name,
                                'width': obj.get('/Width', 0),
                                'height': obj.get('/Height', 0),
                                'type': 'pdf_embedded',
                                'format': 'unknown'
                            }
                            images.append(image_info)
        
        except Exception as e:
            print(f"PyPDF2 extraction error: {e}")
        
        return images
    
    def _extract_data_url(self, data_url: str) -> Dict:
        """Extract image data from data URL"""
        try:
            # Parse data URL
            header, data = data_url.split(',', 1)
            mime_type = re.search(r'data:([^;]+)', header).group(1)
            
            # Check if base64 encoded
            is_base64 = 'base64' in header
            
            return {
                'mime_type': mime_type,
                'is_base64': is_base64,
                'data': data,
                'size': len(base64.b64decode(data)) if is_base64 else len(data)
            }
        except Exception as e:
            print(f"Error extracting data URL: {e}")
            return {}
    
    def _extract_css_images(self, html_content: str, base_url: Optional[str] = None) -> List[Dict]:
        """Extract images from CSS background-image properties"""
        images = []
        
        # Find background-image in inline styles
        bg_pattern = r'background-image:\s*url\(["\']?([^"\']+)["\']?\)'
        matches = re.findall(bg_pattern, html_content, re.IGNORECASE)
        
        for match in matches:
            image_info = {
                'src': match,
                'type': 'css_background',
                'alt': '',
                'title': ''
            }
            
            # Handle relative URLs
            if base_url and not match.startswith(('http://', 'https://', 'data:')):
                image_info['src'] = urljoin(base_url, match)
            
            images.append(image_info)
        
        return images
    
    def download_external_image(self, url: str, timeout: int = 10) -> Optional[Dict]:
        """Download external image and convert to base64"""
        try:
            response = requests.get(url, timeout=timeout, stream=True)
            response.raise_for_status()
            
            # Check content type
            content_type = response.headers.get('Content-Type', '')
            if not content_type.startswith('image/'):
                return None
            
            # Check size
            content_length = int(response.headers.get('Content-Length', 0))
            if content_length > self.max_image_size:
                return None
            
            # Download image
            image_data = response.content
            
            # Open with PIL to validate and get dimensions
            img = Image.open(io.BytesIO(image_data))
            
            return {
                'url': url,
                'mime_type': content_type,
                'width': img.width,
                'height': img.height,
                'size': len(image_data),
                'data': base64.b64encode(image_data).decode('utf-8'),
                'format': img.format.lower() if img.format else 'unknown'
            }
            
        except Exception as e:
            print(f"Error downloading image {url}: {e}")
            return None
    
    def analyze_images_for_algorithm(self, images: List[Dict]) -> Dict:
        """Analyze extracted images for algorithm processing"""
        analysis = {
            'total_images': len(images),
            'image_types': {},
            'average_dimensions': {'width': 0, 'height': 0},
            'has_diagrams': False,
            'has_photos': False,
            'medical_imagery_confidence': 0.0,
            'dominant_colors': [],
            'complexity_score': 0.0
        }
        
        if not images:
            return analysis
        
        # Count image types
        for img in images:
            img_type = img.get('type', 'unknown')
            analysis['image_types'][img_type] = analysis['image_types'].get(img_type, 0) + 1
        
        # Calculate average dimensions
        width_sum = sum(int(img.get('width', 0)) for img in images if img.get('width'))
        height_sum = sum(int(img.get('height', 0)) for img in images if img.get('height'))
        count = sum(1 for img in images if img.get('width') and img.get('height'))
        
        if count > 0:
            analysis['average_dimensions']['width'] = width_sum // count
            analysis['average_dimensions']['height'] = height_sum // count
        
        # Simple heuristics for medical imagery
        medical_keywords = ['xray', 'scan', 'mri', 'ct', 'ultrasound', 'radiograph', 'medical', 'anatomy']
        for img in images:
            alt_text = img.get('alt', '').lower()
            title = img.get('title', '').lower()
            src = img.get('src', '').lower()
            
            if any(keyword in alt_text + title + src for keyword in medical_keywords):
                analysis['medical_imagery_confidence'] += 0.2
        
        analysis['medical_imagery_confidence'] = min(1.0, analysis['medical_imagery_confidence'])
        
        # Complexity based on number and variety of images
        analysis['complexity_score'] = min(1.0, (len(images) * 0.1) + (len(analysis['image_types']) * 0.2))
        
        return analysis
    
    def convert_to_webp(self, image_data: Union[bytes, str], quality: int = 85, optimize: bool = True) -> Dict:
        """
        Convert image to WebP format for optimal web performance
        
        Args:
            image_data: Image data as bytes or base64 string
            quality: WebP quality (1-100)
            optimize: Whether to optimize the image
            
        Returns:
            Dict with WebP data and metadata
        """
        try:
            # Handle base64 input
            if isinstance(image_data, str):
                # Remove data URL prefix if present
                if image_data.startswith('data:'):
                    header, data = image_data.split(',', 1)
                    image_data = base64.b64decode(data)
                else:
                    image_data = base64.b64decode(image_data)
            
            # Open image with PIL
            img = Image.open(io.BytesIO(image_data))
            
            # Convert RGBA to RGB if necessary (WebP supports RGBA but RGB is smaller)
            if img.mode == 'RGBA':
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
                img = background
            elif img.mode not in ['RGB', 'L']:
                img = img.convert('RGB')
            
            # Generate multiple sizes for responsive images
            sizes = {
                'thumbnail': (150, 150),
                'small': (400, 400),
                'medium': (800, 800),
                'large': (1200, 1200),
                'original': img.size
            }
            
            webp_versions = {}
            
            for size_name, max_size in sizes.items():
                # Create a copy for resizing
                img_copy = img.copy()
                
                # Only resize if image is larger than target
                if img_copy.size[0] > max_size[0] or img_copy.size[1] > max_size[1]:
                    img_copy.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Convert to WebP
                output = io.BytesIO()
                img_copy.save(output, format='WEBP', quality=quality, optimize=optimize, method=6)
                webp_data = output.getvalue()
                
                webp_versions[size_name] = {
                    'data': base64.b64encode(webp_data).decode('utf-8'),
                    'size': len(webp_data),
                    'dimensions': {
                        'width': img_copy.width,
                        'height': img_copy.height
                    }
                }
            
            # Generate unique image ID
            image_id = f"img_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"
            
            return {
                'id': image_id,
                'format': 'webp',
                'versions': webp_versions,
                'original_format': img.format.lower() if img.format else 'unknown',
                'original_size': len(image_data),
                'hash': hashlib.md5(image_data).hexdigest(),
                'created_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"Error converting to WebP: {e}")
            return None
    
    def process_article_images(self, images: List[Dict], article_id: str) -> Dict:
        """
        Process all images for an article, converting to WebP and organizing
        
        Args:
            images: List of extracted images
            article_id: Article ID for association
            
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
                
                # Convert to WebP
                webp_result = self.convert_to_webp(image_data)
                if not webp_result:
                    continue
                
                # Add metadata
                webp_result['article_id'] = article_id
                webp_result['index'] = idx
                webp_result['alt'] = img.get('alt', '')
                webp_result['title'] = img.get('title', '')
                webp_result['source_type'] = img.get('type', 'unknown')
                
                # Determine if this could be a cover image
                # Cover images are typically larger and appear early
                if idx < 3:  # First 3 images
                    original_dim = webp_result['versions']['original']['dimensions']
                    if original_dim['width'] > 600 and original_dim['height'] > 400:
                        cover_image_candidates.append({
                            'image_id': webp_result['id'],
                            'score': (original_dim['width'] * original_dim['height']) / 1000000,  # Megapixels
                            'index': idx
                        })
                
                processed_images.append(webp_result)
                
            except Exception as e:
                print(f"Error processing image {idx}: {e}")
                continue
        
        # Select best cover image candidate
        cover_image_id = None
        if cover_image_candidates:
            # Sort by score (larger images first) and index (earlier images preferred)
            cover_image_candidates.sort(key=lambda x: (-x['score'], x['index']))
            cover_image_id = cover_image_candidates[0]['image_id']
        
        return {
            'images': processed_images,
            'total_count': len(processed_images),
            'cover_image_id': cover_image_id,
            'processing_timestamp': datetime.utcnow().isoformat()
        }