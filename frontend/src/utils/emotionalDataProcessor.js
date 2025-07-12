/**
 * Utility functions for processing emotional and algorithm data
 * Used across multiple components for consistent data analysis
 */

/**
 * Analyzes algorithm data from artwork to determine version and completeness
 * @param {Object} artworkData - The artwork data containing algorithm parameters
 * @returns {Object} Analysis results including version, completeness, and data quality
 */
export const analyzeAlgorithmData = (artworkData) => {
  const emotionalData = artworkData.emotional_data || {};
  const algorithmParams = artworkData.algorithm_parameters || {};
  
  // Check for manual algorithm indicators
  const hasEmotionalJourney = algorithmParams.emotional_journey && Object.keys(algorithmParams.emotional_journey).length > 0;
  const hasEnhancedMedicalTerms = algorithmParams.medical_terms && Object.keys(algorithmParams.medical_terms).length > 0;
  const hasStatisticalData = algorithmParams.statistical_data && algorithmParams.statistical_data.length > 0;
  const hasResearchCitations = algorithmParams.research_citations && algorithmParams.research_citations.length > 0;
  const algorithmVersion = algorithmParams.algorithm_version || 'unknown';
  
  // Calculate data completeness score
  const dataComponents = [
    hasEmotionalJourney,
    hasEnhancedMedicalTerms,
    hasStatisticalData,
    hasResearchCitations
  ];
  const completenessScore = dataComponents.filter(Boolean).length;
  
  return {
    isManualAlgorithm: hasEmotionalJourney && hasEnhancedMedicalTerms,
    hasCompleteData: completenessScore >= 3,
    completenessScore: completenessScore,
    maxScore: 4,
    algorithmVersion: algorithmVersion,
    dataBreakdown: {
      emotionalJourney: hasEmotionalJourney,
      enhancedMedicalTerms: hasEnhancedMedicalTerms,
      statisticalData: hasStatisticalData,
      researchCitations: hasResearchCitations
    },
    dataQuality: completenessScore >= 3 ? 'high' : completenessScore >= 2 ? 'medium' : 'low'
  };
};

/**
 * Processes and normalizes emotional data for display
 * Handles different data formats from various algorithm versions
 * @param {Object} article - The article data containing emotional information
 * @returns {Object} Normalized emotional data ready for display
 */
export const getEmotionalDataToDisplay = (article) => {
  if (!article) return {};
  
  // Prefer algorithm_parameters emotional data over article emotional_data
  const algorithmParams = article.algorithm_parameters || {};
  const articleEmotional = article.emotional_data || {};
  
  // If we have emotional_journey from manual algorithm, use it
  if (algorithmParams.emotional_journey) {
    const journey = algorithmParams.emotional_journey;
    
    // Convert journey values (0-1000 scale) to 0-1 scale for display
    return {
      hope: (journey.healingPotential || 0) / 1000,
      confidence: (journey.solutionConfidence || 0) / 1000,
      healing: (journey.healingPotential || 0) / 1000,
      breakthrough: (journey.innovationLevel || 0) / 1000,
      tension: (journey.problemIntensity || 0) / 1000,
      uncertainty: (journey.uncertaintyLevel || 0) / 1000,
      dominant_emotion: journey.dominantEmotion || algorithmParams.dominant_emotion || 'confidence'
    };
  }
  
  // Fall back to emotional_mix or article emotional_data
  if (algorithmParams.emotional_mix) {
    return {
      ...algorithmParams.emotional_mix,
      dominant_emotion: algorithmParams.dominant_emotion || 'confidence'
    };
  }
  
  // Final fallback to article emotional_data
  return articleEmotional;
};

/**
 * Calculates average importance from research citations
 * @param {Array} citations - Array of research citation objects
 * @returns {number} Average importance percentage
 */
export const calculateAverageImportance = (citations) => {
  if (!citations || citations.length === 0) return 0;
  
  const totalImportance = citations.reduce((sum, cit) => sum + (cit.importance || 0), 0);
  return (totalImportance / citations.length * 100);
};

/**
 * Calculates average impact from research citations
 * @param {Array} citations - Array of research citation objects
 * @returns {number} Average impact percentage
 */
export const calculateAverageImpact = (citations) => {
  if (!citations || citations.length === 0) return 0;
  
  const totalImpact = citations.reduce((sum, cit) => sum + (cit.impact || 0), 0);
  return (totalImpact / citations.length * 100);
};

/**
 * Processes medical term data for display
 * @param {Object} medicalTerms - Medical terms object from algorithm parameters
 * @returns {Array} Processed array of term categories with counts and scores
 */
export const processMedicalTerms = (medicalTerms) => {
  if (!medicalTerms) return [];
  
  return Object.entries(medicalTerms).map(([category, terms]) => {
    const termCount = Object.keys(terms || {}).length;
    const totalSignificance = Object.values(terms || {}).reduce((sum, term) => 
      sum + (term.significance || term.count || 0), 0
    );
    
    return {
      category,
      termCount,
      totalSignificance,
      displayName: category.replace(/([A-Z])/g, ' $1').trim()
    };
  });
};