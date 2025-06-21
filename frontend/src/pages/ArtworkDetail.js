import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Eye, Palette, Award, Calendar, Tag, X, Zap } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import NFTMintButton, { NFTInfoPanel } from '../components/NFTMintButton';

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

  const generateArtworkSVG = (artwork) => {
    if (!artwork) return null;

    const { dominant_emotion, algorithm_parameters, subspecialty } = artwork;
    const complexity = algorithm_parameters?.tree_complexity || 0.7;
    const emotionalIntensity = algorithm_parameters?.emotional_intensity || 0.8;
    const colorPalette = algorithm_parameters?.color_palette || [{ color: getEmotionColor(artwork.dominant_emotion || 'confidence') }];

    return (
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        style={{ background: getArtworkBackground(dominant_emotion) }}
      >
        {/* Andry Tree Base Structure */}
        <g transform="translate(200, 380)">
          {/* Tree trunk */}
          <rect 
            x="-6" 
            y="-120" 
            width="12" 
            height="120" 
            fill="#8b4513" 
            opacity="0.9"
          />
          
          {/* Main branches based on emotional data */}
          {generateBranches(artwork).map((branch, i) => (
            <g key={i}>
              <motion.line 
                x1="0" 
                y1={branch.startY}
                x2={branch.endX} 
                y2={branch.endY}
                stroke="#8b4513" 
                strokeWidth={branch.thickness}
                opacity="0.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.2 }}
              />
              
              {/* Secondary branches */}
              <motion.line 
                x1={branch.endX} 
                y1={branch.endY}
                x2={branch.endX + branch.secondaryX} 
                y2={branch.endY + branch.secondaryY}
                stroke="#8b4513" 
                strokeWidth={Math.max(1, branch.thickness - 1)}
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2 + 0.5 }}
              />
            </g>
          ))}
          
          {/* Emotional particles */}
          {generateEmotionalParticles(artwork).map((particle, i) => (
            <motion.circle
              key={i}
              cx={particle.x}
              cy={particle.y}
              r={particle.radius}
              fill={particle.color}
              opacity={particle.opacity}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
          
          {/* Healing aura rings */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.circle
              key={`aura-${i}`}
              cx="0"
              cy="-60"
              r={40 + (i * 15)}
              fill="none"
              stroke={colorPalette[0]?.color || getEmotionColor(dominant_emotion)}
              strokeWidth="1"
              opacity={0.3 - (i * 0.1)}
              animate={{
                r: [40 + (i * 15), 45 + (i * 15), 40 + (i * 15)],
                opacity: [0.3 - (i * 0.1), 0.5 - (i * 0.1), 0.3 - (i * 0.1)]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}

          {/* Subspecialty-specific elements */}
          {subspecialty === 'sportsMedicine' && (
            <motion.path
              d="M -30,-80 Q 0,-100 30,-80"
              stroke={colorPalette[0]?.color || getEmotionColor(dominant_emotion)}
              strokeWidth="2"
              fill="none"
              opacity="0.6"
              animate={{
                d: ["M -30,-80 Q 0,-100 30,-80", "M -30,-80 Q 0,-90 30,-80", "M -30,-80 Q 0,-100 30,-80"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </g>

        {/* Signature overlay */}
        <g transform="translate(350, 50)">
          <circle
            cx="0"
            cy="0"
            r="25"
            fill={colorPalette[0]?.color || getEmotionColor(dominant_emotion)}
            opacity="0.2"
          />
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fontSize="20"
            fill={colorPalette[0]?.color || getEmotionColor(dominant_emotion)}
            fontWeight="bold"
          >
            {getEmotionSymbol(dominant_emotion)}
          </text>
        </g>
      </svg>
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
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-6">
                {generateArtworkSVG(artwork)}
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
                      style={{ backgroundColor: getEmotionColor(artwork.dominant_emotion) }}
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
            {generateArtworkSVG(artwork)}
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

const generateBranches = (artwork) => {
  const complexity = (artwork.algorithm_parameters?.tree_complexity || 0.5) * 6 + 3;
  const branches = [];
  
  for (let i = 0; i < Math.floor(complexity); i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const angle = (25 + Math.random() * 40) * side;
    const length = 40 + Math.random() * 30;
    
    branches.push({
      startY: -20 - (i * 18),
      endX: Math.sin(angle * Math.PI / 180) * length,
      endY: -20 - (i * 18) - Math.cos(angle * Math.PI / 180) * length,
      thickness: 4 - (i * 0.4),
      secondaryX: Math.sin((angle + 25) * Math.PI / 180) * (length * 0.7),
      secondaryY: -Math.cos((angle + 25) * Math.PI / 180) * (length * 0.7)
    });
  }
  
  return branches;
};

const generateEmotionalParticles = (artwork) => {
  const intensity = artwork.algorithm_parameters?.emotional_intensity || 0.5;
  const count = Math.floor(intensity * 20) + 8;
  const particles = [];
  const color = getEmotionColor(artwork.dominant_emotion || 'confidence');
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 360;
    const radius = 50 + Math.random() * 40;
    
    particles.push({
      x: Math.cos(angle * Math.PI / 180) * radius,
      y: Math.sin(angle * Math.PI / 180) * radius - 60,
      radius: 2 + Math.random() * 4,
      color: color,
      opacity: 0.4 + Math.random() * 0.4
    });
  }
  
  return particles;
};

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

export default ArtworkDetail;