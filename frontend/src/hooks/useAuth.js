import { useMockUser, useMockClerk } from '../components/ClerkProvider';
import { useAccount } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Check if real Clerk is available
let realClerkHooks = null;
try {
  if (CLERK_PUBLISHABLE_KEY) {
    realClerkHooks = require('@clerk/clerk-react');
    console.log('🔍 [useAuth] Real Clerk hooks loaded successfully');
  }
} catch (error) {
  console.warn('🔍 [useAuth] Real Clerk hooks not available:', error.message);
}

export const useUser = () => {
  console.log('🔍 [useAuth] useUser called, using:', realClerkHooks ? 'REAL CLERK' : 'MOCK');
  
  // Always call mock hook (consistent hook order)
  const mockUser = useMockUser();
  
  // Always call real hook if available (consistent hook order)
  let realUser = null;
  if (realClerkHooks?.useUser) {
    realUser = realClerkHooks.useUser();
    console.log('🔍 [useAuth] Real Clerk user state:', {
      isSignedIn: realUser.isSignedIn,
      isLoaded: realUser.isLoaded,
      userId: realUser.user?.id,
      firstName: realUser.user?.firstName
    });
  }
  
  // Return appropriate result based on availability
  if (realUser) {
    console.log('🔍 [useAuth] Using real Clerk user');
    return realUser;
  } else {
    console.log('🔍 [useAuth] Using mock user');
    return mockUser;
  }
};

export const useClerk = () => {
  console.log('🔍 [useAuth] useClerk called, using:', realClerkHooks ? 'REAL CLERK' : 'MOCK');
  
  // Always call mock hook (consistent hook order)
  const mockClerk = useMockClerk();
  
  // Always call real hook if available (consistent hook order)
  let realClerk = null;
  if (realClerkHooks?.useClerk) {
    realClerk = realClerkHooks.useClerk();
    console.log('🔍 [useAuth] Real Clerk loaded:', Boolean(realClerk.loaded));
  }
  
  // Return appropriate result based on availability
  if (realClerk) {
    console.log('🔍 [useAuth] Using real Clerk');
    return realClerk;
  } else {
    console.log('🔍 [useAuth] Using mock clerk');
    return mockClerk;
  }
};

// Enhanced authentication access hook
export const useAuthenticationAccess = () => {
  const { isSignedIn: emailSignedIn, user: clerkUser, isLoaded } = useUser();
  const { isConnected: walletConnected, address } = useAccount();
  const [nftVerification, setNftVerification] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verify NFT ownership when wallet is connected
  useEffect(() => {
    const verifyNFTOwnership = async () => {
      if (!address || isVerifying) return;
      
      setIsVerifying(true);
      try {
        const response = await fetch(`${API_BASE}/api/web3/verify-nft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address })
        });
        
        if (response.ok) {
          const data = await response.json();
          setNftVerification(data);
        } else {
          setNftVerification({ verified: false });
        }
      } catch (error) {
        console.error('NFT verification failed:', error);
        setNftVerification({ verified: false });
      } finally {
        setIsVerifying(false);
      }
    };

    if (walletConnected && address) {
      verifyNFTOwnership();
    } else {
      setNftVerification(null);
    }
  }, [address, walletConnected]);

  const authData = useMemo(() => ({
    // Email authentication - currently using mock, in production would use real Clerk
    hasEmailAccess: emailSignedIn && isLoaded,
    clerkUser,
    
    // Web3 authentication
    hasNFTAccess: walletConnected && nftVerification?.verified,
    walletAddress: address,
    walletConnected,
    nftVerification,
    isVerifyingNFT: isVerifying,
    
    // Combined access - both email and Web3 authentication
    hasAnyAccess: (emailSignedIn && isLoaded) || (walletConnected && nftVerification?.verified),
    
    // Authentication methods info
    authenticationMethods: {
      email: emailSignedIn && isLoaded,
      web3: walletConnected && nftVerification?.verified
    },
    
    // Loading states
    isLoaded: isLoaded && (!walletConnected || !isVerifying)
  }), [emailSignedIn, isLoaded, clerkUser, walletConnected, address, nftVerification, isVerifying]);

  return authData;
};

// Export real Clerk SignedIn/SignedOut if available, otherwise custom ones
export const SignedIn = ({ children }) => {
  console.log('🔍 [useAuth] SignedIn component called');
  
  // Always call useAuthenticationAccess to ensure consistent hook order
  const { hasAnyAccess, isLoaded } = useAuthenticationAccess();
  
  if (realClerkHooks?.SignedIn) {
    console.log('🔍 [useAuth] Using real Clerk SignedIn');
    const ClerkSignedIn = realClerkHooks.SignedIn;
    return <ClerkSignedIn>{children}</ClerkSignedIn>;
  }
  
  // Fallback to custom logic using the hook data we already called
  console.log('🔍 [useAuth] Using custom SignedIn logic');
  
  if (!isLoaded) return null;
  if (!hasAnyAccess) return null;
  
  return <>{children}</>;
};

export const SignedOut = ({ children }) => {
  console.log('🔍 [useAuth] SignedOut component called');
  
  // Always call useAuthenticationAccess to ensure consistent hook order
  const { hasAnyAccess, isLoaded } = useAuthenticationAccess();
  
  if (realClerkHooks?.SignedOut) {
    console.log('🔍 [useAuth] Using real Clerk SignedOut');
    const ClerkSignedOut = realClerkHooks.SignedOut;
    return <ClerkSignedOut>{children}</ClerkSignedOut>;
  }
  
  // Fallback to custom logic using the hook data we already called
  console.log('🔍 [useAuth] Using custom SignedOut logic');
  
  if (!isLoaded) return null;
  if (hasAnyAccess) return null;
  
  return <>{children}</>;
};