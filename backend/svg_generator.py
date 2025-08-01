# backend/svg_generator.py
"""
Arthrokinetix SVG Generation Module
Generates complete SVG files with embedded comprehensive metadata
"""

import xml.etree.ElementTree as ET
from xml.dom import minidom
import json
import math
import random
from datetime import datetime
from typing import Dict, List, Any, Optional

class ArthrokinetixSVGGenerator:
    def __init__(self, canvas_width=800, canvas_height=800):
        self.canvas_width = canvas_width
        self.canvas_height = canvas_height
        
    def generate_svg(self, visual_elements: List[Dict], metadata: Dict, algorithm_params: Dict) -> str:
        """Generate complete SVG with metadata"""
        
        # Create SVG root element
        svg = ET.Element('svg')
        svg.set('width', str(self.canvas_width))
        svg.set('height', str(self.canvas_height))
        svg.set('viewBox', f'0 0 {self.canvas_width} {self.canvas_height}')
        svg.set('xmlns', 'http://www.w3.org/2000/svg')
        
        # Add metadata element
        metadata_elem = self.create_metadata_element(metadata, algorithm_params)
        svg.append(metadata_elem)
        
        # Add definitions
        defs = self.create_definitions(algorithm_params)
        svg.append(defs)
        
        # Add background
        background = self.create_background(algorithm_params)
        svg.append(background)
        
        # Render visual elements in layer order
        layer_order = [
            'precisionGrid', 'atmosphericParticle', 'emotionalField',
            'healingAura', 'andryRoot', 'andryTrunk', 'andryBranch',
            'dataFlow', 'healingParticle', 'researchStar'
        ]
        
        for layer_type in layer_order:
            elements = [el for el in visual_elements if el.get('type') == layer_type]
            for element in elements:
                svg_element = self.render_visual_element(element)
                if svg_element is not None:
                    svg.append(svg_element)
        
        # Add signature
        signature = self.create_signature(metadata)
        svg.append(signature)
        
        return self.prettify_svg(svg)
    
    def create_metadata_element(self, metadata: Dict, algorithm_params: Dict) -> ET.Element:
        """Create comprehensive metadata element"""
        metadata_elem = ET.Element('metadata')
        
        # Basic Dublin Core metadata
        rdf = ET.SubElement(metadata_elem, '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}RDF')
        description = ET.SubElement(rdf, '{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description')
        description.set('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}about', '')
        
        # Add standard metadata
        title = ET.SubElement(description, '{http://purl.org/dc/elements/1.1/}title')
        # Try multiple paths to get signature_id
        signature_id = metadata.get('signature_id')
        if not signature_id:
            comprehensive_meta = metadata.get('comprehensive_metadata', {})
            gen_params = comprehensive_meta.get('generation_parameters', {})
            signature_id = gen_params.get('signature_id', gen_params.get('subspecialty_input', 'AKX-Unknown'))
        title.text = f"Arthrokinetix Artwork - {signature_id}"
        
        creator = ET.SubElement(description, '{http://purl.org/dc/elements/1.1/}creator')
        algorithm_version = metadata.get('algorithm_version', '2.0')
        creator.text = f"Arthrokinetix Algorithm v{algorithm_version}"
        
        date = ET.SubElement(description, '{http://purl.org/dc/elements/1.1/}date')
        timestamp = metadata.get('processing_timestamp', datetime.utcnow().isoformat())
        date.text = timestamp
        
        # Add comprehensive Arthrokinetix metadata
        arthro_metadata = ET.SubElement(description, '{https://arthrokinetix.com/metadata}comprehensive_metadata')
        comprehensive_metadata = metadata.get('comprehensive_metadata', {})
        arthro_metadata.text = json.dumps(comprehensive_metadata, indent=2)
        
        return metadata_elem
    
    def create_definitions(self, algorithm_params: Dict) -> ET.Element:
        """Create SVG definitions (gradients, filters)"""
        defs = ET.Element('defs')
        
        # Healing gradient
        healing_gradient = ET.Element('radialGradient')
        healing_gradient.set('id', 'healingGradient')
        healing_gradient.set('cx', '50%')
        healing_gradient.set('cy', '50%')
        
        stop1 = ET.Element('stop')
        stop1.set('offset', '0%')
        stop1.set('stop-color', '#1abc9c')
        stop1.set('stop-opacity', '0.8')
        healing_gradient.append(stop1)
        
        stop2 = ET.Element('stop')
        stop2.set('offset', '100%')
        stop2.set('stop-color', '#16a085')
        stop2.set('stop-opacity', '0')
        healing_gradient.append(stop2)
        
        defs.append(healing_gradient)
        
        # Emotional field gradient
        emotional_gradient = ET.Element('radialGradient')
        emotional_gradient.set('id', 'emotionalGradient')
        emotional_gradient.set('cx', '50%')
        emotional_gradient.set('cy', '50%')
        
        stop1 = ET.Element('stop')
        stop1.set('offset', '0%')
        stop1.set('stop-color', '#3498db')
        stop1.set('stop-opacity', '0.6')
        emotional_gradient.append(stop1)
        
        stop2 = ET.Element('stop')
        stop2.set('offset', '100%')
        stop2.set('stop-color', '#2980b9')
        stop2.set('stop-opacity', '0.1')
        emotional_gradient.append(stop2)
        
        defs.append(emotional_gradient)
        
        # Blur filter
        blur_filter = ET.Element('filter')
        blur_filter.set('id', 'blur')
        blur_filter.set('x', '-50%')
        blur_filter.set('y', '-50%')
        blur_filter.set('width', '200%')
        blur_filter.set('height', '200%')
        
        gaussian_blur = ET.Element('feGaussianBlur')
        gaussian_blur.set('stdDeviation', '5')
        blur_filter.append(gaussian_blur)
        
        defs.append(blur_filter)
        
        # Glow filter
        glow_filter = ET.Element('filter')
        glow_filter.set('id', 'glow')
        glow_filter.set('x', '-50%')
        glow_filter.set('y', '-50%')
        glow_filter.set('width', '200%')
        glow_filter.set('height', '200%')
        
        gaussian_blur_glow = ET.Element('feGaussianBlur')
        gaussian_blur_glow.set('stdDeviation', '3')
        gaussian_blur_glow.set('result', 'coloredBlur')
        glow_filter.append(gaussian_blur_glow)
        
        merge = ET.Element('feMerge')
        merge_node1 = ET.Element('feMergeNode')
        merge_node1.set('in', 'coloredBlur')
        merge_node2 = ET.Element('feMergeNode')
        merge_node2.set('in', 'SourceGraphic')
        merge.append(merge_node1)
        merge.append(merge_node2)
        glow_filter.append(merge)
        
        defs.append(glow_filter)
        
        return defs
    
    def create_background(self, algorithm_params: Dict) -> ET.Element:
        """Create background element"""
        background = ET.Element('rect')
        background.set('width', '100%')
        background.set('height', '100%')
        background.set('fill', '#f8f9fa')
        background.set('opacity', '0.95')
        return background
    
    def render_visual_element(self, element: Dict) -> Optional[ET.Element]:
        """Render individual visual element to SVG"""
        element_type = element.get('type')
        
        if element_type == 'andryRoot':
            return self.render_andry_root(element)
        elif element_type == 'andryTrunk':
            return self.render_andry_trunk(element)
        elif element_type == 'andryBranch':
            return self.render_andry_branch(element)
        elif element_type == 'healingParticle':
            return self.render_healing_particle(element)
        elif element_type == 'healingAura':
            return self.render_healing_aura(element)
        elif element_type == 'dataFlow':
            return self.render_data_flow(element)
        elif element_type == 'emotionalField':
            return self.render_emotional_field(element)
        elif element_type == 'researchStar':
            return self.render_research_star(element)
        elif element_type == 'atmosphericParticle':
            return self.render_atmospheric_particle(element)
        elif element_type == 'precisionGrid':
            return self.render_precision_grid(element)
        
        return None
    
    def render_andry_root(self, element: Dict) -> ET.Element:
        """Render Andry tree root as curved path"""
        path = ET.Element('path')
        
        # Calculate curved path
        start_x = element.get('x', 0)
        start_y = element.get('y', 0)
        angle = element.get('angle', 0) * math.pi / 180
        length = element.get('length', 50)
        
        end_x = start_x + math.cos(angle) * length
        end_y = start_y + math.sin(angle) * length
        control_x = start_x + math.cos(angle) * length * 0.5
        control_y = start_y + math.sin(angle + 0.3) * length * 0.5
        
        d = f"M {start_x} {start_y} Q {control_x} {control_y} {end_x} {end_y}"
        
        path.set('d', d)
        path.set('stroke', element.get('color', '#3498db'))
        path.set('stroke-width', str(element.get('thickness', 2)))
        path.set('fill', 'none')
        path.set('stroke-linecap', 'round')
        path.set('opacity', '0.6')
        
        return path
    
    def render_andry_trunk(self, element: Dict) -> ET.Element:
        """Render main trunk as rectangle"""
        rect = ET.Element('rect')
        
        x = element.get('x', 0) - element.get('thickness', 8) / 2
        y = element.get('y', 0) - element.get('height', 100)
        width = element.get('thickness', 8)
        height = element.get('height', 100)
        
        rect.set('x', str(x))
        rect.set('y', str(y))
        rect.set('width', str(width))
        rect.set('height', str(height))
        rect.set('fill', element.get('color', '#2c3e50'))
        rect.set('rx', str(width / 4))
        
        return rect
    
    def render_andry_branch(self, element: Dict) -> ET.Element:
        """Render branch as curved path"""
        path = ET.Element('path')
        
        start_x = element.get('x', 0)
        start_y = element.get('y', 0)
        angle = element.get('angle', 0) * math.pi / 180
        length = element.get('length', 60)
        
        end_x = start_x + math.cos(angle) * length
        end_y = start_y + math.sin(angle) * length
        control_x = start_x + math.cos(angle) * length * 0.5
        control_y = start_y + math.sin(angle - 0.1) * length * 0.5
        
        d = f"M {start_x} {start_y} Q {control_x} {control_y} {end_x} {end_y}"
        
        path.set('d', d)
        path.set('stroke', element.get('color', '#27ae60'))
        path.set('stroke-width', str(element.get('thickness', 4)))
        path.set('fill', 'none')
        path.set('stroke-linecap', 'round')
        
        return path
    
    def render_healing_particle(self, element: Dict) -> ET.Element:
        """Render healing particle as circle with glow"""
        group = ET.Element('g')
        
        # Glow effect
        glow = ET.Element('circle')
        glow.set('cx', str(element.get('x', 0)))
        glow.set('cy', str(element.get('y', 0)))
        glow.set('r', str(element.get('size', 5) * 2))
        glow.set('fill', element.get('color', '#16a085'))
        glow.set('opacity', '0.2')
        glow.set('filter', 'url(#blur)')
        group.append(glow)
        
        # Main particle
        particle = ET.Element('circle')
        particle.set('cx', str(element.get('x', 0)))
        particle.set('cy', str(element.get('y', 0)))
        particle.set('r', str(element.get('size', 5)))
        particle.set('fill', element.get('color', '#16a085'))
        particle.set('opacity', '0.8')
        group.append(particle)
        
        return group
    
    def render_healing_aura(self, element: Dict) -> ET.Element:
        """Render healing aura as radial gradient circle"""
        circle = ET.Element('circle')
        circle.set('cx', str(element.get('x', 0)))
        circle.set('cy', str(element.get('y', 0)))
        circle.set('r', str(element.get('radius', 100)))
        circle.set('fill', 'url(#healingGradient)')
        circle.set('opacity', '0.5')
        
        return circle
    
    def render_data_flow(self, element: Dict) -> ET.Element:
        """Render data flow as curved path"""
        path_data = element.get('path', {})
        
        if not path_data:
            return None
        
        start = path_data.get('start', {'x': 0, 'y': 0})
        control1 = path_data.get('control1', {'x': 100, 'y': 50})
        control2 = path_data.get('control2', {'x': 200, 'y': 150})
        end = path_data.get('end', {'x': 300, 'y': 100})
        
        d = f"M {start['x']} {start['y']} C {control1['x']} {control1['y']} {control2['x']} {control2['y']} {end['x']} {end['y']}"
        
        path = ET.Element('path')
        path.set('d', d)
        path.set('stroke', element.get('color', '#3498db'))
        path.set('stroke-width', str(element.get('thickness', 2)))
        path.set('fill', 'none')
        path.set('opacity', str(element.get('opacity', 0.6)))
        path.set('stroke-linecap', 'round')
        
        return path
    
    def render_emotional_field(self, element: Dict) -> ET.Element:
        """Render emotional field as ellipse"""
        ellipse = ET.Element('ellipse')
        ellipse.set('cx', str(element.get('x', 0)))
        ellipse.set('cy', str(element.get('y', 0)))
        
        size = element.get('size', 50)
        ellipse.set('rx', str(size))
        ellipse.set('ry', str(size * 0.8))
        
        ellipse.set('fill', 'url(#emotionalGradient)')
        ellipse.set('opacity', str(element.get('intensity', 0.5) * 0.5))
        
        return ellipse
    
    def render_research_star(self, element: Dict) -> ET.Element:
        """Render research star as star polygon"""
        group = ET.Element('g')
        
        # Simple star as circle for now (could be enhanced to actual star shape)
        star = ET.Element('circle')
        star.set('cx', str(element.get('x', 0)))
        star.set('cy', str(element.get('y', 0)))
        star.set('r', str(element.get('size', 3)))
        star.set('fill', element.get('color', '#f39c12'))
        star.set('opacity', '0.9')
        star.set('filter', 'url(#glow)')
        
        group.append(star)
        
        return group
    
    def render_atmospheric_particle(self, element: Dict) -> ET.Element:
        """Render atmospheric particle as small circle"""
        circle = ET.Element('circle')
        circle.set('cx', str(element.get('x', 0)))
        circle.set('cy', str(element.get('y', 0)))
        circle.set('r', str(element.get('size', 1)))
        circle.set('fill', element.get('color', '#bdc3c7'))
        circle.set('opacity', str(element.get('opacity', 0.15)))
        
        return circle
    
    def render_precision_grid(self, element: Dict) -> ET.Element:
        """Render precision grid as pattern"""
        group = ET.Element('g')
        group.set('opacity', str(element.get('opacity', 0.05)))
        
        spacing = element.get('spacing', 50)
        color = element.get('color', '#95a5a6')
        
        # Vertical lines
        for x in range(0, self.canvas_width, int(spacing)):
            line = ET.Element('line')
            line.set('x1', str(x))
            line.set('y1', '0')
            line.set('x2', str(x))
            line.set('y2', str(self.canvas_height))
            line.set('stroke', color)
            line.set('stroke-width', '1')
            group.append(line)
        
        # Horizontal lines
        for y in range(0, self.canvas_height, int(spacing)):
            line = ET.Element('line')
            line.set('x1', '0')
            line.set('y1', str(y))
            line.set('x2', str(self.canvas_width))
            line.set('y2', str(y))
            line.set('stroke', color)
            line.set('stroke-width', '1')
            group.append(line)
        
        return group
    
    def create_signature(self, metadata: Dict) -> ET.Element:
        """Create algorithm signature"""
        group = ET.Element('g')
        group.set('transform', f'translate({self.canvas_width * 0.05}, {self.canvas_height * 0.95})')
        
        # Signature ID
        signature_id = metadata.get('signature_id', 
                                  metadata.get('comprehensive_metadata', {})
                                  .get('generation_parameters', {})
                                  .get('subspecialty_input', 'AKX-UNKNOWN'))
        
        text1 = ET.Element('text')
        text1.set('x', '0')
        text1.set('y', '0')
        text1.set('font-size', '10')
        text1.set('fill', '#3498db')
        text1.set('opacity', '0.8')
        text1.set('font-family', 'monospace')
        text1.text = signature_id
        group.append(text1)
        
        # Version info
        algorithm_version = metadata.get('algorithm_version', '2.0')
        # Try multiple paths to get subspecialty
        subspecialty = metadata.get('subspecialty')
        if not subspecialty or subspecialty.lower() == 'unknown':
            comprehensive_meta = metadata.get('comprehensive_metadata', {})
            subspecialty_analysis = comprehensive_meta.get('subspecialty_analysis', {})
            subspecialty = subspecialty_analysis.get('primary_subspecialty', 'General')
        
        # Format subspecialty for display (convert camelCase to spaced)
        if subspecialty and subspecialty != 'General':
            # Convert camelCase to readable format
            import re
            subspecialty = re.sub(r'([A-Z])', r' \1', subspecialty).strip().title()
        
        text2 = ET.Element('text')
        text2.set('x', '0')
        text2.set('y', '12')
        text2.set('font-size', '8')
        text2.set('fill', '#666666')
        text2.set('opacity', '0.6')
        text2.set('font-family', 'monospace')
        text2.text = f"v{algorithm_version} • {subspecialty}"
        group.append(text2)
        
        return group
    
    def prettify_svg(self, svg_element: ET.Element) -> str:
        """Convert SVG element to pretty-printed string"""
        rough_string = ET.tostring(svg_element, encoding='unicode')
        reparsed = minidom.parseString(rough_string)
        pretty_xml = reparsed.toprettyxml(indent="  ")
        
        # Remove empty lines and fix XML declaration
        lines = [line for line in pretty_xml.split('\n') if line.strip()]
        if lines[0].startswith('<?xml'):
            lines[0] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        
        return '\n'.join(lines)

def generate_artwork_svg(visual_elements: List[Dict], metadata: Dict, algorithm_params: Dict) -> str:
    """
    Convenience function to generate SVG from artwork data
    
    Args:
        visual_elements: List of visual elements from algorithm
        metadata: Artwork metadata
        algorithm_params: Algorithm parameters
        
    Returns:
        SVG string with embedded metadata
    """
    generator = ArthrokinetixSVGGenerator()
    return generator.generate_svg(visual_elements, metadata, algorithm_params)