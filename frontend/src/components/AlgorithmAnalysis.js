import React from 'react';
import { Activity } from 'lucide-react';

/**
 * AlgorithmAnalysis Component
 * Displays detailed algorithm analysis including version, data completeness, and quality metrics
 * 
 * @param {Object} props
 * @param {Object} props.algorithmDebug - Algorithm debug information
 * @param {Object} props.algorithmParams - Algorithm parameters from artwork
 * @param {string} props.className - Additional CSS classes
 */
const AlgorithmAnalysis = ({ algorithmDebug, algorithmParams = {}, className = '' }) => {
  if (!algorithmDebug) return null;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Algorithm Analysis
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          algorithmDebug.isManualAlgorithm 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {algorithmDebug.isManualAlgorithm ? 'Enhanced v2.0' : 'Standard v1.0'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {algorithmDebug.completenessScore}/{algorithmDebug.maxScore}
          </div>
          <div className="text-sm text-gray-600">Data Components</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {algorithmParams.evidence_strength ? Math.round(algorithmParams.evidence_strength * 100) : 'N/A'}%
          </div>
          <div className="text-sm text-gray-600">Evidence Strength</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {algorithmParams.technical_density ? Math.round(algorithmParams.technical_density * 100) : 'N/A'}%
          </div>
          <div className="text-sm text-gray-600">Technical Density</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {algorithmParams.readability_score ? 
              (algorithmParams.readability_score > 0.7 ? 'Simple' : 
               algorithmParams.readability_score > 0.4 ? 'Moderate' : 'Complex') : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Content Complexity</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {algorithmParams.certainty_level ? 
              (algorithmParams.certainty_level > 0.7 ? 'Definitive' : 
               algorithmParams.certainty_level > 0.4 ? 'Moderate' : 'Exploratory') : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Research Confidence</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            algorithmDebug.dataQuality === 'high' ? 'text-green-600' :
            algorithmDebug.dataQuality === 'medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {algorithmDebug.dataQuality.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600">Data Quality</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(algorithmDebug.dataBreakdown).map(([component, available]) => (
          <div key={component} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-400' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-700 capitalize">
              {component.replace(/([A-Z])/g, ' $1')}
            </span>
          </div>
        ))}
      </div>

      {algorithmDebug.isManualAlgorithm && algorithmParams.emotional_journey && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Emotional Journey Data (Raw Values)</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            {Object.entries(algorithmParams.emotional_journey).map(([key, value]) => (
              key !== 'dominantEmotion' && (
                <div key={key} className="bg-white p-2 rounded">
                  <div className="font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="text-blue-600">{typeof value === 'number' ? value.toFixed(0) : value}</div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmAnalysis;