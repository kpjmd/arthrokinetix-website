// Updated RealArthrokinetixArtwork.js - Complete integration with manual algorithm backend
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RealArthrokinetixArtwork = ({ artwork, width = 400, height = 400 }) => {
  const [svgContent, setSvgContent] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

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
    
    // Extract data from manual algorithm output structure
    const emotionalJourney = params.emotional_journey || {};
    const emotionalMix = params.emotional_mix || {};
    const medicalTerms = params.medical_terms || {};
    const statisticalData = params.statistical_data || [];
    const researchCitations = params.research_citations || [];
    const visualElements = params.visual_elements || [];
    
    // Core algorithm values
    const evidenceStrength = params.evidence_strength || 0.5;
    const technicalDensity = params.technical_density || 0.5;
    const subspecialty = params.subspecialty || 'sportsMedicine';
    const dominantEmotion = params.dominant_emotion || 'confidence';
    
    // Debug information
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
        dominantEmotion
      },
      dataStructure: {
        emotionalJourneyKeys: Object.keys(emotionalJourney),
        emotionalMixKeys: Object.keys(emotionalMix),
        medicalTermCategories: Object.keys(medicalTerms),
        statisticsCount: statisticalData.length,
        citationsCount: researchCitations.length,
        visualElementsCount: visualElements.length
      }
    };
    
    setDebugInfo(debug);
    console.log('🔬 Manual Algorithm Debug Info:', debug);
    
    // Generate visual components using ACTUAL manual algorithm data
    const backgroundGradient = generateSubspecialtyBackground(subspecialty, dominantEmotion);
    const andryTreeElements = generateManualAndryTree(params, emotionalJourney, evidenceStrength);
    const medicalTermVisuals = generateEnhancedMedicalTermVisuals(medicalTerms, subspecialty);
    const statisticalStreams = generateStatisticalDataStreams(statisticalData, width, height);
    const researchConstellation = generateResearchConstellation(researchCitations, width, height);
    const emotionalFields = generateEmotionalFields(emotionalJourney, emotionalMix, width, height);
    const backendVisualElements = renderBackendGeneratedElements(visualElements, width, height);
    
    const svg = (
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        className="manual-algorithm-artwork w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Background gradients */}
          <radialGradient id={`bg-manual-${artwork.id}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={backgroundGradient.center} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={backgroundGradient.edge} stopOpacity="0.4"/>
          </radialGradient>
          
          {/* Emotional gradients */}
          <linearGradient id={`emotion-${artwork.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getEmotionColor(dominantEmotion)} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={getEmotionColor(dominantEmotion)} stopOpacity="0.1"/>
          </linearGradient>
          
          {/* Data flow gradients */}
          <linearGradient id={`data-flow-${artwork.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3498db" stopOpacity="0"/>
            <stop offset="50%" stopColor="#3498db" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#3498db" stopOpacity="0"/>
          </linearGradient>
          
          {/* Blur filter for atmospheric effects */}
          <filter id={`blur-${artwork.id}`}>
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill={`url(#bg-manual-${artwork.id})`} />
        
        {/* Subspecialty pattern overlay */}
        <rect 
          width="100%" 
          height="100%" 
          fill={`url(#emotion-${artwork.id})`}
          opacity="0.3"
        />

        {/* Andry Tree Structure - Core Algorithm Visualization */}
        <g className="andry-tree-manual" transform={`translate(${width/2}, ${height * 0.8})`}>
          {andryTreeElements.map((element, i) => (
            <motion.g 
              key={`andry-manual-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            >
              {element.type === 'evidence_root' && (
                <motion.path
                  d={element.path}
                  stroke={element.color}
                  strokeWidth={element.thickness}
                  fill="none"
                  opacity={element.opacity}
                  strokeLinecap="round"
                  animate={{
                    strokeDasharray: ["0,20", "20,0", "0,20"],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {element.type === 'emotional_branch' && (
                <motion.line
                  x1={0}
                  y1={element.startY}
                  x2={element.endX}
                  y2={element.endY}
                  stroke={element.color}
                  strokeWidth={element.thickness}
                  opacity={element.opacity}
                  strokeLinecap="round"
                  animate={{
                    x2: [element.endX, element.endX * 1.1, element.endX],
                    y2: [element.endY, element.endY * 1.05, element.endY]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {element.type === 'trunk' && (
                <motion.rect
                  x={-element.thickness/2}
                  y={-element.height}
                  width={element.thickness}
                  height={element.height}
                  fill={element.color}
                  opacity={element.opacity}
                  rx={element.thickness/4}
                  animate={{
                    height: [element.height, element.height * 1.02, element.height]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.g>
          ))}
        </g>

        {/* Enhanced Medical Term Networks */}
        <g className="medical-terms-manual">
          {medicalTermVisuals.map((visual, i) => (
            <motion.g 
              key={`medical-manual-${i}`}
              transform={`translate(${visual.x}, ${visual.y})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
            >
              {visual.type === 'procedure_network' && (
                <g>
                  {/* Central node */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r={visual.centralNode.radius}
                    fill={visual.color}
                    opacity="0.8"
                    animate={{
                      r: [visual.centralNode.radius, visual.centralNode.radius * 1.2, visual.centralNode.radius]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Connected nodes */}
                  {visual.nodes.map((node, nodeIndex) => (
                    <motion.circle
                      key={nodeIndex}
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={visual.color}
                      opacity="0.6"
                      animate={{
                        r: [node.radius, node.radius * 1.1, node.radius],
                        opacity: [0.6, 0.9, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: nodeIndex * 0.1
                      }}
                    />
                  ))}
                  
                  {/* Connection lines */}
                  {visual.connections.map((connection, connIndex) => (
                    <motion.line
                      key={connIndex}
                      x1={connection.x1}
                      y1={connection.y1}
                      x2={connection.x2}
                      y2={connection.y2}
                      stroke={visual.color}
                      strokeWidth="1"
                      opacity="0.4"
                      animate={{
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: connIndex * 0.2
                      }}
                    />
                  ))}
                </g>
              )}
              
              {visual.type === 'anatomy_cluster' && (
                <motion.polygon
                  points={visual.points}
                  fill={visual.color}
                  opacity="0.5"
                  stroke={visual.color}
                  strokeWidth="2"
                  animate={{
                    points: [visual.points, visual.animatedPoints, visual.points]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.g>
          ))}
        </g>

        {/* Statistical Data Streams */}
        <g className="statistical-streams-manual">
          {statisticalStreams.map((stream, i) => (
            <motion.path
              key={`stat-manual-${i}`}
              d={stream.path}
              stroke={stream.color}
              strokeWidth={stream.thickness}
              fill="none"
              opacity={stream.opacity}
              strokeLinecap="round"
              animate={{
                strokeDasharray: [`0,${stream.length}`, `${stream.length},0`, `0,${stream.length}`],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </g>

        {/* Research Citation Constellation */}
        <g className="research-constellation-manual" transform={`translate(${width * 0.85}, ${height * 0.15})`}>
          {researchConstellation.map((star, i) => (
            <motion.g key={`research-manual-${i}`}>
              {/* Main star */}
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={star.radius}
                fill="#ffffff"
                opacity="0.9"
                animate={{
                  opacity: [0.9, 1, 0.9],
                  r: [star.radius, star.radius * 1.3, star.radius]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
              
              {/* Star glow */}
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={star.radius * 2}
                fill="#ffffff"
                opacity="0.2"
                filter={`url(#blur-${artwork.id})`}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  r: [star.radius * 2, star.radius * 2.5, star.radius * 2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
              
              {/* Connection lines */}
              {star.connections.map((connection, connIndex) => (
                <motion.line
                  key={connIndex}
                  x1={star.x}
                  y1={star.y}
                  x2={connection.x}
                  y2={connection.y}
                  stroke="#ffffff"
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
          ))}
        </g>

        {/* Emotional Field Overlays */}
        <g className="emotional-fields-manual">
          {emotionalFields.map((field, i) => (
            <motion.ellipse
              key={`emotion-field-manual-${i}`}
              cx={field.x}
              cy={field.y}
              rx={field.radiusX}
              ry={field.radiusY}
              fill={field.color}
              opacity="0.1"
              filter={`url(#blur-${artwork.id})`}
              animate={{
                rx: [field.radiusX, field.radiusX * 1.2, field.radiusX],
                ry: [field.radiusY, field.radiusY * 1.2, field.radiusY],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </g>

        {/* Backend Generated Visual Elements */}
        <g className="backend-elements-manual">
          {backendVisualElements}
        </g>

        {/* Algorithm Signature */}
        <g className="algorithm-signature" transform={`translate(${width * 0.05}, ${height * 0.95})`}>
          <text
            x="0"
            y="0"
            fontSize="10"
            fill={getEmotionColor(dominantEmotion)}
            opacity="0.8"
            fontFamily="monospace"
          >
            {metadata.signature_id || `AKX-MANUAL-${artwork.id?.slice(-4)}`}
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

  // Enhanced Andry Tree generation using manual algorithm data
  const generateManualAndryTree = (params, emotionalJourney, evidenceStrength) => {
    const elements = [];
    const subspecialty = params.subspecialty || 'sportsMedicine';
    
    // Use actual emotional journey data or fallback to emotional mix
    const confidence = emotionalJourney.solutionConfidence || params.emotional_mix?.confidence || 0.5;
    const healing = emotionalJourney.healingPotential || params.emotional_mix?.healing || 0.5;
    const innovation = emotionalJourney.innovationLevel || params.emotional_mix?.breakthrough || 0.5;
    
    console.log('🌳 Manual Andry Tree Data:', {
      confidence: confidence,
      healing: healing,
      innovation: innovation,
      evidenceStrength: evidenceStrength,
      subspecialty: subspecialty
    });
    
    // Generate evidence-based root system
    const rootCount = Math.floor((evidenceStrength * 5) + 3);
    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * 180 + 180; // Spread below ground
      const radius = 30 + (evidenceStrength * 80);
      const startAngle = angle - 20;
      const endAngle = angle + 20;
      
      const startX = Math.cos(startAngle * Math.PI / 180) * radius;
      const startY = Math.sin(startAngle * Math.PI / 180) * radius;
      const endX = Math.cos(endAngle * Math.PI / 180) * radius;
      const endY = Math.sin(endAngle * Math.PI / 180) * radius;
      const midX = Math.cos(angle * Math.PI / 180) * radius * 1.2;
      const midY = Math.sin(angle * Math.PI / 180) * radius * 1.2;
      
      elements.push({
        type: 'evidence_root',
        path: `M 0,0 Q ${midX/2},${midY/2} ${midX},${midY} Q ${(midX + endX)/2},${(midY + endY)/2} ${endX},${endY}`,
        color: getSubspecialtyColor(subspecialty),
        thickness: 2 + (evidenceStrength * 3),
        opacity: 0.6 + (evidenceStrength * 0.3)
      });
    }
    
    // Generate emotional branches using actual emotional journey
    const emotionalIntensities = [
      { key: 'confidence', value: confidence, label: 'Solution Confidence' },
      { key: 'healing', value: healing, label: 'Healing Potential' },
      { key: 'innovation', value: innovation, label: 'Innovation Level' }
    ];
    
    emotionalIntensities.forEach((emotion, index) => {
      if (emotion.value > 0.1) { // Only show significant emotions
        const branchAngle = (index / emotionalIntensities.length) * 120 - 60;
        const branchLength = 40 + (emotion.value * 60);
        
        elements.push({
          type: 'emotional_branch',
          startY: -20,
          endX: Math.sin(branchAngle * Math.PI / 180) * branchLength,
          endY: -20 - Math.cos(branchAngle * Math.PI / 180) * branchLength,
          color: getEmotionColor(emotion.key),
          thickness: 2 + (emotion.value * 4),
          opacity: 0.7 + (emotion.value * 0.2),
          emotion: emotion.key,
          intensity: emotion.value
        });
      }
    });
    
    // Main trunk representing article strength
    const trunkHeight = 60 + (evidenceStrength * 80);
    elements.push({
      type: 'trunk',
      height: trunkHeight,
      thickness: 8 + (evidenceStrength * 6),
      color: '#2c3e50',
      opacity: 0.8 + (evidenceStrength * 0.2)
    });
    
    console.log(`🌿 Generated ${elements.length} manual tree elements`);
    return elements;
  };

  // Enhanced medical term visualization using actual backend data
  const generateEnhancedMedicalTermVisuals = (medicalTerms, subspecialty) => {
    const visuals = [];
    
    if (!medicalTerms || Object.keys(medicalTerms).length === 0) {
      console.log('⚠️ No manual medical terms data available');
      return [];
    }
    
    console.log('🏷️ Processing manual medical terms:', medicalTerms);
    
    Object.entries(medicalTerms).forEach(([category, terms], categoryIndex) => {
      if (!terms || Object.keys(terms).length === 0) return;
      
      const termEntries = Object.entries(terms);
      const totalSignificance = termEntries.reduce((sum, [_, termData]) => {
        return sum + (termData.significance || termData.count || 1);
      }, 0);
      
      console.log(`📊 Category ${category}: ${termEntries.length} terms, significance: ${totalSignificance}`);
      
      const x = 80 + (categoryIndex * 120);
      const y = 100 + (categoryIndex * 50);
      
      if (category === 'procedures') {
        // Create interconnected network for procedures
        const nodeCount = Math.min(termEntries.length, 6);
        const centralRadius = 15 + (totalSignificance * 0.3);
        const nodes = [];
        const connections = [];
        
        // Central node
        const centralNode = { radius: centralRadius };
        
        // Surrounding nodes
        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * 360;
          const distance = 25 + (totalSignificance * 0.2);
          const nodeRadius = 5 + (totalSignificance * 0.1);
          
          const nodeX = Math.cos(angle * Math.PI / 180) * distance;
          const nodeY = Math.sin(angle * Math.PI / 180) * distance;
          
          nodes.push({ x: nodeX, y: nodeY, radius: nodeRadius });
          connections.push({ x1: 0, y1: 0, x2: nodeX, y2: nodeY });
        }
        
        visuals.push({
          type: 'procedure_network',
          x: x,
          y: y,
          centralNode: centralNode,
          nodes: nodes,
          connections: connections,
          color: getCategoryColor(category),
          significance: totalSignificance
        });
        
      } else if (category === 'anatomy') {
        // Create clustered polygon for anatomy terms
        const sides = Math.min(termEntries.length + 3, 8);
        const radius = 12 + (totalSignificance * 0.3);
        const points = generatePolygonPoints(0, 0, sides, radius);
        const animatedPoints = generatePolygonPoints(0, 0, sides, radius + 3);
        
        visuals.push({
          type: 'anatomy_cluster',
          x: x,
          y: y,
          points: points,
          animatedPoints: animatedPoints,
          color: getCategoryColor(category),
          significance: totalSignificance
        });
      }
    });
    
    console.log(`🎨 Generated ${visuals.length} enhanced medical visuals`);
    return visuals;
  };

  // Statistical data streams using actual backend statistics
  const generateStatisticalDataStreams = (statisticalData, width, height) => {
    if (!statisticalData || statisticalData.length === 0) {
      console.log('⚠️ No manual statistical data available');
      return [];
    }
    
    console.log('📈 Processing manual statistical data:', statisticalData);
    
    return statisticalData.map((stat, index) => {
      const startX = 50 + (index * 60);
      const startY = height * 0.25;
      const endX = width - 100;
      const endY = height * 0.75 + (index * 30);
      const midX = (startX + endX) / 2;
      const midY = startY + (Math.sin(index * 2) * 40);
      
      const significance = stat.significance || 0.5;
      const thickness = Math.max(1, significance * 5);
      const opacity = 0.3 + (significance * 0.5);
      const pathLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      
      return {
        path: `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`,
        color: getStatisticTypeColor(stat.type),
        thickness: thickness,
        opacity: opacity,
        significance: significance,
        length: pathLength,
        statType: stat.type,
        value: stat.value
      };
    });
  };

  // Research constellation using actual citations
  const generateResearchConstellation = (researchCitations, width, height) => {
    if (!researchCitations || researchCitations.length === 0) {
      console.log('⚠️ No manual research citations available');
      return [];
    }
    
    console.log('🔗 Processing manual research citations:', researchCitations);
    
    const stars = [];
    const starCount = Math.min(researchCitations.length, 8);
    
    for (let i = 0; i < starCount; i++) {
      const citation = researchCitations[i];
      const angle = (i / starCount) * 360;
      const radius = 25 + (citation.importance * 40);
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      
      const connections = [];
      // Connect to nearby stars
      for (let j = 0; j < starCount; j++) {
        if (j !== i && Math.abs(i - j) <= 2) {
          const connectAngle = (j / starCount) * 360;
          const connectRadius = 25 + (researchCitations[j]?.importance || 0.5) * 40;
          connections.push({
            x: Math.cos(connectAngle * Math.PI / 180) * connectRadius,
            y: Math.sin(connectAngle * Math.PI / 180) * connectRadius
          });
        }
      }
      
      stars.push({
        x: x,
        y: y,
        radius: 2 + (citation.importance * 4),
        connections: connections,
        importance: citation.importance,
        impact: citation.impact
      });
    }
    
    return stars;
  };

  // Emotional fields using actual emotional journey data
  const generateEmotionalFields = (emotionalJourney, emotionalMix, width, height) => {
    const fields = [];
    
    // Prefer emotional journey data over emotional mix
    const useJourney = Object.keys(emotionalJourney).length > 0;
    console.log(`💭 Using ${useJourney ? 'emotional journey' : 'emotional mix'} data for fields`);
    
    if (useJourney) {
      // Map emotional journey keys to standard emotions
      const journeyMapping = [
        { key: 'problemIntensity', emotion: 'tension', multiplier: 1/1000 },
        { key: 'solutionConfidence', emotion: 'confidence', multiplier: 1/1000 },
        { key: 'innovationLevel', emotion: 'breakthrough', multiplier: 1/1000 },
        { key: 'healingPotential', emotion: 'healing', multiplier: 1/1000 },
        { key: 'uncertaintyLevel', emotion: 'uncertainty', multiplier: 1/1000 }
      ];
      
      journeyMapping.forEach((mapping, index) => {
        const rawValue = emotionalJourney[mapping.key] || 0;
        const intensity = rawValue * mapping.multiplier;
        
        if (intensity > 0.1) {
          const x = (width / 6) + (index * (width / 6));
          const y = height * 0.4 + (Math.sin(index * 2) * 30);
          const radiusX = 25 + (intensity * 60);
          const radiusY = 15 + (intensity * 40);
          
          fields.push({
            x: x,
            y: y,
            radiusX: radiusX,
            radiusY: radiusY,
            color: getEmotionColor(mapping.emotion),
            emotion: mapping.emotion,
            intensity: intensity
          });
        }
      });
    } else if (emotionalMix && Object.keys(emotionalMix).length > 0) {
      // Use emotional mix as fallback
      Object.entries(emotionalMix).forEach(([emotion, intensity], index) => {
        if (intensity > 0.1) {
          const x = (width / 6) + (index * (width / 6));
          const y = height * 0.4 + (Math.sin(index * 2) * 30);
          const radiusX = 25 + (intensity * 60);
          const radiusY = 15 + (intensity * 40);
          
          fields.push({
            x: x,
            y: y,
            radiusX: radiusX,
            radiusY: radiusY,
            color: getEmotionColor(emotion),
            emotion: emotion,
            intensity: intensity
          });
        }
      });
    }
    
    console.log(`🌈 Generated ${fields.length} emotional fields`);
    return fields;
  };

  // Render backend-generated visual elements
  const renderBackendGeneratedElements = (visualElements, width, height) => {
    if (!visualElements || visualElements.length === 0) {
      console.log('⚠️ No backend visual elements available');
      return [];
    }
    
    console.log('🎭 Rendering backend visual elements:', visualElements.length);
    
    return visualElements.map((element, index) => {
      const key = `backend-element-${index}`;
      
      if (element.type === 'andryRoot') {
        // Backend root elements
        const endX = Math.cos(element.angle * Math.PI / 180) * element.length;
        const endY = Math.sin(element.angle * Math.PI / 180) * element.length;
        
        return (
          <motion.line
            key={key}
            x1={width/2}
            y1={height * 0.8}
            x2={(width/2) + endX}
            y2={(height * 0.8) + endY}
            stroke={element.color || '#3498db'}
            strokeWidth={element.thickness || 2}
            opacity={0.5}
            strokeLinecap="round"
            animate={{
              strokeDasharray: ["0,20", "20,0", "0,20"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: index * 0.3
            }}
          />
        );
      } else if (element.type === 'healingParticle') {
        return (
          <motion.circle
            key={key}
            cx={element.x}
            cy={element.y}
            r={element.size || 3}
            fill={element.color || '#16a085'}
            opacity={0.7}
            animate={{
              r: [(element.size || 3), (element.size || 3) * 1.5, (element.size || 3)],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        );
      } else if (element.type === 'dataFlow') {
        return (
          <motion.path
            key={key}
            d={`M ${element.startX || 0},${element.startY || 0} Q ${element.midX || 100},${element.midY || 100} ${element.endX || 200},${element.endY || 200}`}
            stroke={element.color || '#3498db'}
            strokeWidth={element.thickness || 2}
            fill="none"
            opacity={element.opacity || 0.5}
            animate={{
              strokeDasharray: ["0,50", "50,0", "0,50"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: index * 0.4
            }}
          />
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  // Helper functions
  const generateSubspecialtyBackground = (subspecialty, dominantEmotion) => {
    const backgrounds = {
      sportsMedicine: { center: '#e8f5e8', edge: '#d4edda' },
      jointReplacement: { center: '#f8f9fa', edge: '#e9ecef' },
      trauma: { center: '#fff3cd', edge: '#ffeaa7' },
      spine: { center: '#e7e3ff', edge: '#d1c7ff' },
      handUpperExtremity: { center: '#e0f7fa', edge: '#b2ebf2' },
      footAnkle: { center: '#f1f8e9', edge: '#dcedc8' },
      shoulderElbow: { center: '#e3f2fd', edge: '#bbdefb' }
    };
    
    const base = backgrounds[subspecialty] || backgrounds.sportsMedicine;
    const emotionTint = getEmotionColor(dominantEmotion) + '10'; // Add transparency
    
    return {
      center: base.center,
      edge: base.edge
    };
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      hope: '#27ae60',
      tension: '#e74c3c',
      confidence: '#3498db',
      uncertainty: '#95a5a6',
      breakthrough: '#f39c12',
      healing: '#16a085'
    };
    return colors[emotion] || '#3498db';
  };

  const getSubspecialtyColor = (subspecialty) => {
    const colors = {
      sportsMedicine: '#27ae60',
      jointReplacement: '#3498db',
      trauma: '#e74c3c',
      spine: '#9b59b6',
      handUpperExtremity: '#16a085',
      footAnkle: '#f39c12',
      shoulderElbow: '#2980b9'
    };
    return colors[subspecialty] || '#3498db';
  };

  const getCategoryColor = (category) => {
    const colors = {
      procedures: '#e74c3c',
      anatomy: '#3498db',
      outcomes: '#27ae60',
      research: '#f39c12'
    };
    return colors[category] || '#95a5a6';
  };

  const getStatisticTypeColor = (statType) => {
    const colors = {
      percentages: '#e74c3c',
      pValues: '#f39c12',
      sampleSizes: '#27ae60',
      followUp: '#3498db',
      outcomes: '#9b59b6',
      confidenceIntervals: '#1abc9c'
    };
    return colors[statType] || '#95a5a6';
  };

  const generatePolygonPoints = (centerX, centerY, sides, radius) => {
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 360;
      const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
      const y = centerY + Math.sin(angle * Math.PI / 180) * radius;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

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
        </div>
      )}
    </div>
  );
};

export default RealArthrokinetixArtwork;
