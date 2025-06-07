import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, TrendingUp, Clock, Award, Tag } from 'lucide-react';
import EmotionalSignature from './EmotionalSignature';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const EnhancedSearch = ({ onResults, placeholder = "Search articles, emotions, or signatures..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ articles: [], signatures: [], artworks: [] });
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'all',
    emotion: 'all',
    subspecialty: 'all',
    rarity: 'all',
    timeRange: 'all'
  });
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const searchTypes = [
    { key: 'all', label: 'All Content' },
    { key: 'articles', label: 'Articles Only' },
    { key: 'signatures', label: 'Signatures Only' },
    { key: 'artworks', label: 'Artworks Only' }
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

  const subspecialties = [
    { key: 'all', label: 'All Subspecialties' },
    { key: 'sportsMedicine', label: 'Sports Medicine' },
    { key: 'jointReplacement', label: 'Joint Replacement' },
    { key: 'trauma', label: 'Trauma' },
    { key: 'spine', label: 'Spine' },
    { key: 'handUpperExtremity', label: 'Hand & Upper Extremity' },
    { key: 'footAnkle', label: 'Foot & Ankle' }
  ];

  const rarityLevels = [
    { key: 'all', label: 'All Rarities' },
    { key: 'common', label: 'Common (0-30%)' },
    { key: 'uncommon', label: 'Uncommon (30-60%)' },
    { key: 'rare', label: 'Rare (60-80%)' },
    { key: 'legendary', label: 'Legendary (80%+)' }
  ];

  const timeRanges = [
    { key: 'all', label: 'All Time' },
    { key: '24h', label: 'Last 24 Hours' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' }
  ];

  useEffect(() => {
    // Load search suggestions
    loadSuggestions();
    
    // Click outside handler
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Debounced search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (searchTerm.length > 2) {
        performSearch();
      } else {
        setResults({ articles: [], signatures: [], artworks: [] });
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, selectedFilters]);

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/search/suggestions`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions(generateSampleSuggestions());
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        q: searchTerm,
        type: selectedFilters.type,
        emotion: selectedFilters.emotion,
        subspecialty: selectedFilters.subspecialty,
        rarity: selectedFilters.rarity,
        timeRange: selectedFilters.timeRange
      });

      const response = await fetch(`${API_BASE}/api/search?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        if (onResults) {
          onResults(data);
        }
      } else {
        // Generate sample results for demo
        const sampleResults = generateSampleResults(searchTerm);
        setResults(sampleResults);
        if (onResults) {
          onResults(sampleResults);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      const sampleResults = generateSampleResults(searchTerm);
      setResults(sampleResults);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      type: 'all',
      emotion: 'all',
      subspecialty: 'all',
      rarity: 'all',
      timeRange: 'all'
    });
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setIsOpen(false);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(value => value !== 'all');
  const totalResults = results.articles.length + results.signatures.length + results.artworks.length;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-secondary focus:outline-none transition-colors bg-white shadow-sm"
        />
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden"
          >
            {/* Filters */}
            <div className="p-4 border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <select
                  value={selectedFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  {searchTypes.map(type => (
                    <option key={type.key} value={type.key}>{type.label}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.emotion}
                  onChange={(e) => handleFilterChange('emotion', e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  {emotions.map(emotion => (
                    <option key={emotion.key} value={emotion.key}>{emotion.label}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.subspecialty}
                  onChange={(e) => handleFilterChange('subspecialty', e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  {subspecialties.map(sub => (
                    <option key={sub.key} value={sub.key}>{sub.label}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.rarity}
                  onChange={(e) => handleFilterChange('rarity', e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  {rarityLevels.map(rarity => (
                    <option key={rarity.key} value={rarity.key}>{rarity.label}</option>
                  ))}
                </select>

                <select
                  value={selectedFilters.timeRange}
                  onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-transparent"
                >
                  {timeRanges.map(range => (
                    <option key={range.key} value={range.key}>{range.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Results or Suggestions */}
            <div className="max-h-80 overflow-y-auto">
              {searchTerm.length <= 2 ? (
                // Show suggestions
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Searches</h4>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion.term)}
                        className="flex items-center w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm">{suggestion.term}</span>
                        <span className="text-xs text-gray-500 ml-auto">{suggestion.count} results</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                // Loading state
                <div className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-2">Searching...</p>
                </div>
              ) : (
                // Search results
                <div className="p-4">
                  {totalResults > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">
                          {totalResults} results found
                        </h4>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-xs text-secondary hover:text-secondary/80"
                        >
                          View all results
                        </button>
                      </div>

                      {/* Articles */}
                      {results.articles.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-2">Articles</h5>
                          <div className="space-y-2">
                            {results.articles.slice(0, 3).map((article) => (
                              <div key={article.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <div className="w-8 h-8 mr-3 flex-shrink-0">
                                  {article.signature_data && (
                                    <EmotionalSignature
                                      signatureData={article.signature_data}
                                      emotionalData={article.emotional_data}
                                      size={32}
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {article.title}
                                  </p>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {article.emotional_data?.dominant_emotion} • {article.subspecialty}
                                  </p>
                                </div>
                                <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Signatures */}
                      {results.signatures.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-2">Emotional Signatures</h5>
                          <div className="space-y-2">
                            {results.signatures.slice(0, 3).map((signature) => (
                              <div key={signature.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <div className="w-8 h-8 mr-3 flex-shrink-0">
                                  <EmotionalSignature
                                    signatureData={signature}
                                    emotionalData={signature.source_data}
                                    size={32}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900">
                                    {signature.id}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Rarity: {Math.round(signature.rarity_score * 100)}%
                                  </p>
                                </div>
                                <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Artworks */}
                      {results.artworks.length > 0 && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-600 mb-2">Artworks</h5>
                          <div className="space-y-2">
                            {results.artworks.slice(0, 3).map((artwork) => (
                              <div key={artwork.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded mr-3 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {artwork.title}
                                  </p>
                                  <p className="text-xs text-gray-500 capitalize">
                                    {artwork.dominant_emotion} • {artwork.subspecialty}
                                  </p>
                                </div>
                                <Award className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No results found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms or filters</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sample data generators
const generateSampleSuggestions = () => [
  { term: 'ACL reconstruction', count: 12 },
  { term: 'healing breakthrough', count: 8 },
  { term: 'confidence sports medicine', count: 15 },
  { term: 'rare signatures', count: 6 },
  { term: 'joint replacement hope', count: 9 }
];

const generateSampleResults = (searchTerm) => ({
  articles: [
    {
      id: '1',
      title: `ACL Reconstruction and ${searchTerm}`,
      subspecialty: 'sportsMedicine',
      emotional_data: { dominant_emotion: 'confidence' },
      signature_data: {
        id: 'AKX-2024-0301-A1B2',
        concentric_rings: { count: 3, thickness: 2, rotation_speed: 1 },
        geometric_overlays: { shape: 'circle', color: '#3498db', scale: 1 },
        floating_particles: { count: 8, color: '#3498db' }
      }
    }
  ],
  signatures: [
    {
      id: 'AKX-2024-0302-C3D4',
      rarity_score: 0.85,
      source_data: { dominant_emotion: 'breakthrough' },
      concentric_rings: { count: 4, thickness: 3, rotation_speed: 1.5 },
      geometric_overlays: { shape: 'star', color: '#f39c12', scale: 1.2 },
      floating_particles: { count: 12, color: '#f39c12' }
    }
  ],
  artworks: [
    {
      id: '1',
      title: `Algorithmic Art: ${searchTerm}`,
      subspecialty: 'sportsMedicine',
      dominant_emotion: 'healing'
    }
  ]
});

export default EnhancedSearch;