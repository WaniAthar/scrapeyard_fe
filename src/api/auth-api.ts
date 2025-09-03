const API_URL = import.meta.env.VITE_API_URL;

// Create a utility function for making authenticated requests
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}, token?: string) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401 and we're in the browser, dispatch an event
  if (response.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('unauthorized'));
  }

  return response;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/get_tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Login error:', errorData);
    throw new Error(errorData.detail || "Login failed");
  }

  return await response.json();
};

export const signup = async (name: string, email: string, password: string, password_confirm: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, password_confirm }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Signup failed");
  }

  return await response.json();
};

export const resendVerification = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/resend_verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || "Failed to resend verification email");
    }

    return data;
  } catch (error) {
    console.error('Error in resendVerification:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to process password reset request');
  }

  return await response.json();
};

export const verifyEmail = async (token: string) => {
  const response = await fetch(`${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Email verification failed");
  }

  return await response.json();
};

// Updated API functions for auth-api.ts

export const getApiKeys = async (token: string) => {
  const response = await makeAuthenticatedRequest(`${API_URL}/api_keys/get_keys`, {
    method: "GET",
  }, token);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch API keys");
  }

  return await response.json();
};

export const createApiKey = async (token: string, data: { name: string; description?: string }) => {
  const response = await makeAuthenticatedRequest(`${API_URL}/api_keys/create`, {
    method: "POST",
    body: JSON.stringify(data),
  }, token);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create API key");
  }

  return await response.json();
};

export const deleteApiKey = async (token: string, apiKeyId: number) => {
  const response = await makeAuthenticatedRequest(`${API_URL}/api_keys/delete_key/${apiKeyId}`, {
    method: "DELETE",
  }, token);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to delete API key");
  }

  // The backend returns 204 No Content, so we don't need to parse JSON
  return;
};

export const scrape = async (token: string, data: any) => {
  const response = await makeAuthenticatedRequest(`${API_URL}/scrape/`, {
    method: "POST",
    body: JSON.stringify(data),
  }, token);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to scrape");
  }

  return await response.json();
};

export const getDashboardData = async (token: string) => {
  const response = await makeAuthenticatedRequest(`${API_URL}/dashboard/`, {
    method: "GET",
  }, token);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch dashboard data");
  }

  return await response.json();
};

// Utility function to refresh token
export const refreshToken = async (refreshToken: string) => {
  const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to refresh token');
  }

  return await response.json();
};