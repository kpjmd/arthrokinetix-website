# backend/content_adapters/base_adapter.py
"""
Base Content Adapter Interface
Provides a standardized interface for processing different content types
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
import re
from datetime import datetime

class ContentAdapter(ABC):
    """
    Base abstract class for content adapters
    Each content type (HTML, PDF, text) will implement this interface
    """
    
    def __init__(self):
        self.content_type = None
        self.metadata = {}
        
    @abstractmethod
    def extract_text_content(self, content: Any) -> str:
        """
        Extract clean text content from the source
        Returns: Clean text suitable for analysis
        """
        pass
    
    @abstractmethod
    def extract_structure(self, content: Any) -> Dict[str, Any]:
        """
        Extract structural information (headings, sections, etc.)
        Returns: Dictionary with structure metadata
        """
        pass
    
    @abstractmethod
    def extract_metadata(self, content: Any) -> Dict[str, Any]:
        """
        Extract content-specific metadata
        Returns: Dictionary with metadata fields
        """
        pass
    
    def process_content(self, content: Any) -> Dict[str, Any]:
        """
        Main processing method - standardized output for all content types
        Returns: Standardized dictionary for algorithm processing
        """
        try:
            # Extract components
            text_content = self.extract_text_content(content)
            structure = self.extract_structure(content)
            metadata = self.extract_metadata(content)
            
            # Build standardized output
            processed_content = {
                "text_content": text_content,
                "structure": structure,
                "metadata": metadata,
                "processing_timestamp": datetime.utcnow().isoformat(),
                "content_type": self.content_type,
                "adapter_version": "1.0"
            }
            
            return processed_content
            
        except Exception as e:
            raise Exception(f"Content processing failed: {str(e)}")
    
    # Common utility methods available to all adapters
    def calculate_word_count(self, text: str) -> int:
        """Calculate word count from text"""
        return len([word for word in text.split() if word.strip()])
    
    def calculate_paragraph_count(self, text: str) -> int:
        """Calculate paragraph count from text"""
        return len([p for p in text.split('\n\n') if p.strip()])
    
    def detect_language(self, text: str) -> str:
        """Basic language detection (can be enhanced)"""
        # Simple heuristic - can be replaced with proper language detection
        if len(text) < 100:
            return "unknown"
        return "en"  # Default to English for medical content
    
    def calculate_read_time(self, text: str, wpm: int = 200) -> int:
        """Calculate estimated reading time in minutes"""
        word_count = self.calculate_word_count(text)
        return max(1, round(word_count / wpm))
    
    def extract_sections_by_keywords(self, text: str) -> List[Dict[str, Any]]:
        """Extract content sections based on common keywords"""
        section_markers = [
            "introduction", "background", "methods", "methodology", "results", 
            "discussion", "conclusion", "conclusions", "summary", "abstract",
            "overview", "review", "analysis", "findings", "recommendations"
        ]
        
        sections = []
        text_lower = text.lower()
        
        for marker in section_markers:
            if marker in text_lower:
                sections.append({
                    "title": marker.title(),
                    "level": 2,
                    "importance": 0.7,
                    "complexity": 0.6,
                    "emotionalTone": self.get_section_emotion(marker)
                })
        
        return sections[:6]  # Limit to 6 sections for visual clarity
    
    def get_section_emotion(self, section_name: str) -> str:
        """Map section names to emotional tones"""
        emotion_mapping = {
            "introduction": "confidence",
            "background": "confidence", 
            "methods": "breakthrough",
            "methodology": "breakthrough",
            "results": "healing",
            "discussion": "hope",
            "conclusion": "hope",
            "conclusions": "hope",
            "summary": "confidence",
            "abstract": "confidence",
            "overview": "confidence",
            "review": "healing",
            "analysis": "breakthrough",
            "findings": "healing",
            "recommendations": "hope"
        }
        
        return emotion_mapping.get(section_name.lower(), "confidence")

class MockArticleElement:
    """
    Standardized article element that works with existing algorithm
    All adapters will output content in this format
    """
    
    def __init__(self, processed_content: Dict[str, Any]):
        self.text_content = processed_content["text_content"]
        self.innerHTML = processed_content["text_content"]
        self.structure = processed_content.get("structure", {})
        self.metadata = processed_content.get("metadata", {})
        self.content_type = processed_content.get("content_type", "unknown")
        
    def get_structure(self) -> Dict[str, Any]:
        """Get structural information"""
        return self.structure
    
    def get_metadata(self) -> Dict[str, Any]:
        """Get content metadata"""
        return self.metadata