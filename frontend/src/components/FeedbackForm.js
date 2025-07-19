import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsUp, Zap, HelpCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuthenticationAccess } from '../hooks/useAuth';
import { emotionOptions } from '../constants/emotions';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const FeedbackForm = ({ articleId, onFeedbackSubmitted }) => {
  const { 
    hasAnyAccess, 
    clerkUser, 
    walletAddress, 
    authenticationMethods,
    hasNFTAccess 
  } = useAuthenticationAccess();
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Map icons to emotion options
  const iconMap = {
    hope: Sparkles,
    confidence: ThumbsUp,
    breakthrough: Zap,
    healing: Heart,
    tension: AlertTriangle,
    uncertainty: HelpCircle
  };

  const handleSubmit = async (emotion) => {
    if (!hasAnyAccess) return;

    setIsSubmitting(true);
    try {
      // Determine access type and user identifier
      const accessType = hasNFTAccess ? 'nft_verified' : 'email_verified';
      const userIdentifier = clerkUser?.emailAddresses?.[0]?.emailAddress || walletAddress;
      
      const response = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          emotion: emotion,
          user_email: clerkUser?.emailAddresses?.[0]?.emailAddress,
          wallet_address: walletAddress,
          clerk_user_id: clerkUser?.id,
          access_type: accessType,
          nft_verified: hasNFTAccess
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setSelectedEmotion(emotion);
        
        // Pass algorithm influence data to parent component
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted({
            emotion,
            algorithmInfluenced: data.algorithm_influenced,
            influenceWeight: data.influence_weight,
            accessType: data.access_type
          });
        }
      } else {
        console.error('Failed to submit feedback:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasAnyAccess) {
    return null; // This should be handled by AccessGate
  }

  if (submitted) {
    const selectedEmotionData = emotionOptions.find(e => e.key === selectedEmotion);
    const IconComponent = iconMap[selectedEmotion] || Heart;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${selectedEmotionData?.color}20` }}
        >
          <IconComponent 
            className="w-8 h-8" 
            style={{ color: selectedEmotionData?.color }}
          />
        </motion.div>
        
        <div className="text-4xl mb-3">✨</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Thank You! Algorithm Influenced
        </h3>
        <p className="text-gray-600 mb-4">
          Your <span className="font-semibold capitalize">{selectedEmotion}</span> feedback 
          has been integrated into the Arthrokinetix algorithm's emotional evolution.
        </p>
        <div className="bg-white rounded-lg p-3 inline-block">
          <p className="text-sm text-gray-500">
            🧠 Algorithm Learning: <span className="font-medium">+{selectedEmotion} influence</span>
          </p>
        </div>
        <div className="mt-4 text-sm text-green-600">
          <p>✓ Feedback submitted as verified user</p>
          <p>✓ Algorithm state updated in real-time</p>
          <p>✓ Your influence will shape future art generation</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Share Your Emotional Response
        </h3>
        <p className="text-gray-600">
          How does this medical content make you feel? Your feedback helps 
          evolve our algorithm's understanding.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {emotionOptions.map((emotion) => {
          const IconComponent = iconMap[emotion.key] || Heart;
          return (
            <motion.button
              key={emotion.key}
              onClick={() => handleSubmit(emotion.key)}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: selectedEmotion === emotion.key ? emotion.color : undefined,
                backgroundColor: selectedEmotion === emotion.key ? `${emotion.color}10` : undefined
              }}
            >
              <div className="text-center">
                <div 
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${emotion.color}20` }}
                >
                  <IconComponent 
                    className="w-6 h-6" 
                    style={{ color: emotion.color }}
                  />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {emotion.label}
                </h4>
                <p className="text-xs text-gray-500 leading-tight">
                  {emotion.description}
                </p>
              </div>
              
              {isSubmitting && (
                <motion.div
                  className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        <div className="space-y-1">
          {authenticationMethods.email && (
            <p>✓ Email verified: {clerkUser?.firstName || clerkUser?.emailAddresses?.[0]?.emailAddress}</p>
          )}
          {authenticationMethods.web3 && (
            <p>✓ NFT verified: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
          )}
          {hasNFTAccess && (
            <p className="text-purple-600 font-medium">🎨 Premium NFT Holder - Enhanced Algorithm Influence</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;