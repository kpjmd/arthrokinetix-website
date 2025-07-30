import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Eye, Palette, Award, Calendar, Tag, X, Zap, Activity, Database, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import NFTMintButton, { NFTInfoPanel } from '../components/NFTMintButton';
import RealArthrokinetixArtwork from '../components/RealArthrokinetixArtwork';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ArtworkDetail = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [algorithmDebug, setAlgorithmDebug] = useState(null);

  useEffect(() => {
    fetchArtwork();
  }, [id]);

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [fullscreen]);

  const fetchArtwork = async () => {
    // Enhanced ID validation
    if (!id) {
      console.error('Cannot fetch artwork: id is undefined');
      setError('Invalid artwork URL - no artwork ID provided');
      setLoading(false);
      return;
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.error('Invalid artwork ID format:', id);
      setError('Invalid artwork ID format');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('🎨 Fetching artwork with ID:', id);
      console.log('🌐 API Base:', API_BASE);
      console.log('🔗 Full URL:', `${API_BASE}/api/artworks/${id}`);
      
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const artworkResponse = await fetch(`${API_BASE}/api/artworks/${id}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Response status:', artworkResponse.status);
        console.log('📡 Response ok:', artworkResponse.ok);
        
        if (artworkResponse.ok) {
          const artworkData = await artworkResponse.json();
          
          console.log('📊 Received artwork data:', {
            hasData: !!artworkData,
            title: artworkData?.title,
            id: artworkData?.id,
            hasMetadata: !!artworkData?.metadata,
            hasAlgorithmParams: !!artworkData?.algorithm_parameters
          });
          
          // Validate artwork data
          if (!artworkData || !artworkData.id) {
            setError('Invalid artwork data received from server');
            setLoading(false);
            return;
          }
          
          setArtwork(artworkData);
          
          // Analyze algorithm data quality
          const debug = analyzeAlgorithmData(artworkData);
          setAlgorithmDebug(debug);
          console.log('🔬 Algorithm data analysis:', debug);
          
          // Fetch associated article if available
          if (artworkData.article_id) {
            try {
              const articleController = new AbortController();
              const articleTimeoutId = setTimeout(() => articleController.abort(), 10000);
              
              const articleResponse = await fetch(`${API_BASE}/api/articles/${artworkData.article_id}`, {
                signal: articleController.signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              });
              
              clearTimeout(articleTimeoutId);
              
              if (articleResponse.ok) {
                const articleData = await articleResponse.json();
                setArticle(articleData);
                console.log('📖 Found associated article:', articleData.title);
              }
            } catch (articleError) {
              if (articleError.name === 'AbortError') {
                console.log('⏱️ Article fetch timed out');
              } else {
                console.log('⚠️ Could not fetch associated article:', articleError);
              }
            }
          }
        } else {
          // If specific artwork not found, try fetching from list as fallback
          console.log('🔄 Artwork not found directly, searching in list...');
          
          try {
            const listController = new AbortController();
            const listTimeoutId = setTimeout(() => listController.abort(), 10000);
            
            const allArtworksResponse = await fetch(`${API_BASE}/api/artworks`, {
              signal: listController.signal,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
              }
            });
            
            clearTimeout(listTimeoutId);
            
            if (allArtworksResponse.ok) {
              const allArtworks = await allArtworksResponse.json();
              const foundArtwork = allArtworks.artworks?.find(art => art.id === id);
              
              if (foundArtwork) {
                console.log('✅ Found artwork in list:', foundArtwork.title);
                setArtwork(foundArtwork);
                
                const debug = analyzeAlgorithmData(foundArtwork);
                setAlgorithmDebug(debug);
                
                // Try to fetch associated article
                if (foundArtwork.article_id) {
                  try {
                    const articleResponse = await fetch(`${API_BASE}/api/articles/${foundArtwork.article_id}`);
                    if (articleResponse.ok) {
                      const articleData = await articleResponse.json();
                      setArticle(articleData);
                    }
                  } catch (error) {
                    console.log('Could not fetch associated article');
                  }
                }
              } else {
                // Artwork not found anywhere
                const errorText = await artworkResponse.text().catch(() => 'Unknown error');
                console.error(`Artwork not found: ${artworkResponse.status} ${artworkResponse.statusText}`, errorText);
                
                if (artworkResponse.status === 404) {
                  setError('Artwork not found - this artwork may have been removed or the link is incorrect');
                } else if (artworkResponse.status >= 500) {
                  setError('Server error - please try again in a few moments');
                } else {
                  setError(`Failed to load artwork (Error ${artworkResponse.status}). Please try again later.`);
                }
                setLoading(false);
                return;
              }
            } else {
              throw new Error('Failed to fetch artwork list');
            }
          } catch (listError) {
            if (listError.name === 'AbortError') {
              setError('Request timed out - please check your connection and try again');
            } else {
              setError('Artwork not found');
            }
            setLoading(false);
            return;
          }
        }
        
        setLoading(false);
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('⏱️ Artwork fetch timed out');
          setError('Request timed out - please check your connection and try again');
        } else {
          throw fetchError; // Re-throw to be caught by outer catch
        }
        setLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Error fetching artwork:', {
        message: error.message,
        stack: error.stack,
        url: window.location.href,
        apiBase: API_BASE,
        artworkId: id
      });
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error - please check your internet connection and try again');
      } else {
        setError('Failed to load artwork. Please try again later.');
      }
      setLoading(false);
    }
  };

  const analyzeAlgorithmData = (artworkData) => {
    const params = artworkData.algorithm_parameters || {};
    const metadata = artworkData.metadata || {};
    
    // Check for manual algorithm indicators
    const hasEmotionalJourney = params.emotional_journey && Object.keys(params.emotional_journey).length > 0;
    const hasEnhancedMedicalTerms = params.medical_terms && Object.keys(params.medical_terms).length > 0;
    const hasStatisticalData = params.statistical_data && params.statistical_data.length > 0;
    const hasResearchCitations = params.research_citations && params.research_citations.length > 0;
    const algorithmVersion = params.algorithm_version || metadata.algorithm_version || 'unknown';
    
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

  const handleMintNFT = () => {
    // Placeholder for future Manifold integration
    alert(`NFT minting for artwork "${artwork.title}" will be available soon via Manifold integration!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Check out this algorithmic artwork generated from medical content: ${artwork.title}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Artwork link copied to clipboard!');
    }
  };

  // Enhanced Algorithm Analysis Component
  const EnhancedAlgorithmAnalysis = ({ algorithmParameters, metadata, debugInfo }) => {
    if (!algorithmParameters) return null;

    // Get metrics from manual algorithm or fallback to basic values
    const metrics = [
      {
        label: 'Evidence Strength',
        value: algorithmParameters.evidence_strength || 0.5,
        description: 'Research quality'
      },
      {
        label: 'Technical Density', 
        value: algorithmParameters.technical_density || 0.5,
        description: 'Terminology depth'
      },
      {
        label: 'Data Complexity',
        value: algorithmParameters.data_complexity || 0.5,
        description: 'Content analysis'
      }
    ];

    // Enhanced stats from manual algorithm
    const stats = {
      words: algorithmParameters.article_word_count || 0,
      medicalTerms: algorithmParameters.medical_terms ? 
        Object.values(algorithmParameters.medical_terms).reduce((sum, category) => 
          sum + Object.keys(category || {}).length, 0
        ) : 0,
      statistics: algorithmParameters.statistical_data?.length || 0,
      citations: algorithmParameters.research_citations?.length || 0,
      visualElements: algorithmParameters.visual_elements?.length || 0
    };

    return (
      <div className="space-y-6">
        {/* Algorithm Quality Indicator */}
        {debugInfo && (
          <div className={`p-4 rounded-lg border-2 ${
            debugInfo.isManualAlgorithm 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {debugInfo.isManualAlgorithm ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                )}
                <span className={`font-medium ${
                  debugInfo.isManualAlgorithm ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {debugInfo.isManualAlgorithm ? 'Enhanced Algorithm v2.0' : 'Standard Algorithm v1.0'}
                </span>
              </div>
              <span className={`text-sm ${
                debugInfo.isManualAlgorithm ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {debugInfo.completenessScore}/{debugInfo.maxScore} data components
              </span>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const percentage = Math.round((metric.value || 0) * 100);
            const color = percentage > 75 ? '#27ae60' : percentage > 50 ? '#f39c12' : '#e74c3c';
            
            return (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold mb-2" style={{ color }}>
                  {percentage}%
                </div>
                <div className="text-sm font-medium text-gray-700">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </div>
            );
          })}
        </div>
        
        {/* Key Processing Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{stats.words.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Source Words</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-secondary">{stats.medicalTerms}</div>
            <div className="text-xs text-gray-500">Medical Terms</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-accent">{stats.visualElements}</div>
            <div className="text-xs text-gray-500">Visual Elements</div>
          </div>
        </div>
        
        {/* Data Breakdown */}
        {debugInfo && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Data Components Available</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(debugInfo.dataBreakdown).map(([component, available]) => (
                <div key={component} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-400' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700 capitalize">
                    {component.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Algorithm Info */}
        <div className="text-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            Generated by Arthrokinetix Algorithm v{algorithmParameters.algorithm_version || metadata?.algorithm_version || '2.0'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {algorithmParameters.processing_timestamp 
              ? new Date(algorithmParameters.processing_timestamp).toLocaleDateString()
              : 'Processing date unavailable'
            }
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Emotional Analysis Component
  const EnhancedEmotionalAnalysis = ({ algorithmParameters, dominantEmotion }) => {
    if (!algorithmParameters) {
      return (
        <div className="text-gray-500 text-sm italic">
          No emotional analysis data available
        </div>
      );
    }

    // Try to get emotional data from various sources
    let emotionalData = {};
    let dataSource = 'none';

    // Prefer emotional_mix as it's already in 0-1 scale and more reliable
    if (algorithmParameters.emotional_mix && Object.keys(algorithmParameters.emotional_mix).length > 0) {
      emotionalData = algorithmParameters.emotional_mix;
      dataSource = 'emotional_mix';
    }
    // Fall back to emotional journey (convert from 0-1000 scale)
    else if (algorithmParameters.emotional_journey && Object.keys(algorithmParameters.emotional_journey).length > 0) {
      const journey = algorithmParameters.emotional_journey;
      
      // Convert journey values (0-1000 scale) to 0-1 scale for display
      emotionalData = {
        hope: (journey.healingPotential || 0) / 1000,
        confidence: (journey.solutionConfidence || 0) / 1000,
        healing: (journey.healingPotential || 0) / 1000,
        breakthrough: (journey.innovationLevel || 0) / 1000,
        tension: (journey.problemIntensity || 0) / 1000,
        uncertainty: (journey.uncertaintyLevel || 0) / 1000
      };
      dataSource = 'emotional_journey';
    } 
    // Final fallback
    else {
      emotionalData = {
        hope: 0.5,
        confidence: 0.6,
        healing: 0.4,
        breakthrough: 0.3,
        tension: 0.2,
        uncertainty: 0.3
      };
      dataSource = 'fallback';
    }

    const emotionColors = {
      hope: '#27ae60',
      tension: '#e74c3c',
      confidence: '#3498db',
      uncertainty: '#95a5a6',
      breakthrough: '#f39c12',
      healing: '#16a085'
    };

    const emotionLabels = {
      hope: 'Hope',
      tension: 'Tension', 
      confidence: 'Confidence',
      uncertainty: 'Uncertain',
      breakthrough: 'Innovation',
      healing: 'Healing'
    };

    const emotionDescriptions = {
      hope: 'Recovery potential',
      tension: 'Risks & challenges',
      confidence: 'Evidence strength',
      uncertainty: 'Need for research',
      breakthrough: 'Novel approaches',
      healing: 'Therapeutic potential'
    };

    return (
      <div className="space-y-4">
        {/* Data source indicator */}
        <div className="text-xs text-gray-500 mb-4">
          Source: {dataSource === 'emotional_mix' ? 'Processed Emotional Mix' : 
                   dataSource === 'emotional_journey' ? 'Raw Emotional Journey' : 'Sample Data'}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(emotionalData).map(([emotion, intensity]) => {
            const percentage = Math.round(intensity * 100);
            const isDominant = emotion === dominantEmotion;
            
            return (
              <div key={emotion} className={`p-3 rounded-lg border ${isDominant ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: emotionColors[emotion] }}
                    />
                    <span className={`text-sm font-medium truncate ${isDominant ? 'text-yellow-800' : ''}`}>
                      {emotionLabels[emotion]}
                    </span>
                    {isDominant && <span className="ml-1 text-xs text-yellow-600">★</span>}
                  </div>
                  <span className={`text-sm font-bold ml-2 ${isDominant ? 'text-yellow-800' : ''}`}>
                    {percentage}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: emotionColors[emotion]
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-600">
                  {emotionDescriptions[emotion]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Enhanced Medical Terms Component
  const EnhancedMedicalTerms = ({ algorithmParameters }) => {
    const medicalTerms = algorithmParameters?.medical_terms;
    
    if (!medicalTerms || Object.keys(medicalTerms).length === 0) {
      return (
        <div className="text-gray-500 text-sm italic">
          No medical terms analyzed
        </div>
      );
    }

    const categoryColors = {
      procedures: '#e74c3c',
      anatomy: '#3498db',
      outcomes: '#27ae60',
      research: '#f39c12'
    };

    const categoryLabels = {
      procedures: 'Procedures',
      anatomy: 'Anatomy',
      outcomes: 'Outcomes', 
      research: 'Research'
    };

    return (
      <div className="space-y-4">
        {/* Category Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(medicalTerms).map(([category, terms]) => {
            const termCount = Object.keys(terms || {}).length;
            const totalSignificance = Object.values(terms || {}).reduce((sum, term) => 
              sum + (term.significance || term.count || 0), 0
            );
            
            if (termCount === 0) return null;

            return (
              <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                <div 
                  className="text-xl font-bold mb-1"
                  style={{ color: categoryColors[category] }}
                >
                  {termCount}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {categoryLabels[category]}
                </div>
                <div className="text-xs text-gray-500">
                  Score: {totalSignificance.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Terms Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(medicalTerms).slice(0, 2).map(([category, terms]) => {
            const termCount = Object.keys(terms || {}).length;
            if (termCount === 0) return null;

            const topTerms = Object.entries(terms)
              .sort(([,a], [,b]) => (b.significance || b.count || 0) - (a.significance || a.count || 0))
              .slice(0, 4);

            return (
              <div key={category} className="border rounded-lg p-3">
                <h4 
                  className="font-medium mb-2 flex items-center"
                  style={{ color: categoryColors[category] }}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: categoryColors[category] }}
                  />
                  {categoryLabels[category]} ({termCount})
                </h4>
                
                <div className="space-y-1">
                  {topTerms.map(([term, data]) => (
                    <div key={term} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate">{term}</span>
                      <span className="text-gray-500 ml-2">
                        ×{data.count || 0} ({(data.significance || 0).toFixed(1)})
                      </span>
                    </div>
                  ))}
                  {termCount > 4 && (
                    <div className="text-xs text-gray-500">
                      +{termCount - 4} more...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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

  if (error || !artwork) {
    console.log('🚫 Showing error/not found state:', { error, hasArtwork: !!artwork });
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Artwork Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'This artwork could not be found or loaded'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                fetchArtwork();
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/gallery"
              className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Artwork not found</h2>
          <Link to="/gallery" className="btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/gallery"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Gallery
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFullscreen(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-5 h-5 mr-2" />
                Fullscreen
              </button>
              
              <NFTMintButton 
                artwork={artwork}
                size="default"
                className="px-4 py-2"
              />
              
              {artwork && (
                <ShareButtons 
                  content={artwork} 
                  type="artwork"
                  className="bg-primary text-white hover:bg-primary/90"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Artwork Display */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-6 p-4">
                <div className="w-full flex items-center justify-center">
                  <RealArthrokinetixArtwork 
                    artwork={artwork} 
                    width={Math.min(window.innerWidth - 100, 500)} 
                    height={Math.min(window.innerWidth - 100, 500)}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-primary mb-2">{artwork.title}</h1>
                <p className="text-gray-600 mb-2">
                  Generated on {formatDate(artwork.created_date)}
                </p>
                {algorithmDebug && (
                  <div className="flex items-center justify-center space-x-2">
                    {algorithmDebug.isManualAlgorithm ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className={`text-sm ${
                      algorithmDebug.isManualAlgorithm ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {algorithmDebug.isManualAlgorithm ? 'Enhanced Algorithm' : 'Standard Algorithm'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Metadata Panel */}
          <div className="space-y-8">
            {/* Basic Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4">Artwork Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subspecialty:</span>
                  <span className="font-medium capitalize">
                    {artwork.subspecialty?.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dominant Emotion:</span>
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getEmotionColorLocal(artwork.dominant_emotion) }}
                    />
                    <span className="font-medium capitalize">{artwork.dominant_emotion}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rarity Score:</span>
                  <span className="font-medium">
                    {artwork.metadata?.rarity_score ? `${Math.round(artwork.metadata.rarity_score * 100)}%` : 'Common'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data Quality:</span>
                  <span className={`font-medium ${
                    algorithmDebug?.dataQuality === 'high' ? 'text-green-600' :
                    algorithmDebug?.dataQuality === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {algorithmDebug?.dataQuality?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Creation Parameters */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Creation Parameters
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Algorithm Version:</span>
                  <span className={`font-medium px-2 py-1 rounded text-sm ${
                    algorithmDebug?.isManualAlgorithm 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {algorithmDebug?.isManualAlgorithm ? 'Enhanced v2.0' : 'Standard v1.0'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Content Complexity:</span>
                  <span className="font-medium">
                    {artwork.algorithm_parameters?.readability_score ? 
                      (artwork.algorithm_parameters.readability_score > 0.7 ? 'Simple' : 
                       artwork.algorithm_parameters.readability_score > 0.4 ? 'Moderate' : 'Complex') : 'Unknown'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Research Confidence:</span>
                  <span className="font-medium">
                    {artwork.algorithm_parameters?.certainty_level ? 
                      (artwork.algorithm_parameters.certainty_level > 0.7 ? 'Definitive' : 
                       artwork.algorithm_parameters.certainty_level > 0.4 ? 'Moderate' : 'Exploratory') : 'Unknown'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Evidence Strength:</span>
                  <span className="font-medium">
                    {artwork.algorithm_parameters?.evidence_strength ? 
                      `${Math.round(artwork.algorithm_parameters.evidence_strength * 100)}%` : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Technical Density:</span>
                  <span className="font-medium">
                    {artwork.algorithm_parameters?.technical_density ? 
                      `${Math.round(artwork.algorithm_parameters.technical_density * 100)}%` : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Source Article Link */}
            {article && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold mb-4">Source Article</h3>
                <p className="text-blue-100 mb-4 line-clamp-3">{article.title}</p>
                <div className="flex items-center justify-between text-sm text-blue-200 mb-4">
                  <span>Evidence: {Math.round((article.evidence_strength || 0) * 100)}%</span>
                  <span>{article.read_time || 5} min read</span>
                </div>
                <Link 
                  to={`/articles/${article.id}`}
                  className="inline-flex items-center bg-white text-primary px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Read Article
                </Link>
              </motion.div>
            )}

            {/* Enhanced Algorithm Analysis */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Algorithm Analysis
              </h3>
              <EnhancedAlgorithmAnalysis 
                algorithmParameters={artwork.algorithm_parameters}
                metadata={artwork.metadata}
                debugInfo={algorithmDebug}
              />
            </motion.div>

            {/* Enhanced Emotional Analysis */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Emotional Profile
              </h3>
              <EnhancedEmotionalAnalysis 
                algorithmParameters={artwork.algorithm_parameters}
                dominantEmotion={artwork.dominant_emotion}
              />
            </motion.div>

            {/* Enhanced Medical Content Analysis */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Medical Content Analysis
              </h3>
              <EnhancedMedicalTerms algorithmParameters={artwork.algorithm_parameters} />
            </motion.div>


            {/* SVG Metadata Section - Key for collectors */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4">SVG Metadata</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Signature ID:</span>
                  <span className="font-mono text-sm text-gray-900">
                    {artwork.metadata?.signature_id || 'Not Available'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Generation Method:</span>
                  <span className="font-medium">
                    {algorithmDebug?.isManualAlgorithm ? 'Enhanced Algorithm v2.0' : 'Standard Algorithm v1.0'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Visual Elements:</span>
                  <span className="font-medium">
                    {artwork.algorithm_parameters?.visual_elements?.length || 0} components
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data Quality Score:</span>
                  <span className="font-medium">
                    {algorithmDebug?.completenessScore || 0}/{algorithmDebug?.maxScore || 4}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rarity Classification:</span>
                  <span className="font-medium">
                    {artwork.metadata?.rarity_score >= 0.8 ? 'Legendary' :
                     artwork.metadata?.rarity_score >= 0.6 ? 'Rare' :
                     artwork.metadata?.rarity_score >= 0.3 ? 'Uncommon' : 'Common'}
                     {artwork.metadata?.rarity_score ? ` (${Math.round(artwork.metadata.rarity_score * 100)}%)` : ''}
                  </span>
                </div>

                {artwork.algorithm_parameters?.processing_timestamp && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Generated:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(artwork.algorithm_parameters.processing_timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
        >
          <div className="w-full h-full flex items-center justify-center">
            <RealArthrokinetixArtwork 
              artwork={artwork} 
              width={Math.min(window.innerWidth - 50, window.innerHeight - 50)} 
              height={Math.min(window.innerWidth - 50, window.innerHeight - 50)}
            />
          </div>
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const getEmotionColorLocal = (emotion) => {
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

// Enhanced sample artwork with manual algorithm structure
const getSampleArtwork = (id) => ({
  id: id,
  title: `Algorithmic Synthesis #AKX-2024-${id.slice(0, 4).toUpperCase()}`,
  subspecialty: 'shoulderElbow',
  dominant_emotion: 'confidence',
  created_date: '2024-03-01',
  article_id: `article-${id}`,
  
  // Enhanced algorithm parameters matching manual algorithm output
  algorithm_parameters: {
    algorithm_version: '2.0-manual-enhanced',
    evidence_strength: 0.85,
    technical_density: 0.78,
    subspecialty: 'shoulderElbow',
    dominant_emotion: 'confidence',
    data_complexity: 0.82,
    emotional_intensity: 0.85,
    
    // Complete emotional journey data
    emotional_journey: {
      problemIntensity: 120,
      solutionConfidence: 850,
      innovationLevel: 340,
      healingPotential: 760,
      uncertaintyLevel: 180,
      dominantEmotion: 'confidence'
    },
    
    // Emotional mix for compatibility
    emotional_mix: {
      hope: 0.76,
      confidence: 0.85,
      healing: 0.76,
      breakthrough: 0.34,
      tension: 0.12,
      uncertainty: 0.18
    },
    
    // Enhanced medical terms
    medical_terms: {
      procedures: {
        "tenotomy": { count: 8, weight: 1.0, significance: 8.0 },
        "tenodesis": { count: 12, weight: 1.0, significance: 12.0 },
        "arthroscopy": { count: 6, weight: 1.0, significance: 6.0 }
      },
      anatomy: {
        "biceps": { count: 18, weight: 0.8, significance: 14.4 },
        "shoulder": { count: 15, weight: 0.8, significance: 12.0 },
        "labrum": { count: 7, weight: 0.8, significance: 5.6 }
      },
      outcomes: {
        "satisfaction": { count: 8, weight: 1.2, significance: 9.6 },
        "function": { count: 10, weight: 1.2, significance: 12.0 }
      },
      research: {
        "study": { count: 12, weight: 0.9, significance: 10.8 },
        "evidence": { count: 9, weight: 0.9, significance: 8.1 }
      }
    },
    
    // Statistical data array
    statistical_data: [
      { type: "percentages", value: 92, significance: 0.92, rawText: "92% satisfaction" },
      { type: "pValues", value: 0.03, significance: 0.97, rawText: "p < 0.03" },
      { type: "sampleSizes", value: 247, significance: 0.25, rawText: "n = 247" },
      { type: "followUp", value: 24, significance: 0.4, rawText: "24 months" }
    ],
    
    // Research citations
    research_citations: [
      { index: 0, importance: 0.9, impact: 0.95 },
      { index: 1, importance: 0.85, impact: 0.9 },
      { index: 2, importance: 0.8, impact: 0.85 }
    ],
    
    // Visual elements
    visual_elements: [
      { type: 'andryRoot', x: 400, y: 640, angle: 225, length: 60, thickness: 4, color: '#3498db' },
      { type: 'healingParticle', x: 350, y: 200, size: 6, color: '#16a085' },
      { type: 'dataFlow', startX: 50, startY: 100, endX: 750, endY: 500, thickness: 3, color: '#e74c3c' }
    ],
    
    processing_timestamp: '2024-03-01T10:30:15.492Z',
    article_word_count: 2847,
    tree_complexity: 0.85,
    healing_elements: 0.76
  },
  
  metadata: { 
    rarity_score: 0.84,
    algorithm_version: '2.0-manual-enhanced',
    signature_id: `AKX-2024-${id.slice(0, 4).toUpperCase()}`,
    generation_timestamp: '2024-03-01T10:30:15.492Z'
  },
  nft_status: 'available'
});

const getSampleArticle = (artworkId) => ({
  id: `article-${artworkId}`,
  title: "Enhanced Biceps Tenotomy vs. Tenodesis: Manual Algorithm Analysis",
  evidence_strength: 0.85,
  read_time: 12,
  subspecialty: 'shoulderElbow'
});

export default ArtworkDetail;
