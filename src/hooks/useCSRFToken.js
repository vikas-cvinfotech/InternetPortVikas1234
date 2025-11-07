import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage CSRF tokens for secure API requests
 * Automatically fetches and includes CSRF token in requests
 */
export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    fetchCSRFToken();
  }, []);

  const fetchCSRFToken = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'include', // Important for cookies
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      
      const data = await response.json();
      setCSRFToken(data.token);
      
      // Store in sessionStorage for easy access
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('csrf-token', data.token);
      }
    } catch (err) {
      console.error('CSRF token fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to make secure requests with CSRF token
  const secureFetch = useCallback(async (url, options = {}) => {
    // Get token from state or sessionStorage
    const token = csrfToken || (typeof window !== 'undefined' ? sessionStorage.getItem('csrf-token') : null);
    
    if (!token && !['GET', 'HEAD', 'OPTIONS'].includes((options.method || 'GET').toUpperCase())) {
      // Try to fetch token if missing for state-changing requests
      await fetchCSRFToken();
    }
    
    // Add CSRF token to headers for state-changing requests
    const method = (options.method || 'GET').toUpperCase();
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      options.headers = {
        ...options.headers,
        'x-csrf-token': token || csrfToken,
      };
    }
    
    // Ensure credentials are included
    options.credentials = options.credentials || 'include';
    
    const response = await fetch(url, options);
    
    // If CSRF token is invalid, try refreshing it once
    if (response.status === 403) {
      const data = await response.clone().json().catch(() => ({}));
      if (data.code === 'CSRF_TOKEN_INVALID' || data.code === 'CSRF_TOKEN_MISSING') {
        // Refresh token and retry once
        await fetchCSRFToken();
        
        // Update headers with new token
        if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
          options.headers['x-csrf-token'] = csrfToken;
        }
        
        // Retry the request
        return fetch(url, options);
      }
    }
    
    return response;
  }, [csrfToken]);

  return {
    csrfToken,
    isLoading,
    error,
    refreshToken: fetchCSRFToken,
    secureFetch,
  };
}

/**
 * Get CSRF token for manual inclusion in requests
 * @returns {string|null} CSRF token if available
 */
export function getCSRFToken() {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('csrf-token');
  }
  return null;
}

/**
 * Add CSRF token to fetch options
 * @param {Object} options - Fetch options
 * @returns {Object} Options with CSRF token added
 */
export function withCSRFToken(options = {}) {
  const token = getCSRFToken();
  const method = (options.method || 'GET').toUpperCase();
  
  // Only add for state-changing requests
  if (token && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    options.headers = {
      ...options.headers,
      'x-csrf-token': token,
    };
  }
  
  // Ensure credentials are included
  options.credentials = options.credentials || 'include';
  
  return options;
}