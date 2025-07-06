import { useQuery } from '@tanstack/react-query';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Custom hook for algorithm state
export const useAlgorithmState = () => {
  return useQuery({
    queryKey: ['algorithmState'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/algorithm-state`);
      if (!response.ok) {
        throw new Error('Failed to fetch algorithm state');
      }
      return response.json();
    },
  });
};

// Custom hook for articles
export const useArticles = (subspecialty = null, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['articles', subspecialty, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (subspecialty && subspecialty !== 'all') {
        params.append('subspecialty', subspecialty);
      }
      
      const response = await fetch(`${API_BASE}/api/articles?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
  });
};

// Custom hook for artworks
export const useArtworks = (subspecialty = null, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['artworks', subspecialty, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (subspecialty && subspecialty !== 'all') {
        params.append('subspecialty', subspecialty);
      }
      
      const response = await fetch(`${API_BASE}/api/artworks?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }
      return response.json();
    },
  });
};

// Custom hook for individual article
export const useArticle = (articleId) => {
  return useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/articles/${articleId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      return response.json();
    },
    enabled: !!articleId,
  });
};

// Custom hook for individual artwork
export const useArtwork = (artworkId) => {
  return useQuery({
    queryKey: ['artwork', artworkId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/artworks/${artworkId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artwork');
      }
      return response.json();
    },
    enabled: !!artworkId,
  });
};