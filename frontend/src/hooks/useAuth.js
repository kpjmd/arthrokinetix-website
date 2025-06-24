import { useMockUser, useMockClerk } from '../components/ClerkProvider';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Safely import Clerk hooks at module level (not inside components)
let useClerkUser = null;
let useClerkHook = null;

try {
  if (CLERK_PUBLISHABLE_KEY) {
    const clerkReact = require('@clerk/clerk-react');
    useClerkUser = clerkReact.useUser;
    useClerkHook = clerkReact.useClerk;
  }
} catch (error) {
  console.warn('Clerk not available:', error.message);
}

// Custom hook that safely handles Clerk or falls back to mock
export const useUser = () => {
  // ALWAYS call all hooks at the top level - Rules of Hooks compliance
  const mockUser = useMockUser();
  
  // Only call Clerk hook if it exists (determined at module level)
  const clerkUser = useClerkUser ? useClerkUser() : null;
  
  // Use conditional logic AFTER all hooks are called
  if (CLERK_PUBLISHABLE_KEY && clerkUser && clerkUser.isLoaded !== undefined) {
    return clerkUser;
  }
  
  return mockUser;
};

// Custom hook that safely handles Clerk or falls back to mock
export const useClerk = () => {
  // ALWAYS call all hooks at the top level - Rules of Hooks compliance
  const mockClerk = useMockClerk();
  
  // Only call Clerk hook if it exists (determined at module level)
  const clerkHook = useClerkHook ? useClerkHook() : null;
  
  // Use conditional logic AFTER all hooks are called
  if (CLERK_PUBLISHABLE_KEY && clerkHook && clerkHook.loaded !== undefined) {
    return clerkHook;
  }
  
  return mockClerk;
};

// Completely safe SignedIn component that never crashes
export const SignedIn = ({ children }) => {
  // Always call hooks at top level
  const user = useUser();
  
  // Use conditional logic after hooks
  if (user && user.isSignedIn) {
    return <>{children}</>;
  }
  
  return null;
};

// Completely safe SignedOut component that never crashes
export const SignedOut = ({ children }) => {
  // Always call hooks at top level
  const user = useUser();
  
  // Use conditional logic after hooks
  if (!user || !user.isSignedIn) {
    return <>{children}</>;
  }
  
  return null;
};
