import React from 'react';
import { ClerkProvider as ClerkAuthProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

const ClerkProvider = ({ children }) => {
  return (
    <ClerkAuthProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkAuthProvider>
  );
};

export default ClerkProvider;