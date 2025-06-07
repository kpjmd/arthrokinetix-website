import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Archive, Award, Download, Search, Filter } from 'lucide-react';
import EmotionalSignature from './EmotionalSignature';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const SignatureCollection = ({ userEmail, isSubscriber }) => {
  const [collectedSignatures, setCollectedSignatures] = useState([]);
  const [availableSignatures, setAvailableSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterEmotion, setFilterEmotion] = useState('all');

  const rarityLevels = [
    { key: 'all', label: 'All Rarities' },
    { key: 'common', label: 'Common (0-30%)', min: 0, max: 0.3 },
    { key: 'uncommon', label: 'Uncommon (30-60%)', min: 0.3, max: 0.6 },
    { key: 'rare', label: 'Rare (60-80%)', min: 0.6, max: 0.8 },
    { key: 'legendary', label: 'Legendary (80%+)', min: 0.8, max: 1 }
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

  useEffect(() => {
    if (isSubscriber) {
      fetchSignatures();
    }
  }, [isSubscriber, userEmail]);

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      
      // Fetch user's collected signatures
      const collectedResponse = await fetch(`${API_BASE}/api/signatures/collection/${userEmail}`);
      if (collectedResponse.ok) {
        const collectedData = await collectedResponse.json();
        setCollectedSignatures(collectedData.signatures || []);
      }

      // Fetch available signatures for collection
      const availableResponse = await fetch(`${API_BASE}/api/signatures/available`);
      if (availableResponse.ok) {
        const availableData = await availableResponse.json();
        setAvailableSignatures(availableData.signatures || []);
      }
    } catch (error) {
      console.error('Error fetching signatures:', error);
      // Set sample data for demo
      setCollectedSignatures(generateSampleCollection());
      setAvailableSignatures(generateSampleAvailable());
    } finally {
      setLoading(false);
    }
  };

  const collectSignature = async (signatureId) => {
    try {
      const response = await fetch(`${API_BASE}/api/signatures/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature_id: signatureId,
          user_email: userEmail
        })
      });

      if (response.ok) {
        // Refresh collections
        fetchSignatures();
      }
    } catch (error) {
      console.error('Error collecting signature:', error);
    }
  };

  const filteredAvailable = availableSignatures.filter(signature => {
    const matchesSearch = signature.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signature.source_data?.subspecialty?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRarity = true;
    if (filterRarity !== 'all') {
      const rarityLevel = rarityLevels.find(r => r.key === filterRarity);
      matchesRarity = signature.rarity_score >= rarityLevel.min && signature.rarity_score < rarityLevel.max;
    }

    const matchesEmotion = filterEmotion === 'all' || signature.source_data?.dominant_emotion === filterEmotion;

    return matchesSearch && matchesRarity && matchesEmotion;
  });

  if (!isSubscriber) {
    return (
      <div className="text-center py-12">
        <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Signature Collection
        </h3>
        <p className="text-gray-500 mb-6">
          Subscribe to the newsletter to unlock the ability to collect and trade emotional signatures.
        </p>
        <button className="btn-primary">
          Subscribe to Newsletter
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Collection Stats */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-primary mb-6">Your Signature Collection</h2>
        
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {collectedSignatures.length}
            </div>
            <div className="text-gray-600">Total Collected</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-innovation mb-2">
              {collectedSignatures.filter(s => s.rarity_score > 0.8).length}
            </div>
            <div className="text-gray-600">Legendary</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {collectedSignatures.filter(s => s.rarity_score > 0.6 && s.rarity_score <= 0.8).length}
            </div>
            <div className="text-gray-600">Rare</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-healing mb-2">
              {Math.round(collectedSignatures.reduce((sum, s) => sum + s.rarity_score, 0) / Math.max(collectedSignatures.length, 1) * 100)}%
            </div>
            <div className="text-gray-600">Avg Rarity</div>
          </div>
        </div>

        {/* Collected Signatures Display */}
        {collectedSignatures.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectedSignatures.map((signature, index) => (
              <motion.div
                key={signature.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-4 text-center"
              >
                <div className="mb-4">
                  <EmotionalSignature 
                    signatureData={signature}
                    emotionalData={signature.source_data}
                    size={80}
                  />
                </div>
                
                <h4 className="font-medium text-primary mb-2">{signature.id}</h4>
                <p className="text-sm text-gray-600 mb-2 capitalize">
                  {signature.source_data?.dominant_emotion} • {signature.source_data?.subspecialty}
                </p>
                <p className="text-xs text-gray-500">
                  Rarity: {Math.round(signature.rarity_score * 100)}%
                </p>
                
                <div className="mt-3">
                  <button className="btn-secondary text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Archive className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No signatures collected yet. Explore articles to find collectible signatures!</p>
          </div>
        )}
      </div>

      {/* Available Signatures */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-primary mb-6">Available for Collection</h3>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search signatures..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            {rarityLevels.map(level => (
              <option key={level.key} value={level.key}>{level.label}</option>
            ))}
          </select>
          
          <select
            value={filterEmotion}
            onChange={(e) => setFilterEmotion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            {emotions.map(emotion => (
              <option key={emotion.key} value={emotion.key}>{emotion.label}</option>
            ))}
          </select>
        </div>

        {/* Available Signatures Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="loading-skeleton h-48 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailable.map((signature, index) => {
              const isCollected = collectedSignatures.some(c => c.id === signature.id);
              
              return (
                <motion.div
                  key={signature.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`border-2 rounded-lg p-4 text-center transition-all duration-200 ${
                    isCollected 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 hover:border-secondary hover:shadow-md'
                  }`}
                >
                  <div className="mb-4">
                    <EmotionalSignature 
                      signatureData={signature}
                      emotionalData={signature.source_data}
                      size={70}
                    />
                  </div>
                  
                  <h4 className="font-medium text-primary mb-2">{signature.id}</h4>
                  <p className="text-sm text-gray-600 mb-2 capitalize">
                    {signature.source_data?.dominant_emotion} • {signature.source_data?.subspecialty}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Rarity: {Math.round(signature.rarity_score * 100)}%
                  </p>
                  
                  {signature.rarity_score > 0.8 && (
                    <div className="flex items-center justify-center mb-3">
                      <Star className="w-4 h-4 text-innovation mr-1" />
                      <span className="text-xs font-medium text-innovation">Legendary</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => collectSignature(signature.id)}
                    disabled={isCollected}
                    className={`btn-primary text-sm w-full ${
                      isCollected ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isCollected ? 'Collected' : 'Collect'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredAvailable.length === 0 && (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No signatures match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample data generators
const generateSampleCollection = () => [
  {
    id: 'AKX-2024-0301-A1B2',
    rarity_score: 0.75,
    source_data: {
      dominant_emotion: 'confidence',
      subspecialty: 'sportsMedicine'
    },
    concentric_rings: { count: 4, thickness: 2, rotation_speed: 1.2 },
    geometric_overlays: { shape: 'circle', color: '#3498db', scale: 1.1 },
    floating_particles: { count: 10, color: '#3498db' }
  },
  {
    id: 'AKX-2024-0302-C3D4',
    rarity_score: 0.92,
    source_data: {
      dominant_emotion: 'breakthrough',
      subspecialty: 'sportsMedicine'
    },
    concentric_rings: { count: 5, thickness: 3, rotation_speed: 1.8 },
    geometric_overlays: { shape: 'star', color: '#f39c12', scale: 1.3 },
    floating_particles: { count: 15, color: '#f39c12' }
  }
];

const generateSampleAvailable = () => [
  {
    id: 'AKX-2024-0305-E7F8',
    rarity_score: 0.68,
    source_data: {
      dominant_emotion: 'healing',
      subspecialty: 'trauma'
    },
    concentric_rings: { count: 3, thickness: 2, rotation_speed: 1.0 },
    geometric_overlays: { shape: 'hexagon', color: '#16a085', scale: 1.0 },
    floating_particles: { count: 8, color: '#16a085' }
  },
  {
    id: 'AKX-2024-0306-I9J0',
    rarity_score: 0.45,
    source_data: {
      dominant_emotion: 'hope',
      subspecialty: 'jointReplacement'
    },
    concentric_rings: { count: 2, thickness: 1.5, rotation_speed: 0.8 },
    geometric_overlays: { shape: 'circle', color: '#27ae60', scale: 0.9 },
    floating_particles: { count: 6, color: '#27ae60' }
  }
];

export default SignatureCollection;