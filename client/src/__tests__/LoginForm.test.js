import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/Login/LoginForm';
import { AuthProvider } from '../components/Context/AuthContext/AuthContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the axios module
jest.mock('axios');

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginForm Component', () => {
  test('renders login form with all elements', () => {
    renderLoginForm();
    
    // Check that form elements are rendered
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('displays validation errors when form is submitted with empty fields', async () => {
    renderLoginForm();
    
    // Submit the form without filling in any fields
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitButton);
    
    // Check that email validation error is displayed
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    // Check that password validation error is displayed
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    renderLoginForm();
    
    // Enter an invalid email
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Enter a valid password
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitButton);
    
    // Check that email validation error is displayed
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  test('toggles remember me checkbox', () => {
    renderLoginForm();
    
    // Find the checkbox
    const checkbox = screen.getByRole('checkbox');
    
    // Initial state should be unchecked
    expect(checkbox).not.toBeChecked();
    
    // Click the checkbox
    fireEvent.click(checkbox);
    
    // Checkbox should now be checked
    expect(checkbox).toBeChecked();
    
    // Click the checkbox again
    fireEvent.click(checkbox);
    
    // Checkbox should now be unchecked
    expect(checkbox).not.toBeChecked();
  });
}); 