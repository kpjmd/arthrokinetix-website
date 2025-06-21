import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, Shield, Star, Check, X, ExternalLink } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const EnhancedWeb3Integration = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [hasNFT, setHasNFT] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Check NFT ownership when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      checkNFTOwnership(address);
    } else {
      setHasNFT(false);
      setNftData(null);
    }
  }, [isConnected, address]);

  const checkNFTOwnership = async (walletAddress) => {
    try {
      setLoading(true);
      
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
        setHasNFT(data.verified);
        setNftData(data);
      } else {
        console.error('NFT verification failed:', data);
        setHasNFT(false);
        setNftData(null);
      }
    } catch (error) {
      console.error('Error checking NFT ownership:', error);
      setHasNFT(false);
      setNftData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (connectors && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setHasNFT(false);
    setNftData(null);
  };

  if (!isConnected) {
    return (
      <motion.button
        onClick={handleConnect}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg"
      >
        <Wallet className="w-4 h-4" />
        <span className="font-medium">Connect Wallet</span>
      </motion.button>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ scale: 1.02 }}
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors shadow-lg ${
          hasNFT 
            ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100' 
            : 'bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${hasNFT ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <Wallet className="w-4 h-4" />
        </div>
        
        <div className="text-left">
          <div className="text-sm font-medium">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <div className="text-xs opacity-75">
            {loading ? 'Checking...' : hasNFT ? 'NFT Verified' : 'Connected'}
          </div>
        </div>

        {hasNFT && (
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-green-600" />
            <Star className="w-4 h-4 text-yellow-500" />
          </div>
        )}
      </motion.button>

      {/* Dropdown Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Wallet Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Wallet Address */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Address</div>
              <div className="font-mono text-sm break-all">{address}</div>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs flex items-center mt-2"
              >
                View on BaseScan <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* NFT Status */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${hasNFT ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="font-medium text-sm">NFT Verification</span>
              </div>
              
              {loading ? (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Checking NFT ownership...</span>
                </div>
              ) : hasNFT ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Verified NFT Owner</span>
                  </div>
                  
                  {nftData && (
                    <div className="text-xs text-green-700 space-y-1">
                      {nftData.erc721_balance > 0 && (
                        <div>• ERC721 Tokens: {nftData.erc721_balance}</div>
                      )}
                      {nftData.erc1155_balance > 0 && (
                        <div>• ERC1155 Tokens: {nftData.erc1155_balance}</div>
                      )}
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <span className="font-medium">✓ Feedback Access Granted</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-sm text-yellow-800">
                    No Arthrokinetix NFTs found in this wallet
                  </div>
                  <button
                    onClick={() => checkNFTOwnership(address)}
                    className="text-xs text-yellow-700 hover:text-yellow-800 mt-2 underline"
                  >
                    Re-check ownership
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => checkNFTOwnership(address)}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Refresh NFTs'}
              </button>
              <button
                onClick={handleDisconnect}
                className="bg-gray-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedWeb3Integration;