// src/app/components/auth/LoginForm.client.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { Mail, Lock } from 'lucide-react';

import { FcGoogle } from 'react-icons/fc';
import { TfiMicrosoftAlt } from "react-icons/tfi";

import StatusMessage from '../messages/StatusMessage.cleint';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] = useState({
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' }
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLogin, checkAuth } = useAuth();

  // Fetch CSRF token and check registration status
  useEffect(() => {
    fetch('/api/auth/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(err => console.error("Failed to fetch CSRF token", err));

    const justRegistered = searchParams.get('registered');
    if (justRegistered === 'true') {
      setError('Registration successful! Please log in with your new account.');
    }
  }, [searchParams]);

  const validateField = (name, value) => {
    let isValid = true;
    let message = '';

    switch (name) {
      case 'email':
        if (!value) {
          isValid = false;
          message = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          isValid = false;
          message = 'Password is required';
        } 
        break;
      default:
        break;
    }

    setValidationState(prev => ({
      ...prev,
      [name]: { isValid, message }
    }));

    return isValid;
  };

  // Update form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate all fields before submission
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);

    if (!isEmailValid || !isPasswordValid) {
      setIsLoading(false);
      return;
    }

    try {
      await login({
        email: formData.email.toLowerCase(),
        password: formData.password,
        csrfToken
      });
      router.push('/');
      checkAuth();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };


  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error('Failed to get Google Auth URL', error);
      setError('Failed to initialize Google login');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Microsoft login
  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/microsoft/url');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get Microsoft Auth URL', error);
      setError('Failed to initialize Microsoft login');
    } finally {
      setIsLoading(false);
    }
  };

  
  


  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    <input type="hidden" name="csrfToken" value={csrfToken} />

    {/* Success Message */}
  {searchParams.get('registered') === 'true' && (
    <StatusMessage
      type="success"
      message="Registration successful! Please log in with your new account."
    />
  )}

  {/* Error Message */}
  {error && <StatusMessage type="error" message={error} />}

    {/* Email Input Group */}
    <div className="space-y-2">
      <div className="relative">
        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
          validationState.email.isValid ? 'text-tertiary' : 'text-primary'
        }`} />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={(e) => validateField('email', e.target.value)}
          className={`input focus-highlight w-full pl-10 transition-colors ${
            !validationState.email.isValid ? 'border-primary' : ''
          }`}
          required
        />
      </div>
      {!validationState.email.isValid && (
        <p className="text-sm text-primary pl-10 animate-fade-in">
          {validationState.email.message}
        </p>
      )}
    </div>

    {/* Password Input Group */}
    <div className="space-y-2">
      <div className="relative">
        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
          validationState.password.isValid ? 'text-tertiary' : 'text-primary'
        }`} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          onBlur={(e) => validateField('password', e.target.value)}
          className={`input focus-highlight w-full pl-10 transition-colors ${
            !validationState.password.isValid ? 'border-primary' : ''
          }`}
          required
        />
      </div>
      {!validationState.password.isValid && (
        <p className="text-sm text-primary pl-10 animate-fade-in">
          {validationState.password.message}
        </p>
      )}
    </div>
 
    <button
        type="submit"
        disabled={isLoading}
        className="btn w-full bg-secondary text-background"
      >
        {isLoading ? (
          <span className="animate-pulse ">Logging in...</span>
        ) : (
          'Login'
        )}
      </button>

      {/* Social Login Separator */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-tertiary"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-secondary">Or continue with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="btn w-full text-background border border-tertiary hover:border-primary flex items-center justify-center gap-2"
        >
          <FcGoogle className="h-5 w-5" />
          {isLoading ? 'Loading...' : 'Continue with Google'}
        </button>

        <button
          type="button"
          onClick={handleMicrosoftLogin}
          disabled={isLoading}
          className="btn w-full text-background  border border-tertiary hover:border-primary flex items-center justify-center gap-2"
        >
          <TfiMicrosoftAlt className="h-5 w-5" />
          {isLoading ? 'Loading...' : 'Continue with Microsoft'}
        </button>
      </div>
       {/* Optional: Add terms and conditions agreement */}
       <p className="text-sm text-tertiary text-center mt-4">
        By logging in, you agree to our{' '}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}