import React, { useState, useEffect } from 'react';
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
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState(null);
  const [responseDebugData, setResponseDebugData] = useState(null);

  // Map icons to emotion options
  const iconMap = {
    hope: Sparkles,
    confidence: ThumbsUp,
    breakthrough: Zap,
    healing: Heart,
    tension: AlertTriangle,
    uncertainty: HelpCircle
  };

  // Get user identifier for duplicate checking
  const getUserIdentifier = () => {
    return clerkUser?.id || clerkUser?.emailAddresses?.[0]?.emailAddress || walletAddress;
  };

  // Check for existing feedback on mount
  useEffect(() => {
    const checkExistingFeedback = async () => {
      if (!hasAnyAccess || !articleId) return;
      
      const userIdentifier = getUserIdentifier();
      if (!userIdentifier) return;

      setIsCheckingDuplicate(true);
      try {
        const response = await fetch(`${API_BASE}/api/feedback/check?article_id=${articleId}&user_id=${encodeURIComponent(userIdentifier)}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Duplicate check response:', data);
          
          if (data.has_submitted && data.feedback) {
            setAlreadySubmitted(true);
            setPreviousFeedback(data.feedback);
            setSelectedEmotion(data.feedback.emotion);
          }
        } else {
          console.log('Duplicate check failed:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error checking existing feedback:', error);
      } finally {
        setIsCheckingDuplicate(false);
      }
    };

    checkExistingFeedback();
  }, [articleId, hasAnyAccess, clerkUser, walletAddress]);

  const handleSubmit = async (emotion) => {
    if (!hasAnyAccess || alreadySubmitted) return;

    setIsSubmitting(true);
    try {
      // Determine access type and user identifier
      const accessType = hasNFTAccess ? 'nft_verified' : 'email_verified';
      const userIdentifier = clerkUser?.emailAddresses?.[0]?.emailAddress || walletAddress;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting feedback:', { articleId, emotion, hasUser: Boolean(userIdentifier), accessType });
      }
      
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

      let data;
      let responseText = '';
      
      try {
        responseText = await response.text();
        if (process.env.NODE_ENV === 'development') {
          console.log('Raw response received');
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.log('Response is not valid JSON, treating as string:', responseText);
        data = { message: responseText };
      }
      
      // Store debug data for display
      setResponseDebugData({ 
        status: response.status, 
        ok: response.ok, 
        data: data,
        rawResponse: responseText 
      });

      // Improved success condition: HTTP 200 AND (data.success === true OR response contains "successfully")
      const isSuccess = response.ok && (
        data.success === true || 
        (typeof data.message === 'string' && data.message.toLowerCase().includes('successfully')) ||
        (typeof responseText === 'string' && responseText.toLowerCase().includes('successfully'))
      );

      console.log('Success check:', { 
        responseOk: response.ok, 
        dataSuccess: data.success, 
        messageIncludes: data.message?.toLowerCase().includes('successfully'),
        finalSuccess: isSuccess 
      });

      if (isSuccess) {
        setSubmitted(true);
        setSelectedEmotion(emotion);
        
        // Pass algorithm influence data to parent component
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted({
            emotion,
            algorithmInfluenced: data.algorithm_influenced || true,
            influenceWeight: data.influence_weight || 1.0,
            accessType: data.access_type || accessType
          });
        }
        
        console.log('Feedback submitted successfully!');
      } else {
        console.error('Failed to submit feedback:', {
          status: response.status,
          message: data.message || 'Unknown error',
          data: data
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setResponseDebugData({ error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasAnyAccess) {
    return null; // This should be handled by AccessGate
  }

  // Show loading state while checking for duplicates
  if (isCheckingDuplicate) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <motion.div
          className="w-6 h-6 mx-auto mb-3 border-2 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600">Checking your previous feedback...</p>
      </div>
    );
  }

  // Show already submitted state
  if (alreadySubmitted && previousFeedback) {
    const selectedEmotionData = emotionOptions.find(e => e.key === previousFeedback.emotion);
    const IconComponent = iconMap[previousFeedback.emotion] || Heart;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center"
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
        
        <div className="text-4xl mb-3">💭</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          You've Already Shared Your Thoughts
        </h3>
        <p className="text-gray-600 mb-4">
          You previously responded with <span className="font-semibold capitalize">{previousFeedback.emotion}</span> 
          {previousFeedback.timestamp && (
            <span className="text-sm text-gray-500 block mt-1">
              on {new Date(previousFeedback.timestamp).toLocaleDateString()}
            </span>
          )}
        </p>
        <div className="bg-white rounded-lg p-3 inline-block">
          <p className="text-sm text-gray-500">
            🧠 Your feedback has already influenced the algorithm
          </p>
        </div>
        <div className="mt-4 text-sm text-blue-600">
          <p>✓ One emotional response per article ensures authentic feedback</p>
          <p>✓ Your influence contributes to the algorithm's evolution</p>
        </div>
      </motion.div>
    );
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
        
        {/* Debug section for response data */}
        {responseDebugData && (
          <details className="mt-4 text-xs text-gray-400">
            <summary className="cursor-pointer">Debug Response Data</summary>
            <pre className="mt-2 p-2 bg-gray-50 rounded text-left overflow-auto max-h-32">
              {JSON.stringify(responseDebugData, null, 2)}
            </pre>
          </details>
        )}
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