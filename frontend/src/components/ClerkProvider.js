import React, { createContext, useContext } from 'react';
import { ClerkProvider as ClerkAuthProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Mock Clerk context for when Clerk is not available
const MockClerkContext = createContext({
  isSignedIn: false,
  user: null,
  signOut: () => Promise.resolve(),
  openSignIn: () => {},
  openSignUp: () => {}
});

// Mock ClerkProvider component
const MockClerkProvider = ({ children }) => {
  const mockClerkValue = {
    isSignedIn: false,
    user: null,
    signOut: () => Promise.resolve(),
    openSignIn: () => console.log('Clerk not configured - Sign In clicked'),
    openSignUp: () => console.log('Clerk not configured - Sign Up clicked')
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
    isLoaded: true
  };
};

export const useMockClerk = () => {
  const context = useContext(MockClerkContext);
  return {
    signOut: context.signOut,
    openSignIn: context.openSignIn,
    openSignUp: context.openSignUp
  };
};

// Mock components that don't break when Clerk is not available
export const MockSignedIn = ({ children }) => null;
export const MockSignedOut = ({ children }) => <>{children}</>;

const ClerkProvider = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.warn("Clerk publishable key not found. Using mock authentication system.");
    return <MockClerkProvider>{children}</MockClerkProvider>;
  }

  return (
    <ClerkAuthProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkAuthProvider>
  );
};

export default ClerkProvider;