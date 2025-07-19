import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Award, Archive, BarChart3, Settings, Download, Shield, Wallet, ExternalLink } from 'lucide-react';
import { useAuthenticationAccess } from '../hooks/useAuth';
import SignatureCollection from '../components/SignatureCollection';
import Web3Integration from '../components/Web3Integration';
import { AuthModal } from '../components/AuthComponents';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const UserProfile = () => {
  const { 
    hasEmailAccess, 
    hasNFTAccess, 
    hasAnyAccess, 
    clerkUser, 
    walletAddress, 
    walletConnected, 
    nftVerification, 
    authenticationMethods,
    isLoaded 
  } = useAuthenticationAccess();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('sign-up');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'collection', label: 'Signature Collection', icon: Archive },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'wallets', label: 'Connected Wallets', icon: Wallet }
  ];

  useEffect(() => {
    if (isLoaded && hasEmailAccess && clerkUser) {
      const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
      if (userEmail) {
        checkSubscriptionStatus(userEmail);
        fetchUserStats(userEmail);
      }
    }
  }, [isLoaded, hasEmailAccess, clerkUser]);

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

  const handleSignUp = () => {
    setAuthMode('sign-up');
    setShowAuthModal(true);
  };
  
  const handleSignIn = () => {
    setAuthMode('sign-in');
    setShowAuthModal(true);
  };

  if (!isLoaded) {
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

  if (!hasAnyAccess) {
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
                  <button
                    onClick={handleSignUp}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up with Email
                  </button>
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
              {clerkUser?.firstName || clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Arthrokinetix User'}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-blue-100">
              {authenticationMethods.email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Verified
                </div>
              )}
              
              {authenticationMethods.web3 && (
                <div className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  NFT Holder
                </div>
              )}
              
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                {authenticationMethods.email ? 'Email Member' : 'Web3 Member'}
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
                  <div className="text-gray-900">{clerkUser?.emailAddresses?.[0]?.emailAddress || 'Not provided'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                  <div className="text-gray-900">
                    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Methods</label>
                  <div className="flex gap-2">
                    {authenticationMethods.email && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Email
                      </span>
                    )}
                    {authenticationMethods.web3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Web3
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <div className="text-gray-900">
                    {hasNFTAccess && hasEmailAccess ? 'Premium (Email + NFT)' : 
                     hasNFTAccess ? 'NFT Holder' : 
                     hasEmailAccess ? 'Email Verified' : 'Basic'}
                  </div>
                </div>
              </div>
            </div>

            {/* Access Features */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-6">Your Access</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border-2 ${
                  hasAnyAccess ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center mb-3">
                    <Archive className="w-6 h-6 mr-3 text-secondary" />
                    <h4 className="font-semibold">Emotional Feedback</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Provide feedback that influences the algorithm's emotional understanding.
                  </p>
                  <div className={`text-sm font-medium ${
                    hasAnyAccess ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {hasAnyAccess ? '✓ Unlocked' : '✗ Requires Authentication'}
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  hasNFTAccess ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center mb-3">
                    <BarChart3 className="w-6 h-6 mr-3 text-innovation" />
                    <h4 className="font-semibold">Premium Algorithm Influence</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Enhanced feedback weight and exclusive algorithm features for NFT holders.
                  </p>
                  <div className={`text-sm font-medium ${
                    hasNFTAccess ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {hasNFTAccess ? '✓ NFT Premium Access' : '✗ Requires NFT Ownership'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <SignatureCollection 
            userEmail={clerkUser?.emailAddresses?.[0]?.emailAddress}
            isSubscriber={hasAnyAccess}
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

        {/* Connected Wallets Tab */}
        {activeTab === 'wallets' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-6">Connected Wallets</h3>
              
              {walletConnected ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <h4 className="font-medium">Connected Wallet</h4>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        nftVerification?.verified ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {nftVerification?.verified ? 'NFT Verified' : 'No NFTs'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Address:</span> {walletAddress}
                      </div>
                      
                      {nftVerification?.verified && (
                        <div className="bg-purple-50 rounded-lg p-3 mt-3">
                          <h5 className="font-medium text-purple-900 mb-2">Your NFTs:</h5>
                          <ul className="space-y-1 text-purple-800">
                            {nftVerification.erc721_balance > 0 && (
                              <li>• ERC721 Tokens: {nftVerification.erc721_balance}</li>
                            )}
                            {nftVerification.erc1155_balance > 0 && (
                              <li>• ERC1155 Tokens: {nftVerification.erc1155_balance}</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3">
                        <a
                          href={`https://basescan.org/address/${walletAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                        >
                          View on BaseScan <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                        <button className="text-red-600 hover:text-red-700 text-sm">
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No Wallets Connected</h4>
                  <p className="text-gray-500 mb-6">
                    Connect your wallet to verify NFT ownership and access premium features.
                  </p>
                  <Web3Integration />
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-6">Account Settings</h3>
              
              <div className="space-y-6">
                {/* Authentication Methods */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Authentication Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium">Email Authentication</p>
                          <p className="text-sm text-gray-600">
                            {clerkUser?.emailAddresses?.[0]?.emailAddress || 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        authenticationMethods.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {authenticationMethods.email ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Wallet className="w-5 h-5 text-purple-600 mr-3" />
                        <div>
                          <p className="font-medium">Web3 Authentication</p>
                          <p className="text-sm text-gray-600">
                            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        authenticationMethods.web3 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {authenticationMethods.web3 ? 'NFT Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data Export */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Data Export</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Download your feedback history and interaction data.
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
                      Share feedback data for research
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </div>
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