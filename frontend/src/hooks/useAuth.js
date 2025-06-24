import { useMockUser, useMockClerk } from '../components/ClerkProvider';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Debug logging
console.log('useAuth Debug:', {
  CLERK_KEY: CLERK_PUBLISHABLE_KEY ? 'EXISTS' : 'MISSING',
  CLERK_KEY_TYPE: CLERK_PUBLISHABLE_KEY?.includes('test') ? 'DEV' : 'PROD'
});

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

// Completely safe SignedIn component that never crashes
export const SignedIn = ({ children }) => {
  try {
    const user = useUser();
    
    // Only show content if user is actually signed in
    if (user && user.isSignedIn) {
      return <>{children}</>;
    }
    
    return null;
  } catch (error) {
    console.warn('SignedIn component error:', error.message);
    return null;
  }
};

// Completely safe SignedOut component that never crashes
export const SignedOut = ({ children }) => {
  try {
    const user = useUser();
    
    // Show content if user is not signed in or if we can't determine status
    if (!user || !user.isSignedIn) {
      return <>{children}</>;
    }
    
    return null;
  } catch (error) {
    console.warn('SignedOut component error:', error.message);
    // Default to showing content if there's an error
    return <>{children}</>;
  }
};
