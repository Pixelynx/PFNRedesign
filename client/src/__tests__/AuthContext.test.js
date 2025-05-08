import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../components/Context/AuthContext/AuthContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Test component that uses the auth context
const TestComponent = () => {
  const { currentUser, loading, error, login, logout, register } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error}</div>
      <div data-testid="user">{currentUser ? JSON.stringify(currentUser) : 'No user'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => register('test@example.com', 'password', 'John', 'Doe')}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
  });
  
  test('initializes with no user when no token in localStorage', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially loading
    expect(screen.getByTestId('loading').textContent).toBe('true');
    
    // After initialization, no user and not loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    expect(screen.getByTestId('user').textContent).toBe('No user');
    expect(screen.getByTestId('error').textContent).toBe('');
  });
  
  test('initializes with user from localStorage', async () => {
    // Set up localStorage with mock token and user
    const mockUser = { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // After initialization, user should be loaded from localStorage
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    
    // Check axios headers were set
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer mock-token');
  });
  
  test('login sets user and token in context and localStorage', async () => {
    // Mock successful login response
    const mockResponse = {
      data: {
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' }
      }
    };
    
    axios.post.mockResolvedValueOnce(mockResponse);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Click login button
    act(() => {
      screen.getByText('Login').click();
    });
    
    // Check loading state during login
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('true');
    });
    
    // After login, user should be set and loading should be false
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(localStorage.getItem('user')).toContain('test@example.com');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer mock-token');
  });
  
  test('logout clears user and token', async () => {
    // Set up initial state with a logged-in user
    const mockUser = { id: 1, email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    axios.defaults.headers.common['Authorization'] = 'Bearer mock-token';
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to finish and user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('test@example.com');
    });
    
    // Click logout button
    act(() => {
      screen.getByText('Logout').click();
    });
    
    // After logout, user should be cleared
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('No user');
    });
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  });
  
  test('handles login error', async () => {
    // Mock failed login response
    const errorMessage = 'Invalid credentials';
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: errorMessage
        }
      }
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading to finish
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    // Click login button
    act(() => {
      screen.getByText('Login').click();
    });
    
    // After failed login, error should be set
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
    
    expect(screen.getByTestId('error').textContent).toBe(errorMessage);
    expect(screen.getByTestId('user').textContent).toBe('No user');
  });
}); 