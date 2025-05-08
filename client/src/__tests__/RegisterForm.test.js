import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../components/Registration/RegisterForm';
import { AuthProvider } from '../components/Context/AuthContext/AuthContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the axios module
jest.mock('axios');

const renderRegisterForm = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('RegisterForm Component', () => {
  test('renders registration form with all elements', () => {
    renderRegisterForm();
    
    // Check that form elements are rendered
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  test('displays validation errors when form is submitted with empty fields', async () => {
    renderRegisterForm();
    
    // Submit the form without filling in any fields
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);
    
    // Check that validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    });
  });

  test('validates password and confirm password match', async () => {
    renderRegisterForm();
    
    // Fill out the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password456' } });
    
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);
    
    // Check that password mismatch error is displayed
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('validates password length', async () => {
    renderRegisterForm();
    
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'pass' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'pass' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitButton);
    
    // Check that password length error is displayed
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });
}); 