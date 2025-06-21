import { useUser as useClerkUser, useClerk as useClerkHook } from '@clerk/clerk-react';
import { useMockUser, useMockClerk } from '../components/ClerkProvider';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Custom hook that safely handles Clerk or falls back to mock
export const useUser = () => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return useMockUser();
  }
  
  try {
    return useClerkUser();
  } catch (error) {
    console.warn('Clerk useUser failed, using mock:', error.message);
    return useMockUser();
  }
};

// Custom hook that safely handles Clerk or falls back to mock
export const useClerk = () => {
  if (!CLERK_PUBLISHABLE_KEY) {
    return useMockClerk();
  }
  
  try {
    return useClerkHook();
  } catch (error) {
    console.warn('Clerk useClerk failed, using mock:', error.message);
    return useMockClerk();
  }
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