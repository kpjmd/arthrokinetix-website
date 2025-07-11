// Fixed RealArthrokinetixArtwork.js - Exact Manual Algorithm Integration with Comprehensive Metadata
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import comprehensive metadata utilities for Phase 2C Advanced Analytics Dashboard
import { 
  analyzeVisualCharacteristics,
  extractGenerationParameters,
  analyzePatternUsage,
  prepareAIAnalysisData 
} from '../utils/metadataAnalysis';
import { 
  generateUniqueArtworkID,
  calculateRenderingComplexity,
  validateMetadata 
} from '../utils/metadataHelpers';
// SVG download functionality removed - only available in admin dashboard
// import { 
//   generateDownloadableSVG,
//   downloadSVG,
//   generateArtworkFilename 
// } from '../utils/svgExport';

const RealArthrokinetixArtwork = ({ artwork, width = 400, height = 400 }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [algorithmState, setAlgorithmState] = useState(null);
  // NEW: Comprehensive metadata state for Phase 2C Advanced Analytics Dashboard
  const [artworkMetadata, setArtworkMetadata] = useState(null);
  const [metadataValidation, setMetadataValidation] = useState(null);

  useEffect(() => {
    if (artwork && artwork.algorithm_parameters) {
      generateArtworkFromManualAlgorithm();
    }
  }, [artwork]);

  const generateArtworkFromManualAlgorithm = () => {
    const params = artwork.algorithm_parameters;
    const metadata = artwork.metadata || {};
    
    console.log('🎨 MANUAL ALGORITHM - Generating artwork for:', artwork.title);
    console.log('📊 Complete algorithm parameters:', params);
    
    // Extract data from manual algorithm output structure (EXACT match to backend)
    const emotionalJourney = params.emotional_journey || {};
    const emotionalMix = params.emotional_mix || {};
    const medicalTerms = params.medical_terms || {};
    const statisticalData = params.statistical_data || [];
    const researchCitations = params.research_citations || [];
    const visualElements = params.visual_elements || [];
    
    // Core algorithm values (EXACT match to Python backend)
    const evidenceStrength = params.evidence_strength || 0.5;
    const technicalDensity = params.technical_density || 0.5;
    const subspecialty = params.subspecialty || 'sportsMedicine';
    const dominantEmotion = params.dominant_emotion || 'confidence';
    const uniquenessFactors = params.uniqueness_factors || {};
    const dataComplexity = params.data_complexity || 0.5;
    
    // Create algorithm state object (matching JavaScript manual algorithm)
    const state = {
      canvasWidth: width,
      canvasHeight: height,
      subspecialty: subspecialty,
      articleData: {
        evidence_strength: evidenceStrength,
        technical_density: technicalDensity,
        medical_terms: medicalTerms,
        statistical_data: statisticalData,
        research_citations: researchCitations,
        word_count: params.article_word_count || 0
      },
      emotionalJourney: emotionalJourney,
      visualElements: visualElements,
      brandColors: {
        primary: "#2c3e50",
        secondary: "#3498db", 
        accent: "#e74c3c",
        light: "#ecf0f1"
      },
      emotionalPalettes: {
        hope: ["#27ae60", "#2ecc71", "#58d68d", "#85e085"],
        tension: ["#e74c3c", "#c0392b", "#a93226", "#8b0000"],
        confidence: ["#3498db", "#2980b9", "#1f4e79", "#1a5490"],
        uncertainty: ["#95a5a6", "#7f8c8d", "#5d6d7e", "#484c52"],
        breakthrough: ["#f39c12", "#e67e22", "#d35400", "#cc6600"],
        healing: ["#16a085", "#1abc9c", "#48c9b0", "#76d7c4"]
      }
    };
    
    setAlgorithmState(state);
    
    // Debug information (EXACT match to manual algorithm logging)
    const debug = {
      dataAvailability: {
        emotionalJourney: Object.keys(emotionalJourney).length > 0,
        emotionalMix: Object.keys(emotionalMix).length > 0,
        medicalTerms: Object.keys(medicalTerms).length > 0,
        statisticalData: statisticalData.length > 0,
        researchCitations: researchCitations.length > 0,
        visualElements: visualElements.length > 0
      },
      algorithmMetrics: {
        evidenceStrength,
        technicalDensity,
        subspecialty,
        dominantEmotion,
        dataComplexity
      },
      dataStructure: {
        emotionalJourneyKeys: Object.keys(emotionalJourney),
        emotionalMixKeys: Object.keys(emotionalMix),
        medicalTermCategories: Object.keys(medicalTerms),
        statisticsCount: statisticalData.length,
        citationsCount: researchCitations.length,
        visualElementsCount: visualElements.length
      },
      uniquenessFactors: uniquenessFactors
    };
    
    setDebugInfo(debug);
    console.log('🔬 Manual Algorithm Debug Info:', debug);
    
    // Generate visual components using EXACT manual algorithm methods
    const backgroundGradient = generateBackgroundGradient(state);
    const andryTreeElements = generateAndryTreeRoots(state);
    const trunkAndBranches = generateTreeStructure(state);
    const healingElements = generateHealingElements(state);
    const dataFlows = generateDataFlows(state);
    const emotionalFields = generateEmotionalFields(state);
    const researchConstellation = generateResearchConstellation(state);
    const atmosphericElements = generateAtmosphericElements(state);
    
    // Combine all visual elements (EXACT manual algorithm layering)
    const allVisualElements = [
      ...atmosphericElements,
      ...emotionalFields,
      ...andryTreeElements,
      ...trunkAndBranches,
      ...dataFlows,
      ...healingElements,
      ...researchConstellation
    ];
    
    // NEW: Generate comprehensive metadata for Phase 2C Advanced Analytics Dashboard
    console.log('🔬 Generating comprehensive metadata...');
    const visualCharacteristics = analyzeVisualCharacteristics(allVisualElements, state);
    const generationParameters = extractGenerationParameters(state, params);
    const patternUsage = analyzePatternUsage(allVisualElements, state);
    const aiAnalysisData = prepareAIAnalysisData(allVisualElements, params, visualCharacteristics);
    
    const comprehensiveMetadata = {
      // Basic metadata (existing)
      signature_id: generateUniqueArtworkID({ 
        subspecialty: subspecialty,
        dominantEmotion: dominantEmotion,
        visual_characteristics: visualCharacteristics,
        pattern_fingerprint: aiAnalysisData.pattern_fingerprint
      }),
      rarity_score: aiAnalysisData.uniqueness_factors?.color_uniqueness || 0.5,
      generation_timestamp: new Date().toISOString(),
      algorithm_version: params.algorithm_version || '2.0-comprehensive',
      
      // NEW: Comprehensive metadata for Phase 2C Advanced Analytics Dashboard
      visual_characteristics: visualCharacteristics,
      generation_parameters: generationParameters,
      pattern_usage: patternUsage,
      ai_analysis_data: aiAnalysisData,
      
      // Canvas and rendering info
      canvas_dimensions: { width: state.canvasWidth, height: state.canvasHeight },
      visual_element_count: allVisualElements.length,
      rendering_complexity: calculateRenderingComplexity(allVisualElements),
      
      // Original algorithm parameters for compatibility
      subspecialty: subspecialty,
      dominant_emotion: dominantEmotion,
      algorithm_parameters: params
    };
    
    // Validate metadata completeness
    const validation = validateMetadata(comprehensiveMetadata);
    setMetadataValidation(validation);
    
    // Store metadata in state for potential backend saving
    setArtworkMetadata(comprehensiveMetadata);
    
    console.log('✅ Comprehensive Metadata Generated:', comprehensiveMetadata);
    console.log('📊 Metadata Validation:', validation);
    
    const svg = (
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        className="manual-algorithm-artwork w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Background gradients (EXACT manual algorithm) */}
          <radialGradient id={`bg-manual-${artwork.id}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={backgroundGradient.center} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={backgroundGradient.edge} stopOpacity="0.4"/>
          </radialGradient>
          
          {/* Healing gradient (EXACT manual algorithm) */}
          <radialGradient id={`healingGradient-${artwork.id}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={getEmotionalColor(state, 'healing', 0.8)} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={getEmotionalColor(state, 'healing', 0.4)} stopOpacity="0"/>
          </radialGradient>
          
          {/* Emotional gradients */}
          <linearGradient id={`emotion-${artwork.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getEmotionalColor(state, dominantEmotion)} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={getEmotionalColor(state, dominantEmotion)} stopOpacity="0.1"/>
          </linearGradient>
          
          {/* Blur filter (EXACT manual algorithm) */}
          <filter id={`blur-${artwork.id}`}>
            <feGaussianBlur stdDeviation="5"/>
          </filter>
        </defs>

        {/* Background (EXACT manual algorithm) */}
        <rect width="100%" height="100%" fill={state.brandColors.light} />
        <rect 
          width="100%" 
          height="100%" 
          fill={`url(#bg-manual-${artwork.id})`}
          opacity="0.5"
        />

        {/* Render all visual elements in correct layer order (EXACT manual algorithm) */}
        {allVisualElements.map((element, index) => 
          renderVisualElement(element, index, artwork.id, state)
        )}

        {/* Algorithm Signature (EXACT manual algorithm) */}
        <g className="algorithm-signature" transform={`translate(${width * 0.05}, ${height * 0.95})`}>
          <text
            x="0"
            y="0"
            fontSize="10"
            fill={getEmotionalColor(state, dominantEmotion)}
            opacity="0.8"
            fontFamily="monospace"
          >
            {generateUniqueID(params)}
          </text>
          <text
            x="0"
            y="12"
            fontSize="8"
            fill="#666666"
            opacity="0.6"
            fontFamily="monospace"
          >
            v{params.algorithm_version || '2.0'} • {subspecialty}
          </text>
        </g>

        {/* Data Integrity Indicator */}
        <g className="data-integrity" transform={`translate(${width * 0.95}, ${height * 0.05})`}>
          <circle
            cx="0"
            cy="0"
            r="6"
            fill={debug.dataAvailability.emotionalJourney ? "#27ae60" : "#e74c3c"}
            opacity="0.7"
          />
          <circle
            cx="0"
            cy="0"
            r="10"
            fill="none"
            stroke={debug.dataAvailability.emotionalJourney ? "#27ae60" : "#e74c3c"}
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      </svg>
    );

    setSvgContent(svg);
  };

  // Enhanced manual algorithm implementation - generateAndryTreeRoots with randomization
  const generateAndryTreeRoots = (state) => {
    const elements = [];
    const evidenceStrength = state.articleData.evidence_strength || 0.5;
    const wordCount = state.articleData.word_count || 0;
    const citationsCount = state.articleData.research_citations?.length || 0;
    
    // Create article-specific seed for consistent randomness (matches backend)
    const fullText = artwork?.algorithm_parameters?.article_data?.full_text || '';
    const articleSeed = Math.abs(hashString(fullText.substring(0, 100))) % 10000;
    
    // Seed the random number generator for consistent results
    const seededRandom = createSeededRandom(articleSeed);
    
    // Enhanced root complexity based on multiple factors (matches backend)
    const baseComplexity = Math.max(4, Math.floor(evidenceStrength * 12)); // Increased from 3-8 to 4-12
    const contentBonus = Math.min(3, Math.floor(wordCount / 500)); // +1 per 500 words, max 3
    const citationBonus = Math.min(2, Math.floor(citationsCount / 5)); // +1 per 5 citations, max 2
    const subspecialtyBonus = getSubspecialtyRootBonus(state.subspecialty);
    
    const rootComplexity = baseComplexity + contentBonus + citationBonus + subspecialtyBonus;
    
    // Subspecialty-specific root patterns (matches backend)
    const subspecialtyPatterns = getSubspecialtyRootPatterns();
    const currentPattern = subspecialtyPatterns[state.subspecialty] || subspecialtyPatterns.default;
    
    console.log(`🌳 Frontend Root generation: complexity=${rootComplexity}, pattern=${state.subspecialty}, seed=${articleSeed}`);
    console.log(`   📊 Evidence: ${evidenceStrength.toFixed(2)}, Citations: ${citationsCount}, Words: ${wordCount}`);
    console.log(`   🔧 Base: ${baseComplexity}, Content: +${contentBonus}, Citation: +${citationBonus}, Subspecialty: +${subspecialtyBonus}`);
    
    for (let i = 0; i < rootComplexity; i++) {
      // Base angle with subspecialty-specific spread (matches backend)
      const baseAngleRange = currentPattern.angle_range;
      const baseAngle = (i / rootComplexity) * baseAngleRange + currentPattern.start_angle;
      
      // Add randomization based on emotional journey (matches backend)
      const emotionalVariation = getEmotionalRootVariation(state);
      const angleNoise = (seededRandom() - 0.5) * currentPattern.randomness_factor;
      const finalAngle = baseAngle + emotionalVariation + angleNoise;
      
      // Variable length based on evidence strength and randomness (matches backend)
      const baseLength = 50 + (evidenceStrength * 100);
      const lengthVariation = (seededRandom() - 0.5) * 40; // ±20px variation
      const finalLength = baseLength + lengthVariation;
      
      // Variable thickness with randomness (matches backend)
      const baseThickness = 1 + (evidenceStrength * 3);
      const thicknessVariation = (seededRandom() - 0.5) * 1.5; // ±0.75px variation
      const finalThickness = Math.max(0.5, baseThickness + thicknessVariation);
      
      // Color variation based on emotional state (matches backend)
      const rootEmotion = getRootEmotionalTone(i, rootComplexity);
      
      elements.push({
        type: 'andryRoot',
        x: state.canvasWidth / 2,
        y: state.canvasHeight * 0.85, // Ground level
        angle: finalAngle,
        length: finalLength,
        thickness: finalThickness,
        color: getEmotionalColor(state, rootEmotion, 0.3 + seededRandom() * 0.3),
        subspecialty_pattern: state.subspecialty,
        generation_context: {
          evidence_strength: evidenceStrength,
          root_complexity: rootComplexity,
          article_seed: articleSeed,
          base_angle: baseAngle,
          emotional_variation: emotionalVariation,
          angle_noise: angleNoise,
          pattern_signature: `root_${rootComplexity}_${state.subspecialty}_${articleSeed}`
        },
        branches: generateRootBranches(finalAngle, finalLength * 0.7, finalThickness * 0.8, 2, seededRandom)
      });
    }
    
    return elements;
  };

  // Helper functions for root generation consistency (matches backend)
  const hashString = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  };

  const createSeededRandom = (seed) => {
    let currentSeed = seed;
    return function() {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  };

  const getSubspecialtyRootBonus = (subspecialty) => {
    const subspecialtyBonuses = {
      sportsMedicine: 1,  // Moderate complexity
      shoulderElbow: 2,   // Higher complexity (detailed anatomy)
      jointReplacement: 3, // Highest complexity (technical procedures)
      trauma: 2,          // Higher complexity (urgent/complex cases)
      spine: 3,           // Highest complexity (spinal anatomy)
      handUpperExtremity: 2, // Higher complexity (fine motor)
      footAnkle: 1        // Moderate complexity
    };
    return subspecialtyBonuses[subspecialty] || 1;
  };

  const getSubspecialtyRootPatterns = () => {
    return {
      sportsMedicine: {
        angle_range: 160,  // Wide spread for athletic movement
        start_angle: 190,
        randomness_factor: 25
      },
      shoulderElbow: {
        angle_range: 140,  // Focused on upper anatomy
        start_angle: 200,
        randomness_factor: 20
      },
      jointReplacement: {
        angle_range: 120,  // Precise, surgical pattern
        start_angle: 210,
        randomness_factor: 15
      },
      trauma: {
        angle_range: 180,  // Chaotic, wide spread
        start_angle: 180,
        randomness_factor: 35
      },
      spine: {
        angle_range: 100,  // Narrow, vertical focus
        start_angle: 220,
        randomness_factor: 10
      },
      handUpperExtremity: {
        angle_range: 130,  // Detailed, precise
        start_angle: 205,
        randomness_factor: 18
      },
      footAnkle: {
        angle_range: 150,  // Ground-focused spread
        start_angle: 195,
        randomness_factor: 22
      },
      default: {
        angle_range: 150,
        start_angle: 195,
        randomness_factor: 20
      }
    };
  };

  const getEmotionalRootVariation = (state) => {
    // Use dominant emotion to influence root spread (matches backend)
    const dominant = state.emotionalJourney.dominantEmotion || 'confidence';
    
    const emotionalVariations = {
      confidence: 0,        // Stable, no variation
      healing: -5,          // Slight inward focus
      breakthrough: 10,     // Outward expansion
      hope: 5,              // Moderate outward
      tension: 15,          // Wide, chaotic spread
      uncertainty: -10      // Inward, cautious
    };
    
    const baseVariation = emotionalVariations[dominant] || 0;
    
    // Add intensity-based scaling (matches backend)
    const problemIntensity = state.emotionalJourney.problemIntensity || 0;
    const intensityFactor = (problemIntensity / 10.0) * 5; // Scale to ±5 degrees
    
    return baseVariation + intensityFactor;
  };

  const getRootEmotionalTone = (rootIndex, totalRoots) => {
    // Map root position to emotional spectrum (matches backend)
    const positionRatio = rootIndex / Math.max(totalRoots - 1, 1);
    
    // Create emotional gradient across roots
    if (positionRatio < 0.2) {
      return 'confidence';      // Center roots: stable
    } else if (positionRatio < 0.4) {
      return 'healing';         // Inner roots: healing
    } else if (positionRatio < 0.6) {
      return 'breakthrough';    // Mid roots: innovation
    } else if (positionRatio < 0.8) {
      return 'hope';           // Outer roots: aspiration
    } else {
      return 'uncertainty';     // Edge roots: exploration
    }
  };

  // Enhanced root branches generation with seeded randomness
  const generateRootBranches = (parentAngle, maxLength, maxThickness, depth, seededRandom) => {
    if (depth <= 0) return [];
    
    const branches = [];
    const numBranches = Math.floor(seededRandom() * 3) + 1;
    
    for (let i = 0; i < numBranches; i++) {
      const angleOffset = (seededRandom() - 0.5) * 60;
      branches.push({
        angle: parentAngle + angleOffset,
        length: maxLength * (0.5 + seededRandom() * 0.5),
        thickness: maxThickness * (0.5 + seededRandom() * 0.5),
        branches: generateRootBranches(parentAngle + angleOffset, maxLength * 0.5, maxThickness * 0.5, depth - 1, seededRandom)
      });
    }
    
    return branches;
  };

  // Enhanced manual algorithm implementation - generateTreeStructure with better content detection
  const generateTreeStructure = (state) => {
    const elements = [];
    
    // Enhanced content section detection (matches backend)
    let contentSections = state.articleData.content_sections || [];
    if (!contentSections || contentSections.length < 3) {
      contentSections = generateEnhancedSections(state);
    }
    
    // Add statistical sections if we have significant statistical data
    const statisticalData = state.articleData.statistical_data || [];
    if (statisticalData.length > 3) {
      contentSections = contentSections.concat(generateStatisticalSections(statisticalData));
    }
    
    // Add research sections if we have significant citations
    const researchCitations = state.articleData.research_citations || [];
    if (researchCitations.length > 5) {
      contentSections = contentSections.concat(generateResearchSections(researchCitations));
    }
    
    // Limit total sections to prevent overcrowding but allow more branches
    contentSections = contentSections.slice(0, 12); // Increased from 6 to 12
    const trunkHeight = Math.min(400, contentSections.length * 35 + 120); // Increased height

    console.log(`🌿 Frontend generating tree with ${contentSections.length} content sections`);
    console.log(`   📋 Section sources: ${contentSections.map(s => s.source || 'content')}`);
    console.log(`   📏 Trunk height: ${trunkHeight}, Section count: ${contentSections.length}`);

    // Main trunk (article spine) - Enhanced
    elements.push({
      type: 'andryTrunk',
      x: state.canvasWidth / 2,
      y: state.canvasHeight * 0.85,
      height: trunkHeight,
      thickness: 8 + (state.articleData.technical_density * 5),
      color: state.brandColors.primary,
      healing: 0.6
    });

    // Generate branches for each major content section - ENHANCED with more branching
    contentSections.forEach((section, index) => {
      const branchY = state.canvasHeight * 0.85 - (index + 1) * (trunkHeight / contentSections.length);
      const branchSide = index % 2 === 0 ? -1 : 1; // Alternate sides
    
      // Enhanced angle calculation with more variation (matches backend)
      const baseAngle = branchSide === -1 ? 140 : 40; // Left: 110-170°, Right: 10-70°
      const angleVariation = Math.random() * 40; // Increased randomness
      const subspecialtyModifier = getSubspecialtyBranchModifier(state.subspecialty);
      const finalAngle = baseAngle + (branchSide * angleVariation) + subspecialtyModifier;
    
      // Enhanced length and thickness based on section importance
      const baseLength = 70 + section.importance * 50; // Increased base length
      const complexityBonus = section.complexity * 30;
      const finalLength = baseLength + complexityBonus;
      
      const baseThickness = 4 + section.complexity * 3;
    
      // Generate main branch
      const branch = {
        type: 'andryBranch',
        x: state.canvasWidth / 2,
        y: branchY,
        angle: finalAngle,
        length: finalLength,
        thickness: baseThickness,
        color: getEmotionalColor(state, section.emotionalTone, 0.6),
        emotionalTone: section.emotionalTone,
        section_source: section.source || 'content',
        generation_context: {
          section_importance: section.importance,
          section_complexity: section.complexity,
          branch_index: index
        }
      };
    
      elements.push(branch);
    
      // Enhanced sub-branch generation - more aggressive (matches backend)
      const evidenceStrength = state.articleData.evidence_strength || 0.5;
      const technicalDensity = state.articleData.technical_density || 0.5;
      
      // Multiple criteria for sub-branch generation
      const shouldBranchComplexity = finalLength > 70 && section.complexity > 0.6;
      const shouldBranchEvidence = evidenceStrength > 0.6 && Math.random() > 0.3;
      const shouldBranchTechnical = technicalDensity > 0.7 && Math.random() > 0.4;
      const shouldBranchImportance = section.importance > 0.8 && Math.random() > 0.5;
      
      if (shouldBranchComplexity || shouldBranchEvidence || shouldBranchTechnical || shouldBranchImportance) {
        // Generate 1-3 sub-branches instead of just 1
        let numSubBranches = 1;
        if (shouldBranchComplexity && shouldBranchEvidence) numSubBranches = 2;
        if (shouldBranchTechnical && shouldBranchImportance) numSubBranches = 3;
        
        for (let i = 0; i < numSubBranches; i++) {
          // Position sub-branches at different points along main branch
          const branchPosition = 0.4 + (i * 0.2) + Math.random() * 0.2;
          const subAngle = finalAngle + (Math.random() - 0.5) * 60; // Wider angle range
          const subLength = finalLength * (0.5 + Math.random() * 0.3); // More variable length
          const subThickness = baseThickness * (0.6 + Math.random() * 0.2);
          
          // Calculate sub-branch position
          const subX = state.canvasWidth / 2 + Math.cos(finalAngle * Math.PI / 180) * finalLength * branchPosition;
          const subY = branchY + Math.sin(finalAngle * Math.PI / 180) * finalLength * branchPosition;
          
          // Vary emotional tone for sub-branches
          const subEmotions = ['confidence', 'healing', 'breakthrough', 'hope'];
          const subEmotion = Math.random() > 0.7 ? subEmotions[Math.floor(Math.random() * subEmotions.length)] : section.emotionalTone;
          
          elements.push({
            type: 'andryBranch',
            x: subX,
            y: subY,
            angle: subAngle,
            length: subLength,
            thickness: subThickness,
            color: getEmotionalColor(state, subEmotion, 0.4),
            emotionalTone: subEmotion,
            parent_branch: true,
            sub_branch_index: i,
            generation_context: {
              parent_section: section.title || 'Unknown',
              branch_criteria: {
                complexity: shouldBranchComplexity,
                evidence: shouldBranchEvidence,
                technical: shouldBranchTechnical,
                importance: shouldBranchImportance
              }
            }
          });
        }
      }
    });

    return elements;
  };

  // Enhanced section generation helper functions (matches backend)
  const generateEnhancedSections = (state) => {
    // Start with basic sections
    let sections = generateDefaultSections();
    
    // Add sections based on medical terms
    const medicalTerms = state.articleData.medical_terms || {};
    Object.entries(medicalTerms).forEach(([category, terms]) => {
      if (terms && Object.keys(terms).length > 2) { // Only if significant content
        sections.push({
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Analysis`,
          level: 2,
          importance: 0.7 + Object.keys(terms).length * 0.05,
          complexity: 0.6 + Object.keys(terms).length * 0.03,
          emotionalTone: getMedicalCategoryEmotion(category),
          source: 'medical_terms'
        });
      }
    });
    
    // Add sections based on evidence strength
    const evidenceStrength = state.articleData.evidence_strength || 0.5;
    if (evidenceStrength > 0.7) {
      sections.push({
        title: 'Evidence Review',
        level: 2,
        importance: evidenceStrength,
        complexity: 0.8,
        emotionalTone: 'confidence',
        source: 'evidence'
      });
    }
    
    return sections.slice(0, 8); // Limit to prevent overcrowding
  };

  const generateStatisticalSections = (statisticalData) => {
    const sections = [];
    
    // Group statistics by type
    const statTypes = {};
    statisticalData.forEach(stat => {
      const statType = stat.type || 'general';
      if (!statTypes[statType]) {
        statTypes[statType] = [];
      }
      statTypes[statType].push(stat);
    });
    
    // Create sections for significant statistical groups
    Object.entries(statTypes).forEach(([statType, stats]) => {
      if (stats.length >= 2) { // Only if multiple stats of this type
        const avgSignificance = stats.reduce((sum, s) => sum + (s.significance || 0.5), 0) / stats.length;
        sections.push({
          title: `${statType.charAt(0).toUpperCase() + statType.slice(1)} Analysis`,
          level: 2,
          importance: 0.6 + avgSignificance * 0.3,
          complexity: 0.7 + stats.length * 0.05,
          emotionalTone: 'breakthrough',
          source: 'statistics'
        });
      }
    });
    
    return sections.slice(0, 3); // Limit statistical sections
  };

  const generateResearchSections = (researchCitations) => {
    const sections = [];
    
    // Create sections based on citation impact
    const highImpactCitations = researchCitations.filter(c => (c.impact || 0.5) > 0.7);
    
    if (highImpactCitations.length >= 3) {
      sections.push({
        title: 'Key Research Findings',
        level: 2,
        importance: 0.9,
        complexity: 0.7 + highImpactCitations.length * 0.02,
        emotionalTone: 'hope',
        source: 'research'
      });
    }
    
    if (researchCitations.length >= 10) {
      sections.push({
        title: 'Literature Review',
        level: 2,
        importance: 0.8,
        complexity: 0.6,
        emotionalTone: 'confidence',
        source: 'research'
      });
    }
    
    return sections.slice(0, 2); // Limit research sections
  };

  const getMedicalCategoryEmotion = (category) => {
    const categoryEmotions = {
      procedures: 'breakthrough',
      anatomy: 'confidence',
      outcomes: 'healing',
      research: 'hope'
    };
    return categoryEmotions[category] || 'confidence';
  };

  const getSubspecialtyBranchModifier = (subspecialty) => {
    const subspecialtyModifiers = {
      sportsMedicine: 5,      // Slightly outward for movement
      shoulderElbow: -3,      // Slightly inward for focus
      jointReplacement: 0,    // Precise, no modifier
      trauma: 8,              // More chaotic, outward
      spine: -5,              // Inward, careful
      handUpperExtremity: 2,  // Slightly outward for dexterity
      footAnkle: 3            // Slightly outward for ground contact
    };
    return subspecialtyModifiers[subspecialty] || 0;
  };

  // EXACT manual algorithm implementation - generateDefaultSections (ENHANCED)
  const generateDefaultSections = () => {
    return [
      {
        title: 'Introduction',
        level: 2,
        importance: 0.5,
        complexity: 0.5,
        emotionalTone: 'confidence'
      },
      {
        title: 'Main Content',
        level: 2,
        importance: 0.8,
        complexity: 0.7,
        emotionalTone: 'healing'
      },
      {
        title: 'Results',
        level: 2,
        importance: 0.9,
        complexity: 0.6,
        emotionalTone: 'breakthrough'
      },
      {
        title: 'Conclusion',
        level: 2,
        importance: 0.6,
        complexity: 0.4,
        emotionalTone: 'hope'
      }
    ];
  };

  // EXACT manual algorithm implementation - generateHealingElements
  const generateHealingElements = (state) => {
    const elements = [];
    const healingPotential = state.emotionalJourney.healingPotential || 0.5;
    const numElements = Math.floor(healingPotential * 15) + 5;
    
    for (let i = 0; i < numElements; i++) {
      // Healing particles that emanate from the tree - EXACT manual algorithm
      elements.push({
        type: 'healingParticle',
        x: state.canvasWidth / 2 + (Math.random() - 0.5) * 200,
        y: state.canvasHeight * 0.3 + Math.random() * 200,
        size: 3 + Math.random() * 8,
        color: getEmotionalColor(state, 'healing', 0.6),
        pulseRate: 0.5 + Math.random() * 1.5,
        growthDirection: {
          x: (Math.random() - 0.5) * 2,
          y: -Math.random() * 2 // Generally upward
        }
      });
    }
    
    // Healing aura around the tree - EXACT manual algorithm
    elements.push({
      type: 'healingAura',
      x: state.canvasWidth / 2,
      y: state.canvasHeight * 0.6,
      radius: 100 + healingPotential * 150,
      color: getEmotionalColor(state, 'healing', 0.1),
      pulseAmplitude: healingPotential * 50
    });
    
    return elements;
  };

  // EXACT manual algorithm implementation - generateDataFlows
  const generateDataFlows = (state) => {
    const elements = [];
    const statistics = state.articleData.statistical_data || [];
    
    statistics.forEach((stat, index) => {
      const flowPath = generateFlowPath(stat, state);
      
      elements.push({
        type: 'dataFlow',
        path: flowPath,
        thickness: 1 + stat.significance * 2,
        color: getStatisticColor(stat),
        opacity: 0.4 + stat.significance * 0.4,
        flowSpeed: 0.5 + stat.significance,
        particleCount: Math.floor(stat.significance * 5) + 2
      });
    });
    
    return elements;
  };

  // EXACT manual algorithm implementation - generateFlowPath
  const generateFlowPath = (stat, state) => {
    const startX = Math.random() * state.canvasWidth;
    const startY = Math.random() * state.canvasHeight;
    const endX = state.canvasWidth / 2 + (Math.random() - 0.5) * 200;
    const endY = state.canvasHeight * 0.5;
    
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      control1: { 
        x: startX + (endX - startX) * 0.3, 
        y: startY + (Math.random() - 0.5) * 100 
      },
      control2: { 
        x: startX + (endX - startX) * 0.7, 
        y: endY + (Math.random() - 0.5) * 100 
      }
    };
  };

  // EXACT manual algorithm implementation - generateEmotionalFields
  const generateEmotionalFields = (state) => {
    const elements = [];
    const emotions = Object.keys(state.emotionalJourney);
    
    emotions.forEach((emotion, index) => {
      if (emotion === 'dominantEmotion') return;
      
      const intensity = state.emotionalJourney[emotion] || 0;
      if (intensity < 0.01) return; // Skip very low intensity emotions
      
      const fieldSize = 50 + intensity * 200;
      const x = state.canvasWidth * (0.2 + index * 0.15);
      const y = state.canvasHeight * (0.3 + Math.random() * 0.4);
      
      elements.push({
        type: 'emotionalField',
        emotion: emotion,
        x: x,
        y: y,
        size: fieldSize,
        intensity: intensity,
        color: getEmotionalColor(state, emotion, intensity * 0.3),
        morphSpeed: 0.2 + intensity * 0.8
      });
    });
    
    return elements;
  };

  // EXACT manual algorithm implementation - generateResearchConstellation
  const generateResearchConstellation = (state) => {
    const elements = [];
    const citations = state.articleData.research_citations || [];
    const constellationCenter = {
      x: state.canvasWidth * 0.8,
      y: state.canvasHeight * 0.2
    };
    
    citations.forEach((citation, index) => {
      const angle = (index / citations.length) * 360;
      const distance = 30 + citation.importance * 80;
      
      const x = constellationCenter.x + Math.cos(angle * Math.PI / 180) * distance;
      const y = constellationCenter.y + Math.sin(angle * Math.PI / 180) * distance;
      
      elements.push({
        type: 'researchStar',
        x: x,
        y: y,
        size: 2 + citation.impact * 4,
        color: getEmotionalColor(state, 'confidence', 0.8),
        twinkleRate: 0.5 + citation.impact,
        connections: generateStarConnections(x, y, citations, index)
      });
    });
    
    return elements;
  };

  // EXACT manual algorithm implementation - generateStarConnections
  const generateStarConnections = (x, y, allCitations, currentIndex) => {
    const connections = [];
    const maxConnections = 3;
    
    for (let i = 0; i < Math.min(maxConnections, allCitations.length); i++) {
      if (i !== currentIndex && Math.random() > 0.5) {
        const targetIndex = (currentIndex + i + 1) % allCitations.length;
        connections.push(targetIndex);
      }
    }
    
    return connections;
  };

  // EXACT manual algorithm implementation - generateAtmosphericElements
  const generateAtmosphericElements = (state) => {
    const elements = [];
    // Atmospheric particles based on article complexity - EXACT manual algorithm
    const complexity = state.articleData.technical_density || 0.5;
    const particleCount = Math.floor(complexity * 100) + 20;
    
    for (let i = 0; i < particleCount; i++) {
      elements.push({
        type: 'atmosphericParticle',
        x: Math.random() * state.canvasWidth,
        y: Math.random() * state.canvasHeight,
        size: 0.5 + Math.random() * 2,
        color: state.brandColors.primary,
        opacity: 0.1 + Math.random() * 0.2,
        driftSpeed: 0.1 + Math.random() * 0.5,
        driftDirection: Math.random() * 360
      });
    }
    
    // Subtle grid representing medical precision - EXACT manual algorithm
    elements.push({
      type: 'precisionGrid',
      spacing: 30 + complexity * 20,
      opacity: 0.05 + complexity * 0.1,
      color: state.brandColors.secondary
    });
    
    return elements;
  };

  // EXACT manual algorithm implementation - generateBackgroundGradient
  const generateBackgroundGradient = (state) => {
    const subspecialtyGradients = {
      sportsMedicine: { center: '#e8f5e8', edge: '#d4edda' },
      shoulderElbow: { center: '#e3f2fd', edge: '#bbdefb' },
      jointReplacement: { center: '#f8f9fa', edge: '#e9ecef' },
      trauma: { center: '#fff3cd', edge: '#ffeaa7' },
      spine: { center: '#e7e3ff', edge: '#d1c7ff' },
      handUpperExtremity: { center: '#e0f7fa', edge: '#b2ebf2' },
      footAnkle: { center: '#f1f8e9', edge: '#dcedc8' }
    };
    
    return subspecialtyGradients[state.subspecialty] || subspecialtyGradients.sportsMedicine;
  };

  // EXACT manual algorithm implementation - renderVisualElement
  const renderVisualElement = (element, index, artworkId, state) => {
    const key = `element-${element.type}-${index}`;
    
    switch(element.type) {
      case 'precisionGrid':
        return renderPrecisionGrid(element, key, state);
      case 'atmosphericParticle':
        return renderAtmosphericParticle(element, key);
      case 'emotionalField':
        return renderEmotionalField(element, key, artworkId);
      case 'healingAura':
        return renderHealingAura(element, key, artworkId);
      case 'andryRoot':
        return renderAndryRoot(element, key);
      case 'andryTrunk':
        return renderAndryTrunk(element, key);
      case 'andryBranch':
        return renderAndryBranch(element, key);
      case 'dataFlow':
        return renderDataFlow(element, key);
      case 'healingParticle':
        return renderHealingParticle(element, key);
      case 'researchStar':
        return renderResearchStar(element, key);
      default:
        return null;
    }
  };

  // EXACT manual algorithm rendering functions
  const renderPrecisionGrid = (element, key, state) => {
    const lines = [];
    
    // Vertical lines
    for (let x = 0; x <= state.canvasWidth; x += element.spacing) {
      lines.push(
        <line
          key={`${key}-v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={state.canvasHeight}
          stroke={element.color}
          strokeWidth="0.5"
          opacity={element.opacity}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= state.canvasHeight; y += element.spacing) {
      lines.push(
        <line
          key={`${key}-h-${y}`}
          x1={0}
          y1={y}
          x2={state.canvasWidth}
          y2={y}
          stroke={element.color}
          strokeWidth="0.5"
          opacity={element.opacity}
        />
      );
    }
    
    return <g key={key}>{lines}</g>;
  };

  const renderAtmosphericParticle = (element, key) => (
    <motion.circle
      key={key}
      cx={element.x}
      cy={element.y}
      r={element.size}
      fill={element.color}
      opacity={element.opacity}
      animate={{
        x: [element.x, element.x + Math.cos(element.driftDirection * Math.PI / 180) * 20, element.x],
        y: [element.y, element.y + Math.sin(element.driftDirection * Math.PI / 180) * 20, element.y]
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const renderEmotionalField = (element, key, artworkId) => (
    <motion.ellipse
      key={key}
      cx={element.x}
      cy={element.y}
      rx={element.size}
      ry={element.size * 0.8}
      fill={element.color}
      opacity={element.intensity * 0.3}
      filter={`url(#blur-${artworkId})`}
      animate={{
        rx: [element.size, element.size * 1.2, element.size],
        ry: [element.size * 0.8, element.size * 0.96, element.size * 0.8]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: Math.random() * 2,
        ease: "easeInOut"
      }}
    />
  );

  const renderHealingAura = (element, key, artworkId) => (
    <motion.circle
      key={key}
      cx={element.x}
      cy={element.y}
      r={element.radius}
      fill={`url(#healingGradient-${artworkId})`}
      opacity="0.5"
      animate={{
        r: [element.radius, element.radius + element.pulseAmplitude, element.radius]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const renderAndryRoot = (element, key) => {
    const endX = element.x + Math.cos(element.angle * Math.PI / 180) * element.length;
    const endY = element.y + Math.sin(element.angle * Math.PI / 180) * element.length;
    const controlX = element.x + Math.cos(element.angle * Math.PI / 180) * element.length * 0.5;
    const controlY = element.y + Math.sin((element.angle + 20) * Math.PI / 180) * element.length * 0.5;
    
    const path = `M ${element.x} ${element.y} Q ${controlX} ${controlY} ${endX} ${endY}`;
    
    return (
      <motion.path
        key={key}
        d={path}
        stroke={element.color}
        strokeWidth={element.thickness}
        fill="none"
        strokeLinecap="round"
        opacity={0.6}
        animate={{
          strokeDasharray: ["0,20", "20,0", "0,20"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    );
  };

  const renderAndryTrunk = (element, key) => (
    <motion.rect
      key={key}
      x={element.x - element.thickness / 2}
      y={element.y - element.height}
      width={element.thickness}
      height={element.height}
      fill={element.color}
      rx={element.thickness / 4}
      animate={{
        height: [element.height, element.height * 1.02, element.height]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const renderAndryBranch = (element, key) => {
    // Convert angle to radians and calculate end position
    const angleRad = element.angle * Math.PI / 180;
    const endX = element.x + Math.cos(angleRad) * element.length;
    const endY = element.y + Math.sin(angleRad) * element.length;
  
    // Add slight curve to branches for more natural appearance
    const controlX = element.x + Math.cos(angleRad) * element.length * 0.5;
    const controlY = element.y + Math.sin(angleRad - 0.1) * element.length * 0.5;
  
    const d = `M ${element.x} ${element.y} Q ${controlX} ${controlY} ${endX} ${endY}`;
  
    return (
      <motion.path
        key={key}
        d={d}
        stroke={element.color}
        strokeWidth={element.thickness}
        fill="none"
        strokeLinecap="round"
        animate={{
          strokeDasharray: ["0,0", `${element.length/4},${element.length/4}`, "0,0"],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2
        }}
      />
    );
  };

  // Enhanced section detection for frontend (matches backend logic)
  const detectContentSections = (params) => {
    // Try to extract from medical terms or create enhanced defaults
    const medicalTerms = params.medical_terms || {};
    const subspecialty = params.subspecialty || 'sportsMedicine';
  
    // If we have medical terms, create sections based on them
    if (Object.keys(medicalTerms).length > 0) {
      const sections = [];
    
      Object.entries(medicalTerms).forEach(([category, terms], index) => {
        if (Object.keys(terms).length > 0) {
          sections.push({
            title: category.charAt(0).toUpperCase() + category.slice(1),
            level: 2,
            importance: 0.6 + (index * 0.1),
            complexity: 0.5 + (Object.keys(terms).length * 0.05),
            emotionalTone: getCategoryEmotion(category)
          });
        }
      });
    
      if (sections.length > 0) {
        return sections.slice(0, 6); // Limit to 6 sections for visual clarity
      }
    }
  
    // Enhanced defaults based on subspecialty
    return getSubspecialtyDefaultSections(subspecialty);
  };

  const getCategoryEmotion = (category) => {
    const categoryEmotions = {
      procedures: 'breakthrough',
      anatomy: 'confidence',
      outcomes: 'healing',
      research: 'hope'
    };
    return categoryEmotions[category] || 'confidence';
  };

const getSubspecialtyDefaultSections = (subspecialty) => {
  const subspecialtySections = {
    sportsMedicine: [
      { title: 'Athletic Assessment', importance: 0.7, complexity: 0.6, emotionalTone: 'confidence' },
      { title: 'Injury Analysis', importance: 0.9, complexity: 0.8, emotionalTone: 'tension' },
      { title: 'Treatment Options', importance: 0.8, complexity: 0.7, emotionalTone: 'breakthrough' },
      { title: 'Recovery Protocol', importance: 0.9, complexity: 0.6, emotionalTone: 'healing' },
      { title: 'Return to Play', importance: 0.8, complexity: 0.5, emotionalTone: 'hope' }
    ],
    shoulderElbow: [
      { title: 'Anatomy Review', importance: 0.6, complexity: 0.5, emotionalTone: 'confidence' },
      { title: 'Pathophysiology', importance: 0.8, complexity: 0.8, emotionalTone: 'uncertainty' },
      { title: 'Surgical Techniques', importance: 0.9, complexity: 0.9, emotionalTone: 'breakthrough' },
      { title: 'Rehabilitation', importance: 0.8, complexity: 0.6, emotionalTone: 'healing' },
      { title: 'Outcomes', importance: 0.7, complexity: 0.5, emotionalTone: 'hope' }
    ],
    jointReplacement: [
      { title: 'Patient Selection', importance: 0.8, complexity: 0.6, emotionalTone: 'confidence' },
      { title: 'Implant Design', importance: 0.9, complexity: 0.9, emotionalTone: 'breakthrough' },
      { title: 'Surgical Approach', importance: 0.9, complexity: 0.8, emotionalTone: 'tension' },
      { title: 'Long-term Outcomes', importance: 0.8, complexity: 0.7, emotionalTone: 'healing' }
    ],
    // Add more subspecialty-specific sections as needed
  };
  
  const sections = subspecialtySections[subspecialty] || subspecialtySections.sportsMedicine;
  
  return sections.map(section => ({
    ...section,
    title: section.title,
    level: 2
  }));
};

  const renderDataFlow = (element, key) => {
    const d = `M ${element.path.start.x} ${element.path.start.y} 
               C ${element.path.control1.x} ${element.path.control1.y},
                 ${element.path.control2.x} ${element.path.control2.y},
                 ${element.path.end.x} ${element.path.end.y}`;
    
    return (
      <motion.path
        key={key}
        d={d}
        stroke={element.color}
        strokeWidth={element.thickness}
        fill="none"
        opacity={element.opacity}
        animate={{
          strokeDasharray: ["0,100", "100,0", "0,100"],
        }}
        transition={{
          duration: 4 + element.flowSpeed,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    );
  };

  const renderHealingParticle = (element, key) => (
    <motion.g key={key}>
      {/* Glow effect */}
      <motion.circle
        cx={element.x}
        cy={element.y}
        r={element.size * 2}
        fill={element.color}
        opacity="0.2"
        filter={`url(#blur-${artwork.id})`}
        animate={{
          r: [element.size * 2, element.size * 3, element.size * 2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: element.pulseRate * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {/* Main particle */}
      <motion.circle
        cx={element.x}
        cy={element.y}
        r={element.size}
        fill={element.color}
        opacity="0.8"
        animate={{
          r: [element.size, element.size * 1.5, element.size],
          x: [element.x, element.x + element.growthDirection.x * 10, element.x],
          y: [element.y, element.y + element.growthDirection.y * 10, element.y]
        }}
        transition={{
          duration: element.pulseRate,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.g>
  );

  const renderResearchStar = (element, key) => {
    const starPath = createStarPath(element.x, element.y, element.size, element.size * 0.5, 5);
    
    return (
      <motion.g key={key}>
        {/* Star glow */}
        <motion.circle
          cx={element.x}
          cy={element.y}
          r={element.size * 3}
          fill={element.color}
          opacity="0.2"
          filter={`url(#blur-${artwork.id})`}
          animate={{
            r: [element.size * 3, element.size * 4, element.size * 3],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
        {/* Main star */}
        <motion.path
          d={starPath}
          fill={element.color}
          opacity="0.9"
          animate={{
            opacity: [0.9, 1, 0.9],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: element.twinkleRate * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Connection lines */}
        {element.connections.map((connectionIndex, connIndex) => (
          <motion.line
            key={`${key}-conn-${connIndex}`}
            x1={element.x}
            y1={element.y}
            x2={element.x + Math.cos(connectionIndex * 60 * Math.PI / 180) * 30}
            y2={element.y + Math.sin(connectionIndex * 60 * Math.PI / 180) * 30}
            stroke={element.color}
            strokeWidth="1"
            opacity="0.3"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: connIndex * 0.5
            }}
          />
        ))}
      </motion.g>
    );
  };

  // EXACT manual algorithm helper functions
  const getEmotionalColor = (state, emotion, intensity = 1.0) => {
    const palette = state.emotionalPalettes[emotion] || state.emotionalPalettes.confidence;
    const colorIndex = Math.min(Math.floor(intensity * palette.length), palette.length - 1);
    return palette[colorIndex];
  };

  const getStatisticColor = (stat) => {
    const colorMap = {
      percentages: '#e74c3c',
      pValues: '#f39c12',
      sampleSizes: '#27ae60',
      followUp: '#3498db',
      outcomes: '#9b59b6',
      confidenceIntervals: '#1abc9c'
    };
    return colorMap[stat.type] || '#95a5a6';
  };

  const createStarPath = (cx, cy, outerRadius, innerRadius, points) => {
    let path = '';
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      path += (i === 0 ? 'M' : 'L') + x + ',' + y;
    }
    return path + 'Z';
  };

  const generateUniqueID = (params) => {
    const timestamp = new Date();
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const day = String(timestamp.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `AKX-${year}-${month}${day}-${random}`;
  };

  // SVG Download functionality removed - only available in admin dashboard
  // const handleDownloadSVG = () => { ... }

  // Loading state
  if (!svgContent) {
    return (
      <div 
        className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg w-full h-full border border-gray-300"
        style={{ width, height }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"
          />
          <p className="text-sm text-gray-700 font-medium">Processing Manual Algorithm...</p>
          <p className="text-xs text-gray-500 mt-1">{artwork?.title || 'Loading artwork...'}</p>
          
          {/* Debug info in loading state */}
          {debugInfo && (
            <div className="mt-3 text-xs text-gray-400 space-y-1">
              <div>Data: {Object.values(debugInfo.dataAvailability).filter(Boolean).length}/6 sources</div>
              <div>Algorithm: v{debugInfo.algorithmMetrics?.evidenceStrength ? '2.0-Manual' : '1.0-Fallback'}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="manual-algorithm-artwork-container w-full h-full relative">
      {svgContent}
      
      {/* Debug overlay (only in development) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded max-w-xs opacity-0 hover:opacity-100 transition-opacity">
          <div className="font-bold mb-1">Manual Algorithm Debug</div>
          <div>Data Sources: {Object.values(debugInfo.dataAvailability).filter(Boolean).length}/6</div>
          <div>Evidence: {debugInfo.algorithmMetrics.evidenceStrength?.toFixed(2)}</div>
          <div>Emotion: {debugInfo.algorithmMetrics.dominantEmotion}</div>
          <div>Elements: {debugInfo.dataStructure.visualElementsCount}</div>
          <div>Complexity: {debugInfo.algorithmMetrics.dataComplexity?.toFixed(2)}</div>
          {debugInfo.uniquenessFactors && Object.keys(debugInfo.uniquenessFactors).length > 0 && (
            <div>Uniqueness: {Object.keys(debugInfo.uniquenessFactors).length} factors</div>
          )}
        </div>
      )}
      
      {/* Algorithm state display for debugging */}
      {algorithmState && process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 right-2 bg-blue-900/80 text-white text-xs p-2 rounded max-w-xs opacity-0 hover:opacity-100 transition-opacity">
          <div className="font-bold mb-1">Algorithm State</div>
          <div>Canvas: {algorithmState.canvasWidth}x{algorithmState.canvasHeight}</div>
          <div>Subspecialty: {algorithmState.subspecialty}</div>
          <div>Journey Keys: {Object.keys(algorithmState.emotionalJourney).length}</div>
          <div>Visual Elements: {algorithmState.visualElements.length}</div>
          <div>Evidence: {algorithmState.articleData.evidence_strength?.toFixed(2)}</div>
          <div>Technical: {algorithmState.articleData.technical_density?.toFixed(2)}</div>
        </div>
      )}

      {/* NEW: Comprehensive Metadata Overlay for Phase 2C Advanced Analytics Dashboard */}
      {artworkMetadata && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-green-900/80 text-white text-xs p-2 rounded max-w-xs opacity-0 hover:opacity-100 transition-opacity">
          <div className="font-bold mb-1">Comprehensive Metadata</div>
          <div>Signature ID: {artworkMetadata.signature_id}</div>
          <div>Pattern Complexity: {artworkMetadata.visual_characteristics?.pattern_complexity?.toFixed(2)}</div>
          <div>Element Density: {artworkMetadata.visual_characteristics?.element_density?.toFixed(2)}</div>
          <div>Color Uniqueness: {artworkMetadata.ai_analysis_data?.uniqueness_factors?.color_uniqueness?.toFixed(2)}</div>
          <div>Rendering Complexity: {artworkMetadata.rendering_complexity?.toFixed(2)}</div>
          {metadataValidation && (
            <div className="mt-1 pt-1 border-t border-green-600">
              <div>Completeness: {metadataValidation.completeness_percentage}%</div>
              <div>Fields: {metadataValidation.field_count}</div>
            </div>
          )}
        </div>
      )}

      {/* SVG Download Button removed - only available in admin dashboard */}
    </div>
  );
};

export default RealArthrokinetixArtwork;
