import React from 'react';
import { Star } from 'lucide-react';
import { emotionOptions } from '../constants/emotions';

/**
 * EmotionalAnalysisBar Component
 * Displays the emotional analysis of an article with visual indicators
 * 
 * @param {Object} props
 * @param {Object} props.emotionalData - The emotional data to display
 * @param {Object} props.algorithmDebug - Algorithm debug information
 * @param {string} props.className - Additional CSS classes
 */
const EmotionalAnalysisBar = ({ emotionalData, algorithmDebug, className = '' }) => {
  if (!emotionalData || Object.keys(emotionalData).length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Emotional Analysis</h3>
        {algorithmDebug && (
          <span className="text-xs text-gray-500">
            Source: {algorithmDebug.isManualAlgorithm ? 'Manual Algorithm' : 'Standard Analysis'}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {emotionOptions.map(emotion => {
          const value = emotionalData[emotion.key] || 0;
          const isDominant = emotionalData.dominant_emotion === emotion.key;
          
          return (
            <div key={emotion.key} className="text-center">
              <div className="relative mb-2">
                <div 
                  className="w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center text-lg"
                  style={{ 
                    borderColor: emotion.color,
                    backgroundColor: isDominant ? emotion.color + '20' : 'transparent'
                  }}
                >
                  {emotion.icon}
                </div>
                {isDominant && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-yellow-800" />
                  </div>
                )}
              </div>
              <div className="text-xs font-medium text-gray-700">{emotion.label}</div>
              <div className="text-xs text-gray-500">{Math.round(value * 100)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionalAnalysisBar;