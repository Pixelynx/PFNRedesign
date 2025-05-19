import { useMutation, UseMutationResult } from '@tanstack/react-query';
import apiClient from './apiClient';
import TokenStorage from './tokenStorage';
import { User, UserResponse, AuthResponse, ApiErrorResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export const useLogin = (): UseMutationResult<User, ApiErrorResponse, LoginCredentials> => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<User> => {
      const response = await apiClient.post<AuthResponse>('/api/v0/auth/login', credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      TokenStorage.setTokens({
        accessToken,
        refreshToken,
        user,
      });
      
      return user;
    },
  });
};

export const useRegister = (): UseMutationResult<UserResponse, ApiErrorResponse, RegisterCredentials> => {
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials): Promise<UserResponse> => {
      const response = await apiClient.post<UserResponse>('/api/v0/auth/register', credentials);
      return response.data;
    },
  });
};

export const useLogout = (): UseMutationResult<void, ApiErrorResponse, void> => {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.post('/api/v0/auth/logout');
      TokenStorage.clearTokens();
    },
  });
};

export const useRefreshToken = (): UseMutationResult<{ accessToken: string; refreshToken: string }, ApiErrorResponse, string> => {
  return useMutation({
    mutationFn: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/api/v0/auth/refresh', {
        refreshToken,
      });
      return response.data;
    },
  });
}; 