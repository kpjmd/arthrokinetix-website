import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Eye, Palette, Award, Calendar, Tag, X, Zap } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import NFTMintButton, { NFTInfoPanel } from '../components/NFTMintButton';
import RealArthrokinetixArtwork from '../components/RealArthrokinetixArtwork';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ArtworkDetail = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    fetchArtwork();
  }, [id]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      
      // Fetch artwork details
      const artworkResponse = await fetch(`${API_BASE}/api/artworks/${id}`);
      if (artworkResponse.ok) {
        const artworkData = await artworkResponse.json();
        setArtwork(artworkData);
        
        // Fetch associated article if available
        if (artworkData.article_id) {
          const articleResponse = await fetch(`${API_BASE}/api/articles/${artworkData.article_id}`);
          if (articleResponse.ok) {
            const articleData = await articleResponse.json();
            setArticle(articleData);
          }
        }
      } else {
        // If specific artwork not found, get from list
        const allArtworksResponse = await fetch(`${API_BASE}/api/artworks`);
        const allArtworks = await allArtworksResponse.json();
        const foundArtwork = allArtworks.artworks?.find(art => art.id === id);
        if (foundArtwork) {
          setArtwork(foundArtwork);
          
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
        }
      }
    } catch (error) {
      console.error('Error fetching artwork:', error);
      // Set sample artwork for demo
      setArtwork(getSampleArtwork(id));
      setArticle(getSampleArticle(id));
    } finally {
      setLoading(false);
    }
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

  // Add this component for displaying medical terms
  const MedicalTermsDisplay = ({ medicalTerms }) => {
    if (!medicalTerms || Object.keys(medicalTerms).length === 0) {
      return (
        <div className="text-gray-500 text-sm italic">
          No medical terms data available for this artwork
        </div>
      );
    }

    const categoryColors = {
      procedures: '#e74c3c',
      anatomy: '#3498db',
      outcomes: '#27ae60',
      research: '#f39c12'
    };

  return (
    <div className="space-y-4">
      {Object.entries(medicalTerms).map(([category, terms]) => {
        const termCount = Object.keys(terms || {}).length;
        if (termCount === 0) return null;

        return (
          <div key={category} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 
                className="font-semibold capitalize flex items-center"
                style={{ color: categoryColors[category] }}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                {category.replace(/([A-Z])/g, ' $1')} ({termCount} terms)
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(terms).slice(0, 8).map(([term, data]) => (
                <div key={term} className="flex justify-between text-sm">
                  <span className="text-gray-700">{term}</span>
                  <span className="text-gray-500">×{data.count}</span>
                </div>
              ))}
            </div>
            
            {Object.keys(terms).length > 8 && (
              <div className="text-xs text-gray-500 mt-2">
                +{Object.keys(terms).length - 8} more terms...
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Add this component for displaying statistical data
const StatisticalDataDisplay = ({ statisticalData }) => {
  if (!statisticalData || statisticalData.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No statistical data found in this article
      </div>
    );
  }

  const typeColors = {
    percentages: '#e74c3c',
    pValues: '#f39c12',
    sampleSizes: '#27ae60',
    followUp: '#3498db',
    satisfaction: '#9b59b6',
    success: '#1abc9c'
  };

  return (
    <div className="space-y-3">
      {statisticalData.slice(0, 10).map((stat, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-3"
              style={{ backgroundColor: typeColors[stat.type] || '#95a5a6' }}
            />
            <div>
              <div className="font-medium text-sm capitalize">
                {stat.type.replace(/([A-Z])/g, ' $1')}
              </div>
              {stat.context && (
                <div className="text-xs text-gray-500 max-w-md truncate">
                  {stat.context}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{stat.value}</div>
            <div className="text-xs text-gray-500">
              Significance: {Math.round((stat.significance || 0) * 100)}%
            </div>
          </div>
        </div>
      ))}
      
      {statisticalData.length > 10 && (
        <div className="text-center text-sm text-gray-500">
          +{statisticalData.length - 10} more statistics analyzed...
        </div>
      )}
    </div>
  );
};

// Add this component for displaying research citations
const ResearchCitationsDisplay = ({ researchCitations }) => {
  if (!researchCitations || researchCitations.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No research citations detected in this article
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {researchCitations.slice(0, 8).map((citation, index) => (
        <div key={index} className="p-3 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-sm text-gray-700 mb-1">
                {citation.context || `Research Reference ${index + 1}`}
              </div>
              <div className="flex space-x-4 text-xs text-gray-500">
                <span>Importance: {Math.round((citation.importance || 0) * 100)}%</span>
                <span>Impact: {Math.round((citation.impact || 0) * 100)}%</span>
                {citation.pattern_type !== undefined && (
                  <span>Type: {citation.pattern_type}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {researchCitations.length > 8 && (
        <div className="text-center text-sm text-gray-500">
          +{researchCitations.length - 8} more citations analyzed...
        </div>
      )}
    </div>
  );
};

// Add this component for emotional analysis breakdown
const EmotionalAnalysisDisplay = ({ emotionalMix, dominantEmotion }) => {
  if (!emotionalMix) {
    return (
      <div className="text-gray-500 text-sm italic">
        No emotional analysis data available
      </div>
    );
  }

  const emotionColors = {
    hope: '#27ae60',
    tension: '#e74c3c',
    confidence: '#3498db',
    uncertainty: '#95a5a6',
    breakthrough: '#f39c12',
    healing: '#16a085'
  };

  const emotionDescriptions = {
    hope: 'Recovery potential and positive outcomes',
    tension: 'Complications, risks, and challenges',
    confidence: 'Evidence strength and certainty',
    uncertainty: 'Ambiguous results, need for research',
    breakthrough: 'Innovation and novel approaches',
    healing: 'Therapeutic potential and restoration'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(emotionalMix).map(([emotion, intensity]) => {
          const percentage = Math.round(intensity * 100);
          const isDominant = emotion === dominantEmotion;
          
          return (
            <div key={emotion} className={`p-4 rounded-lg border-2 ${isDominant ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: emotionColors[emotion] }}
                  />
                  <span className={`font-medium capitalize ${isDominant ? 'text-yellow-800' : ''}`}>
                    {emotion}
                    {isDominant && <span className="ml-1 text-xs">(Dominant)</span>}
                  </span>
                </div>
                <span className={`font-bold ${isDominant ? 'text-yellow-800' : ''}`}>
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

// Add this component for algorithm complexity metrics
const AlgorithmComplexityDisplay = ({ algorithmParameters }) => {
  if (!algorithmParameters) return null;

  const metrics = [
    {
      label: 'Evidence Strength',
      value: algorithmParameters.evidence_strength,
      description: 'Quality and quantity of research cited'
    },
    {
      label: 'Technical Density', 
      value: algorithmParameters.technical_density,
      description: 'Complexity of medical terminology used'
    },
    {
      label: 'Tree Complexity',
      value: algorithmParameters.tree_complexity,
      description: 'Algorithmic complexity of visual structure'
    },
    {
      label: 'Data Complexity',
      value: algorithmParameters.data_complexity,
      description: 'Overall richness of extracted medical data'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map((metric, index) => {
        const percentage = Math.round((metric.value || 0) * 100);
        const color = percentage > 75 ? '#27ae60' : percentage > 50 ? '#f39c12' : '#e74c3c';
        
        return (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">{metric.label}</span>
              <span className="font-bold" style={{ color }}>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%`, backgroundColor: color }}
              />
            </div>
            <div className="text-xs text-gray-600">
              {metric.description}
            </div>
          </div>
        );
      })}
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
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-6 p-4">
                <RealArthrokinetixArtwork 
                  artwork={artwork} 
                  width={400} 
                  height={400}
                />
              </div>
              
              <div className="text-center">
                <h1 className="text-2xl font-bold text-primary mb-2">{artwork.title}</h1>
                <p className="text-gray-600">
                  Generated on {formatDate(artwork.created_date)}
                </p>
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
                  <span className="text-gray-600">NFT Status:</span>
                  <span className={`font-medium ${artwork.nft_status === 'minted' ? 'text-green-600' : 'text-gray-600'}`}>
                    {artwork.nft_status === 'minted' ? 'Minted' : 'Available'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Algorithm Version:</span>
                  <span className="font-medium">{artwork.metadata?.algorithm_version || '2.0'}</span>
                </div>

                {artwork.metadata?.signature_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Signature ID:</span>
                    <span className="font-medium text-sm">{artwork.metadata.signature_id}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Algorithm Parameters */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4">Algorithm Parameters</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tree Complexity:</span>
                    <span className="font-medium">
                      {Math.round((artwork.algorithm_parameters?.tree_complexity || 0.5) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-gradient-to-r from-secondary to-primary rounded"
                      style={{ width: `${(artwork.algorithm_parameters?.tree_complexity || 0.5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Emotional Intensity:</span>
                    <span className="font-medium">
                      {Math.round((artwork.algorithm_parameters?.emotional_intensity || 0.5) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-gradient-to-r from-healing to-innovation rounded"
                      style={{ width: `${(artwork.algorithm_parameters?.emotional_intensity || 0.5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Healing Elements:</span>
                    <span className="font-medium">
                      {Math.round((artwork.algorithm_parameters?.healing_elements || 0.5) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-gradient-to-r from-healing to-success rounded"
                      style={{ width: `${(artwork.algorithm_parameters?.healing_elements || 0.5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Source Article Link */}
            {article && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
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

            {/* Algorithm Analysis Section */}
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 1.0 }}
  className="bg-white rounded-xl p-6 shadow-lg"
>
  <h3 className="text-xl font-bold text-primary mb-4">Algorithm Analysis</h3>
  
  <div className="space-y-6">
    {/* Complexity Metrics */}
    <div>
      <h4 className="font-semibold text-gray-700 mb-3">Processing Complexity</h4>
      <AlgorithmComplexityDisplay algorithmParameters={artwork.algorithm_parameters} />
    </div>
    
    {/* Article Statistics */}
    {artwork.algorithm_parameters?.article_word_count && (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {artwork.algorithm_parameters.article_word_count.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Words Analyzed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">
            {artwork.algorithm_parameters.uniqueness_factors?.term_diversity || 0}
          </div>
          <div className="text-xs text-gray-500">Unique Terms</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-healing">
            {artwork.algorithm_parameters.statistical_data?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Statistics</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-innovation">
            {artwork.algorithm_parameters.research_citations?.length || 0}
          </div>
          <div className="text-xs text-gray-500">Citations</div>
        </div>
      </div>
    )}
  </div>
</motion.div>

{/* Emotional Analysis Section */}
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 1.2 }}
  className="bg-white rounded-xl p-6 shadow-lg"
>
  <h3 className="text-xl font-bold text-primary mb-4">Emotional Analysis</h3>
  
  <EmotionalAnalysisDisplay 
    emotionalMix={artwork.algorithm_parameters?.emotional_mix}
    dominantEmotion={artwork.dominant_emotion}
  />
</motion.div>

{/* Medical Content Analysis Section */}
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 1.4 }}
  className="bg-white rounded-xl p-6 shadow-lg"
>
  <h3 className="text-xl font-bold text-primary mb-4">Medical Content Analysis</h3>
  
  <div className="space-y-6">
    {/* Medical Terms */}
    <div>
      <h4 className="font-semibold text-gray-700 mb-3">Medical Terminology</h4>
      <MedicalTermsDisplay medicalTerms={artwork.algorithm_parameters?.medical_terms} />
    </div>
    
    {/* Statistical Data */}
    <div className="pt-6 border-t">
      <h4 className="font-semibold text-gray-700 mb-3">Statistical Data Points</h4>
      <StatisticalDataDisplay statisticalData={artwork.algorithm_parameters?.statistical_data} />
    </div>
    
    {/* Research Citations */}
    <div className="pt-6 border-t">
      <h4 className="font-semibold text-gray-700 mb-3">Research Citations</h4>
      <ResearchCitationsDisplay researchCitations={artwork.algorithm_parameters?.research_citations} />
    </div>
  </div>
</motion.div>

{/* Processing Metadata Section */}
<motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 1.6 }}
  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg"
>
  <h3 className="text-xl font-bold text-primary mb-4">Processing Metadata</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Algorithm Version:</span>
        <span className="font-medium">{artwork.metadata?.algorithm_version || '2.0'}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Processing Time:</span>
        <span className="font-medium">
          {artwork.algorithm_parameters?.processing_timestamp 
            ? new Date(artwork.algorithm_parameters.processing_timestamp).toLocaleString()
            : 'Unknown'
          }
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Content Source:</span>
        <span className="font-medium capitalize">
          {artwork.metadata?.content_source || 'Upload'}
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Subspecialty Pattern:</span>
        <span className="font-medium capitalize">
          {artwork.algorithm_parameters?.branch_pattern?.replace(/([A-Z])/g, ' $1') || 'Unknown'}
        </span>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Uniqueness Score:</span>
        <span className="font-medium">
          {artwork.algorithm_parameters?.uniqueness_factors?.term_diversity 
            ? `${artwork.algorithm_parameters.uniqueness_factors.term_diversity}/50`
            : 'Calculating...'
          }
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Content Distribution:</span>
        <span className="font-medium">
          {artwork.algorithm_parameters?.uniqueness_factors?.content_distribution 
            ? `${Math.round(artwork.algorithm_parameters.uniqueness_factors.content_distribution * 100)}%`
            : 'Unknown'
          }
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Research Depth:</span>
        <span className="font-medium">
          {artwork.algorithm_parameters?.uniqueness_factors?.research_depth 
            ? `${artwork.algorithm_parameters.uniqueness_factors.research_depth.toFixed(2)}/5.0`
            : 'Unknown'
          }
        </span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-gray-600">Visual Elements:</span>
        <span className="font-medium">
          {artwork.algorithm_parameters?.visual_elements?.length || 0} Generated
        </span>
      </div>
    </div>
  </div>
  
  {/* Algorithm Evolution Note */}
  <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h4 className="text-sm font-medium text-blue-800">Algorithm Evolution</h4>
        <p className="text-sm text-blue-700 mt-1">
          This artwork was generated using the Arthrokinetix Algorithm v2.0 (Deterministic Foundation). 
          Future artworks will feature AI-evolved parameters that learn from previous creations, 
          developing increasingly sophisticated and unique visual languages.
        </p>
      </div>
    </div>
  </div>
</motion.div>

            {/* NFT Minting Section */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4">NFT Minting</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Status:</span>
                  <span className={`font-medium ${artwork.nft_status === 'minted' ? 'text-green-600' : 'text-blue-600'}`}>
                    {artwork.nft_status === 'minted' ? 'Already Minted' : 'Available for Minting'}
                  </span>
                </div>

                {artwork.metadata?.rarity_score && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rarity Tier:</span>
                    <span className="font-medium">
                      {artwork.metadata.rarity_score >= 0.8 ? 'Legendary' :
                       artwork.metadata.rarity_score >= 0.6 ? 'Rare' :
                       artwork.metadata.rarity_score >= 0.3 ? 'Uncommon' : 'Common'}
                    </span>
                  </div>
                )}

                <div className="pt-4">
                  {/* NFT Information Panel */}
                  <NFTInfoPanel artwork={artwork} />
                </div>
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
          <div className="max-w-4xl w-full aspect-square bg-white rounded-lg overflow-hidden">
            <RealArthrokinetixArtwork 
            artwork={artwork} 
            width={600} 
            height={600}
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

const getSampleArtwork = (id) => ({
  id: id,
  title: `Algorithmic Synthesis #AKX-2024-${id.slice(0, 4).toUpperCase()}`,
  subspecialty: 'sportsMedicine',
  dominant_emotion: 'healing',
  created_date: '2024-03-01',
  article_id: `article-${id}`,
  algorithm_parameters: {
    tree_complexity: 0.8,
    emotional_intensity: 0.75,
    healing_elements: 0.9,
    color_palette: [{ color: '#16a085' }]
  },
  metadata: {
    rarity_score: 0.65,
    algorithm_version: '2.0',
    signature_id: `AKX-2024-${id.slice(0, 4).toUpperCase()}`
  },
  nft_status: 'available'
});

const getSampleArticle = (artworkId) => ({
  id: `article-${artworkId}`,
  title: "Advanced Arthroscopic Techniques in Sports Medicine: A Comprehensive Analysis",
  evidence_strength: 0.85,
  read_time: 8,
  subspecialty: 'sportsMedicine'
});

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

export default ArtworkDetail;
