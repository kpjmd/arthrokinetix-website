import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ExternalLink, Info, Star, Shield } from 'lucide-react';

const NFTMintButton = ({ artwork, className = '', size = 'default' }) => {
  const [showMintInfo, setShowMintInfo] = useState(false);

  // Contract addresses for Base L2
  const contracts = {
    erc721: "0xb976c398291fb99d507551d1a01b5bfcc7823d51", // Unique pieces
    erc1155: "0xc6ac80da15ede865e11c0858354cf553ab9d0a37" // Edition pieces
  };

  // Determine contract type based on rarity score
  const getContractInfo = (artwork) => {
    const rarityScore = artwork?.metadata?.rarity_score || 0;
    const isUnique = rarityScore > 0.8;
    
    return {
      contract: isUnique ? contracts.erc721 : contracts.erc1155,
      type: isUnique ? 'ERC721' : 'ERC1155',
      label: isUnique ? 'Unique' : 'Edition',
      description: isUnique 
        ? 'One-of-a-kind NFT with exclusive ownership rights'
        : 'Limited edition NFT with multiple copies available'
    };
  };

  const contractInfo = getContractInfo(artwork);
  const manifoldURL = `https://manifold.xyz/${contractInfo.contract}`;

  const handleMintClick = () => {
    // Open Manifold in new tab
    window.open(manifoldURL, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    default: 'w-5 h-5', 
    large: 'w-6 h-6'
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleMintClick}
        onMouseEnter={() => setShowMintInfo(true)}
        onMouseLeave={() => setShowMintInfo(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 
          bg-gradient-to-r from-purple-600 to-pink-600 
          text-white font-semibold rounded-lg 
          hover:from-purple-700 hover:to-pink-700 
          transition-all transform hover:shadow-lg
          ${sizeClasses[size]} ${className}
        `}
        title={`Mint NFT on Base L2 (${contractInfo.type})`}
      >
        <Zap className={iconSizes[size]} />
        Mint NFT
        <ExternalLink className={`${iconSizes[size]} opacity-70`} />
      </motion.button>

      {/* Hover Info Tooltip */}
      {showMintInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-black text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3 h-3" />
              <span className="font-medium">{contractInfo.type} • Base L2</span>
            </div>
            <div className="text-xs opacity-90">
              {contractInfo.label} • Low gas fees
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// NFT Information Panel Component
export const NFTInfoPanel = ({ artwork }) => {
  if (!artwork) return null;

  const rarityScore = artwork?.metadata?.rarity_score || 0;
  const isUnique = rarityScore > 0.8;
  const contractType = isUnique ? 'ERC721' : 'ERC1155';
  const contractAddress = isUnique 
    ? "0xb976c398291fb99d507551d1a01b5bfcc7823d51"
    : "0xc6ac80da15ede865e11c0858354cf553ab9d0a37";

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">NFT Details</h3>
          <p className="text-sm text-gray-600">Mint this artwork as an NFT on Base L2</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Contract Type:</span>
            <span className="font-medium flex items-center gap-1">
              {contractType}
              {isUnique && <Star className="w-3 h-3 text-yellow-500" />}
              <span className="text-xs text-gray-500">
                ({isUnique ? 'Unique' : 'Edition'})
              </span>
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium text-blue-600">Base L2</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Gas Fees:</span>
            <span className="font-medium text-green-600">~$0.01</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Rarity Score:</span>
            <span className="font-medium">
              {Math.round(rarityScore * 100)}%
              {rarityScore > 0.8 && <span className="text-yellow-600 ml-1">⭐ Rare</span>}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Algorithm Version:</span>
            <span className="font-medium">v2.0</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Emotion:</span>
            <span className="font-medium capitalize">
              {artwork.dominant_emotion || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white/50 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700">
            <p className="font-medium mb-1">Contract Address:</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
              {contractAddress}
            </code>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <NFTMintButton artwork={artwork} size="default" />
        <p className="text-xs text-gray-500 mt-2">
          Powered by Manifold • Secured on Base L2
        </p>
      </div>
    </div>
  );
};

export default NFTMintButton;