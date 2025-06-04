import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AlgorithmMoodIndicator = ({ algorithmState, onStateUpdate }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!algorithmState) return null;

  const { emotional_state, visual_representation } = algorithmState;
  const { shape, color, glow_intensity, pulse_rate } = visual_representation;

  const getShapeComponent = () => {
    const size = 40;
    const baseProps = {
      width: size,
      height: size,
      style: { 
        color: color,
        filter: `drop-shadow(0 0 ${glow_intensity * 20}px ${color})`
      }
    };

    switch (shape) {
      case 'circle':
        return (
          <div 
            className="rounded-full border-2"
            style={{ 
              width: size, 
              height: size, 
              borderColor: color,
              backgroundColor: `${color}40`
            }} 
          />
        );
      case 'square':
        return (
          <div 
            className="border-2"
            style={{ 
              width: size, 
              height: size, 
              borderColor: color,
              backgroundColor: `${color}40`
            }} 
          />
        );
      case 'star':
        return (
          <svg {...baseProps} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg {...baseProps} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 3.5L22 12l-4.5 8.5h-11L2 12l4.5-8.5h11z" />
          </svg>
        );
      case 'triangle':
        return (
          <svg {...baseProps} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        );
      case 'diamond':
        return (
          <svg {...baseProps} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l4.5 7L12 22l-4.5-13L12 2z" />
          </svg>
        );
      default:
        return (
          <div 
            className="rounded-full border-2"
            style={{ 
              width: size, 
              height: size, 
              borderColor: color,
              backgroundColor: `${color}40`
            }} 
          />
        );
    }
  };

  return (
    <div className="mood-indicator">
      <motion.div
        animate={{ 
          scale: [1, 1 + glow_intensity * 0.3, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 2 / pulse_rate, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mood-shape"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {getShapeComponent()}
      </motion.div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 w-64 border"
          >
            <h3 className="font-semibold text-primary mb-2">Algorithm Emotional State</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dominant Emotion:</span>
                <span className="text-sm font-medium capitalize" style={{ color: color }}>
                  {emotional_state.dominant_emotion}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Intensity:</span>
                <span className="text-sm font-medium">
                  {Math.round(emotional_state.emotional_intensity * 100)}%
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Emotional Mix:</p>
                <div className="space-y-1">
                  {Object.entries(emotional_state.emotional_mix).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-xs capitalize text-gray-600">{emotion}:</span>
                      <div className="flex items-center">
                        <div className="w-12 h-1 bg-gray-200 rounded mr-2">
                          <div 
                            className="h-full rounded transition-all duration-300"
                            style={{ 
                              width: `${value * 100}%`, 
                              backgroundColor: getEmotionColor(emotion)
                            }}
                          />
                        </div>
                        <span className="text-xs">{Math.round(value * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Articles processed: {algorithmState.articles_processed || 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getEmotionColor = (emotion) => {
  const colors = {
    hope: '#27ae60',
    tension: '#e74c3c',
    confidence: '#3498db',
    uncertainty: '#95a5a6',
    breakthrough: '#f39c12',
    healing: '#16a085',
    innovation: '#f39c12'
  };
  return colors[emotion] || '#3498db';
};

export default AlgorithmMoodIndicator;