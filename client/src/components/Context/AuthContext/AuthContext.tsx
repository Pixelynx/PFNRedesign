import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User } from '../../../types';
import TokenStorage from '../../../services/tokenStorage';
import { useLogin, useLogout, useRegister, useRefreshToken } from '../../../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
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

export const AuthProvider = ({ children }: AuthProviderProps): React.ReactElement => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const refreshTokenMutation = useRefreshToken();

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        const user = TokenStorage.getUser();
        const refreshToken = TokenStorage.getRefreshToken();

        if (user && refreshToken) {
          // Verify token validity by attempting to refresh
          await refreshTokenMutation.mutateAsync(refreshToken);
          setCurrentUser(user);
        }
      } catch (err) {
        TokenStorage.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<User> => {
    try {
      setError('');
      const response = await registerMutation.mutateAsync({ email, password, firstName, lastName });
      return response.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setError('');
      const user = await loginMutation.mutateAsync({ email, password });
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      setCurrentUser(null);
      queryClient.clear(); // Clear all queries from cache
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading: loading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error: error || loginMutation.error?.message || registerMutation.error?.message || logoutMutation.error?.message || '',
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 