{/* Medical Term Clusters */}
        <g className="medical-terms">
          {medicalVisuals.map((cluster, i) => (
            <motion.g 
              key={`medical-${i}`}
              transform={`translate(${cluster.x}, ${cluster.y})`}
              initial// RealArthrokinetixArtwork.js - Uses the actual algorithm
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
    
    // Use REAL algorithm parameters, not simplified tree visualization
    const svgElements = [];
    
    // 1. Background based on subspecialty
    const background = generateSubspecialtyBackground(params.subspecialty || 'sportsMedicine');
    
    // 2. Andry Tree Structure (but abstract, not literal tree)
    const andryElements = generateAndryTreeAbstraction(params);
    
    // 3. Medical Term Visualizations
    const medicalVisuals = generateMedicalTermVisuals(params.medical_terms || {});
    
    // 4. Statistical Data Streams
    const dataStreams = generateStatisticalStreams(params.statistical_data || []);
    
    // 5. Research Constellation
    const researchStars = generateResearchConstellation(params.research_citations || []);
    
    // 6. Emotional Field Overlays
    const emotionalFields = generateEmotionalFields(params.emotional_mix || {});
    
    // 7. Subspecialty Symbol
    const subspecialtySymbol = generateSubspecialtySymbol(params.subspecialty, params.dominant_emotion);
    
    // 8. Signature Elements
    const signatureElements = generateSignatureElements(metadata.signature_id);

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
              fill={getEmotionColor(params.dominant_emotion)} 
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
                  {cluster.type === 'outcome_radial' && (
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
            
            {cluster.type === 'simple_cluster' && (
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
            
            {cluster.type === 'fallback_cluster' && (
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
            )}}
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
              {cluster.type === 'procedure_cluster' && (
                <motion.polygon
                  points={cluster.points}
                  fill={cluster.color}
                  opacity={0.4}
                  animate={{
                    points: [cluster.points, cluster.animatedPoints, cluster.points]
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
                  {cluster.nodes.map((node, nodeIndex) => (
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
                  {cluster.connections.map((connection, connIndex) => (
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
              {star.connections.map((conn, connIndex) => (
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
            fill={getEmotionColor(params.dominant_emotion)}
            opacity={0.7}
          >
            {metadata.signature_id}
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
          AKX v{metadata.algorithm_version || '2.0'}
        </text>
      </svg>
    );

    setSvgContent(svg);
  };

  // Helper function implementations would go here...
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
    // Generate abstract Andry Tree elements based on evidence strength and content
    const elements = [];
    const evidenceStrength = params.evidence_strength || 0.5;
    const complexity = params.tree_complexity || 0.5;
    
    // Root foundation paths (representing research foundation)
    for (let i = 0; i < Math.floor(evidenceStrength * 5) + 2; i++) {
      const angle = (i / 5) * 180 + 180;
      const radius = 30 + (evidenceStrength * 50);
      
      elements.push({
        type: 'root_foundation',
        path: `M 0,0 Q ${Math.cos(angle * Math.PI / 180) * radius/2},${Math.sin(angle * Math.PI / 180) * radius/2} ${Math.cos(angle * Math.PI / 180) * radius},${Math.sin(angle * Math.PI / 180) * radius}`,
        color: getEmotionColor(params.dominant_emotion),
        thickness: 2 + evidenceStrength * 2
      });
    }
    
    // Knowledge branches (representing different aspects of medical knowledge)
    const medicalTerms = params.medical_terms || {};
    Object.keys(medicalTerms).forEach((category, index) => {
      const branchAngle = (index / Object.keys(medicalTerms).length) * 120 - 60;
      const branchLength = 40 + (Object.keys(medicalTerms[category] || {}).length * 10);
      
      elements.push({
        type: 'knowledge_branch',
        startY: -20,
        endX: Math.sin(branchAngle * Math.PI / 180) * branchLength,
        endY: -20 - Math.cos(branchAngle * Math.PI / 180) * branchLength,
        color: getCategoryColor(category),
        thickness: 3,
        opacity: 0.7
      });
    });
    
    return elements;
  };

  const generateMedicalTermVisuals = (medicalTerms) => {
    const visuals = [];
    
    if (!medicalTerms || Object.keys(medicalTerms).length === 0) {
      console.log('⚠️ No medical terms found, generating fallback visuals');
      // Generate some fallback visuals
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
      const termCount = Object.keys(terms).length;
      if (termCount === 0) return;
      
      console.log(`🏷️ Processing ${category} with ${termCount} terms`);
      
      const x = 80 + (categoryIndex * 100);
      const y = 120 + (categoryIndex * 60);
      
      if (category === 'procedures') {
        // Procedures as geometric shapes
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
        // Anatomy as connected network
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
          
          // Connect to next node
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
        // Outcomes as radiating elements
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
        // Default: simple cluster
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
    return statisticalData.map((stat, index) => {
      const startX = 50 + (index * 40);
      const startY = height * 0.3;
      const endX = width - 50;
      const endY = height * 0.7 + (index * 20);
      const midX = (startX + endX) / 2;
      const midY = startY + (Math.sin(index) * 50);
      
      return {
        path: `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`,
        color: getStatisticTypeColor(stat.type),
        thickness: Math.max(1, stat.significance * 3)
      };
    });
  };

  const generateResearchConstellation = (citations) => {
    const stars = [];
    const starCount = Math.min(citations.length, 8);
    
    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * 360;
      const radius = 30 + Math.random() * 40;
      const x = Math.cos(angle * Math.PI / 180) * radius;
      const y = Math.sin(angle * Math.PI / 180) * radius;
      
      const connections = [];
      // Connect to 1-2 nearby stars
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
        radius: 2 + (citations[i]?.importance || 0.5) * 3,
        connections: connections
      });
    }
    
    return stars;
  };

  const generateEmotionalFields = (emotionalMix) => {
    const fields = [];
    
    Object.entries(emotionalMix).forEach(([emotion, intensity], index) => {
      if (intensity < 0.1) return; // Skip very low intensity emotions
      
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
    const color = getEmotionColor(dominantEmotion);
    
    const symbols = {
      sportsMedicine: (
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <path
            d={`M -${symbolSize/2},-${symbolSize/2} Q 0,-${symbolSize} ${symbolSize/2},-${symbolSize/2} Q ${symbolSize},0 ${symbolSize/2},${symbolSize/2} Q 0,${symbolSize} -${symbolSize/2},${symbolSize/2} Q -${symbolSize},0 -${symbolSize/2},-${symbolSize/2}`}
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </motion.g>
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
      ),
      spine: (
        <motion.g>
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.ellipse
              key={i}
              cx="0"
              cy={-symbolSize/2 + (i * symbolSize/3)}
              rx="3"
              ry="6"
              fill={color}
              opacity="0.8"
              animate={{ 
                rx: [3, 5, 3],
                opacity: [0.8, 1, 0.8] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </motion.g>
      ),
      handUpperExtremity: (
        <motion.g>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((i * 72) * Math.PI / 180) * symbolSize/2}
              y2={Math.sin((i * 72) * Math.PI / 180) * symbolSize/2}
              stroke={color}
              strokeWidth="1.5"
              opacity="0.8"
              animate={{ 
                x2: [
                  Math.cos((i * 72) * Math.PI / 180) * symbolSize/2,
                  Math.cos((i * 72) * Math.PI / 180) * symbolSize/3,
                  Math.cos((i * 72) * Math.PI / 180) * symbolSize/2
                ],
                y2: [
                  Math.sin((i * 72) * Math.PI / 180) * symbolSize/2,
                  Math.sin((i * 72) * Math.PI / 180) * symbolSize/3,
                  Math.sin((i * 72) * Math.PI / 180) * symbolSize/2
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.1 
              }}
            />
          ))}
        </motion.g>
      ),
      footAnkle: (
        <motion.g>
          <motion.path
            d={`M -${symbolSize/2},0 Q 0,-${symbolSize/3} ${symbolSize/2},0 Q 0,${symbolSize/3} -${symbolSize/2},0`}
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
            animate={{ d: [
              `M -${symbolSize/2},0 Q 0,-${symbolSize/3} ${symbolSize/2},0 Q 0,${symbolSize/3} -${symbolSize/2},0`,
              `M -${symbolSize/2},0 Q 0,-${symbolSize/2} ${symbolSize/2},0 Q 0,${symbolSize/2} -${symbolSize/2},0`,
              `M -${symbolSize/2},0 Q 0,-${symbolSize/3} ${symbolSize/2},0 Q 0,${symbolSize/3} -${symbolSize/2},0`
            ]}}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.g>
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
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ width, height }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"
        />
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
