import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthModal, EnhancedUserButton } from './AuthComponents';
import { DebugAuthModal } from './DebugAuthModal';
import { useAuthenticationAccess, SignedIn, SignedOut, useUser, useClerk } from '../hooks/useAuth';

// Try to import Clerk UserButton
let UserButton = null;
try {
  const clerkComponents = require('@clerk/clerk-react');
  UserButton = clerkComponents.UserButton;
} catch (error) {
  console.warn('Clerk UserButton not available:', error.message);
}

const Header = () => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-in');
  
  // Get authentication state
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  // Debug authentication state
  console.log('🔍 [Header] Authentication state:', {
    isSignedIn,
    isLoaded,
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName } : null,
    hasUserButton: Boolean(UserButton),
    timestamp: new Date().toISOString()
  });

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔍 [Header] Modal state changed:', { 
      showAuthModal, 
      authMode, 
      timestamp: new Date().toISOString(),
      location: location.pathname 
    });
  }, [showAuthModal, authMode, location.pathname]);

  // Component mount/unmount logging
  useEffect(() => {
    console.log('🔍 [Header] Header component mounted');
    return () => {
      console.log('🔍 [Header] Header component unmounting');
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/articles', label: 'Articles' },
    { path: '/gallery', label: 'Art Gallery' },
    { path: '/about', label: 'About' }
  ];

  const handleSignIn = (e) => {
    console.log('🔍 [Header] Sign-in button clicked', { 
      timestamp: new Date().toISOString(),
      event: e,
      currentModal: showAuthModal,
      currentMode: authMode 
    });
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔍 [Header] Event prevented and stopped');
    }
    
    console.log('🔍 [Header] Setting auth mode to sign-in');
    setAuthMode('sign-in');
    
    console.log('🔍 [Header] Setting modal to open');
    setShowAuthModal(true);
    
    console.log('🔍 [Header] Sign-in handler completed');
  };

  const handleSignUp = (e) => {
    console.log('🔍 [Header] Sign-up button clicked', { 
      timestamp: new Date().toISOString(),
      event: e,
      currentModal: showAuthModal,
      currentMode: authMode 
    });
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔍 [Header] Event prevented and stopped');
    }
    
    console.log('🔍 [Header] Setting auth mode to sign-up');
    setAuthMode('sign-up');
    
    console.log('🔍 [Header] Setting modal to open');
    setShowAuthModal(true);
    
    console.log('🔍 [Header] Sign-up handler completed');
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
                {/* Debug Authentication State */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {isLoaded ? (isSignedIn ? `✅ ${user?.firstName || 'User'}` : '❌ Not signed in') : '⏳ Loading...'}
                  </div>
                )}
                
                <SignedOut>
                  {console.log('🔍 [Header] Rendering SignedOut section')}
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
                  {console.log('🔍 [Header] Rendering SignedIn section')}
                  <div className="flex items-center space-x-3">
                    {/* Use Clerk UserButton if available */}
                    {UserButton ? (
                      <>
                        <span className="text-sm text-gray-700">
                          Welcome, {user?.firstName || 'User'}!
                        </span>
                        <UserButton 
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8"
                            }
                          }}
                          showName={false}
                        />
                      </>
                    ) : (
                      <>
                        {/* Fallback to custom user display */}
                        <span className="text-sm text-gray-700">
                          Welcome, {user?.firstName || 'User'}!
                        </span>
                        <button
                          onClick={() => {
                            console.log('🔍 [Header] Sign out clicked');
                            signOut();
                          }}
                          className="text-gray-700 hover:text-red-600 text-sm font-medium transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                </SignedIn>

                {/* Web3 Integration - Temporarily disabled */}
                {/* <EnhancedWeb3Integration /> */}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <SignedOut>
                <button 
                  onClick={handleSignUp}
                  className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </button>
              </SignedOut>
              
              <SignedIn>
                {UserButton ? (
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                    showName={false}
                  />
                ) : (
                  <button
                    onClick={() => {
                      console.log('🔍 [Header] Mobile sign out clicked');
                      signOut();
                    }}
                    className="text-gray-700 hover:text-red-600 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                )}
              </SignedIn>
              
              <button className="p-2 text-gray-600 hover:text-secondary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Auth Modal - Restored now that authentication state is fixed */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          console.log('🔍 [Header] Auth modal closed');
          setShowAuthModal(false);
        }}
        mode={authMode}
      />
      
      {/* Debug Auth Modal - Keep for debugging if needed
      <DebugAuthModal
        isOpen={false}
        onClose={() => {
          console.log('🔧 [Header] Debug modal close called');
          setShowAuthModal(false);
        }}
        mode={authMode}
      />
      */}
    </>
  );
};

export default Header;