import { useMockUser, useMockClerk } from '../components/ClerkProvider';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// For now, let's just use mock implementations to get the site working
// We can add real Clerk integration later once the site is stable

export const useUser = () => {
  // Always use mock for now - completely safe
  return useMockUser();
};

export const useClerk = () => {
  // Always use mock for now - completely safe
  return useMockClerk();
};

export const SignedIn = ({ children }) => {
  // For now, never show SignedIn content (since we're using mock)
  return null;
};

export const SignedOut = ({ children }) => {
  // For now, always show SignedOut content (since we're using mock)
  return <>{children}</>;
};
