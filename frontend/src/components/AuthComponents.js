import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, LogOut, Settings } from 'lucide-react';
import { useUser, useClerk, SignedIn, SignedOut } from '../hooks/useAuth';

// Check if Clerk is available
const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Auth Modal Component
export const AuthModal = ({ isOpen, onClose, mode = 'sign-in' }) => {
  if (!isOpen) return null;

  // If Clerk is not available, show a message
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Authentication</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Authentication Demo Mode</h3>
              <p className="text-gray-600 mb-4">
                Clerk authentication is not configured. In production, this would show 
                the full sign-up/sign-in experience.
              </p>
              <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                You can still explore the application and use Web3 authentication features!
              </p>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Try to load Clerk components dynamically
  try {
    const { SignIn, SignUp } = require('@clerk/clerk-react');
    
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {mode === 'sign-in' ? (
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-primary hover:bg-primary/90',
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden'
                    }
                  }}
                  redirectUrl="/articles"
                  signUpUrl="#"
                />
              ) : (
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-primary hover:bg-primary/90',
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden'
                    }
                  }}
                  redirectUrl="/articles"
                  signInUrl="#"
                />
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  } catch (error) {
    console.warn('Failed to load Clerk components:', error.message);
    return null;
  }
};

// Sign Up Prompt Component
export const SignUpPrompt = ({ onSignUp, onSignIn, className = "" }) => {
  return (
    <div className={`bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white text-center ${className}`}>
      <Mail className="w-12 h-12 mx-auto mb-4 text-white/90" />
      <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
      <p className="text-white/90 mb-4">
        Sign up to provide emotional feedback and influence the algorithm
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onSignUp}
          className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Sign Up
        </button>
        <button
          onClick={onSignIn}
          className="border border-white/30 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

// Enhanced User Button Component
export const EnhancedUserButton = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img 
          src={user.imageUrl} 
          alt={user.fullName}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium hidden md:block">
          {user.firstName || user.emailAddresses[0].emailAddress}
        </span>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.emailAddresses[0].emailAddress}</p>
            </div>
            
            <button
              onClick={() => setShowDropdown(false)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </button>
            
            <button
              onClick={() => setShowDropdown(false)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            
            <hr className="my-1" />
            
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Access Gate Component for Feedback
export const AccessGate = ({ onSignUp, onSignIn }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Help the Algorithm Learn
        </h3>
        <p className="text-gray-600 mb-6">
          Unlock emotional feedback by signing up for your account. Join our community 
          and help shape the algorithm's understanding of medical content.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Email Verification</h4>
            <p className="text-sm text-gray-600 mb-4">
              Quick and secure email-based authentication
            </p>
            <button
              onClick={onSignUp}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign Up with Email
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-white text-xs font-bold">W3</span>
            </div>
            <h4 className="font-semibold mb-2">Web3 Authentication</h4>
            <p className="text-sm text-gray-600 mb-4">
              Connect wallet & verify NFT ownership
            </p>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={onSignIn}
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

// Signed In/Out conditional components
export { SignedIn, SignedOut };