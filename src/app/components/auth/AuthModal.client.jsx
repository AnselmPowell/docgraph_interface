// src/app/components/auth/AuthModal.client.jsx
'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm.client';
import RegisterForm from './RegisterForm.client';

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
  const [view, setView] = useState(initialView);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-fade-in">
        <div className="card shadow-xl  p-6 ">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-6 text-tertiary hover:text-primary transition-fast"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Professional Toggle Tabs */}
          <div className="relative mb-6 mt-2 items-center justify-center">
            {/* Tab Container */}
            <div className="flex border-b border-tertiary/20 justify-center space-x-8">
              <button
                onClick={() => setView('login')}
                className={`relative py-2 px-4 transition-fast ${
                  view === 'login'
                    ? 'text-primary font-medium'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Login
                {/* Active Tab Indicator */}
                {view === 'login' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-fade-in" />
                )}
              </button>
              <button
                onClick={() => setView('register')}
                className={`relative py-2 px-4 transition-fast ${
                  view === 'register'
                    ? 'text-primary font-medium'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Register
                {/* Active Tab Indicator */}
                {view === 'register' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-fade-in" />
                )}
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="overflow-y-auto h-[425px] pr-2 overflow-auto hide-scrollbar"> {/* Scrollable content area */}
            <div className={`${view === 'login' ? 'animate-fade-in' : 'animate-fade-in'} `}>
              {view === 'login' ? (
                <div className="w-full">
                  <LoginForm />
                </div>
              ) : (
                <div className="w-full">
                  <RegisterForm />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}