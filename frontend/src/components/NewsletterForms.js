import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Palette, FileText, Heart, Users, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser, SignedIn, SignedOut } from '../hooks/useAuth';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Base Newsletter Signup Component
const NewsletterSignup = ({ 
  title, 
  description, 
  icon: IconComponent = Mail, 
  iconColor = '#3498db',
  bgGradient = 'from-blue-50 to-indigo-50',
  borderColor = 'border-blue-200',
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'newsletter_form',
          preferences: {
            medical_content: true,
            algorithm_updates: true,
            nft_announcements: true
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center ${className}`}
      >
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-green-800 mb-2">Welcome to Arthrokinetix!</h3>
        <p className="text-green-700 text-sm">{message}</p>
        <div className="mt-4 text-xs text-green-600">
          <p>✓ Clinical evidence updates</p>
          <p>✓ Research insights and analysis</p>
          <p>✓ Professional community access</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r ${bgGradient} border ${borderColor} rounded-xl p-6 text-center ${className}`}
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" 
           style={{ backgroundColor: `${iconColor}20` }}>
        <IconComponent className="w-6 h-6" style={{ color: iconColor }} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        )}
      </form>
      
      <p className="text-xs text-gray-500 mt-4">
        Join medical professionals and researchers. Unsubscribe anytime.
      </p>
    </motion.div>
  );
};

// Homepage Newsletter Form
export const HeroNewsletterForm = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Zap className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">
        Join the Medical Art Revolution
      </h3>
      <p className="text-blue-100 leading-relaxed">
        Get weekly evidence-based medical content and see how it transforms into algorithmic art. 
        Be part of the community shaping the future of medical education and digital creativity.
      </p>
    </div>
    
    <SignedOut>
      <NewsletterSignup
        title=""
        description=""
        bgGradient="from-white/20 to-white/10"
        borderColor="border-white/30"
        iconColor="#ffffff"
        className="bg-white/10 border-white/20"
      />
    </SignedOut>
    
    <SignedIn>
      <div className="text-center text-white/80 py-6">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
        <p className="font-medium">You're already connected!</p>
        <p className="text-sm text-white/60 mt-2">
          Enjoy full access to feedback features and algorithm influence.
        </p>
      </div>
    </SignedIn>
  </div>
);

// Gallery Page Newsletter Form  
export const GalleryNewsletterForm = () => (
  <NewsletterSignup
    title="Never Miss New Algorithmic Artworks"
    description="Be the first to see new medical-inspired artworks and get early access to NFT drops. Join our community of collectors and medical professionals."
    icon={Palette}
    iconColor="#8b5cf6"
    bgGradient="from-purple-50 to-pink-50"
    borderColor="border-purple-200"
  />
);

// Articles Page Newsletter Form
export const ArticlesNewsletterForm = () => (
  <NewsletterSignup
    title="Clinical Evidence Updates"
    description="Join healthcare professionals receiving weekly evidence-based content, research insights, and opportunities to contribute clinical perspectives to our evolving platform."
    icon={FileText}
    iconColor="#2563eb"
    bgGradient="from-blue-50 to-cyan-50"
    borderColor="border-blue-200"
  />
);

// About Page Newsletter Form
export const AboutNewsletterForm = () => (
  <>
    <SignedOut>
      <NewsletterSignup
        title="Join the Arthrokinetix Community"
        description="Connect with healthcare professionals, researchers, and digital art enthusiasts. Get platform updates and exclusive insights into our algorithm's evolution."
        icon={Users}
        iconColor="#059669"
        bgGradient="from-emerald-50 to-teal-50"
        borderColor="border-emerald-200"
      />
    </SignedOut>
    
    <SignedIn>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-8 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-emerald-100">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-emerald-800 mb-3">You're already connected!</h3>
        <p className="text-emerald-700 mb-4">
          Welcome to the Arthrokinetix community! You have full access to provide feedback 
          that influences our algorithm's evolution and helps shape the future of medical art.
        </p>
        <div className="text-sm text-emerald-600 space-y-1">
          <p>✓ Algorithm feedback influence</p>
          <p>✓ Community member access</p>
          <p>✓ Platform updates included</p>
        </div>
      </motion.div>
    </SignedIn>
  </>
);

// Compact Newsletter Form (for sidebars, etc.)
export const CompactNewsletterForm = ({ variant = 'default' }) => {
  const variants = {
    default: {
      title: "Stay Connected",
      description: "Get updates on medical content and algorithmic art.",
      icon: Mail,
      iconColor: "#3498db"
    },
    medical: {
      title: "Medical Updates",
      description: "Evidence-based content delivered weekly.",
      icon: Heart,
      iconColor: "#e74c3c"
    },
    art: {
      title: "Art & NFT Updates", 
      description: "New artworks and minting opportunities.",
      icon: Palette,
      iconColor: "#9b59b6"
    }
  };

  const config = variants[variant];

  return (
    <NewsletterSignup
      title={config.title}
      description={config.description}
      icon={config.icon}
      iconColor={config.iconColor}
      className="max-w-sm"
    />
  );
};

export default NewsletterSignup;