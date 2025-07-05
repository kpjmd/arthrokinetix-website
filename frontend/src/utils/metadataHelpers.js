// metadataHelpers.js - Helper functions for metadata calculations
// Part of Arthrokinetix Phase 2C Advanced Analytics Dashboard foundation

/**
 * Calculate tree complexity based on visual elements
 * @param {Array} visualElements - Array of visual elements
 * @returns {number} Tree complexity score (0-1)
 */
export const calculateTreeComplexity = (visualElements) => {
  const treeElements = visualElements.filter(el => 
    ['andryRoot', 'andryTrunk', 'andryBranch'].includes(el.type)
  );
  
  const branchCount = treeElements.filter(el => el.type === 'andryBranch').length;
  const rootCount = treeElements.filter(el => el.type === 'andryRoot').length;
  const hasSubBranches = treeElements.some(el => el.subBranches?.length > 0);
  
  // Complexity calculation: branches contribute most, roots add depth, sub-branches add complexity
  const baseComplexity = (branchCount * 0.1) + (rootCount * 0.05) + (hasSubBranches ? 0.3 : 0);
  
  return Math.min(1.0, baseComplexity);
};

/**
 * Analyze color usage across visual elements
 * @param {Array} visualElements - Array of visual elements
 * @param {Object} state - Algorithm state object
 * @returns {Object} Color usage analysis
 */
export const analyzeColorUsage = (visualElements, state) => {
  const colorCounts = {};
  const totalElements = visualElements.length;
  
  visualElements.forEach(element => {
    if (element.color) {
      colorCounts[element.color] = (colorCounts[element.color] || 0) + 1;
    }
  });
  
  const colorUsage = {};
  Object.entries(colorCounts).forEach(([color, count]) => {
    colorUsage[color] = count / totalElements;
  });
  
  return {
    color_frequencies: colorUsage,
    unique_colors: Object.keys(colorCounts).length,
    most_used_color: Object.entries(colorCounts).reduce((a, b) => colorCounts[a[0]] > colorCounts[b[0]] ? a : b, ['none', 0])[0],
    color_diversity_score: Object.keys(colorCounts).length / Math.max(1, totalElements)
  };
};

/**
 * Calculate element density relative to canvas area
 * @param {Array} visualElements - Array of visual elements
 * @param {Object} state - Algorithm state object
 * @returns {number} Element density score (0-1)
 */
export const calculateElementDensity = (visualElements, state) => {
  const canvasArea = state.canvasWidth * state.canvasHeight;
  const elementArea = visualElements.reduce((total, element) => {
    return total + estimateElementArea(element);
  }, 0);
  
  return Math.min(1.0, elementArea / canvasArea);
};

/**
 * Generate unique pattern fingerprint for pattern matching
 * @param {Array} visualElements - Array of visual elements
 * @returns {string} Base64 encoded fingerprint
 */
export const generatePatternFingerprint = (visualElements) => {
  // Create a unique fingerprint for pattern matching
  const patterns = {
    elementTypes: countElementTypes(visualElements),
    spatialDistribution: analyzeSpatialDistribution(visualElements),
    colorDistribution: analyzeColorDistribution(visualElements),
    sizeDistribution: analyzeSizeDistribution(visualElements)
  };
  
  // Create a deterministic string representation
  const fingerprintString = JSON.stringify(patterns, Object.keys(patterns).sort());
  
  try {
    return btoa(fingerprintString).substr(0, 16); // Base64 encoded fingerprint
  } catch (error) {
    // Fallback for non-ASCII characters
    return fingerprintString.replace(/[^a-zA-Z0-9]/g, '').substr(0, 16);
  }
};

/**
 * Estimate the visual area occupied by an element
 * @param {Object} element - Visual element object
 * @returns {number} Estimated area in pixels
 */
export const estimateElementArea = (element) => {
  if (!element) return 0;
  
  switch (element.type) {
    case 'andryRoot':
    case 'andryBranch':
      // Line elements: length * thickness
      const length = element.length || 50;
      const thickness = element.thickness || 2;
      return length * thickness;
      
    case 'andryTrunk':
      // Rectangular trunk: width * height
      const width = element.thickness || 8;
      const height = element.height || 100;
      return width * height;
      
    case 'healingParticle':
    case 'researchStar':
      // Circular elements: π * r²
      const radius = element.size || 5;
      return Math.PI * radius * radius;
      
    case 'healingAura':
    case 'emotionalField':
      // Large circular/elliptical areas
      const auraRadius = element.radius || element.size || 50;
      return Math.PI * auraRadius * auraRadius;
      
    case 'dataFlow':
      // Flow paths: estimated as length * thickness
      const path = element.path || {};
      const flowLength = estimatePathLength(path);
      const flowThickness = element.thickness || 1;
      return flowLength * flowThickness;
      
    case 'atmosphericParticle':
      // Small particles
      const particleSize = element.size || 1;
      return Math.PI * particleSize * particleSize;
      
    case 'precisionGrid':
      // Grid doesn't occupy filled area, minimal impact
      return 10;
      
    default:
      return 25; // Default area for unknown elements
  }
};

/**
 * Count elements by type
 * @param {Array} visualElements - Array of visual elements
 * @returns {Object} Count of each element type
 */
export const countElementTypes = (visualElements) => {
  const typeCounts = {};
  
  visualElements.forEach(element => {
    const type = element.type || 'unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  return typeCounts;
};

/**
 * Analyze spatial distribution of elements
 * @param {Array} visualElements - Array of visual elements
 * @returns {Object} Spatial distribution analysis
 */
export const analyzeSpatialDistribution = (visualElements) => {
  if (visualElements.length === 0) {
    return {
      center_of_mass: { x: 0, y: 0 },
      spread: 0,
      quadrant_distribution: { q1: 0, q2: 0, q3: 0, q4: 0 }
    };
  }
  
  // Calculate center of mass
  const totalElements = visualElements.length;
  const centerX = visualElements.reduce((sum, el) => sum + (el.x || 0), 0) / totalElements;
  const centerY = visualElements.reduce((sum, el) => sum + (el.y || 0), 0) / totalElements;
  
  // Calculate spread (standard deviation from center)
  const spread = Math.sqrt(
    visualElements.reduce((sum, el) => {
      const dx = (el.x || 0) - centerX;
      const dy = (el.y || 0) - centerY;
      return sum + (dx * dx + dy * dy);
    }, 0) / totalElements
  );
  
  // Analyze quadrant distribution (assuming 800x800 canvas)
  const canvasWidth = 800, canvasHeight = 800;
  const midX = canvasWidth / 2, midY = canvasHeight / 2;
  
  const quadrants = { q1: 0, q2: 0, q3: 0, q4: 0 };
  
  visualElements.forEach(el => {
    const x = el.x || 0;
    const y = el.y || 0;
    
    if (x >= midX && y <= midY) quadrants.q1++; // Top-right
    else if (x < midX && y <= midY) quadrants.q2++; // Top-left
    else if (x < midX && y > midY) quadrants.q3++; // Bottom-left
    else quadrants.q4++; // Bottom-right
  });
  
  return {
    center_of_mass: { x: centerX, y: centerY },
    spread: spread,
    quadrant_distribution: quadrants,
    distribution_type: spread > 200 ? 'distributed' : spread > 100 ? 'moderate' : 'clustered'
  };
};

/**
 * Analyze color distribution patterns
 * @param {Array} visualElements - Array of visual elements
 * @returns {Object} Color distribution analysis
 */
export const analyzeColorDistribution = (visualElements) => {
  const colorPositions = {};
  
  visualElements.forEach(el => {
    const color = el.color;
    if (color) {
      if (!colorPositions[color]) {
        colorPositions[color] = [];
      }
      colorPositions[color].push({
        x: el.x || 0,
        y: el.y || 0
      });
    }
  });
  
  const colorAnalysis = {};
  
  Object.entries(colorPositions).forEach(([color, positions]) => {
    if (positions.length === 0) return;
    
    // Calculate color clustering
    const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
    const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
    
    const spread = Math.sqrt(
      positions.reduce((sum, pos) => {
        const dx = pos.x - avgX;
        const dy = pos.y - avgY;
        return sum + (dx * dx + dy * dy);
      }, 0) / positions.length
    );
    
    colorAnalysis[color] = {
      count: positions.length,
      center: { x: avgX, y: avgY },
      spread: spread,
      clustering: spread < 50 ? 'clustered' : spread < 150 ? 'moderate' : 'distributed'
    };
  });
  
  return colorAnalysis;
};

/**
 * Analyze size distribution of elements
 * @param {Array} visualElements - Array of visual elements
 * @returns {Object} Size distribution analysis
 */
export const analyzeSizeDistribution = (visualElements) => {
  const sizes = visualElements.map(el => {
    // Extract size based on element type
    if (el.size) return el.size;
    if (el.radius) return el.radius;
    if (el.thickness) return el.thickness;
    if (el.length) return el.length / 10; // Normalize length to comparable scale
    if (el.height) return el.height / 10; // Normalize height to comparable scale
    return 5; // Default size
  }).filter(size => size > 0);
  
  if (sizes.length === 0) {
    return {
      avg_size: 0,
      size_variance: 0,
      size_range: { min: 0, max: 0 },
      size_distribution: 'uniform'
    };
  }
  
  const avgSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
  const variance = sizes.reduce((sum, size) => sum + (size - avgSize) ** 2, 0) / sizes.length;
  const minSize = Math.min(...sizes);
  const maxSize = Math.max(...sizes);
  
  let distributionType = 'uniform';
  if (variance > avgSize) distributionType = 'varied';
  else if (variance < avgSize / 4) distributionType = 'consistent';
  
  return {
    avg_size: avgSize,
    size_variance: variance,
    size_range: { min: minSize, max: maxSize },
    size_distribution: distributionType,
    size_count: sizes.length
  };
};

/**
 * Estimate the length of a path for data flows
 * @param {Object} path - Path object with start, end, control points
 * @returns {number} Estimated path length
 */
const estimatePathLength = (path) => {
  if (!path || !path.start || !path.end) return 50; // Default length
  
  const start = path.start;
  const end = path.end;
  
  // For straight line distance (simplified)
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const straightDistance = Math.sqrt(dx * dx + dy * dy);
  
  // Add some curve factor if control points exist
  if (path.control1 || path.control2) {
    return straightDistance * 1.3; // Approximate curve length
  }
  
  return straightDistance;
};

/**
 * Calculate rendering complexity score
 * @param {Array} visualElements - Array of visual elements
 * @returns {number} Rendering complexity score
 */
export const calculateRenderingComplexity = (visualElements) => {
  let complexityScore = 0;
  
  visualElements.forEach(el => {
    switch (el.type) {
      case 'andryRoot':
      case 'andryBranch':
        complexityScore += 2; // Curved paths are moderately complex
        break;
      case 'andryTrunk':
        complexityScore += 1; // Simple rectangles
        break;
      case 'healingParticle':
      case 'researchStar':
        complexityScore += 1.5; // Circles with effects
        break;
      case 'healingAura':
      case 'emotionalField':
        complexityScore += 3; // Large areas with gradients and animations
        break;
      case 'dataFlow':
        complexityScore += 4; // Complex animated paths
        break;
      case 'atmosphericParticle':
        complexityScore += 0.5; // Simple small elements
        break;
      case 'precisionGrid':
        complexityScore += 2; // Many line elements
        break;
      default:
        complexityScore += 1;
    }
  });
  
  // Normalize to 0-1 scale (assuming max ~200 complexity points for very complex artwork)
  return Math.min(1.0, complexityScore / 200);
};

/**
 * Generate a unique artwork ID based on metadata
 * @param {Object} metadata - Artwork metadata
 * @returns {string} Unique artwork identifier
 */
export const generateUniqueArtworkID = (metadata) => {
  const timestamp = new Date();
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  
  // Create hash from key metadata elements
  const metadataString = JSON.stringify({
    subspecialty: metadata.subspecialty,
    dominantEmotion: metadata.dominantEmotion,
    complexity: metadata.visual_characteristics?.pattern_complexity,
    fingerprint: metadata.pattern_fingerprint
  });
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < metadataString.length; i++) {
    const char = metadataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const hashStr = Math.abs(hash).toString(36).substr(0, 4).toUpperCase();
  
  return `AKX-${year}-${month}${day}-${hashStr}`;
};

/**
 * Validate metadata completeness
 * @param {Object} metadata - Metadata object to validate
 * @returns {Object} Validation results
 */
export const validateMetadata = (metadata) => {
  const requiredFields = [
    'visual_characteristics',
    'generation_parameters',
    'pattern_usage',
    'ai_analysis_data'
  ];
  
  const missingFields = requiredFields.filter(field => !metadata[field]);
  const completeness = (requiredFields.length - missingFields.length) / requiredFields.length;
  
  const validation = {
    is_complete: missingFields.length === 0,
    completeness_percentage: Math.round(completeness * 100),
    missing_fields: missingFields,
    field_count: Object.keys(metadata).length,
    estimated_size: JSON.stringify(metadata).length
  };
  
  return validation;
};

/**
 * Compare two metadata objects for similarity
 * @param {Object} metadata1 - First metadata object
 * @param {Object} metadata2 - Second metadata object
 * @returns {Object} Similarity analysis
 */
export const compareMetadata = (metadata1, metadata2) => {
  if (!metadata1 || !metadata2) {
    return { similarity_score: 0, comparison_valid: false };
  }
  
  let similarityScore = 0;
  let comparisons = 0;
  
  // Compare visual characteristics
  if (metadata1.visual_characteristics && metadata2.visual_characteristics) {
    const vc1 = metadata1.visual_characteristics;
    const vc2 = metadata2.visual_characteristics;
    
    // Compare numerical values
    const numericalFields = ['tree_complexity', 'element_density', 'pattern_complexity'];
    numericalFields.forEach(field => {
      if (vc1[field] !== undefined && vc2[field] !== undefined) {
        const diff = Math.abs(vc1[field] - vc2[field]);
        similarityScore += (1 - diff); // Higher similarity for smaller differences
        comparisons++;
      }
    });
  }
  
  // Compare generation parameters
  if (metadata1.generation_parameters && metadata2.generation_parameters) {
    const gp1 = metadata1.generation_parameters;
    const gp2 = metadata2.generation_parameters;
    
    // Compare subspecialty and dominant emotion
    if (gp1.subspecialty_input === gp2.subspecialty_input) {
      similarityScore += 1;
    }
    comparisons++;
    
    if (gp1.dominant_emotion === gp2.dominant_emotion) {
      similarityScore += 1;
    }
    comparisons++;
  }
  
  // Compare pattern fingerprints
  if (metadata1.ai_analysis_data?.pattern_fingerprint && 
      metadata2.ai_analysis_data?.pattern_fingerprint) {
    const fp1 = metadata1.ai_analysis_data.pattern_fingerprint;
    const fp2 = metadata2.ai_analysis_data.pattern_fingerprint;
    
    // Simple string similarity
    let matchingChars = 0;
    const minLength = Math.min(fp1.length, fp2.length);
    for (let i = 0; i < minLength; i++) {
      if (fp1[i] === fp2[i]) matchingChars++;
    }
    
    similarityScore += matchingChars / Math.max(fp1.length, fp2.length);
    comparisons++;
  }
  
  const finalSimilarity = comparisons > 0 ? similarityScore / comparisons : 0;
  
  return {
    similarity_score: Math.round(finalSimilarity * 100) / 100, // Round to 2 decimal places
    comparison_valid: comparisons > 0,
    comparisons_made: comparisons,
    similarity_category: finalSimilarity > 0.7 ? 'high' : finalSimilarity > 0.4 ? 'medium' : 'low'
  };
};