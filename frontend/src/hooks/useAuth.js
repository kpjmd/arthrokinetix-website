import { useMockUser, useMockClerk } from '../components/ClerkProvider';
import { useAccount } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export const useUser = () => {
  const mockUser = useMockUser();
  
  // Always return mock for now to avoid conditional hook calls
  // In production, this would be properly set up with ClerkProvider
  return mockUser;
};

export const useClerk = () => {
  const mockClerk = useMockClerk();
  
  // Always return mock for now to avoid conditional hook calls
  // In production, this would be properly set up with ClerkProvider
  return mockClerk;
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
  }, [address, walletConnected, isVerifying]);

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
    
    // Combined access - for demo, allow Web3 access only
    hasAnyAccess: walletConnected && nftVerification?.verified,
    
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

export const SignedIn = ({ children }) => {
  const { hasAnyAccess, isLoaded } = useAuthenticationAccess();
  
  if (!isLoaded) return null;
  if (!hasAnyAccess) return null;
  
  return <>{children}</>;
};

export const SignedOut = ({ children }) => {
  const { hasAnyAccess, isLoaded } = useAuthenticationAccess();
  
  if (!isLoaded) return null;
  if (hasAnyAccess) return null;
  
  return <>{children}</>;
};