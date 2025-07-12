import React from 'react';
import { BarChart3 } from 'lucide-react';
import { 
  processMedicalTerms, 
  calculateAverageImportance, 
  calculateAverageImpact 
} from '../utils/emotionalDataProcessor';

/**
 * MedicalDataInsights Component
 * Displays medical data insights including terminology, statistics, citations, and processing details
 * 
 * @param {Object} props
 * @param {Object} props.algorithmParameters - Algorithm parameters containing medical data
 * @param {string} props.className - Additional CSS classes
 */
const MedicalDataInsights = ({ algorithmParameters, className = '' }) => {
  if (!algorithmParameters) return null;

  const medicalTerms = processMedicalTerms(algorithmParameters.medical_terms);
  const hasStatistics = algorithmParameters.statistical_data && algorithmParameters.statistical_data.length > 0;
  const hasCitations = algorithmParameters.research_citations && algorithmParameters.research_citations.length > 0;

  return (
    <div className={`px-8 py-6 bg-gray-50 border-t border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Algorithm Data Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Terms Analysis */}
        {medicalTerms.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Medical Terminology</h4>
            <div className="space-y-2">
              {medicalTerms.map((termData) => (
                <div key={termData.category} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {termData.displayName}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{termData.termCount} terms</span>
                    <div className="text-xs text-gray-500">
                      Score: {termData.totalSignificance.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistical Data */}
        {hasStatistics && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Statistical Elements</h4>
            <div className="space-y-2">
              {algorithmParameters.statistical_data.slice(0, 5).map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {stat.type?.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {typeof stat.value === 'number' ? stat.value.toFixed(stat.value < 1 ? 3 : 0) : stat.value}
                    </span>
                    <div className="text-xs text-gray-500">
                      Significance: {((stat.significance || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
              {algorithmParameters.statistical_data.length > 5 && (
                <div className="text-xs text-gray-500 text-center pt-2">
                  +{algorithmParameters.statistical_data.length - 5} more statistics
                </div>
              )}
            </div>
          </div>
        )}

        {/* Research Citations */}
        {hasCitations && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Research Citations</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Citations</span>
                <span className="text-sm font-medium text-gray-900">
                  {algorithmParameters.research_citations.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Importance</span>
                <span className="text-sm font-medium text-gray-900">
                  {calculateAverageImportance(algorithmParameters.research_citations).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Impact</span>
                <span className="text-sm font-medium text-gray-900">
                  {calculateAverageImpact(algorithmParameters.research_citations).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Metadata */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Processing Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Algorithm Version</span>
              <span className="font-medium text-gray-900">
                {algorithmParameters.algorithm_version || 'Unknown'}
              </span>
            </div>
            {algorithmParameters.processing_timestamp && (
              <div className="flex justify-between">
                <span className="text-gray-600">Processed</span>
                <span className="font-medium text-gray-900">
                  {new Date(algorithmParameters.processing_timestamp).toLocaleDateString()}
                </span>
              </div>
            )}
            {algorithmParameters.article_word_count && (
              <div className="flex justify-between">
                <span className="text-gray-600">Word Count</span>
                <span className="font-medium text-gray-900">
                  {algorithmParameters.article_word_count.toLocaleString()}
                </span>
              </div>
            )}
            {algorithmParameters.data_complexity && (
              <div className="flex justify-between">
                <span className="text-gray-600">Data Complexity</span>
                <span className="font-medium text-gray-900">
                  {Math.round(algorithmParameters.data_complexity * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDataInsights;