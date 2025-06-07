import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Calendar, Users, Zap, Brain } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AlgorithmEvolution = () => {
  const [evolutionData, setEvolutionData] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  const timeRanges = [
    { key: '24h', label: 'Last 24 Hours' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: 'all', label: 'All Time' }
  ];

  useEffect(() => {
    fetchEvolutionData();
  }, [timeRange]);

  const fetchEvolutionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/algorithm/evolution?range=${timeRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setEvolutionData(data);
      } else {
        // Generate sample data for demo
        setEvolutionData(generateSampleEvolution());
      }
    } catch (error) {
      console.error('Error fetching evolution data:', error);
      setEvolutionData(generateSampleEvolution());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!evolutionData) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg text-center">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Algorithm Evolution
        </h3>
        <p className="text-gray-500">
          Evolution data will appear as the algorithm processes more articles and receives feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Algorithm Evolution</h2>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
          >
            {timeRanges.map(range => (
              <option key={range.key} value={range.key}>{range.label}</option>
            ))}
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-secondary mr-2" />
              <span className="text-2xl font-bold text-secondary">
                {evolutionData.total_state_changes}
              </span>
            </div>
            <div className="text-gray-600">State Changes</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-innovation mr-2" />
              <span className="text-2xl font-bold text-innovation">
                {evolutionData.feedback_influences}
              </span>
            </div>
            <div className="text-gray-600">Feedback Influences</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-accent mr-2" />
              <span className="text-2xl font-bold text-accent">
                {Math.round(evolutionData.emotional_volatility * 100)}%
              </span>
            </div>
            <div className="text-gray-600">Emotional Volatility</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-healing mr-2" />
              <span className="text-2xl font-bold text-healing">
                {evolutionData.growth_rate}x
              </span>
            </div>
            <div className="text-gray-600">Learning Rate</div>
          </div>
        </div>
      </div>

      {/* Emotional Evolution Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-primary mb-6">Emotional Journey Timeline</h3>
        
        <div className="space-y-4">
          {evolutionData.timeline.map((event, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: getEmotionColor(event.dominant_emotion) }}
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary capitalize">
                    {event.dominant_emotion} Phase
                  </h4>
                  <span className="text-sm text-gray-500">
                    {formatDate(event.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Intensity: {Math.round(event.intensity * 100)}%</span>
                  <span>Articles: {event.articles_processed}</span>
                  <span>Feedback: {event.feedback_count}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: getEmotionColor(event.dominant_emotion) }}>
                  {Math.round(event.intensity * 100)}%
                </div>
                <div className="text-xs text-gray-500">intensity</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emotional Distribution Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-primary mb-6">Current Emotional Distribution</h3>
        
        <div className="space-y-4">
          {Object.entries(evolutionData.current_distribution).map(([emotion, value]) => (
            <div key={emotion} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize text-gray-700">{emotion}</span>
                <span className="text-sm font-bold" style={{ color: getEmotionColor(emotion) }}>
                  {Math.round(value * 100)}%
                </span>
              </div>
              
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getEmotionColor(emotion) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Influence Sources */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-primary mb-6">Influence Sources</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Article Influences</h4>
            <div className="space-y-3">
              {evolutionData.article_influences.map((influence, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{influence.subspecialty}</div>
                    <div className="text-xs text-gray-500">{influence.article_count} articles</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: getEmotionColor(influence.dominant_emotion) }}>
                      {Math.round(influence.influence_weight * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">influence</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-4">Feedback Influences</h4>
            <div className="space-y-3">
              {evolutionData.feedback_influences.map((influence, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm capitalize">{influence.emotion}</div>
                    <div className="text-xs text-gray-500">{influence.feedback_count} feedback</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: getEmotionColor(influence.emotion) }}>
                      {Math.round(influence.total_weight * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">total weight</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction & Insights */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Algorithm Insights</h3>
        
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-medium mb-2">Predicted Next State</h4>
            <p className="text-blue-100">
              Based on current trends, the algorithm is likely to shift towards{' '}
              <span className="font-bold">{evolutionData.predicted_emotion}</span> with{' '}
              <span className="font-bold">{Math.round(evolutionData.prediction_confidence * 100)}% confidence</span>.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-medium mb-2">Learning Pattern</h4>
            <p className="text-blue-100">
              The algorithm shows {evolutionData.learning_pattern} learning behavior, 
              responding {evolutionData.responsiveness} to new inputs.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="font-medium mb-2">Community Impact</h4>
            <p className="text-blue-100">
              User feedback has contributed {Math.round(evolutionData.feedback_impact * 100)}% 
              to the algorithm's recent emotional development.
            </p>
          </div>
        </div>
      </div>
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const generateSampleEvolution = () => ({
  total_state_changes: 12,
  feedback_influences: 8,
  emotional_volatility: 0.34,
  growth_rate: 1.7,
  timeline: [
    {
      timestamp: '2024-03-07T10:30:00Z',
      dominant_emotion: 'breakthrough',
      intensity: 0.85,
      articles_processed: 3,
      feedback_count: 2,
      description: 'Algorithm discovered new patterns in regenerative medicine research'
    },
    {
      timestamp: '2024-03-06T15:45:00Z',
      dominant_emotion: 'confidence',
      intensity: 0.72,
      articles_processed: 5,
      feedback_count: 1,
      description: 'Processed high-evidence articles in sports medicine'
    },
    {
      timestamp: '2024-03-05T09:15:00Z',
      dominant_emotion: 'healing',
      intensity: 0.68,
      articles_processed: 2,
      feedback_count: 3,
      description: 'Community feedback emphasized therapeutic potential'
    }
  ],
  current_distribution: {
    hope: 0.45,
    confidence: 0.72,
    healing: 0.68,
    breakthrough: 0.35,
    tension: 0.15,
    uncertainty: 0.22
  },
  article_influences: [
    {
      subspecialty: 'Sports Medicine',
      article_count: 5,
      dominant_emotion: 'confidence',
      influence_weight: 0.65
    },
    {
      subspecialty: 'Joint Replacement',
      article_count: 3,
      dominant_emotion: 'healing',
      influence_weight: 0.45
    }
  ],
  feedback_influences: [
    {
      emotion: 'healing',
      feedback_count: 4,
      total_weight: 0.8
    },
    {
      emotion: 'hope',
      feedback_count: 2,
      total_weight: 0.4
    }
  ],
  predicted_emotion: 'healing',
  prediction_confidence: 0.78,
  learning_pattern: 'adaptive',
  responsiveness: 'moderately',
  feedback_impact: 0.42
});

export default AlgorithmEvolution;