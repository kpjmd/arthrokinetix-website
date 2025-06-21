import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import EnhancedWeb3Integration from './EnhancedWeb3Integration';
import { AuthModal, EnhancedUserButton, SignedIn, SignedOut } from './AuthComponents';

const Header = () => {
  const location = useLocation();
  const { isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-in');

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/articles', label: 'Articles' },
    { path: '/gallery', label: 'Art Gallery' },
    { path: '/about', label: 'About' }
  ];

  const handleSignIn = () => {
    setAuthMode('sign-in');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('sign-up');
    setShowAuthModal(true);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Arthrokinetix</h1>
                <p className="text-xs text-gray-600">Medical Content & Art</p>
              </div>
            </Link>

            {/* Navigation & Authentication */}
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.path || 
                      (item.path === '/articles' && location.pathname.startsWith('/articles'))
                        ? 'text-secondary border-b-2 border-secondary'
                        : 'text-gray-700 hover:text-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* Authentication Section */}
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSignIn}
                      className="text-gray-700 hover:text-secondary text-sm font-medium transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleSignUp}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </SignedOut>

                <SignedIn>
                  <EnhancedUserButton />
                </SignedIn>

                {/* Web3 Integration - Always visible */}
                <EnhancedWeb3Integration />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <SignedOut>
                <button 
                  onClick={handleSignUp}
                  className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mr-2"
                >
                  Sign Up
                </button>
              </SignedOut>
              
              <button className="p-2 text-gray-600 hover:text-secondary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
};

export default Header;