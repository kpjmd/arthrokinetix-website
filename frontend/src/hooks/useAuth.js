import { useMockUser, useMockClerk } from '../components/ClerkProvider';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Safely import Clerk hooks only if Clerk is available
let useClerkUser = null;
let useClerkHook = null;

if (CLERK_PUBLISHABLE_KEY) {
  try {
    const clerkReact = require('@clerk/clerk-react');
    useClerkUser = clerkReact.useUser;
    useClerkHook = clerkReact.useClerk;
  } catch (error) {
    console.warn('Clerk hooks not available:', error.message);
  }
}

// Custom hook that safely handles Clerk or falls back to mock
export const useUser = () => {
  const mockUser = useMockUser();
  
  // If no Clerk key or hooks not available, use mock
  if (!CLERK_PUBLISHABLE_KEY || !useClerkUser) {
    return mockUser;
  }
  
  try {
    const clerkUser = useClerkUser();
    // Check if we're actually in a Clerk context
    if (clerkUser && typeof clerkUser.isLoaded !== 'undefined') {
      return clerkUser;
    }
    return mockUser;
  } catch (error) {
    console.warn('Clerk useUser failed, falling back to mock:', error.message);
    return mockUser;
  }
};

// Custom hook that safely handles Clerk or falls back to mock
export const useClerk = () => {
  const mockClerk = useMockClerk();
  
  // If no Clerk key or hooks not available, use mock
  if (!CLERK_PUBLISHABLE_KEY || !useClerkHook) {
    return mockClerk;
  }
  
  try {
    const clerkHook = useClerkHook();
    // Check if we're actually in a Clerk context
    if (clerkHook && typeof clerkHook.loaded !== 'undefined') {
      return clerkHook;
    }
    return mockClerk;
  } catch (error) {
    console.warn('Clerk useClerk failed, falling back to mock:', error.message);
    return mockClerk;
  }
};

// Safe SignedIn component that checks context properly
export const SignedIn = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return null;
  }
  
  try {
    const { SignedIn: ClerkSignedIn, useUser } = require('@clerk/clerk-react');
    
    // Wrapper component that checks if we're in Clerk context
    const SafeSignedIn = ({ children }) => {
      try {
        const user = useUser();
        if (user.isSignedIn) {
          return children;
        }
        return null;
      } catch (error) {
        console.warn('SignedIn context error:', error.message);
        return null;
      }
    };
    
    return <SafeSignedIn>{children}</SafeSignedIn>;
  } catch (error) {
    console.warn('Clerk SignedIn component failed:', error.message);
    return null;
  }
};

// Safe SignedOut component that checks context properly
export const SignedOut = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }
  
  try {
    const { useUser } = require('@clerk/clerk-react');
    
    // Wrapper component that checks if we're in Clerk context
    const SafeSignedOut = ({ children }) => {
      try {
        const user = useUser();
        if (!user.isSignedIn) {
          return children;
        }
        return null;
      } catch (error) {
        console.warn('SignedOut context error:', error.message);
        return <>{children}</>;
      }
    };
    
    return <SafeSignedOut>{children}</SafeSignedOut>;
  } catch (error) {
    console.warn('Clerk SignedOut component failed:', error.message);
    return <>{children}</>;
  }
};
