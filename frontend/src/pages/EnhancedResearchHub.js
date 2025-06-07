import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Filter as FilterIcon } from 'lucide-react';
import EnhancedSearch from '../components/EnhancedSearch';
import EmotionalSignature from '../components/EmotionalSignature';
import AlgorithmEvolution from '../components/AlgorithmEvolution';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const EnhancedResearchHub = ({ algorithmState }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [showEvolution, setShowEvolution] = useState(false);
  const [selectedSubspecialty, setSelectedSubspecialty] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');

  const subspecialties = [
    { key: 'all', label: 'All Subspecialties' },
    { key: 'sportsMedicine', label: 'Sports Medicine' },
    { key: 'jointReplacement', label: 'Joint Replacement' },
    { key: 'trauma', label: 'Trauma' },
    { key: 'spine', label: 'Spine' },
    { key: 'handUpperExtremity', label: 'Hand & Upper Extremity' },
    { key: 'footAnkle', label: 'Foot & Ankle' }
  ];

  const sortOptions = [
    { key: 'date', label: 'Publication Date' },
    { key: 'emotional_intensity', label: 'Emotional Intensity' },
    { key: 'evidence_strength', label: 'Evidence Strength' },
    { key: 'rarity', label: 'Signature Rarity' }
  ];

  useEffect(() => {
    fetchArticles();
  }, [selectedSubspecialty]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const url = selectedSubspecialty === 'all' 
        ? `${API_BASE}/api/articles`
        : `${API_BASE}/api/articles?subspecialty=${selectedSubspecialty}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles(generateSampleArticles());
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayArticles = searchResults ? searchResults.articles : articles;

  const sortedArticles = [...displayArticles].sort((a, b) => {
    switch (sortBy) {
      case 'emotional_intensity':
        return (b.emotional_data?.emotional_intensity || 0) - (a.emotional_data?.emotional_intensity || 0);
      case 'evidence_strength':
        return (b.evidence_strength || 0) - (a.evidence_strength || 0);
      case 'rarity':
        return (b.signature_data?.rarity_score || 0) - (a.signature_data?.rarity_score || 0);
      default:
        return new Date(b.published_date || Date.now()) - new Date(a.published_date || Date.now());
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Enhanced Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Enhanced Research Hub</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Discover evidence-based research with advanced search, emotional analysis, 
              and algorithm evolution tracking.
            </p>

            {/* Enhanced Search */}
            <div className="max-w-4xl mx-auto">
              <EnhancedSearch 
                onResults={handleSearchResults}
                placeholder="Search articles by content, emotion, subspecialty, or signature..."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats and Controls */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{displayArticles.length}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-innovation">
                  {displayArticles.filter(a => a.signature_data?.rarity_score > 0.7).length}
                </div>
                <div className="text-sm text-gray-600">Rare Signatures</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-healing">
                  {algorithmState?.articles_processed || 0}
                </div>
                <div className="text-sm text-gray-600">Processed by AI</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center">
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.key} value={option.key}>Sort by {option.label}</option>
                ))}
              </select>

              <button
                onClick={() => setShowEvolution(!showEvolution)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showEvolution 
                    ? 'bg-secondary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-5 h-5 mr-2 inline" />
                Evolution
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchResults && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-blue-800">
                  Showing {searchResults.articles.length} search results
                  {searchResults.signatures.length > 0 && (
                    <span> and {searchResults.signatures.length} matching signatures</span>
                  )}
                </p>
                <button
                  onClick={() => setSearchResults(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Algorithm Evolution Panel */}
      {showEvolution && (
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AlgorithmEvolution />
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="loading-skeleton h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="article-card relative group cursor-pointer"
                whileHover={{ y: -8 }}
              >
                {/* Enhanced Emotional Signature */}
                {article.signature_data && (
                  <div className="absolute -top-12 -right-12 z-10">
                    <EmotionalSignature 
                      signatureData={article.signature_data}
                      emotionalData={article.emotional_data}
                      size={80}
                    />
                  </div>
                )}

                {/* Subspecialty Color Bar */}
                <div className={`w-full h-4 rounded-t-lg subspecialty-${article.subspecialty}`} />
                
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-primary mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  {/* Enhanced Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Evidence Strength:</span>
                      <div className="flex items-center">
                        <div className="w-16 h-1 bg-gray-200 rounded mr-2">
                          <div 
                            className="h-full bg-green-500 rounded"
                            style={{ width: `${(article.evidence_strength || 0.5) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium">{Math.round((article.evidence_strength || 0.5) * 100)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Emotional Intensity:</span>
                      <div className="flex items-center">
                        <div className="w-16 h-1 bg-gray-200 rounded mr-2">
                          <div 
                            className="h-full rounded"
                            style={{ 
                              width: `${(article.emotional_data?.emotional_intensity || 0.5) * 100}%`,
                              backgroundColor: getEmotionColor(article.emotional_data?.dominant_emotion)
                            }}
                          />
                        </div>
                        <span className="font-medium">{Math.round((article.emotional_data?.emotional_intensity || 0.5) * 100)}%</span>
                      </div>
                    </div>

                    {article.signature_data?.rarity_score && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Signature Rarity:</span>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1" style={{ color: getRarityColor(article.signature_data.rarity_score) }} />
                          <span className="font-medium" style={{ color: getRarityColor(article.signature_data.rarity_score) }}>
                            {Math.round(article.signature_data.rarity_score * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Emotional Data Bars */}
                  <div className="space-y-2 mb-6">
                    {['hope', 'confidence', 'healing', 'breakthrough'].map(emotion => {
                      const value = article.emotional_data?.[emotion] || 0;
                      if (value < 0.2) return null;
                      
                      return (
                        <div key={emotion} className="flex items-center gap-3">
                          <span className="text-xs capitalize text-gray-500 w-20">{emotion}:</span>
                          <div className="flex-1 h-1.5 bg-gray-200 rounded">
                            <div 
                              className="h-full rounded transition-all duration-300"
                              style={{ 
                                width: `${value * 100}%`, 
                                backgroundColor: getEmotionColor(emotion)
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8">{Math.round(value * 100)}%</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link 
                      to={`/research/${article.id}`}
                      className="btn-primary flex-1 text-center text-sm py-2"
                    >
                      <BookOpen className="w-4 h-4 mr-2 inline" />
                      Read
                    </Link>
                    
                    <Link 
                      to={`/gallery/${article.artwork_id || article.id}`}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      View Art
                    </Link>
                  </div>

                  {/* Enhanced Hover Information */}
                  <div className="absolute inset-0 bg-primary/95 text-white p-6 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center">
                    <h4 className="font-semibold mb-3">Article Insights</h4>
                    <div className="space-y-2 text-sm">
                      <p>📊 {article.research_citations || 0} research citations</p>
                      <p>🧠 Processed by Claude AI</p>
                      <p>🎨 Unique signature: {article.signature_data?.id}</p>
                      <p>⏱️ {article.read_time || 5} minute read</p>
                    </div>
                    <div className="mt-4">
                      <Link 
                        to={`/research/${article.id}`}
                        className="btn-primary w-full text-center"
                      >
                        Explore Article
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && sortedArticles.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

// Helper functions
const getEmotionColor = (emotion) => {
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

const getRarityColor = (rarity) => {
  if (rarity > 0.8) return '#f39c12'; // Legendary
  if (rarity > 0.6) return '#9b59b6'; // Rare
  if (rarity > 0.3) return '#3498db'; // Uncommon
  return '#95a5a6'; // Common
};

const generateSampleArticles = () => [
  {
    id: '1',
    title: 'Advanced ACL Reconstruction Techniques: Revolutionary Outcomes',
    subspecialty: 'sportsMedicine',
    published_date: '2024-03-07',
    read_time: 8,
    evidence_strength: 0.92,
    research_citations: 15,
    emotional_data: { 
      dominant_emotion: 'breakthrough',
      hope: 0.8,
      confidence: 0.85,
      healing: 0.75,
      breakthrough: 0.92,
      emotional_intensity: 0.88
    },
    signature_data: {
      id: 'AKX-2024-0307-A1B2',
      concentric_rings: { count: 5, thickness: 2.5, rotation_speed: 1.8 },
      geometric_overlays: { shape: 'star', color: '#f39c12', scale: 1.3 },
      floating_particles: { count: 15, color: '#f39c12' },
      rarity_score: 0.95
    },
    artwork_id: 'artwork-1'
  },
  {
    id: '2',
    title: 'Healing Potential in Regenerative Medicine: Hope for Recovery',
    subspecialty: 'sportsMedicine',
    published_date: '2024-03-06',
    read_time: 6,
    evidence_strength: 0.78,
    research_citations: 12,
    emotional_data: { 
      dominant_emotion: 'healing',
      hope: 0.9,
      confidence: 0.65,
      healing: 0.95,
      breakthrough: 0.4,
      emotional_intensity: 0.82
    },
    signature_data: {
      id: 'AKX-2024-0306-C3D4',
      concentric_rings: { count: 3, thickness: 1.5, rotation_speed: 1.2 },
      geometric_overlays: { shape: 'hexagon', color: '#16a085', scale: 1.1 },
      floating_particles: { count: 10, color: '#16a085' },
      rarity_score: 0.72
    },
    artwork_id: 'artwork-2'
  }
];

export default EnhancedResearchHub;