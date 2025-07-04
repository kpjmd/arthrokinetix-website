import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Palette, Zap, Users, TrendingUp, Heart } from 'lucide-react';
import EmotionalSignature from '../components/EmotionalSignature';
import ShareButtons from '../components/ShareButtons';
import { HeroNewsletterForm } from '../components/NewsletterForms';
import SEOHead from '../components/SEOHead';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const Homepage = ({ algorithmState, onStateUpdate }) => {
  const [articles, setArticles] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [totalArtworks, setTotalArtworks] = useState(0);
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
      setTotalArtworks(artworksData.artworks?.length || 0);
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
    
    try {
      const response = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        // Store subscription status locally
        localStorage.setItem('newsletter_subscribed', 'true');
        localStorage.setItem('newsletter_email', newsletterEmail);
      } else {
        setNewsletterStatus('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Arthrokinetix - Where Medical Content Meets Algorithmic Art"
        description="Revolutionary platform transforming evidence-based medical content into unique digital art through emotional AI analysis. Explore the intersection of medical education and algorithmic creativity."
        keywords="medical content, algorithmic art, orthopedic surgery, sports medicine, joint replacement, trauma surgery, emotional AI, content visualization, evidence-based medicine, medical newsletter"
        url="/"
      />
      
      {/* Hero Section - Split Design */}
      <section className="relative h-screen flex">
        {/* Medical Content Side */}
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
              Medical Content
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Explore curated medical content in orthopedic surgery and sports medicine, 
              enhanced with emotional intelligence and algorithmic art generation.
            </p>
            <Link 
              to="/articles"
              className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Content
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
              Art Vernissage
            </h1>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Witness the transformation of medical content into stunning visual art 
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

        {/* Algorithm State Display - Perfectly Centered */}
        {algorithmState && (
          <div className="absolute bottom-8 left-0 right-0 pointer-events-none z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <motion.div 
                  className="inline-block bg-white/15 backdrop-blur-lg rounded-xl p-6 border border-white/30 pointer-events-auto shadow-2xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <div className="text-center text-white">
                    <h3 className="font-semibold mb-3 text-lg">Algorithm State</h3>
                    <motion.div 
                      className="w-16 h-16 mx-auto mb-3 rounded-full border-4 flex items-center justify-center"
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
                      <span className="text-xl font-bold">
                        {getEmotionSymbol(algorithmState.emotional_state?.dominant_emotion)}
                      </span>
                    </motion.div>
                    <p className="text-base capitalize font-medium mb-2">
                      {algorithmState.emotional_state?.dominant_emotion}
                    </p>
                    <p className="text-sm opacity-90 mb-2">
                      {Math.round((algorithmState.emotional_state?.emotional_intensity || 0) * 100)}% intensity
                    </p>
                    <div className="text-xs opacity-75">
                      <p>{algorithmState.articles_processed || 0} articles processed</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Latest Medical Articles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Latest Medical Articles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover evidence-based medical content that bridges the gap between clinical excellence 
              and emotional understanding through algorithmic art.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="loading-skeleton h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="article-card group relative"
                >
                  {/* Emotional Signature */}
                  {article.signature_data && (
                    <div className="absolute -top-8 -right-8 z-10">
                      <EmotionalSignature 
                        signatureData={article.signature_data}
                        emotionalData={article.emotional_data}
                        size={60}
                      />
                    </div>
                  )}

                  {/* Subspecialty Color Bar */}
                  <div className={`w-full h-4 rounded-t-lg subspecialty-${article.subspecialty}`} />
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-primary mb-3 line-clamp-3 group-hover:text-secondary transition-colors">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="capitalize">{article.subspecialty?.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{article.read_time || 5} min</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">Emotion:</span>
                      <span 
                        className="text-sm font-medium capitalize"
                        style={{ color: getEmotionColor(article.emotional_data?.dominant_emotion) }}
                      >
                        {article.emotional_data?.dominant_emotion}
                      </span>
                    </div>

                    <Link 
                      to={`/articles/${article.id}`}
                      className="btn-primary w-full text-center text-sm"
                    >
                      Read Article
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/articles"
              className="btn-secondary inline-flex items-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Algorithm Art Gallery Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">Algorithmic Art Gallery</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each medical article transforms into unique digital art through our proprietary algorithm, 
              creating a visual narrative of medical progress and emotional intelligence.
            </p>
          </motion.div>

          {loading ? (
            <div className="artwork-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="loading-skeleton h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="artwork-grid">
              {artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="artwork-item group"
                >
                  <div className="artwork-preview relative overflow-hidden">
                    {/* Simple placeholder art representation */}
                    <div 
                      className="w-full h-full rounded-lg"
                      style={{ background: getArtworkBackground(artwork.dominant_emotion) }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-32 h-32 rounded-full border-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                          style={{ borderColor: getEmotionColor(artwork.dominant_emotion) }}
                        >
                          {getEmotionSymbol(artwork.dominant_emotion)}
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link 
                        to={`/gallery/${artwork.id}`}
                        className="text-white font-semibold px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-primary mb-2 line-clamp-2">{artwork.title}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="capitalize">{artwork.dominant_emotion}</span>
                      <span>{formatDate(artwork.created_date)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/gallery"
              className="btn-secondary inline-flex items-center"
            >
              <Palette className="w-5 h-5 mr-2" />
              Explore Gallery
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
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">How Arthrokinetix Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our revolutionary platform combines medical education with algorithmic creativity, 
              creating a unique experience that bridges analytical rigor with emotional intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-12 h-12" />,
                title: "Evidence-Based Content",
                description: "Curated medical content focusing on orthopedic surgery and sports medicine, with support for HTML, PDF, and text formats.",
                step: "01"
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Emotional Analysis",
                description: "Our AI algorithm analyzes content for emotional undertones: hope, confidence, healing, breakthrough, tension, and uncertainty.",
                step: "02"
              },
              {
                icon: <Palette className="w-12 h-12" />,
                title: "Art Generation",
                description: "Emotional data transforms into unique Andry Tree visualizations, creating algorithmic art that represents the medical journey.",
                step: "03"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-6">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats and Newsletter */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Stats */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-8">Platform Impact</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-healing mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {algorithmState?.articles_processed || '1,247'}
                  </motion.div>
                  <p className="text-blue-100">Articles Processed</p>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-accent mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {totalArtworks || '7'}
                  </motion.div>
                  <p className="text-blue-100">Artworks Generated</p>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-innovation mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    9
                  </motion.div>
                  <p className="text-blue-100">Subspecialties</p>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-healing mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    95%
                  </motion.div>
                  <p className="text-blue-100">User Satisfaction</p>
                </div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <HeroNewsletterForm />
            </motion.div>
          </div>
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
    hope: '🌱',
    confidence: '💪',
    breakthrough: '⚡',
    healing: '💚',
    tension: '⚠️',
    uncertainty: '❓'
  };
  return symbols[emotion] || '💙';
};

const getArtworkBackground = (emotion) => {
  const gradients = {
    hope: 'linear-gradient(45deg, #d5f5d0, #a8e6a1)',
    confidence: 'linear-gradient(45deg, #dae8fc, #b3d9ff)',
    breakthrough: 'linear-gradient(45deg, #fff3d0, #ffe0a3)',
    healing: 'linear-gradient(45deg, #d0f5f0, #a3e6d7)',
    tension: 'linear-gradient(45deg, #fdd5d5, #ffb3b3)',
    uncertainty: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)'
  };
  return gradients[emotion] || gradients.confidence;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const generateSampleArticles = () => [
  {
    id: '1',
    title: 'Advanced Arthroscopic Techniques in Sports Medicine',
    subspecialty: 'sportsMedicine',
    read_time: 8,
    emotional_data: { dominant_emotion: 'confidence' },
    signature_data: { id: 'AKX-2024-0301-A1B2' }
  },
  {
    id: '2',
    title: 'Breakthrough Stem Cell Therapy for Rotator Cuff Repair',
    subspecialty: 'shoulderElbow',
    read_time: 12,
    emotional_data: { dominant_emotion: 'breakthrough' },
    signature_data: { id: 'AKX-2024-0228-C3D4' }
  },
  {
    id: '3',
    title: 'Regenerative Medicine in Meniscus Healing',
    subspecialty: 'sportsMedicine',
    read_time: 6,
    emotional_data: { dominant_emotion: 'healing' },
    signature_data: { id: 'AKX-2024-0225-E5F6' }
  },
  {
    id: '4',
    title: 'Innovative Microsurgical Advances in Hand Surgery',
    subspecialty: 'handUpperExtremity',
    read_time: 9,
    emotional_data: { dominant_emotion: 'breakthrough' },
    signature_data: { id: 'AKX-2024-0210-K1L2' }
  }
];

const generateSampleArtworks = () => [
  {
    id: '1',
    title: 'Algorithmic Synthesis #AKX-2024-0301-A1B2',
    dominant_emotion: 'confidence',
    created_date: '2024-03-01'
  },
  {
    id: '2',
    title: 'Algorithmic Synthesis #AKX-2024-0228-C3D4',
    dominant_emotion: 'breakthrough',
    created_date: '2024-02-28'
  },
  {
    id: '3',
    title: 'Algorithmic Synthesis #AKX-2024-0225-E5F6',
    dominant_emotion: 'healing',
    created_date: '2024-02-25'
  },
  {
    id: '4',
    title: 'Algorithmic Synthesis #AKX-2024-0210-K1L2',
    dominant_emotion: 'breakthrough',
    created_date: '2024-02-10'
  }
];

export default Homepage;