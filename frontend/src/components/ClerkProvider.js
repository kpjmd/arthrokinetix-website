import React, { createContext, useContext } from 'react';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Development-only debug logging (removed for security)
if (process.env.NODE_ENV === 'development') {
  console.log('ClerkProvider Debug:', {
    KEY_EXISTS: Boolean(CLERK_PUBLISHABLE_KEY),
    IS_DEV_KEY: CLERK_PUBLISHABLE_KEY?.includes('test')
  });
}

// Mock Clerk context for when Clerk is not available
const MockClerkContext = createContext({
  isSignedIn: false,
  user: null,
  isLoaded: true,
  signOut: () => Promise.resolve(),
  openSignIn: () => {},
  openSignUp: () => {}
});

// Mock ClerkProvider component
const MockClerkProvider = ({ children }) => {
  const mockClerkValue = {
    isSignedIn: false,
    user: null,
    isLoaded: true,
    signOut: () => Promise.resolve(),
    openSignIn: () => console.log('Mock Clerk - Sign In clicked'),
    openSignUp: () => console.log('Mock Clerk - Sign Up clicked')
  };

  return (
    <MockClerkContext.Provider value={mockClerkValue}>
      {children}
    </MockClerkContext.Provider>
  );
};

// Mock hook implementations
export const useMockUser = () => {
  const context = useContext(MockClerkContext);
  return {
    isSignedIn: context.isSignedIn,
    user: context.user,
    isLoaded: context.isLoaded
  };
};

export const useMockClerk = () => {
  const context = useContext(MockClerkContext);
  return {
    signOut: context.signOut,
    openSignIn: context.openSignIn,
    openSignUp: context.openSignUp,
    loaded: true
  };
};

const ClerkProvider = ({ children }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 [ClerkProvider] Initializing ClerkProvider', {
      hasKey: Boolean(CLERK_PUBLISHABLE_KEY),
      timestamp: new Date().toISOString()
    });
  }

  // If no Clerk key, use mock system
  if (!CLERK_PUBLISHABLE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("🔍 [ClerkProvider] Clerk publishable key not found. Using mock authentication system.");
    }
    return <MockClerkProvider>{children}</MockClerkProvider>;
  }

  // Try to use real Clerk with better error handling
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [ClerkProvider] Attempting to load real Clerk components');
    }
    const { ClerkProvider: ClerkAuthProvider } = require('@clerk/clerk-react');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [ClerkProvider] Real Clerk loaded successfully, returning ClerkAuthProvider');
    }
    return (
      <ClerkAuthProvider 
        publishableKey={CLERK_PUBLISHABLE_KEY}
        appearance={{
          elements: {
            socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
            dividerRow: 'my-4',
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        }}
      >
        {children}
      </ClerkAuthProvider>
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🔍 [ClerkProvider] Failed to initialize Clerk:', error);
      console.warn('🔍 [ClerkProvider] Falling back to mock authentication system.');
    }
    return <MockClerkProvider>{children}</MockClerkProvider>;
  }
};

export default ClerkProvider;
