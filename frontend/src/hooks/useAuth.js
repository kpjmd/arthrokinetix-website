import { useUser as useClerkUser, useClerk as useClerkHook } from '@clerk/clerk-react';
import { useMockUser, useMockClerk } from '../components/ClerkProvider';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Custom hook that safely handles Clerk or falls back to mock
export const useUser = () => {
  // Always call all hooks unconditionally - Rules of Hooks compliance
  const mockUser = useMockUser();
  const clerkUser = useClerkUser(); // Always called, no conditions
  
  // Use conditional logic AFTER all hooks are called
  // Check if Clerk is properly configured and working
  const hasClerkKey = Boolean(CLERK_PUBLISHABLE_KEY);
  const isClerkWorking = hasClerkKey && clerkUser && !clerkUser.error;
  
  if (isClerkWorking) {
    return clerkUser;
  }
  
  // Fall back to mock user
  return mockUser;
};

// Custom hook that safely handles Clerk or falls back to mock
export const useClerk = () => {
  // Always call all hooks unconditionally - Rules of Hooks compliance
  const mockClerk = useMockClerk();
  const clerkHook = useClerkHook(); // Always called, no conditions
  
  // Use conditional logic AFTER all hooks are called
  // Check if Clerk is properly configured and working
  const hasClerkKey = Boolean(CLERK_PUBLISHABLE_KEY);
  const isClerkWorking = hasClerkKey && clerkHook && !clerkHook.error;
  
  if (isClerkWorking) {
    return clerkHook;
  }
  
  // Fall back to mock clerk
  return mockClerk;
};

// Safe SignedIn component
export const SignedIn = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return null; // Don't show signed-in content when Clerk is not available
  }
  
  try {
    const { SignedIn: ClerkSignedIn } = require('@clerk/clerk-react');
    return <ClerkSignedIn>{children}</ClerkSignedIn>;
  } catch (error) {
    console.warn('Clerk SignedIn failed:', error.message);
    return null;
  }
};

// Safe SignedOut component  
export const SignedOut = ({ children }) => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>; // Show signed-out content when Clerk is not available
  }
  
  try {
    const { SignedOut: ClerkSignedOut } = require('@clerk/clerk-react');
    return <ClerkSignedOut>{children}</ClerkSignedOut>;
  } catch (error) {
    console.warn('Clerk SignedOut failed:', error.message);
    return <>{children}</>;
  }
};
