import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Eye, Palette, Award, Calendar, Tag, X, Zap } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import NFTMintButton, { NFTInfoPanel } from '../components/NFTMintButton';
import RealArthrokinetixArtwork from '../components/RealArthrokinetixArtwork';

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
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-6 p-4">
                <RealArthrokinetixArtwork 
                  artwork={artwork} 
                  width={400} 
                  height={400}
                />
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
                      style={{ backgroundColor: getEmotionColorLocal(artwork.dominant_emotion) }}
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
            </motion.div>
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
            <RealArthrokinetixArtwork 
            artwork={artwork} 
            width={600} 
            height={600}
          />
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
