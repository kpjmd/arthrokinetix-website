import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Palette, BarChart3, Users, Lock, Eye, EyeOff, Save, Plus, X, Download, File, FileType, HelpCircle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('articles');
  const [loading, setLoading] = useState(false);
  const [articlesList, setArticlesList] = useState([]);
  
  // Enhanced article form state for multiple content types
  const [articleForm, setArticleForm] = useState({
    title: '',
    subspecialty: 'sportsMedicine',
    contentType: 'text',  // 'text', 'html', 'pdf'
    content: '',
    evidenceStrength: 0.5,
    metaDescription: '',
    file: null
  });

  // File upload states
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

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

  const contentTypes = [
    { value: 'text', label: 'Text Input', description: 'Type or paste content directly' },
    { value: 'html', label: 'HTML File Upload', description: 'Upload HTML file for direct rendering and art generation' },
    { value: 'pdf', label: 'PDF Upload', description: 'Upload PDF for future algorithm parsing' }
  ];

  // Fetch articles with admin details
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

  // Delete article function
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
        fetchArticlesAdmin();
        fetchDashboardData();
      } else {
        const error = await response.json();
        alert(`Failed to delete article: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  // Recalculate algorithm state
  const handleRecalculateAlgorithmState = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/recalculate-algorithm-state`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Algorithm state recalculated! Articles processed: ${result.articles_processed}`);
        fetchDashboardData();
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
      fetchArticlesAdmin();
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
        fetchArticlesAdmin();
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

  // File handling functions
  const handleFileUpload = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = {
      'html': ['text/html', 'application/xhtml+xml'],
      'pdf': ['application/pdf']
    };

    const fileType = articleForm.contentType;
    if (fileType !== 'text' && !allowedTypes[fileType]?.includes(file.type)) {
      alert(`Please upload a valid ${fileType.toUpperCase()} file`);
      return;
    }

    setArticleForm(prev => ({ ...prev, file }));

    // Create preview for HTML files
    if (fileType === 'html' && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsText(file);
    } else {
      setFilePreview(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Enhanced article submission with file upload
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', articleForm.title);
      formData.append('subspecialty', articleForm.subspecialty);
      formData.append('content_type', articleForm.contentType);
      formData.append('evidence_strength', articleForm.evidenceStrength);
      
      if (articleForm.metaDescription) {
        formData.append('meta_description', articleForm.metaDescription);
      }

      // Handle content based on type
      if (articleForm.contentType === 'text') {
        formData.append('content', articleForm.content);
      } else if (articleForm.file) {
        formData.append('file', articleForm.file);
      } else {
        alert('Please provide content or upload a file');
        return;
      }

      const response = await fetch(`${API_BASE}/api/articles`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Article created successfully! ID: ${result.article.id}`);
        
        // Reset form
        setArticleForm({
          title: '',
          subspecialty: 'sportsMedicine',
          contentType: 'text',
          content: '',
          evidenceStrength: 0.5,
          metaDescription: '',
          file: null
        });
        setFilePreview(null);
        
        fetchDashboardData();
        fetchArticlesAdmin();
      } else {
        const error = await response.json();
        alert(`Failed to create article: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article');
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
    { id: 'articles', label: 'Create Content', icon: FileText },
    { id: 'manage', label: 'Manage Content', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
            {/* Enhanced Articles Tab with File Upload */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Medical Content</h2>
                
                <form onSubmit={handleArticleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Title
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

                  {/* Content Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Content Type
                    </label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {contentTypes.map((type) => (
                        <div
                          key={type.value}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            articleForm.contentType === type.value
                              ? 'border-primary bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => {
                            setArticleForm({ ...articleForm, contentType: type.value, file: null });
                            setFilePreview(null);
                          }}
                        >
                          <div className="flex items-center mb-2">
                            {type.value === 'text' && <FileText className="w-5 h-5 mr-2" />}
                            {type.value === 'html' && <File className="w-5 h-5 mr-2" />}
                            {type.value === 'pdf' && <FileType className="w-5 h-5 mr-2" />}
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Input Based on Type */}
                  {articleForm.contentType === 'text' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={articleForm.content}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        rows={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Enter the medical content..."
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Upload
                      </label>
                      
                      {/* Drag and Drop Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive 
                            ? 'border-primary bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-600 mb-2">
                          Drag and drop your {articleForm.contentType.toUpperCase()} file here
                        </p>
                        <p className="text-sm text-gray-500 mb-4">or</p>
                        <input
                          type="file"
                          accept={articleForm.contentType === 'html' ? '.html,.htm' : '.pdf'}
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </label>
                      </div>

                      {/* File Preview */}
                      {filePreview && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">File Preview:</h4>
                            <button
                              type="button"
                              onClick={() => {
                                setArticleForm({ ...articleForm, file: null });
                                setFilePreview(null);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {articleForm.contentType === 'html' && typeof filePreview === 'string' && filePreview.includes('<') ? (
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded p-4 bg-white">
                              <div dangerouslySetInnerHTML={{ __html: filePreview }} />
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">{filePreview}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
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
                    Create Content & Generate Art
                  </button>
                </form>

                {/* Recent Articles */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Content</h3>
                  <div className="space-y-3">
                    {articles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{article.title}</h4>
                          <p className="text-sm text-gray-500 capitalize">
                            {article.subspecialty?.replace(/([A-Z])/g, ' $1')} • 
                            {article.emotional_data?.dominant_emotion} emotion •
                            {article.content_type} content
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

            {/* Manage Tab */}
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
                              <span>Type: {article.content_type}</span>
                              <span>Artworks: {article.artwork_count || 0}</span>
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
                              href={`/research/${article.id}`}
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
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;