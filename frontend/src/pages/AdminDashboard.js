import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Palette, BarChart3, Users, Lock, Eye, EyeOff, Save, Plus, X, Download } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('articles');
  const [loading, setLoading] = useState(false);
  const [articlesList, setArticlesList] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState(new Set());
  
  // Article form state
  const [articleForm, setArticleForm] = useState({
    title: '',
    subspecialty: 'sportsMedicine',
    content: '',
    evidenceStrength: 0.5,
    researchCitations: 0,
    metaDescription: ''
  });

  // Infographic form state
  const [infographicForm, setInfographicForm] = useState({
    htmlContent: '',
    linkedArticleId: '',
    title: ''
  });

  // SVG artwork form state
  const [artworkForm, setArtworkForm] = useState({
    svgFile: null,
    title: '',
    emotionalSignature: {
      dominantEmotion: 'confidence',
      intensity: 0.5,
      rarityScore: 0.5
    }
  });

  const [articles, setArticles] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalArtworks: 0,
    algorithmState: null
  });

  const subspecialties = [
    { value: 'sportsMedicine', label: 'Sports Medicine' },
    { value: 'jointReplacement', label: 'Joint Replacement' },
    { value: 'trauma', label: 'Trauma' },
    { value: 'spine', label: 'Spine' },
    { value: 'handUpperExtremity', label: 'Hand & Upper Extremity' },
    { value: 'footAnkle', label: 'Foot & Ankle' },
    { value: 'shoulderElbow', label: 'Shoulder & Elbow' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'oncology', label: 'Oncology' }
  ];

  const emotions = [
    { value: 'hope', label: 'Hope' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'breakthrough', label: 'Breakthrough' },
    { value: 'healing', label: 'Healing' },
    { value: 'tension', label: 'Tension' },
    { value: 'uncertainty', label: 'Uncertainty' }
  ];

  // Add this function to fetch articles with admin details
  const fetchArticlesAdmin = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/articles`);
      if (response.ok) {
        const data = await response.json();
        setArticlesList(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching admin articles:', error);
    }
  };

  // Add this function to delete articles
  const handleDeleteArticle = async (articleId, articleTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"? This will also delete associated artworks and feedback.`)) {
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE}/api/admin/articles/${articleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Article deleted successfully!');
        fetchArticlesAdmin(); // Refresh the list
        fetchDashboardData(); // Refresh stats
      } else {
        const error = await response.json();
        alert(`Failed to delete article: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  // Add this function to fix algorithm state count
  const handleRecalculateAlgorithmState = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/recalculate-algorithm-state`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Algorithm state recalculated! Articles processed: ${result.articles_processed}`);
        fetchDashboardData(); // Refresh stats
      } else {
        alert('Failed to recalculate algorithm state');
      }
    } catch (error) {
      console.error('Error recalculating algorithm state:', error);
      alert('Error recalculating algorithm state');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const authToken = sessionStorage.getItem('admin_authenticated');
    if (authToken === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
      fetchArticlesAdmin(); // Add this line for admin details
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/admin/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        fetchDashboardData();
        setPassword('');
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [articlesRes, artworksRes, stateRes] = await Promise.all([
        fetch(`${API_BASE}/api/articles`),
        fetch(`${API_BASE}/api/artworks`),
        fetch(`${API_BASE}/api/algorithm-state`)
      ]);

      const articlesData = await articlesRes.json();
      const artworksData = await artworksRes.json();
      const stateData = await stateRes.json();

      setArticles(articlesData.articles || []);
      setArtworks(artworksData.artworks || []);
      setStats({
        totalArticles: articlesData.articles?.length || 0,
        totalArtworks: artworksData.artworks?.length || 0,
        algorithmState: stateData
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleForm)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Article created successfully! ID: ${result.article.id}`);
        setArticleForm({
          title: '',
          subspecialty: 'sportsMedicine',
          content: '',
          evidenceStrength: 0.5,
          researchCitations: 0,
          metaDescription: ''
        });
        fetchDashboardData();
      } else {
        alert('Failed to create article');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article');
    } finally {
      setLoading(false);
    }
  };

  const handleInfographicSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/admin/infographics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(infographicForm)
      });

      if (response.ok) {
        alert('Infographic uploaded successfully!');
        setInfographicForm({
          htmlContent: '',
          linkedArticleId: '',
          title: ''
        });
      } else {
        alert('Failed to upload infographic');
      }
    } catch (error) {
      console.error('Error uploading infographic:', error);
      alert('Error uploading infographic');
    } finally {
      setLoading(false);
    }
  };

  const handleArtworkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('svgFile', artworkForm.svgFile);
      formData.append('title', artworkForm.title);
      formData.append('emotionalSignature', JSON.stringify(artworkForm.emotionalSignature));

      const response = await fetch(`${API_BASE}/api/admin/artworks`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Artwork uploaded successfully!');
        setArtworkForm({
          svgFile: null,
          title: '',
          emotionalSignature: {
            dominantEmotion: 'confidence',
            intensity: 0.5,
            rarityScore: 0.5
          }
        });
        fetchDashboardData();
      } else {
        alert('Failed to upload artwork');
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
      alert('Error uploading artwork');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="relative mb-6">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Admin Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'manage', label: 'Manage Content', icon: Users }, // New tab
    { id: 'infographics', label: 'Infographics', icon: BarChart3 },
    { id: 'artworks', label: 'Artworks', icon: Palette },
    { id: 'analytics', label: 'Analytics', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Arthrokinetix Admin</h1>
              <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Authenticated
              </span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Lock className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Palette className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Artworks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArtworks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Algorithm State</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {stats.algorithmState?.emotional_state?.dominant_emotion || 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Processing Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((stats.algorithmState?.emotional_state?.emotional_intensity || 0) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
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

          <div className="p-6">
            {/* Articles Tab */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Article</h2>
                
                <form onSubmit={handleArticleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Article Title
                      </label>
                      <input
                        type="text"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subspecialty
                      </label>
                      <select
                        value={articleForm.subspecialty}
                        onChange={(e) => setArticleForm({ ...articleForm, subspecialty: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        {subspecialties.map((sub) => (
                          <option key={sub.value} value={sub.value}>
                            {sub.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article Content
                    </label>
                    <textarea
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="Enter the full article content..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Evidence Strength: {Math.round(articleForm.evidenceStrength * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={articleForm.evidenceStrength}
                        onChange={(e) => setArticleForm({ ...articleForm, evidenceStrength: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Research Citations
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={articleForm.researchCitations}
                        onChange={(e) => setArticleForm({ ...articleForm, researchCitations: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <input
                        type="text"
                        value={articleForm.metaDescription}
                        onChange={(e) => setArticleForm({ ...articleForm, metaDescription: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="SEO description..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    Create Article & Generate Art
                  </button>
                </form>

                {/* Recent Articles */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
                  <div className="space-y-3">
                    {articles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{article.title}</h4>
                          <p className="text-sm text-gray-500 capitalize">
                            {article.subspecialty?.replace(/([A-Z])/g, ' $1')} • 
                            {article.emotional_data?.dominant_emotion} emotion
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            ID: {article.id?.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
                  <button
                    onClick={handleRecalculateAlgorithmState}
                    className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Fix Algorithm Count
                    </button>
                </div>
    
                {/* Articles Management */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles ({articlesList.length})</h3>
      
                  {articlesList.length === 0 ? (
                    <p className="text-gray-500">No articles created yet.</p>
                  ) : (
                  <div className="space-y-3">
                      {articlesList.map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{article.title}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>ID: {article.id?.slice(0, 8)}...</span>
                              <span className="capitalize">{article.subspecialty?.replace(/([A-Z])/g, ' $1')}</span>
                              <span>Emotion: {article.emotional_data?.dominant_emotion}</span>
                              <span>Artworks: {article.artwork_count || 0}</span>
                              <span>Feedback: {article.feedback_count || 0}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Evidence: {Math.round((article.evidence_strength || 0) * 100)}%
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                Signature: {article.signature_data?.id}
                              </span>
                            </div>
                          </div>
              
                          <div className="flex items-center space-x-2">
                            <a
                              href={`https://arthrokinetix.vercel.app/research/${article.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </a>
                            <button
                              onClick={() => handleDeleteArticle(article.id, article.title)}
                              className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Database Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Health</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Articles:</span>
                        <span className="font-medium">{stats.totalArticles}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Artworks:</span>
                        <span className="font-medium">{stats.totalArtworks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Algorithm Processed:</span>
                        <span className="font-medium">{stats.algorithmState?.articles_processed || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm State</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Dominant Emotion:</span>
                        <span className="font-medium capitalize">{stats.algorithmState?.emotional_state?.dominant_emotion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Intensity:</span>
                        <span className="font-medium">{Math.round((stats.algorithmState?.emotional_state?.emotional_intensity || 0) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shape:</span>
                        <span className="font-medium capitalize">{stats.algorithmState?.visual_representation?.shape}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button 
                        onClick={fetchDashboardData}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        🔄 Refresh Stats
                      </button>
                      <button 
                        onClick={fetchArticlesAdmin}
                        className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        📊 Refresh Articles
                      </button>
                      <a
                        href="https://cloud.mongodb.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      >
                        🍃 MongoDB Atlas
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Infographics Tab */}
            {activeTab === 'infographics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Upload Infographic</h2>
                
                <form onSubmit={handleInfographicSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Infographic Title
                      </label>
                      <input
                        type="text"
                        value={infographicForm.title}
                        onChange={(e) => setInfographicForm({ ...infographicForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Linked Article ID
                      </label>
                      <select
                        value={infographicForm.linkedArticleId}
                        onChange={(e) => setInfographicForm({ ...infographicForm, linkedArticleId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select an article...</option>
                        {articles.map((article) => (
                          <option key={article.id} value={article.id}>
                            {article.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML/CSS Content
                    </label>
                    <textarea
                      value={infographicForm.htmlContent}
                      onChange={(e) => setInfographicForm({ ...infographicForm, htmlContent: e.target.value })}
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary font-mono text-sm"
                      placeholder="<div>Your infographic HTML/CSS code here...</div>"
                      required
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Preview
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <Upload className="w-5 h-5 mr-2" />
                      )}
                      Upload Infographic
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Artworks Tab */}
            {activeTab === 'artworks' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Upload SVG Artwork</h2>
                
                <form onSubmit={handleArtworkSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Artwork Title
                      </label>
                      <input
                        type="text"
                        value={artworkForm.title}
                        onChange={(e) => setArtworkForm({ ...artworkForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SVG File
                      </label>
                      <input
                        type="file"
                        accept=".svg"
                        onChange={(e) => setArtworkForm({ ...artworkForm, svgFile: e.target.files[0] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dominant Emotion
                      </label>
                      <select
                        value={artworkForm.emotionalSignature.dominantEmotion}
                        onChange={(e) => setArtworkForm({
                          ...artworkForm,
                          emotionalSignature: {
                            ...artworkForm.emotionalSignature,
                            dominantEmotion: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        {emotions.map((emotion) => (
                          <option key={emotion.value} value={emotion.value}>
                            {emotion.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intensity: {Math.round(artworkForm.emotionalSignature.intensity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={artworkForm.emotionalSignature.intensity}
                        onChange={(e) => setArtworkForm({
                          ...artworkForm,
                          emotionalSignature: {
                            ...artworkForm.emotionalSignature,
                            intensity: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rarity Score: {Math.round(artworkForm.emotionalSignature.rarityScore * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={artworkForm.emotionalSignature.rarityScore}
                        onChange={(e) => setArtworkForm({
                          ...artworkForm,
                          emotionalSignature: {
                            ...artworkForm.emotionalSignature,
                            rarityScore: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Upload className="w-5 h-5 mr-2" />
                    )}
                    Upload Artwork
                  </button>
                </form>

                {/* Recent Artworks */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Artworks</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artworks.slice(0, 6).map((artwork) => (
                      <div key={artwork.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center">
                          <Palette className="w-8 h-8 text-gray-500" />
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{artwork.title}</h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {artwork.dominant_emotion} • {artwork.subspecialty?.replace(/([A-Z])/g, ' $1')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Evolution</h3>
                    {stats.algorithmState && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Current State:</span>
                          <span className="font-medium capitalize">
                            {stats.algorithmState.emotional_state.dominant_emotion}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Intensity:</span>
                          <span className="font-medium">
                            {Math.round(stats.algorithmState.emotional_state.emotional_intensity * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Articles Processed:</span>
                          <span className="font-medium">{stats.algorithmState.articles_processed}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Distribution</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Articles:</span>
                        <span className="font-medium">{stats.totalArticles}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Artworks:</span>
                        <span className="font-medium">{stats.totalArtworks}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Art/Article Ratio:</span>
                        <span className="font-medium">
                          {stats.totalArticles > 0 ? (stats.totalArtworks / stats.totalArticles).toFixed(2) : '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
                  <div className="flex space-x-4">
                    <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="w-5 h-5 mr-2" />
                      Export Articles
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="w-5 h-5 mr-2" />
                      Export Artworks
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="w-5 h-5 mr-2" />
                      Export Analytics
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
