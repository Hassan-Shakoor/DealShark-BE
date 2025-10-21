import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService, tokenManager } from '../services';

const AuthContext = createContext();

const initialState = {
  user: null,
  business: null,
  token: tokenManager.getAccessToken(),
  isLoading: true, // Set to true initially to wait for auth initialization
  isAuthenticated: tokenManager.isAuthenticated(),
  userType: null, // 'customer' or 'business'
  loading: false,
  isInitialized: false, // Track if auth has been initialized
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_COMPLETE':
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
      };
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        business: action.payload.business || null,
        token: action.payload.token,
        userType: action.payload.userType,
        isAuthenticated: true,
        isLoading: false,
        loading: false,
        isInitialized: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        business: null,
        token: null,
        userType: null,
        isAuthenticated: false,
        isLoading: false,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        business: null,
        token: null,
        userType: null,
        isAuthenticated: false,
        isLoading: false,
        loading: false,
        isInitialized: true,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'UPDATE_BUSINESS':
      return {
        ...state,
        business: { ...state.business, ...action.payload },
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Initialize authentication state on app load
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if we have tokens in localStorage
      const hasTokens = tokenManager.isAuthenticated() && tokenManager.hasRefreshToken();
      
      if (hasTokens) {
        console.log('Found existing tokens, verifying...');
        await verifyToken();
      } else {
        console.log('No tokens found, user needs to login');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      dispatch({ type: 'LOGOUT' });
    } finally {
      // Mark initialization as complete
      dispatch({ type: 'INIT_COMPLETE' });
    }
  };

  const verifyToken = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        const profile = response.profile;
        const currentToken = tokenManager.getAccessToken();
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: profile.user || profile,
            business: profile.business_profile || null,
            token: currentToken,
            userType: profile.user?.user_type || profile.user_type || 'customer',
          },
        });
        
        console.log('Token verified successfully, user authenticated');
      } else {
        // Token is invalid, try to refresh if possible
        if (tokenManager.hasRefreshToken()) {
          console.log('Access token invalid, attempting refresh...');
          await attemptTokenRefresh();
        } else {
          console.log('No refresh token available, logging out');
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      
      // If verification fails due to 401, the apiRequest will automatically try to refresh
      // If refresh also fails, it will clear tokens and we'll be logged out
      if (error.message.includes('Authentication failed') || error.message.includes('Session expired')) {
        dispatch({ type: 'LOGOUT' });
      } else {
        // For other errors, try refresh if available
        if (tokenManager.hasRefreshToken()) {
          await attemptTokenRefresh();
        } else {
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      }
    }
  };

  const attemptTokenRefresh = async () => {
    try {
      const refreshResult = await tokenManager.refreshTokens();
      
      if (refreshResult.success) {
        console.log('Token refreshed successfully, verifying...');
        // After successful refresh, verify the new token
        await verifyToken();
      } else {
        console.log('Token refresh failed, logging out');
        authService.logout();
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Token refresh attempt failed:', error);
      authService.logout();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password, userType = 'customer') => {
    dispatch({ type: 'LOGIN_START' });

    try {
      let response;

      if (userType === 'business') {
        response = await authService.businessLogin(email, password);
      } else {
        response = await authService.login(email, password);
      }

      if (response.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: response.user,
            business: response.business || null,
            token: response.tokens.access,
            refreshToken: response.tokens.refresh,
            userType: response.user?.user_type || userType,
          },
        });

        const userName = response.user?.first_name || response.user?.name || 'User';
        toast.success(`Welcome back, ${userName}!`);
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        toast.error(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (
    firstName,
    lastName,
    email,
    phone_number,
    password,
    confirm_password,
    user_type = "customer",
    profile_picture = null
  ) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const userData = {
        firstName,
        lastName,
        email,
        phone_number,
        password,
        confirm_password,
        user_type
      };

      if (profile_picture) {
        userData.profile_picture = profile_picture;
      }

      const response = await authService.register(userData);

      if (response.success) {
        dispatch({ type: 'LOGIN_FAILURE' }); // Don't auto-login, need OTP verification
        toast.success(response.message || 'Registration successful! Please verify your email.');
        return { success: true, data: response };
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        toast.error(response.error || 'Registration failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  };

  const businessRegister = async (businessData) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authService.businessRegister(businessData);

      if (response.success) {
        dispatch({ type: 'LOGIN_FAILURE' }); // Don't auto-login, need OTP verification
        toast.success(response.message || 'Business registration successful! Please verify your email.');
        return { success: true, data: response };
      } else {
        dispatch({ type: 'LOGIN_FAILURE' });
        toast.error(response.error || 'Business registration failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  };

  const verifyOTP = async (email, otp, otpType = 'email') => {
    try {
      const response = await authService.verifyOTP(email, otp, otpType);

      if (response.success) {
        // If OTP verification includes tokens, login the user
        if (response.user) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.user,
              business: response.business || null,
              token: tokenManager.getAccessToken(), // Token should be set by authService
              userType: response.user?.user_type || 'customer',
            },
          });
        }

        toast.success(response.message || 'Email verified successfully!');
        return { success: true };
      } else {
        toast.error(response.error || 'OTP verification failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  };

  const resendOTP = async (email, otpType = 'email') => {
    try {
      const response = await authService.resendOTP(email, otpType);

      if (response.success) {
        toast.success(response.message || 'OTP sent successfully!');
        return { success: true };
      } else {
        toast.error(response.error || 'Failed to resend OTP');
        return { success: false, error: response.error };
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const updateBusiness = (businessData) => {
    dispatch({ type: 'UPDATE_BUSINESS', payload: businessData });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();

      if (response.success) {
        const profile = response.profile;
        updateUser(profile.user || profile);
        if (profile.business) {
          updateBusiness(profile.business);
        }
        return { success: true };
      }

      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: 'Failed to refresh profile' };
    }
  };

  const value = {
    ...state,
    login,
    register,
    businessRegister,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
    updateBusiness,
    setLoading,
    refreshProfile,
    // Additional helper methods
    isBusiness: state.userType === 'business',
    isCustomer: state.userType === 'customer',
    hasBusiness: !!state.business,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};