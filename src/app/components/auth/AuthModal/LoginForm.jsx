
// src/app/components/auth/AuthModal/LoginForm.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub, BsMicrosoft, BsApple } from 'react-icons/bs';
import { IoMailOutline } from 'react-icons/io5';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Loader2 } from 'lucide-react';
// import { useAuth } from '../../../hooks/useAuth';
import { useAuth } from '../../../contexts/AuthContext.client'
import { FormInput } from '../FormInput';
import { toast } from '../../messages/Toast.client';


export default function LoginForm({ onClose, fetchDocs }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);;

  const { login, updateUser } = useAuth();
  const router = useRouter();


const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const result = await login(formData);
      console.log("[LoginForm] Login successful:", result.user.email);
      updateUser(result.user);
      toast.success('Welcome back!');
      setTimeout(() => {
        onClose();
      }, 100);
      await fetchDocs();
      
    } catch (error) {
      console.error("[LoginForm] Login failed:", error);
      // Extract the error message safely
      const errorMessage = error?.message || String(error);
      setErrors(errorMessage)
      if(["Failed to fetch"].includes(errorMessage)) {
        toast.error("Unable to log in, try again later"); 
      } else {
        toast.error(errorMessage); 

      }
  } finally {
      setIsLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '', form: '' }));
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
          Continue with Microsoft Account
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
        
    

    <div className="space-y-4">
      
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
      />

      <FormInput
        icon={RiLockPasswordLine}
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={isLoading}
        required
      />
    </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-gray-300 text-emerald-500 
                       focus:ring-emerald-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <button type="button" className="text-sm text-emerald-600 hover:text-emerald-500">
            Forgot password?
          </button>
        </div>

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
              Signing in...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </div>
  );
}