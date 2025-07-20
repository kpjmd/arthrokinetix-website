import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Check if Clerk is available
const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Import Clerk components
let SignIn, SignUp;
try {
  const clerkComponents = require('@clerk/clerk-react');
  SignIn = clerkComponents.SignIn;
  SignUp = clerkComponents.SignUp;
} catch (error) {
  console.warn('Clerk components not available in debug modal:', error.message);
}

// Minimal Debug Auth Modal Component
export const DebugAuthModal = ({ isOpen, onClose, mode = 'sign-in' }) => {
  console.log('🔧 [DebugAuthModal] Render:', { 
    isOpen, 
    mode, 
    timestamp: new Date().toISOString(),
    hasClerkKey: Boolean(CLERK_PUBLISHABLE_KEY),
    hasSignIn: Boolean(SignIn),
    hasSignUp: Boolean(SignUp)
  });

  useEffect(() => {
    console.log('🔧 [DebugAuthModal] Mount/Props Change:', { isOpen, mode });
    
    if (isOpen) {
      console.log('🔧 [DebugAuthModal] Modal is opening');
      
      // Add event listeners to detect any navigation
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      window.history.pushState = function(...args) {
        console.log('🔧 [DebugAuthModal] DETECTED pushState during modal open:', args);
        return originalPushState.apply(this, args);
      };
      
      window.history.replaceState = function(...args) {
        console.log('🔧 [DebugAuthModal] DETECTED replaceState during modal open:', args);
        return originalReplaceState.apply(this, args);
      };
      
      // Listen for location changes
      const handleLocationChange = () => {
        console.log('🔧 [DebugAuthModal] DETECTED location change:', window.location.href);
      };
      
      window.addEventListener('popstate', handleLocationChange);
      
      return () => {
        console.log('🔧 [DebugAuthModal] Cleaning up event listeners');
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
        window.removeEventListener('popstate', handleLocationChange);
      };
    }
  }, [isOpen, mode]);

  if (!isOpen) {
    console.log('🔧 [DebugAuthModal] Not open, returning null');
    return null;
  }

  // If no Clerk, show message
  if (!CLERK_PUBLISHABLE_KEY || !SignIn || !SignUp) {
    console.log('🔧 [DebugAuthModal] No Clerk available, showing fallback');
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Debug - No Clerk</h2>
              <button
                onClick={(e) => {
                  console.log('🔧 [DebugAuthModal] Close button clicked');
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p>Debug Modal - Clerk not available</p>
              <p>Key exists: {Boolean(CLERK_PUBLISHABLE_KEY).toString()}</p>
              <p>Components loaded: {Boolean(SignIn && SignUp).toString()}</p>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  console.log('🔧 [DebugAuthModal] Rendering with Clerk components');
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
              Debug {mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </h2>
            <button
              onClick={(e) => {
                console.log('🔧 [DebugAuthModal] Close button clicked');
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
              <strong>Debug Info:</strong><br/>
              Mode: {mode}<br/>
              Timestamp: {new Date().toISOString()}<br/>
              Current URL: {window.location.href}
            </div>
            
            {/* Minimal Clerk Component */}
            {mode === 'sign-in' ? (
              <>
                {console.log('🔧 [DebugAuthModal] Rendering minimal SignIn')}
                <SignIn 
                  appearance={{
                    elements: {
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden'
                    }
                  }}
                />
              </>
            ) : (
              <>
                {console.log('🔧 [DebugAuthModal] Rendering minimal SignUp')}
                <SignUp 
                  appearance={{
                    elements: {
                      card: 'shadow-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden'
                    }
                  }}
                />
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DebugAuthModal;