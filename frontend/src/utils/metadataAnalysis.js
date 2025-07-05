// metadataAnalysis.js - Comprehensive metadata analysis utilities for Arthrokinetix
// Part of Phase 2C Advanced Analytics Dashboard foundation

import { 
  calculateTreeComplexity,
  analyzeColorUsage,
  calculateElementDensity,
  generatePatternFingerprint,
  estimateElementArea,
  countElementTypes,
  analyzeSpatialDistribution,
  analyzeColorDistribution,
  analyzeSizeDistribution
} from './metadataHelpers';

/**
 * Analyzes visual characteristics of generated artwork
 * @param {Array} visualElements - Array of visual elements from algorithm
 * @param {Object} state - Algorithm state object
 * @returns {Object} Visual characteristics metadata
 */
export const analyzeVisualCharacteristics = (visualElements, state) => {
  return {
    // Tree Structure Analysis
    tree_complexity: calculateTreeComplexity(visualElements),
    branch_count: countBranches(visualElements),
    branch_angles: extractBranchAngles(visualElements),
    branch_distribution: analyzeBranchDistribution(visualElements),
    
    // Color Analysis
    color_palette_usage: analyzeColorUsage(visualElements, state),
    dominant_color_scheme: identifyColorScheme(visualElements),
    color_harmony_type: calculateColorHarmony(visualElements),
    
    // Composition Analysis
    element_density: calculateElementDensity(visualElements, state),
    composition_balance: analyzeCompositionBalance(visualElements, state),
    visual_weight_distribution: calculateVisualWeight(visualElements),
    
    // Pattern Analysis
    dominant_shapes: identifyDominantShapes(visualElements),
    pattern_complexity: calculatePatternComplexity(visualElements),
    organic_vs_geometric_ratio: calculateOrganicRatio(visualElements),
    
    // Animation Analysis
    animation_complexity: analyzeAnimationComplexity(visualElements),
    movement_patterns: identifyMovementPatterns(visualElements)
  };
};

/**
 * Extracts generation parameters from algorithm state and parameters
 * @param {Object} state - Algorithm state object
 * @param {Object} algorithmParams - Algorithm parameters from backend
 * @returns {Object} Generation parameters metadata
 */
export const extractGenerationParameters = (state, algorithmParams) => {
  return {
    // Core Input Parameters
    evidence_strength_input: algorithmParams.evidence_strength || 0.5,
    technical_density_input: algorithmParams.technical_density || 0.5,
    subspecialty_input: algorithmParams.subspecialty || 'sportsMedicine',
    
    // Emotional Weights
    emotional_weights: algorithmParams.emotional_journey || {},
    emotional_mix: algorithmParams.emotional_mix || {},
    dominant_emotion: algorithmParams.dominant_emotion || 'confidence',
    
    // Medical Data Influence
    medical_terms_count: Object.keys(algorithmParams.medical_terms || {}).length,
    statistical_data_count: (algorithmParams.statistical_data || []).length,
    research_citations_count: (algorithmParams.research_citations || []).length,
    
    // Algorithm State
    subspecialty_modifiers: extractSubspecialtyModifiers(state),
    generation_timestamp: new Date().toISOString(),
    algorithm_version: algorithmParams.algorithm_version || '2.0',
    
    // Randomization Tracking
    randomization_seeds: generateRandomizationSeeds(),
    parameter_evolution_generation: 1 // Will increment in Phase 2C evolution
  };
};

/**
 * Analyzes pattern usage in the generated artwork
 * @param {Array} visualElements - Array of visual elements
 * @param {Object} state - Algorithm state object
 * @returns {Object} Pattern usage metadata
 */
export const analyzePatternUsage = (visualElements, state) => {
  return {
    // Tree Patterns
    tree_root_pattern: identifyRootPattern(visualElements),
    branch_pattern_type: identifyBranchPattern(visualElements),
    trunk_characteristics: analyzeTrunkCharacteristics(visualElements),
    
    // Element Distribution Patterns
    healing_element_pattern: identifyHealingPattern(visualElements),
    data_flow_pattern: identifyDataFlowPattern(visualElements),
    emotional_field_layout: identifyEmotionalLayout(visualElements),
    research_constellation_type: identifyConstellationType(visualElements),
    
    // Visual Style Patterns
    color_combination_signature: generateColorSignature(visualElements),
    composition_style: identifyCompositionStyle(visualElements),
    animation_style_signature: identifyAnimationStyle(visualElements),
    
    // Subspecialty Specific Patterns
    subspecialty_visual_signature: generateSubspecialtySignature(state),
    medical_content_influence: analyzeMedicalInfluence(state)
  };
};

/**
 * Prepares data for AI analysis and evolution tracking
 * @param {Array} visualElements - Array of visual elements
 * @param {Object} algorithmParams - Algorithm parameters
 * @param {Object} visualCharacteristics - Visual characteristics metadata
 * @returns {Object} AI analysis ready data
 */
export const prepareAIAnalysisData = (visualElements, algorithmParams, visualCharacteristics) => {
  return {
    // Uniqueness Scoring
    uniqueness_factors: {
      color_uniqueness: calculateColorUniqueness(visualCharacteristics),
      composition_uniqueness: calculateCompositionUniqueness(visualCharacteristics),
      pattern_uniqueness: calculatePatternUniqueness(visualCharacteristics),
      emotional_uniqueness: calculateEmotionalUniqueness(algorithmParams)
    },
    
    // Pattern Evolution Readiness
    evolution_readiness: {
      parameter_stability: assessParameterStability(algorithmParams),
      pattern_maturity: assessPatternMaturity(visualCharacteristics),
      creative_potential: assessCreativePotential(visualElements),
      modification_candidates: identifyModificationCandidates(visualElements)
    },
    
    // AI Analysis Preparation
    feature_vectors: generateFeatureVectors(visualCharacteristics),
    pattern_fingerprint: generatePatternFingerprint(visualElements),
    similarity_markers: generateSimilarityMarkers(visualCharacteristics),
    evolution_targets: identifyEvolutionTargets(visualCharacteristics)
  };
};

// Helper functions for visual analysis

const countBranches = (visualElements) => {
  return visualElements.filter(el => el.type === 'andryBranch').length;
};

const extractBranchAngles = (visualElements) => {
  const branches = visualElements.filter(el => el.type === 'andryBranch');
  return branches.map(branch => branch.angle || 0);
};

const analyzeBranchDistribution = (visualElements) => {
  const branches = visualElements.filter(el => el.type === 'andryBranch');
  const leftBranches = branches.filter(b => (b.angle || 0) > 90 && (b.angle || 0) < 270);
  const rightBranches = branches.filter(b => (b.angle || 0) <= 90 || (b.angle || 0) >= 270);
  
  return {
    left_side_count: leftBranches.length,
    right_side_count: rightBranches.length,
    balance_ratio: rightBranches.length / Math.max(1, leftBranches.length),
    distribution_type: Math.abs(leftBranches.length - rightBranches.length) <= 1 ? 'balanced' : 'asymmetric'
  };
};

const identifyColorScheme = (visualElements) => {
  const colors = visualElements.map(el => el.color).filter(Boolean);
  const uniqueColors = [...new Set(colors)];
  
  if (uniqueColors.length <= 3) return 'monochromatic';
  if (uniqueColors.length <= 5) return 'analogous';
  if (uniqueColors.length <= 8) return 'triadic';
  return 'polychromatic';
};

const calculateColorHarmony = (visualElements) => {
  const colors = visualElements.map(el => el.color).filter(Boolean);
  // Simplified harmony calculation based on color frequency
  const colorCounts = {};
  colors.forEach(color => {
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  });
  
  const maxCount = Math.max(...Object.values(colorCounts));
  const totalElements = colors.length;
  return maxCount / totalElements; // Higher value = more harmonious
};

const analyzeCompositionBalance = (visualElements, state) => {
  const centerX = state.canvasWidth / 2;
  const centerY = state.canvasHeight / 2;
  
  let leftWeight = 0, rightWeight = 0, topWeight = 0, bottomWeight = 0;
  
  visualElements.forEach(el => {
    const weight = estimateElementArea(el);
    const x = el.x || 0;
    const y = el.y || 0;
    
    if (x < centerX) leftWeight += weight;
    else rightWeight += weight;
    
    if (y < centerY) topWeight += weight;
    else bottomWeight += weight;
  });
  
  return {
    horizontal_balance: rightWeight / Math.max(1, leftWeight),
    vertical_balance: bottomWeight / Math.max(1, topWeight),
    overall_balance: Math.min(rightWeight / Math.max(1, leftWeight), bottomWeight / Math.max(1, topWeight))
  };
};

const calculateVisualWeight = (visualElements) => {
  const totalArea = visualElements.reduce((sum, el) => sum + estimateElementArea(el), 0);
  
  return visualElements.map(el => ({
    type: el.type,
    weight: estimateElementArea(el) / totalArea,
    position: { x: el.x || 0, y: el.y || 0 }
  }));
};

const identifyDominantShapes = (visualElements) => {
  const shapeCounts = {};
  
  visualElements.forEach(el => {
    let shape = 'unknown';
    
    if (el.type === 'andryRoot' || el.type === 'andryBranch') shape = 'organic_line';
    else if (el.type === 'andryTrunk') shape = 'rectangle';
    else if (el.type === 'healingParticle') shape = 'circle';
    else if (el.type === 'emotionalField') shape = 'ellipse';
    else if (el.type === 'researchStar') shape = 'star';
    else if (el.type === 'precisionGrid') shape = 'grid';
    
    shapeCounts[shape] = (shapeCounts[shape] || 0) + 1;
  });
  
  return shapeCounts;
};

const calculatePatternComplexity = (visualElements) => {
  const elementTypes = countElementTypes(visualElements);
  const typeCount = Object.keys(elementTypes).length;
  const totalElements = visualElements.length;
  const avgElementsPerType = totalElements / typeCount;
  
  // Higher complexity = more types with fewer elements each
  return typeCount / Math.sqrt(avgElementsPerType);
};

const calculateOrganicRatio = (visualElements) => {
  const organicTypes = ['andryRoot', 'andryBranch', 'healingParticle', 'emotionalField'];
  const geometricTypes = ['andryTrunk', 'precisionGrid', 'researchStar'];
  
  const organicCount = visualElements.filter(el => organicTypes.includes(el.type)).length;
  const geometricCount = visualElements.filter(el => geometricTypes.includes(el.type)).length;
  
  return organicCount / Math.max(1, organicCount + geometricCount);
};

const analyzeAnimationComplexity = (visualElements) => {
  // Estimate animation complexity based on element types that typically animate
  const animatedTypes = ['healingParticle', 'emotionalField', 'dataFlow', 'atmosphericParticle'];
  const animatedElements = visualElements.filter(el => animatedTypes.includes(el.type));
  
  return {
    animated_element_count: animatedElements.length,
    animation_ratio: animatedElements.length / Math.max(1, visualElements.length),
    complexity_score: animatedElements.length * 0.1 // Simplified scoring
  };
};

const identifyMovementPatterns = (visualElements) => {
  const movementTypes = {
    pulsing: visualElements.filter(el => ['healingParticle', 'emotionalField'].includes(el.type)).length,
    flowing: visualElements.filter(el => el.type === 'dataFlow').length,
    drifting: visualElements.filter(el => el.type === 'atmosphericParticle').length,
    static: visualElements.filter(el => ['andryTrunk', 'precisionGrid'].includes(el.type)).length
  };
  
  return movementTypes;
};

// Pattern identification functions
const identifyRootPattern = (visualElements) => {
  const roots = visualElements.filter(el => el.type === 'andryRoot');
  
  if (roots.length === 0) return 'none';
  if (roots.length <= 3) return 'simple';
  if (roots.length <= 6) return 'moderate';
  return 'complex';
};

const identifyBranchPattern = (visualElements) => {
  const branches = visualElements.filter(el => el.type === 'andryBranch');
  const angles = branches.map(b => b.angle || 0);
  
  const angleVariation = angles.reduce((sum, angle, i, arr) => {
    if (i === 0) return 0;
    return sum + Math.abs(angle - arr[i-1]);
  }, 0) / Math.max(1, angles.length - 1);
  
  if (angleVariation < 10) return 'regular';
  if (angleVariation < 30) return 'organic';
  return 'chaotic';
};

const analyzeTrunkCharacteristics = (visualElements) => {
  const trunks = visualElements.filter(el => el.type === 'andryTrunk');
  
  if (trunks.length === 0) return { type: 'none' };
  
  const trunk = trunks[0];
  return {
    type: 'single',
    thickness: trunk.thickness || 8,
    height: trunk.height || 100,
    strength_category: (trunk.thickness || 8) > 10 ? 'strong' : 'moderate'
  };
};

// Additional pattern analysis functions
const identifyHealingPattern = (visualElements) => {
  const healingElements = visualElements.filter(el => 
    el.type === 'healingParticle' || el.type === 'healingAura'
  );
  
  return {
    element_count: healingElements.length,
    distribution_type: healingElements.length > 10 ? 'abundant' : 'sparse',
    pattern_signature: `healing_${healingElements.length}_elements`
  };
};

const identifyDataFlowPattern = (visualElements) => {
  const dataFlows = visualElements.filter(el => el.type === 'dataFlow');
  
  return {
    flow_count: dataFlows.length,
    complexity_type: dataFlows.length > 5 ? 'complex' : 'simple',
    pattern_signature: `flow_${dataFlows.length}_streams`
  };
};

const identifyEmotionalLayout = (visualElements) => {
  const emotionalFields = visualElements.filter(el => el.type === 'emotionalField');
  
  return {
    field_count: emotionalFields.length,
    layout_type: emotionalFields.length > 3 ? 'multi_field' : 'focused',
    pattern_signature: `emotion_${emotionalFields.length}_fields`
  };
};

const identifyConstellationType = (visualElements) => {
  const stars = visualElements.filter(el => el.type === 'researchStar');
  
  return {
    star_count: stars.length,
    constellation_type: stars.length > 8 ? 'dense_cluster' : 'sparse_points',
    pattern_signature: `constellation_${stars.length}_stars`
  };
};

const generateColorSignature = (visualElements) => {
  const colors = visualElements.map(el => el.color).filter(Boolean);
  const colorFreq = {};
  
  colors.forEach(color => {
    colorFreq[color] = (colorFreq[color] || 0) + 1;
  });
  
  const sortedColors = Object.entries(colorFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([color]) => color);
  
  return sortedColors.join('_');
};

const identifyCompositionStyle = (visualElements) => {
  const centerX = 400, centerY = 400; // Default canvas center
  const centralElements = visualElements.filter(el => {
    const x = el.x || centerX;
    const y = el.y || centerY;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance < 200; // Within central area
  });
  
  const centralRatio = centralElements.length / Math.max(1, visualElements.length);
  
  if (centralRatio > 0.7) return 'centered';
  if (centralRatio < 0.3) return 'distributed';
  return 'balanced';
};

const identifyAnimationStyle = (visualElements) => {
  const animatedTypes = visualElements.filter(el => 
    ['healingParticle', 'emotionalField', 'dataFlow'].includes(el.type)
  );
  
  const animationRatio = animatedTypes.length / Math.max(1, visualElements.length);
  
  if (animationRatio > 0.6) return 'highly_animated';
  if (animationRatio > 0.3) return 'moderately_animated';
  return 'mostly_static';
};

// Utility functions for metadata extraction
const extractSubspecialtyModifiers = (state) => {
  return {
    subspecialty: state.subspecialty,
    color_palette: state.emotionalPalettes ? Object.keys(state.emotionalPalettes) : [],
    brand_colors: state.brandColors || {}
  };
};

const generateRandomizationSeeds = () => {
  return {
    generation_seed: Math.random().toString(36).substr(2, 9),
    timestamp_seed: Date.now().toString(36),
    browser_seed: navigator.userAgent.substr(0, 10).replace(/\W/g, '')
  };
};

const generateSubspecialtySignature = (state) => {
  return {
    subspecialty: state.subspecialty,
    signature: `${state.subspecialty}_${Date.now().toString(36).substr(-4)}`
  };
};

const analyzeMedicalInfluence = (state) => {
  const articleData = state.articleData || {};
  
  return {
    evidence_strength_influence: articleData.evidence_strength || 0,
    technical_density_influence: articleData.technical_density || 0,
    medical_terms_influence: Object.keys(articleData.medical_terms || {}).length,
    data_richness_score: (articleData.statistical_data || []).length + 
                        (articleData.research_citations || []).length
  };
};

// Uniqueness calculation functions
const calculateColorUniqueness = (characteristics) => {
  const colorDiversity = characteristics.color_palette_usage ? 
    Object.keys(characteristics.color_palette_usage).length : 0;
  return Math.min(1.0, colorDiversity / 10); // Normalized to 0-1
};

const calculateCompositionUniqueness = (characteristics) => {
  const balance = characteristics.composition_balance?.overall_balance || 0.5;
  const density = characteristics.element_density || 0.5;
  
  // Uniqueness from deviation from typical balance and density
  const balanceUniqueness = Math.abs(balance - 0.5) * 2;
  const densityUniqueness = Math.abs(density - 0.3) * 1.5;
  
  return Math.min(1.0, (balanceUniqueness + densityUniqueness) / 2);
};

const calculatePatternUniqueness = (characteristics) => {
  const complexity = characteristics.pattern_complexity || 0.5;
  const organicRatio = characteristics.organic_vs_geometric_ratio || 0.5;
  
  // Higher complexity and extreme organic ratios = more unique
  const complexityScore = Math.min(1.0, complexity / 2);
  const organicScore = Math.abs(organicRatio - 0.5) * 2;
  
  return (complexityScore + organicScore) / 2;
};

const calculateEmotionalUniqueness = (algorithmParams) => {
  const emotionalMix = algorithmParams.emotional_mix || {};
  const emotions = Object.values(emotionalMix);
  
  if (emotions.length === 0) return 0.5;
  
  // Calculate variance in emotional values
  const mean = emotions.reduce((sum, val) => sum + val, 0) / emotions.length;
  const variance = emotions.reduce((sum, val) => sum + (val - mean) ** 2, 0) / emotions.length;
  
  return Math.min(1.0, variance * 2); // Higher variance = more unique
};

// Assessment functions for AI readiness
const assessParameterStability = (algorithmParams) => {
  // Simple stability assessment based on parameter completeness
  const requiredParams = ['evidence_strength', 'technical_density', 'dominant_emotion'];
  const presentParams = requiredParams.filter(param => algorithmParams[param] !== undefined);
  
  return {
    completeness: presentParams.length / requiredParams.length,
    stability_score: presentParams.length >= 3 ? 'stable' : 'unstable'
  };
};

const assessPatternMaturity = (characteristics) => {
  const complexity = characteristics.pattern_complexity || 0;
  const balance = characteristics.composition_balance?.overall_balance || 0.5;
  
  return {
    complexity_maturity: complexity > 1.0 ? 'mature' : 'developing',
    balance_maturity: Math.abs(balance - 1.0) < 0.3 ? 'mature' : 'developing',
    overall_maturity: complexity > 1.0 && Math.abs(balance - 1.0) < 0.3 ? 'mature' : 'developing'
  };
};

const assessCreativePotential = (visualElements) => {
  const elementTypes = countElementTypes(visualElements);
  const typeVariety = Object.keys(elementTypes).length;
  
  return {
    type_variety: typeVariety,
    creative_potential: typeVariety > 5 ? 'high' : typeVariety > 3 ? 'medium' : 'low',
    expansion_opportunities: 8 - typeVariety // Room for more element types
  };
};

const identifyModificationCandidates = (visualElements) => {
  const elementCounts = countElementTypes(visualElements);
  
  // Identify under-represented element types as modification candidates
  const candidates = [];
  const allTypes = ['andryRoot', 'andryTrunk', 'andryBranch', 'healingParticle', 
                   'emotionalField', 'dataFlow', 'researchStar', 'atmosphericParticle'];
  
  allTypes.forEach(type => {
    const count = elementCounts[type] || 0;
    if (count < 3) {
      candidates.push({
        element_type: type,
        current_count: count,
        modification_potential: 'increase'
      });
    } else if (count > 20) {
      candidates.push({
        element_type: type,
        current_count: count,
        modification_potential: 'decrease'
      });
    }
  });
  
  return candidates;
};

const generateFeatureVectors = (characteristics) => {
  return {
    // Numerical features for AI analysis
    complexity_vector: [
      characteristics.tree_complexity || 0,
      characteristics.pattern_complexity || 0,
      characteristics.element_density || 0
    ],
    color_vector: [
      Object.keys(characteristics.color_palette_usage || {}).length,
      characteristics.composition_balance?.overall_balance || 0.5,
      characteristics.organic_vs_geometric_ratio || 0.5
    ],
    composition_vector: [
      characteristics.composition_balance?.horizontal_balance || 1.0,
      characteristics.composition_balance?.vertical_balance || 1.0,
      characteristics.animation_complexity?.animation_ratio || 0
    ]
  };
};

const generateSimilarityMarkers = (characteristics) => {
  return {
    color_similarity_key: `color_${Object.keys(characteristics.color_palette_usage || {}).length}`,
    complexity_similarity_key: `complexity_${Math.round((characteristics.pattern_complexity || 0) * 10)}`,
    composition_similarity_key: `composition_${characteristics.composition_balance ? 'balanced' : 'unbalanced'}`,
    style_similarity_key: `style_${characteristics.dominant_shapes ? Object.keys(characteristics.dominant_shapes)[0] : 'unknown'}`
  };
};

const identifyEvolutionTargets = (characteristics) => {
  const targets = [];
  
  // Identify areas for potential evolution
  if ((characteristics.pattern_complexity || 0) < 0.5) {
    targets.push({ target: 'increase_complexity', priority: 'medium' });
  }
  
  if ((characteristics.element_density || 0) < 0.3) {
    targets.push({ target: 'increase_density', priority: 'low' });
  }
  
  if ((characteristics.organic_vs_geometric_ratio || 0.5) > 0.8) {
    targets.push({ target: 'add_geometric_elements', priority: 'medium' });
  }
  
  if (Object.keys(characteristics.color_palette_usage || {}).length < 4) {
    targets.push({ target: 'diversify_colors', priority: 'high' });
  }
  
  return targets;
};