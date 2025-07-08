import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Palette, BarChart3, Users, Lock, Eye, EyeOff, Save, Plus, X, Download, File, FileType, HelpCircle, AlertTriangle, Activity, Database, RefreshCcw, Image as ImageIcon, Check } from 'lucide-react';

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
    metaDescription: '',
    file: null
  });

  // File upload states
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  
  // Multi-file upload states
  const [useMultiFileUpload, setUseMultiFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    html: null,
    images: []
  });
  const [imageMatchingStatus, setImageMatchingStatus] = useState(null);

  const [articles, setArticles] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalArtworks: 0,
    algorithmState: null
  });
  
  // Metadata analysis state
  const [metadataAnalysis, setMetadataAnalysis] = useState(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [selectedArtworks, setSelectedArtworks] = useState([]);
  const [downloadingBatch, setDownloadingBatch] = useState(false);
  
  // Image management state
  const [selectedArticleImages, setSelectedArticleImages] = useState(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

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
  
  // Fetch images for an article
  const fetchArticleImages = async (articleId) => {
    setLoadingImages(true);
    try {
      const response = await fetch(`${API_BASE}/api/articles/${articleId}/images`);
      if (response.ok) {
        const data = await response.json();
        setSelectedArticleImages(data);
        setImageModalOpen(true);
      } else {
        alert('Failed to fetch article images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Error fetching images');
    } finally {
      setLoadingImages(false);
    }
  };
  
  // Update cover image for an article
  const updateCoverImage = async (articleId, imageId) => {
    try {
      const response = await fetch(`${API_BASE}/api/articles/${articleId}/cover-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_id: imageId })
      });

      if (response.ok) {
        alert('Cover image updated successfully!');
        // Refresh the images to show the updated cover
        fetchArticleImages(articleId);
        fetchArticlesAdmin();
      } else {
        const error = await response.json();
        alert(`Failed to update cover image: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error updating cover image:', error);
      alert('Error updating cover image');
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
  
  // Fetch metadata analysis
  const fetchMetadataAnalysis = async () => {
    setLoadingMetadata(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/metadata-analysis`);
      if (response.ok) {
        const data = await response.json();
        setMetadataAnalysis(data);
      }
    } catch (error) {
      console.error('Error fetching metadata analysis:', error);
    } finally {
      setLoadingMetadata(false);
    }
  };
  
  // Download single artwork SVG
  const downloadArtworkSVG = async (artworkId, artworkTitle) => {
    try {
      const response = await fetch(`${API_BASE}/api/artworks/${artworkId}/download-svg`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${artworkId}_${artworkTitle || 'artwork'}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download SVG:', error);
      alert('Failed to download SVG');
    }
  };
  
  // Download multiple SVGs
  const downloadBatchSVGs = async () => {
    if (selectedArtworks.length === 0) {
      alert('Please select artworks to download');
      return;
    }
    
    setDownloadingBatch(true);
    try {
      for (const artwork of selectedArtworks) {
        await downloadArtworkSVG(artwork.id, artwork.title);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      alert(`Downloaded ${selectedArtworks.length} SVG files`);
      setSelectedArtworks([]);
    } catch (error) {
      console.error('Batch download failed:', error);
      alert('Some downloads failed');
    } finally {
      setDownloadingBatch(false);
    }
  };
  
  // Regenerate artwork with updated algorithm
  const handleRegenerateArtwork = async (artworkId, articleTitle) => {
    if (!window.confirm(`Regenerate artwork for "${articleTitle}"? This will update the artwork with the latest algorithm.`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/artworks/${artworkId}/regenerate`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Artwork regenerated successfully! New emotion: ${result.new_parameters.dominant_emotion}`);
        fetchDashboardData();
        fetchMetadataAnalysis();
      } else {
        const error = await response.json();
        alert(`Failed to regenerate artwork: ${error.detail}`);
      }
    } catch (error) {
      console.error('Error regenerating artwork:', error);
      alert('Error regenerating artwork');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const authToken = sessionStorage.getItem('admin_authenticated');
    if (authToken === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
      fetchArticlesAdmin();
      fetchMetadataAnalysis();
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
        fetchMetadataAnalysis();
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

  // Handle multi-file selection
  const handleMultiFileUpload = (files) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    const htmlFile = fileArray.find(f => f.name.toLowerCase().endsWith('.html') || f.name.toLowerCase().endsWith('.htm'));
    const imageFiles = fileArray.filter(f => {
      const ext = f.name.toLowerCase().split('.').pop();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
    });
    
    if (!htmlFile) {
      alert('Please include an HTML file');
      return;
    }
    
    setUploadedFiles({
      html: htmlFile,
      images: imageFiles
    });
    
    // Read HTML for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target.result);
    };
    reader.readAsText(htmlFile);
  };

  // Enhanced article submission with file upload
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Multi-file upload path
      if (useMultiFileUpload && uploadedFiles.html) {
        const formData = new FormData();
        formData.append('title', articleForm.title);
        formData.append('subspecialty', articleForm.subspecialty);
        formData.append('evidence_strength', '0.5');
        
        if (articleForm.metaDescription) {
          formData.append('meta_description', articleForm.metaDescription);
        }
        
        // Add HTML file first
        formData.append('files', uploadedFiles.html);
        
        // Add all image files
        uploadedFiles.images.forEach(img => {
          formData.append('files', img);
        });
        
        const response = await fetch(`${API_BASE}/api/articles/multi-upload`, {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Show image matching results
          if (data.image_processing) {
            setImageMatchingStatus(data.image_processing);
          }
          
          alert('Article created successfully with multi-file upload!');
          
          // Reset form
          setArticleForm({
            title: '',
            subspecialty: 'sportsMedicine',
            contentType: 'html',
            content: '',
            metaDescription: '',
            file: null
          });
          setUploadedFiles({ html: null, images: [] });
          setFilePreview(null);
          setImageMatchingStatus(null);
          
          fetchDashboardData();
          fetchArticlesAdmin();
        } else {
          const error = await response.json();
          alert(`Failed to create article: ${error.detail}`);
        }
      } else {
        // Original single-file upload path
        const formData = new FormData();
        formData.append('title', articleForm.title);
        formData.append('subspecialty', articleForm.subspecialty);
        formData.append('content_type', articleForm.contentType);
        
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
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'metadata', label: 'Metadata & SVG', icon: Database }
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
                      
                      {/* Multi-file upload toggle for HTML */}
                      {articleForm.contentType === 'html' && (
                        <div className="mb-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={useMultiFileUpload}
                              onChange={(e) => {
                                setUseMultiFileUpload(e.target.checked);
                                setUploadedFiles({ html: null, images: [] });
                                setFilePreview(null);
                                setArticleForm({ ...articleForm, file: null });
                              }}
                              className="rounded text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Upload HTML with local images
                            </span>
                            <HelpCircle className="w-4 h-4 text-gray-400" title="Upload HTML file along with referenced image files" />
                          </label>
                          <p className="ml-6 text-xs text-gray-500 mt-1">
                            Select multiple files: HTML + all referenced images (e.g., biceps.jpeg)
                          </p>
                        </div>
                      )}
                      
                      {/* Multi-file upload area */}
                      {useMultiFileUpload && articleForm.contentType === 'html' ? (
                        <div>
                          <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                              dragActive 
                                ? 'border-primary bg-blue-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragActive(false);
                              handleMultiFileUpload(e.dataTransfer.files);
                            }}
                          >
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-600 mb-2">
                              Drag and drop HTML + Image files here
                            </p>
                            <p className="text-sm text-gray-500 mb-4">or</p>
                            <input
                              type="file"
                              multiple
                              accept=".html,.htm,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                              onChange={(e) => handleMultiFileUpload(e.target.files)}
                              className="hidden"
                              id="multi-file-upload"
                            />
                            <label
                              htmlFor="multi-file-upload"
                              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Files
                            </label>
                          </div>
                          
                          {/* Multi-file preview */}
                          {uploadedFiles.html && (
                            <div className="mt-4 space-y-3">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">Selected Files:</h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUploadedFiles({ html: null, images: [] });
                                      setFilePreview(null);
                                    }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <File className="w-4 h-4 mr-2 text-blue-600" />
                                    <span className="font-medium">HTML:</span>
                                    <span className="ml-2">{uploadedFiles.html.name}</span>
                                  </div>
                                  
                                  {uploadedFiles.images.length > 0 && (
                                    <div>
                                      <div className="flex items-center text-sm mb-1">
                                        <ImageIcon className="w-4 h-4 mr-2 text-green-600" />
                                        <span className="font-medium">Images ({uploadedFiles.images.length}):</span>
                                      </div>
                                      <ul className="ml-6 text-xs text-gray-600 space-y-1">
                                        {uploadedFiles.images.map((img, idx) => (
                                          <li key={idx}>{img.name}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* HTML Preview */}
                              {filePreview && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <h4 className="font-medium text-gray-900 mb-2">HTML Preview:</h4>
                                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded p-4 bg-white">
                                    <div dangerouslySetInnerHTML={{ __html: filePreview }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Original single file upload */
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
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <input
                      type="text"
                      value={articleForm.metaDescription}
                      onChange={(e) => setArticleForm({ ...articleForm, metaDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="SEO description for search engines..."
                    />
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
                  
                  {/* Image Matching Status */}
                  {imageMatchingStatus && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        Image Processing Results
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="text-blue-800">
                          ✅ Matched: {imageMatchingStatus.matched} images
                        </p>
                        <p className="text-blue-800">
                          📎 Orphaned: {imageMatchingStatus.orphaned} images (uploaded but not referenced)
                        </p>
                        {imageMatchingStatus.unmatched && imageMatchingStatus.unmatched.length > 0 && (
                          <div>
                            <p className="text-orange-800">
                              ⚠️ Unmatched references: {imageMatchingStatus.unmatched.length}
                            </p>
                            <ul className="ml-4 mt-1 text-xs text-orange-700">
                              {imageMatchingStatus.unmatched.map((ref, idx) => (
                                <li key={idx}>• {ref}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
                            {article.has_images && (
                              <button
                                onClick={() => fetchArticleImages(article.id)}
                                className="flex items-center px-3 py-2 text-green-600 hover:text-green-800 transition-colors"
                              >
                                <ImageIcon className="w-4 h-4 mr-1" />
                                Images ({article.image_count || 0})
                              </button>
                            )}
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
                
                {/* Artworks Management */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Artworks ({artworks.length})</h3>
                  
                  {artworks.length === 0 ? (
                    <p className="text-gray-500">No artworks generated yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {artworks.slice(0, 10).map((artwork) => {
                        const article = articlesList.find(a => a.id === artwork.article_id);
                        return (
                          <div key={artwork.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{artwork.title || `Artwork ${artwork.id?.slice(0, 8)}...`}</h4>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span>Article: {article?.title || 'Unknown'}</span>
                                <span className="capitalize">Emotion: {artwork.dominant_emotion}</span>
                                <span className="capitalize">{artwork.subspecialty?.replace(/([A-Z])/g, ' $1')}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  Version: {artwork.metadata?.algorithm_version || '1.0'}
                                </span>
                                {artwork.regenerated_date && (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                    Regenerated
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <a
                                href={`/gallery/${artwork.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </a>
                              <button
                                onClick={() => downloadArtworkSVG(artwork.id, artwork.title)}
                                className="flex items-center px-3 py-2 text-green-600 hover:text-green-800 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                SVG
                              </button>
                              <button
                                onClick={() => handleRegenerateArtwork(artwork.id, article?.title || artwork.title)}
                                className="flex items-center px-3 py-2 text-purple-600 hover:text-purple-800 transition-colors"
                              >
                                <RefreshCcw className="w-4 h-4 mr-1" />
                                Regenerate
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {artworks.length > 10 && (
                        <p className="text-center text-sm text-gray-500 pt-2">
                          Showing first 10 of {artworks.length} artworks
                        </p>
                      )}
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

            {/* Metadata Analysis Tab */}
            {activeTab === 'metadata' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Metadata Analysis & SVG Downloads</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchMetadataAnalysis}
                      className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Refresh Analysis
                    </button>
                    {selectedArtworks.length > 0 && (
                      <button
                        onClick={downloadBatchSVGs}
                        disabled={downloadingBatch}
                        className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download {selectedArtworks.length} SVGs
                      </button>
                    )}
                  </div>
                </div>

                {loadingMetadata ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p>Loading metadata analysis...</p>
                    </div>
                  </div>
                ) : metadataAnalysis ? (
                  <>
                    {/* Metadata Completeness Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Artworks</h3>
                        <p className="text-3xl font-bold text-blue-600">{metadataAnalysis.total_artworks || 0}</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">With Metadata</h3>
                        <p className="text-3xl font-bold text-green-600">
                          {metadataAnalysis.metadata_completeness?.with_comprehensive_metadata || 0}
                        </p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Completeness</h3>
                        <p className="text-3xl font-bold text-purple-600">
                          {Math.round(metadataAnalysis.metadata_completeness?.completeness_percentage || 0)}%
                        </p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Phase 2 Ready</h3>
                        <p className="text-3xl font-bold text-indigo-600">
                          {metadataAnalysis.metadata_completeness?.completeness_percentage > 80 ? 'Yes' : 'No'}
                        </p>
                      </motion.div>
                    </div>

                    {/* Pattern Analysis with Overuse Warning */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white rounded-lg shadow"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Pattern Frequency Analysis</h2>
                        <p className="text-gray-600">Visual patterns usage across all artworks</p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3">
                          {metadataAnalysis.pattern_frequency?.slice(0, 10).map((pattern, index) => {
                            const isOverused = pattern.frequency > metadataAnalysis.total_artworks * 0.1;
                            return (
                              <div key={pattern._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-900">{pattern._id || 'Unknown Pattern'}</span>
                                  {isOverused && (
                                    <span className="ml-2 flex items-center text-amber-600">
                                      <AlertTriangle className="w-4 h-4 mr-1" />
                                      <span className="text-sm">Overused</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-gray-600">Used {pattern.frequency} times</span>
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${isOverused ? 'bg-amber-500' : 'bg-blue-500'}`}
                                      style={{ 
                                        width: `${Math.min(100, (pattern.frequency / Math.max(...metadataAnalysis.pattern_frequency.map(p => p.frequency))) * 100)}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>

                    {/* Subspecialty Analysis */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white rounded-lg shadow"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Subspecialty Pattern Analysis</h2>
                        <p className="text-gray-600">Pattern diversity and complexity by medical subspecialty</p>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {metadataAnalysis.subspecialty_analysis?.map((subspecialty, index) => (
                            <div key={subspecialty._id || index} className="border rounded-lg p-4">
                              <h3 className="font-semibold text-gray-900 mb-3 capitalize">
                                {subspecialty._id?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown'}
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Artworks:</span>
                                  <span className="font-medium">{subspecialty.count}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Avg Uniqueness:</span>
                                  <span className="font-medium">{(subspecialty.avg_uniqueness || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Avg Complexity:</span>
                                  <span className="font-medium">{(subspecialty.avg_complexity || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Pattern Types:</span>
                                  <span className="font-medium">{subspecialty.pattern_types?.length || 0}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* SVG Downloads Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-lg shadow"
                    >
                      <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">SVG Downloads</h2>
                        <p className="text-gray-600">Download high-quality SVG files with embedded metadata</p>
                      </div>
                      <div className="p-6">
                        <div className="mb-4 flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            Select artworks to download SVGs with comprehensive metadata
                          </p>
                          <button
                            onClick={() => {
                              if (selectedArtworks.length === metadataAnalysis.recent_trends?.length) {
                                setSelectedArtworks([]);
                              } else {
                                setSelectedArtworks(metadataAnalysis.recent_trends || []);
                              }
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {selectedArtworks.length === metadataAnalysis.recent_trends?.length ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {metadataAnalysis.recent_trends?.slice(0, 12).map((artwork) => {
                            const isSelected = selectedArtworks.some(a => a.id === artwork.id);
                            return (
                              <div 
                                key={artwork._id} 
                                className={`border rounded-lg p-4 transition-colors ${
                                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedArtworks([...selectedArtworks, artwork]);
                                      } else {
                                        setSelectedArtworks(selectedArtworks.filter(a => a.id !== artwork.id));
                                      }
                                    }}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 ml-3">
                                    <h4 className="font-medium text-gray-900 text-sm">
                                      {artwork.id?.slice(0, 8) || 'Unknown'}
                                    </h4>
                                    <p className="text-xs text-gray-600 capitalize mt-1">
                                      {artwork.subspecialty?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown'}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => downloadArtworkSVG(artwork.id, artwork.subspecialty)}
                                  className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                                >
                                  Download SVG
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No metadata analysis available. Click "Refresh Analysis" to load data.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Image Management Modal */}
      {imageModalOpen && selectedArticleImages && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setImageModalOpen(false)}></div>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Image Management - {selectedArticleImages.total_count} Images
                  </h3>
                  <button
                    onClick={() => setImageModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {loadingImages ? (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedArticleImages.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={`${API_BASE}/api/images/${image.id}?version=small`}
                            alt={image.alt || 'Article image'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af"%3ENo Preview%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                            {selectedArticleImages.cover_image_id === image.id ? (
                              <div className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center">
                                <Check className="w-4 h-4 mr-1" />
                                Cover Image
                              </div>
                            ) : (
                              <button
                                onClick={() => updateCoverImage(selectedArticleImages.article_id, image.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Set as Cover
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {image.alt && (
                          <p className="mt-1 text-xs text-gray-600 truncate">{image.alt}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedArticleImages.images.length === 0 && !loadingImages && (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No images found for this article</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;