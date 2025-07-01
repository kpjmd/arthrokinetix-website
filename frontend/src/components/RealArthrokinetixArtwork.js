// RealArthrokinetixArtwork.js - Fixed Version
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RealArthrokinetixArtwork = ({ artwork, width = 400, height = 400 }) => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    if (artwork && artwork.algorithm_parameters) {
      generateRealArtwork();
    }
  }, [artwork]);

  const generateRealArtwork = () => {
    const params = artwork.algorithm_parameters;
    const metadata = artwork.metadata;
    
    // Debug logging
    console.log('🎨 Generating artwork for:', artwork.title);
    console.log('📊 Algorithm parameters:', params);
    console.log('🏷️ Metadata:', metadata);
    
    // Check if we have real data or need to use fallbacks
    const hasMedicalTerms = params?.medical_terms && Object.keys(params.medical_terms).length > 0;
    const hasStatisticalData = params?.statistical_data && params.statistical_data.length > 0;
    const hasEmotionalMix = params?.emotional_mix && Object.keys(params.emotional_mix).length > 0;
    
    console.log('📋 Data availability:', {
      medicalTerms: hasMedicalTerms,
      statisticalData: hasStatisticalData,
      emotionalMix: hasEmotionalMix
    });

    // 1. Generate Subspecialty Background
    const background = generateSubspecialtyBackground(params?.subspecialty || 'sportsMedicine');
    
    // 2. Generate Andry Tree Structure (but abstract, not literal tree)
    const andryElements = generateAndryTreeAbstraction(params);
    
    // 3. Generate Medical Term Visualizations
    const medicalVisuals = generateMedicalTermVisuals(params?.medical_terms || {});
    
    // 4. Generate Statistical Data Streams
    const dataStreams = generateStatisticalStreams(params?.statistical_data || []);
    
    // 5. Generate Research Constellation
    const researchStars = generateResearchConstellation(params?.research_citations || []);
    
    // 6. Generate Emotional Field Overlays
    const emotionalFields = generateEmotionalFields(params?.emotional_mix || {});
    
    // 7. Generate Subspecialty Symbol
    const subspecialtySymbol = generateSubspecialtySymbol(params?.subspecialty, params?.dominant_emotion);

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
          
          {/* Medical Data Pattern */}
          <pattern 
            id={`data-pattern-${artwork.id}`} 
            x="0" y="0" 
            width="20" height="20" 
            patternUnits="userSpaceOnUse"
          >
            <circle 
              cx="10" cy="10" r="1" 
              fill={getEmotionColor(params?.dominant_emotion)} 
              opacity="0.1"
            />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill={`url(#bg-${artwork.id})`} />
        <rect width="100%" height="100%" fill={`url(#data-pattern-${artwork.id})`} />

        {/* Andry Tree Abstract Structure */}
        <g transform={`translate(${width/2}, ${height * 0.8})`}>
          {andryElements.map((element, i) => (
            <motion.g 
              key={`andry-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: i * 0.2 }}
            >
              {element.type === 'root_foundation' && (
                <motion.path
                  d={element.path}
                  stroke={element.color}
                  strokeWidth={element.thickness}
                  fill="none"
                  opacity={0.6}
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
              
              {element.type === 'knowledge_branch' && (
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

        {/* Medical Term Clusters */}
        <g className="medical-terms">
          {medicalVisuals.map((cluster, i) => (
            <motion.g 
              key={`medical-${i}`}
              transform={`translate(${cluster.x}, ${cluster.y})`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, delay: i * 0.3 }}
            >
              {cluster.type === 'procedure_cluster' && cluster.points && (
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
              
              {cluster.type === 'anatomy_network' && (
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

              {cluster.type === 'outcome_radial' && cluster.rayCount > 0 && (
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
              
              {cluster.type === 'simple_cluster' && cluster.size && (
                <motion.circle
                  cx="0"
                  cy="0"
                  r={cluster.size}
                  fill={cluster.color}
                  opacity={0.4}
                  animate={{
                    r: [cluster.size, cluster.size * 1.2, cluster.size],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity
                  }}
                />
              )}
              
              {cluster.type === 'fallback_cluster' && cluster.size && (
                <motion.rect
                  x={-cluster.size/2}
                  y={-cluster.size/2}
                  width={cluster.size}
                  height={cluster.size}
                  fill={cluster.color}
                  opacity={0.5}
                  animate={{
                    width: [cluster.size, cluster.size * 1.1, cluster.size],
                    height: [cluster.size, cluster.size * 1.1, cluster.size]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              )}
            </motion.g>
          ))}
        </g>

        {/* Statistical Data Streams */}
        <g className="data-streams">
          {dataStreams.map((stream, i) => (
            <motion.path
              key={`stream-${i}`}
              d={stream.path}
              stroke={stream.color}
              strokeWidth={stream.thickness}
              fill="none"
              opacity={0.5}
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

        {/* Research Constellation */}
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
              {star.connections && star.connections.map((conn, connIndex) => (
                <motion.line
                  key={connIndex}
                  x1={star.x}
                  y1={star.y}
                  x2={conn.x}
                  y2={conn.y}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  opacity={0.3}
                />
              ))}
            </motion.g>
          ))}
        </g>

        {/* Emotional Field Overlays */}
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

        {/* Subspecialty Symbol */}
        <g className="subspecialty-symbol" transform={`translate(${width * 0.9}, ${height * 0.1})`}>
          {subspecialtySymbol}
        </g>

        {/* Signature Elements */}
        <g className="signature-elements" transform={`translate(${width * 0.1}, ${height * 0.9})`}>
          <text
            x="0"
            y="0"
            fontSize="8"
            fill={getEmotionColor(params?.dominant_emotion)}
            opacity={0.7}
          >
            {metadata?.signature_id || 'AKX-DEMO'}
          </text>
        </g>

        {/* Algorithm Version Watermark */}
        <text
          x={width - 5}
          y={height - 5}
          fontSize="6"
          fill="#000000"
          opacity={0.3}
          textAnchor="end"
        >
          AKX v{metadata?.algorithm_version || '2.0'}
        </text>
      </svg>
    );

    setSvgContent(svg);
  };

  // Helper function implementations
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

  const generateAndryTreeAbstraction = (params) => {
    const elements = [];
    const evidenceStrength = params?.evidence_strength || 0.5;
    const complexity = params?.tree_complexity || 0.5;
    const subspecialty = params?.subspecialty || 'sportsMedicine';
  
    // NEW: Use emotional_journey data if available (matches backend update)
    const emotionalJourney = params?.emotional_journey || {};
    const solutionConfidence = emotionalJourney.solutionConfidence || evidenceStrength;
    const innovationLevel = emotionalJourney.innovationLevel || 0.5;
  
    console.log('🌳 Generating Andry Tree with:', { 
      evidenceStrength, 
      complexity, 
      subspecialty,
      emotionalJourney: Object.keys(emotionalJourney).length > 0 ? 'Available' : 'Using fallback'
    });
  
    // Root foundation paths (representing research foundation)
    const rootCount = Math.floor(solutionConfidence * 6) + 3; // Use solutionConfidence instead of evidenceStrength
    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * 180 + 180;
      const radius = 40 + (solutionConfidence * 80); // Use emotional journey data
      const startAngle = angle - 15;
      const endAngle = angle + 15;
    
      elements.push({
        type: 'root_foundation',
        path: `M 0,0 Q ${Math.cos(startAngle * Math.PI / 180) * radius/2},${Math.sin(startAngle * Math.PI / 180) * radius/2} ${Math.cos(endAngle * Math.PI / 180) * radius},${Math.sin(endAngle * Math.PI / 180) * radius}`,
        color: getEmotionColor(params?.dominant_emotion || 'confidence'),
        thickness: 2 + solutionConfidence * 4 // Use emotional journey data
      });
    }
  
    // Knowledge branches representing medical content
    const medicalTerms = params?.medical_terms || {};
    const termCategories = Object.keys(medicalTerms);
  
    console.log('📚 Medical term categories found:', termCategories);
  
    termCategories.forEach((category, index) => {
      const categoryTerms = medicalTerms[category] || {};
      const termCount = Object.keys(categoryTerms).length;
    
      if (termCount > 0) {
        const branchAngle = (index / termCategories.length) * 140 - 70;
        const branchLength = 50 + (termCount * 8);
      
        // NEW: Use innovation level for branch characteristics
        const branchThickness = 2 + Math.min(termCount / 3, 6) + (innovationLevel * 2);
        const branchOpacity = 0.7 + (termCount / 20) + (innovationLevel * 0.2);
      
        elements.push({
          type: 'knowledge_branch',
          startY: -30,
          endX: Math.sin(branchAngle * Math.PI / 180) * branchLength,
          endY: -30 - Math.cos(branchAngle * Math.PI / 180) * branchLength,
          color: getCategoryColor(category),
          thickness: branchThickness,
          opacity: Math.min(branchOpacity, 1.0)
        });
      }
    });
  
    console.log(`🌿 Generated ${elements.length} tree elements (with emotional journey data)`);
    return elements;
  };

  const generateMedicalTermVisuals = (medicalTerms) => {
    const visuals = [];
    
    if (!medicalTerms || Object.keys(medicalTerms).length === 0) {
      console.log('⚠️ No medical terms found, generating fallback visuals');
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
      
      console.log(`🏷️ Processing ${category} with ${termCount} terms`);
      
      const x = 80 + (categoryIndex * 100);
      const y = 120 + (categoryIndex * 60);
      
      if (category === 'procedures') {
        const sides = Math.min(termCount + 3, 8);
        const radius = 15 + (termCount * 2);
        const points = generatePolygonPoints(0, 0, sides, radius);
        const animatedPoints = generatePolygonPoints(0, 0, sides, radius + 5);
        
        visuals.push({
          type: 'procedure_cluster',
          x: x,
          y: y,
          points: points,
          animatedPoints: animatedPoints,
          color: getCategoryColor(category),
          termCount: termCount
        });
      } else if (category === 'anatomy') {
        const nodes = [];
        const connections = [];
        
        for (let i = 0; i < Math.min(termCount, 6); i++) {
          const nodeAngle = (i / Math.min(termCount, 6)) * 360;
          const nodeRadius = 25 + (termCount * 2);
          nodes.push({
            x: Math.cos(nodeAngle * Math.PI / 180) * nodeRadius,
            y: Math.sin(nodeAngle * Math.PI / 180) * nodeRadius,
            radius: 3 + (termCount / 5)
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
          type: 'anatomy_network',
          x: x,
          y: y,
          nodes: nodes,
          connections: connections,
          color: getCategoryColor(category),
          termCount: termCount
        });
      } else if (category === 'outcomes') {
        visuals.push({
          type: 'outcome_radial',
          x: x,
          y: y,
          rayCount: Math.min(termCount, 8),
          rayLength: 20 + (termCount * 3),
          color: getCategoryColor(category),
          termCount: termCount
        });
      } else {
        visuals.push({
          type: 'simple_cluster',
          x: x,
          y: y,
          size: 15 + (termCount * 2),
          color: getCategoryColor(category),
          termCount: termCount
        });
      }
    });
    
    console.log(`🎨 Generated ${visuals.length} medical term visuals`);
    return visuals;
  };

  const generateStatisticalStreams = (statisticalData) => {
    return (statisticalData || []).map((stat, index) => {
      const startX = 50 + (index * 40);
      const startY = height * 0.3;
      const endX = width - 50;
      const endY = height * 0.7 + (index * 20);
      const midX = (startX + endX) / 2;
      const midY = startY + (Math.sin(index) * 50);
      
      return {
        path: `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`,
        color: getStatisticTypeColor(stat.type),
        thickness: Math.max(1, (stat.significance || 0.5) * 3)
      };
    });
  };

  const generateResearchConstellation = (citations) => {
    const stars = [];
    const starCount = Math.min((citations || []).length, 8);
    
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * 360;
      const radius = 30 + Math.random() * 40;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      
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
        radius: 2 + ((citations[i]?.importance || 0.5) * 3),
        connections: connections
      });
    }
    
    return stars;
  };

  const generateEmotionalFields = (emotionalMix) => {
    const fields = [];
    
    Object.entries(emotionalMix || {}).forEach(([emotion, intensity], index) => {
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
        emotion: emotion
      });
    });
    
    return fields;
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

  // Helper functions
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
      followUp: '#3498db'
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
          <p className="text-xs text-gray-600">Processing: {artwork?.title || 'Loading...'}</p>
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
