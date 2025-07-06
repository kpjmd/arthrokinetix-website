import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Filter, Grid, Search, Star, Eye, Zap, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import NFTMintButton from '../components/NFTMintButton';
import { GalleryNewsletterForm } from '../components/NewsletterForms';
import RealArthrokinetixArtwork from '../components/RealArthrokinetixArtwork';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const Gallery = ({ algorithmState }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubspecialty, setSelectedSubspecialty] = useState('all');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [dataQuality, setDataQuality] = useState({ manual: 0, fallback: 0 });
  const [apiError, setApiError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  const subspecialties = [
    { key: 'all', label: 'All Subspecialties' },
    { key: 'sportsMedicine', label: 'Sports Medicine' },
    { key: 'shoulderElbow', label: 'Shoulder & Elbow' },
    { key: 'jointReplacement', label: 'Joint Replacement' },
    { key: 'trauma', label: 'Trauma' },
    { key: 'spine', label: 'Spine' },
    { key: 'handUpperExtremity', label: 'Hand & Upper Extremity' },
    { key: 'footAnkle', label: 'Foot & Ankle' },
    { key: 'pediatrics', label: 'Pediatrics' },
    { key: 'oncology', label: 'Oncology' }
  ];

  const emotions = [
    { key: 'all', label: 'All Emotions' },
    { key: 'hope', label: 'Hope', color: '#27ae60' },
    { key: 'confidence', label: 'Confidence', color: '#3498db' },
    { key: 'breakthrough', label: 'Breakthrough', color: '#f39c12' },
    { key: 'healing', label: 'Healing', color: '#16a085' },
    { key: 'tension', label: 'Tension', color: '#e74c3c' },
    { key: 'uncertainty', label: 'Uncertainty', color: '#95a5a6' }
  ];

  const rarityLevels = [
    { key: 'all', label: 'All Rarities' },
    { key: 'common', label: 'Common (0-30%)', min: 0, max: 0.3 },
    { key: 'uncommon', label: 'Uncommon (30-60%)', min: 0.3, max: 0.6 },
    { key: 'rare', label: 'Rare (60-80%)', min: 0.6, max: 0.8 },
    { key: 'legendary', label: 'Legendary (80%+)', min: 0.8, max: 1 }
  ];

  useEffect(() => {
    fetchArtworks();
  }, [selectedSubspecialty]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setApiError(null);
      setApiStatus('checking');
      
      const url = selectedSubspecialty === 'all' 
        ? `${API_BASE}/api/artworks`
        : `${API_BASE}/api/artworks?subspecialty=${selectedSubspecialty}`;
      
      console.log('🎨 Fetching artworks from:', url);
      
      // Check production configuration
      if (window.location.hostname !== 'localhost' && API_BASE.includes('localhost')) {
        console.warn('⚠️ Production deployment is using localhost API!');
        setApiError({
          type: 'configuration',
          message: 'Backend URL not configured. Please set REACT_APP_BACKEND_URL in Vercel.',
          details: `Expected: Railway backend URL, Got: ${API_BASE}`
        });
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Received artworks data:', data);
      
      const fetchedArtworks = data.artworks || [];
      setArtworks(fetchedArtworks);
      setApiStatus('connected');
      
      // Analyze data quality
      analyzeDataQuality(fetchedArtworks);
      
    } catch (error) {
      console.error('❌ Error fetching artworks:', error);
      
      setApiError({
        type: error.name,
        message: error.message,
        endpoint: API_BASE
      });
      
      console.log('🔄 Using sample data as fallback');
      setApiStatus('fallback');
      const sampleArtworks = generateSampleArtworks();
      setArtworks(sampleArtworks);
      analyzeDataQuality(sampleArtworks);
    } finally {
      setLoading(false);
    }
  };

  const analyzeDataQuality = (artworkList) => {
    let manualCount = 0;
    let fallbackCount = 0;
    
    artworkList.forEach(artwork => {
      const params = artwork.algorithm_parameters || {};
      const hasEmotionalJourney = params.emotional_journey && Object.keys(params.emotional_journey).length > 0;
      const hasEnhancedData = params.medical_terms && Object.keys(params.medical_terms).length > 0;
      const algorithmVersion = params.algorithm_version || artwork.metadata?.algorithm_version;
      
      if (hasEmotionalJourney && hasEnhancedData && algorithmVersion?.includes('manual')) {
        manualCount++;
      } else {
        fallbackCount++;
      }
    });
    
    setDataQuality({ manual: manualCount, fallback: fallbackCount });
    console.log(`📊 Data Quality Analysis: ${manualCount} manual algorithm, ${fallbackCount} fallback/sample`);
  };

  const getArtworkDataQuality = (artwork) => {
    const params = artwork.algorithm_parameters || {};
    const hasEmotionalJourney = params.emotional_journey && Object.keys(params.emotional_journey).length > 0;
    const hasEnhancedMedicalTerms = params.medical_terms && Object.keys(params.medical_terms).length > 0;
    const hasStatisticalData = params.statistical_data && params.statistical_data.length > 0;
    const algorithmVersion = params.algorithm_version || artwork.metadata?.algorithm_version;
    
    const qualityScore = [
      hasEmotionalJourney,
      hasEnhancedMedicalTerms,
      hasStatisticalData,
      algorithmVersion?.includes('manual') || algorithmVersion?.includes('2.0')
    ].filter(Boolean).length;
    
    return {
      score: qualityScore,
      isManualAlgorithm: hasEmotionalJourney && hasEnhancedMedicalTerms,
      hasCompleteData: qualityScore >= 3,
      algorithmVersion: algorithmVersion || 'unknown'
    };
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmotion = selectedEmotion === 'all' || artwork.dominant_emotion === selectedEmotion;
    
    let matchesRarity = true;
    if (selectedRarity !== 'all') {
      const rarityLevel = rarityLevels.find(r => r.key === selectedRarity);
      const artworkRarity = artwork.metadata?.rarity_score || 0;
      matchesRarity = artworkRarity >= rarityLevel.min && artworkRarity < rarityLevel.max;
    }

    return matchesSearch && matchesEmotion && matchesRarity;
  });

  const handleMintNFT = (artworkId) => {
    // Placeholder for future Manifold integration
    alert(`NFT minting for artwork ${artworkId} will be available soon via Manifold integration!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-innovation via-accent to-healing text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Algorithmic Art Gallery</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-6">
              Experience the transformation of medical content into stunning visual art 
              through our enhanced Arthrokinetix manual algorithm integration.
            </p>
            
            {/* Data Quality Indicator */}
            <div className="flex justify-center items-center space-x-6 mt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm text-green-100">
                  {dataQuality.manual} Manual Algorithm Artworks
                </span>
              </div>
              {dataQuality.fallback > 0 && (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-yellow-100">
                    {dataQuality.fallback} Sample/Fallback Artworks
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Error Banner */}
      {apiError && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-yellow-50 border-b border-yellow-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-yellow-800">{apiError.message}</span>
                  {apiError.details && (
                    <span className="text-yellow-700 ml-2">({apiError.details})</span>
                  )}
                </div>
              </div>
              <button
                onClick={fetchArtworks}
                className="flex items-center px-2 py-1 bg-yellow-600 text-white text-sm font-medium rounded hover:bg-yellow-700 transition-colors"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artworks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex gap-4 items-center flex-wrap">
              <select
                value={selectedSubspecialty}
                onChange={(e) => setSelectedSubspecialty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                {subspecialties.map(sub => (
                  <option key={sub.key} value={sub.key}>{sub.label}</option>
                ))}
              </select>

              <select
                value={selectedEmotion}
                onChange={(e) => setSelectedEmotion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                {emotions.map(emotion => (
                  <option key={emotion.key} value={emotion.key}>{emotion.label}</option>
                ))}
              </select>

              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                {rarityLevels.map(rarity => (
                  <option key={rarity.key} value={rarity.key}>{rarity.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${filteredArtworks.length} artworks found`}
            </p>
            
            {/* Algorithm quality indicator */}
            {!loading && filteredArtworks.length > 0 && (
              <div className="text-sm text-gray-500">
                ({dataQuality.manual} enhanced, {dataQuality.fallback} samples)
              </div>
            )}
          </div>
          
          {algorithmState && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Algorithm mood:</span>
              <span 
                className="font-medium capitalize"
                style={{ color: algorithmState.visual_representation?.color }}
              >
                {algorithmState.emotional_state?.dominant_emotion}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="artwork-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="loading-skeleton h-80 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="artwork-grid">
            {filteredArtworks.map((artwork, index) => {
              const dataQuality = getArtworkDataQuality(artwork);
              
              return (
                <motion.div
                  key={artwork.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="artwork-item group cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  {/* Artwork Preview */}
                  <div className="artwork-preview relative overflow-hidden">
                    {/* Enhanced Real Algorithm Component */}
                    <RealArthrokinetixArtwork 
                      artwork={artwork} 
                      width={300} 
                      height={300}
                    />

                    {/* Data Quality Indicator */}
                    <div className="absolute top-3 left-3">
                      <div className={`w-3 h-3 rounded-full ${
                        dataQuality.isManualAlgorithm 
                          ? 'bg-green-400' 
                          : 'bg-yellow-400'
                      }`} title={`${dataQuality.isManualAlgorithm ? 'Manual Algorithm' : 'Sample Data'} - Quality Score: ${dataQuality.score}/4`} />
                    </div>

                    {/* Hover overlay with functional View Details link */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link 
                        to={`/gallery/${artwork.id}`}
                        className="text-white text-center hover:scale-105 transition-transform"
                      >
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">View Details</p>
                      </Link>
                    </div>

                    {/* Rarity indicator */}
                    {artwork.metadata?.rarity_score > 0.7 && (
                      <div className="absolute top-3 right-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 bg-innovation text-white rounded-full flex items-center justify-center"
                        >
                          <Star className="w-4 h-4" />
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Artwork Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2">
                      {artwork.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="capitalize">{artwork.subspecialty?.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{formatDate(artwork.created_date)}</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Emotion:</span>
                        <span 
                          className="text-sm font-medium capitalize"
                          style={{ color: getEmotionColorLocal(artwork.dominant_emotion) }}
                        >
                          {artwork.dominant_emotion}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Algorithm:</span>
                        <span className={`text-sm font-medium ${
                          dataQuality.isManualAlgorithm ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {dataQuality.isManualAlgorithm ? 'Enhanced v2.0' : 'Sample v1.0'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Rarity:</span>
                        <span className="text-sm font-medium">
                          {getRarityLabel(artwork.metadata?.rarity_score)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">NFT Status:</span>
                        <span className={`text-sm font-medium ${artwork.nft_status === 'minted' ? 'text-green-600' : 'text-gray-600'}`}>
                          {artwork.nft_status === 'minted' ? 'Minted' : 'Available'}
                        </span>
                      </div>

                      {/* Data Quality Details */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Data Quality:</span>
                        <span className="text-sm font-medium">
                          {dataQuality.score}/4 components
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Link 
                        to={`/gallery/${artwork.id}`}
                        className="btn-primary flex-1 text-center text-sm py-2"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Link>
                      
                      <ShareButtons 
                        content={artwork} 
                        type="artwork"
                        className="text-sm py-2 px-3 border border-gray-300"
                      />
                      
                      <NFTMintButton 
                        artwork={artwork}
                        size="small"
                        className="text-sm py-2 px-3"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredArtworks.length === 0 && (
          <div className="text-center py-20">
            <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No artworks found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </section>

      {/* Newsletter Signup Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <GalleryNewsletterForm />
      </section>
    </div>
  );
};

// Helper functions
const getRarityLabel = (score) => {
  if (!score) return 'Common';
  if (score < 0.3) return 'Common';
  if (score < 0.6) return 'Uncommon';
  if (score < 0.8) return 'Rare';
  return 'Legendary';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

// Enhanced sample artworks with manual algorithm structure
const generateSampleArtworks = () => [
  {
    id: '1',
    title: 'Algorithmic Synthesis #AKX-2024-0301-A1B2',
    subspecialty: 'shoulderElbow',
    dominant_emotion: 'confidence',
    created_date: '2024-03-01',
    algorithm_parameters: {
      // Manual algorithm version indicators
      algorithm_version: '2.0-manual-enhanced',
      
      // Core algorithm metrics
      evidence_strength: 0.85,
      technical_density: 0.78,
      subspecialty: 'shoulderElbow',
      dominant_emotion: 'confidence',
      
      // COMPLETE emotional journey data (manual algorithm format)
      emotional_journey: {
        problemIntensity: 120,      // Raw manual algorithm values
        solutionConfidence: 850,
        innovationLevel: 340,
        healingPotential: 760,
        uncertaintyLevel: 180,
        dominantEmotion: 'confidence'
      },
      
      // Emotional mix (processed for compatibility)
      emotional_mix: {
        hope: 0.76,
        confidence: 0.85,
        healing: 0.76,
        breakthrough: 0.34,
        tension: 0.12,
        uncertainty: 0.18
      },
      
      // ENHANCED medical terms structure (manual algorithm format)
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
          "success rate": { count: 5, weight: 1.2, significance: 6.0 },
          "satisfaction": { count: 8, weight: 1.2, significance: 9.6 },
          "function": { count: 10, weight: 1.2, significance: 12.0 }
        },
        research: {
          "study": { count: 12, weight: 0.9, significance: 10.8 },
          "trial": { count: 4, weight: 0.9, significance: 3.6 },
          "evidence": { count: 9, weight: 0.9, significance: 8.1 }
        }
      },
      
      // ENHANCED statistical data (manual algorithm format)
      statistical_data: [
        { type: "percentages", value: 92, rawText: "92%", significance: 0.92, context: "satisfaction rate study" },
        { type: "pValues", value: 0.03, rawText: "p < 0.03", significance: 0.97, context: "statistical significance" },
        { type: "sampleSizes", value: 247, rawText: "n = 247", significance: 0.25, context: "patient cohort" },
        { type: "followUp", value: 24, rawText: "24 months follow-up", significance: 0.4, context: "long-term outcomes" }
      ],
      
      // ENHANCED research citations (manual algorithm format)
      research_citations: [
        { index: 0, importance: 0.9, impact: 0.95 },
        { index: 1, importance: 0.8, impact: 0.85 },
        { index: 2, importance: 0.7, impact: 0.8 },
        { index: 3, importance: 0.85, impact: 0.9 }
      ],
      
      // Visual elements generated by manual algorithm
      visual_elements: [
        { type: 'andryRoot', x: 400, y: 640, angle: 225, length: 60, thickness: 4, color: '#3498db' },
        { type: 'andryRoot', x: 400, y: 640, angle: 270, length: 80, thickness: 5, color: '#3498db' },
        { type: 'healingParticle', x: 350, y: 200, size: 6, color: '#16a085' },
        { type: 'healingParticle', x: 450, y: 180, size: 8, color: '#16a085' },
        { type: 'dataFlow', startX: 50, startY: 100, endX: 750, endY: 500, thickness: 3, color: '#e74c3c' }
      ],
      
      // Processing metadata
      processing_timestamp: '2024-03-01T10:30:15.492Z',
      article_word_count: 2847,
      data_complexity: 0.78,
      uniqueness_factors: {
        emotional_variance: 0.34,
        terminology_density: 0.67,
        statistical_richness: 0.82
      }
    },
    metadata: { 
      rarity_score: 0.84,
      algorithm_version: '2.0-manual-enhanced',
      signature_id: 'AKX-2024-0301-A1B2',
      generation_timestamp: '2024-03-01T10:30:15.492Z'
    },
    nft_status: 'available'
  },
  {
    id: '2', 
    title: 'Algorithmic Synthesis #AKX-2024-0302-C3D4',
    subspecialty: 'sportsMedicine',
    dominant_emotion: 'breakthrough',
    created_date: '2024-02-28',
    algorithm_parameters: {
      algorithm_version: '2.0-manual-enhanced',
      evidence_strength: 0.92,
      technical_density: 0.88,
      subspecialty: 'sportsMedicine',
      dominant_emotion: 'breakthrough',
      
      emotional_journey: {
        problemIntensity: 80,
        solutionConfidence: 820,
        innovationLevel: 920,
        healingPotential: 840,
        uncertaintyLevel: 90,
        dominantEmotion: 'breakthrough'
      },
      
      emotional_mix: {
        hope: 0.84,
        confidence: 0.82,
        healing: 0.84,
        breakthrough: 0.92,
        tension: 0.08,
        uncertainty: 0.09
      },
      
      medical_terms: {
        procedures: {
          "reconstruction": { count: 15, weight: 1.0, significance: 15.0 },
          "repair": { count: 20, weight: 1.0, significance: 20.0 }
        },
        anatomy: {
          "acl": { count: 25, weight: 0.8, significance: 20.0 },
          "meniscus": { count: 18, weight: 0.8, significance: 14.4 }
        },
        outcomes: {
          "return to sport": { count: 8, weight: 1.2, significance: 9.6 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 96, significance: 0.96 },
        { type: "followUp", value: 36, significance: 0.6 }
      ],
      
      research_citations: [
        { index: 0, importance: 0.95, impact: 0.98 },
        { index: 1, importance: 0.88, impact: 0.92 }
      ],
      
      visual_elements: [
        { type: 'andryRoot', x: 400, y: 640, angle: 200, length: 70, thickness: 6, color: '#f39c12' },
        { type: 'healingParticle', x: 300, y: 150, size: 10, color: '#f39c12' }
      ]
    },
    metadata: { 
      rarity_score: 0.95,
      algorithm_version: '2.0-manual-enhanced',
      signature_id: 'AKX-2024-0302-C3D4'
    },
    nft_status: 'minted'
  },
  {
    id: '3',
    title: 'Algorithmic Synthesis #AKX-2024-0303-E5F6',
    subspecialty: 'jointReplacement', 
    dominant_emotion: 'healing',
    created_date: '2024-02-25',
    algorithm_parameters: {
      algorithm_version: '1.0-fallback',  // Indicates sample/fallback data
      evidence_strength: 0.6,
      technical_density: 0.65,
      subspecialty: 'jointReplacement',
      dominant_emotion: 'healing',
      
      // Limited emotional data (fallback)
      emotional_mix: {
        hope: 0.7,
        confidence: 0.6,
        healing: 0.78,
        breakthrough: 0.4,
        tension: 0.3,
        uncertainty: 0.4
      },
      
      // Simplified medical terms
      medical_terms: {
        procedures: {
          "arthroplasty": { count: 10, significance: 10.0 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 85, significance: 0.85 }
      ],
      
      research_citations: [
        { index: 0, importance: 0.6, impact: 0.7 }
      ]
    },
    metadata: { 
      rarity_score: 0.45,
      algorithm_version: '1.0-fallback',
      signature_id: 'AKX-2024-0303-E5F6'
    },
    nft_status: 'available'
  },
  {
    id: '4',
    title: 'Algorithmic Synthesis #AKX-2024-0304-G7H8',
    subspecialty: 'trauma',
    dominant_emotion: 'tension',
    created_date: '2024-02-20',
    algorithm_parameters: {
      algorithm_version: '2.0-manual-enhanced',
      evidence_strength: 0.75,
      technical_density: 0.82,
      subspecialty: 'trauma',
      dominant_emotion: 'tension',
      
      emotional_journey: {
        problemIntensity: 680,
        solutionConfidence: 750,
        innovationLevel: 320,
        healingPotential: 540,
        uncertaintyLevel: 460,
        dominantEmotion: 'tension'
      },
      
      emotional_mix: {
        hope: 0.54,
        confidence: 0.75,
        healing: 0.54,
        breakthrough: 0.32,
        tension: 0.68,
        uncertainty: 0.46
      },
      
      medical_terms: {
        procedures: {
          "fixation": { count: 12, weight: 1.0, significance: 12.0 },
          "reduction": { count: 8, weight: 1.0, significance: 8.0 }
        },
        anatomy: {
          "fracture": { count: 20, weight: 0.8, significance: 16.0 },
          "bone": { count: 15, weight: 0.8, significance: 12.0 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 78, significance: 0.78 },
        { type: "pValues", value: 0.08, significance: 0.92 }
      ],
      
      research_citations: [
        { index: 0, importance: 0.7, impact: 0.75 },
        { index: 1, importance: 0.65, impact: 0.7 }
      ]
    },
    metadata: { 
      rarity_score: 0.72,
      algorithm_version: '2.0-manual-enhanced',
      signature_id: 'AKX-2024-0304-G7H8'
    },
    nft_status: 'available'
  }
];

export default Gallery;
