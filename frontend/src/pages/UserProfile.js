import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Award, Archive, BarChart3, Settings, Download, Shield } from 'lucide-react';
import SignatureCollection from '../components/SignatureCollection';
import Web3Integration from '../components/Web3Integration';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'collection', label: 'Signature Collection', icon: Archive },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    // Check if user is logged in (newsletter subscriber or wallet connected)
    const subscriberEmail = localStorage.getItem('newsletter_email');
    const walletConnected = localStorage.getItem('wallet_connected');
    
    if (subscriberEmail || walletConnected) {
      setUser({
        email: subscriberEmail,
        walletConnected: walletConnected === 'true',
        joinDate: localStorage.getItem('join_date') || new Date().toISOString()
      });
      
      if (subscriberEmail) {
        checkSubscriptionStatus(subscriberEmail);
        fetchUserStats(subscriberEmail);
      }
    }
    
    setLoading(false);
  }, []);

  const checkSubscriptionStatus = async (email) => {
    try {
      const response = await fetch(`${API_BASE}/api/newsletter/status/${email}`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const fetchUserStats = async (email) => {
    try {
      const response = await fetch(`${API_BASE}/api/user/stats/${email}`);
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      } else {
        // Generate demo stats
        setUserStats(generateDemoStats());
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats(generateDemoStats());
    }
  };

  const handleNewsletterSignup = async (email) => {
    try {
      const response = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        localStorage.setItem('newsletter_email', email);
        localStorage.setItem('join_date', new Date().toISOString());
        setUser({ ...user, email });
        checkSubscriptionStatus(email);
        fetchUserStats(email);
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <User className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-primary mb-4">Join Arthrokinetix</h1>
            <p className="text-gray-600 mb-8">
              Create your profile to collect emotional signatures, track algorithm evolution, 
              and influence the future of medical research visualization.
            </p>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-xl font-semibold text-primary mb-6">Get Started</h2>
              
              <div className="space-y-6">
                {/* Newsletter Signup */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 text-secondary mr-3" />
                    <h3 className="font-semibold">Newsletter Subscription</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Subscribe to unlock signature collection and feedback features.
                  </p>
                  <NewsletterSignupForm onSignup={handleNewsletterSignup} />
                </div>

                {/* Web3 Connection */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-innovation mr-3" />
                    <h3 className="font-semibold">Web3 Access</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Connect your wallet for NFT verification and premium features.
                  </p>
                  <Web3Integration />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              {user.email ? user.email.split('@')[0] : 'Arthrokinetix User'}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-blue-100">
              {subscriptionStatus?.subscribed && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Newsletter Subscriber
                </div>
              )}
              
              {user.walletConnected && (
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Wallet Connected
                </div>
              )}
              
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Member since {formatDate(user.joinDate)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-6">Profile Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="text-gray-900">{user.email || 'Not provided'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="text-gray-900">{formatDate(user.joinDate)}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Status</label>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    subscriptionStatus?.subscribed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscriptionStatus?.subscribed ? 'Active Subscriber' : 'Not Subscribed'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <div className="text-gray-900">
                    {user.walletConnected && subscriptionStatus?.subscribed ? 'Premium' : 
                     subscriptionStatus?.subscribed ? 'Subscriber' : 'Basic'}
                  </div>
                </div>
              </div>
            </div>

            {/* Access Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-6">Your Access</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border-2 ${
                  subscriptionStatus?.subscribed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center mb-3">
                    <Collection className="w-6 h-6 mr-3 text-secondary" />
                    <h4 className="font-semibold">Signature Collection</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Collect and trade unique emotional signatures from research articles.
                  </p>
                  <div className={`text-sm font-medium ${
                    subscriptionStatus?.subscribed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {subscriptionStatus?.subscribed ? '✓ Unlocked' : '✗ Requires Subscription'}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  subscriptionStatus?.subscribed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center mb-3">
                    <BarChart3 className="w-6 h-6 mr-3 text-innovation" />
                    <h4 className="font-semibold">Algorithm Influence</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Submit feedback that influences the algorithm's emotional development.
                  </p>
                  <div className={`text-sm font-medium ${
                    subscriptionStatus?.subscribed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {subscriptionStatus?.subscribed ? '✓ Unlocked' : '✗ Requires Subscription'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <SignatureCollection 
            userEmail={user.email}
            isSubscriber={subscriptionStatus?.subscribed}
          />
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {userStats ? (
              <>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-primary mb-6">Your Impact</h3>
                  
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary mb-2">
                        {userStats.feedback_submitted}
                      </div>
                      <div className="text-gray-600">Feedback Submitted</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-innovation mb-2">
                        {userStats.signatures_collected}
                      </div>
                      <div className="text-gray-600">Signatures Collected</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-healing mb-2">
                        {userStats.articles_read}
                      </div>
                      <div className="text-gray-600">Articles Read</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">
                        {Math.round(userStats.influence_score * 100)}%
                      </div>
                      <div className="text-gray-600">Influence Score</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-primary mb-6">Algorithm Contributions</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(userStats.emotion_contributions).map(([emotion, count]) => (
                      <div key={emotion} className="flex items-center justify-between">
                        <span className="capitalize font-medium">{emotion} Feedback</span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-200 rounded mr-3">
                            <div 
                              className="h-full rounded"
                              style={{ 
                                width: `${(count / Math.max(...Object.values(userStats.emotion_contributions))) * 100}%`,
                                backgroundColor: getEmotionColor(emotion)
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Statistics Yet</h3>
                <p className="text-gray-500">
                  Start reading articles and submitting feedback to see your impact statistics.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-6">Account Settings</h3>
              
              <div className="space-y-6">
                {/* Newsletter Preferences */}
                {subscriptionStatus?.subscribed && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Newsletter Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        Algorithm updates and evolution reports
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        New article notifications
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        Rare signature alerts
                      </label>
                    </div>
                  </div>
                )}

                {/* Data Export */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Data Export</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Download your collected signatures and interaction history.
                  </p>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </button>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Privacy</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-3" />
                      Allow anonymous usage analytics
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      Public signature collection display
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

// Newsletter Signup Component
const NewsletterSignupForm = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await onSignup(email);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Joining...' : 'Join'}
      </button>
    </form>
  );
};

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const getEmotionColor = (emotion) => {
  const colors = {
    hope: '#27ae60',
    tension: '#e74c3c',
    confidence: '#3498db',
    uncertainty: '#95a5a6',
    breakthrough: '#f39c12',
    healing: '#16a085'
  };
  return colors[emotion] || '#3498db';
};

const generateDemoStats = () => ({
  feedback_submitted: 12,
  signatures_collected: 8,
  articles_read: 24,
  influence_score: 0.68,
  emotion_contributions: {
    hope: 5,
    confidence: 3,
    healing: 4,
    breakthrough: 0
  }
});

export default UserProfile;