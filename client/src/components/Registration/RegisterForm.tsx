import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../shared/FormInput';
import Button from '../shared/Button';
import ErrorMessage from '../shared/ErrorMessage';
import SuccessMessage from '../shared/SuccessMessage';
import { useAuth } from '../Context/AuthContext/AuthContext';
import { RegistrationFormErrors } from '../../types';
import './RegisterForm.css';

const RegisterForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const { register, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: RegistrationFormErrors = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register(email, password, firstName, lastName);
        setSuccessMessage('Registration successful! You can now log in.');
        
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        // Error handled in the auth context
      }
    }
  };

  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="register-form-container">
      <div className="register-form-card">
        <h2 className="register-form-title">Create Account</h2>
        <p className="register-form-subtitle">Join Pink Friday Nails today</p>
        
        {authError && <ErrorMessage message={authError} />}
        {successMessage && <SuccessMessage message={successMessage} />}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="name-fields">
            <FormInput
              id="firstName"
              label="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              placeholder="Enter your first name"
              error={errors.firstName}
              required
            />
            
            <FormInput
              id="lastName"
              label="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
              placeholder="Enter your last name"
              error={errors.lastName}
              required
            />
          </div>
          
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            error={errors.email}
            required
          />
          
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Create a password"
            error={errors.password}
            required
          />
          
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            required
          />
          
          <div className="password-requirements">
            <p>Password must be at least 6 characters long</p>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="register-form-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 