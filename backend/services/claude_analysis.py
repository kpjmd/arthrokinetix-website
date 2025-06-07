"""
Claude AI Emotional Analysis Service
Modular integration with fallback and caching
"""
import os
import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import anthropic
from pymongo import MongoClient

class ClaudeAnalysisService:
    """
    Handles Claude AI emotional analysis with caching and fallback
    """
    
    def __init__(self, db_client):
        self.db = db_client
        self.cache_collection = self.db.analysis_cache
        self.anthropic_client = self._initialize_claude()
        self.cache_duration = timedelta(hours=24)  # Cache for 24 hours
        
    def _initialize_claude(self):
        """Initialize Claude client with error handling"""
        try:
            api_key = os.environ.get('CLAUDE_API_KEY')
            if not api_key:
                print("Warning: Claude API key not found. Using fallback analysis.")
                return None
            return anthropic.Anthropic(api_key=api_key)
        except Exception as e:
            print(f"Error initializing Claude: {e}")
            return None
    
    def analyze_medical_content(self, content: str, article_metadata: Dict = None) -> Dict[str, Any]:
        """
        Analyze medical content for emotional undertones
        
        Args:
            content: Medical article content
            article_metadata: Additional metadata (subspecialty, citations, etc.)
            
        Returns:
            Dict with emotional analysis results
        """
        # Generate cache key
        cache_key = self._generate_cache_key(content, article_metadata)
        
        # Check cache first
        cached_result = self._get_cached_analysis(cache_key)
        if cached_result:
            return cached_result
        
        # Perform analysis
        analysis_result = self._perform_analysis(content, article_metadata)
        
        # Cache the result
        self._cache_analysis(cache_key, analysis_result)
        
        return analysis_result
    
    def _generate_cache_key(self, content: str, metadata: Dict = None) -> str:
        """Generate unique cache key for content"""
        content_hash = hashlib.md5(content.encode()).hexdigest()
        metadata_hash = hashlib.md5(json.dumps(metadata or {}, sort_keys=True).encode()).hexdigest()
        return f"claude_analysis_{content_hash}_{metadata_hash}"
    
    def _get_cached_analysis(self, cache_key: str) -> Optional[Dict]:
        """Retrieve cached analysis if still valid"""
        try:
            cached = self.cache_collection.find_one({"cache_key": cache_key})
            if cached and cached.get("expires_at") > datetime.utcnow():
                return cached.get("analysis_result")
        except Exception as e:
            print(f"Cache retrieval error: {e}")
        return None
    
    def _cache_analysis(self, cache_key: str, result: Dict):
        """Cache analysis result"""
        try:
            cache_entry = {
                "cache_key": cache_key,
                "analysis_result": result,
                "created_at": datetime.utcnow(),
                "expires_at": datetime.utcnow() + self.cache_duration
            }
            self.cache_collection.insert_one(cache_entry)
        except Exception as e:
            print(f"Cache storage error: {e}")
    
    def _perform_analysis(self, content: str, metadata: Dict = None) -> Dict[str, Any]:
        """Perform the actual emotional analysis"""
        if self.anthropic_client:
            try:
                return self._claude_analysis(content, metadata)
            except Exception as e:
                print(f"Claude analysis failed: {e}")
                return self._fallback_analysis(content, metadata)
        else:
            return self._fallback_analysis(content, metadata)
    
    def _claude_analysis(self, content: str, metadata: Dict = None) -> Dict[str, Any]:
        """Perform Claude AI analysis"""
        subspecialty = metadata.get("subspecialty", "general") if metadata else "general"
        evidence_strength = metadata.get("evidence_strength", 0.5) if metadata else 0.5
        
        prompt = f"""Analyze this medical research text for emotional undertones and return a JSON response:

Content: {content[:2000]}
Subspecialty: {subspecialty}
Evidence Strength: {evidence_strength}

Please analyze for these emotions and return scores 0-1:
- hope (recovery potential, positive outcomes, optimism)
- tension (complications, risks, challenges, difficulties)
- confidence (evidence strength, certainty, reliability)
- uncertainty (ambiguous results, need for more research, doubt)
- breakthrough (innovation, novel approaches, discoveries)
- healing (therapeutic potential, restoration, recovery)

Also assess:
- emotional_intensity (overall strength of emotional content, 0-1)
- technical_density (complexity of medical terminology, 0-1)
- clinical_relevance (practical application potential, 0-1)

Return only valid JSON with all fields."""

        message = self.anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        response_text = message.content[0].text
        analysis_data = json.loads(response_text)
        
        # Ensure all required fields exist
        emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
        for emotion in emotions:
            if emotion not in analysis_data:
                analysis_data[emotion] = 0.5
        
        # Find dominant emotion
        emotion_scores = {k: v for k, v in analysis_data.items() if k in emotions}
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        analysis_data["dominant_emotion"] = dominant_emotion
        
        # Add analysis metadata
        analysis_data["analysis_source"] = "claude_ai"
        analysis_data["analysis_timestamp"] = datetime.utcnow().isoformat()
        analysis_data["model_version"] = "claude-3-sonnet"
        
        return analysis_data
    
    def _fallback_analysis(self, content: str, metadata: Dict = None) -> Dict[str, Any]:
        """Fallback analysis when Claude is unavailable"""
        print("Using fallback emotional analysis")
        
        # Simple keyword-based analysis
        content_lower = content.lower()
        
        # Keyword scoring
        hope_keywords = ["recovery", "improvement", "healing", "success", "positive", "benefit", "effective"]
        tension_keywords = ["complication", "risk", "failure", "adverse", "difficult", "challenge"]
        confidence_keywords = ["significant", "proven", "established", "evidence", "demonstrated"]
        uncertainty_keywords = ["unclear", "unknown", "investigate", "further study", "limited"]
        breakthrough_keywords = ["novel", "innovative", "breakthrough", "advancement", "new"]
        healing_keywords = ["therapeutic", "treatment", "cure", "restoration", "rehabilitation"]
        
        def score_keywords(keywords):
            count = sum(1 for keyword in keywords if keyword in content_lower)
            return min(count / 10.0, 1.0)  # Normalize to 0-1
        
        analysis_data = {
            "hope": score_keywords(hope_keywords),
            "tension": score_keywords(tension_keywords),
            "confidence": score_keywords(confidence_keywords),
            "uncertainty": score_keywords(uncertainty_keywords),
            "breakthrough": score_keywords(breakthrough_keywords),
            "healing": score_keywords(healing_keywords),
            "emotional_intensity": len(content) / 5000.0,  # Rough intensity based on length
            "technical_density": 0.5,  # Default
            "clinical_relevance": 0.6,  # Default
            "analysis_source": "fallback_keywords",
            "analysis_timestamp": datetime.utcnow().isoformat(),
            "model_version": "fallback_v1"
        }
        
        # Find dominant emotion
        emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
        emotion_scores = {k: v for k, v in analysis_data.items() if k in emotions}
        dominant_emotion = max(emotion_scores, key=emotion_scores.get)
        analysis_data["dominant_emotion"] = dominant_emotion
        
        return analysis_data
    
    def get_analysis_stats(self) -> Dict[str, Any]:
        """Get analysis service statistics"""
        try:
            cache_count = self.cache_collection.count_documents({})
            recent_analyses = self.cache_collection.count_documents({
                "created_at": {"$gte": datetime.utcnow() - timedelta(days=7)}
            })
            
            return {
                "total_cached_analyses": cache_count,
                "recent_analyses": recent_analyses,
                "claude_available": self.anthropic_client is not None,
                "cache_duration_hours": self.cache_duration.total_seconds() / 3600
            }
        except Exception as e:
            return {"error": str(e)}
