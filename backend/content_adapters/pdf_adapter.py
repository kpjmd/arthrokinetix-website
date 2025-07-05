# backend/content_adapters/pdf_adapter.py
"""
PDF Content Adapter
Handles PDF content processing for the Arthrokinetix algorithm
"""

import re
import base64
from typing import Dict, Any, List, Optional
from .base_adapter import ContentAdapter

# Import PDF processing libraries with fallbacks
try:
    import PyPDF2
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False

try:
    import fitz  # PyMuPDF
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False

class PDFContentAdapter(ContentAdapter):
    """
    PDF Content Adapter
    Processes PDF content and extracts text, structure, and metadata
    Supports multiple PDF processing libraries with graceful fallbacks
    """
    
    def __init__(self):
        super().__init__()
        self.content_type = "pdf"
        self.pdf_library = self.detect_available_library()
    
    def detect_available_library(self) -> str:
        """
        Detect which PDF processing library is available
        Priority: pdfplumber > PyMuPDF > PyPDF2 > None
        """
        if HAS_PDFPLUMBER:
            return "pdfplumber"
        elif HAS_PYMUPDF:
            return "pymupdf"
        elif HAS_PYPDF2:
            return "pypdf2"
        else:
            return "none"
    
    def extract_text_content(self, content: Any) -> str:
        """
        Extract clean text content from PDF
        Handles both file paths and binary content
        """
        try:
            if isinstance(content, str):
                # Handle base64 encoded content
                if self.is_base64(content):
                    import io
                    pdf_bytes = base64.b64decode(content)
                    return self.extract_text_from_bytes(pdf_bytes)
                else:
                    # Handle file path
                    return self.extract_text_from_file(content)
            elif isinstance(content, bytes):
                # Handle binary content directly
                return self.extract_text_from_bytes(content)
            else:
                raise ValueError(f"Unsupported content type: {type(content)}")
                
        except Exception as e:
            print(f"Warning: PDF text extraction failed: {e}")
            # Return a basic placeholder
            return "PDF content processing failed. Please check PDF file format and try again."
    
    def extract_structure(self, content: Any) -> Dict[str, Any]:
        """
        Extract structural information from PDF
        Returns page information, headings, and document structure
        """
        try:
            text_content = self.extract_text_content(content)
            
            # For PDFs, we primarily work with the extracted text
            # and use text-based structure detection
            
            # Basic structure from text analysis
            lines = text_content.split('\n')
            
            # Identify potential headings (lines that are short and capitalized)
            headings = []
            paragraphs = []
            
            for i, line in enumerate(lines):
                line = line.strip()
                if not line:
                    continue
                
                # Check if line looks like a heading
                if self.is_potential_heading(line):
                    level = self.determine_heading_level(line)
                    headings.append({
                        "level": level,
                        "text": line,
                        "tag": f"h{level}",
                        "page": self.estimate_page_number(i, len(lines))
                    })
                else:
                    # Treat as paragraph
                    paragraphs.append({
                        "text": line,
                        "length": len(line),
                        "page": self.estimate_page_number(i, len(lines))
                    })
            
            # Identify sections
            sections = self.identify_pdf_sections(text_content, headings)
            
            return {
                "headings": headings,
                "paragraphs": paragraphs,
                "lists": [],  # TODO: Implement list detection for PDFs
                "tables": [],  # TODO: Implement table detection for PDFs
                "sections": sections,
                "heading_count": len(headings),
                "paragraph_count": len(paragraphs),
                "list_count": 0,
                "table_count": 0,
                "estimated_pages": self.estimate_page_count(text_content)
            }
            
        except Exception as e:
            print(f"Warning: PDF structure extraction failed: {e}")
            # Fallback to text-based analysis
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
                "table_count": 0,
                "estimated_pages": self.estimate_page_count(text_content)
            }
    
    def extract_metadata(self, content: Any) -> Dict[str, Any]:
        """
        Extract metadata from PDF
        Returns document metadata and processing information
        """
        try:
            text_content = self.extract_text_content(content)
            
            # Try to extract PDF-specific metadata
            pdf_metadata = self.extract_pdf_metadata(content)
            
            # Basic text statistics
            base_metadata = {
                "title": pdf_metadata.get("title", ""),
                "author": pdf_metadata.get("author", ""),
                "subject": pdf_metadata.get("subject", ""),
                "creator": pdf_metadata.get("creator", ""),
                "producer": pdf_metadata.get("producer", ""),
                "creation_date": pdf_metadata.get("creation_date", ""),
                "modification_date": pdf_metadata.get("modification_date", ""),
                "pages": pdf_metadata.get("pages", 0),
                "word_count": self.calculate_word_count(text_content),
                "paragraph_count": self.calculate_paragraph_count(text_content),
                "character_count": len(text_content),
                "read_time": self.calculate_read_time(text_content),
                "language": self.detect_language(text_content),
                "pdf_library_used": self.pdf_library,
                "has_images": pdf_metadata.get("has_images", False),
                "image_count": pdf_metadata.get("image_count", 0),
                "estimated_pages": self.estimate_page_count(text_content)
            }
            
            return base_metadata
            
        except Exception as e:
            print(f"Warning: PDF metadata extraction failed: {e}")
            # Fallback to basic metadata
            text_content = self.extract_text_content(content)
            return {
                "title": "",
                "author": "",
                "subject": "",
                "word_count": self.calculate_word_count(text_content),
                "paragraph_count": self.calculate_paragraph_count(text_content),
                "character_count": len(text_content),
                "read_time": self.calculate_read_time(text_content),
                "language": self.detect_language(text_content),
                "pdf_library_used": self.pdf_library,
                "has_images": False,
                "image_count": 0,
                "estimated_pages": self.estimate_page_count(text_content)
            }
    
    def extract_text_from_file(self, file_path: str) -> str:
        """Extract text from PDF file"""
        if self.pdf_library == "pdfplumber":
            return self.extract_with_pdfplumber(file_path)
        elif self.pdf_library == "pymupdf":
            return self.extract_with_pymupdf(file_path)
        elif self.pdf_library == "pypdf2":
            return self.extract_with_pypdf2(file_path)
        else:
            raise Exception("No PDF processing library available")
    
    def extract_text_from_bytes(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF bytes"""
        import io
        
        if self.pdf_library == "pdfplumber":
            return self.extract_with_pdfplumber(io.BytesIO(pdf_bytes))
        elif self.pdf_library == "pymupdf":
            return self.extract_with_pymupdf(io.BytesIO(pdf_bytes))
        elif self.pdf_library == "pypdf2":
            return self.extract_with_pypdf2(io.BytesIO(pdf_bytes))
        else:
            raise Exception("No PDF processing library available")
    
    def extract_with_pdfplumber(self, source) -> str:
        """Extract text using pdfplumber (best quality)"""
        import pdfplumber
        
        text_content = ""
        with pdfplumber.open(source) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content += page_text + "\n"
        
        return text_content.strip()
    
    def extract_with_pymupdf(self, source) -> str:
        """Extract text using PyMuPDF (good quality, fast)"""
        import fitz
        
        text_content = ""
        doc = fitz.open(source)
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text_content += page.get_text() + "\n"
        
        doc.close()
        return text_content.strip()
    
    def extract_with_pypdf2(self, source) -> str:
        """Extract text using PyPDF2 (basic quality)"""
        import PyPDF2
        
        text_content = ""
        
        if hasattr(source, 'read'):
            # It's a file-like object
            reader = PyPDF2.PdfReader(source)
        else:
            # It's a file path
            with open(source, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
        
        for page in reader.pages:
            text_content += page.extract_text() + "\n"
        
        return text_content.strip()
    
    def extract_pdf_metadata(self, content: Any) -> Dict[str, Any]:
        """Extract PDF-specific metadata"""
        try:
            if self.pdf_library == "pdfplumber":
                return self.extract_metadata_pdfplumber(content)
            elif self.pdf_library == "pymupdf":
                return self.extract_metadata_pymupdf(content)
            elif self.pdf_library == "pypdf2":
                return self.extract_metadata_pypdf2(content)
            else:
                return {}
        except Exception as e:
            print(f"Warning: PDF metadata extraction failed: {e}")
            return {}
    
    def extract_metadata_pdfplumber(self, source) -> Dict[str, Any]:
        """Extract metadata using pdfplumber"""
        import pdfplumber
        
        with pdfplumber.open(source) as pdf:
            metadata = pdf.metadata or {}
            return {
                "title": metadata.get("/Title", ""),
                "author": metadata.get("/Author", ""),
                "subject": metadata.get("/Subject", ""),
                "creator": metadata.get("/Creator", ""),
                "producer": metadata.get("/Producer", ""),
                "creation_date": str(metadata.get("/CreationDate", "")),
                "modification_date": str(metadata.get("/ModDate", "")),
                "pages": len(pdf.pages),
                "has_images": False,  # TODO: Implement image detection
                "image_count": 0
            }
    
    def extract_metadata_pymupdf(self, source) -> Dict[str, Any]:
        """Extract metadata using PyMuPDF"""
        import fitz
        
        doc = fitz.open(source)
        metadata = doc.metadata
        
        result = {
            "title": metadata.get("title", ""),
            "author": metadata.get("author", ""),
            "subject": metadata.get("subject", ""),
            "creator": metadata.get("creator", ""),
            "producer": metadata.get("producer", ""),
            "creation_date": metadata.get("creationDate", ""),
            "modification_date": metadata.get("modDate", ""),
            "pages": doc.page_count,
            "has_images": False,  # TODO: Implement image detection
            "image_count": 0
        }
        
        doc.close()
        return result
    
    def extract_metadata_pypdf2(self, source) -> Dict[str, Any]:
        """Extract metadata using PyPDF2"""
        import PyPDF2
        
        if hasattr(source, 'read'):
            reader = PyPDF2.PdfReader(source)
        else:
            with open(source, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
        
        metadata = reader.metadata or {}
        
        return {
            "title": metadata.get("/Title", ""),
            "author": metadata.get("/Author", ""),
            "subject": metadata.get("/Subject", ""),
            "creator": metadata.get("/Creator", ""),
            "producer": metadata.get("/Producer", ""),
            "creation_date": str(metadata.get("/CreationDate", "")),
            "modification_date": str(metadata.get("/ModDate", "")),
            "pages": len(reader.pages),
            "has_images": False,  # TODO: Implement image detection
            "image_count": 0
        }
    
    def is_base64(self, content: str) -> bool:
        """Check if content is base64 encoded"""
        try:
            if isinstance(content, str):
                # Check if it looks like base64
                if len(content) % 4 == 0 and re.match(r'^[A-Za-z0-9+/]*={0,2}$', content):
                    # Try to decode
                    base64.b64decode(content)
                    return True
            return False
        except Exception:
            return False
    
    def is_potential_heading(self, line: str) -> bool:
        """Check if a line is likely a heading in PDF context"""
        # Skip very long lines
        if len(line) > 100:
            return False
        
        # Check for common heading patterns
        heading_patterns = [
            r'^\d+\.\s+[A-Z]',  # "1. Introduction"
            r'^[A-Z][A-Z\s]+$',  # "INTRODUCTION"
            r'^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$',  # "Introduction"
        ]
        
        for pattern in heading_patterns:
            if re.match(pattern, line):
                return True
        
        return False
    
    def determine_heading_level(self, line: str) -> int:
        """Determine heading level for PDF content"""
        if re.match(r'^\d+\.\s+', line):
            return 2
        elif line.isupper():
            return 1
        elif len(line) < 30:
            return 2
        else:
            return 3
    
    def estimate_page_number(self, line_index: int, total_lines: int) -> int:
        """Estimate which page a line might be on"""
        # Very rough estimation
        lines_per_page = max(1, total_lines // max(1, self.estimate_page_count_from_lines(total_lines)))
        return (line_index // lines_per_page) + 1
    
    def estimate_page_count(self, text_content: str) -> int:
        """Estimate number of pages from text content"""
        # Rough estimation: ~500 words per page
        word_count = self.calculate_word_count(text_content)
        return max(1, round(word_count / 500))
    
    def estimate_page_count_from_lines(self, line_count: int) -> int:
        """Estimate number of pages from line count"""
        # Rough estimation: ~50 lines per page
        return max(1, round(line_count / 50))
    
    def identify_pdf_sections(self, text_content: str, headings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify content sections from PDF text and headings"""
        sections = []
        
        # Use headings if available
        for heading in headings:
            heading_text = heading["text"].lower()
            
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
                        "emotionalTone": self.get_section_emotion(keyword),
                        "page": heading.get("page", 1)
                    })
                    break
        
        # Fallback to keyword-based detection
        if not sections:
            sections = self.extract_sections_by_keywords(text_content)
        
        return sections[:6]  # Limit to 6 sections