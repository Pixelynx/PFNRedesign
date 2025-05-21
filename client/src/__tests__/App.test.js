import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../components/Context/AuthContext/AuthContext';
import App from '../App';
import TokenStorage from '../services/tokenStorage';
import { useLogin, useLogout, useRegister, useRefreshToken } from '../services/authService';

// Mock the components that App depends on
jest.mock('../providers/QueryProvider', () => ({
  QueryProvider: ({ children }) => <>{children}</>,
}));

// Mock the AppRoutes component
jest.mock('../utils/routes', () => {
  const MockAppRoutes = () => <div data-testid="app-routes">App Routes Mock</div>;
  return MockAppRoutes;
});

jest.mock('../services/authService', () => ({
  useLogin: jest.fn(),
  useRegister: jest.fn(),
  useLogout: jest.fn(),
  useRefreshToken: jest.fn(),
}));

jest.mock('../services/tokenStorage', () => ({
  getToken: jest.fn(),
  getUser: jest.fn(),
  getRefreshToken: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));

// Mock react-router-dom to prevent nested router issues
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  // Return a mock that makes BrowserRouter just render its children without creating a router context
  return {
    ...originalModule,
    BrowserRouter: ({ children }) => <>{children}</>,
  };
});

describe('App Component', () => {
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

    jest.clearAllMocks();
    
    // Reset TokenStorage mocks
    TokenStorage.getUser.mockReturnValue(null);
    TokenStorage.getRefreshToken.mockReturnValue(null);
  });

  const renderApp = () => {
    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  test('renders without crashing', () => {
    renderApp();
    // Basic test to ensure App renders without errors
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });

  test('initializes with auth context', () => {
    renderApp();
    // App should be wrapped with AuthProvider and render correctly
    expect(useLogin).toHaveBeenCalled();
    expect(useRegister).toHaveBeenCalled();
    expect(useLogout).toHaveBeenCalled();
    expect(useRefreshToken).toHaveBeenCalled();
  });
});