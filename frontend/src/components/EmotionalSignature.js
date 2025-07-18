import React from 'react';
import { motion } from 'framer-motion';

const EmotionalSignature = ({ signatureData, emotionalData, size = 80 }) => {
  if (!signatureData) return null;
  
  // Provide fallback emotional data if missing
  const safeEmotionalData = emotionalData || {
    dominant_emotion: 'confidence',
    hope: 0.5,
    confidence: 0.5,
    healing: 0.5,
    breakthrough: 0.5
  };

  // Provide safe defaults for all signature properties with robust fallbacks
  const safeSignatureData = {
    id: signatureData.id || `sig-${Date.now()}`,
    rarity_score: signatureData.rarity_score || 0,
    concentric_rings: signatureData.concentric_rings || { count: 3, thickness: 2, rotation_speed: 1 },
    geometric_overlays: signatureData.geometric_overlays || { color: '#3498db', scale: 0.5, shape: 'circle' },
    floating_particles: signatureData.floating_particles || { count: 8, color: '#3498db' },
    ...signatureData
  };

  const {
    concentric_rings = { count: 3, thickness: 2, rotation_speed: 1 },
    geometric_overlays = { color: '#3498db', scale: 0.5, shape: 'circle' },
    floating_particles = { count: 8, color: '#3498db' }
  } = safeSignatureData;
  
  const dominantEmotion = safeEmotionalData.dominant_emotion || 'confidence';

  return (
    <div 
      className="emotional-signature relative"
      style={{ width: size, height: size }}
    >
      {/* Concentric Rings */}
      {Array.from({ length: concentric_rings.count }).map((_, index) => (
        <motion.div
          key={`ring-${index}`}
          className="signature-rings absolute border-2 rounded-full"
          style={{
            width: `${100 - (index * 15)}%`,
            height: `${100 - (index * 15)}%`,
            borderColor: geometric_overlays.color,
            borderWidth: concentric_rings.thickness,
            opacity: 0.6 - (index * 0.1)
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 8 - (index * concentric_rings.rotation_speed),
            repeat: Infinity,
            ease: "linear",
            direction: index % 2 === 0 ? "normal" : "reverse"
          }}
        />
      ))}

      {/* Floating Particles */}
      <div className="signature-particles absolute inset-0">
        {Array.from({ length: Math.min(floating_particles.count, 12) }).map((_, index) => {
          const angle = (index / floating_particles.count) * 360;
          const radius = size * 0.3;
          const x = Math.cos(angle * Math.PI / 180) * radius;
          const y = Math.sin(angle * Math.PI / 180) * radius;
          
          return (
            <motion.div
              key={`particle-${index}`}
              className="signature-particle absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: floating_particles.color,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%)`
              }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3 + (index * 0.2),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1
              }}
            />
          );
        })}
      </div>

      {/* Center Shape */}
      <motion.div
        className="signature-center absolute inset-0 flex items-center justify-center"
        style={{ 
          backgroundColor: geometric_overlays.color,
          transform: `scale(${geometric_overlays.scale})`,
          borderRadius: getShapeRadius(geometric_overlays.shape)
        }}
        animate={{ 
          scale: [geometric_overlays.scale * 0.9, geometric_overlays.scale * 1.1, geometric_overlays.scale * 0.9],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-white text-xs font-bold">
          {getEmotionSymbol(dominantEmotion)}
        </div>
      </motion.div>

      {/* Signature ID */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <span className="text-xs font-mono text-gray-500">
          {safeSignatureData.id}
        </span>
      </div>

      {/* Rarity Indicator */}
      {safeSignatureData.rarity_score > 0.7 && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-innovation text-white text-xs rounded-full flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          ★
        </motion.div>
      )}
    </div>
  );
};

const getShapeRadius = (shape) => {
  switch (shape) {
    case 'circle':
      return '50%';
    case 'square':
      return '8px';
    case 'star':
      return '30%';
    case 'hexagon':
      return '20%';
    case 'triangle':
      return '15%';
    case 'diamond':
      return '25%';
    default:
      return '50%';
  }
};

const getEmotionSymbol = (emotion) => {
  const symbols = {
    hope: '○',
    confidence: '■',
    breakthrough: '★',
    healing: '⬢',
    tension: '▲',
    uncertainty: '◆'
  };
  return symbols[emotion] || '○';
};

export default EmotionalSignature;