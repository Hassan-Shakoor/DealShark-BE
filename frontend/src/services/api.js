// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dealshark-be.onrender.com';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER_USER: '/auth/register/user/',
    BUSINESS_LOGIN: '/auth/business/login/',
    BUSINESS_REGISTER: '/auth/business/register/',
    REFRESH: '/auth/refresh/',
    VERIFY_OTP: '/auth/verify-otp/',
    RESEND_OTP: '/auth/resend-otp/',
    PROFILE: '/auth/profile/',
    USER_PROFILE: (userId) => `/auth/user/${userId}/profile`,
    BUSINESS_PROFILE: (businessId) => `/auth/business/${businessId}/profile/`,
    UPDATE_BUSINESS: (businessId) => `/auth/business/${businessId}/update_business/`,
  },
  
  // Deals
  DEALS: {
    CREATE: '/deals/',
    GET_MY_DEALS: '/deals/my/',
    GET_DEAL: (dealId) => `/deals/${dealId}/`,
    UPDATE_DEAL: (dealId) => `/deals/${dealId}/`,
    GET_ALL_DEALS: '/deals/all/',
    GET_DEALS_BY_BUSINESS: (businessId) => `/deals/${businessId}/by-business/`,
    DEAL_POSTER_OPTIONS: '/deals/deal-poster/options/',
    GET_INDUSTRIES: '/deals/industries/all/',
  },
  
        // Referrals
        REFERRALS: {
          SUBSCRIBE: '/referrals/subscribe/',
          UNSUBSCRIBE: '/referrals/unsubscribe/',
          MY_SUBSCRIBERS: (businessId) => `/referrals/${businessId}/subscribers`,
          MY_SUBSCRIPTIONS: '/referrals/my-subscriptions',
          CREATE_PAYMENT: '/referrals/create-payment/',
          VERIFY_REFERRAL: '/referrals/verify/',
          CREATE_ONBOARDING_LINK: '/referrals/onboarding/create-link/',
          ONBOARDING_STATUS: '/referrals/onboarding/status/',
        },
  
  // Upload
  UPLOAD: '/upload/',
};

// Token management
class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  setTokens(accessToken, refreshToken = null) {
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem('refresh_token', refreshToken);
    }
    localStorage.setItem('access_token', accessToken);
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.refreshPromise = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  hasRefreshToken() {
    return !!this.refreshToken;
  }

  // Method to handle token refresh with promise caching
  async refreshTokens() {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this._performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async _performTokenRefresh() {
    try {
      const { authService } = await import('./authService.js');
      const result = await authService.refreshToken();
      
      if (result.success) {
        return { success: true, accessToken: result.accessToken };
      } else {
        throw new Error(result.error || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      throw error;
    }
  }
}

// Create token manager instance
export const tokenManager = new TokenManager();

// Base fetch wrapper with error handling and automatic token refresh
const apiRequest = async (url, options = {}, isRetry = false) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists and skipAuth is not set
  if (tokenManager.isAuthenticated() && !options.skipAuth) {
    config.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle 401 with automatic token refresh
      if (response.status === 401 && !isRetry && tokenManager.hasRefreshToken()) {
        try {
          console.log('Access token expired, attempting to refresh...');
          await tokenManager.refreshTokens();
          
          // Retry the original request with new token
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${tokenManager.getAccessToken()}`,
            },
          };
          
          const retryResponse = await fetch(`${API_BASE_URL}${url}`, retryConfig);
          
          let retryData;
          const retryContentType = retryResponse.headers.get('content-type');
          
          if (retryContentType && retryContentType.includes('application/json')) {
            retryData = await retryResponse.json();
          } else {
            retryData = await retryResponse.text();
          }

          if (!retryResponse.ok) {
            // Prioritize API error messages
            if (retryData && typeof retryData === 'object' && retryData.error) {
              throw new Error(retryData.error);
            }
            
            if (retryData && typeof retryData === 'object' && retryData.message) {
              throw new Error(retryData.message);
            }
            
            // If retry also fails, clear tokens and throw error
            if (retryResponse.status === 401) {
              tokenManager.clearTokens();
              throw new Error('Authentication failed. Please login again.');
            }
            
            throw new Error(`Request failed with status ${retryResponse.status}`);
          }

          return {
            success: true,
            data: retryData,
            status: retryResponse.status,
          };
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          tokenManager.clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }
     
      // Handle other error cases with generic messages as fallback
      if (response.status === 401) {
        tokenManager.clearTokens();
        throw new Error('Authentication failed. Please login again.');
      }
      
      // Handle API-specific error messages first (prioritize API error messages)
      if (data && typeof data === 'object' && data.error) {
        throw new Error(data.error);
      }
      
      if (data && typeof data === 'object' && data.message) {
        throw new Error(data.message);
      }
      
      if (response.status === 403) {
        throw new Error('Access forbidden. You do not have permission to perform this action.');
      }
      
      if (response.status === 404) {
        throw new Error('Resource not found.');
      }
      
      if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(`Request failed with status ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
};

// HTTP method helpers
export const api = {
  get: (url, options = {}) => apiRequest(url, { method: 'GET', ...options }),
  post: (url, data, options = {}) => apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }),
  put: (url, data, options = {}) => apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }),
  patch: (url, data, options = {}) => apiRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  }),
  delete: (url, options = {}) => apiRequest(url, { method: 'DELETE', ...options }),
};

// Public API methods (without authentication)
export const publicApi = {
  get: (url, options = {}) => apiRequest(url, { method: 'GET', ...options, skipAuth: true }),
  post: (url, data, options = {}) => apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
    skipAuth: true,
  }),
};

// Form data helper for file uploads
export const apiFormData = async (url, formData, options = {}) => {
  const config = {
    headers: {
      // Don't set Content-Type for FormData, let browser set it with boundary
      ...options.headers,
    },
    method: options.method || 'POST',
    body: formData,
    ...options,
  };

  // Add authorization header if token exists
  if (tokenManager.isAuthenticated()) {
    config.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        tokenManager.clearTokens();
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (data && typeof data === 'object' && data.error) {
        throw new Error(data.error);
      }
      
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Upload Error:', error);
    throw error;
  }
};

export default api;
