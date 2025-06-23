import { useUser as useClerkUser, useClerk as useClerkHook } from '@clerk/clerk-react';
import { useMockUser, useMockClerk } from '../components/ClerkProvider';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Custom hook that safely handles Clerk or falls back to mock
export const useUser = () => {
  // Always call both hooks (Rules of Hooks compliance)
  const mockUser = useMockUser();
  
  // Only call Clerk hook if key is available
  let clerkUser = null;
  let clerkError = false;
  
  try {
    // This will only work if Clerk is properly configured
    clerkUser = CLERK_PUBLISHABLE_KEY ? useClerkUser() : null;
  } catch (error) {
    console.warn('Clerk useUser failed, using mock:', error.message);
    clerkError = true;
  }
  
  // Return Clerk user if available, otherwise mock
  if (CLERK_PUBLISHABLE_KEY && !clerkError && clerkUser) {
    return clerkUser;
  }
  
  return mockUser;
};

// Custom hook that safely handles Clerk or falls back to mock
export const useClerk = () => {
  // Always call both hooks (Rules of Hooks compliance)
  const mockClerk = useMockClerk();
  
  // Only call Clerk hook if key is available
  let clerkHook = null;
  let clerkError = false;
  
  try {
    // This will only work if Clerk is properly configured
    clerkHook = CLERK_PUBLISHABLE_KEY ? useClerkHook() : null;
  } catch (error) {
    console.warn('Clerk useClerk failed, using mock:', error.message);
    clerkError = true;
  }
  
  // Return Clerk hook if available, otherwise mock
  if (CLERK_PUBLISHABLE_KEY && !clerkError && clerkHook) {
    return clerkHook;
  }
  
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
