// src/app/components/auth/RegisterForm.client.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { TfiMicrosoftAlt } from "react-icons/tfi";
import { useAuth } from '@/app/hooks/useAuth';

import StatusMessage from '../messages/StatusMessage.cleint';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  // Validation state
  const [validationState, setValidationState] = useState({
    username: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    confirmPassword: { isValid: true, message: '' }
  });

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });

  // Fetch CSRF token
  useEffect(() => {
    fetch('/api/auth/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(err => console.error("Failed to fetch CSRF token", err));
  }, []);

  // Validate password strength
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength({ score, requirements });
    return score;
  };

  // Field validation
  const validateField = (name, value, allValues = formData) => {
    let isValid = true;
    let message = '';

    switch (name) {
      case 'username':
        if (!value) {
          isValid = false;
          message = 'Username is required';
        } else if (value.length < 3) {
          isValid = false;
          message = 'Username must be at least 3 characters';
        }
        break;

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
        const strengthScore = checkPasswordStrength(value);
        if (!value) {
          isValid = false;
          message = 'Password is required';
        } else if (strengthScore < 3) {
          isValid = false;
          message = 'Password is too weak';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          isValid = false;
          message = 'Please confirm your password';
        } else if (value !== allValues.password) {
          isValid = false;
          message = 'Passwords do not match';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    validateField(name, value, newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    const validations = Object.keys(formData).map(field => 
      validateField(field, formData[field], formData)
    );
  
    if (validations.includes(false)) {
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email.toLowerCase(), // Ensure email is lowercase
          password: formData.password,
          csrfToken
        }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        onClose?.(); // Close modal if it exists
        router.push('/login?registered=true');
      } else {
        setError(data.errors || 'Registration failed' );
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = () => (
    <div className="space-y-2 text-sm">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 w-full rounded-full transition-colors ${
              level <= passwordStrength.score
                ? level <= 1 ? 'bg-accent' 
                : level <= 3 ? 'bg-tertiary'
                : 'bg-primary'
                : 'bg-tertiary/20'
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center gap-1 ${
          passwordStrength.requirements.length ? 'text-accent' : 'text-tertiary'
        }`}>
          <CheckCircle2 className="h-3 w-3" />
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center gap-1 ${
          passwordStrength.requirements.uppercase ? 'text-accent' : 'text-tertiary'
        }`}>
          <CheckCircle2 className="h-3 w-3" />
          <span>Uppercase</span>
        </div>
        <div className={`flex items-center gap-1 ${
          passwordStrength.requirements.lowercase ? 'text-accent' : 'text-tertiary'
        }`}>
          <CheckCircle2 className="h-3 w-3" />
          <span>Lowercase</span>
        </div>
        <div className={`flex items-center gap-1 ${
          passwordStrength.requirements.number ? 'text-accent' : 'text-tertiary'
        }`}>
          <CheckCircle2 className="h-3 w-3" />
          <span>Number</span>
        </div>
        <div className={`flex items-center gap-1 ${
          passwordStrength.requirements.special ? 'text-accent' : 'text-tertiary'
        }`}>
          <CheckCircle2 className="h-3 w-3" />
          <span>Special character</span>
        </div>
      </div>
    </div>
  );

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error('Failed to get Google Auth URL', error);
      setError('Failed to initialize Google registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/microsoft/url');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get Microsoft Auth URL', error);
      setError('Failed to initialize Microsoft registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="csrfToken" value={csrfToken} />

      {error && <StatusMessage type="error" message={error} />}

      {/* Username Input */}
      <div className="space-y-2 ">
        <div className="relative">
          <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
            validationState.username.isValid ? 'text-tertiary' : 'text-primary'
          }`} />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={(e) => validateField('username', e.target.value)}
            className={`input focus-highlight w-full pl-10 transition-colors ${
              !validationState.username.isValid ? 'border-primary' : ''
            }`}
            required
          />
        </div>
        {!validationState.username.isValid && (
          <p className="text-sm text-primary pl-10 animate-fade-in">
            {validationState.username.message}
          </p>
        )}
      </div>

      {/* Email Input */}
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

      {/* Password Input */}
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
        {formData.password && <PasswordStrengthIndicator />}
        {!validationState.password.isValid && (
          <p className="text-sm text-primary pl-10 animate-fade-in">
            {validationState.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <div className="relative">
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
            validationState.confirmPassword.isValid ? 'text-tertiary' : 'text-primary'
          }`} />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={(e) => validateField('confirmPassword', e.target.value)}
            className={`input focus-highlight w-full pl-10 transition-colors ${
              !validationState.confirmPassword.isValid ? 'border-primary' : ''
            }`}
            required
          />
        </div>
        {!validationState.confirmPassword.isValid && (
          <p className="text-sm text-primary pl-10 animate-fade-in">
            {validationState.confirmPassword.message}
          </p>
        )}
      </div>

     {/* Submit Button */}
     <button
        type="submit"
        disabled={isLoading}
        className="btn w-full bg-secondary text-background"
      >
        {isLoading ? (
          <span className="animate-pulse ">Creating Account...</span>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Add Social Registration Options */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-tertiary"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-secondary">Or register with</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="btn w-full text-background border border-tertiary hover:border-primary flex items-center justify-center gap-2"
        >
          <FcGoogle className="h-5 w-5" />
          {isLoading ? 'Loading...' : 'Continue with Google'}
        </button>

        <button
          type="button"
          onClick={handleMicrosoftRegister}
          disabled={isLoading}
          className="btn w-full text-background border border-tertiary hover:border-primary flex items-center justify-center gap-2"
        >
          <TfiMicrosoftAlt className="h-5 w-5" />
          {isLoading ? 'Loading...' : 'Continue with Microsoft'}
        </button>
      </div>

      {/* Optional: Add terms and conditions agreement */}
      <p className="text-sm text-tertiary text-center mt-4">
        By registering, you agree to our{' '}
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