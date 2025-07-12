import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, BookOpen, Clock, Award, FileText, Shield, CheckCircle } from 'lucide-react';
import EmotionalSignature from '../components/EmotionalSignature';
import { ArticlesNewsletterForm } from '../components/NewsletterForms';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ArticlesHub = () => {
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
    { key: 'evidence_strength', label: 'Evidence Strength' },
    { key: 'clinical_relevance', label: 'Clinical Relevance' },
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
        case 'clinical_relevance':
          // Sort by combination of evidence strength and technical density
          const aRelevance = ((a.evidence_strength || 0) * 0.7) + ((a.technical_density || 0) * 0.3);
          const bRelevance = ((b.evidence_strength || 0) * 0.7) + ((b.technical_density || 0) * 0.3);
          return bRelevance - aRelevance;
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
      <style jsx>{`
        .subspecialty-gradient-sportsMedicine { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .subspecialty-gradient-jointReplacement { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .subspecialty-gradient-trauma { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .subspecialty-gradient-spine { background: linear-gradient(135deg, #10b981, #059669); }
        .subspecialty-gradient-handUpperExtremity { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .subspecialty-gradient-footAnkle { background: linear-gradient(135deg, #ec4899, #db2777); }
        .subspecialty-gradient-shoulderElbow { background: linear-gradient(135deg, #6366f1, #4f46e5); }
        .subspecialty-gradient-pediatrics { background: linear-gradient(135deg, #14b8a6, #0d9488); }
        .subspecialty-gradient-oncology { background: linear-gradient(135deg, #a855f7, #9333ea); }
        .subspecialty-gradient-undefined { background: linear-gradient(135deg, #6b7280, #4b5563); }
      `}</style>
      {/* Professional Header */}
      <section className="bg-gradient-to-r from-slate-50 to-blue-50 border-b py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Medical Literature Library</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access evidence-based clinical content in orthopedic surgery and sports medicine. 
              Our curated library provides peer-reviewed insights for medical professionals and researchers.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                Evidence-Based Content
              </span>
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-1 text-blue-600" />
                Clinical Perspectives
              </span>
              <span className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-purple-600" />
                Research Quality
              </span>
            </div>
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
                placeholder="Search clinical literature..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <select
                value={selectedSubspecialty}
                onChange={(e) => setSelectedSubspecialty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subspecialties.map(sub => (
                  <option key={sub.value} value={sub.value}>{sub.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.key} value={option.key}>Sort by {option.label}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                  title="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                  title="List view"
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
          <div>
            <p className="text-gray-900 font-medium">
              {loading ? 'Loading publications...' : (
                <>
                  <span className="text-2xl font-semibold">{filteredAndSortedArticles.length}</span>
                  <span className="text-gray-600 ml-2">clinical publications found</span>
                </>
              )}
            </p>
            {selectedSubspecialty !== 'all' && (
              <p className="text-sm text-gray-500 mt-1">
                Filtered by {subspecialties.find(s => s.value === selectedSubspecialty)?.label}
              </p>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Quality-verified content
            </span>
          </div>
        </div>
      </section>

      {/* Articles Grid/List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading clinical publications...</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAndSortedArticles.map((article, index) => {
              const evidenceStrength = article.evidence_strength || 0;
              const evidenceQuality = getEvidenceQualityBadge(evidenceStrength, article.technical_density);
              
              return (
                <motion.div
                  key={article.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={viewMode === 'grid' ? 
                    'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100' : 
                    'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex gap-6'
                  }
                >
                  {/* Grid View Layout */}
                  {viewMode === 'grid' && (
                    <div className="relative">
                      {/* Subtle Emotional Signature - Top Right Corner */}
                      {article.signature_data && (
                        <div className="absolute top-4 right-4 z-10">
                          <EmotionalSignature 
                            signatureData={article.signature_data}
                            emotionalData={article.emotional_data}
                            size={40}
                          />
                        </div>
                      )}

                      {/* Cover Image or Subspecialty Header */}
                      {article.has_images && article.cover_image_id ? (
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
                      ) : (
                        <div className={`w-full h-16 rounded-t-lg bg-gradient-to-r subspecialty-gradient-${article.subspecialty} flex items-center px-6`}>
                          <FileText className="w-5 h-5 text-white/80 mr-2" />
                          <span className="text-white font-medium capitalize">
                            {article.subspecialty?.replace(/([A-Z])/g, ' $1').trim() || 'Clinical Article'}
                          </span>
                        </div>
                      )}
                
                      <div className="p-6">
                        {/* Evidence Quality Badge */}
                        <div className="mb-3">
                          {evidenceQuality}
                        </div>
                        
                        {/* Article Title */}
                        <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        
                        {/* Professional Metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.read_time || 5} min read
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {article.content_type?.toUpperCase() || 'TEXT'}
                          </span>
                          {article.published_date && (
                            <span className="text-gray-500">
                              {new Date(article.published_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          )}
                        </div>
                        
                        {/* Meta Description or Excerpt */}
                        {article.meta_description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {article.meta_description}
                          </p>
                        )}

                        {/* Subtle Clinical Insight */}
                        {article.emotional_data?.dominant_emotion && (
                          <div className="text-xs text-gray-500 mb-4">
                            Clinical focus: <span className="capitalize font-medium">{article.emotional_data.dominant_emotion}</span>
                          </div>
                        )}

                        {/* Action Button */}
                        <Link 
                          to={`/articles/${article.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                          Read Full Article
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* List View Layout */}
                  {viewMode === 'list' && (
                    <>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            {/* Evidence Badge and Title */}
                            <div className="flex items-center gap-3 mb-2">
                              {evidenceQuality}
                              <span className="text-sm text-gray-500">
                                {article.subspecialty?.replace(/([A-Z])/g, ' $1').trim() || 'Clinical Article'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-xl text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                              {article.title}
                            </h3>
                          </div>
                          
                          {/* Subtle Signature for List View */}
                          {article.signature_data && (
                            <div className="ml-4">
                              <EmotionalSignature 
                                signatureData={article.signature_data}
                                emotionalData={article.emotional_data}
                                size={50}
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Metadata Bar */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {article.read_time || 5} min read
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {article.content_type?.toUpperCase() || 'TEXT'}
                          </span>
                          {article.published_date && (
                            <span>
                              {new Date(article.published_date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                          )}
                        </div>
                        
                        {/* Description */}
                        {article.meta_description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {article.meta_description}
                          </p>
                        )}
                        
                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          <Link 
                            to={`/articles/${article.id}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Read Full Article
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          
                          {getArtworkForArticle(article.id) && (
                            <Link 
                              to={`/gallery/${getArtworkForArticle(article.id).id}`}
                              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              View Visualization
                            </Link>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredAndSortedArticles.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No clinical publications found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search terms or filters to find relevant medical content.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        )}
      </section>

      {/* Professional Newsletter Section */}
      <section className="bg-gray-100 border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Stay Informed with Clinical Updates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our professional community to receive evidence-based medical content, 
              research insights, and clinical perspectives delivered to your inbox.
            </p>
          </div>
          <ArticlesNewsletterForm />
        </div>
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

const getEvidenceQualityBadge = (evidenceStrength, technicalDensity) => {
  const strength = evidenceStrength || 0;
  const density = technicalDensity || 0;
  const overallQuality = (strength * 0.7) + (density * 0.3);
  
  let badgeColor = 'bg-gray-100 text-gray-700';
  let badgeText = 'Clinical Content';
  
  if (overallQuality >= 0.8) {
    badgeColor = 'bg-green-100 text-green-800';
    badgeText = 'High Evidence Quality';
  } else if (overallQuality >= 0.6) {
    badgeColor = 'bg-blue-100 text-blue-800';
    badgeText = 'Strong Evidence';
  } else if (overallQuality >= 0.4) {
    badgeColor = 'bg-yellow-100 text-yellow-800';
    badgeText = 'Moderate Evidence';
  }
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
      <CheckCircle className="w-3 h-3 mr-1" />
      {badgeText}
    </div>
  );
};

const generateSampleArticles = () => [
  {
    id: '1',
    title: 'ACL Reconstruction Outcomes in Elite Athletes: A Comprehensive Meta-Analysis',
    subspecialty: 'sportsMedicine',
    published_date: '2024-03-01',
    read_time: 8,
    evidence_strength: 0.85,
    technical_density: 0.78,
    content_type: 'text',
    meta_description: 'Comprehensive analysis of ACL reconstruction outcomes in elite athletes, examining return-to-sport rates and long-term functional outcomes.',
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
    technical_density: 0.85,
    content_type: 'html',
    meta_description: 'Exploring cutting-edge stem cell therapy approaches for rotator cuff repair, with focus on regenerative medicine applications.',
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
    technical_density: 0.72,
    content_type: 'text',
    meta_description: 'Current evidence on regenerative medicine approaches for meniscus tear treatment, focusing on healing potential and patient outcomes.',
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
    technical_density: 0.88,
    content_type: 'pdf',
    meta_description: 'Systematic review of complications and risk factors in total hip arthroplasty, providing evidence-based risk stratification strategies.',
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
    technical_density: 0.75,
    content_type: 'text',
    meta_description: 'Systematic review examining uncertainties in current spinal fusion techniques and their impact on surgical decision-making.',
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
    technical_density: 0.82,
    content_type: 'html',
    meta_description: 'Review of innovative microsurgical techniques in hand surgery, highlighting recent advances and clinical applications.', 
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