import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../../components/Context/AuthContext/AuthContext';
import RegisterForm from '../../components/Registration/RegisterForm';
import * as authService from '../../services/authService';
import TokenStorage from '../../services/tokenStorage';

// Increase the test timeout for all tests in this file
jest.setTimeout(15000);

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();

// Need to hoist mock declarations to the top level
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
  
  const mockRegisterFn = jest.fn().mockImplementation((email, password, firstName, lastName) => {
    return Promise.resolve({ id: 1, email, firstName, lastName });
  });
  
  return {
    ...originalModule,
    useAuth: jest.fn().mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: jest.fn(),
      register: mockRegisterFn,
      logout: jest.fn(),
    })),
    // Keep the original provider for components that need to render it
    AuthProvider: ({ children }) => <>{children}</>,
  };
});

jest.mock('../../services/authService');
jest.mock('../../services/tokenStorage');

describe('RegisterForm Component', () => {
  let queryClient;
  let mockRegisterMutation;
  let mockRegisterFn;

  beforeEach(() => {
    mockRegisterFn = jest.fn().mockResolvedValue({ 
      id: 1, 
      email: 'test@example.com', 
      firstName: 'Test',
      lastName: 'User'
    });
    
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: jest.fn(),
      register: mockRegisterFn,
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

    mockRegisterMutation = {
      mutateAsync: jest.fn().mockResolvedValue({ 
        user: { id: 1, email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        message: 'Registration successful'
      }),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
      status: 'idle',
      reset: jest.fn(),
      mutate: jest.fn(),
      data: null,
    };
    
    authService.useRegister.mockReturnValue(mockRegisterMutation);
    
    // Reset token storage mocks
    TokenStorage.getUser.mockReturnValue(null);
    TokenStorage.getRefreshToken.mockReturnValue(null);
    TokenStorage.getAccessToken = jest.fn().mockReturnValue(null);
  });

  afterEach(() => {
    // Run any pending promises or timers
    jest.runOnlyPendingTimers();
    // Cleanup and reset to real timers
    jest.useRealTimers();
  });

  // Helper to render the component with all providers
  const renderRegisterForm = (initialRoute = '/register') => {
    // Configure user event with timer advancement
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    return {
      user,
      ...render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<div data-testid="login-page">Login</div>} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      )
    };
  };

  test('renders registration form with all required elements', () => {
    renderRegisterForm();
    
    // Check for important UI elements by role
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /last name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Password', { exact: true })).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password', { exact: true })).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    
    // Check for login link
    const loginLink = screen.getByRole('link', { name: /sign in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

  test('validates form fields when submitted with empty values', async () => {
    // Make register fail with validation error
    mockRegisterFn.mockImplementation(() => {
      throw new Error('Validation failed');
    });
    
    const { user } = renderRegisterForm();
    
    // Submit without filling any fields
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check for validation error messages
    const firstNameError = await screen.findAllByText('First name is required');
    const lastNameError = await screen.findAllByText('Last name is required');
    const emailError = await screen.findAllByText('Email is required');
    const passwordError = await screen.findAllByText('Password is required');
    const confirmPasswordError = await screen.findAllByText('Please confirm your password');
    
    expect(firstNameError.length).toBeGreaterThan(0);
    expect(lastNameError.length).toBeGreaterThan(0);
    expect(emailError.length).toBeGreaterThan(0);
    expect(passwordError.length).toBeGreaterThan(0);
    expect(confirmPasswordError.length).toBeGreaterThan(0);
    
    // Reset mock
    mockRegisterFn.mockImplementation(() => Promise.resolve({ 
      id: 1, 
      email: 'test@example.com', 
      firstName: 'Test',
      lastName: 'User'
    }));
  });

  test('validates password and confirm password match', async () => {
    // Make register fail with validation error
    mockRegisterFn.mockImplementation(() => {
      throw new Error('Validation failed');
    });
    
    const { user } = renderRegisterForm();
    
    // Fill form with mismatched passwords
    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'John');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Doe');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john.doe@example.com');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'password123');
    await user.type(screen.getByLabelText('Confirm Password', { exact: true }), 'password456');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check for password mismatch error
    const passwordMismatchError = await screen.findAllByText("Passwords don't match");
    expect(passwordMismatchError.length).toBeGreaterThan(0);
    
    // Reset mock
    mockRegisterFn.mockImplementation(() => Promise.resolve({ 
      id: 1, 
      email: 'test@example.com', 
      firstName: 'Test',
      lastName: 'User'
    }));
  });

  test('validates password minimum length', async () => {
    // Make register fail with validation error
    mockRegisterFn.mockImplementation(() => {
      throw new Error('Validation failed');
    });
    
    const { user } = renderRegisterForm();
    
    // Fill form with a short password
    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'John');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Doe');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john.doe@example.com');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'pass');
    await user.type(screen.getByLabelText('Confirm Password', { exact: true }), 'pass');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    // Check for password length error
    const passwordLengthError = await screen.findAllByText('Password must be at least 6 characters');
    expect(passwordLengthError.length).toBeGreaterThan(0);
    
    // Reset mock
    mockRegisterFn.mockImplementation(() => Promise.resolve({ 
      id: 1, 
      email: 'test@example.com', 
      firstName: 'Test',
      lastName: 'User'
    }));
  });

  test('handles successful registration and displays success message', async () => {
    // Setup success message
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: jest.fn(),
      register: mockRegisterFn,
      logout: jest.fn(),
      successMessage: 'Registration successful!'
    }));
    
    const { user } = renderRegisterForm();
    
    // Fill out the form with valid data
    await user.type(screen.getByRole('textbox', { name: /first name/i }), 'John');
    await user.type(screen.getByRole('textbox', { name: /last name/i }), 'Doe');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john.doe@example.com');
    await user.type(screen.getByLabelText('Password', { exact: true }), 'password123');
    await user.type(screen.getByLabelText('Confirm Password', { exact: true }), 'password123');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    // Verify register was called with correct data
    await waitFor(() => {
      expect(mockRegisterFn).toHaveBeenCalledWith(
        'john.doe@example.com',
        'password123',
        'John',
        'Doe'
      );
    });
    
    // Advance timers to trigger navigation
    jest.advanceTimersByTime(2000);
    
    // Verify navigation to login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    
    // Reset mock
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: jest.fn(),
      register: mockRegisterFn,
      logout: jest.fn(),
    }));
  });

  test('displays loading state during registration submission', async () => {
    // Mock the loading state before rendering
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: true,  // Set loading to true
      error: '',
      login: jest.fn(),
      register: mockRegisterFn,
      logout: jest.fn(),
    }));
    
    renderRegisterForm();
    
    await screen.findByRole('heading', { name: /create account/i });
    
    // With loading=true in useAuth, button should show "Creating Account..." and be disabled
    const submitButton = screen.getByRole('button', { name: /creating account/i });
    expect(submitButton).toBeDisabled();
    
    // Reset the mock for future tests
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: jest.fn(),
      register: mockRegisterFn,
      logout: jest.fn(),
    }));
  });

  test('handles registration failures appropriately', async () => {
    // Mock the auth context with an error
    const errorMessage = 'Email already exists';
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: errorMessage,
      login: jest.fn(),
      register: mockRegisterFn,
      logout: jest.fn(),
    }));
    
    renderRegisterForm();
    
    await screen.findByRole('heading', { name: /create account/i });
    
    // Check for the error message
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    
    // Reset the mock
    useAuth.mockImplementation(() => ({
      currentUser: null,
      loading: false,
      error: '',
      login: jest.fn(),
      register: mockRegisterFn,
      logout: jest.fn(),
    }));
  });

  test('signin link navigates to the login page', () => {
    renderRegisterForm();
    
    // Get the sign in link
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    
    // Check that the href attribute is correct
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  // Table-driven test for validation scenarios
  const validationScenarios = [
    {
      name: 'missing first name',
      formData: {
        firstName: '',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      },
      expectedErrors: ['First name is required']
    },
    {
      name: 'missing last name',
      formData: {
        firstName: 'John',
        lastName: '',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      },
      expectedErrors: ['Last name is required']
    },
    {
      name: 'invalid email format',
      formData: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
        password: 'password123',
        confirmPassword: 'password123'
      },
      expectedErrors: ['Invalid email address']
    },
    {
      name: 'mismatched passwords',
      formData: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'different123'
      },
      expectedErrors: ["Passwords don't match"]
    }
  ];

  test.each(validationScenarios)(
    'validates form: $name',
    async ({ formData, expectedErrors }) => {
      // Make register fail with validation error
      mockRegisterFn.mockImplementation(() => {
        throw new Error('Validation failed');
      });
      
      const { user } = renderRegisterForm();
      
      // Fill in the form fields with the test data
      if (formData.firstName) {
        await user.type(screen.getByRole('textbox', { name: /first name/i }), formData.firstName);
      }
      
      if (formData.lastName) {
        await user.type(screen.getByRole('textbox', { name: /last name/i }), formData.lastName);
      }
      
      if (formData.email) {
        await user.type(screen.getByRole('textbox', { name: /email/i }), formData.email);
      }
      
      if (formData.password) {
        await user.type(screen.getByLabelText('Password', { exact: true }), formData.password);
      }
      
      if (formData.confirmPassword) {
        await user.type(screen.getByLabelText('Confirm Password', { exact: true }), formData.confirmPassword);
      }
      
      // Submit
      await user.click(screen.getByRole('button', { name: /create account/i }));
      
      // Check for expected validation errors
      for (const errorMessage of expectedErrors) {
        const errorElements = await screen.findAllByText(errorMessage);
        expect(errorElements.length).toBeGreaterThan(0);
      }
      
      // Reset mock
      mockRegisterFn.mockImplementation(() => Promise.resolve({ 
        id: 1, 
        email: 'test@example.com', 
        firstName: 'Test',
        lastName: 'User'
      }));
    }
  );

  test('keyboard accessibility allows tabbing through all interactive elements', async () => {
    renderRegisterForm();
    
    await screen.findByRole('heading', { name: /create account/i });
    
    // Setup user event for v14
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    // Tab to each element
    await user.tab(); 
    expect(screen.getByRole('textbox', { name: /first name/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('textbox', { name: /last name/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByLabelText('Password', { exact: true })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByLabelText('Confirm Password', { exact: true })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('button', { name: /create account/i })).toHaveFocus();
    
    await user.tab(); 
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveFocus();
  });
}); 