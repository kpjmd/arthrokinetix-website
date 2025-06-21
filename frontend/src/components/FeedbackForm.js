import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsUp, Zap, HelpCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { useUser } from '../hooks/useAuth';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const FeedbackForm = ({ articleId, onFeedbackSubmitted }) => {
  const { user } = useUser();
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emotionOptions = [
    { 
      key: 'hope', 
      label: 'Hope', 
      icon: Sparkles, 
      color: '#27ae60',
      description: 'This content gives me hope for medical advancement'
    },
    { 
      key: 'confidence', 
      label: 'Confidence', 
      icon: ThumbsUp, 
      color: '#3498db',
      description: 'I feel confident about these medical findings'
    },
    { 
      key: 'breakthrough', 
      label: 'Breakthrough', 
      icon: Zap, 
      color: '#f39c12',
      description: 'This feels like a significant medical breakthrough'
    },
    { 
      key: 'healing', 
      label: 'Healing', 
      icon: Heart, 
      color: '#16a085',
      description: 'This content emphasizes healing and recovery'
    },
    { 
      key: 'tension', 
      label: 'Tension', 
      icon: AlertTriangle, 
      color: '#e74c3c',
      description: 'I sense complexity or challenges in this content'
    },
    { 
      key: 'uncertainty', 
      label: 'Uncertainty', 
      icon: HelpCircle, 
      color: '#95a5a6',
      description: 'This content raises questions that need more research'
    }
  ];

  const handleSubmit = async (emotion) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          emotion: emotion,
          user_email: user.emailAddresses[0].emailAddress,
          clerk_user_id: user.id,
          access_type: 'email_verified'
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setSelectedEmotion(emotion);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(emotion);
        }
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // This should be handled by AccessGate
  }

  if (submitted) {
    const selectedEmotionData = emotionOptions.find(e => e.key === selectedEmotion);
    const IconComponent = selectedEmotionData?.icon || Heart;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
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
        
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Thank You for Your Feedback!
        </h3>
        <p className="text-green-700 mb-4">
          Your <span className="font-medium capitalize">{selectedEmotion}</span> emotion 
          has been recorded and will help evolve the algorithm.
        </p>
        <div className="text-sm text-green-600">
          <p>✓ Feedback submitted as verified user</p>
          <p>✓ Algorithm state updated</p>
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
          const IconComponent = emotion.icon;
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
        <p>
          ✓ Signed in as {user.firstName || user.emailAddresses[0].emailAddress}
        </p>
      </div>
    </div>
  );
};

export default FeedbackForm;