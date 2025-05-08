import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../shared/FormInput';
import Button from '../shared/Button';
import ErrorMessage from '../shared/ErrorMessage';
import { useAuth } from '../Context/AuthContext/AuthContext';
import { LoginFormErrors } from '../../types';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await login(email, password);
        navigate('/dashboard'); // Redirect to dashboard after successful login
      } catch (error) {
        // Error is handled in the auth context
      }
    }
  };

  // bypass function that creates a fake user session
  const handleBypassLogin = () => {
    // Create a mock user
    const mockUser = {
      id: 999,
      firstName: 'Dev',
      lastName: 'User',
      email: 'dev@test.com',
      createdAt: new Date().toISOString()
    };
    
    // Store mock data in localStorage to bypass auth
    localStorage.setItem('token', 'dev-test-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    navigate('/dashboard');
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  // Bypass button styles
  const devButtonStyle: React.CSSProperties = {
    marginTop: '10px',
    backgroundColor: '#FF69B4',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    width: '100%'
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h2 className="login-form-title">Sign In</h2>
        <p className="login-form-subtitle">Welcome back to PFN</p>
        
        {authError && <ErrorMessage message={authError} />}
        
        <form onSubmit={handleSubmit} className="login-form">
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
            placeholder="Enter your password"
            error={errors.password}
            required
          />
          
          <div className="login-form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span>Remember me</span>
            </label>
            
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Development bypass button - outside the form to avoid form submission */}
        <div style={{ marginTop: '15px' }}>
          <button 
            type="button" 
            onClick={handleBypassLogin}
            style={devButtonStyle}
          >
            DEV: Skip Login (Testing Only)
          </button>
        </div>
        
        <div className="login-form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 