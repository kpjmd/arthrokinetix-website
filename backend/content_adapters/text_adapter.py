# backend/content_adapters/text_adapter.py
"""
Text Content Adapter
Handles plain text content processing for the Arthrokinetix algorithm
"""

import re
from typing import Dict, Any, List
from .base_adapter import ContentAdapter

class TextContentAdapter(ContentAdapter):
    """
    Text Content Adapter
    Processes plain text content and extracts structure and metadata
    """
    
    def __init__(self):
        super().__init__()
        self.content_type = "text"
    
    def extract_text_content(self, content: str) -> str:
        """
        Extract clean text content from plain text
        For text content, this is straightforward cleaning
        """
        try:
            # Clean up whitespace while preserving paragraph breaks
            lines = content.split('\n')
            cleaned_lines = []
            
            for line in lines:
                cleaned_line = line.strip()
                if cleaned_line:
                    cleaned_lines.append(cleaned_line)
                elif cleaned_lines and cleaned_lines[-1] != "":
                    # Preserve paragraph breaks
                    cleaned_lines.append("")
            
            # Join lines and normalize whitespace
            text_content = '\n'.join(cleaned_lines)
            
            # Remove excessive whitespace
            text_content = re.sub(r'\n\n\n+', '\n\n', text_content)
            text_content = re.sub(r'[ \t]+', ' ', text_content)
            
            return text_content.strip()
            
        except Exception as e:
            print(f"Warning: Text content cleaning failed: {e}")
            return content.strip()
    
    def extract_structure(self, content: str) -> Dict[str, Any]:
        """
        Extract structural information from plain text
        Uses text patterns to identify headings, sections, and lists
        """
        try:
            text_content = self.extract_text_content(content)
            lines = text_content.split('\n')
            
            # Identify headings (lines that are short, capitalized, or followed by empty lines)
            headings = []
            paragraphs = []
            lists = []
            
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                
                if not line:
                    i += 1
                    continue
                
                # Check if this line is a heading
                if self.is_heading(line, lines, i):
                    level = self.determine_heading_level(line)
                    headings.append({
                        "level": level,
                        "text": line,
                        "tag": f"h{level}"
                    })
                
                # Check if this line starts a list
                elif self.is_list_item(line):
                    list_items = []
                    while i < len(lines) and self.is_list_item(lines[i].strip()):
                        list_items.append(self.clean_list_item(lines[i].strip()))
                        i += 1
                    
                    if list_items:
                        lists.append({
                            "type": "ul",  # Assume unordered list
                            "items": list_items,
                            "count": len(list_items)
                        })
                        i -= 1  # Back up one since we'll increment at the end
                
                # Otherwise, treat as paragraph
                else:
                    paragraph_lines = [line]
                    i += 1
                    
                    # Collect continuation lines
                    while i < len(lines) and lines[i].strip() and not self.is_heading(lines[i].strip(), lines, i) and not self.is_list_item(lines[i].strip()):
                        paragraph_lines.append(lines[i].strip())
                        i += 1
                    
                    paragraph_text = ' '.join(paragraph_lines)
                    if paragraph_text:
                        paragraphs.append({
                            "text": paragraph_text,
                            "length": len(paragraph_text)
                        })
                    
                    i -= 1  # Back up one since we'll increment at the end
                
                i += 1
            
            # Identify content sections
            sections = self.identify_text_sections(text_content, headings)
            
            return {
                "headings": headings,
                "paragraphs": paragraphs,
                "lists": lists,
                "tables": [],  # Plain text doesn't have tables
                "sections": sections,
                "heading_count": len(headings),
                "paragraph_count": len(paragraphs),
                "list_count": len(lists),
                "table_count": 0
            }
            
        except Exception as e:
            print(f"Warning: Text structure extraction failed: {e}")
            # Fallback to basic structure
            text_content = self.extract_text_content(content)
            return {
                "headings": [],
                "paragraphs": [{"text": text_content, "length": len(text_content)}],
                "lists": [],
                "tables": [],
                "sections": self.extract_sections_by_keywords(text_content),
                "heading_count": 0,
                "paragraph_count": self.calculate_paragraph_count(text_content),
                "list_count": 0,
                "table_count": 0
            }
    
    def extract_metadata(self, content: str) -> Dict[str, Any]:
        """
        Extract metadata from plain text
        Returns document statistics and processing information
        """
        try:
            text_content = self.extract_text_content(content)
            
            # Try to extract title from first line or first heading
            title = ""
            lines = text_content.split('\n')
            if lines:
                first_line = lines[0].strip()
                if len(first_line) < 100 and not first_line.endswith('.'):
                    title = first_line
            
            # Count sentences
            sentences = re.split(r'[.!?]+', text_content)
            sentence_count = len([s for s in sentences if s.strip()])
            
            # Calculate average sentence length
            total_words = self.calculate_word_count(text_content)
            avg_sentence_length = total_words / max(1, sentence_count)
            
            # Count unique words
            words = re.findall(r'\b\w+\b', text_content.lower())
            unique_words = len(set(words))
            
            # Calculate readability metrics
            syllable_count = self.estimate_syllables(text_content)
            flesch_score = self.calculate_flesch_score(total_words, sentence_count, syllable_count)
            
            return {
                "title": title,
                "meta_tags": {},
                "links": [],
                "link_count": 0,
                "word_count": total_words,
                "unique_word_count": unique_words,
                "sentence_count": sentence_count,
                "average_sentence_length": avg_sentence_length,
                "paragraph_count": self.calculate_paragraph_count(text_content),
                "character_count": len(text_content),
                "character_count_no_spaces": len(text_content.replace(' ', '')),
                "read_time": self.calculate_read_time(text_content),
                "language": self.detect_language(text_content),
                "syllable_count": syllable_count,
                "flesch_reading_score": flesch_score,
                "has_images": False,
                "image_count": 0
            }
            
        except Exception as e:
            print(f"Warning: Text metadata extraction failed: {e}")
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
                "has_images": False,
                "image_count": 0
            }
    
    def is_heading(self, line: str, lines: List[str], index: int) -> bool:
        """
        Determine if a line is likely a heading
        """
        # Skip empty lines
        if not line.strip():
            return False
        
        # Headings are usually short
        if len(line) > 100:
            return False
        
        # Check if line is all caps (likely a heading)
        if line.isupper() and len(line) > 3:
            return True
        
        # Check if line ends with colon (section marker)
        if line.endswith(':') and len(line) > 5:
            return True
        
        # Check if line is followed by empty line or is at end
        if index + 1 < len(lines) and not lines[index + 1].strip():
            # Short lines followed by empty lines are likely headings
            if len(line) < 80:
                return True
        
        # Check if line matches common heading patterns
        heading_patterns = [
            r'^\d+\.\s+[A-Z]',  # "1. Introduction"
            r'^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$',  # "Introduction" or "Methods And Results"
            r'^[A-Z][A-Z\s]+$',  # "INTRODUCTION"
        ]
        
        for pattern in heading_patterns:
            if re.match(pattern, line):
                return True
        
        return False
    
    def determine_heading_level(self, line: str) -> int:
        """
        Determine the heading level (1-6) based on line characteristics
        """
        # Check for numbered headings
        if re.match(r'^\d+\.\s+', line):
            return 2
        
        # All caps headings are usually level 1
        if line.isupper():
            return 1
        
        # Short lines are usually higher level
        if len(line) < 30:
            return 2
        
        # Medium lines are level 3
        if len(line) < 60:
            return 3
        
        # Default to level 2
        return 2
    
    def is_list_item(self, line: str) -> bool:
        """
        Check if a line is a list item
        """
        list_patterns = [
            r'^\s*[-*+•]\s+',  # Bullet points
            r'^\s*\d+\.\s+',   # Numbered lists
            r'^\s*[a-zA-Z]\.\s+',  # Lettered lists
            r'^\s*[ivxlcdm]+\.\s+',  # Roman numerals
        ]
        
        for pattern in list_patterns:
            if re.match(pattern, line, re.IGNORECASE):
                return True
        
        return False
    
    def clean_list_item(self, line: str) -> str:
        """
        Remove list markers from list items
        """
        # Remove common list markers
        cleaned = re.sub(r'^\s*[-*+•]\s+', '', line)
        cleaned = re.sub(r'^\s*\d+\.\s+', '', cleaned)
        cleaned = re.sub(r'^\s*[a-zA-Z]\.\s+', '', cleaned)
        cleaned = re.sub(r'^\s*[ivxlcdm]+\.\s+', '', cleaned, flags=re.IGNORECASE)
        
        return cleaned.strip()
    
    def identify_text_sections(self, text_content: str, headings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Identify content sections from text and headings
        """
        sections = []
        
        # Use headings to identify sections
        for heading in headings:
            heading_text = heading["text"].lower()
            
            # Check if this heading matches section keywords
            section_keywords = [
                'introduction', 'background', 'methods', 'methodology',
                'results', 'discussion', 'conclusion', 'conclusions',
                'summary', 'abstract', 'overview', 'review', 'analysis',
                'findings', 'recommendations'
            ]
            
            for keyword in section_keywords:
                if keyword in heading_text:
                    sections.append({
                        "title": heading["text"],
                        "level": heading["level"],
                        "importance": 0.8,
                        "complexity": 0.7,
                        "emotionalTone": self.get_section_emotion(keyword)
                    })
                    break
        
        # If no sections found from headings, use keyword detection
        if not sections:
            sections = self.extract_sections_by_keywords(text_content)
        
        return sections[:6]  # Limit to 6 sections
    
    def estimate_syllables(self, text: str) -> int:
        """
        Estimate syllable count for readability calculation
        """
        words = re.findall(r'\b\w+\b', text.lower())
        total_syllables = 0
        
        for word in words:
            # Simple syllable counting heuristic
            syllable_count = len(re.findall(r'[aeiouy]+', word))
            if word.endswith('e'):
                syllable_count -= 1
            if syllable_count == 0:
                syllable_count = 1
            total_syllables += syllable_count
        
        return total_syllables
    
    def calculate_flesch_score(self, words: int, sentences: int, syllables: int) -> float:
        """
        Calculate Flesch Reading Ease Score
        """
        if sentences == 0 or words == 0:
            return 0.0
        
        avg_sentence_length = words / sentences
        avg_syllables_per_word = syllables / words
        
        score = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
        return max(0.0, min(100.0, score))  # Clamp between 0 and 100