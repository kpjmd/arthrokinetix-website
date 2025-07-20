import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ClerkProvider from './components/ClerkProvider';
import Web3Provider from './components/Web3Provider';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import ArticlesHub from './pages/ArticlesHub';
import EnhancedResearchHub from './pages/EnhancedResearchHub';
import ArticlePage from './pages/ArticlePage';
import Gallery from './pages/Gallery';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import ArtworkDetail from './pages/ArtworkDetail';
import UserProfile from './pages/UserProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AlgorithmMoodIndicator from './components/AlgorithmMoodIndicator';

// API Base URL
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component to handle slug redirects
function RedirectWithSlug() {
  const { slug } = useParams();
  return <Navigate to={`/articles/${slug}`} replace />;
}

function AppContent() {
  const [algorithmState, setAlgorithmState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add navigation event logging
  useEffect(() => {
    console.log('🔍 [App] AppContent mounted');
    
    // Log navigation events
    const handlePopState = (event) => {
      console.log('🔍 [App] PopState event:', { 
        state: event.state, 
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    };

    const handleBeforeUnload = (event) => {
      console.log('🔍 [App] Before unload event:', { 
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Override history methods to log navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      console.log('🔍 [App] History pushState called:', args);
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      console.log('🔍 [App] History replaceState called:', args);
      return originalReplaceState.apply(this, args);
    };

    return () => {
      console.log('🔍 [App] AppContent unmounting');
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

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
          
          {/* New Medical Content Routes */}
          <Route 
            path="/articles" 
            element={
              <ArticlesHub 
                algorithmState={algorithmState}
              />
            } 
          />
          <Route 
            path="/articles/:id" 
            element={
              <ArticlePage 
                algorithmState={algorithmState}
                onStateUpdate={setAlgorithmState}
              />
            } 
          />

          {/* Legacy Research Routes - Redirect to Articles */}
          <Route path="/research" element={<Navigate to="/articles" replace />} />
          <Route 
            path="/research/:slug" 
            element={<RedirectWithSlug />} 
          />
          <Route 
            path="/research-enhanced" 
            element={
              <EnhancedResearchHub 
                algorithmState={algorithmState}
              />
            } 
          />
          
          {/* Other Routes */}
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
            path="/privacy" 
            element={<PrivacyPolicy />} 
          />
          <Route 
            path="/terms" 
            element={<TermsOfService />} 
          />
          <Route 
            path="/admin" 
            element={<AdminDashboard />} 
          />
        </Routes>
      </AnimatePresence>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider>
          <Web3Provider>
            <Router>
              <AppContent />
            </Router>
          </Web3Provider>
        </ClerkProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
