import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Palette, Heart, ThumbsUp, ThumbsDown, Star, Award, Clock, User, FileText, File, Download, Image } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import EmotionalSignature from '../components/EmotionalSignature';
import FeedbackForm from '../components/FeedbackForm';
import { AuthModal, SignedIn, SignedOut } from '../components/AuthComponents';
import { Web3AccessGate } from '../components/Web3AuthComponents';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ArticlePage = ({ algorithmState, onStateUpdate }) => {
  const { slug } = useParams();
  const { user, isSignedIn } = useUser();
  const [article, setArticle] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up');

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
      const artworkResponse = await fetch(`${API_BASE}/api/artworks`);
      const artworkData = await artworkResponse.json();
      if (artworkData.artworks?.length > 0) {
        // Find artwork that matches this article
        const matchingArtwork = artworkData.artworks.find(art => art.article_id === slug);
        if (matchingArtwork) {
          setArtwork(matchingArtwork);
        }
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

  const handleFeedbackSubmitted = async (emotion) => {
    // Refresh algorithm state when feedback is submitted
    try {
      const stateResponse = await fetch(`${API_BASE}/api/algorithm-state`);
      const newState = await stateResponse.json();
      if (onStateUpdate) {
        onStateUpdate(newState);
      }
    } catch (error) {
      console.error('Error updating algorithm state:', error);
    }
  };

  const handleSignUp = () => {
    setAuthMode('sign-up');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('sign-in');
    setShowAuthModal(true);
  };

  const renderContent = () => {
    if (!article) return null;

    // Render based on content type
    switch (article.content_type) {
      case 'html':
        return (
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: article.html_content || article.content }}
              className="article-html-content"
            />
            
            {/* Render associated infographics */}
            {renderInfographics()}
          </div>
        );
      
      case 'pdf':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <File className="w-6 h-6 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold text-yellow-800">PDF Document</h3>
            </div>
            <p className="text-yellow-700 mb-4">
              This content was uploaded as a PDF document. The algorithmic analysis has been completed, 
              but full PDF rendering is coming soon.
            </p>
            {article.file_data && (
              <div className="flex items-center space-x-4 text-sm text-yellow-600">
                <span>Filename: {article.file_data.filename}</span>
                <span>Size: {(article.file_data.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
            
            {/* Render associated infographics for PDF articles too */}
            {renderInfographics()}
          </div>
        );
      
      default:
        return (
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap">
              {article.content}
            </div>
            
            {/* Render associated infographics */}
            {renderInfographics()}
          </div>
        );
    }
  };

  const renderInfographics = () => {
    if (!article) return null;

    // Check for infographics in various possible locations
    const infographics = [];

    // Check for infographic_html in article data
    if (article.infographic_html) {
      infographics.push({
        type: 'html',
        content: article.infographic_html,
        title: 'Associated Infographic'
      });
    }

    // Check for infographics array
    if (article.infographics && Array.isArray(article.infographics)) {
      article.infographics.forEach((infographic, index) => {
        if (infographic.html_content) {
          infographics.push({
            type: 'html',
            content: infographic.html_content,
            title: infographic.title || `Infographic ${index + 1}`
          });
        }
      });
    }

    // Check for infographic data in file_data (for HTML uploads that might include infographics)
    if (article.file_data && article.file_data.infographic_content) {
      infographics.push({
        type: 'html',
        content: article.file_data.infographic_content,
        title: 'Embedded Infographic'
      });
    }

    // Check if the HTML content itself contains infographic markers
    if (article.content_type === 'html' && article.html_content) {
      const infographicMatch = article.html_content.match(/<!-- INFOGRAPHIC START -->([\s\S]*?)<!-- INFOGRAPHIC END -->/g);
      if (infographicMatch) {
        infographicMatch.forEach((match, index) => {
          const content = match.replace(/<!-- INFOGRAPHIC START -->|<!-- INFOGRAPHIC END -->/g, '').trim();
          infographics.push({
            type: 'html',
            content: content,
            title: `Article Infographic ${index + 1}`
          });
        });
      }
    }

    if (infographics.length === 0) return null;

    return (
      <div className="mt-8">
        {infographics.map((infographic, index) => (
          <div key={index} className="mb-8">
            <div className="flex items-center mb-4">
              <Image className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">{infographic.title}</h3>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {infographic.type === 'html' ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: infographic.content }}
                  className="infographic-content"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Infographic content not available</p>
                </div>
              )}
            </div>
          </div>
        ))}
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Article not found</h2>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist.</p>
          <Link 
            to="/articles" 
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16">
        <style jsx>{`
          .article-html-content {
            line-height: 1.7;
          }
          .article-html-content h1,
          .article-html-content h2,
          .article-html-content h3 {
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .article-html-content p {
            margin-bottom: 1.5rem;
          }
          .article-html-content ul,
          .article-html-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
          }
          .article-html-content li {
            margin-bottom: 0.5rem;
          }
          .article-html-content blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
          }
          .article-html-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          .article-html-content th,
          .article-html-content td {
            border: 1px solid #ddd;
            padding: 0.75rem;
            text-align: left;
          }
          .article-html-content th {
            background-color: #f8f9fa;
            font-weight: 600;
          }
          .infographic-content {
            max-width: 100%;
            overflow-x: auto;
          }
          .infographic-content img {
            max-width: 100%;
            height: auto;
          }
          .infographic-content svg {
            max-width: 100%;
            height: auto;
          }
        `}</style>

        {/* Header Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link 
              to="/articles" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Medical Content
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {article.title}
                  </h1>
                  
                  {/* Article Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {article.subspecialty?.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.read_time || 5} min read
                    </span>
                    <span className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {Math.round((article.evidence_strength || 0) * 100)}% evidence strength
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {article.content_type?.toUpperCase()} content
                    </span>
                  </div>

                  {/* Meta Description */}
                  {article.meta_description && (
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {article.meta_description}
                    </p>
                  )}
                </div>

                {/* Emotional Signature */}
                {article.signature_data && (
                  <div className="ml-8">
                    <EmotionalSignature 
                      signatureData={article.signature_data}
                      emotionalData={article.emotional_data}
                      size={120}
                    />
                  </div>
                )}
              </div>

              {/* Emotional Analysis Bar */}
              {article.emotional_data && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Emotional Analysis</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {emotionOptions.map(emotion => {
                      const value = article.emotional_data[emotion.key] || 0;
                      const isDominant = article.emotional_data.dominant_emotion === emotion.key;
                      
                      return (
                        <div key={emotion.key} className="text-center">
                          <div className="relative mb-2">
                            <div className="w-12 h-12 mx-auto rounded-full border-2 flex items-center justify-center text-lg"
                                 style={{ 
                                   borderColor: emotion.color,
                                   backgroundColor: isDominant ? emotion.color + '20' : 'transparent'
                                 }}>
                              {emotion.icon}
                            </div>
                            {isDominant && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 text-yellow-800" />
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-medium text-gray-700">{emotion.label}</div>
                          <div className="text-xs text-gray-500">{Math.round(value * 100)}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Article Content */}
            <div className="px-8 py-8">
              {renderContent()}
            </div>

            {/* Feedback Section - Access Controlled */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Emotional Feedback
                </h3>
                <p className="text-gray-600 text-sm">
                  Help the algorithm learn by sharing how this medical content makes you feel.
                </p>
              </div>

              {/* Signed In - Show Feedback Form */}
              <SignedIn>
                <FeedbackForm 
                  articleId={article.id}
                  onFeedbackSubmitted={handleFeedbackSubmitted}
                />
              </SignedIn>

              {/* Signed Out - Show Access Gate */}
              <SignedOut>
                <AccessGate 
                  onSignUp={handleSignUp}
                  onSignIn={handleSignIn}
                />
              </SignedOut>

              {/* Article Actions */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {/* View Artwork Button */}
                  {artwork && (
                    <Link
                      to={`/gallery/${artwork.id}`}
                      className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      View Generated Artwork
                    </Link>
                  )}
                </div>

                {/* User Status Indicator */}
                <SignedIn>
                  <div className="text-sm text-gray-500">
                    ✓ Signed in as {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </div>
                </SignedIn>
              </div>

              {/* Signature Information */}
              {article.signature_data && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Emotional Signature ID:</span> {article.signature_data.id} | 
                    <span className="font-medium"> Rarity Score:</span> {Math.round(article.signature_data.rarity_score * 100)}%
                    {article.published_date && (
                      <>
                       | <span className="font-medium">Published:</span> {new Date(article.published_date).toLocaleDateString()}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
};

// Sample data functions
const getSampleArticle = (id) => ({
  id,
  title: "Advanced Arthroscopic Techniques in Sports Medicine",
  content_type: "text",
  content: `Sports medicine has evolved significantly with the advancement of arthroscopic techniques. These minimally invasive procedures have revolutionized how we approach joint injuries and disorders.

The development of high-definition cameras and specialized instruments has enabled surgeons to perform complex procedures with unprecedented precision. This technological advancement has led to better patient outcomes, reduced recovery times, and improved long-term joint function.

Recent studies show that arthroscopic procedures result in 85% patient satisfaction rates, with most patients returning to their pre-injury activity levels within 3-6 months. The emotional impact of these successful outcomes cannot be understated - patients experience renewed hope and confidence in their recovery journey.`,
  subspecialty: "sportsMedicine",
  published_date: new Date().toISOString(),
  read_time: 8,
  evidence_strength: 0.85,
  meta_description: "Exploring the latest advances in arthroscopic techniques and their impact on sports medicine outcomes.",
  emotional_data: {
    dominant_emotion: "confidence",
    hope: 0.75,
    confidence: 0.85,
    healing: 0.70,
    breakthrough: 0.60,
    tension: 0.20,
    uncertainty: 0.15
  },
  signature_data: {
    id: "AKX-2024-DEMO-001",
    rarity_score: 0.78,
    concentric_rings: { count: 4, thickness: 2, rotation_speed: 1.2 },
    geometric_overlays: { shape: "circle", color: "#3498db", scale: 1.1 },
    floating_particles: { count: 10, color: "#3498db" }
  },
  // Sample infographic data
  infographics: [
    {
      title: "Arthroscopic Procedure Steps",
      html_content: `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 1rem; color: white; text-align: center;">
          <h3 style="margin-bottom: 1.5rem; font-size: 1.5rem;">Arthroscopic Surgery Process</h3>
          <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem;">
            <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; flex: 1; min-width: 150px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
              <h4>Insertion</h4>
              <p style="font-size: 0.9rem;">Arthroscope inserted through small incision</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; flex: 1; min-width: 150px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">👁️</div>
              <h4>Visualization</h4>
              <p style="font-size: 0.9rem;">High-definition camera provides clear view</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; flex: 1; min-width: 150px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔧</div>
              <h4>Treatment</h4>
              <p style="font-size: 0.9rem;">Specialized instruments perform repair</p>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; flex: 1; min-width: 150px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">💚</div>
              <h4>Recovery</h4>
              <p style="font-size: 0.9rem;">Faster healing with minimal scarring</p>
            </div>
          </div>
        </div>
      `
    }
  ]
});

const getSampleArtwork = (articleId) => ({
  id: `artwork-${articleId}`,
  article_id: articleId,
  title: "Algorithmic Synthesis #AKX-2024-DEMO-001",
  dominant_emotion: "confidence",
  created_date: new Date().toISOString()
});

export default ArticlePage;