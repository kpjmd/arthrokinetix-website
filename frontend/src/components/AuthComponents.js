import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, LogOut, Settings } from 'lucide-react';
import { useClerk, useAuthenticationAccess, SignedIn, SignedOut } from '../hooks/useAuth';

// Check if Clerk is available
const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Import Clerk components at module level to prevent re-renders
let SignIn, SignUp, SignInWithMetamaskButton;
try {
  const clerkComponents = require('@clerk/clerk-react');
  SignIn = clerkComponents.SignIn;
  SignUp = clerkComponents.SignUp;
  SignInWithMetamaskButton = clerkComponents.SignInWithMetamaskButton;
} catch (error) {
  console.warn('Clerk components not available:', error.message);
}

// Auth Modal Component
export const AuthModal = ({ isOpen, onClose, mode = 'sign-in' }) => {
  console.log('🔍 [AuthModal] Component render:', { 
    isOpen, 
    mode, 
    timestamp: new Date().toISOString() 
  });

  // Component mount/unmount logging
  useEffect(() => {
    console.log('🔍 [AuthModal] Component mounted/props changed:', { isOpen, mode });
    return () => {
      console.log('🔍 [AuthModal] Component unmounting or props changing');
    };
  }, [isOpen, mode]);

  // Modal state logging
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 [AuthModal] Modal opened with mode:', mode);
    } else {
      console.log('🔍 [AuthModal] Modal closed');
    }
  }, [isOpen, mode]);

  if (!isOpen) {
    console.log('🔍 [AuthModal] Returning null - modal not open');
    return null;
  }

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

  // Check if Clerk components are available
  if (!SignIn || !SignUp || !SignInWithMetamaskButton) {
    console.warn('Clerk components not available, modal will not render');
    return null;
  }
    
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
              {/* Dual Authentication Options */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Choose your authentication method
                  </h3>
                  <p className="text-sm text-gray-600">
                    Medical professionals can use email, NFT holders can use Web3
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Email Tab */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-blue-900">Email</span>
                    <p className="text-xs text-blue-700">Medical Professionals</p>
                  </div>
                  
                  {/* Web3 Tab */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">W3</span>
                    </div>
                    <span className="text-sm font-medium text-purple-900">Web3</span>
                    <p className="text-xs text-purple-700">NFT Holders</p>
                  </div>
                </div>
                
                {/* Web3 Authentication Button */}
                <div className="mb-4">
                  <SignInWithMetamaskButton
                    fallbackRedirectUrl="/articles"
                    className="w-full"
                  >
                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded mr-2 flex items-center justify-center">
                        <span className="text-purple-600 text-xs font-bold">M</span>
                      </div>
                      Sign {mode === 'sign-in' ? 'In' : 'Up'} with Metamask
                    </button>
                  </SignInWithMetamaskButton>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or continue with email</span>
                  </div>
                </div>
              </div>
              
              {/* Standard Email Authentication */}
              {mode === 'sign-in' ? (
                <>
                  {console.log('🔍 [AuthModal] Rendering SignIn component')}
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                        card: 'shadow-none',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'hidden',
                        dividerRow: 'hidden'
                      }
                    }}
                    fallbackRedirectUrl="/articles"
                  />
                </>
              ) : (
                <>
                  {console.log('🔍 [AuthModal] Rendering SignUp component')}
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                        card: 'shadow-none',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'hidden',
                        dividerRow: 'hidden'
                      }
                    }}
                    fallbackRedirectUrl="/articles"
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
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
  const { clerkUser, walletAddress, authenticationMethods } = useAuthenticationAccess();
  const { signOut } = useClerk();
  const [showDropdown, setShowDropdown] = useState(false);

  // Show if user has any authentication method
  if (!authenticationMethods.email && !authenticationMethods.web3) return null;
  
  const user = clerkUser || { fullName: 'Web3 User', imageUrl: null, emailAddresses: [] };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <img 
          src={user.imageUrl || '/default-avatar.png'} 
          alt={user.fullName || 'User'}
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNFNUU3RUIiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTggMTBDMTAuMjA5MSAxMCAxMiA4LjIwOTEgMTIgNkMxMiAzLjc5MDkgMTAuMjA5MSAyIDggMkM1Ljc5MDkgMiA0IDMuNzkwOSA0IDZDNCA4LjIwOTEgNS43OTA5IDEwIDggMTBaIiBmaWxsPSIjNkI3Mjg3Ii8+CjxwYXRoIGQ9Ik0xNiAxNEMxNiAxMS43OTA5IDEyLjQxODMgMTAgOCAxMEM2IDEwIDQgMTAuNSA0IDEyQzQgMTMuNSA2IDE0IDggMTRDMTAgMTQgMTIgMTMuNSAxMiAxMkMxMiAxMC41IDE0IDEwLjUgMTYgMTJWMTRaIiBmaWxsPSIjNkI3Mjg3Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
          }}
        />
        <span className="text-sm font-medium hidden md:block">
          {user.firstName || user.emailAddresses?.[0]?.emailAddress || 'User'}
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
              <p className="text-sm font-medium text-gray-900">{user.fullName || 'User'}</p>
              {user.emailAddresses?.[0]?.emailAddress ? (
                <p className="text-xs text-gray-500">{user.emailAddresses[0].emailAddress}</p>
              ) : walletAddress ? (
                <p className="text-xs text-gray-500">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
              ) : (
                <p className="text-xs text-gray-500">Authenticated User</p>
              )}
              
              {/* Authentication method indicators */}
              <div className="flex gap-1 mt-1">
                {authenticationMethods.email && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Email
                  </span>
                )}
                {authenticationMethods.web3 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Web3
                  </span>
                )}
              </div>
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
  const [showWeb3Modal, setShowWeb3Modal] = useState(false);
  
  return (
    <>
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
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Email Verification</h4>
              <p className="text-sm text-gray-600 mb-4">
                Quick and secure email-based authentication for medical professionals
              </p>
              <button
                onClick={onSignUp}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
                Connect wallet & verify NFT ownership for premium access
              </p>
              <button
                onClick={() => setShowWeb3Modal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={onSignIn}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
      
      {/* Web3 Connection Modal */}
      {showWeb3Modal && (
        <Web3ConnectionModal
          isOpen={showWeb3Modal}
          onClose={() => setShowWeb3Modal(false)}
        />
      )}
    </>
  );
};

// Web3 Connection Modal Component
export const Web3ConnectionModal = ({ isOpen, onClose }) => {
  const wagmi = require('wagmi') || {};
  const { useConnect = () => ({ connect: () => {}, connectors: [], isPending: false }) } = wagmi;
  const { connect, connectors, isPending } = useConnect();
  const { walletConnected, isVerifyingNFT, nftVerification } = useAuthenticationAccess();
  
  // Close modal when wallet is connected and verified
  useEffect(() => {
    if (walletConnected && nftVerification?.verified) {
      onClose();
    }
  }, [walletConnected, nftVerification, onClose]);

  if (!isOpen) return null;

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
            <h2 className="text-xl font-semibold">Connect Wallet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Connect your wallet to verify NFT ownership and access premium feedback features.
            </p>
            
            {!walletConnected ? (
              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {connector.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{connector.name}</span>
                    </div>
                    {isPending && <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                {isVerifyingNFT ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <h3 className="font-semibold text-blue-900 mb-2">Verifying NFT Ownership</h3>
                    <p className="text-blue-700 text-sm">
                      Checking your wallet for Arthrokinetix NFTs...
                    </p>
                  </div>
                ) : nftVerification?.verified ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-green-900 mb-2">NFT Ownership Verified!</h3>
                    <p className="text-green-700 text-sm mb-4">
                      You can now provide premium feedback on articles.
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-yellow-900 mb-2">No NFTs Found</h3>
                    <p className="text-yellow-700 text-sm mb-4">
                      Your wallet doesn't contain any Arthrokinetix NFTs. You can still use email authentication.
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Continue with Email
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">NFT Premium Access</p>
                  <p>We verify ownership of Arthrokinetix NFTs on Base network for enhanced algorithm influence.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Signed In/Out conditional components
export { SignedIn, SignedOut };