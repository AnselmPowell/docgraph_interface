// src/app/components/auth/AuthModal/index.jsx
'use client';

import { useEffect, useState } from 'react';
import { X, Github, Mail } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-screen">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        <div className="bg-background rounded-xl shadow-2xl border border-tertiary/10 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full
                     text-tertiary hover:text-primary hover:bg-tertiary/10 
                     transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-4">
            <h2 className="text-2xl font-semibold text-primary text-center">
              {view === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-tertiary text-center mt-1">
              {view === 'login' 
                ? 'Sign in to continue to StudyGraph' 
                : 'Start your research journey with StudyGraph'}
            </p>
          </div>


          {/* Auth Tabs */}
          <div className="px-6">
            <div className="flex p-1 gap-1 bg-tertiary/5 rounded-lg">
              <button
                onClick={() => setView('login')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md
                          transition-all duration-200 ${
                  view === 'login' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-tertiary hover:text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setView('register')}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md
                          transition-all duration-200 ${
                  view === 'register' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-tertiary hover:text-primary'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>


          {/* Form Container */}
          <div className="p-6  max-h-[60%]" >
            {view === 'login' 
              ? <LoginForm onClose={onClose}  /> 
              : <RegisterForm onClose={onClose}  />
            }
          </div>


          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-tertiary">
              {view === 'login' ? (
                <>
                  Don{`'`}t have an account?{' '}
                  <button 
                    onClick={() => setView('register')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setView('login')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}