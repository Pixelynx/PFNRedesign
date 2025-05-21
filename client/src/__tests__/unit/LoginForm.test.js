import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../components/Context/AuthContext/AuthContext';
import LoginForm from '../../components/Login/LoginForm';
import * as authService from '../../services/authService';
import TokenStorage from '../../services/tokenStorage';

jest.setTimeout(15000);

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the AuthContext
jest.mock('../../components/Context/AuthContext/AuthContext', () => {
  const originalModule = jest.requireActual('../../components/Context/AuthContext/AuthContext');
  
  const mockLoginFn = jest.fn().mockImplementation((email, password) => {
    return Promise.resolve({ id: 1, email, firstName: 'Test', lastName: 'User' });
  });
  
  return {
    ...originalModule,
    useAuth: jest.fn().mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: mockLoginFn,
      register: jest.fn(),
      logout: jest.fn(),
    })),
    // Keep the original provider for components that need to render it
    AuthProvider: ({ children }) => <>{children}</>,
  };
});

// Mocks
jest.mock('../../services/authService');
jest.mock('../../services/tokenStorage');

describe('LoginForm Component', () => {
  let queryClient;
  let mockLoginMutation;
  let mockRegisterMutation;
  let mockLogoutMutation;
  let mockRefreshTokenMutation;
  let mockLoginFn;
  
  beforeEach(() => {
    mockLoginFn = jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' });
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: mockLoginFn,
      register: jest.fn(),
      logout: jest.fn(),
    }));
    
    // Use fake timers that auto advance for promises to resolve quickly
    jest.useFakeTimers({ advanceTimers: true });
    
    jest.clearAllMocks();
    
    // Create a fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
          staleTime: 0,
        },
        mutations: {
          retry: false,
        }
      },
      logger: {
        log: console.log,
        warn: console.warn,
        // Suppress error console logs during tests
        error: jest.fn(),
      },
    });

    // Setup mock mutations with complete objects
    mockLoginMutation = {
      mutateAsync: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
      status: 'idle',
      reset: jest.fn(),
      mutate: jest.fn(),
      data: null,
    };
    
    mockRegisterMutation = {
      mutateAsync: jest.fn().mockResolvedValue({ user: { id: 1, email: 'test@example.com' } }),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
      status: 'idle',
      reset: jest.fn(),
      mutate: jest.fn(),
      data: null,
    };
    
    mockLogoutMutation = {
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
      status: 'idle',
      reset: jest.fn(),
      mutate: jest.fn(),
      data: null,
    };
    
    mockRefreshTokenMutation = {
      mutateAsync: jest.fn().mockResolvedValue({ accessToken: 'new-token', refreshToken: 'new-refresh' }),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
      status: 'idle',
      reset: jest.fn(),
      mutate: jest.fn(),
      data: null,
    };
    
    authService.useLogin.mockReturnValue(mockLoginMutation);
    authService.useRegister.mockReturnValue(mockRegisterMutation);
    authService.useLogout.mockReturnValue(mockLogoutMutation);
    authService.useRefreshToken.mockReturnValue(mockRefreshTokenMutation);
    
    // Reset token storage mocks
    TokenStorage.getUser.mockReturnValue(null);
    TokenStorage.getRefreshToken.mockReturnValue(null);
    TokenStorage.setTokens.mockImplementation(() => {});
    TokenStorage.getAccessToken = jest.fn().mockReturnValue(null);
  });

  afterEach(() => {
    // Run any pending promises or timers
    jest.runOnlyPendingTimers();
    // Cleanup timers and reset to real timers
    jest.useRealTimers();
  });

  // Helper function to render the component with all providers
  const renderLoginForm = (initialRoute = '/login') => {
    // Configure user event with timer advancement
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    return {
      user,
      ...render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/dashboard" element={<div data-testid="dashboard">Dashboard</div>} />
              <Route path="/register" element={<div data-testid="register-page">Register</div>} />
              <Route path="/forgot-password" element={<div data-testid="forgot-password">Forgot Password</div>} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      )
    };
  };

  test('renders login form with all required elements', () => {
    renderLoginForm();
    
    // Check for important UI elements by role
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    
    // More specific selector for password input - use the exact label text with exact option
    expect(screen.getByLabelText('Password', { exact: true })).toBeInTheDocument();
    
    
    // Check for registration link
    const registerLink = screen.getByRole('link', { name: /sign up/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/register');
  });

  test('validates form fields when submitted with empty values', async () => {
    // Set up mock implementation that makes login fail with validation errors
    mockLoginFn.mockImplementation(() => {
      throw new Error('Validation failed');
    });
    
    const { user } = renderLoginForm();
    
    // Submit empty form
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Wait for validation errors to appear
    const emailErrorText = await screen.findAllByText('Email is required');
    const passwordErrorText = await screen.findAllByText('Password is required');
    
    expect(emailErrorText.length).toBeGreaterThan(0);
    expect(passwordErrorText.length).toBeGreaterThan(0);
    
    // Reset mock
    mockLoginFn.mockImplementation(() => Promise.resolve({ id: 1, email: 'test@example.com' }));
  });

  test('validates email format', async () => {
    // Make login fail with validation error
    mockLoginFn.mockImplementation(() => {
      throw new Error('Validation failed');
    });
    
    const { user } = renderLoginForm();
    
    // Fill in an invalid email
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'invalid-email');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'password123');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for email validation error
    const errorElements = await screen.findAllByText('Invalid email address');
    expect(errorElements.length).toBeGreaterThan(0);
    
    // Reset mock
    mockLoginFn.mockImplementation(() => Promise.resolve({ id: 1, email: 'test@example.com' }));
  });

  test('validates password minimum length', async () => {
    // Make login fail with validation error
    mockLoginFn.mockImplementation(() => {
      throw new Error('Validation failed');
    });
    
    const { user } = renderLoginForm();
    
    // Fill in a valid email but too short password
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'valid@example.com');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'pass');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for password validation error
    const errorElements = await screen.findAllByText('Password must be at least 6 characters');
    expect(errorElements.length).toBeGreaterThan(0);
    
    // Reset mock
    mockLoginFn.mockImplementation(() => Promise.resolve({ id: 1, email: 'test@example.com' }));
  });

  test('handles successful login and navigation', async () => {
    const { user } = renderLoginForm();
    
    // Make sure the component is fully rendered
    await screen.findByRole('heading', { name: /sign in/i });
    
    // Fill in valid credentials
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'password123');
    
    // Toggle remember me checkbox
    await user.click(screen.getByRole('checkbox', { name: /remember me/i }));
    
    // Submit
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Advance timers to resolve promises
    jest.runOnlyPendingTimers();
    
    // Verify login was called with correct credentials
    await waitFor(() => {
      expect(mockLoginFn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Verify navigation to dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays loading state during login submission', async () => {
    // Mock the loading state before rendering
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: true,  // Set loading to true
      error: '',
      login: mockLoginFn,
      register: jest.fn(),
      logout: jest.fn(),
    }));
    
    renderLoginForm();
    
    // Make sure the component is fully rendered
    await screen.findByRole('heading', { name: /sign in/i });
    
    // With loading=true in useAuth, button should show "Signing in..." and be disabled
    const submitButton = screen.getByRole('button', { name: /signing in/i });
    expect(submitButton).toBeDisabled();
    
    // Reset the mock for future tests
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: mockLoginFn,
      register: jest.fn(),
      logout: jest.fn(),
    }));
  });

  test('displays error message when login fails', async () => {
    // Mock the auth context with an error
    const errorMessage = 'Invalid credentials';
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: errorMessage,  // Set an error message
      login: mockLoginFn,
      register: jest.fn(),
      logout: jest.fn(),
    }));
    
    const { user } = renderLoginForm();
    
    // Make sure the component is fully rendered
    await screen.findByRole('heading', { name: /sign in/i });
    
    // Check for the error message
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // Reset the mock for future tests
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: mockLoginFn,
      register: jest.fn(),
      logout: jest.fn(),
    }));
  });

  test('forgot password link navigates to the forgot password page', () => {
    renderLoginForm();
    
    // Get the forgot password link
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    
    // Check that the href attribute is correct
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  test('signup link navigates to the registration page', () => {
    renderLoginForm();
    
    // Get the sign up link
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    
    // Check that the href attribute is correct
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  // Table-driven test for form validation scenarios
  const validationScenarios = [
    {
      name: 'empty email and password',
      email: '',
      password: '',
      expectedErrors: ['Email is required', 'Password is required'],
    },
    {
      name: 'invalid email format',
      email: 'not-an-email',
      password: 'password123',
      expectedErrors: ['Invalid email address'],
    },
    {
      name: 'password too short',
      email: 'valid@example.com',
      password: 'short',
      expectedErrors: ['Password must be at least 6 characters'],
    },
  ];

  test.each(validationScenarios)(
    'validates form: $name',
    async ({ email, password, expectedErrors }) => {
      // Set up mock implementation that makes login fail with validation errors
      mockLoginFn.mockImplementation(() => {
        throw new Error('Validation failed');
      });
      
      const { user } = renderLoginForm();
            
      // Fill in the test data
      if (email) {
        await user.type(screen.getByRole('textbox', { name: /email/i }), email);
      }
      
      if (password) {
        await user.type(screen.getByLabelText('Password', { exact: true }), password);
      }
      
      // Submit
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      // Check for expected validation errors
      for (const errorMessage of expectedErrors) {
        const errorElements = await screen.findAllByText(errorMessage);
        expect(errorElements.length).toBeGreaterThan(0);
      }
      
      // Reset mock
      mockLoginFn.mockImplementation(() => Promise.resolve({ id: 1, email: 'test@example.com' }));
    }
  );

  test('keyboard accessibility allows tabbing through all interactive elements', async () => {
    // A simple render just for keyboard navigation
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    
    // Make sure the component is fully rendered
    await screen.findByRole('heading', { name: /sign in/i });
    
    // Setup user event
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    // Tab to each element
    await user.tab(); 
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByLabelText('Password', { exact: true })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('link', { name: /forgot password/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('button', { name: /sign in/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveFocus();
  });
});