"""
Arthrokinetix Proprietary Algorithm Service
HTML-to-Art transformation with clear separation from Claude AI
"""
import json
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional

class ArthrokinetixEngine:
    """
    Proprietary Arthrokinetix algorithm for generating emotional signatures and art
    Separate from Claude AI emotional analysis
    """
    
    VERSION = "2.1"
    
    def __init__(self, db_client):
        self.db = db_client
        self.signatures_collection = self.db.emotional_signatures
        self.artworks_collection = self.db.generated_artworks
        
    def generate_emotional_signature(self, emotional_data: Dict[str, Any], article_metadata: Dict = None) -> Dict[str, Any]:
        """
        Generate unique visual signature based on emotional data
        
        Args:
            emotional_data: Results from emotional analysis (Claude or fallback)
            article_metadata: Article metadata (subspecialty, evidence_strength, etc.)
            
        Returns:
            Dict with emotional signature data
        """
        evidence_strength = article_metadata.get("evidence_strength", 0.5) if article_metadata else 0.5
        subspecialty = article_metadata.get("subspecialty", "general") if article_metadata else "general"
        dominant_emotion = emotional_data.get("dominant_emotion", "confidence")
        
        # Generate unique signature ID
        timestamp = datetime.utcnow()
        signature_id = f"AKX-{timestamp.year}-{timestamp.strftime('%m%d')}-{str(uuid.uuid4())[:4].upper()}"
        
        # Emotional color mapping
        emotional_colors = self._get_emotional_colors()
        
        # Generate signature components
        signature = {
            "id": signature_id,
            "generated_at": timestamp,
            "algorithm_version": self.VERSION,
            
            # Visual components
            "concentric_rings": self._generate_rings(evidence_strength, emotional_data),
            "geometric_overlays": self._generate_overlays(dominant_emotion, emotional_data),
            "floating_particles": self._generate_particles(emotional_data),
            "color_gradients": self._generate_gradients(emotional_data),
            
            # Metadata
            "rarity_score": self._calculate_rarity(emotional_data),
            "complexity_index": self._calculate_complexity(emotional_data, evidence_strength),
            "subspecialty_styling": self._get_subspecialty_styling(subspecialty),
            
            # Source tracking
            "source_data": {
                "emotional_analysis": emotional_data.get("analysis_source", "unknown"),
                "dominant_emotion": dominant_emotion,
                "evidence_strength": evidence_strength,
                "subspecialty": subspecialty
            }
        }
        
        # Store signature
        self.signatures_collection.insert_one(signature.copy())
        signature["_id"] = str(signature["_id"])
        
        return signature
    
    def generate_andry_tree_artwork(self, signature_data: Dict[str, Any], emotional_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate Andry Tree artwork based on emotional signature
        
        Args:
            signature_data: Generated emotional signature
            emotional_data: Original emotional analysis
            
        Returns:
            Dict with artwork generation parameters
        """
        artwork_id = str(uuid.uuid4())
        
        # Calculate tree parameters
        tree_params = self._calculate_tree_parameters(emotional_data, signature_data)
        
        artwork = {
            "id": artwork_id,
            "signature_id": signature_data["id"],
            "title": f"Algorithmic Synthesis #{signature_data['id']}",
            "created_date": datetime.utcnow(),
            "algorithm_version": self.VERSION,
            
            # Tree visualization parameters
            "tree_parameters": tree_params,
            
            # Artistic elements
            "emotional_particles": self._generate_emotional_particles(emotional_data),
            "healing_aura": self._generate_healing_aura(emotional_data),
            "subspecialty_elements": self._generate_subspecialty_elements(
                signature_data.get("subspecialty_styling", {}),
                emotional_data
            ),
            
            # Visual properties
            "background_gradient": signature_data["color_gradients"],
            "dominant_emotion": emotional_data.get("dominant_emotion"),
            "rarity_score": signature_data["rarity_score"],
            
            # Generation metadata
            "generation_metadata": {
                "complexity_factors": tree_params["complexity_factors"],
                "emotional_influence": emotional_data.get("emotional_intensity", 0.5),
                "evidence_integration": signature_data.get("source_data", {}).get("evidence_strength", 0.5)
            }
        }
        
        # Store artwork
        self.artworks_collection.insert_one(artwork.copy())
        artwork["_id"] = str(artwork["_id"])
        
        return artwork
    
    def _get_emotional_colors(self) -> Dict[str, str]:
        """Get emotional color mapping"""
        return {
            "hope": "#27ae60",
            "tension": "#e74c3c",
            "confidence": "#3498db",
            "uncertainty": "#95a5a6",
            "breakthrough": "#f39c12",
            "healing": "#16a085"
        }
    
    def _generate_rings(self, evidence_strength: float, emotional_data: Dict) -> Dict[str, Any]:
        """Generate concentric rings based on evidence strength"""
        ring_count = int(evidence_strength * 5) + 1
        base_thickness = evidence_strength * 3 + 1
        
        return {
            "count": ring_count,
            "thickness": base_thickness,
            "rotation_speed": evidence_strength * 2,
            "opacity_gradient": [0.8 - (i * 0.1) for i in range(ring_count)],
            "emotional_modulation": emotional_data.get("emotional_intensity", 0.5)
        }
    
    def _generate_overlays(self, dominant_emotion: str, emotional_data: Dict) -> Dict[str, Any]:
        """Generate geometric overlays based on dominant emotion"""
        emotional_shapes = {
            "hope": "circle",
            "confidence": "square",
            "breakthrough": "star",
            "healing": "hexagon",
            "tension": "triangle",
            "uncertainty": "diamond"
        }
        
        emotional_colors = self._get_emotional_colors()
        
        return {
            "shape": emotional_shapes.get(dominant_emotion, "circle"),
            "color": emotional_colors.get(dominant_emotion, "#3498db"),
            "scale": emotional_data.get(dominant_emotion, 0.5) * 1.5 + 0.5,
            "rotation": emotional_data.get("emotional_intensity", 0.5) * 360,
            "opacity": 0.7 + emotional_data.get(dominant_emotion, 0.5) * 0.3
        }
    
    def _generate_particles(self, emotional_data: Dict) -> Dict[str, Any]:
        """Generate floating particles based on emotional data"""
        confidence = emotional_data.get("confidence", 0.5)
        dominant_emotion = emotional_data.get("dominant_emotion", "confidence")
        emotional_colors = self._get_emotional_colors()
        
        return {
            "count": int(confidence * 20) + 5,
            "color": emotional_colors.get(dominant_emotion, "#3498db"),
            "movement_pattern": "organic",
            "size_variation": emotional_data.get("emotional_intensity", 0.5),
            "spawn_rate": confidence * 2 + 0.5,
            "interaction_strength": emotional_data.get("clinical_relevance", 0.5)
        }
    
    def _generate_gradients(self, emotional_data: Dict) -> List[Dict[str, Any]]:
        """Generate color gradients based on emotional mix"""
        emotional_colors = self._get_emotional_colors()
        emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
        
        # Get top 3 emotions
        emotion_scores = [(emotion, emotional_data.get(emotion, 0)) for emotion in emotions]
        top_emotions = sorted(emotion_scores, key=lambda x: x[1], reverse=True)[:3]
        
        gradients = []
        for i, (emotion, score) in enumerate(top_emotions):
            gradients.append({
                "color": emotional_colors[emotion],
                "stop": score,
                "opacity": score * 0.8,
                "position": i / 3.0,
                "blend_mode": "multiply" if i > 0 else "normal"
            })
        
        return gradients
    
    def _calculate_rarity(self, emotional_data: Dict) -> float:
        """Calculate rarity score based on emotional uniqueness"""
        emotions = ["hope", "tension", "confidence", "uncertainty", "breakthrough", "healing"]
        emotion_scores = [emotional_data.get(emotion, 0) for emotion in emotions]
        
        # Calculate variance - higher variance = more unique
        mean_score = sum(emotion_scores) / len(emotion_scores)
        variance = sum((score - mean_score) ** 2 for score in emotion_scores) / len(emotion_scores)
        
        # Normalize to 0-1 scale and add factors
        base_rarity = min(variance * 10, 1.0)
        
        # Boost rarity for breakthrough discoveries
        breakthrough_bonus = emotional_data.get("breakthrough", 0) * 0.3
        
        # Technical density adds rarity
        technical_bonus = emotional_data.get("technical_density", 0.5) * 0.2
        
        final_rarity = min(base_rarity + breakthrough_bonus + technical_bonus, 1.0)
        return round(final_rarity, 3)
    
    def _calculate_complexity(self, emotional_data: Dict, evidence_strength: float) -> float:
        """Calculate overall complexity index"""
        emotional_complexity = emotional_data.get("emotional_intensity", 0.5)
        technical_complexity = emotional_data.get("technical_density", 0.5)
        evidence_complexity = evidence_strength
        
        return round((emotional_complexity + technical_complexity + evidence_complexity) / 3.0, 3)
    
    def _get_subspecialty_styling(self, subspecialty: str) -> Dict[str, Any]:
        """Get subspecialty-specific styling parameters"""
        specialty_styles = {
            "sportsMedicine": {
                "primary_color": "#e74c3c",
                "accent_elements": ["motion_lines", "impact_particles"],
                "tree_style": "dynamic"
            },
            "jointReplacement": {
                "primary_color": "#3498db",
                "accent_elements": ["structural_supports", "integration_flows"],
                "tree_style": "architectural"
            },
            "trauma": {
                "primary_color": "#f39c12",
                "accent_elements": ["emergency_patterns", "recovery_spirals"],
                "tree_style": "resilient"
            },
            "spine": {
                "primary_color": "#9b59b6",
                "accent_elements": ["vertebral_segments", "neural_pathways"],
                "tree_style": "structured"
            },
            "handUpperExtremity": {
                "primary_color": "#1abc9c",
                "accent_elements": ["precision_details", "dexterity_flows"],
                "tree_style": "intricate"
            },
            "footAnkle": {
                "primary_color": "#34495e",
                "accent_elements": ["foundation_roots", "mobility_branches"],
                "tree_style": "grounded"
            }
        }
        
        return specialty_styles.get(subspecialty, specialty_styles["sportsMedicine"])
    
    def _calculate_tree_parameters(self, emotional_data: Dict, signature_data: Dict) -> Dict[str, Any]:
        """Calculate Andry Tree visualization parameters"""
        healing_factor = emotional_data.get("healing", 0.5)
        confidence_factor = emotional_data.get("confidence", 0.5)
        complexity = signature_data.get("complexity_index", 0.5)
        
        return {
            "trunk_strength": confidence_factor * 0.8 + 0.2,
            "branch_complexity": complexity * 6 + 2,
            "healing_bloom_intensity": healing_factor,
            "root_depth": emotional_data.get("evidence_strength", 0.5),
            "foliage_density": emotional_data.get("hope", 0.5),
            "growth_pattern": "organic" if healing_factor > 0.6 else "structured",
            "complexity_factors": {
                "emotional": emotional_data.get("emotional_intensity", 0.5),
                "technical": emotional_data.get("technical_density", 0.5),
                "clinical": emotional_data.get("clinical_relevance", 0.5)
            }
        }
    
    def _generate_emotional_particles(self, emotional_data: Dict) -> List[Dict[str, Any]]:
        """Generate emotional particle system parameters"""
        particles = []
        emotions = ["hope", "confidence", "healing", "breakthrough"]
        
        for emotion in emotions:
            intensity = emotional_data.get(emotion, 0)
            if intensity > 0.3:  # Only generate particles for significant emotions
                particles.append({
                    "emotion": emotion,
                    "count": int(intensity * 15) + 3,
                    "color": self._get_emotional_colors()[emotion],
                    "movement": "upward" if emotion in ["hope", "healing"] else "orbital",
                    "size_range": [2, 6],
                    "opacity_range": [0.4, 0.8],
                    "spawn_pattern": "continuous"
                })
        
        return particles
    
    def _generate_healing_aura(self, emotional_data: Dict) -> Dict[str, Any]:
        """Generate healing aura parameters"""
        healing_intensity = emotional_data.get("healing", 0.5)
        
        return {
            "enabled": healing_intensity > 0.4,
            "intensity": healing_intensity,
            "color": "#16a085",
            "radius_multiplier": 1.0 + healing_intensity,
            "pulse_frequency": healing_intensity * 2 + 0.5,
            "layer_count": int(healing_intensity * 3) + 1
        }
    
    def _generate_subspecialty_elements(self, styling: Dict, emotional_data: Dict) -> List[Dict[str, Any]]:
        """Generate subspecialty-specific visual elements"""
        elements = []
        accent_elements = styling.get("accent_elements", [])
        
        for element_type in accent_elements:
            elements.append({
                "type": element_type,
                "color": styling.get("primary_color", "#3498db"),
                "intensity": emotional_data.get("clinical_relevance", 0.5),
                "pattern": styling.get("tree_style", "organic"),
                "visibility": emotional_data.get("confidence", 0.5) > 0.4
            })
        
        return elements
    
    def get_engine_stats(self) -> Dict[str, Any]:
        """Get Arthrokinetix engine statistics"""
        try:
            total_signatures = self.signatures_collection.count_documents({})
            total_artworks = self.artworks_collection.count_documents({})
            
            # Get rarity distribution
            rarity_pipeline = [
                {"$bucket": {
                    "groupBy": "$rarity_score",
                    "boundaries": [0, 0.3, 0.6, 0.8, 1.0],
                    "default": "other",
                    "output": {"count": {"$sum": 1}}
                }}
            ]
            
            rarity_dist = list(self.signatures_collection.aggregate(rarity_pipeline))
            
            return {
                "algorithm_version": self.VERSION,
                "total_signatures": total_signatures,
                "total_artworks": total_artworks,
                "rarity_distribution": rarity_dist,
                "engine_status": "operational"
            }
        except Exception as e:
            return {"error": str(e)}
