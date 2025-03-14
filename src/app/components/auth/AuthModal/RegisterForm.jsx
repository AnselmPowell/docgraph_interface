
// src/app/components/auth/AuthModal/RegisterForm.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub, BsMicrosoft, BsApple } from 'react-icons/bs';
import { IoMailOutline, IoPersonOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { FormInput } from '../FormInput';
import  {toast} from '../../messages/Toast.client'

export default function RegisterForm({ onClose }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, and numbers';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setIsLoading(true);

    try {
         await register({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            confirm_password: formData.password,
        });
        
        console.log("[RegisterForm] Registration successful"); // Dev logging
        toast.success('Account created successfully! Welcome to DocGraph');
        
        await onClose();
    } catch (error) {
        console.error("[RegisterForm] Registration error:", error); // Dev logging
        
        // User-friendly error messages based on error type
        if (error.message.includes('email already exists')) {
            setErrors({
                form: 'This email is already registered'
            });
        } else if (error.message.includes('validation')) {
            setErrors({
                form: 'Please check all required fields'
            });
        } 
    } finally {
        setIsLoading(false);
    }
};

// Handle Google login
const handleGoogleLogin = async () => {
  setIsLoading(true);
  try {
    console.log(" google auth")
    const response = await fetch('/api/auth/google/url');
    const { url } = await response.json();
    console.log(" google redirct url: ", url )
    router.push(url);
  } catch (error) {
    console.error('Failed to get Google Auth URL', error);
    setError('Failed to initialize Microsoft login');
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



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '', form: '' }));
  };

  return (
    <div className="space-y-6">
       {/* Social Login Buttons */}
       <div className="space-y-3">
        <button  
        onClick={handleGoogleLogin}
        
        className="w-full flex items-center justify-start gap-3 px-8 py-2.5 
                         border border-gray-300 rounded-lg text-sm font-medium text-gray-700
                         hover:bg-gray-50 transition-colors">
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>
        <button 
        onClick={handleMicrosoftLogin}
        className="w-full flex items-center justify-start gap-3 px-8 py-2.5 
                         border border-gray-300 rounded-lg text-sm font-medium text-gray-700
                         hover:bg-gray-50 transition-colors">
          <BsMicrosoft className="w-5 h-5 text-blue-500" />
          Continue with Microsoft
        </button>
        <button className="w-full flex items-center justify-start gap-3 px-8 py-2.5 
                         border border-gray-300 rounded-lg text-sm font-medium text-gray-700
                         hover:bg-gray-50 transition-colors">
          <BsGithub className="w-5 h-5" />
          Continue with Github
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm 
                        animate-in fade-in slide-in-from-top duration-200">
            {errors.form}
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            icon={IoPersonOutline}
            name="first_name"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            disabled={isLoading}
            required
            className="h-12"
          />

          <FormInput
            icon={IoPersonOutline}
            name="last_name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            disabled={isLoading}
            required
            className="h-12"
          />
        </div>

        {/* Email Field */}
        <FormInput
          icon={IoMailOutline}
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          required
          className="h-12"
        />

        {/* Password Fields */}
        <div className="space-y-3">
          <FormInput
            icon={RiLockPasswordLine}
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            required
            className="h-12"
          />

          <FormInput
            icon={RiLockPasswordLine}
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isLoading}
            required
            className="h-12"
          />
        </div>

        {/* Password Requirements */}
        {formData.password && (
          <div className="text-xs text-gray-500 space-y-1">
            <p className={formData.password.length >= 8 ? 'text-emerald-600' : ''}>
              • At least 8 characters
            </p>
            <p className={/[A-Z]/.test(formData.password) ? 'text-emerald-600' : ''}>
              • One uppercase letter
            </p>
            <p className={/[a-z]/.test(formData.password) ? 'text-emerald-600' : ''}>
              • One lowercase letter
            </p>
            <p className={/[0-9]/.test(formData.password) ? 'text-emerald-600' : ''}>
              • One number
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-emerald-500 text-white font-medium rounded-lg
                   hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-100
                   transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
        </p>
      </form>
    </div>
  );
}