import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Facebook, Mail, Zap, Copy, Check, X } from 'lucide-react';
import { SiBluesky } from 'react-icons/si';

const ShareButtons = ({ content, type = 'article', className = '' }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate sharing data based on content type
  const generateShareData = () => {
    const baseUrl = window.location.origin;
    
    if (type === 'article') {
      return {
        url: `${baseUrl}/articles/${content.id}`,
        title: content.title,
        text: `Evidence-based medical content: ${content.title}`,
        description: content.meta_description || `Discover this ${content.subspecialty?.replace(/([A-Z])/g, ' $1')} article featuring emotional analysis and algorithmic art generation.`,
        hashtags: ['Arthrokinetix', 'Medicine', 'EvidenceBased', content.subspecialty, content.emotional_data?.dominant_emotion],
        emailSubject: `Medical Article: ${content.title}`,
        emailBody: `I thought you'd find this medical content interesting:\n\n${content.title}\n\n${content.meta_description || 'Featuring evidence-based research with emotional analysis and algorithmic art generation.'}\n\nRead more: ${baseUrl}/articles/${content.id}\n\nShared via Arthrokinetix - Where medical content meets algorithmic art.`
      };
    } else {
      // Artwork sharing
      return {
        url: `${baseUrl}/gallery/${content.id}`,
        title: content.title,
        text: `Algorithmic art generated from medical research: ${content.title}`,
        description: `Discover this unique ${content.dominant_emotion} artwork generated from medical content analysis. Rarity: ${Math.round((content.metadata?.rarity_score || 0) * 100)}%`,
        hashtags: ['Arthrokinetix', 'GenerativeArt', 'MedicalArt', 'NFT', content.dominant_emotion, content.subspecialty],
        emailSubject: `Algorithmic Art: ${content.title}`,
        emailBody: `Check out this amazing algorithmic artwork:\n\n${content.title}\n\nGenerated from: ${content.subspecialty?.replace(/([A-Z])/g, ' $1')} medical content\nDominant Emotion: ${content.dominant_emotion}\nRarity Score: ${Math.round((content.metadata?.rarity_score || 0) * 100)}%\n\nView artwork: ${baseUrl}/gallery/${content.id}\n\nShared via Arthrokinetix - Where medical content meets algorithmic art.`
      };
    }
  };

  const shareData = generateShareData();

  const platforms = [
    {
      name: 'Twitter/X',
      icon: Twitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}&hashtags=${shareData.hashtags.filter(h => h).join(',')}`
    },
    {
      name: 'Farcaster',
      icon: Zap,
      color: '#855DCD',
      url: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`
    },
    {
      name: 'Bluesky',
      icon: SiBluesky,
      color: '#00BFFF',
      url: `https://bsky.app/intent/compose?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&description=${encodeURIComponent(shareData.description)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: '#34495e',
      url: `mailto:?subject=${encodeURIComponent(shareData.emailSubject)}&body=${encodeURIComponent(shareData.emailBody)}`
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handlePlatformShare = (platform) => {
    if (platform.name === 'Email') {
      window.location.href = platform.url;
    } else {
      window.open(platform.url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowShareModal(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 ${className}`}
        title="Share this content"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
      
      <AnimatePresence>
        {showShareModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              onClick={() => setShowShareModal(false)}
            >
              {/* Modal */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Share {type === 'article' ? 'Article' : 'Artwork'}
                  </h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content Preview */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {shareData.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {shareData.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {shareData.hashtags.filter(h => h).slice(0, 3).map((hashtag, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Platform Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {platforms.map((platform) => {
                    const IconComponent = platform.icon;
                    return (
                      <motion.button
                        key={platform.name}
                        onClick={() => handlePlatformShare(platform)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group min-h-[80px]"
                        style={{ '--platform-color': platform.color }}
                      >
                        <IconComponent 
                          className="w-6 h-6 mb-2 group-hover:text-[var(--platform-color)] transition-colors flex-shrink-0" 
                          style={{ color: platform.color }}
                        />
                        <span className="text-xs text-gray-700 text-center leading-tight">
                          {platform.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Copy Link Section */}
                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 min-w-0">
                      <p className="text-sm text-gray-600 truncate">
                        {shareData.url}
                      </p>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                        copySuccess 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButtons;