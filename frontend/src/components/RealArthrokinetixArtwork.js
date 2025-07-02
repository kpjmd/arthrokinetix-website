// Updated RealArthrokinetixArtwork.js - Fixed to match new backend algorithm
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RealArthrokinetixArtwork = ({ artwork, width = 400, height = 400 }) => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    if (artwork && artwork.algorithm_parameters) {
      generateRealArtwork();
    }
  }, [artwork]);

  // FIXED: Update the generateRealArtwork function in RealArthrokinetixArtwork.js
// Replace the existing generateRealArtwork function with this corrected version

const generateRealArtwork = () => {
  const params = artwork.algorithm_parameters;
  const metadata = artwork.metadata;
  
  // Debug logging for ACTUAL data structure
  console.log('🎨 Generating artwork for:', artwork.title);
  console.log('📊 Raw algorithm parameters:', params);
  
  // FIX: Read from ACTUAL field names the backend uses
  const emotionalJourney = params?.emotional_journey || 
                           params?.emotional_data?.emotional_journey || 
                           params?.emotional_data || 
                           {};
                           
  const statistics = params?.statistics || 
                     params?.statistical_data || 
                     [];
                     
  const citations = params?.citations || 
                    params?.research_citations || 
                    [];
                    
  const medicalTerms = params?.medical_terms || {};
  const visualElements = params?.visual_elements || [];
  
  // Debug the ACTUAL data found
  console.log('🧠 Emotional journey data (FIXED):', emotionalJourney);
  console.log('🏥 Medical terms structure (FOUND):', medicalTerms);
  console.log('📈 Statistical data (FIXED):', statistics);
  console.log('🔗 Research citations (FIXED):', citations);
  console.log('🎯 Visual elements (FOUND):', visualElements);
  
  // Check what data we actually have
  const hasEmotionalJourney = emotionalJourney && Object.keys(emotionalJourney).length > 0;
  const hasMedicalTerms = medicalTerms && Object.keys(medicalTerms).length > 0;
  const hasStatistics = statistics && statistics.length > 0;
  const hasCitations = citations && citations.length > 0;
  const hasVisualElements = visualElements && visualElements.length > 0;
  
  // Try to get emotional data from multiple possible locations
  const emotionalMix = emotionalJourney?.emotional_mix || 
                       params?.emotional_mix || 
                       params?.emotional_data?.emotional_mix ||
                       {
                         hope: params?.hope || 0.5,
                         confidence: params?.confidence || 0.5,
                         healing: params?.healing || 0.5,
                         breakthrough: params?.breakthrough || 0.5,
                         tension: params?.tension || 0.3,
                         uncertainty: params?.uncertainty || 0.3
                       };
  
  console.log('📋 CORRECTED Data availability:', {
    emotionalJourney: hasEmotionalJourney,
    emotionalMix: Object.keys(emotionalMix).length > 0,
    medicalTerms: hasMedicalTerms,
    statistics: hasStatistics,
    citations: hasCitations,
    visualElements: hasVisualElements
  });

  // 1. Generate Subspecialty Background
  const background = generateSubspecialtyBackground(params?.subspecialty || 'sportsMedicine');
  
  // 2. Generate Andry Tree Structure using CORRECTED emotional data
  const andryElements = generateAndryTreeWithCorrectedData(params, emotionalJourney, emotionalMix);
  
  // 3. Generate Medical Term Visualizations using FOUND medical_terms
  const medicalVisuals = generateEnhancedMedicalTermVisuals(medicalTerms);
  
  // 4. Generate Statistical Data Streams using CORRECTED statistics
  const dataStreams = generateEnhancedStatisticalStreams(statistics);
  
  // 5. Generate Research Constellation using CORRECTED citations
  const researchStars = generateEnhancedResearchConstellation(citations);
  
  // 6. Generate Emotional Field Overlays using CORRECTED emotional data
  const emotionalFields = generateEmotionalFieldsFromCorrectedData(emotionalJourney, emotionalMix);
  
  // 7. Generate Visual Elements from backend
  const backendVisualElements = renderBackendVisualElements(visualElements);
  
  // 8. Generate Subspecialty Symbol
  const subspecialtySymbol = generateSubspecialtySymbol(params?.subspecialty, params?.dominant_emotion);

  // Rest of SVG generation code stays the same...
  const svg = (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${width} ${height}`}
      className="arthrokinetix-real-artwork w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <defs>
        <radialGradient id={`bg-${artwork.id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={background.center} stopOpacity="0.8"/>
          <stop offset="100%" stopColor={background.edge} stopOpacity="0.4"/>
        </radialGradient>
      </defs>
        
        <rect width="100%" height="100%" fill={`url(#bg-${artwork.id})`} />

        {/* Enhanced Andry Tree using CORRECTED data */}
        <g transform={`translate(${width/2}, ${height * 0.8})`}>
          {andryElements.map((element, i) => (
            <motion.g 
              key={`andry-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: i * 0.2 }}
            >
              {element.type === 'emotional_root' && (
                <motion.path
                  d={element.path}
                  stroke={element.color}
                  strokeWidth={element.thickness}
                  fill="none"
                  opacity={element.opacity}
                  animate={{
                    strokeDasharray: ["0 100", "100 0", "0 100"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {element.type === 'medical_branch' && (
                <motion.line
                  x1={0}
                  y1={element.startY}
                  x2={element.endX}
                  y2={element.endY}
                  stroke={element.color}
                  strokeWidth={element.thickness}
                  opacity={element.opacity}
                  animate={{
                    x2: [element.endX, element.endX * 1.1, element.endX],
                    y2: [element.endY, element.endY * 1.1, element.endY]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.g>
          ))}
        </g>

        {/* Enhanced Medical Term Clusters */}
        <g className="medical-terms">
          {medicalVisuals.map((cluster, i) => (
            <motion.g 
              key={`medical-${i}`}
              transform={`translate(${cluster.x}, ${cluster.y})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, delay: i * 0.3 }}
            >
              {cluster.type === 'enhanced_procedure_cluster' && cluster.points && (
                <motion.polygon
                  points={cluster.points}
                  fill={cluster.color}
                  opacity={0.4}
                  animate={{
                    points: [cluster.points, cluster.animatedPoints || cluster.points, cluster.points]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              {cluster.type === 'enhanced_anatomy_network' && (
                <g>
                  {cluster.nodes && cluster.nodes.map((node, nodeIndex) => (
                    <motion.circle
                      key={nodeIndex}
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={cluster.color}
                      opacity={0.6}
                      animate={{
                        r: [node.radius, node.radius * 1.3, node.radius],
                        opacity: [0.6, 0.9, 0.6]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: nodeIndex * 0.2
                      }}
                    />
                  ))}
                  {cluster.connections && cluster.connections.map((connection, connIndex) => (
                    <motion.line
                      key={connIndex}
                      x1={connection.x1}
                      y1={connection.y1}
                      x2={connection.x2}
                      y2={connection.y2}
                      stroke={cluster.color}
                      strokeWidth="1"
                      opacity={0.3}
                      animate={{
                        opacity: [0.3, 0.7, 0.3]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: connIndex * 0.5
                      }}
                    />
                  ))}
                </g>
              )}

              {cluster.type === 'enhanced_outcome_radial' && cluster.rayCount > 0 && (
                <g>
                  {Array.from({ length: cluster.rayCount }).map((_, rayIndex) => {
                    const rayAngle = (rayIndex / cluster.rayCount) * 360;
                    const rayEndX = Math.cos(rayAngle * Math.PI / 180) * cluster.rayLength;
                    const rayEndY = Math.sin(rayAngle * Math.PI / 180) * cluster.rayLength;
                    
                    return (
                      <motion.line
                        key={rayIndex}
                        x1="0"
                        y1="0"
                        x2={rayEndX}
                        y2={rayEndY}
                        stroke={cluster.color}
                        strokeWidth="2"
                        opacity={0.6}
                        animate={{
                          x2: [rayEndX, rayEndX * 1.3, rayEndX],
                          y2: [rayEndY, rayEndY * 1.3, rayEndY]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: rayIndex * 0.1
                        }}
                      />
                    );
                  })}
                </g>
              )}
            </motion.g>
          ))}
        </g>

        {/* Enhanced Statistical Data Streams */}
        <g className="data-streams">
          {dataStreams.map((stream, i) => (
            <motion.path
              key={`stream-${i}`}
              d={stream.path}
              stroke={stream.color}
              strokeWidth={stream.thickness}
              fill="none"
              opacity={stream.opacity}
              animate={{
                strokeDasharray: ["0 20", "20 0", "0 20"],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </g>

        {/* Enhanced Research Constellation */}
        <g className="research-constellation" transform={`translate(${width * 0.8}, ${height * 0.2})`}>
          {researchStars.map((star, i) => (
            <motion.g key={`star-${i}`}>
              <motion.circle
                cx={star.x}
                cy={star.y}
                r={star.radius}
                fill="#ffffff"
                opacity={0.8}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  r: [star.radius, star.radius * 1.2, star.radius]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            </motion.g>
          ))}
        </g>

        {/* Enhanced Emotional Field Overlays */}
        <g className="emotional-fields">
          {emotionalFields.map((field, i) => (
            <motion.ellipse
              key={`emotion-${i}`}
              cx={field.x}
              cy={field.y}
              rx={field.radiusX}
              ry={field.radiusY}
              fill={field.color}
              opacity={0.15}
              animate={{
                rx: [field.radiusX, field.radiusX * 1.2, field.radiusX],
                ry: [field.radiusY, field.radiusY * 1.2, field.radiusY],
                opacity: [0.15, 0.25, 0.15]
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

        {/* Backend Visual Elements */}
        <g className="backend-visual-elements">
          {backendVisualElements}
        </g>

        {/* Enhanced Signature Elements */}
        <g className="signature-elements" transform={`translate(${width * 0.1}, ${height * 0.9})`}>
          <text
            x="0"
            y="0"
            fontSize="8"
            fill={getEmotionColor(params?.dominant_emotion)}
            opacity={0.7}
          >
            {metadata?.signature_id || 'AKX-FIXED'}
          </text>
          {hasEmotionalJourney && (
            <text
              x="0"
              y="12"
              fontSize="6"
              fill="#666666"
              opacity={0.5}
            >
              Data-Fixed
            </text>
          )}
        </g>
      </svg>
    );

    setSvgContent(svg);
  };

// NEW: Corrected Andry Tree generation
const generateAndryTreeWithCorrectedData = (params, emotionalJourney, emotionalMix) => {
  const elements = [];
  const subspecialty = params?.subspecialty || 'sportsMedicine';
  
  // Use available emotional data with fallbacks
  const confidence = emotionalMix?.confidence || params?.confidence || 0.5;
  const healing = emotionalMix?.healing || params?.healing || 0.5;
  const innovation = emotionalMix?.breakthrough || params?.breakthrough || 0.5;
  
  console.log('🌳 Generating Corrected Andry Tree with:', {
    confidence,
    healing,
    innovation,
    subspecialty,
    dataSource: emotionalJourney ? 'emotionalJourney' : 'emotionalMix'
  });
  
  // Emotional roots using corrected confidence data
  const rootCount = Math.floor(confidence * 6) + 3;
  for (let i = 0; i < rootCount; i++) {
    const angle = (i / rootCount) * 180 + 180;
    const radius = 40 + (confidence * 80);
    const startAngle = angle - 15;
    const endAngle = angle + 15;
    
    elements.push({
      type: 'emotional_root',
      path: `M 0,0 Q ${Math.cos(startAngle * Math.PI / 180) * radius/2},${Math.sin(startAngle * Math.PI / 180) * radius/2} ${Math.cos(endAngle * Math.PI / 180) * radius},${Math.sin(endAngle * Math.PI / 180) * radius}`,
      color: getEmotionColor(params?.dominant_emotion || 'confidence'),
      thickness: 2 + (confidence * 4),
      opacity: 0.6 + (confidence * 0.3)
    });
  }
  
  // Medical branches using FOUND medical_terms structure
  const medicalTerms = params?.medical_terms || {};
  const termCategories = Object.keys(medicalTerms);
  
  console.log('📚 Processing corrected medical terms:', termCategories);
  
  termCategories.forEach((category, index) => {
    const categoryTerms = medicalTerms[category] || {};
    const termCount = Object.keys(categoryTerms).length;
    
    if (termCount > 0) {
      const branchAngle = (index / termCategories.length) * 140 - 70;
      const branchLength = 50 + (termCount * 8) + (innovation * 20);
      
      elements.push({
        type: 'medical_branch',
        startY: -30,
        endX: Math.sin(branchAngle * Math.PI / 180) * branchLength,
        endY: -30 - Math.cos(branchAngle * Math.PI / 180) * branchLength,
        color: getCategoryColor(category),
        thickness: 2 + Math.min(termCount / 3, 6) + (innovation * 2),
        opacity: 0.7 + (termCount / 20) + (healing * 0.2)
      });
    }
  });
  
  console.log(`🌿 Generated ${elements.length} corrected tree elements`);
  return elements;
};

// NEW: Corrected emotional fields
const generateEmotionalFieldsFromCorrectedData = (emotionalJourney, emotionalMix) => {
  const fields = [];
  
  // Use emotionalMix if emotionalJourney is not available
  const emotionData = Object.keys(emotionalJourney).length > 0 ? emotionalJourney : emotionalMix;
  
  if (Object.keys(emotionalJourney).length > 0) {
    // Use emotional_journey data if available
    const emotionMapping = {
      problemIntensity: 'tension',
      solutionConfidence: 'confidence', 
      innovationLevel: 'breakthrough',
      healingPotential: 'healing',
      uncertaintyLevel: 'uncertainty'
    };
    
    Object.entries(emotionMapping).forEach(([journeyKey, emotion], index) => {
      const intensity = (emotionalJourney[journeyKey] || 0) / 1000; // Convert from 0-1000 to 0-1
      if (intensity < 0.1) return;
      
      const x = (width / 6) + (index * (width / 6));
      const y = height * 0.4 + (Math.sin(index * 2) * 50);
      const radiusX = 30 + (intensity * 50);
      const radiusY = 20 + (intensity * 30);
      
      fields.push({
        x: x,
        y: y,
        radiusX: radiusX,
        radiusY: radiusY,
        color: getEmotionColor(emotion),
        emotion: emotion,
        intensity: intensity
      });
    });
  } else {
    // Fallback to emotional_mix
    Object.entries(emotionalMix).forEach(([emotion, intensity], index) => {
      if (intensity < 0.1) return;
      
      const x = (width / 6) + (index * (width / 6));
      const y = height * 0.4 + (Math.sin(index * 2) * 50);
      const radiusX = 30 + (intensity * 50);
      const radiusY = 20 + (intensity * 30);
      
      fields.push({
        x: x,
        y: y,
        radiusX: radiusX,
        radiusY: radiusY,
        color: getEmotionColor(emotion),
        emotion: emotion,
        intensity: intensity
      });
    });
  }
  
  return fields;
};

  // NEW: Enhanced medical terms processing
  const generateEnhancedMedicalTermVisuals = (medicalTerms) => {
    const visuals = [];
    
    if (!medicalTerms || Object.keys(medicalTerms).length === 0) {
      console.log('⚠️ No enhanced medical terms found, generating fallback visuals');
      for (let i = 0; i < 3; i++) {
        visuals.push({
          type: 'fallback_cluster',
          x: 100 + (i * 120),
          y: 150 + (i * 40),
          size: 20 + (i * 10),
          color: ['#3498db', '#27ae60', '#f39c12'][i]
        });
      }
      return visuals;
    }
    
    Object.entries(medicalTerms).forEach(([category, terms], categoryIndex) => {
      const termCount = Object.keys(terms || {}).length;
      if (termCount === 0) return;
      
      console.log(`🏷️ Processing enhanced ${category} with ${termCount} terms`);
      
      const x = 80 + (categoryIndex * 100);
      const y = 120 + (categoryIndex * 60);
      
      // Calculate significance from NEW term structure
      const totalSignificance = Object.values(terms).reduce((sum, termData) => {
        return sum + (termData.significance || termData.count || 1);
      }, 0);
      
      if (category === 'procedures') {
        const sides = Math.min(termCount + 3, 8);
        const radius = 15 + (totalSignificance * 0.5);
        const points = generatePolygonPoints(0, 0, sides, radius);
        const animatedPoints = generatePolygonPoints(0, 0, sides, radius + 5);
        
        visuals.push({
          type: 'enhanced_procedure_cluster',
          x: x,
          y: y,
          points: points,
          animatedPoints: animatedPoints,
          color: getCategoryColor(category),
          termCount: termCount,
          significance: totalSignificance
        });
      } else if (category === 'anatomy') {
        const nodes = [];
        const connections = [];
        
        for (let i = 0; i < Math.min(termCount, 6); i++) {
          const nodeAngle = (i / Math.min(termCount, 6)) * 360;
          const nodeRadius = 25 + (totalSignificance * 0.3);
          nodes.push({
            x: Math.cos(nodeAngle * Math.PI / 180) * nodeRadius,
            y: Math.sin(nodeAngle * Math.PI / 180) * nodeRadius,
            radius: 3 + (totalSignificance * 0.1)
          });
          
          if (i < Math.min(termCount, 6) - 1) {
            const nextAngle = ((i + 1) / Math.min(termCount, 6)) * 360;
            connections.push({
              x1: Math.cos(nodeAngle * Math.PI / 180) * nodeRadius,
              y1: Math.sin(nodeAngle * Math.PI / 180) * nodeRadius,
              x2: Math.cos(nextAngle * Math.PI / 180) * nodeRadius,
              y2: Math.sin(nextAngle * Math.PI / 180) * nodeRadius
            });
          }
        }
        
        visuals.push({
          type: 'enhanced_anatomy_network',
          x: x,
          y: y,
          nodes: nodes,
          connections: connections,
          color: getCategoryColor(category),
          termCount: termCount,
          significance: totalSignificance
        });
      } else if (category === 'outcomes') {
        visuals.push({
          type: 'enhanced_outcome_radial',
          x: x,
          y: y,
          rayCount: Math.min(termCount, 8),
          rayLength: 20 + (totalSignificance * 0.5),
          color: getCategoryColor(category),
          termCount: termCount,
          significance: totalSignificance
        });
      } else {
        visuals.push({
          type: 'enhanced_simple_cluster',
          x: x,
          y: y,
          size: 15 + (totalSignificance * 0.3),
          color: getCategoryColor(category),
          termCount: termCount,
          significance: totalSignificance
        });
      }
    });
    
    console.log(`🎨 Generated ${visuals.length} enhanced medical term visuals`);
    return visuals;
  };

  // NEW: Enhanced statistical streams using statistics array
  const generateEnhancedStatisticalStreams = (statistics) => {
    return (statistics || []).map((stat, index) => {
      const startX = 50 + (index * 40);
      const startY = height * 0.3;
      const endX = width - 50;
      const endY = height * 0.7 + (index * 20);
      const midX = (startX + endX) / 2;
      const midY = startY + (Math.sin(index) * 50);
      
      // Use NEW statistics structure
      const significance = stat.significance || 0.5;
      const thickness = Math.max(1, significance * 4);
      const opacity = 0.3 + (significance * 0.4);
      
      return {
        path: `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`,
        color: getStatisticTypeColor(stat.type),
        thickness: thickness,
        opacity: opacity,
        significance: significance
      };
    });
  };

  // NEW: Enhanced research constellation using citations array
  const generateEnhancedResearchConstellation = (citations) => {
    const stars = [];
    const starCount = Math.min((citations || []).length, 8);
    
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * 360;
      const radius = 30 + Math.random() * 40;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      
      // Use NEW citations structure
      const citation = citations[i] || {};
      const importance = citation.importance || 0.5;
      const impact = citation.impact || 0.5;
      
      const connections = [];
      for (let j = 0; j < starCount; j++) {
        if (j !== i && Math.abs(i - j) <= 2) {
          const connectAngle = (j / starCount) * 360;
          const connectRadius = 30 + Math.random() * 40;
          connections.push({
            x: Math.cos(connectAngle * Math.PI / 180) * connectRadius,
            y: Math.sin(connectAngle * Math.PI / 180) * connectRadius
          });
        }
      }
      
      stars.push({
        x: x,
        y: y,
        radius: 2 + (importance * 4),
        connections: connections,
        importance: importance,
        impact: impact
      });
    }
    
    return stars;
  };


  // NEW: Render backend visual elements
  const renderBackendVisualElements = (visualElements) => {
    return visualElements.map((element, index) => {
      if (element.type === 'andryRoot') {
        const path = `M 0,0 L ${Math.cos(element.angle * Math.PI / 180) * element.length},${Math.sin(element.angle * Math.PI / 180) * element.length}`;
        return (
          <motion.path
            key={`backend-${index}`}
            d={path}
            stroke={element.color}
            strokeWidth={element.thickness}
            fill="none"
            opacity={0.6}
            animate={{
              strokeDasharray: ["0 20", "20 0", "0 20"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: index * 0.5
            }}
          />
        );
      } else if (element.type === 'medicalBranch') {
        return (
          <motion.circle
            key={`backend-${index}`}
            cx={50 + (index * 30)}
            cy={200 + (index * 20)}
            r={element.complexity || 5}
            fill={element.color}
            opacity={0.5}
            animate={{
              r: [(element.complexity || 5), (element.complexity || 5) * 1.2, (element.complexity || 5)],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.3
            }}
          />
        );
      }
      return null;
    }).filter(Boolean);
  };

  // Keep existing helper functions
  const generateSubspecialtyBackground = (subspecialty) => {
    const backgrounds = {
      sportsMedicine: { center: '#e8f5e8', edge: '#d4edda' },
      jointReplacement: { center: '#f8f9fa', edge: '#e9ecef' },
      trauma: { center: '#fff3cd', edge: '#ffeaa7' },
      spine: { center: '#e7e3ff', edge: '#d1c7ff' },
      handUpperExtremity: { center: '#e0f7fa', edge: '#b2ebf2' },
      footAnkle: { center: '#f1f8e9', edge: '#dcedc8' }
    };
    return backgrounds[subspecialty] || backgrounds.sportsMedicine;
  };

  const generateSubspecialtySymbol = (subspecialty, dominantEmotion) => {
    const symbolSize = 20;
    const color = getEmotionColor(dominantEmotion || 'confidence');
    
    const symbols = {
      sportsMedicine: (
        <motion.circle
          cx="0"
          cy="0"
          r={symbolSize/2}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.8"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      ),
      jointReplacement: (
        <motion.rect
          x={-symbolSize/2}
          y={-symbolSize/2}
          width={symbolSize}
          height={symbolSize}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.8"
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      ),
      trauma: (
        <motion.polygon
          points={`0,-${symbolSize/2} ${symbolSize/3},${symbolSize/2} -${symbolSize/3},${symbolSize/2}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.8"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )
    };
    
    return symbols[subspecialty] || symbols.sportsMedicine;
  };

  // Helper functions for colors and calculations
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

  if (!svgContent) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg w-full h-full"
        style={{ width, height }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-2"
          />
          <p className="text-xs text-gray-600">Processing Enhanced Algorithm...</p>
          <p className="text-xs text-gray-500">{artwork?.title || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="real-arthrokinetix-artwork w-full h-full">
      {svgContent}
    </div>
  );
};

export default RealArthrokinetixArtwork;
