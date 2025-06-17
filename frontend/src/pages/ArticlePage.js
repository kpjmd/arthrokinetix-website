import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Palette, Heart, ThumbsUp, ThumbsDown, Star, Award, Clock, User } from 'lucide-react';
import EmotionalSignature from '../components/EmotionalSignature';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

const ArticlePage = ({ algorithmState, onStateUpdate }) => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackEmotion, setFeedbackEmotion] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/articles/${slug}`);
      const articleData = await response.json();
      setArticle(articleData);

      // Fetch corresponding artwork
      const artworkResponse = await fetch(`${API_BASE}/api/artworks?article_id=${slug}`);
      const artworkData = await artworkResponse.json();
      if (artworkData.artworks?.length > 0) {
        setArtwork(artworkData.artworks[0]);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      // Set sample data for demo
      setArticle(getSampleArticle(slug));
      setArtwork(getSampleArtwork(slug));
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (emotion) => {
    try {
      const response = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: article.id,
          emotion: emotion,
          user_id: 'anonymous' // In real app, use authenticated user ID
        })
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setShowFeedbackForm(false);
        
        // Refresh algorithm state
        const stateResponse = await fetch(`${API_BASE}/api/algorithm-state`);
        const newState = await stateResponse.json();
        onStateUpdate(newState);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Demo success
      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
    }
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Article not found</h2>
          <Link to="/research" className="btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Research Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <section className={`py-16 text-white subspecialty-${article.subspecialty}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to="/research"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Research Hub
            </Link>

            <div className="flex items-start gap-8">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-white/90 mb-6">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Research Team
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {article.read_time || 5} min read
                  </span>
                  <span className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {Math.round((article.evidence_strength || 0) * 100)}% evidence strength
                  </span>
                  <span className="flex items-center gap-2 capitalize">
                    <BookOpen className="w-5 h-5" />
                    {article.subspecialty?.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>
              </div>

              {/* Emotional Signature */}
              {article.signature_data && (
                <div className="flex-shrink-0">
                  <EmotionalSignature 
                    signatureData={article.signature_data}
                    emotionalData={article.emotional_data}
                    size={120}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              {/* Abstract */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Abstract</h2>
                <p className="text-gray-700 leading-relaxed">
                  {article.abstract || `This comprehensive study examines the latest developments in ${article.subspecialty?.replace(/([A-Z])/g, ' $1').toLowerCase()} with a focus on evidence-based approaches and patient outcomes. Through rigorous analysis of current literature and clinical data, we present findings that contribute to the advancement of orthopedic surgical practices.`}
                </p>
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {article.content || `In the evolving landscape of ${article.subspecialty?.replace(/([A-Z])/g, ' $1').toLowerCase()}, recent advances have opened new possibilities for patient care and surgical outcomes. This research contributes to our understanding of optimal treatment protocols and long-term patient benefits.

                  The emotional undertone of this research reflects a ${article.emotional_data?.dominant_emotion} approach to the subject matter, with particular emphasis on evidence-based practices that prioritize patient safety and therapeutic efficacy.

                  Our analysis reveals significant correlations between surgical technique refinements and improved patient outcomes, suggesting a paradigm shift towards more personalized treatment approaches.`}
                </p>

                <h2 className="text-2xl font-bold text-primary mb-4">Methodology</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This study employed a comprehensive systematic review methodology, incorporating both quantitative and qualitative analyses. The research demonstrates a high evidence strength rating of {Math.round((article.evidence_strength || 0) * 100)}%, reflecting robust methodological rigor.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-4">Results & Discussion</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  The findings reveal compelling evidence supporting innovative approaches in {article.subspecialty?.replace(/([A-Z])/g, ' $1').toLowerCase()}. The emotional analysis of this research indicates strong themes of {article.emotional_data?.dominant_emotion}, suggesting optimistic prospects for clinical application.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-4">Conclusion</h2>
                <p className="text-gray-700 leading-relaxed">
                  This research contributes valuable insights to the field, with implications for both current practice and future research directions. The {article.emotional_data?.dominant_emotion} nature of these findings reflects the positive trajectory of developments in this subspecialty.
                </p>
              </div>

              {/* Feedback Section */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-bold text-primary mb-4">Your Emotional Response</h3>
                <p className="text-gray-600 mb-6">
                  Help the Arthrokinetix algorithm learn by sharing your emotional response to this research.
                  {!feedbackSubmitted && (
                    <span className="text-sm text-blue-600 ml-2">
                      (Unlock by subscribing to newsletter)
                    </span>
                  )}
                </p>

                {feedbackSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                  >
                    <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">
                      Thank you! Your feedback influences the algorithm's evolution.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {emotionOptions.map((emotion) => (
                      <button
                        key={emotion.key}
                        onClick={() => handleFeedbackSubmit(emotion.key)}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-all duration-200 text-center group"
                        style={{ '--hover-color': emotion.color }}
                      >
                        <span className="text-2xl mb-2 block">{emotion.icon}</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {emotion.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Emotional Analysis - CORRECTED VERSION */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-primary mb-4">Emotional Analysis</h3>
  
              <div className="space-y-6">
                {/* Dominant Emotion Display */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Dominant Emotion</p>
                  <div 
                    className="inline-flex items-center px-3 py-2 rounded-full text-white font-medium text-sm"
                    style={{ backgroundColor: getEmotionColor(article.emotional_data?.dominant_emotion) }}
                  >
                    {article.emotional_data?.dominant_emotion || 'Unknown'}
                  </div>
                </div>

                {/* Core Emotions Only (as percentages) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Core Emotions</h4>
                  {['hope', 'confidence', 'healing', 'breakthrough', 'tension', 'uncertainty'].map((emotion) => {
                     const value = article.emotional_data?.[emotion];
        
                    if (typeof value !== 'number' || isNaN(value) || value < 0.05) return null;
        
                    return (
                      <div key={emotion} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize text-gray-600">{emotion}</span>
                          <span className="font-medium">{Math.round(value * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded">
                          <div 
                            className="h-full rounded transition-all duration-300"
                            style={{ 
                              width: `${value * 100}%`, 
                              backgroundColor: getEmotionColor(emotion)
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Research Metrics (as percentages) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Research Quality</h4>
      
                  {/* Evidence Strength */}
                  {article.emotional_data?.evidence_strength && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Evidence Strength</span>
                        <span className="font-medium">{Math.round(article.emotional_data.evidence_strength * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full rounded transition-all duration-300 bg-blue-500"
                          style={{ width: `${article.emotional_data.evidence_strength * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Technical Density */}
                  {article.emotional_data?.technical_density && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Technical Density</span>
                        <span className="font-medium">{Math.round(article.emotional_data.technical_density * 100)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full rounded transition-all duration-300 bg-purple-500"
                          style={{ width: `${article.emotional_data.technical_density * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Subspecialty (as text label) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Classification</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Medical Subspecialty</span>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: '#2c3e50' }}
                    >
                      {formatSubspecialty(article.emotional_data?.subspecialty || article.subspecialty)}
                    </span>
                  </div>
                </div>

                {/* Emotional Signature Reference */}
                {article.signature_data?.id && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Signature ID</span>
                      <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {article.signature_data.id}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* View Artwork CTA */}
            {artwork && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-br from-innovation to-accent text-white rounded-xl p-6 shadow-lg"
              >
                <Palette className="w-12 h-12 mb-4 text-orange-200" />
                <h3 className="text-xl font-bold mb-2">Generated Artwork</h3>
                <p className="text-orange-100 mb-4">
                  View the algorithmic art piece generated from this research's emotional data.
                </p>
                <Link 
                  to={`/gallery/${artwork.id}`}
                  className="inline-flex items-center bg-white text-primary px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  <Palette className="w-5 h-5 mr-2" />
                  View Artwork
                </Link>
              </motion.div>
            )}

            {/* Algorithm State */}
            {algorithmState && (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-primary mb-4">Algorithm State</h3>
                
                <div className="text-center mb-4">
                  <div 
                    className="w-16 h-16 mx-auto mb-3 rounded-full border-2 animate-pulse"
                    style={{ 
                      borderColor: algorithmState.visual_representation?.color,
                      backgroundColor: `${algorithmState.visual_representation?.color}20`
                    }}
                  />
                  <p className="text-sm text-gray-500">Currently feeling:</p>
                  <p 
                    className="text-lg font-bold capitalize"
                    style={{ color: algorithmState.visual_representation?.color }}
                  >
                    {algorithmState.emotional_state?.dominant_emotion}
                  </p>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Articles processed: {algorithmState.articles_processed || 0}
                </p>
              </motion.div>
            )}
          </div>
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

const getSampleArticle = (id) => ({
  id: id,
  title: 'ACL Reconstruction Outcomes in Elite Athletes: A Comprehensive Meta-Analysis',
  subspecialty: 'sportsMedicine',
  read_time: 8,
  evidence_strength: 0.85,
  published_date: '2024-03-01',
  emotional_data: {
    dominant_emotion: 'confidence',
    hope: 0.6,
    confidence: 0.85,
    healing: 0.7,
    breakthrough: 0.3,
    tension: 0.2,
    uncertainty: 0.1
  },
  signature_data: {
    id: 'AKX-2024-0301-A1B2',
    concentric_rings: { count: 4, thickness: 2, rotation_speed: 1.2 },
    geometric_overlays: { shape: 'circle', color: '#3498db', scale: 1.1 },
    floating_particles: { count: 10, color: '#3498db' },
    rarity_score: 0.75
  },
  abstract: 'This comprehensive meta-analysis examines ACL reconstruction outcomes in elite athletes, focusing on return-to-sport rates, long-term joint health, and factors influencing successful recovery. Through analysis of 45 studies encompassing 3,200 elite athletes, we demonstrate significant improvements in surgical techniques and rehabilitation protocols over the past decade.',
  content: 'Recent advances in anterior cruciate ligament (ACL) reconstruction have revolutionized treatment approaches for elite athletes. This study represents the most comprehensive analysis to date, incorporating data from multiple high-level sports and examining both short-term and long-term outcomes. The confidence reflected in our findings stems from robust methodology and consistent results across diverse athletic populations.'
});

const getSampleArtwork = (articleId) => ({
  id: `artwork-${articleId}`,
  article_id: articleId,
  title: 'Algorithmic Synthesis #AKX-2024-0301-A1B2',
  subspecialty: 'sportsMedicine',
  dominant_emotion: 'confidence',
  metadata: { rarity_score: 0.75 }
});

const formatSubspecialty = (subspecialty) => {
  if (!subspecialty) return 'General Orthopedics'; 
  
  // Recognized orthopedic subspecialties
  const ORTHOPEDIC_SUBSPECIALTIES = {
    'sportsMedicine': 'Sports Medicine',
    'jointReplacement': 'Joint Replacement', 
    'trauma': 'Trauma',
    'spine': 'Spine',
    'handUpperExtremity': 'Hand & Upper Extremity',
    'footAnkle': 'Foot & Ankle',
    'shoulderElbow': 'Shoulder & Elbow',
    'pediatrics': 'Pediatrics',
    'oncology': 'Oncology'
  };
  
  // Direct mapping to recognized subspecialties
  if (ORTHOPEDIC_SUBSPECIALTIES[subspecialty]) {
    return ORTHOPEDIC_SUBSPECIALTIES[subspecialty];
  }
  
  // Handle common variations and legacy values
  const normalized = subspecialty.toLowerCase().replace(/[^a-z]/g, '');
  const variations = {
    'knee': 'Sports Medicine',           
    'hip': 'Joint Replacement',           
    'ankle': 'Foot & Ankle',
    'wrist': 'Hand & Upper Extremity',
    'shoulder': 'Shoulder & Elbow',
    'elbow': 'Shoulder & Elbow',
    'pediatric': 'Pediatrics',
    'peds': 'Pediatrics',
    'tumor': 'Oncology',
    'cancer': 'Oncology'
  };
  
  if (variations[normalized]) {
    return variations[normalized];
  }
  
  // Final fallback: convert camelCase to Title Case
  return subspecialty
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export default ArticlePage;
