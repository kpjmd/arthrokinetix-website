import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, Star } from 'lucide-react';

const Web3Integration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [hasNFT, setHasNFT] = useState(false);
  const [loading, setLoading] = useState(false);

  // Contract addresses for Arthrokinetix NFTs
  const MANIFOLD_ERC1155_CONTRACT = '0xc6ac80da15ede865e11c0858354cf553ab9d0a37';
  const MANIFOLD_ERC721_CONTRACT = '0xb976c398291fb99d507551d1a01b5bfcc7823d51';

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await checkNFTOwnership(accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet');
    }
  };

  const checkNFTOwnership = async (address) => {
    try {
      // This is a simplified check - in production you'd use proper Web3 libraries
      // For now, we'll simulate NFT checking
      
      // Simulate API call to check NFT ownership
      console.log(`Checking NFT ownership for ${address}`);
      
      // Mock NFT check (replace with actual contract calls)
      const mockHasNFT = Math.random() > 0.7; // 30% chance of having NFT for demo
      setHasNFT(mockHasNFT);
      
      if (mockHasNFT) {
        console.log('User has Arthrokinetix NFT - granting premium access');
      }
    } catch (error) {
      console.error('Error checking NFT ownership:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount('');
    setHasNFT(false);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            checkNFTOwnership(accounts[0]);
          }
        })
        .catch(console.error);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          checkNFTOwnership(accounts[0]);
        } else {
          disconnectWallet();
        }
      });
    }
  }, []);

  if (!isConnected) {
    return (
      <motion.button
        onClick={connectWallet}
        disabled={loading}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
          />
        ) : (
          <Wallet className="w-5 h-5 mr-2" />
        )}
        Connect Wallet
      </motion.button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* NFT Status Badge */}
      {hasNFT && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center px-3 py-1 bg-gradient-to-r from-innovation to-accent text-white rounded-full text-sm font-medium"
        >
          <Star className="w-4 h-4 mr-1" />
          Collector
        </motion.div>
      )}

      {/* Wallet Info */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg">
          <Shield className="w-4 h-4 text-green-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(account)}
          </span>
        </div>

        <button
          onClick={disconnectWallet}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Web3Integration;