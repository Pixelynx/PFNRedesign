import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User, UserResponse, AuthResponse, ApiErrorResponse } from '../../../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<UserResponse>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Clear any existing tokens and headers on initialization
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      setCurrentUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<UserResponse> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.post<UserResponse>('/api/auth/register', {
        email,
        password,
        firstName,
        lastName
      });
      
      return response.data;
    } catch (err: any) {
      const errorResponse = err.response?.data as ApiErrorResponse;
      if (errorResponse?.error) {
        setError(errorResponse.error);
      } else if (errorResponse) {
        const errorMessages = Object.values(errorResponse).join(', ');
        setError(errorMessages as string);
      } else {
        setError('Registration failed. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.post<AuthResponse>('/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      
      // Set default auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return user;
    } catch (err: any) {
      const errorResponse = err.response?.data as ApiErrorResponse;
      if (errorResponse?.error) {
        setError(errorResponse.error);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 