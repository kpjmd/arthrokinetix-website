import React from 'react';
import { FileText, Clock, Award, User, Zap } from 'lucide-react';

/**
 * ArticleMetadata Component
 * Displays article metadata including subspecialty, read time, evidence strength, and content type
 * 
 * @param {Object} props
 * @param {Object} props.article - The article data
 * @param {Object} props.algorithmDebug - Algorithm debug information
 * @param {string} props.className - Additional CSS classes
 */
const ArticleMetadata = ({ article, algorithmDebug, className = '' }) => {
  if (!article) return null;

  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm text-gray-600 ${className}`}>
      <span className="flex items-center">
        <FileText className="w-4 h-4 mr-1" />
        {article.subspecialty?.replace(/([A-Z])/g, ' $1')}
      </span>
      
      <span className="flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        {article.read_time || 5} min read
      </span>
      
      <span className="flex items-center">
        <Award className="w-4 h-4 mr-1" />
        {Math.round((article.evidence_strength || 0) * 100)}% evidence strength
      </span>
      
      <span className="flex items-center">
        <User className="w-4 h-4 mr-1" />
        {article.content_type?.toUpperCase()} content
      </span>
      
      {algorithmDebug && (
        <span className="flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          {algorithmDebug.isManualAlgorithm ? 'Enhanced Algorithm' : 'Standard Algorithm'}
        </span>
      )}
    </div>
  );
};

export default ArticleMetadata;