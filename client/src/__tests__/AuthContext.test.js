import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../components/Context/AuthContext/AuthContext';
import TokenStorage from '../services/tokenStorage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useLogout, useRegister, useRefreshToken } from '../services/authService';

// Mock the hooks from authService
jest.mock('../services/authService', () => ({
  useLogin: jest.fn(),
  useLogout: jest.fn(),
  useRegister: jest.fn(),
  useRefreshToken: jest.fn(),
}));

// Mock TokenStorage
jest.mock('../services/tokenStorage', () => ({
  getToken: jest.fn(),
  getUser: jest.fn(),
  getRefreshToken: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { currentUser, loading, error, login, logout, register } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="user">{currentUser ? JSON.stringify(currentUser) : 'No user'}</div>
      <button data-testid="login-button" onClick={() => login('test@example.com', 'password')}>Login</button>
      <button data-testid="register-button" onClick={() => register('test@example.com', 'password', 'John', 'Doe')}>Register</button>
      <button data-testid="logout-button" onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  let mockLoginMutation;
  let mockRegisterMutation;
  let mockLogoutMutation;
  let mockRefreshTokenMutation;
  let queryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Mock queryClient.clear method with a jest mock
    queryClient.clear = jest.fn();

    // Set up mock mutation functions
    mockLoginMutation = {
      mutateAsync: jest.fn(),
      isPending: false,
      error: null,
    };
    
    mockRegisterMutation = {
      mutateAsync: jest.fn(),
      isPending: false,
      error: null,
    };
    
    mockLogoutMutation = {
      mutateAsync: jest.fn(),
      isPending: false,
      error: null,
    };
    
    mockRefreshTokenMutation = {
      mutateAsync: jest.fn(),
      isPending: false,
      error: null,
    };

    // Set up mock hooks to return the mock mutation objects
    useLogin.mockReturnValue(mockLoginMutation);
    useRegister.mockReturnValue(mockRegisterMutation);
    useLogout.mockReturnValue(mockLogoutMutation);
    useRefreshToken.mockReturnValue(mockRefreshTokenMutation);

    // Clear all mocks
    jest.clearAllMocks();
  });

  const renderWithQueryClient = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  test('initializes with no user when no token in TokenStorage', async () => {
    // Mock TokenStorage.getUser to return null
    TokenStorage.getUser.mockReturnValue(null);
    TokenStorage.getRefreshToken.mockReturnValue(null);
    
    renderWithQueryClient(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // After initialization, no user and not loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    expect(screen.getByTestId('user').textContent).toBe('No user');
    expect(screen.getByTestId('error').textContent).toBe('');
  });
  
  test('initializes with user from TokenStorage', async () => {
    // Mock user data
    const mockUser = { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    
    // Mock TokenStorage functions
    TokenStorage.getUser.mockReturnValue(mockUser);
    TokenStorage.getRefreshToken.mockReturnValue('mock-refresh-token');
    mockRefreshTokenMutation.mutateAsync.mockResolvedValue({ token: 'new-token', refreshToken: 'new-refresh-token' });

    renderWithQueryClient(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // After initialization, user should be loaded from TokenStorage
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    expect(mockRefreshTokenMutation.mutateAsync).toHaveBeenCalledWith('mock-refresh-token');
  });
  
  test('login sets user and token in context', async () => {
    // Mock successful login response
    const mockUser = { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    mockLoginMutation.mutateAsync.mockResolvedValue(mockUser);
    
    // Mock initial state
    TokenStorage.getUser.mockReturnValue(null);
    TokenStorage.getRefreshToken.mockReturnValue(null);
    
    renderWithQueryClient(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Click login button
    fireEvent.click(screen.getByTestId('login-button'));
    
    // After login, user should be set
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    });
    
    expect(mockLoginMutation.mutateAsync).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });
  
  test('logout clears user and token', async () => {
    // Set up initial state with a logged-in user
    const mockUser = { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    TokenStorage.getUser.mockReturnValue(mockUser);
    TokenStorage.getRefreshToken.mockReturnValue('mock-refresh-token');
    mockRefreshTokenMutation.mutateAsync.mockResolvedValue({ token: 'new-token', refreshToken: 'new-refresh-token' });
    
    // Mock successful logout
    mockLogoutMutation.mutateAsync.mockResolvedValue({});
    
    renderWithQueryClient(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to finish and user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    });
    
    // Click logout button
    fireEvent.click(screen.getByTestId('logout-button'));
    
    // After logout, user should be cleared
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('No user');
    });
    
    expect(mockLogoutMutation.mutateAsync).toHaveBeenCalled();
    expect(queryClient.clear).toHaveBeenCalled();
  });
  
  test.skip('handles login error', async () => {
    // Mock failed login
    const errorMessage = 'Invalid credentials';
    mockLoginMutation.mutateAsync.mockRejectedValue({
      response: { data: { error: errorMessage } }
    });
    
    // Mock initial state
    TokenStorage.getUser.mockReturnValue(null);
    TokenStorage.getRefreshToken.mockReturnValue(null);
    
    renderWithQueryClient(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Click login button - the error will be caught in the TestComponent
    fireEvent.click(screen.getByTestId('login-button'));
    
    // After failed login, error should be set in the AuthContext
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe(errorMessage);
    });
    
    expect(screen.getByTestId('user').textContent).toBe('No user');
    expect(mockLoginMutation.mutateAsync).toHaveBeenCalled();
  });
  
  test('register function calls register mutation with correct data', async () => {
    // Mock successful registration
    const mockUser = { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    mockRegisterMutation.mutateAsync.mockResolvedValue({ user: mockUser });
    
    renderWithQueryClient(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Click register button
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Check if register mutation was called with correct data
    expect(mockRegisterMutation.mutateAsync).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe'
    });
  });
});