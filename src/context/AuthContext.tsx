import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup } from '@/api/auth-api';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => Promise<string | null>;
  refreshAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Refresh token 2 minutes before expiration (assuming 15 min token lifetime)
const TOKEN_REFRESH_INTERVAL = 13 * 60 * 1000; // 13 minutes
const TOKEN_CHECK_INTERVAL = 30 * 1000; // Check token validity every 30 seconds

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const refreshTokenRef = useRef<string | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const tokenCheckIntervalRef = useRef<NodeJS.Timeout>();
  const isRefreshingRef = useRef<boolean>(false);
  
  const setRefreshToken = (token: string | null) => {
    refreshTokenRef.current = token;
  };
  
  const getRefreshToken = () => refreshTokenRef.current;

  const logout = useCallback(() => {
    console.log('Logging out user...');
    
    // Clear any pending timeouts
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = undefined;
    }
    
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
      tokenCheckIntervalRef.current = undefined;
    }
    
    // Reset refresh flag
    isRefreshingRef.current = false;
    
    // Clear state
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    
    // Clear storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  // Check if token is expired (basic JWT expiration check)
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired if we can't parse
    }
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshingRef.current) {
      console.log('Token refresh already in progress...');
      return accessToken;
    }
    
    try {
      isRefreshingRef.current = true;
      const currentRefreshToken = getRefreshToken() || localStorage.getItem('refreshToken');
      
      if (!currentRefreshToken) {
        console.log('No refresh token available');
        throw new Error('No refresh token available');
      }

      console.log('Refreshing access token...');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: currentRefreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Token refresh failed:', errorData);
        throw new Error(errorData.detail || 'Failed to refresh token');
      }

      const data = await response.json();
      
      if (data.access_token && data.refresh_token) {
        console.log('Token refreshed successfully');
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setIsAuthenticated(true);
        
        scheduleTokenRefresh();
        return data.access_token;
      }
      
      throw new Error('Invalid token response format');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [accessToken, logout]);

  const scheduleTokenRefresh = useCallback(() => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Set a new timeout to refresh the token before it expires
    refreshTimeoutRef.current = setTimeout(async () => {
      console.log('Scheduled token refresh triggered');
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error('Scheduled token refresh failed:', error);
        logout();
      }
    }, TOKEN_REFRESH_INTERVAL);
    
    console.log(`Token refresh scheduled for ${TOKEN_REFRESH_INTERVAL / 60000} minutes`);
  }, [refreshAccessToken, logout]);

  // Periodic token validity check
  const startTokenValidityCheck = useCallback(() => {
    if (tokenCheckIntervalRef.current) {
      clearInterval(tokenCheckIntervalRef.current);
    }

    tokenCheckIntervalRef.current = setInterval(() => {
      const currentToken = accessToken || localStorage.getItem('accessToken');
      
      if (currentToken && isTokenExpired(currentToken)) {
        console.log('Access token expired, attempting refresh...');
        refreshAccessToken();
      }
    }, TOKEN_CHECK_INTERVAL);
  }, [accessToken, isTokenExpired, refreshAccessToken]);

  const getAccessTokenAsync = useCallback(async (): Promise<string | null> => {
    // If we have a valid access token that's not expired, return it
    if (accessToken && !isTokenExpired(accessToken)) {
      return accessToken;
    }
    
    // Check if we have a stored token that's still valid
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken && !isTokenExpired(storedToken)) {
      setAccessToken(storedToken);
      return storedToken;
    }
    
    // Otherwise try to refresh the token
    console.log('Getting fresh access token...');
    return await refreshAccessToken();
  }, [accessToken, isTokenExpired, refreshAccessToken]);

  // Check for existing session on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedAccessToken = localStorage.getItem('accessToken');
        
        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
          
          if (storedAccessToken && !isTokenExpired(storedAccessToken)) {
            console.log('Using stored valid access token');
            setAccessToken(storedAccessToken);
            setIsAuthenticated(true);
            scheduleTokenRefresh();
            startTokenValidityCheck();
          } else {
            console.log('Stored access token expired or missing, refreshing...');
            // Try to refresh the token if stored token is expired or missing
            const newToken = await refreshAccessToken();
            if (newToken) {
              startTokenValidityCheck();
            }
          }
        } else {
          console.log('No refresh token found, user needs to login');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup function
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
      }
    };
  }, []); // Empty dependency array for initial load only

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login...');
      const data = await apiLogin(email, password);
      
      // Handle both possible response formats
      const accessTokenValue = data.access_token || data.access;
      const refreshTokenValue = data.refresh_token || data.refresh;
      
      if (!accessTokenValue || !refreshTokenValue) {
        throw new Error('Invalid login response format');
      }
      
      console.log('Login successful, storing tokens');
      localStorage.setItem('accessToken', accessTokenValue);
      localStorage.setItem('refreshToken', refreshTokenValue);
      
      setAccessToken(accessTokenValue);
      setRefreshToken(refreshTokenValue);
      setIsAuthenticated(true);
      
      scheduleTokenRefresh();
      startTokenValidityCheck();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [scheduleTokenRefresh, startTokenValidityCheck]);

  const signup = useCallback(async (name: string, email: string, password: string, passwordConfirm: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting signup...');
      // Call the signup API with required fields
      await apiSignup(name, email, password, passwordConfirm);
      
      // After successful signup, log the user in automatically
      await login(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error; // Re-throw to allow error handling in the component
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // Add API request interceptor to handle 401s
  useEffect(() => {
    const handleApiResponse = async (response: Response) => {
      if (response.status === 401 && isAuthenticated) {
        console.log('Received 401, attempting token refresh...');
        const newToken = await refreshAccessToken();
        if (!newToken) {
          console.log('Token refresh failed, logging out...');
          logout();
        }
      }
    };

    // You might want to add this to your API utility functions
    window.addEventListener('unauthorized', () => {
      console.log('Unauthorized event received, logging out...');
      logout();
    });

    return () => {
      window.removeEventListener('unauthorized', logout);
    };
  }, [isAuthenticated, refreshAccessToken, logout]);

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        isLoading,
        accessToken,
        login,
        signup,
        logout,
        getAccessToken: getAccessTokenAsync,
        refreshAccessToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};