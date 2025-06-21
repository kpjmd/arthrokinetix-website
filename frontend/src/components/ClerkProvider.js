import React from 'react';
import { ClerkProvider as ClerkAuthProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("Clerk publishable key not found. Authentication features will be disabled.");
}

const ClerkProvider = ({ children }) => {
  // If no Clerk key is available, render children without Clerk provider
  if (!CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkAuthProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkAuthProvider>
  );
};

export default ClerkProvider;