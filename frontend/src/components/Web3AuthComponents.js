import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { X, Wallet, Check, AlertCircle, ExternalLink } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Web3 Connection Modal
export const Web3Modal = ({ isOpen, onClose }) => {
  const { connect, connectors, isPending } = useConnect();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    if (isConnected) {
      onClose();
    }
  }, [isConnected, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Connect Wallet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Connect your wallet to verify NFT ownership and access feedback features.
            </p>
            
            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{connector.name}</span>
                  </div>
                  {isPending && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">NFT Verification</p>
                  <p>We'll verify ownership of Arthrokinetix NFTs on Base network to grant feedback access.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// NFT Verification Component
export const NFTVerification = ({ walletAddress, onVerificationComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  const verifyNFTOwnership = async () => {
    if (!walletAddress) return;

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/web3/verify-nft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: walletAddress
        })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationResult(data);
        if (onVerificationComplete) {
          onVerificationComplete(data);
        }
      } else {
        setError(data.detail || 'Verification failed');
      }
    } catch (err) {
      setError('Network error during verification');
      console.error('NFT verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (walletAddress && !verificationResult) {
      verifyNFTOwnership();
    }
  }, [walletAddress]);

  if (isVerifying) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <motion.div
          className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <h3 className="font-semibold text-blue-900 mb-2">Verifying NFT Ownership</h3>
        <p className="text-blue-700 text-sm">
          Checking your wallet for Arthrokinetix NFTs on Base network...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="font-semibold text-red-900">Verification Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={verifyNFTOwnership}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (verificationResult) {
    const { verified, erc721_balance, erc1155_balance, contracts_owned } = verificationResult;

    if (verified) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Check className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="font-semibold text-green-900">NFT Ownership Verified!</h3>
          </div>
          
          <div className="space-y-3 text-sm text-green-800">
            <p>✓ You own Arthrokinetix NFTs and can now provide feedback</p>
            
            <div className="bg-white/50 rounded-lg p-3">
              <p className="font-medium mb-2">Your NFTs:</p>
              <ul className="space-y-1">
                {erc721_balance > 0 && (
                  <li>• ERC721 Tokens: {erc721_balance}</li>
                )}
                {erc1155_balance > 0 && (
                  <li>• ERC1155 Tokens: {erc1155_balance}</li>
                )}
              </ul>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600">
                Wallet: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
              </span>
              <a
                href={`https://basescan.org/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-xs flex items-center"
              >
                View on BaseScan <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
            <h3 className="font-semibold text-yellow-900">No NFTs Found</h3>
          </div>
          
          <div className="space-y-3 text-sm text-yellow-800">
            <p>Your wallet doesn't contain any Arthrokinetix NFTs required for feedback access.</p>
            
            <div className="bg-white/50 rounded-lg p-3">
              <p className="font-medium mb-2">To get access, you need:</p>
              <ul className="space-y-1">
                <li>• Arthrokinetix ERC721 NFT, or</li>
                <li>• Arthrokinetix ERC1155 NFT</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-2">
              <a
                href="https://opensea.io/collection/arthrokinetix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-700 hover:text-yellow-800 text-sm flex items-center justify-center bg-white px-4 py-2 rounded-lg border border-yellow-300"
              >
                View Collection on OpenSea <ExternalLink className="w-4 h-4 ml-1" />
              </a>
              
              <button
                onClick={verifyNFTOwnership}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Re-check Ownership
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

// Connected Wallet Display
export const ConnectedWallet = ({ onDisconnect, onVerify }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) return null;

  const handleDisconnect = () => {
    disconnect();
    if (onDisconnect) onDisconnect();
  };

  return (
    <div className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-green-900">Wallet Connected</p>
        <p className="text-xs text-green-700">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {onVerify && (
          <button
            onClick={() => onVerify(address)}
            className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
          >
            Verify NFTs
          </button>
        )}
        <button
          onClick={handleDisconnect}
          className="text-xs text-green-600 hover:text-green-700"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

// Web3 Access Gate (Enhanced Version)
export const Web3AccessGate = ({ onEmailSignUp, onEmailSignIn }) => {
  const [showWeb3Modal, setShowWeb3Modal] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const { isConnected, address } = useAccount();

  const handleVerificationComplete = (result) => {
    setVerificationComplete(true);
    if (result.verified) {
      // Handle successful verification
      console.log('NFT verification successful:', result);
    }
  };

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Help the Algorithm Learn
          </h3>
          <p className="text-gray-600 mb-6">
            Unlock emotional feedback by verifying your identity. Choose from email 
            verification or Web3 NFT authentication.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Email Authentication */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Email Verification</h4>
              <p className="text-sm text-gray-600 mb-4">
                Quick and secure email-based authentication
              </p>
              <button
                onClick={onEmailSignUp}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Sign Up with Email
              </button>
            </div>
            
            {/* Web3 Authentication */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Web3 Authentication</h4>
              <p className="text-sm text-gray-600 mb-4">
                Connect wallet & verify NFT ownership
              </p>
              <button
                onClick={() => setShowWeb3Modal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors text-sm"
              >
                Connect Wallet
              </button>
            </div>
          </div>

          {/* Connected Wallet Status */}
          {isConnected && (
            <div className="mb-4">
              <ConnectedWallet />
              
              {/* NFT Verification */}
              <div className="mt-4">
                <NFTVerification 
                  walletAddress={address}
                  onVerificationComplete={handleVerificationComplete}
                />
              </div>
            </div>
          )}
          
          <div className="text-center">
            <button
              onClick={onEmailSignIn}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Web3 Connection Modal */}
      <Web3Modal
        isOpen={showWeb3Modal}
        onClose={() => setShowWeb3Modal(false)}
      />
    </>
  );
};