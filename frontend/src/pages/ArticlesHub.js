import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, BookOpen, Clock, Award } from 'lucide-react';
import EmotionalSignature from '../components/EmotionalSignature';
import { ArticlesNewsletterForm } from '../components/NewsletterForms';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ArticlesHub = ({ algorithmState }) => {
  const [articles, setArticles] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubspecialty, setSelectedSubspecialty] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');

  const subspecialties = [
    { value: 'all', label: 'All Subspecialties' },
    { value: 'sportsMedicine', label: 'Sports Medicine' },
    { value: 'jointReplacement', label: 'Joint Replacement' },
    { value: 'trauma', label: 'Trauma' },
    { value: 'spine', label: 'Spine' },
    { value: 'handUpperExtremity', label: 'Hand & Upper Extremity' },
    { value: 'footAnkle', label: 'Foot & Ankle' },
    { value: 'shoulderElbow', label: 'Shoulder & Elbow' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'oncology', label: 'Oncology' }
  ];

  const sortOptions = [
    { key: 'date', label: 'Publication Date' },
    { key: 'emotional_intensity', label: 'Emotional Intensity' },
    { key: 'evidence_strength', label: 'Evidence Strength' },
    { key: 'read_time', label: 'Read Time' }
  ];

  useEffect(() => {
    fetchArticles();
    fetchArtworks();
  }, [selectedSubspecialty]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const url = selectedSubspecialty === 'all' 
        ? `${API_BASE}/api/articles`
        : `${API_BASE}/api/articles?subspecialty=${selectedSubspecialty}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Deduplicate articles by ID
      const uniqueArticles = data.articles ? 
        Array.from(new Map(data.articles.map(item => [item.id, item])).values()) : 
        [];
      
      console.log(`📚 Fetched ${data.articles?.length || 0} articles, ${uniqueArticles.length} unique`);
      
      // Log first article structure for debugging
      if (uniqueArticles.length > 0) {
        console.log('📋 First article structure:', {
          id: uniqueArticles[0].id,
          _id: uniqueArticles[0]._id,
          title: uniqueArticles[0].title,
          keys: Object.keys(uniqueArticles[0])
        });
      }
      
      setArticles(uniqueArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles(generateSampleArticles());
    } finally {
      setLoading(false);
    }
  };

  const fetchArtworks = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/artworks`);
      const data = await response.json();
      setArtworks(data.artworks || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setArtworks([]);
    }
  };

  // Helper function to get artwork for an article
  const getArtworkForArticle = (articleId) => {
    return artworks.find(artwork => artwork.article_id === articleId);
  };

  const filteredAndSortedArticles = articles
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'emotional_intensity':
          return (b.emotional_data?.emotional_intensity || 0) - (a.emotional_data?.emotional_intensity || 0);
        case 'evidence_strength':
          return (b.evidence_strength || 0) - (a.evidence_strength || 0);
        case 'read_time':
          return (a.read_time || 0) - (b.read_time || 0);
        default:
          return new Date(b.published_date || Date.now()) - new Date(a.published_date || Date.now());
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Medical Content Hub</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore evidence-based medical content in orthopedic and sports medicine, 
              enhanced with emotional intelligence and transformed into algorithmic art.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medical content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <select
                value={selectedSubspecialty}
                onChange={(e) => setSelectedSubspecialty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              >
                {subspecialties.map(sub => (
                  <option key={sub.value} value={sub.value}>{sub.label}</option>
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

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredAndSortedArticles.length} articles found`}
          </p>
          
          {algorithmState && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Algorithm is currently feeling:</span>
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

      {/* Articles Grid/List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="loading-skeleton h-64 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredAndSortedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={viewMode === 'grid' ? 'article-card relative' : 'article-card flex gap-6 relative'}
              >
                {/* Emotional Signature */}
                {article.signature_data && viewMode === 'grid' && (
                  <div className="absolute -top-10 -right-10">
                    <EmotionalSignature 
                      signatureData={article.signature_data}
                      emotionalData={article.emotional_data}
                      size={70}
                    />
                  </div>
                )}

                {viewMode === 'list' && article.signature_data && (
                  <div className="flex-shrink-0">
                    <EmotionalSignature 
                      signatureData={article.signature_data}
                      emotionalData={article.emotional_data}
                      size={80}
                    />
                  </div>
                )}

                {/* Cover Image */}
                {article.has_images && article.cover_image_id && viewMode === 'grid' && (
                  <div className="w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    <img
                      src={`${API_BASE}/api/images/${article.cover_image_id}?version=medium`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Subspecialty Color Bar */}
                <div className={`w-full h-4 ${article.has_images && article.cover_image_id && viewMode === 'grid' ? '' : 'rounded-t-lg'} subspecialty-${article.subspecialty} ${viewMode === 'list' ? 'hidden' : ''}`} />
                
                <div className={viewMode === 'grid' ? 'p-6' : 'flex-1 py-6'}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-xl text-primary mb-2 line-clamp-3 flex-1">
                      {article.title}
                    </h3>
                    
                    {viewMode === 'list' && (
                      <div className="ml-4 flex items-center gap-2">
                        <Award 
                          className="w-5 h-5"
                          style={{ color: getEmotionColor(article.emotional_data?.dominant_emotion) }}
                        />
                        <span className="text-sm font-medium">
                          {Math.round((article.evidence_strength || 0) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Article metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Filter className="w-4 h-4" />
                      <span className="capitalize">{article.subspecialty?.replace(/([A-Z])/g, ' $1')}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.read_time || 5} min read</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{Math.round((article.evidence_strength || 0) * 100)}% evidence</span>
                    </span>
                  </div>

                  {/* Emotional data */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Dominant emotion:</span>
                      <span 
                        className="text-sm font-medium capitalize"
                        style={{ color: getEmotionColor(article.emotional_data?.dominant_emotion) }}
                      >
                        {article.emotional_data?.dominant_emotion}
                      </span>
                    </div>

                    {/* Emotional intensity bars */}
                    {article.emotional_data && (
                      <div className="space-y-2">
                        {['hope', 'confidence', 'healing', 'breakthrough'].map(emotion => {
                          const value = article.emotional_data[emotion] || 0;
                          if (value < 0.1) return null;
                          
                          return (
                            <div key={emotion} className="flex items-center gap-2">
                              <span className="text-xs capitalize text-gray-500 w-20">{emotion}:</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded">
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
                    )}
                  </div>

                  <div className="flex gap-3">
                    {article.id ? (
                      <Link 
                        to={`/articles/${article.id}`}
                        className="btn-primary flex-1 text-center"
                        onClick={() => console.log('📄 Navigating to article:', article.id, article.title)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Article
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="btn-primary flex-1 text-center opacity-50 cursor-not-allowed"
                        title="Article ID missing"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Article
                      </button>
                    )}
                    
                    {getArtworkForArticle(article.id) ? (
                      <Link 
                        to={`/gallery/${getArtworkForArticle(article.id).id}`}
                        className="btn-secondary"
                      >
                        View Art
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="btn-secondary opacity-50 cursor-not-allowed"
                        title="No artwork available for this article"
                      >
                        View Art
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredAndSortedArticles.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </section>

      {/* Newsletter Signup Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ArticlesNewsletterForm />
      </section>
    </div>
  );
};

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

const generateSampleArticles = () => [
  {
    id: '1',
    title: 'ACL Reconstruction Outcomes in Elite Athletes: A Comprehensive Meta-Analysis',
    subspecialty: 'sportsMedicine',
    published_date: '2024-03-01',
    read_time: 8,
    evidence_strength: 0.85,
    emotional_data: { 
      dominant_emotion: 'confidence',
      hope: 0.6,
      confidence: 0.85,
      healing: 0.7,
      breakthrough: 0.3,
      emotional_intensity: 0.85
    },
    signature_data: {
      id: 'AKX-2024-0301-A1B2',
      concentric_rings: { count: 4, thickness: 2, rotation_speed: 1.2 },
      geometric_overlays: { shape: 'circle', color: '#3498db', scale: 1.1 },
      floating_particles: { count: 10, color: '#3498db' },
      rarity_score: 0.75
    }
  },
  {
    id: '2',
    title: 'Revolutionary Approaches to Rotator Cuff Repair Using Stem Cell Therapy',
    subspecialty: 'sportsMedicine',
    published_date: '2024-02-28',
    read_time: 12,
    evidence_strength: 0.92,
    emotional_data: { 
      dominant_emotion: 'breakthrough',
      hope: 0.8,
      confidence: 0.75,
      healing: 0.85,
      breakthrough: 0.92,
      emotional_intensity: 0.92
    },
    signature_data: {
      id: 'AKX-2024-0228-C3D4',
      concentric_rings: { count: 5, thickness: 3, rotation_speed: 1.8 },
      geometric_overlays: { shape: 'star', color: '#f39c12', scale: 1.3 },
      floating_particles: { count: 15, color: '#f39c12' },
      rarity_score: 0.95
    }
  },
  {
    id: '3',
    title: 'Healing Potential and Regenerative Medicine in Meniscus Tears',
    subspecialty: 'sportsMedicine',
    published_date: '2024-02-25',
    read_time: 6,
    evidence_strength: 0.78,
    emotional_data: { 
      dominant_emotion: 'healing',
      hope: 0.9,
      confidence: 0.65,
      healing: 0.95,
      breakthrough: 0.4,
      emotional_intensity: 0.95
    },
    signature_data: {
      id: 'AKX-2024-0225-E5F6',
      concentric_rings: { count: 3, thickness: 1.5, rotation_speed: 0.9 },
      geometric_overlays: { shape: 'hexagon', color: '#16a085', scale: 0.95 },
      floating_particles: { count: 8, color: '#16a085' },
      rarity_score: 0.68
    }
  },
  {
    id: '4',
    title: 'Complications and Risk Factors in Total Hip Arthroplasty: Current Evidence',
    subspecialty: 'jointReplacement',
    published_date: '2024-02-20',
    read_time: 10,
    evidence_strength: 0.82,
    emotional_data: { 
      dominant_emotion: 'tension',
      hope: 0.3,
      confidence: 0.6,
      healing: 0.4,
      breakthrough: 0.2,
      tension: 0.85,
      emotional_intensity: 0.85
    },
    signature_data: {
      id: 'AKX-2024-0220-G7H8',
      concentric_rings: { count: 6, thickness: 2.5, rotation_speed: 2.2 },
      geometric_overlays: { shape: 'triangle', color: '#e74c3c', scale: 1.15 },
      floating_particles: { count: 12, color: '#e74c3c' },
      rarity_score: 0.78
    }
  },
  {
    id: '5',
    title: 'Uncertainty in Spinal Fusion Techniques: A Systematic Review',
    subspecialty: 'spine',
    published_date: '2024-02-15',
    read_time: 7,
    evidence_strength: 0.65,
    emotional_data: { 
      dominant_emotion: 'uncertainty',
      hope: 0.4,
      confidence: 0.35,
      healing: 0.5,
      breakthrough: 0.25,
      uncertainty: 0.8,
      emotional_intensity: 0.8
    },
    signature_data: {
      id: 'AKX-2024-0215-I9J0',
      concentric_rings: { count: 2, thickness: 1.8, rotation_speed: 0.7 },
      geometric_overlays: { shape: 'diamond', color: '#95a5a6', scale: 0.85 },
      floating_particles: { count: 6, color: '#95a5a6' },
      rarity_score: 0.45
    }
  },
  {
    id: '6',
    title: 'Innovative Techniques in Hand Surgery: Microsurgical Advances',
    subspecialty: 'handUpperExtremity',
    published_date: '2024-02-10',
    read_time: 9,
    evidence_strength: 0.88,
    emotional_data: { 
      dominant_emotion: 'breakthrough',
      hope: 0.75,
      confidence: 0.8,
      healing: 0.7,
      breakthrough: 0.88,
      emotional_intensity: 0.88
    },
    signature_data: {
      id: 'AKX-2024-0210-K1L2',
      concentric_rings: { count: 4, thickness: 2.2, rotation_speed: 1.6 },
      geometric_overlays: { shape: 'star', color: '#f39c12', scale: 1.2 },
      floating_particles: { count: 11, color: '#f39c12' },
      rarity_score: 0.82
    }
  }
];

export default ArticlesHub;