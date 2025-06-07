import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Import the Arthrokinetix algorithm
import ArthrokinetixArtGenerator from './arthrokinetixalgorithm.js';

// Components
import Header from './components/Header';
import Homepage from './pages/Homepage';
import ResearchHub from './pages/ResearchHub';
import EnhancedResearchHub from './pages/EnhancedResearchHub';
import ArticlePage from './pages/ArticlePage';
import Gallery from './pages/Gallery';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import ArtworkDetail from './pages/ArtworkDetail';
import UserProfile from './pages/UserProfile';
import AlgorithmMoodIndicator from './components/AlgorithmMoodIndicator';

// API Base URL
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [algorithmState, setAlgorithmState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch algorithm state on mount
  useEffect(() => {
    fetchAlgorithmState();
  }, []);

  const fetchAlgorithmState = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/algorithm-state`);
      const data = await response.json();
      setAlgorithmState(data);
    } catch (error) {
      console.error('Error fetching algorithm state:', error);
      // Set default state
      setAlgorithmState({
        emotional_state: {
          dominant_emotion: 'confidence',
          emotional_intensity: 0.6,
          emotional_mix: {
            hope: 0.4,
            confidence: 0.6,
            healing: 0.3,
            innovation: 0.2
          }
        },
        visual_representation: {
          shape: 'circle',
          color: '#3498db',
          glow_intensity: 0.6,
          pulse_rate: 1.2
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-secondary flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header />
        
        {/* Persistent Algorithm Mood Indicator */}
        <AlgorithmMoodIndicator 
          algorithmState={algorithmState}
          onStateUpdate={setAlgorithmState}
        />

        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <Homepage 
                  algorithmState={algorithmState}
                  onStateUpdate={setAlgorithmState}
                />
              } 
            />
            <Route 
              path="/research" 
              element={
                <ResearchHub 
                  algorithmState={algorithmState}
                />
              } 
            />
            <Route 
              path="/research-enhanced" 
              element={
                <EnhancedResearchHub 
                  algorithmState={algorithmState}
                />
              } 
            />
            <Route 
              path="/research/:slug" 
              element={
                <ArticlePage 
                  algorithmState={algorithmState}
                  onStateUpdate={setAlgorithmState}
                />
              } 
            />
            <Route 
              path="/profile" 
              element={<UserProfile />} 
            />
            <Route 
              path="/gallery" 
              element={
                <Gallery 
                  algorithmState={algorithmState}
                />
              } 
            />
            <Route 
              path="/gallery/:id" 
              element={<ArtworkDetail />} 
            />
            <Route 
              path="/about" 
              element={<About />} 
            />
            <Route 
              path="/admin" 
              element={<AdminDashboard />} 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;