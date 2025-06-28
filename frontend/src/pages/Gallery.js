import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Filter, Grid, Search, Star, Eye, Zap } from 'lucide-react';
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

  const subspecialties = [
    { key: 'all', label: 'All Subspecialties' },
    { key: 'sportsMedicine', label: 'Sports Medicine' },
    { key: 'jointReplacement', label: 'Joint Replacement' },
    { key: 'trauma', label: 'Trauma' },
    { key: 'spine', label: 'Spine' },
    { key: 'handUpperExtremity', label: 'Hand & Upper Extremity' },
    { key: 'footAnkle', label: 'Foot & Ankle' },
    { key: 'shoulderElbow', label: 'Shoulder & Elbow' },
    { key: 'pediatrics', label: 'Pediatrics' },
    { key: 'oncology', label: 'Oncology' }
  ];

  const emotions = [
    { key: 'all', label: 'All Emotions' },
    { key: 'hope', label: 'Hope' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'breakthrough', label: 'Breakthrough' },
    { key: 'healing', label: 'Healing' },
    { key: 'tension', label: 'Tension' },
    { key: 'uncertainty', label: 'Uncertainty' }
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
      const url = selectedSubspecialty === 'all' 
        ? `${API_BASE}/api/artworks`
        : `${API_BASE}/api/artworks?subspecialty=${selectedSubspecialty}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setArtworks(data.artworks || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setArtworks(generateSampleArtworks());
    } finally {
      setLoading(false);
    }
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
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Experience the transformation of medical content into stunning visual art 
              through our proprietary Arthrokinetix emotional analysis algorithm.
            </p>
          </motion.div>
        </div>
      </section>

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
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredArtworks.length} artworks found`}
          </p>
          
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
            {filteredArtworks.map((artwork, index) => (
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
                  {/* NEW: Use Real Algorithm Component */}
                  <RealArthrokinetixArtwork 
                    artwork={artwork} 
                    width={300} 
                    height={300}
                  />

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
            ))}
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

const generateSampleArtworks = () => [
  {
    id: '1',
    title: 'Algorithmic Synthesis #AKX-2024-0301-A1B2',
    subspecialty: 'sportsMedicine',
    dominant_emotion: 'confidence',
    created_date: '2024-03-01',
    algorithm_parameters: {
      // Core parameters
      evidence_strength: 0.8,
      technical_density: 0.75,
      tree_complexity: 0.8,
      emotional_intensity: 0.85,
      
      // Emotional analysis
      emotional_mix: {
        hope: 0.7,
        confidence: 0.85,
        healing: 0.6,
        breakthrough: 0.5,
        tension: 0.2,
        uncertainty: 0.3
      },
      
      // Medical content analysis
      medical_terms: {
        procedures: {
          "arthroscopy": { count: 8, significance: 8.0 },
          "reconstruction": { count: 5, significance: 5.0 },
          "repair": { count: 12, significance: 12.0 }
        },
        anatomy: {
          "ligament": { count: 15, significance: 15.0 },
          "joint": { count: 10, significance: 10.0 },
          "tendon": { count: 7, significance: 7.0 }
        },
        outcomes: {
          "success rate": { count: 6, significance: 6.0 },
          "recovery": { count: 9, significance: 9.0 }
        }
      },
      
      // Statistical data
      statistical_data: [
        { type: "percentages", value: 92, significance: 0.92 },
        { type: "satisfaction", value: 87, significance: 0.87 },
        { type: "pValues", value: 0.03, significance: 0.97 }
      ],
      
      // Research citations
      research_citations: [
        { importance: 0.8, impact: 0.9, type: "research_reference" },
        { importance: 0.7, impact: 0.8, type: "research_reference" },
        { importance: 0.9, impact: 0.95, type: "research_reference" }
      ]
    },
    metadata: { 
      rarity_score: 0.75,
      algorithm_version: '2.0',
      signature_id: 'AKX-2024-0301-A1B2'
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
      evidence_strength: 0.95,
      technical_density: 0.88,
      tree_complexity: 0.95,
      emotional_intensity: 0.92,
      
      emotional_mix: {
        hope: 0.8,
        confidence: 0.9,
        healing: 0.7,
        breakthrough: 0.92,
        tension: 0.1,
        uncertainty: 0.2
      },
      
      medical_terms: {
        procedures: {
          "tenodesis": { count: 10, significance: 10.0 },
          "arthroscopy": { count: 12, significance: 12.0 }
        },
        anatomy: {
          "biceps": { count: 18, significance: 18.0 },
          "shoulder": { count: 14, significance: 14.0 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 96, significance: 0.96 },
        { type: "followUp", value: 24, significance: 0.4 }
      ],
      
      research_citations: [
        { importance: 0.95, impact: 0.98, type: "research_reference" },
        { importance: 0.88, impact: 0.92, type: "research_reference" }
      ]
    },
    metadata: { 
      rarity_score: 0.95,
      algorithm_version: '2.0' 
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
      evidence_strength: 0.6,
      technical_density: 0.65,
      tree_complexity: 0.6,
      emotional_intensity: 0.78,
      
      emotional_mix: {
        hope: 0.8,
        confidence: 0.7,
        healing: 0.78,
        breakthrough: 0.4,
        tension: 0.3,
        uncertainty: 0.4
      },
      
      medical_terms: {
        procedures: {
          "arthroplasty": { count: 15, significance: 15.0 },
          "replacement": { count: 20, significance: 20.0 }
        },
        anatomy: {
          "hip": { count: 12, significance: 12.0 },
          "joint": { count: 18, significance: 18.0 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 89, significance: 0.89 },
        { type: "sampleSizes", value: 450, significance: 0.45 }
      ],
      
      research_citations: [
        { importance: 0.6, impact: 0.7, type: "research_reference" }
      ]
    },
    metadata: { 
      rarity_score: 0.45,
      algorithm_version: '2.0' 
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
      evidence_strength: 0.7,
      technical_density: 0.8,
      tree_complexity: 0.7,
      emotional_intensity: 0.68,
      
      emotional_mix: {
        hope: 0.5,
        confidence: 0.6,
        healing: 0.5,
        breakthrough: 0.3,
        tension: 0.68,
        uncertainty: 0.5
      },
      
      medical_terms: {
        procedures: {
          "fixation": { count: 8, significance: 8.0 },
          "surgery": { count: 10, significance: 10.0 }
        },
        anatomy: {
          "fracture": { count: 12, significance: 12.0 },
          "bone": { count: 15, significance: 15.0 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 78, significance: 0.78 }
      ],
      
      research_citations: [
        { importance: 0.7, impact: 0.75, type: "research_reference" }
      ]
    },
    metadata: { 
      rarity_score: 0.72,
      algorithm_version: '2.0' 
    },
    nft_status: 'available'
  },
  {
    id: '5',
    title: 'Algorithmic Synthesis #AKX-2024-0305-I9J0',
    subspecialty: 'spine',
    dominant_emotion: 'uncertainty',
    created_date: '2024-02-15',
    algorithm_parameters: {
      evidence_strength: 0.4,
      technical_density: 0.45,
      tree_complexity: 0.4,
      emotional_intensity: 0.55,
      
      emotional_mix: {
        hope: 0.4,
        confidence: 0.45,
        healing: 0.4,
        breakthrough: 0.2,
        tension: 0.4,
        uncertainty: 0.55
      },
      
      medical_terms: {
        procedures: {
          "fusion": { count: 6, significance: 6.0 }
        },
        anatomy: {
          "spine": { count: 8, significance: 8.0 },
          "vertebra": { count: 5, significance: 5.0 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 65, significance: 0.65 }
      ],
      
      research_citations: [
        { importance: 0.4, impact: 0.5, type: "research_reference" }
      ]
    },
    metadata: { 
      rarity_score: 0.35,
      algorithm_version: '2.0' 
    },
    nft_status: 'available'
  },
  {
    id: '6',
    title: 'Algorithmic Synthesis #AKX-2024-0306-K1L2',
    subspecialty: 'handUpperExtremity',
    dominant_emotion: 'hope',
    created_date: '2024-02-10',
    algorithm_parameters: {
      evidence_strength: 0.85,
      technical_density: 0.82,
      tree_complexity: 0.85,
      emotional_intensity: 0.82,
      
      emotional_mix: {
        hope: 0.82,
        confidence: 0.8,
        healing: 0.75,
        breakthrough: 0.6,
        tension: 0.2,
        uncertainty: 0.25
      },
      
      medical_terms: {
        procedures: {
          "repair": { count: 10, significance: 10.0 },
          "reconstruction": { count: 7, significance: 7.0 }
        },
        anatomy: {
          "hand": { count: 12, significance: 12.0 },
          "tendon": { count: 15, significance: 15.0 },
          "finger": { count: 8, significance: 8.0 }
        }
      },
      
      statistical_data: [
        { type: "percentages", value: 94, significance: 0.94 },
        { type: "satisfaction", value: 91, significance: 0.91 }
      ],
      
      research_citations: [
        { importance: 0.85, impact: 0.9, type: "research_reference" },
        { importance: 0.8, impact: 0.85, type: "research_reference" }
      ]
    },
    metadata: { 
      rarity_score: 0.88,
      algorithm_version: '2.0' 
    },
    nft_status: 'minted'
  }
];

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

export default Gallery;
