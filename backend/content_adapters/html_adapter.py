# backend/content_adapters/html_adapter.py
"""
HTML Content Adapter
Handles HTML content processing for the Arthrokinetix algorithm
Maintains backwards compatibility with existing HTML processing
"""

import re
from typing import Dict, Any, List
from bs4 import BeautifulSoup, NavigableString
from .base_adapter import ContentAdapter

class HTMLContentAdapter(ContentAdapter):
    """
    HTML Content Adapter
    Processes HTML content and extracts text, structure, and metadata
    """
    
    def __init__(self):
        super().__init__()
        self.content_type = "html"
    
    def extract_text_content(self, content: str) -> str:
        """
        Extract clean text content from HTML
        Maintains compatibility with existing algorithm expectations
        """
        try:
            # Use BeautifulSoup for proper HTML parsing
            soup = BeautifulSoup(content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Extract text content
            text_content = soup.get_text()
            
            # Clean up whitespace (preserve paragraph breaks)
            lines = (line.strip() for line in text_content.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text_content = ' '.join(chunk for chunk in chunks if chunk)
            
            return text_content
            
        except Exception as e:
            # Fallback to regex-based extraction (current method)
            print(f"Warning: BeautifulSoup parsing failed, using regex fallback: {e}")
            return re.sub(r'<[^<]+?>', '', content)
    
    def extract_structure(self, content: str) -> Dict[str, Any]:
        """
        Extract structural information from HTML
        Returns headings, sections, and document structure
        """
        try:
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract headings
            headings = []
            for i in range(1, 7):  # h1 to h6
                for heading in soup.find_all(f'h{i}'):
                    headings.append({
                        "level": i,
                        "text": heading.get_text().strip(),
                        "tag": f'h{i}'
                    })
            
            # Extract paragraphs
            paragraphs = []
            for p in soup.find_all('p'):
                text = p.get_text().strip()
                if text:
                    paragraphs.append({
                        "text": text,
                        "length": len(text)
                    })
            
            # Extract lists
            lists = []
            for list_tag in soup.find_all(['ul', 'ol']):
                items = [li.get_text().strip() for li in list_tag.find_all('li')]
                lists.append({
                    "type": list_tag.name,
                    "items": items,
                    "count": len(items)
                })
            
            # Extract tables
            tables = []
            for table in soup.find_all('table'):
                rows = []
                for tr in table.find_all('tr'):
                    cells = [td.get_text().strip() for td in tr.find_all(['td', 'th'])]
                    if cells:
                        rows.append(cells)
                
                if rows:
                    tables.append({
                        "rows": len(rows),
                        "columns": len(rows[0]) if rows else 0,
                        "data": rows[:5]  # Sample first 5 rows
                    })
            
            # Identify content sections based on headings and keywords
            sections = self.identify_content_sections(soup)
            
            return {
                "headings": headings,
                "paragraphs": paragraphs,
                "lists": lists,
                "tables": tables,
                "sections": sections,
                "heading_count": len(headings),
                "paragraph_count": len(paragraphs),
                "list_count": len(lists),
                "table_count": len(tables)
            }
            
        except Exception as e:
            print(f"Warning: HTML structure extraction failed: {e}")
            # Fallback to basic structure detection
            return {
                "headings": [],
                "paragraphs": [],
                "lists": [],
                "tables": [],
                "sections": self.extract_sections_by_keywords(self.extract_text_content(content)),
                "heading_count": 0,
                "paragraph_count": self.calculate_paragraph_count(self.extract_text_content(content)),
                "list_count": 0,
                "table_count": 0
            }
    
    def extract_metadata(self, content: str) -> Dict[str, Any]:
        """
        Extract metadata from HTML
        Returns document metadata and processing information
        """
        try:
            soup = BeautifulSoup(content, 'html.parser')
            
            # Extract title
            title = ""
            if soup.title:
                title = soup.title.get_text().strip()
            elif soup.find('h1'):
                title = soup.find('h1').get_text().strip()
            
            # Extract meta tags
            meta_tags = {}
            for meta in soup.find_all('meta'):
                name = meta.get('name') or meta.get('property')
                content_attr = meta.get('content')
                if name and content_attr:
                    meta_tags[name] = content_attr
            
            # Extract links
            links = []
            for link in soup.find_all('a', href=True):
                href = link.get('href')
                text = link.get_text().strip()
                if href and text:
                    links.append({
                        "url": href,
                        "text": text
                    })
            
            # Calculate text statistics
            text_content = self.extract_text_content(content)
            
            return {
                "title": title,
                "meta_tags": meta_tags,
                "links": links[:10],  # First 10 links
                "link_count": len(links),
                "word_count": self.calculate_word_count(text_content),
                "paragraph_count": self.calculate_paragraph_count(text_content),
                "character_count": len(text_content),
                "read_time": self.calculate_read_time(text_content),
                "language": self.detect_language(text_content),
                "html_size": len(content),
                "has_images": len(soup.find_all('img')) > 0,
                "image_count": len(soup.find_all('img'))
            }
            
        except Exception as e:
            print(f"Warning: HTML metadata extraction failed: {e}")
            # Fallback to basic metadata
            text_content = self.extract_text_content(content)
            return {
                "title": "",
                "meta_tags": {},
                "links": [],
                "link_count": 0,
                "word_count": self.calculate_word_count(text_content),
                "paragraph_count": self.calculate_paragraph_count(text_content),
                "character_count": len(text_content),
                "read_time": self.calculate_read_time(text_content),
                "language": self.detect_language(text_content),
                "html_size": len(content),
                "has_images": False,
                "image_count": 0
            }
    
    def identify_content_sections(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """
        Identify content sections from HTML structure
        Uses headings and semantic elements to determine sections
        """
        sections = []
        
        # Method 1: Use headings to identify sections
        for heading in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
            heading_text = heading.get_text().strip().lower()
            
            # Check if this looks like a section heading
            section_keywords = [
                'introduction', 'background', 'methods', 'methodology', 
                'results', 'discussion', 'conclusion', 'conclusions', 
                'summary', 'abstract', 'overview', 'review', 'analysis',
                'findings', 'recommendations'
            ]
            
            for keyword in section_keywords:
                if keyword in heading_text:
                    sections.append({
                        "title": heading.get_text().strip(),
                        "level": int(heading.name[1]),  # Extract number from h1, h2, etc.
                        "importance": 0.8,
                        "complexity": 0.7,
                        "emotionalTone": self.get_section_emotion(keyword)
                    })
                    break
        
        # Method 2: Use semantic HTML elements
        for section in soup.find_all(['section', 'article', 'div']):
            section_id = section.get('id', '').lower()
            section_class = ' '.join(section.get('class', [])).lower()
            
            # Check if ID or class suggests a content section
            if any(keyword in section_id or keyword in section_class 
                   for keyword in ['intro', 'method', 'result', 'discuss', 'conclu']):
                
                # Find the first heading in this section
                heading = section.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
                if heading:
                    sections.append({
                        "title": heading.get_text().strip(),
                        "level": 2,
                        "importance": 0.7,
                        "complexity": 0.6,
                        "emotionalTone": "confidence"
                    })
        
        # If no sections found, use fallback keyword detection
        if not sections:
            text_content = self.extract_text_content(str(soup))
            sections = self.extract_sections_by_keywords(text_content)
        
        # Limit to 6 sections and ensure uniqueness
        unique_sections = []
        seen_titles = set()
        
        for section in sections:
            if section["title"].lower() not in seen_titles:
                unique_sections.append(section)
                seen_titles.add(section["title"].lower())
                
                if len(unique_sections) >= 6:
                    break
        
        return unique_sections