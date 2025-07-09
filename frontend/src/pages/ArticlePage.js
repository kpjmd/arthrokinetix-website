import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileText, File, Award, User, Star, BookOpen, Image, Palette, Activity, BarChart3, Zap } from 'lucide-react';
import { useUser, SignedIn, SignedOut } from '../hooks/useAuth';
import { AuthModal, AccessGate } from '../components/AuthComponents';
import FeedbackForm from '../components/FeedbackForm';
import EmotionalSignature from '../components/EmotionalSignature';
import ShareButtons from '../components/ShareButtons';
import SEOHead from '../components/SEOHead';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ArticlePage = ({ algorithmState, onStateUpdate }) => {
  const { slug } = useParams();
  const { user, isSignedIn } = useUser();
  const [article, setArticle] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up');
  const [algorithmDebug, setAlgorithmDebug] = useState(null);
  
  // Debug logging
  console.log('🔍 ArticlePage mounted with slug:', slug);
  console.log('🔍 Current URL:', window.location.pathname);

  const emotionOptions = [
    { key: 'hope', label: 'Hope', icon: '🌱', color: '#27ae60' },
    { key: 'confidence', label: 'Confidence', icon: '💪', color: '#3498db' },
    { key: 'breakthrough', label: 'Breakthrough', icon: '⚡', color: '#f39c12' },
    { key: 'healing', label: 'Healing', icon: '💚', color: '#16a085' },
    { key: 'tension', label: 'Tension', icon: '⚠️', color: '#e74c3c' },
    { key: 'uncertainty', label: 'Uncertainty', icon: '❓', color: '#95a5a6' }
  ];

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    if (!slug) {
      console.error('Cannot fetch article: slug is undefined');
      setError('Invalid article URL');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('📖 Fetching article:', slug);
      
      const response = await fetch(`${API_BASE}/api/articles/${slug}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch article: ${response.status} ${response.statusText}`);
        if (response.status === 404) {
          setError('Article not found');
        } else {
          setError(`Failed to load article (Error ${response.status})`);
        }
        setLoading(false);
        return;
      }
      
      const articleData = await response.json();
      
      console.log('📊 Received article data:', articleData);
      console.log('📄 Article content type:', articleData.content_type);
      console.log('📝 Has content:', !!articleData.content);
      console.log('📝 Has HTML content:', !!articleData.html_content);
      console.log('📝 Content length:', articleData.content?.length || 0);
      console.log('📝 Article title:', articleData.title);
      console.log('📝 Article ID:', articleData.id);
      
      setArticle(articleData);
      console.log('✅ Article state updated');

      // Note: Algorithm data analysis will be done after artwork is fetched
      // since algorithm_parameters are stored in artwork, not article

      // Fetch corresponding artwork
      try {
        const artworkResponse = await fetch(`${API_BASE}/api/artworks`);
        const artworkData = await artworkResponse.json();
        if (artworkData.artworks?.length > 0) {
          const matchingArtwork = artworkData.artworks.find(art => art.article_id === slug);
          if (matchingArtwork) {
            setArtwork(matchingArtwork);
            console.log('🎨 Found matching artwork:', matchingArtwork.title);
            
            // Analyze algorithm data from artwork
            if (matchingArtwork.algorithm_parameters || matchingArtwork.emotional_data) {
              const debug = analyzeAlgorithmData(matchingArtwork);
              setAlgorithmDebug(debug);
              console.log('🔬 Algorithm data analysis:', debug);
            }
          }
        }
      } catch (artworkError) {
        console.log('⚠️ Could not fetch artwork data:', artworkError);
      }
      
      // Always set loading to false after fetching
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Error fetching article:', error);
      setError('Failed to load article. Please try again later.');
      setLoading(false);
    }
  };

  const analyzeAlgorithmData = (artworkData) => {
    const emotionalData = artworkData.emotional_data || {};
    const algorithmParams = artworkData.algorithm_parameters || {};
    
    // Check for manual algorithm indicators
    const hasEmotionalJourney = algorithmParams.emotional_journey && Object.keys(algorithmParams.emotional_journey).length > 0;
    const hasEnhancedMedicalTerms = algorithmParams.medical_terms && Object.keys(algorithmParams.medical_terms).length > 0;
    const hasStatisticalData = algorithmParams.statistical_data && algorithmParams.statistical_data.length > 0;
    const hasResearchCitations = algorithmParams.research_citations && algorithmParams.research_citations.length > 0;
    const algorithmVersion = algorithmParams.algorithm_version || 'unknown';
    
    // Calculate data completeness score
    const dataComponents = [
      hasEmotionalJourney,
      hasEnhancedMedicalTerms,
      hasStatisticalData,
      hasResearchCitations
    ];
    const completenessScore = dataComponents.filter(Boolean).length;
    
    return {
      isManualAlgorithm: hasEmotionalJourney && hasEnhancedMedicalTerms,
      hasCompleteData: completenessScore >= 3,
      completenessScore: completenessScore,
      maxScore: 4,
      algorithmVersion: algorithmVersion,
      dataBreakdown: {
        emotionalJourney: hasEmotionalJourney,
        enhancedMedicalTerms: hasEnhancedMedicalTerms,
        statisticalData: hasStatisticalData,
        researchCitations: hasResearchCitations
      },
      dataQuality: completenessScore >= 3 ? 'high' : completenessScore >= 2 ? 'medium' : 'low'
    };
  };

  const getEmotionalDataToDisplay = () => {
    if (!article) return {};
    
    // Prefer algorithm_parameters emotional data over article emotional_data
    const algorithmParams = article.algorithm_parameters || {};
    const articleEmotional = article.emotional_data || {};
    
    // If we have emotional_journey from manual algorithm, use it
    if (algorithmParams.emotional_journey) {
      const journey = algorithmParams.emotional_journey;
      
      // Convert journey values (0-1000 scale) to 0-1 scale for display
      return {
        hope: (journey.healingPotential || 0) / 1000,
        confidence: (journey.solutionConfidence || 0) / 1000,
        healing: (journey.healingPotential || 0) / 1000,
        breakthrough: (journey.innovationLevel || 0) / 1000,
        tension: (journey.problemIntensity || 0) / 1000,
        uncertainty: (journey.uncertaintyLevel || 0) / 1000,
        dominant_emotion: journey.dominantEmotion || algorithmParams.dominant_emotion || 'confidence'
      };
    }
    
    // Fall back to emotional_mix or article emotional_data
    if (algorithmParams.emotional_mix) {
      return {
        ...algorithmParams.emotional_mix,
        dominant_emotion: algorithmParams.dominant_emotion || 'confidence'
      };
    }
    
    // Final fallback to article emotional_data
    return articleEmotional;
  };

  const handleFeedbackSubmitted = async (emotion) => {
    try {
      const stateResponse = await fetch(`${API_BASE}/api/algorithm-state`);
      const newState = await stateResponse.json();
      if (onStateUpdate) {
        onStateUpdate(newState);
      }
    } catch (error) {
      console.error('Error updating algorithm state:', error);
    }
  };

  const handleSignUp = () => {
    setAuthMode('sign-up');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('sign-in');
    setShowAuthModal(true);
  };

  const processHtmlWithImages = (htmlContent) => {
    if (!htmlContent || !article.has_images) return htmlContent;
    
    // This is a simple implementation - in production you might want to use a proper HTML parser
    let processedHtml = htmlContent;
    
    // Add responsive image styles
    const imageStyles = `
      <style>
        .article-html-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .article-html-content figure {
          margin: 2rem 0;
          text-align: center;
        }
        .article-html-content figcaption {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          color: #6b7280;
          font-style: italic;
        }
      </style>
    `;
    
    return imageStyles + processedHtml;
  };

  const renderContent = () => {
    if (!article) return null;
    
    // Check if article has any content to display
    if (!article.content && !article.html_content && article.content_type !== 'pdf') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <p className="text-yellow-700">
            No content available for this article. The article may still be processing.
          </p>
        </div>
      );
    }

    switch (article.content_type) {
      case 'html':
        return (
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: processHtmlWithImages(article.html_content || article.content) }}
              className="article-html-content"
            />
            {renderInfographics()}
          </div>
        );
      
      case 'pdf':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <File className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-yellow-800">PDF Document</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              This content was uploaded as a PDF document. The algorithmic analysis has been completed, 
              but full PDF rendering is coming soon.
            </p>
            {article.file_data && (
              <div className="flex items-center space-x-4 text-sm text-yellow-600">
                <span>Filename: {article.file_data.filename}</span>
                <span>Size: {(article.file_data.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
            {renderInfographics()}
          </div>
        );
      
      default:
        return (
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap">
              {article.content}
            </div>
            {renderInfographics()}
          </div>
        );
    }
  };

  const renderInfographics = () => {
    if (!article) return null;

    const infographics = [];

    if (article.infographic_html) {
      infographics.push({
        type: 'html',
        content: article.infographic_html,
        title: 'Associated Infographic'
      });
    }

    if (article.infographics && Array.isArray(article.infographics)) {
      article.infographics.forEach((infographic, index) => {
        if (infographic.html_content) {
          infographics.push({
            type: 'html',
            content: infographic.html_content,
            title: infographic.title || `Infographic ${index + 1}`
          });
        }
      });
    }

    if (article.file_data && article.file_data.infographic_content) {
      infographics.push({
        type: 'html',
        content: article.file_data.infographic_content,
        title: 'Embedded Infographic'
      });
    }

    if (article.content_type === 'html' && article.html_content) {
      const infographicMatch = article.html_content.match(/<!-- INFOGRAPHIC START -->([\s\S]*?)<!-- INFOGRAPHIC END -->/g);
      if (infographicMatch) {
        infographicMatch.forEach((match, index) => {
          const content = match.replace(/<!-- INFOGRAPHIC START -->|<!-- INFOGRAPHIC END -->/g, '').trim();
          infographics.push({
            type: 'html',
            content: content,
            title: `Article Infographic ${index + 1}`
          });
        });
      }
    }

    if (infographics.length === 0) return null;

    return (
      <div className="mt-8">
        {infographics.map((infographic, index) => (
          <div key={index} className="mb-8">
            <div className="flex items-center mb-4">
              <Image className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">{infographic.title}</h3>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {infographic.type === 'html' ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: infographic.content }}
                  className="infographic-content"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Infographic content not available</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAlgorithmDataAnalysis = () => {
    if (!algorithmDebug) return null;

    const algorithmParams = artwork?.algorithm_parameters || {};

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

  console.log('🔍 Render check - Loading:', loading, 'Article:', !!article, 'Error:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!article || error) {
    console.log('🚫 Showing error/not found state');
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            {error || 'Article not found'}
          </h2>
          <p className="text-gray-500 mb-6">
            {error ? 'Please check the URL and try again.' : 'The article you\'re looking for doesn\'t exist.'}
          </p>
          <Link 
            to="/articles" 
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const emotionalData = getEmotionalDataToDisplay();

  console.log('✅ Rendering article page with article:', article?.title);
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16">
        <style jsx>{`
          .article-html-content {
            line-height: 1.7;
          }
          .article-html-content h1,
          .article-html-content h2,
          .article-html-content h3 {
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .article-html-content p {
            margin-bottom: 1.5rem;
          }
          .article-html-content ul,
          .article-html-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
          }
          .article-html-content li {
            margin-bottom: 0.5rem;
          }
          .article-html-content blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
          }
          .article-html-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          .article-html-content th,
          .article-html-content td {
            border: 1px solid #ddd;
            padding: 0.75rem;
            text-align: left;
          }
          .article-html-content th {
            background-color: #f8f9fa;
            font-weight: 600;
          }
          .infographic-content {
            max-width: 100%;
            overflow-x: auto;
          }
          .infographic-content img {
            max-width: 100%;
            height: auto;
          }
          .infographic-content svg {
            max-width: 100%;
            height: auto;
          }
        `}</style>

        {/* Header Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              to="/articles" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Medical Content
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {article.title}
                  </h1>
                  
                  {/* Article Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
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

                  {/* Meta Description */}
                  {article.meta_description && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {article.meta_description}
                    </p>
                  )}
                </div>

                {/* Emotional Signature */}
                {article.signature_data && (
                  <div className="ml-8">
                    <EmotionalSignature 
                      signatureData={article.signature_data}
                      emotionalData={emotionalData}
                      size={120}
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Emotional Analysis Bar */}
              {emotionalData && Object.keys(emotionalData).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
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
                            <div className="w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center text-lg"
                                 style={{ 
                                   borderColor: emotion.color,
                                   backgroundColor: isDominant ? emotion.color + '20' : 'transparent'
                                 }}>
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
              )}
            </div>

            {/* Algorithm Analysis Section */}
            <div className="px-8 py-6">
              {renderAlgorithmDataAnalysis()}
            </div>

            {/* Article Content */}
            <div className="px-8 py-8">
              {renderContent()}
            </div>

            {/* Enhanced Medical Data Insights */}
            {article.algorithm_parameters && (
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Algorithm Data Insights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Medical Terms Analysis */}
                  {article.algorithm_parameters.medical_terms && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Medical Terminology</h4>
                      <div className="space-y-2">
                        {Object.entries(article.algorithm_parameters.medical_terms).map(([category, terms]) => {
                          const termCount = Object.keys(terms || {}).length;
                          const totalSignificance = Object.values(terms || {}).reduce((sum, term) => 
                            sum + (term.significance || term.count || 0), 0
                          );
                          
                          return (
                            <div key={category} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 capitalize">
                                {category.replace(/([A-Z])/g, ' $1')}
                              </span>
                              <div className="text-right">
                                <span className="text-sm font-medium text-gray-900">{termCount} terms</span>
                                <div className="text-xs text-gray-500">
                                  Score: {totalSignificance.toFixed(1)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Statistical Data */}
                  {article.algorithm_parameters.statistical_data && article.algorithm_parameters.statistical_data.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Statistical Elements</h4>
                      <div className="space-y-2">
                        {article.algorithm_parameters.statistical_data.slice(0, 5).map((stat, index) => (
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
                        {article.algorithm_parameters.statistical_data.length > 5 && (
                          <div className="text-xs text-gray-500 text-center pt-2">
                            +{article.algorithm_parameters.statistical_data.length - 5} more statistics
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Research Citations */}
                  {article.algorithm_parameters.research_citations && article.algorithm_parameters.research_citations.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Research Citations</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Citations</span>
                          <span className="text-sm font-medium text-gray-900">
                            {article.algorithm_parameters.research_citations.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Avg. Importance</span>
                          <span className="text-sm font-medium text-gray-900">
                            {(article.algorithm_parameters.research_citations.reduce((sum, cit) => 
                              sum + (cit.importance || 0), 0) / 
                              article.algorithm_parameters.research_citations.length * 100
                            ).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Avg. Impact</span>
                          <span className="text-sm font-medium text-gray-900">
                            {(article.algorithm_parameters.research_citations.reduce((sum, cit) => 
                              sum + (cit.impact || 0), 0) / 
                              article.algorithm_parameters.research_citations.length * 100
                            ).toFixed(0)}%
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
                          {article.algorithm_parameters.algorithm_version || 'Unknown'}
                        </span>
                      </div>
                      {article.algorithm_parameters.processing_timestamp && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processed</span>
                          <span className="font-medium text-gray-900">
                            {new Date(article.algorithm_parameters.processing_timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {article.algorithm_parameters.article_word_count && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Word Count</span>
                          <span className="font-medium text-gray-900">
                            {article.algorithm_parameters.article_word_count.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {article.algorithm_parameters.data_complexity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Data Complexity</span>
                          <span className="font-medium text-gray-900">
                            {Math.round(article.algorithm_parameters.data_complexity * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Section - Access Controlled */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Emotional Feedback
                </h3>
                <p className="text-gray-600 text-sm">
                  Help the algorithm learn by sharing how this medical content makes you feel.
                  {algorithmDebug?.isManualAlgorithm && (
                    <span className="ml-1 text-blue-600 font-medium">
                      Enhanced algorithm active - your feedback has greater impact!
                    </span>
                  )}
                </p>
              </div>

              {/* Signed In - Show Feedback Form */}
              <SignedIn>
                <FeedbackForm 
                  articleId={article.id}
                  onFeedbackSubmitted={handleFeedbackSubmitted}
                />
              </SignedIn>

              {/* Signed Out - Show Access Gate */}
              <SignedOut>
                <AccessGate 
                  onEmailSignUp={handleSignUp}
                  onEmailSignIn={handleSignIn}
                />
              </SignedOut>

              {/* Article Actions */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {/* View Artwork Button */}
                  {artwork && (
                    <Link
                      to={`/gallery/${artwork.id}`}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      View Generated Artwork
                    </Link>
                  )}
                  
                  {/* Share Button */}
                  <ShareButtons 
                    content={article} 
                    type="article"
                    className="border border-blue-200"
                  />
                </div>

                {/* User Status Indicator */}
                <SignedIn>
                  <div className="text-sm text-gray-500">
                    ✓ Signed in as {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </div>
                </SignedIn>
              </div>

              {/* Enhanced Signature Information */}
              {(article.signature_data || algorithmDebug) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-1">
                    {article.signature_data && (
                      <div>
                        <span className="font-medium">Emotional Signature ID:</span> {article.signature_data.id} | 
                        <span className="font-medium"> Rarity Score:</span> {Math.round(article.signature_data.rarity_score * 100)}%
                      </div>
                    )}
                    {algorithmDebug && (
                      <div>
                        <span className="font-medium">Algorithm Quality:</span> {algorithmDebug.completenessScore}/{algorithmDebug.maxScore} components | 
                        <span className="font-medium"> Data Quality:</span> {algorithmDebug.dataQuality}
                      </div>
                    )}
                    {article.published_date && (
                      <div>
                        <span className="font-medium">Published:</span> {new Date(article.published_date).toLocaleDateString()} | 
                        <span className="font-medium"> Algorithm Version:</span> {algorithmDebug?.algorithmVersion || 'Unknown'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
};

// Sample data functions
const getSampleArticle = (id) => ({
  id,
  title: "Enhanced Biceps Tenotomy vs. Tenodesis Analysis",
  content_type: "html",
  content: `This comprehensive analysis explores the surgical decision-making process between biceps tenotomy and tenodesis procedures...`,
  subspecialty: "shoulderElbow",
  published_date: new Date().toISOString(),
  read_time: 12,
  evidence_strength: 0.85,
  meta_description: "Deep dive into biceps surgical options with enhanced algorithmic emotional analysis.",
  
  // Enhanced sample data structure matching manual algorithm
  algorithm_parameters: {
    algorithm_version: '2.0-manual-enhanced',
    evidence_strength: 0.85,
    technical_density: 0.78,
    subspecialty: 'shoulderElbow',
    dominant_emotion: 'confidence',
    
    // Complete emotional journey data
    emotional_journey: {
      problemIntensity: 180,
      solutionConfidence: 850,
      innovationLevel: 420,
      healingPotential: 760,
      uncertaintyLevel: 240,
      dominantEmotion: 'confidence'
    },
    
    // Enhanced medical terms
    medical_terms: {
      procedures: {
        "tenotomy": { count: 15, weight: 1.0, significance: 15.0 },
        "tenodesis": { count: 18, weight: 1.0, significance: 18.0 },
        "arthroscopy": { count: 8, weight: 1.0, significance: 8.0 }
      },
      anatomy: {
        "biceps": { count: 25, weight: 0.8, significance: 20.0 },
        "shoulder": { count: 20, weight: 0.8, significance: 16.0 },
        "labrum": { count: 12, weight: 0.8, significance: 9.6 }
      },
      outcomes: {
        "satisfaction": { count: 10, weight: 1.2, significance: 12.0 },
        "function": { count: 8, weight: 1.2, significance: 9.6 }
      }
    },
    
    // Statistical data array
    statistical_data: [
      { type: "percentages", value: 91, significance: 0.91, rawText: "91% satisfaction" },
      { type: "percentages", value: 96, significance: 0.96, rawText: "96% satisfaction" },
      { type: "pValues", value: 0.03, significance: 0.97, rawText: "p < 0.03" }
    ],
    
    // Research citations
    research_citations: [
      { index: 0, importance: 0.9, impact: 0.95 },
      { index: 1, importance: 0.85, impact: 0.9 },
      { index: 2, importance: 0.8, impact: 0.85 }
    ],
    
    processing_timestamp: new Date().toISOString(),
    article_word_count: 2847,
    data_complexity: 0.82
  },
  
  signature_data: {
    id: "AKX-SAMPLE-ENHANCED",
    rarity_score: 0.84,
    concentric_rings: { count: 5, thickness: 3, rotation_speed: 1.2 },
    geometric_overlays: { shape: "circle", color: "#3498db", scale: 1.1 },
    floating_particles: { count: 12, color: "#3498db" }
  }
});

const getSampleArtwork = (articleId) => ({
  id: `artwork-${articleId}`,
  article_id: articleId,
  title: "Enhanced Algorithmic Synthesis #AKX-SAMPLE-ENHANCED",
  dominant_emotion: "confidence",
  created_date: new Date().toISOString()
});

export default ArticlePage;
