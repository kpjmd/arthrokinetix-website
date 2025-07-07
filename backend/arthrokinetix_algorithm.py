# backend/arthrokinetix_algorithm.py
"""
Arthrokinetix Content-to-Art Algorithm v2.1 - Python Backend Version
Supports multiple content types (HTML, PDF, Text) via content adapters
Maintains backwards compatibility with existing artworks
"""

import re
import math
import random
import json
from datetime import datetime
from typing import Dict, List, Any, Optional, Union

# Import content adapters
try:
    from content_adapters import process_content, MockArticleElement as AdapterMockArticleElement
    HAS_CONTENT_ADAPTERS = True
except ImportError:
    HAS_CONTENT_ADAPTERS = False
    print("Warning: Content adapters not available, using legacy HTML processing only")

class ArthrokinetixArtGenerator:
    def __init__(self):
        self.canvas_width = 800
        self.canvas_height = 800
        self.article_data = {}
        self.emotional_journey = {}
        self.visual_elements = []
        self.subspecialty = 'sportsMedicine'
        
        # Brand colors
        self.brand_colors = {
            "primary": "#2c3e50",
            "secondary": "#3498db", 
            "accent": "#e74c3c",
            "light": "#ecf0f1",
            "dark": "#2c3e50"
        }
        
        # Emotional color palettes
        self.emotional_palettes = {
            "hope": ["#27ae60", "#2ecc71", "#58d68d", "#85e085"],
            "tension": ["#e74c3c", "#c0392b", "#a93226", "#8b0000"],
            "confidence": ["#3498db", "#2980b9", "#1f4e79", "#1a5490"],
            "uncertainty": ["#95a5a6", "#7f8c8d", "#5d6d7e", "#484c52"],
            "breakthrough": ["#f39c12", "#e67e22", "#d35400", "#cc6600"],
            "healing": ["#16a085", "#1abc9c", "#48c9b0", "#76d7c4"]
        }
        
        # Tree parameters
        self.tree_parameters = {
            "root_depth": 0.7,
            "branch_complexity": 0.8,
            "healing_rate": 0.6,
            "strength_factor": 1.0
        }

    def process_article(self, content: Union[str, Dict[str, Any]], content_type: str = "html") -> Dict[str, Any]:
        """
        Main processing function - supports multiple content types
        
        Args:
            content: Content to process (string for legacy, any type for adapters)
            content_type: Type of content ('html', 'text', 'pdf')
        
        Returns:
            Dict containing algorithm output
        """
        print(f"🎨 Starting Arthrokinetix Art Generation (Python) - Content Type: {content_type}...")
        
        # Create article element using appropriate method
        article_element = self.create_article_element(content, content_type)
        
        # Extract and analyze article data
        self.extract_article_data(article_element)
        
        # Analyze emotional journey
        self.analyze_emotional_journey()
        
        # Detect subspecialty
        self.detect_subspecialty()
        
        # Generate visual elements
        self.generate_visual_elements()
        
        # Apply subspecialty styling
        self.apply_subspecialty_style()
        
        # Return complete algorithm output
        return self.get_algorithm_output()
    
    def create_article_element(self, content: Union[str, Dict[str, Any]], content_type: str):
        """
        Create article element using content adapters or legacy method
        Maintains backwards compatibility
        
        Args:
            content: Content to process
            content_type: Type of content
            
        Returns:
            Article element for processing
        """
        try:
            if HAS_CONTENT_ADAPTERS and content_type != "legacy":
                # Use content adapters for new processing
                print(f"📄 Using content adapter for {content_type} processing")
                
                # Handle pre-processed content from server
                if isinstance(content, dict) and "text_content" in content:
                    # Content already processed by server-side adapter
                    article_element = AdapterMockArticleElement(content)
                else:
                    # Process content using adapter
                    article_element = process_content(content, content_type)
                
                # Enhance with backwards compatibility
                return self.enhance_article_element(article_element)
                
            else:
                # Use legacy processing for backwards compatibility
                print("📄 Using legacy HTML processing (backwards compatibility)")
                if isinstance(content, str):
                    return MockArticleElement(content)
                elif isinstance(content, dict) and "text_content" in content:
                    # Handle pre-processed content with legacy element
                    return MockArticleElement(content["text_content"])
                else:
                    # Convert to string and use legacy processing
                    return MockArticleElement(str(content))
                    
        except Exception as e:
            print(f"⚠️ Content adapter failed, falling back to legacy processing: {e}")
            # Fallback to legacy processing
            if isinstance(content, str):
                return MockArticleElement(content)
            elif isinstance(content, dict) and "text_content" in content:
                return MockArticleElement(content["text_content"])
            else:
                return MockArticleElement(str(content))
    
    def enhance_article_element(self, article_element):
        """
        Enhance adapter-generated article element with backwards compatibility methods
        
        Args:
            article_element: Element from content adapter
            
        Returns:
            Enhanced element with legacy method compatibility
        """
        # Add enhanced methods if the element supports them
        if hasattr(article_element, 'get_structure'):
            # Add structure data to the element for enhanced processing
            structure = article_element.get_structure()
            if structure:
                # Add structure-aware methods
                article_element.structure_data = structure
                
        if hasattr(article_element, 'get_metadata'):
            # Add metadata for enhanced processing
            metadata = article_element.get_metadata()
            if metadata:
                article_element.metadata_data = metadata
        
        return article_element

    def extract_article_data(self, article_element):
        """Extract article data - enhanced with adapter support while maintaining compatibility"""
        content = article_element.text_content
        
        # Use enhanced data if available from adapters
        enhanced_data = self.extract_enhanced_data(article_element)
        
        self.article_data = {
            "word_count": enhanced_data.get("word_count") or self.get_word_count(article_element),
            "paragraph_count": enhanced_data.get("paragraph_count") or self.get_paragraph_count(article_element),
            "heading_structure": enhanced_data.get("heading_structure") or self.analyze_heading_structure(article_element),
            "full_text": content,
            "medical_terms": self.extract_medical_terms(article_element),
            "statistical_data": self.extract_statistics(article_element),
            "research_citations": self.extract_citations(article_element),
            "readability_score": enhanced_data.get("readability_score") or self.calculate_readability(article_element),
            "technical_density": self.calculate_technical_density(article_element),
            "evidence_strength": self.assess_evidence_strength(article_element),
            "certainty_level": self.assess_certainty_level(article_element),
            "content_sections": enhanced_data.get("content_sections") or self.identify_content_sections(article_element),
            "argument_flow": self.analyze_argument_flow(article_element),
            
            # Add enhanced fields from adapters if available
            "content_type": enhanced_data.get("content_type", "html"),
            "adapter_version": enhanced_data.get("adapter_version"),
            "processing_timestamp": enhanced_data.get("processing_timestamp")
        }
        
        print(f"📊 Article data extracted: {len(self.article_data)} fields")
        if enhanced_data:
            print(f"✨ Enhanced with adapter data: {enhanced_data.get('content_type', 'unknown')} format")
    
    def extract_enhanced_data(self, article_element) -> Dict[str, Any]:
        """
        Extract enhanced data from content adapters if available
        
        Args:
            article_element: Article element (may have adapter enhancements)
            
        Returns:
            Dict containing enhanced data or empty dict
        """
        enhanced_data = {}
        
        try:
            # Check if element has adapter-generated metadata
            if hasattr(article_element, 'metadata_data'):
                metadata = article_element.metadata_data
                enhanced_data.update({
                    "word_count": metadata.get("word_count"),
                    "paragraph_count": metadata.get("paragraph_count"),
                    "readability_score": metadata.get("flesch_reading_score", metadata.get("readability_score")),
                    "content_type": metadata.get("content_type"),
                    "processing_timestamp": metadata.get("processing_timestamp")
                })
            
            # Check if element has adapter-generated structure
            if hasattr(article_element, 'structure_data'):
                structure = article_element.structure_data
                enhanced_data.update({
                    "heading_structure": structure.get("headings", []),
                    "content_sections": structure.get("sections", [])
                })
            
            # Check if element has content type info
            if hasattr(article_element, 'content_type'):
                enhanced_data["content_type"] = article_element.content_type
                
            # Check if element has adapter version info
            if hasattr(article_element, 'metadata') and isinstance(article_element.metadata, dict):
                enhanced_data["adapter_version"] = article_element.metadata.get("adapter_version")
                
        except Exception as e:
            print(f"Warning: Could not extract enhanced data: {e}")
            
        return enhanced_data

    def analyze_emotional_journey(self):
        """Analyze emotional journey - EXACT JavaScript equivalent"""
        text = self.article_data.get("full_text", "")
        text_length = max(len(text), 1)
        
        self.emotional_journey = {
            "problemIntensity": self.detect_emotional_markers(text, [
                'complication', 'failure', 'risk', 'challenge', 'difficult', 'controversy'
            ]) / text_length * 1000,
            
            "solutionConfidence": self.detect_emotional_markers(text, [
                'effective', 'successful', 'proven', 'reliable', 'consistent', 'evidence'
            ]) / text_length * 1000,
            
            "innovationLevel": self.detect_emotional_markers(text, [
                'novel', 'innovative', 'breakthrough', 'advanced', 'cutting-edge', 'revolutionary'
            ]) / text_length * 1000,
            
            "healingPotential": self.detect_emotional_markers(text, [
                'recovery', 'healing', 'improvement', 'restoration', 'rehabilitation', 'outcome'
            ]) / text_length * 1000,
            
            "uncertaintyLevel": self.detect_emotional_markers(text, [
                'may', 'might', 'possibly', 'unclear', 'variable', 'depends', 'further research'
            ]) / text_length * 1000
        }
        
        # Find dominant emotion
        self.emotional_journey["dominantEmotion"] = self.get_dominant_emotion()
        
        print(f"💭 Emotional journey mapped: {self.emotional_journey}")

    def extract_medical_terms(self, article_element):
        """Extract medical terms - EXACT JavaScript equivalent"""
        text = article_element.text_content.lower()
        
        medical_categories = {
            "procedures": {
                "terms": ['tenotomy', 'tenodesis', 'arthroscopy', 'repair', 'reconstruction', 'arthroplasty'],
                "weight": 1.0
            },
            "anatomy": {
                "terms": ['tendon', 'ligament', 'joint', 'bone', 'muscle', 'cartilage', 'meniscus'],
                "weight": 0.8
            },
            "outcomes": {
                "terms": ['success rate', 'complication', 'recovery', 'satisfaction', 'function'],
                "weight": 1.2
            },
            "research": {
                "terms": ['study', 'trial', 'meta-analysis', 'evidence', 'randomized', 'cohort'],
                "weight": 0.9
            }
        }
        
        extracted_terms = {}
        
        for category, data in medical_categories.items():
            extracted_terms[category] = {}
            
            for term in data["terms"]:
                regex = re.compile(r'\b' + re.escape(term) + r'\b', re.IGNORECASE)
                matches = regex.findall(text)
                
                if matches:
                    extracted_terms[category][term] = {
                        "count": len(matches),
                        "weight": data["weight"],
                        "significance": len(matches) * data["weight"]
                    }
        
        return extracted_terms

    def extract_statistics(self, article_element):
        """Extract statistics - EXACT JavaScript equivalent"""
        text = article_element.text_content
        statistics = []
        
        patterns = {
            "percentages": r'(\d+(?:\.\d+)?)\s*%',
            "outcomes": r'(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*(\d+)',
            "pValues": r'p\s*[<>=]\s*(\d+(?:\.\d+)?)',
            "confidenceIntervals": r'(\d+(?:\.\d+)?)\s*%?\s*ci',
            "followUp": r'(\d+)\s*(?:months?|years?|weeks?)\s*follow-?up',
            "sampleSizes": r'n\s*=\s*(\d+)'
        }
        
        for stat_type, pattern in patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                value = float(match.group(1))
                statistics.append({
                    "type": stat_type,
                    "value": value,
                    "rawText": match.group(0),
                    "context": self.get_statistic_context(text, match.start()),
                    "significance": self.assess_statistic_significance(stat_type, value)
                })
        
        return statistics

    def extract_citations(self, article_element):
        """Extract citations - EXACT JavaScript equivalent"""
        text = article_element.text_content
        citations = []
        
        # Look for year patterns
        year_pattern = re.compile(r'\b(19|20)\d{2}\b')
        matches = year_pattern.findall(text)
        
        # Look for "et al." patterns
        etal_pattern = re.compile(r'\b\w+\s+et\s+al\.', re.IGNORECASE)
        etal_matches = etal_pattern.findall(text)
        
        total_citations = len(matches) + len(etal_matches)
        
        for i in range(min(total_citations, 20)):
            citations.append({
                "index": i,
                "importance": random.random() * 0.5 + 0.5,
                "impact": random.random() * 0.8 + 0.2
            })
        
        return citations

    def detect_subspecialty(self):
        """Detect subspecialty - EXACT JavaScript equivalent with enhanced detection"""
        text = self.article_data.get("full_text", "").lower()
        
        subspecialty_keywords = {
            "shoulderElbow": {
                "keywords": [
                    {"term": "biceps", "weight": 3},
                    {"term": "rotator cuff", "weight": 3},
                    {"term": "labrum", "weight": 3},
                    {"term": "subacromial", "weight": 3},
                    {"term": "slap", "weight": 3},
                    {"term": "shoulder", "weight": 2.5},
                    {"term": "elbow", "weight": 2.5},
                    {"term": "tenotomy", "weight": 2},
                    {"term": "tenodesis", "weight": 2}
                ],
                "minimum_score": 3
            },
            "sportsMedicine": {
                "keywords": [
                    {"term": "acl", "weight": 3},
                    {"term": "meniscus", "weight": 3},
                    {"term": "sports", "weight": 2},
                    {"term": "athlete", "weight": 2},
                    {"term": "return to play", "weight": 2.5}
                ],
                "minimum_score": 3
            },
            "jointReplacement": {
                "keywords": [
                    {"term": "arthroplasty", "weight": 3},
                    {"term": "replacement", "weight": 3},
                    {"term": "prosthesis", "weight": 3},
                    {"term": "implant", "weight": 3}
                ],
                "minimum_score": 3
            },
            "trauma": {
                "keywords": [
                    {"term": "fracture", "weight": 3},
                    {"term": "fixation", "weight": 3},
                    {"term": "trauma", "weight": 2}
                ],
                "minimum_score": 3
            },
            "spine": {
                "keywords": [
                    {"term": "spine", "weight": 3},
                    {"term": "vertebra", "weight": 3},
                    {"term": "disc", "weight": 3}
                ],
                "minimum_score": 3
            },
            "handUpperExtremity": {
                "keywords": [
                    {"term": "hand", "weight": 3},
                    {"term": "wrist", "weight": 3},
                    {"term": "finger", "weight": 3}
                ],
                "minimum_score": 5
            },
            "footAnkle": {
                "keywords": [
                    {"term": "foot", "weight": 3},
                    {"term": "ankle", "weight": 3},
                    {"term": "plantar", "weight": 3}
                ],
                "minimum_score": 3
            }
        }
        
        scores = {}
        
        for subspecialty, data in subspecialty_keywords.items():
            score = 0
            matched_terms = []
            
            for keyword_data in data["keywords"]:
                term = keyword_data["term"]
                weight = keyword_data["weight"]
                regex = re.compile(r'\b' + re.escape(term) + r'\b', re.IGNORECASE)
                matches = regex.findall(text)
                term_score = len(matches) * weight
                
                if term_score > 0:
                    score += term_score
                    matched_terms.append({"term": term, "count": len(matches), "contribution": term_score})
            
            scores[subspecialty] = {
                "total_score": score,
                "matched_terms": matched_terms,
                "meets_threshold": score >= data["minimum_score"]
            }
        
        # Find subspecialty with highest score that meets threshold
        detected_subspecialty = 'sportsMedicine'  # Default
        max_score = 0
        
        for subspecialty, data in scores.items():
            if data["meets_threshold"] and data["total_score"] > max_score:
                max_score = data["total_score"]
                detected_subspecialty = subspecialty
        
        # Special case: shoulder/elbow override
        if (detected_subspecialty == 'handUpperExtremity' and 
            scores.get('shoulderElbow', {}).get('total_score', 0) > 2):
            detected_subspecialty = 'shoulderElbow'
        
        self.subspecialty = detected_subspecialty
        print(f"🏥 Detected subspecialty: {self.subspecialty} (score: {max_score})")

    def generate_visual_elements(self):
        """Generate visual elements - EXACT JavaScript equivalent"""
        self.visual_elements = []
        
        # Generate Andry Tree root system
        self.generate_andry_tree_roots()
        
        # Generate main trunk and branches
        self.generate_tree_structure()
        
        # Generate healing elements
        self.generate_healing_elements()
        
        # Generate data flows
        self.generate_data_flows()
        
        # Generate emotional fields
        self.generate_emotional_fields()
        
        # Generate research constellation
        self.generate_research_constellation()
        
        # Generate atmospheric elements
        self.generate_atmospheric_elements()
        
        print(f"🌳 Generated {len(self.visual_elements)} visual elements")

    def get_algorithm_output(self) -> Dict[str, Any]:
        """Return complete algorithm output matching frontend expectations"""
        return {
            # Core Analysis
            "evidence_strength": self.article_data.get("evidence_strength", 0.5),
            "technical_density": self.article_data.get("technical_density", 0.5),
            "subspecialty": self.subspecialty,
            "dominant_emotion": self.emotional_journey.get("dominantEmotion", "confidence"),
            
            # CRITICAL: Emotional Journey (what frontend needs)
            "emotional_journey": self.emotional_journey,
            
            # Emotional Mix (converted from journey for compatibility)
            "emotional_mix": self.convert_journey_to_mix(),
            
            # Medical Content Analysis
            "medical_terms": self.article_data.get("medical_terms", {}),
            "statistical_data": self.article_data.get("statistical_data", []),
            "research_citations": self.article_data.get("research_citations", []),
            
            # Visual Elements
            "visual_elements": self.visual_elements,
            
            # Tree Structure
            "tree_complexity": self.article_data.get("evidence_strength", 0.5),
            "branch_pattern": self.subspecialty,
            "root_depth": min(len(self.article_data.get("research_citations", [])) / 10, 1.0),
            
            # Additional Data
            "article_word_count": self.article_data.get("word_count", 0),
            "processing_timestamp": datetime.utcnow().isoformat(),
            "algorithm_version": "2.0-comprehensive-metadata",
            
            # Uniqueness and Complexity
            "data_complexity": self.calculate_data_complexity(),
            "uniqueness_factors": self.calculate_uniqueness_factors(),
            
            # NEW: Comprehensive metadata for Phase 2
            "comprehensive_metadata": {
                "visual_characteristics": {
                    "element_count": len(self.visual_elements),
                    "element_density": len(self.visual_elements) / (self.canvas_width * self.canvas_height) * 1000000,
                    "color_diversity": len(set(el.get('color', '') for el in self.visual_elements)),
                    "pattern_complexity": len(set(el.get('type', '') for el in self.visual_elements)) / 10.0,
                    "canvas_utilization": min(1.0, len(self.visual_elements) / 100.0)
                },
                "generation_parameters": {
                    "algorithm_version": "2.0-comprehensive-metadata",
                    "generation_timestamp": datetime.utcnow().isoformat(),
                    "subspecialty_input": self.subspecialty,
                    "emotional_weights": self.emotional_journey,
                    "evidence_strength_input": self.article_data.get("evidence_strength", 0.5),
                    "technical_density_input": self.article_data.get("technical_density", 0.5),
                    "medical_terms_count": len(self.article_data.get("medical_terms", {})),
                    "statistical_data_count": len(self.article_data.get("statistical_data", [])),
                    "research_citations_count": len(self.article_data.get("research_citations", [])),
                    "parameter_evolution_generation": 1
                },
                "pattern_usage": {
                    "tree_pattern_signature": self.generate_tree_pattern_signature(),
                    "element_distribution_pattern": self.generate_element_distribution_pattern(),
                    "color_pattern_signature": self.generate_color_pattern_signature()
                },
                "ai_analysis_data": {
                    "uniqueness_factors": self.calculate_uniqueness_factors(),
                    "pattern_fingerprint": f"fp_{abs(hash(str(self.visual_elements)))%10000:04d}",
                    "evolution_readiness": {
                        "parameter_stability": 0.8,
                        "pattern_maturity": 0.7,
                        "creative_potential": 0.9,
                        "modification_safety": 0.85
                    },
                    "feature_vectors": {
                        "emotional_signature": list(self.emotional_journey.values()) if self.emotional_journey else [0.5],
                        "subspecialty_signature": self.subspecialty,
                        "complexity_signature": self.calculate_data_complexity(),
                        "visual_signature": len(self.visual_elements)
                    }
                }
            }
        }

    # Helper methods (add all the missing helper methods from JavaScript version)
    def get_word_count(self, element):
        text = element.text_content
        return len([word for word in text.split() if word.strip()])

    def get_paragraph_count(self, element):
        # Simulate paragraph counting
        return len([p for p in element.text_content.split('\n\n') if p.strip()])

    def detect_emotional_markers(self, text: str, keywords: List[str]) -> int:
        count = 0
        for keyword in keywords:
            count += len(re.findall(r'\b' + re.escape(keyword) + r'\b', text, re.IGNORECASE))
        return count

    def get_dominant_emotion(self) -> str:
        emotions = {k: v for k, v in self.emotional_journey.items() 
                   if k != "dominantEmotion" and isinstance(v, (int, float))}
        return max(emotions, key=emotions.get) if emotions else "confidence"

    def convert_journey_to_mix(self) -> Dict[str, float]:
        """Convert emotional journey to emotional mix for compatibility"""
        # Normalize journey values to 0-1 range for mix
        max_val = max([v for v in self.emotional_journey.values() if isinstance(v, (int, float))]) or 1
        
        return {
            "hope": self.emotional_journey.get("healingPotential", 0) / max_val,
            "confidence": self.emotional_journey.get("solutionConfidence", 0) / max_val,
            "breakthrough": self.emotional_journey.get("innovationLevel", 0) / max_val,
            "healing": self.emotional_journey.get("healingPotential", 0) / max_val,
            "tension": self.emotional_journey.get("problemIntensity", 0) / max_val,
            "uncertainty": self.emotional_journey.get("uncertaintyLevel", 0) / max_val
        }

    def generate_tree_structure(self):
      """Generate enhanced tree structure with better content detection and more branches"""
      # Clear existing tree elements only (preserve roots and other elements)
      self.visual_elements = [el for el in self.visual_elements if el.get("type") not in ["andryTrunk", "andryBranch"]]
      
      # Enhanced content section detection
      content_sections = self.article_data.get("content_sections", [])
      if not content_sections or len(content_sections) < 3:
          content_sections = self.generate_enhanced_sections()
      
      # Add statistical sections if we have significant statistical data
      statistical_data = self.article_data.get("statistical_data", [])
      if len(statistical_data) > 3:
          content_sections.extend(self.generate_statistical_sections(statistical_data))
      
      # Add research sections if we have significant citations
      research_citations = self.article_data.get("research_citations", [])
      if len(research_citations) > 5:
          content_sections.extend(self.generate_research_sections(research_citations))
    
      # Limit total sections to prevent overcrowding but allow more branches
      content_sections = content_sections[:12]  # Increased from 6 to 12
      trunk_height = min(400, len(content_sections) * 35 + 120)  # Increased height
    
      print(f"🌿 Generating tree with {len(content_sections)} content sections")
      print(f"   📋 Section sources: {[s.get('source', 'content') for s in content_sections]}")
      print(f"   📏 Trunk height: {trunk_height}, Section count: {len(content_sections)}")
    
      # Main trunk (article spine)
      self.visual_elements.append({
          "type": "andryTrunk",
          "x": self.canvas_width / 2,
          "y": self.canvas_height * 0.85,
          "height": trunk_height,
          "thickness": 8 + (self.article_data.get("technical_density", 0.5) * 5),
          "color": self.brand_colors["primary"],
          "healing": self.tree_parameters["healing_rate"]
      })
    
      # Generate branches for each major content section - ENHANCED with more branching
      for index, section in enumerate(content_sections):
          branch_y = self.canvas_height * 0.85 - (index + 1) * (trunk_height / len(content_sections))
          branch_side = -1 if index % 2 == 0 else 1  # Alternate sides
        
          # Enhanced angle calculation with more variation
          base_angle = 140 if branch_side == -1 else 40  # Left: 110-170°, Right: 10-70°
          angle_variation = random.random() * 40  # Increased randomness
          subspecialty_modifier = self.get_subspecialty_branch_modifier()
          final_angle = base_angle + (branch_side * angle_variation) + subspecialty_modifier
        
          # Enhanced length and thickness based on section importance
          base_length = 70 + section.get("importance", 0.5) * 50  # Increased base length
          complexity_bonus = section.get("complexity", 0.5) * 30
          final_length = base_length + complexity_bonus
          
          base_thickness = 4 + section.get("complexity", 0.5) * 3
          
          self.generate_enhanced_branch(
              self.canvas_width / 2,
              branch_y,
              final_angle,
              final_length,
              base_thickness,
              section.get("emotionalTone", "confidence"),
              section,
              index
          )
    
    def generate_enhanced_sections(self):
        """Generate enhanced content sections with better detection"""
        # Start with basic sections
        sections = self.generate_default_sections()
        
        # Add sections based on medical terms
        medical_terms = self.article_data.get("medical_terms", {})
        for category, terms in medical_terms.items():
            if terms and len(terms) > 2:  # Only if significant content
                sections.append({
                    "title": f"{category.title()} Analysis",
                    "level": 2,
                    "importance": 0.7 + len(terms) * 0.05,
                    "complexity": 0.6 + len(terms) * 0.03,
                    "emotionalTone": self.get_medical_category_emotion(category),
                    "source": "medical_terms"
                })
        
        # Add sections based on evidence strength
        evidence_strength = self.article_data.get("evidence_strength", 0.5)
        if evidence_strength > 0.7:
            sections.append({
                "title": "Evidence Review",
                "level": 2,
                "importance": evidence_strength,
                "complexity": 0.8,
                "emotionalTone": "confidence",
                "source": "evidence"
            })
        
        return sections[:8]  # Limit to prevent overcrowding
    
    def generate_statistical_sections(self, statistical_data):
        """Generate sections based on statistical content"""
        sections = []
        
        # Group statistics by type
        stat_types = {}
        for stat in statistical_data:
            stat_type = stat.get("type", "general")
            if stat_type not in stat_types:
                stat_types[stat_type] = []
            stat_types[stat_type].append(stat)
        
        # Create sections for significant statistical groups
        for stat_type, stats in stat_types.items():
            if len(stats) >= 2:  # Only if multiple stats of this type
                avg_significance = sum(s.get("significance", 0.5) for s in stats) / len(stats)
                sections.append({
                    "title": f"{stat_type.title()} Analysis",
                    "level": 2,
                    "importance": 0.6 + avg_significance * 0.3,
                    "complexity": 0.7 + len(stats) * 0.05,
                    "emotionalTone": "breakthrough",
                    "source": "statistics"
                })
        
        return sections[:3]  # Limit statistical sections
    
    def generate_research_sections(self, research_citations):
        """Generate sections based on research citations"""
        sections = []
        
        # Create sections based on citation impact
        high_impact_citations = [c for c in research_citations if c.get("impact", 0.5) > 0.7]
        
        if len(high_impact_citations) >= 3:
            sections.append({
                "title": "Key Research Findings",
                "level": 2,
                "importance": 0.9,
                "complexity": 0.7 + len(high_impact_citations) * 0.02,
                "emotionalTone": "hope",
                "source": "research"
            })
        
        if len(research_citations) >= 10:
            sections.append({
                "title": "Literature Review",
                "level": 2,
                "importance": 0.8,
                "complexity": 0.6,
                "emotionalTone": "confidence",
                "source": "research"
            })
        
        return sections[:2]  # Limit research sections
    
    def get_medical_category_emotion(self, category):
        """Get emotional tone for medical category"""
        category_emotions = {
            "procedures": "breakthrough",
            "anatomy": "confidence", 
            "outcomes": "healing",
            "research": "hope"
        }
        return category_emotions.get(category, "confidence")
    
    def get_subspecialty_branch_modifier(self):
        """Get subspecialty-specific branch angle modifier"""
        subspecialty_modifiers = {
            "sportsMedicine": 5,      # Slightly outward for movement
            "shoulderElbow": -3,      # Slightly inward for focus
            "jointReplacement": 0,    # Precise, no modifier
            "trauma": 8,              # More chaotic, outward
            "spine": -5,              # Inward, careful
            "handUpperExtremity": 2,  # Slightly outward for dexterity
            "footAnkle": 3            # Slightly outward for ground contact
        }
        return subspecialty_modifiers.get(self.subspecialty, 0)
    
    def generate_enhanced_branch(self, x, y, angle, length, thickness, emotional_tone, section, index):
        """Generate enhanced branch with aggressive sub-branching"""
        import math
        
        # Main branch
        branch = {
            "type": "andryBranch",
            "x": x,
            "y": y,
            "angle": angle,
            "length": length,
            "thickness": thickness,
            "color": self.get_emotional_color(emotional_tone, 0.6),
            "emotionalTone": emotional_tone,
            "section_source": section.get("source", "content"),
            "generation_context": {
                "section_importance": section.get("importance", 0.5),
                "section_complexity": section.get("complexity", 0.5),
                "branch_index": index
            }
        }
        
        self.visual_elements.append(branch)
        
        # Enhanced sub-branch generation - more aggressive
        evidence_strength = self.article_data.get("evidence_strength", 0.5)
        technical_density = self.article_data.get("technical_density", 0.5)
        
        # Multiple criteria for sub-branch generation
        should_branch_complexity = length > 70 and section.get("complexity", 0.5) > 0.6
        should_branch_evidence = evidence_strength > 0.6 and random.random() > 0.3
        should_branch_technical = technical_density > 0.7 and random.random() > 0.4
        should_branch_importance = section.get("importance", 0.5) > 0.8 and random.random() > 0.5
        
        if should_branch_complexity or should_branch_evidence or should_branch_technical or should_branch_importance:
            # Generate 1-3 sub-branches instead of just 1
            num_sub_branches = 1
            if should_branch_complexity and should_branch_evidence:
                num_sub_branches = 2
            if should_branch_technical and should_branch_importance:
                num_sub_branches = 3
            
            for i in range(num_sub_branches):
                # Position sub-branches at different points along main branch
                branch_position = 0.4 + (i * 0.2) + random.random() * 0.2
                sub_angle = angle + (random.random() - 0.5) * 60  # Wider angle range
                sub_length = length * (0.5 + random.random() * 0.3)  # More variable length
                sub_thickness = thickness * (0.6 + random.random() * 0.2)
                
                # Calculate sub-branch position
                sub_x = x + math.cos(angle * math.pi / 180) * length * branch_position
                sub_y = y + math.sin(angle * math.pi / 180) * length * branch_position
                
                # Vary emotional tone for sub-branches
                sub_emotions = ["confidence", "healing", "breakthrough", "hope"]
                sub_emotion = random.choice(sub_emotions) if random.random() > 0.7 else emotional_tone
                
                self.visual_elements.append({
                    "type": "andryBranch",
                    "x": sub_x,
                    "y": sub_y,
                    "angle": sub_angle,
                    "length": sub_length,
                    "thickness": sub_thickness,
                    "color": self.get_emotional_color(sub_emotion, 0.4),
                    "emotionalTone": sub_emotion,
                    "parent_branch": True,
                    "sub_branch_index": i,
                    "generation_context": {
                        "parent_section": section.get("title", "Unknown"),
                        "branch_criteria": {
                            "complexity": should_branch_complexity,
                            "evidence": should_branch_evidence,
                            "technical": should_branch_technical,
                            "importance": should_branch_importance
                        }
                    }
                })

    def generate_branch(self, x, y, angle, length, thickness, emotional_tone):
        """Generate branch with optional sub-branches - ENHANCED"""
        import math
    
        branch = {
            "type": "andryBranch",
            "x": x,
            "y": y,
            "angle": angle,
            "length": length,
            "thickness": thickness,
            "color": self.get_emotional_color(emotional_tone, 0.6),
            "emotionalTone": emotional_tone
        }
    
        self.visual_elements.append(branch)
    
        # Optionally add sub-branches for more complex trees
        if length > 80 and random.random() > 0.5:
            # Add a smaller sub-branch
            sub_angle = angle + (random.random() - 0.5) * 40
            sub_length = length * 0.6
            sub_thickness = thickness * 0.7
        
            # Position sub-branch partway along the main branch
            midpoint = 0.6 + random.random() * 0.2
            sub_x = x + math.cos(angle * math.pi / 180) * length * midpoint
            sub_y = y + math.sin(angle * math.pi / 180) * length * midpoint
        
            self.visual_elements.append({
                "type": "andryBranch",
                "x": sub_x,
                "y": sub_y,
                "angle": sub_angle,
                "length": sub_length,
                "thickness": sub_thickness,
                "color": self.get_emotional_color(emotional_tone, 0.4),
                "emotionalTone": emotional_tone
            })

    def generate_default_sections(self):
        """Generate default content sections when none are detected"""
        return [
            {
                "title": "Introduction",
                "level": 2,
                "importance": 0.5,
                "complexity": 0.5,
                "emotionalTone": "confidence"
            },
            {
                "title": "Main Content",
                "level": 2,
                "importance": 0.8,
                "complexity": 0.7,
                "emotionalTone": "healing"
            },
            {
                "title": "Results",
                "level": 2,
                "importance": 0.9,
                "complexity": 0.6,
                "emotionalTone": "breakthrough"
            },
            {
                "title": "Conclusion",
                "level": 2,
                "importance": 0.6,
                "complexity": 0.4,
                "emotionalTone": "hope"
            }
        ]

    def get_emotional_color(self, emotion, intensity=1.0):
        """Get emotional color from palette"""
        palette = self.emotional_palettes.get(emotion, self.emotional_palettes["confidence"])
        color_index = min(int(intensity * len(palette)), len(palette) - 1)
        return palette[color_index]



    # Also update the identify_content_sections method to be more robust
    def identify_content_sections(self, element):
        """Identify content sections - Enhanced with adapter support"""
        # Try to use adapter-generated sections first
        if hasattr(element, 'structure_data') and element.structure_data.get('sections'):
            adapter_sections = element.structure_data['sections']
            if adapter_sections:
                print(f"📑 Using {len(adapter_sections)} adapter-generated sections")
                return adapter_sections[:6]  # Limit to 6 sections
        
        # Fallback to legacy section detection
        text = element.text_content
    
        # Try to detect section markers
        section_markers = [
            "introduction", "background", "methods", "methodology", "results", 
            "discussion", "conclusion", "conclusions", "summary", "abstract",
            "overview", "review", "analysis", "findings", "recommendations"
        ]
    
        sections = []
        detected_sections = []
    
        # Simple section detection based on keywords
        for marker in section_markers:
            if marker.lower() in text.lower():
                detected_sections.append({
                    "title": marker.title(),
                    "level": 2,
                    "importance": 0.7 + (random.random() * 0.3),  # 0.7-1.0
                    "complexity": 0.5 + (random.random() * 0.4),  # 0.5-0.9
                    "emotionalTone": self.get_section_emotion(marker)
                })
    
        # If we found sections, use them; otherwise use defaults
        if detected_sections:
            # Limit to max 6 sections for visual clarity
            sections = detected_sections[:6]
        else:
            sections = self.generate_default_sections()
    
        print(f"📑 Identified {len(sections)} content sections (legacy method)")
        return sections

    def get_section_emotion(self, section_name):
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

    # Add placeholder methods for missing functions
    def calculate_readability(self, element): return 0.5
    def calculate_technical_density(self, element): return 0.5
    def assess_evidence_strength(self, element): return 0.5
    def assess_certainty_level(self, element): return 0.5
    
    def analyze_argument_flow(self, element): return {}
    def analyze_heading_structure(self, element): return {}
    def get_statistic_context(self, text, position): return ""
    def assess_statistic_significance(self, stat_type, value):
        """Assess statistical significance based on type and value"""
        significance_weights = {
            "percentage": 0.7,
            "ratio": 0.8,
            "pvalue": 0.9,
            "correlation": 0.8,
            "mean": 0.6,
            "median": 0.5,
            "count": 0.4
        }
        
        base_significance = significance_weights.get(stat_type, 0.5)
        
        # Adjust based on value if it's a number
        try:
            num_value = float(value)
            if stat_type == "pvalue":
                # Lower p-values are more significant
                if num_value < 0.01:
                    base_significance = 0.95
                elif num_value < 0.05:
                    base_significance = 0.85
                elif num_value < 0.1:
                    base_significance = 0.7
            elif stat_type == "percentage":
                # Extreme percentages are more significant
                if num_value > 90 or num_value < 10:
                    base_significance = 0.9
                elif num_value > 80 or num_value < 20:
                    base_significance = 0.8
        except (ValueError, TypeError):
            pass
        
        return base_significance
    
    def generate_tree_pattern_signature(self):
        """Generate tree pattern signature"""
        tree_elements = [el for el in self.visual_elements if 'andry' in el.get('type', '')]
        return f"tree_{len(tree_elements)}_{self.subspecialty}"
    
    def generate_element_distribution_pattern(self):
        """Generate element distribution pattern"""
        distribution = {}
        for element in self.visual_elements:
            elem_type = element.get('type', 'unknown')
            distribution[elem_type] = distribution.get(elem_type, 0) + 1
        return distribution
    
    def generate_color_pattern_signature(self):
        """Generate color pattern signature"""
        colors_with_values = [el.get('color', '') for el in self.visual_elements if el.get('color')]
        unique_colors = len(set(colors_with_values))
        return f"colors_{unique_colors}"

    def generate_andry_tree_roots(self):
        """Generate Andry tree root system with enhanced randomization and article-specific variation"""
        evidence_strength = self.article_data.get("evidence_strength", 0.5)
        word_count = self.article_data.get("word_count", 0)
        citations_count = len(self.article_data.get("research_citations", []))
        
        # Create article-specific seed for consistent randomness
        article_seed = abs(hash(self.article_data.get("full_text", "")[:100])) % 10000
        random.seed(article_seed)
        
        # Enhanced root complexity based on multiple factors
        base_complexity = max(4, int(evidence_strength * 12))  # Increased from 3-8 to 4-12
        content_bonus = min(3, int(word_count / 500))  # +1 per 500 words, max 3
        citation_bonus = min(2, citations_count // 5)  # +1 per 5 citations, max 2
        subspecialty_bonus = self.get_subspecialty_root_bonus()
        
        root_complexity = base_complexity + content_bonus + citation_bonus + subspecialty_bonus
        
        # Subspecialty-specific root patterns
        subspecialty_patterns = self.get_subspecialty_root_patterns()
        current_pattern = subspecialty_patterns.get(self.subspecialty, subspecialty_patterns["default"])
        
        root_pattern_type = "evidence_based_complex" if evidence_strength > 0.7 else "simple_spread"
        
        print(f"🌳 Root generation: complexity={root_complexity}, pattern={self.subspecialty}, seed={article_seed}")
        print(f"   📊 Evidence: {evidence_strength:.2f}, Citations: {citations_count}, Words: {word_count}")
        print(f"   🔧 Base: {base_complexity}, Content: +{content_bonus}, Citation: +{citation_bonus}, Subspecialty: +{subspecialty_bonus}")
        
        for i in range(root_complexity):
            # Base angle with subspecialty-specific spread
            base_angle_range = current_pattern["angle_range"]
            base_angle = (i / root_complexity) * base_angle_range + current_pattern["start_angle"]
            
            # Add randomization based on emotional journey
            emotional_variation = self.get_emotional_root_variation()
            angle_noise = (random.random() - 0.5) * current_pattern["randomness_factor"]
            final_angle = base_angle + emotional_variation + angle_noise
            
            # Variable length based on evidence strength and randomness
            base_length = 50 + (evidence_strength * 100)
            length_variation = (random.random() - 0.5) * 40  # ±20px variation
            final_length = base_length + length_variation
            
            # Variable thickness with randomness
            base_thickness = 1 + (evidence_strength * 3)
            thickness_variation = (random.random() - 0.5) * 1.5  # ±0.75px variation
            final_thickness = max(0.5, base_thickness + thickness_variation)
            
            # Color variation based on emotional state
            root_emotion = self.get_root_emotional_tone(i, root_complexity)
            
            self.visual_elements.append({
                "type": "andryRoot",
                "x": self.canvas_width / 2,
                "y": self.canvas_height * 0.85,
                "angle": final_angle,
                "length": final_length,
                "thickness": final_thickness,
                "color": self.get_emotional_color(root_emotion, 0.3 + random.random() * 0.3),
                "pattern_type": root_pattern_type,
                "subspecialty_pattern": self.subspecialty,
                "generation_context": {
                    "evidence_strength": evidence_strength,
                    "root_complexity": root_complexity,
                    "article_seed": article_seed,
                    "base_angle": base_angle,
                    "emotional_variation": emotional_variation,
                    "angle_noise": angle_noise,
                    "pattern_signature": f"root_{root_complexity}_{self.subspecialty}_{article_seed}"
                }
            })
        
        # Reset random seed to avoid affecting other generation
        random.seed()
    
    def get_subspecialty_root_bonus(self):
        """Get subspecialty-specific bonus for root complexity"""
        subspecialty_bonuses = {
            "sportsMedicine": 1,  # Moderate complexity
            "shoulderElbow": 2,   # Higher complexity (detailed anatomy)
            "jointReplacement": 3, # Highest complexity (technical procedures)
            "trauma": 2,          # Higher complexity (urgent/complex cases)
            "spine": 3,           # Highest complexity (spinal anatomy)
            "handUpperExtremity": 2, # Higher complexity (fine motor)
            "footAnkle": 1        # Moderate complexity
        }
        return subspecialty_bonuses.get(self.subspecialty, 1)
    
    def get_subspecialty_root_patterns(self):
        """Get subspecialty-specific root spread patterns"""
        return {
            "sportsMedicine": {
                "angle_range": 160,  # Wide spread for athletic movement
                "start_angle": 190,
                "randomness_factor": 25
            },
            "shoulderElbow": {
                "angle_range": 140,  # Focused on upper anatomy
                "start_angle": 200,
                "randomness_factor": 20
            },
            "jointReplacement": {
                "angle_range": 120,  # Precise, surgical pattern
                "start_angle": 210,
                "randomness_factor": 15
            },
            "trauma": {
                "angle_range": 180,  # Chaotic, wide spread
                "start_angle": 180,
                "randomness_factor": 35
            },
            "spine": {
                "angle_range": 100,  # Narrow, vertical focus
                "start_angle": 220,
                "randomness_factor": 10
            },
            "handUpperExtremity": {
                "angle_range": 130,  # Detailed, precise
                "start_angle": 205,
                "randomness_factor": 18
            },
            "footAnkle": {
                "angle_range": 150,  # Ground-focused spread
                "start_angle": 195,
                "randomness_factor": 22
            },
            "default": {
                "angle_range": 150,
                "start_angle": 195,
                "randomness_factor": 20
            }
        }
    
    def get_emotional_root_variation(self):
        """Get angle variation based on emotional journey"""
        # Use dominant emotion to influence root spread
        dominant = self.emotional_journey.get("dominantEmotion", "confidence")
        
        emotional_variations = {
            "confidence": 0,        # Stable, no variation
            "healing": -5,          # Slight inward focus
            "breakthrough": 10,     # Outward expansion
            "hope": 5,              # Moderate outward
            "tension": 15,          # Wide, chaotic spread
            "uncertainty": -10      # Inward, cautious
        }
        
        base_variation = emotional_variations.get(dominant, 0)
        
        # Add intensity-based scaling
        problem_intensity = self.emotional_journey.get("problemIntensity", 0)
        intensity_factor = (problem_intensity / 10.0) * 5  # Scale to ±5 degrees
        
        return base_variation + intensity_factor
    
    def get_root_emotional_tone(self, root_index, total_roots):
        """Get emotional tone for individual root based on position"""
        # Map root position to emotional spectrum
        position_ratio = root_index / max(total_roots - 1, 1)
        
        # Create emotional gradient across roots
        if position_ratio < 0.2:
            return "confidence"      # Center roots: stable
        elif position_ratio < 0.4:
            return "healing"         # Inner roots: healing
        elif position_ratio < 0.6:
            return "breakthrough"    # Mid roots: innovation
        elif position_ratio < 0.8:
            return "hope"           # Outer roots: aspiration
        else:
            return "uncertainty"     # Edge roots: exploration
    
    def generate_healing_elements(self):
        """Generate healing elements with comprehensive metadata"""
        healing_potential = self.emotional_journey.get("healingPotential", 0.5)
        num_elements = int(healing_potential * 15) + 5
        
        pattern_type = "organic_scattered" if healing_potential > 0.7 else "linear_focused"
        
        for i in range(num_elements):
            self.visual_elements.append({
                "type": "healingParticle",
                "x": self.canvas_width / 2 + (random.random() - 0.5) * 200,
                "y": self.canvas_height * 0.3 + random.random() * 200,
                "size": 3 + random.random() * 8,
                "color": self.get_emotional_color("healing", 0.6),
                "pattern_type": pattern_type,
                "pulse_rate": 0.5 + random.random() * 1.5,
                "generation_context": {
                    "healing_potential": healing_potential,
                    "element_index": i,
                    "total_elements": num_elements,
                    "distribution_pattern": pattern_type
                }
            })
        
        # Healing aura
        self.visual_elements.append({
            "type": "healingAura",
            "x": self.canvas_width / 2,
            "y": self.canvas_height * 0.6,
            "radius": 100 + healing_potential * 150,
            "color": self.get_emotional_color("healing", 0.1),
            "pulse_amplitude": healing_potential * 50,
            "pattern_type": "central_aura",
            "generation_context": {
                "healing_potential": healing_potential,
                "influence_radius": 100 + healing_potential * 150
            }
        })
    def generate_data_flows(self):
        """Generate data flow streams with pattern analysis"""
        statistics = self.article_data.get("statistical_data", [])
        
        for index, stat in enumerate(statistics):
            flow_path = self.generate_flow_path(stat)
            pattern_signature = f"flow_{stat.get('type', 'unknown')}_{index}"
            
            self.visual_elements.append({
                "type": "dataFlow",
                "path": flow_path,
                "thickness": 1 + stat.get("significance", 0.5) * 2,
                "color": self.get_statistic_color(stat),
                "opacity": 0.4 + stat.get("significance", 0.5) * 0.4,
                "flow_speed": 0.5 + stat.get("significance", 0.5),
                "particle_count": int(stat.get("significance", 0.5) * 5) + 2,
                "pattern_signature": pattern_signature,
                "generation_context": {
                    "statistic_type": stat.get("type"),
                    "significance": stat.get("significance", 0.5),
                    "flow_index": index,
                    "path_complexity": self.calculate_path_complexity(flow_path)
                }
            })
    def generate_emotional_fields(self):
        """Generate emotional field overlays with pattern tracking"""
        emotions = ["problemIntensity", "solutionConfidence", "innovationLevel", 
                    "healingPotential", "uncertaintyLevel"]
        
        for index, emotion in enumerate(emotions):
            intensity = self.emotional_journey.get(emotion, 0)
            if intensity < 0.01:
                continue
                
            field_size = 50 + intensity * 200
            x = self.canvas_width * (0.2 + index * 0.15)
            y = self.canvas_height * (0.3 + random.random() * 0.4)
            
            emotion_mapped = self.map_journey_to_emotion(emotion)
            
            self.visual_elements.append({
                "type": "emotionalField",
                "emotion": emotion_mapped,
                "x": x,
                "y": y,
                "size": field_size,
                "intensity": intensity,
                "color": self.get_emotional_color(emotion_mapped, intensity * 0.3),
                "morph_speed": 0.2 + intensity * 0.8,
                "pattern_signature": f"field_{emotion}_{int(intensity*100)}",
                "generation_context": {
                    "original_emotion": emotion,
                    "mapped_emotion": emotion_mapped,
                    "intensity": intensity,
                    "field_index": index,
                    "spatial_position": {"x": x, "y": y}
                }
            })
    def generate_research_constellation(self):
        """Generate research constellation with connection analysis"""
        citations = self.article_data.get("research_citations", [])
        constellation_center = {
            "x": self.canvas_width * 0.8,
            "y": self.canvas_height * 0.2
        }
        
        constellation_pattern = "dense_network" if len(citations) > 10 else "sparse_cluster"
        
        for index, citation in enumerate(citations):
            angle = (index / len(citations)) * 360 if len(citations) > 0 else 0
            distance = 30 + citation.get("importance", 0.5) * 80
            
            x = constellation_center["x"] + math.cos(angle * math.pi / 180) * distance
            y = constellation_center["y"] + math.sin(angle * math.pi / 180) * distance
            
            self.visual_elements.append({
                "type": "researchStar",
                "x": x,
                "y": y,
                "size": 2 + citation.get("impact", 0.5) * 4,
                "color": self.get_emotional_color("confidence", 0.8),
                "twinkle_rate": 0.5 + citation.get("impact", 0.5),
                "connections": self.generate_star_connections(index, citations),
                "pattern_type": constellation_pattern,
                "generation_context": {
                    "citation_index": index,
                    "importance": citation.get("importance", 0.5),
                    "impact": citation.get("impact", 0.5),
                    "total_citations": len(citations),
                    "constellation_pattern": constellation_pattern
                }
            })
    def generate_atmospheric_elements(self):
        """Generate atmospheric elements with density analysis"""
        complexity = self.article_data.get("technical_density", 0.5)
        particle_count = int(complexity * 100) + 20
        
        atmosphere_pattern = "dense_technical" if complexity > 0.7 else "sparse_background"
        
        for i in range(particle_count):
            self.visual_elements.append({
                "type": "atmosphericParticle",
                "x": random.random() * self.canvas_width,
                "y": random.random() * self.canvas_height,
                "size": 0.5 + random.random() * 2,
                "color": self.brand_colors["primary"],
                "opacity": 0.1 + random.random() * 0.2,
                "drift_speed": 0.1 + random.random() * 0.5,
                "drift_direction": random.random() * 360,
                "pattern_type": atmosphere_pattern,
                "generation_context": {
                    "complexity_level": complexity,
                    "particle_index": i,
                    "total_particles": particle_count
                }
            })
        
        # Precision grid
        self.visual_elements.append({
            "type": "precisionGrid",
            "spacing": 30 + complexity * 20,
            "opacity": 0.05 + complexity * 0.1,
            "color": self.brand_colors["secondary"],
            "pattern_type": "medical_precision",
            "generation_context": {
                "complexity_influence": complexity,
                "grid_density": 30 + complexity * 20
            }
        })
    def apply_subspecialty_style(self):
        """Apply subspecialty-specific styling to visual elements"""
        subspecialty_modifiers = {
            "sportsMedicine": {"color_shift": 0.1, "energy_boost": 1.2},
            "shoulderElbow": {"color_shift": 0.15, "precision_increase": 1.1},
            "kneeHip": {"color_shift": 0.2, "stability_focus": 1.3},
            "jointReplacement": {"color_shift": 0.25, "technical_emphasis": 1.4},
            "trauma": {"color_shift": 0.3, "urgency_boost": 1.5},
            "spine": {"color_shift": 0.35, "structural_focus": 1.2},
            "handUpperExtremity": {"color_shift": 0.4, "dexterity_emphasis": 1.1},
            "footAnkle": {"color_shift": 0.45, "mobility_focus": 1.3}
        }
        
        modifier = subspecialty_modifiers.get(self.subspecialty, {"color_shift": 0.1})
        
        for element in self.visual_elements:
            if "color" in element:
                element["subspecialty_modifier"] = modifier
                element["modified_for_subspecialty"] = self.subspecialty
    def calculate_data_complexity(self):
        """Calculate overall data complexity score"""
        complexity = 0
        
        # Statistical data complexity
        stats = self.article_data.get("statistical_data", [])
        complexity += min(len(stats) * 0.1, 0.3)
        
        # Medical terms complexity
        terms = self.article_data.get("medical_terms", {})
        complexity += min(len(terms) * 0.05, 0.2)
        
        # Technical density
        technical = self.article_data.get("technical_density", 0.5)
        complexity += technical * 0.3
        
        # Research citations
        citations = self.article_data.get("research_citations", [])
        complexity += min(len(citations) * 0.02, 0.2)
        
        return min(complexity, 1.0)
    def calculate_uniqueness_factors(self):
        """Calculate uniqueness factors for the artwork"""
        return {
            "emotional_uniqueness": self.calculate_emotional_uniqueness(),
            "pattern_uniqueness": self.calculate_pattern_uniqueness(),
            "subspecialty_uniqueness": self.calculate_subspecialty_uniqueness(),
            "complexity_uniqueness": self.calculate_complexity_uniqueness(),
            "overall_uniqueness": self.calculate_overall_uniqueness()
        }
    
    def calculate_emotional_uniqueness(self):
        """Calculate emotional pattern uniqueness"""
        emotions = [v for v in self.emotional_journey.values() if isinstance(v, (int, float))]
        if not emotions:
            return 0.5
        
        # Check for extreme values or unusual combinations
        max_val = max(emotions)
        min_val = min(emotions)
        range_factor = (max_val - min_val) / max(max_val, 1)
        
        return min(range_factor + 0.3, 1.0)
    
    def calculate_pattern_uniqueness(self):
        """Calculate visual pattern uniqueness"""
        element_types = {}
        for element in self.visual_elements:
            elem_type = element.get("type", "unknown")
            element_types[elem_type] = element_types.get(elem_type, 0) + 1
        
        # More diverse element types = higher uniqueness
        diversity = len(element_types) / max(len(self.visual_elements), 1)
        return min(diversity + 0.2, 1.0)
    
    def calculate_subspecialty_uniqueness(self):
        """Calculate subspecialty-specific uniqueness"""
        # Different subspecialties have different baseline uniqueness
        subspecialty_rarity = {
            "sportsMedicine": 0.3,
            "shoulderElbow": 0.5,
            "kneeHip": 0.4,
            "jointReplacement": 0.7,
            "trauma": 0.6,
            "spine": 0.5,
            "handUpperExtremity": 0.8,
            "footAnkle": 0.6
        }
        return subspecialty_rarity.get(self.subspecialty, 0.5)
    
    def calculate_complexity_uniqueness(self):
        """Calculate complexity-based uniqueness"""
        complexity = self.calculate_data_complexity()
        # High complexity or very low complexity both contribute to uniqueness
        if complexity > 0.8 or complexity < 0.2:
            return 0.8
        return 0.4
    
    def calculate_overall_uniqueness(self):
        """Calculate overall uniqueness score"""
        emotional = self.calculate_emotional_uniqueness()
        pattern = self.calculate_pattern_uniqueness()
        subspecialty = self.calculate_subspecialty_uniqueness()
        complexity = self.calculate_complexity_uniqueness()
        
        return (emotional + pattern + subspecialty + complexity) / 4

    def get_emotional_color(self, emotion, alpha=1.0):
        """Get color for emotional state"""
        colors = self.emotional_palettes.get(emotion, self.emotional_palettes["confidence"])
        base_color = colors[0] if colors else "#3498db"
        
        # Add alpha if provided
        if alpha < 1.0:
            # Convert hex to rgba (simplified)
            return f"{base_color}{format(int(alpha * 255), '02x')}"
        return base_color
    
    def generate_flow_path(self, stat):
        """Generate path for data flow visualization"""
        # Create a curved path based on statistic properties
        start_x = random.random() * self.canvas_width * 0.2
        start_y = random.random() * self.canvas_height * 0.8 + self.canvas_height * 0.1
        
        end_x = self.canvas_width * 0.8 + random.random() * self.canvas_width * 0.2
        end_y = random.random() * self.canvas_height * 0.8 + self.canvas_height * 0.1
        
        # Control points for curve
        control1_x = start_x + (end_x - start_x) * 0.3
        control1_y = start_y - 50
        control2_x = start_x + (end_x - start_x) * 0.7
        control2_y = end_y - 50
        
        return {
            "start": {"x": start_x, "y": start_y},
            "control1": {"x": control1_x, "y": control1_y},
            "control2": {"x": control2_x, "y": control2_y},
            "end": {"x": end_x, "y": end_y}
        }
    
    def get_statistic_color(self, stat):
        """Get color for statistical data based on significance"""
        significance = stat.get("significance", 0.5)
        
        if significance > 0.8:
            return self.emotional_palettes["breakthrough"][0]
        elif significance > 0.6:
            return self.emotional_palettes["confidence"][0]
        elif significance > 0.4:
            return self.emotional_palettes["hope"][0]
        else:
            return self.emotional_palettes["uncertainty"][0]
    
    def calculate_path_complexity(self, path):
        """Calculate complexity of a path"""
        # Simple complexity based on distance and curve
        start = path["start"]
        end = path["end"]
        distance = math.sqrt((end["x"] - start["x"])**2 + (end["y"] - start["y"])**2)
        
        # Normalize to 0-1 range
        max_distance = math.sqrt(self.canvas_width**2 + self.canvas_height**2)
        return distance / max_distance
    
    def map_journey_to_emotion(self, journey_emotion):
        """Map emotional journey keys to emotion palette keys"""
        mapping = {
            "problemIntensity": "tension",
            "solutionConfidence": "confidence",
            "innovationLevel": "breakthrough",
            "healingPotential": "healing",
            "uncertaintyLevel": "uncertainty"
        }
        return mapping.get(journey_emotion, "confidence")
    
    def generate_star_connections(self, index, citations):
        """Generate connections between research stars"""
        connections = []
        
        # Connect to nearby stars (simple proximity-based)
        for i, other_citation in enumerate(citations):
            if i != index and abs(i - index) <= 2:
                connections.append({
                    "target_index": i,
                    "strength": 0.5 + random.random() * 0.5,
                    "type": "research_link"
                })
        
        return connections

class MockArticleElement:
    """Mock DOM element for server-side processing"""
    def __init__(self, content: str):
        self.text_content = content
        self.innerHTML = content

# Main functions to use in server.py
def process_article_with_manual_algorithm(content: str) -> Dict[str, Any]:
    """
    Process article using the complete manual algorithm (legacy function)
    Returns exact same data structure as JavaScript version
    Maintains backwards compatibility
    """
    generator = ArthrokinetixArtGenerator()
    return generator.process_article(content, "legacy")

def process_content_with_adapters(content: Union[str, Dict[str, Any]], content_type: str) -> Dict[str, Any]:
    """
    Process content using content adapters
    Supports multiple content types (HTML, PDF, Text)
    
    Args:
        content: Content to process (string, dict, or other format)
        content_type: Type of content ('html', 'text', 'pdf')
        
    Returns:
        Dict containing algorithm output
    """
    generator = ArthrokinetixArtGenerator()
    return generator.process_article(content, content_type)
