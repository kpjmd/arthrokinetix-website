# backend/content_adapters/__init__.py
"""
Content Adapters Package
Provides unified content processing for different formats
"""

from .base_adapter import ContentAdapter, MockArticleElement
from .html_adapter import HTMLContentAdapter
from .text_adapter import TextContentAdapter
from .pdf_adapter import PDFContentAdapter

class ContentAdapterFactory:
    """
    Factory class for creating appropriate content adapters
    """
    
    @staticmethod
    def create_adapter(content_type: str) -> ContentAdapter:
        """
        Create appropriate content adapter based on content type
        
        Args:
            content_type: Type of content ('html', 'text', 'pdf')
            
        Returns:
            ContentAdapter: Appropriate adapter instance
            
        Raises:
            ValueError: If content type is not supported
        """
        content_type = content_type.lower()
        
        if content_type == 'html':
            return HTMLContentAdapter()
        elif content_type == 'text':
            return TextContentAdapter()
        elif content_type == 'pdf':
            return PDFContentAdapter()
        else:
            raise ValueError(f"Unsupported content type: {content_type}")
    
    @staticmethod
    def get_supported_types() -> list:
        """
        Get list of supported content types
        
        Returns:
            list: List of supported content type strings
        """
        return ['html', 'text', 'pdf']

def process_content(content: any, content_type: str) -> MockArticleElement:
    """
    Main function for processing content with adapters
    
    Args:
        content: Content to process (string, bytes, file path, etc.)
        content_type: Type of content ('html', 'text', 'pdf')
        
    Returns:
        MockArticleElement: Standardized element for algorithm processing
        
    Raises:
        ValueError: If content type is not supported
        Exception: If content processing fails
    """
    # Create appropriate adapter
    adapter = ContentAdapterFactory.create_adapter(content_type)
    
    # Process content
    processed_content = adapter.process_content(content)
    
    # Create standardized article element
    article_element = MockArticleElement(processed_content)
    
    return article_element

# Export main classes and functions
__all__ = [
    'ContentAdapter',
    'MockArticleElement', 
    'HTMLContentAdapter',
    'TextContentAdapter',
    'PDFContentAdapter',
    'ContentAdapterFactory',
    'process_content'
]