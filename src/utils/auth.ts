// Authentication utility functions

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  token?: string;
}

const API_BASE_URL = 'https://laravel.mysignages.com/api';

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Don't throw error, allow local logout to proceed
    }
  },

  // Helper functions for token management
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
  },

  // Helper function to check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const userRole = localStorage.getItem('userRole');
    return !!(token && userRole);
  },

  // Helper function to get current user info
  getCurrentUser(): { id: string; name: string; role: string } | null {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    if (!userId || !userName || !userRole) {
      return null;
    }

    return {
      id: userId,
      name: userName,
      role: userRole,
    };
  },

  // Helper function to clear all auth data
  clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('rememberMe');
  },
};

// HTTP interceptor for adding auth token to requests
export const createAuthenticatedRequest = (url: string, options: RequestInit = {}): RequestInit => {
  const token = authAPI.getAuthToken();
  
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };
};

// Helper function for making authenticated API calls
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const authOptions = createAuthenticatedRequest(url, options);
  const response = await fetch(url, authOptions);
  
  // If unauthorized, clear auth data and redirect to login
  if (response.status === 401) {
    authAPI.clearAuthData();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  return response;
};