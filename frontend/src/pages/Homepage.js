import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Palette, Zap, Users, TrendingUp, Heart } from 'lucide-react';
import EmotionalSignature from '../components/EmotionalSignature';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

const Homepage = ({ algorithmState, onStateUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch latest articles and artworks
      const [articlesRes, artworksRes] = await Promise.all([
        fetch(`${API_BASE}/api/articles`),
        fetch(`${API_BASE}/api/artworks`)
      ]);
      
      const articlesData = await articlesRes.json();
      const artworksData = await artworksRes.json();
      
      setArticles(articlesData.articles?.slice(0, 4) || []);
      setArtworks(artworksData.artworks?.slice(0, 4) || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Set sample data for demo
      setArticles(generateSampleArticles());
      setArtworks(generateSampleArtworks());
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('subscribing');
    
    // Simulate newsletter signup
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Split Design */}
      <section className="relative h-screen flex">
        {/* Medical Education Side */}
        <motion.div 
          className="w-1/2 bg-gradient-to-br from-primary-dark via-primary to-secondary flex flex-col justify-center items-center text-white p-12"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-lg text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-healing" />
            <h1 className="text-4xl font-bold mb-4">
              Evidence-Based
              <br />
              Medical Research
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Explore cutting-edge orthopedic surgery and sports medicine literature, 
              analyzed through our proprietary emotional intelligence algorithm.
            </p>
            <Link 
              to="/research"
              className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Research
            </Link>
          </div>
        </motion.div>

        {/* Algorithmic Art Side */}
        <motion.div 
          className="w-1/2 bg-gradient-to-br from-healing via-innovation to-accent flex flex-col justify-center items-center text-white p-12"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-lg text-center">
            <Palette className="w-16 h-16 mx-auto mb-6 text-orange-200" />
            <h1 className="text-4xl font-bold mb-4">
              Algorithmic
              <br />
              Art Generation
            </h1>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Witness the transformation of medical data into stunning visual art 
              through our unique Arthrokinetix algorithm's emotional processing.
            </p>
            <Link 
              to="/gallery"
              className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-orange-50 transition-colors duration-200"
            >
              <Palette className="w-5 h-5 mr-2" />
              View Gallery
            </Link>
          </div>
        </motion.div>

        {/* Algorithm State Display - Centered */}
        {algorithmState && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 pointer-events-auto max-w-sm mx-4">
              <div className="text-center text-white">
                <h3 className="font-semibold mb-4 text-lg">Algorithm Emotional State</h3>
                <motion.div 
                  className="w-20 h-20 mx-auto mb-4 rounded-full border-4 flex items-center justify-center"
                  style={{ 
                    borderColor: algorithmState.visual_representation?.color,
                    backgroundColor: `${algorithmState.visual_representation?.color}20`
                  }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-2xl font-bold">
                    {getEmotionSymbol(algorithmState.emotional_state?.dominant_emotion)}
                  </span>
                </motion.div>
                <p className="text-lg capitalize font-medium mb-2">
                  {algorithmState.emotional_state?.dominant_emotion}
                </p>
                <p className="text-sm opacity-90 mb-3">
                  {Math.round((algorithmState.emotional_state?.emotional_intensity || 0) * 100)}% intensity
                </p>
                <div className="text-xs opacity-75">
                  <p>{algorithmState.articles_processed || 0} articles processed</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Latest Research Articles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each article is processed through our Arthrokinetix algorithm to generate 
              unique emotional signatures and corresponding artworks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="article-card loading-skeleton h-64" />
              ))
            ) : (
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className="article-card relative"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  {/* Emotional Signature Badge */}
                  {article.signature_data && (
                    <div className="absolute -top-10 -right-10">
                      <EmotionalSignature 
                        signatureData={article.signature_data}
                        emotionalData={article.emotional_data}
                        size={60}
                      />
                    </div>
                  )}

                  <div className={`w-full h-4 rounded-t-lg subspecialty-${article.subspecialty}`} />
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="capitalize">{article.subspecialty?.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="mx-2">•</span>
                      <span>{article.read_time || 5} min read</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-gray-500">Dominant emotion:</span>
                        <span 
                          className="ml-2 capitalize font-medium"
                          style={{ color: getEmotionColor(article.emotional_data?.dominant_emotion) }}
                        >
                          {article.emotional_data?.dominant_emotion}
                        </span>
                      </div>
                      
                      <Link 
                        to={`/research/${article.id}`}
                        className="btn-secondary"
                      >
                        Read
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/research"
              className="btn-primary"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Featured Algorithmic Artworks
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visual representations of medical research data, transformed through 
              emotional analysis into unique digital art pieces.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="artwork-item loading-skeleton h-64" />
              ))
            ) : (
              artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  className="artwork-item"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="artwork-preview">
                    {/* SVG Art Preview */}
                    <svg 
                      className="w-full h-full" 
                      viewBox="0 0 200 200"
                      style={{ background: 'linear-gradient(45deg, #f0f8ff, #e6f3ff)' }}
                    >
                      {/* Simplified Andry Tree visualization */}
                      <g transform="translate(100, 180)">
                        {/* Tree trunk */}
                        <rect x="-3" y="-60" width="6" height="60" fill="#8b4513" />
                        
                        {/* Branches */}
                        <line x1="0" y1="-40" x2="-20" y2="-60" stroke="#8b4513" strokeWidth="2" />
                        <line x1="0" y1="-40" x2="20" y2="-60" stroke="#8b4513" strokeWidth="2" />
                        <line x1="0" y1="-25" x2="-15" y2="-45" stroke="#8b4513" strokeWidth="2" />
                        <line x1="0" y1="-25" x2="15" y2="-45" stroke="#8b4513" strokeWidth="2" />
                        
                        {/* Emotional particles */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <circle
                            key={i}
                            cx={Math.cos(i * 45 * Math.PI / 180) * 30}
                            cy={Math.sin(i * 45 * Math.PI / 180) * 30 - 40}
                            r="2"
                            fill={artwork.algorithm_parameters?.color_palette?.[0]?.color || '#3498db'}
                            opacity="0.7"
                          />
                        ))}
                      </g>
                    </svg>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-primary mb-2">
                      {artwork.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="capitalize">{artwork.subspecialty?.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{artwork.dominant_emotion}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-gray-500">Rarity:</span>
                        <span className="ml-2 font-medium">
                          {artwork.metadata?.rarity_score ? `${Math.round(artwork.metadata.rarity_score * 100)}%` : 'Common'}
                        </span>
                      </div>
                      
                      <Link 
                        to={`/gallery/${artwork.id}`}
                        className="btn-secondary"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/gallery"
              className="btn-primary"
            >
              <Palette className="w-5 h-5 mr-2" />
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              How Arthrokinetix Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our proprietary algorithm transforms medical research into emotional experiences 
              and artistic expressions through advanced analysis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Emotional Analysis",
                description: "The algorithm analyzes medical literature for emotional undertones, evidence strength, and research confidence levels."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Signature Generation",
                description: "Each article generates a unique visual signature with concentric rings, geometric overlays, and floating particles."
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Art Creation",
                description: "The emotional data transforms into Andry Tree visualizations with healing elements and subspecialty-specific styling."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Join the Arthrokinetix Community
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe to access emotional feedback features and influence the algorithm's evolution.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="newsletter-form max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input text-gray-900"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              
              <button 
                type="submit"
                className="btn-primary w-full"
                disabled={newsletterStatus === 'subscribing'}
              >
                {newsletterStatus === 'subscribing' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-2" />
                    Subscribe & Unlock Features
                  </>
                )}
              </button>

              {newsletterStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-300 mt-3"
                >
                  Welcome to Arthrokinetix! Check your email for confirmation.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
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

const getEmotionSymbol = (emotion) => {
  const symbols = {
    hope: '○',
    confidence: '■',
    breakthrough: '★',
    healing: '⬢',
    tension: '▲',
    uncertainty: '◆'
  };
  return symbols[emotion] || '○';
};

const generateSampleArticles = () => [
  {
    id: '1',
    title: 'ACL Reconstruction Outcomes in Elite Athletes',
    subspecialty: 'sportsMedicine',
    emotional_data: { dominant_emotion: 'confidence' },
    signature_data: {
      id: 'AKX-2024-0301-A1B2',
      concentric_rings: { count: 3, thickness: 2, rotation_speed: 1 },
      geometric_overlays: { shape: 'circle', color: '#3498db', scale: 1 },
      floating_particles: { count: 8, color: '#3498db' },
      rarity_score: 0.65
    },
    read_time: 6
  },
  {
    id: '2',
    title: 'Novel Approaches to Rotator Cuff Repair',
    subspecialty: 'sportsMedicine',
    emotional_data: { dominant_emotion: 'breakthrough' },
    signature_data: {
      id: 'AKX-2024-0302-C3D4',
      concentric_rings: { count: 4, thickness: 3, rotation_speed: 1.5 },
      geometric_overlays: { shape: 'star', color: '#f39c12', scale: 1.2 },
      floating_particles: { count: 12, color: '#f39c12' },
      rarity_score: 0.85
    },
    read_time: 8
  },
  {
    id: '3',
    title: 'Healing Potential in Meniscus Regeneration',
    subspecialty: 'sportsMedicine',
    emotional_data: { dominant_emotion: 'healing' },
    signature_data: {
      id: 'AKX-2024-0303-E5F6',
      concentric_rings: { count: 2, thickness: 1.5, rotation_speed: 0.8 },
      geometric_overlays: { shape: 'hexagon', color: '#16a085', scale: 0.9 },
      floating_particles: { count: 6, color: '#16a085' },
      rarity_score: 0.45
    },
    read_time: 5
  },
  {
    id: '4',
    title: 'Complications in Total Hip Arthroplasty',
    subspecialty: 'jointReplacement',
    emotional_data: { dominant_emotion: 'tension' },
    signature_data: {
      id: 'AKX-2024-0304-G7H8',
      concentric_rings: { count: 5, thickness: 2.5, rotation_speed: 2 },
      geometric_overlays: { shape: 'triangle', color: '#e74c3c', scale: 1.1 },
      floating_particles: { count: 10, color: '#e74c3c' },
      rarity_score: 0.72
    },
    read_time: 7
  }
];

const generateSampleArtworks = () => [
  {
    id: '1',
    title: 'Algorithmic Synthesis #AKX-2024-0301-A1B2',
    subspecialty: 'sportsMedicine',
    dominant_emotion: 'confidence',
    algorithm_parameters: {
      color_palette: [{ color: '#3498db' }]
    },
    metadata: { rarity_score: 0.65 }
  },
  {
    id: '2', 
    title: 'Algorithmic Synthesis #AKX-2024-0302-C3D4',
    subspecialty: 'sportsMedicine',
    dominant_emotion: 'breakthrough',
    algorithm_parameters: {
      color_palette: [{ color: '#f39c12' }]
    },
    metadata: { rarity_score: 0.85 }
  },
  {
    id: '3',
    title: 'Algorithmic Synthesis #AKX-2024-0303-E5F6',
    subspecialty: 'sportsMedicine', 
    dominant_emotion: 'healing',
    algorithm_parameters: {
      color_palette: [{ color: '#16a085' }]
    },
    metadata: { rarity_score: 0.45 }
  },
  {
    id: '4',
    title: 'Algorithmic Synthesis #AKX-2024-0304-G7H8',
    subspecialty: 'jointReplacement',
    dominant_emotion: 'tension',
    algorithm_parameters: {
      color_palette: [{ color: '#e74c3c' }]
    },
    metadata: { rarity_score: 0.72 }
  }
];

export default Homepage;