# Content Adapters

A flexible content processing layer for the Arthrokinetix algorithm that supports multiple content formats while maintaining backwards compatibility.

## Overview

The content adapters provide a standardized interface for processing different content types:
- **HTML**: Enhanced HTML parsing with structure extraction
- **Text**: Plain text with intelligent section detection  
- **PDF**: PDF text extraction with multiple library support

## Architecture

```
Content Input → Content Adapter → Standardized Output → Algorithm Processing
     ↓              ↓                    ↓                       ↓
   HTML/PDF/Text → Extract Text     → MockArticleElement → Artwork Generation
                → Extract Structure
                → Extract Metadata
```

## Features

### ✅ Backwards Compatibility
- Existing HTML processing continues to work unchanged
- Legacy `process_article_with_manual_algorithm()` function preserved
- All existing artworks remain compatible

### 🆕 Enhanced Processing
- **Structure Detection**: Headings, sections, lists, tables
- **Metadata Extraction**: Word count, readability scores, file info
- **Multi-format Support**: HTML, PDF, Text with graceful fallbacks

### 🛡️ Robust Error Handling
- Graceful fallbacks when adapters fail
- Multiple PDF processing libraries with priority order
- Legacy processing as final fallback

## Installation

### Required Dependencies
```bash
pip install beautifulsoup4 lxml
```

### Optional PDF Dependencies
Install one or more for PDF support (recommended order):

```bash
# Best quality (recommended)
pip install pdfplumber

# Good quality, fast
pip install PyMuPDF

# Basic fallback
pip install PyPDF2
```

## Usage

### Server Integration

The adapters are automatically used in `server.py` when processing articles:

```python
# Enhanced processing with adapters
if HAS_CONTENT_ADAPTERS and adapter_data:
    emotional_data = process_content_with_adapters(adapter_data, content_type)
else:
    # Fallback to legacy processing
    emotional_data = await process_article_emotions(processed_content)
```

### Direct Algorithm Usage

```python
from arthrokinetix_algorithm import process_content_with_adapters

# Process different content types
html_result = process_content_with_adapters(html_content, "html")
text_result = process_content_with_adapters(text_content, "text") 
pdf_result = process_content_with_adapters(pdf_bytes, "pdf")
```

### Legacy Compatibility

```python
from arthrokinetix_algorithm import process_article_with_manual_algorithm

# Legacy function still works exactly as before
result = process_article_with_manual_algorithm(html_content)
```

## Content Adapter Classes

### HTMLContentAdapter
- **Input**: HTML string
- **Features**: BeautifulSoup parsing, DOM structure extraction, meta tag processing
- **Structure**: Headings, paragraphs, lists, tables
- **Metadata**: Title, links, word count, HTML size

### TextContentAdapter  
- **Input**: Plain text string
- **Features**: Intelligent heading detection, list parsing, readability analysis
- **Structure**: Inferred headings, paragraphs, sections
- **Metadata**: Word count, sentence analysis, Flesch reading score

### PDFContentAdapter
- **Input**: PDF bytes, base64, or file path
- **Features**: Multi-library support, metadata extraction, page estimation
- **Libraries**: pdfplumber (best) → PyMuPDF → PyPDF2 (fallback)
- **Metadata**: PDF properties, page count, creation date

## Output Format

All adapters produce a standardized `MockArticleElement`:

```python
{
    "text_content": "Clean extracted text...",
    "structure": {
        "headings": [...],
        "sections": [...],
        "paragraphs": [...],
        "lists": [...]
    },
    "metadata": {
        "word_count": 1234,
        "content_type": "html",
        "read_time": 5,
        ...
    }
}
```

## Error Handling & Fallbacks

The system provides multiple layers of fallback:

1. **Adapter Level**: Multiple PDF libraries, graceful HTML parsing failures
2. **Algorithm Level**: Falls back to legacy processing if adapters fail
3. **Server Level**: Legacy emotional analysis if enhanced processing fails

## Testing

Run the test suite to verify functionality:

```bash
cd backend
python3 test_content_adapters.py
```

Tests verify:
- ✅ Backwards compatibility with existing HTML processing
- ✅ New content adapter functionality  
- ✅ Adapter data structure processing
- ✅ Error handling and fallbacks

## Performance Notes

- **HTML**: BeautifulSoup parsing is slower but more accurate than regex
- **Text**: Fast processing with intelligent structure detection
- **PDF**: Performance varies by library (PyMuPDF fastest, pdfplumber most accurate)

## Future Enhancements

- **DOCX Support**: Microsoft Word document processing
- **Markdown Support**: Native markdown parsing
- **Image Extraction**: Extract and analyze images from PDFs
- **Table Processing**: Enhanced table structure analysis

## Debugging

Enable debug output by checking the console logs:

```
📄 Using content adapter for html processing
✨ Enhanced with adapter data: html format
⚠️ Content adapter failed, falling back to legacy processing
```

## Migration Guide

### For Existing Code
No changes required! The system maintains full backwards compatibility.

### For New Features
Use the new `process_content_with_adapters()` function and specify content type:

```python
# Old way (still works)
result = process_article_with_manual_algorithm(content)

# New way (enhanced)
result = process_content_with_adapters(content, "text")
```