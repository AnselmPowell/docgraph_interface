// src/app/components/header/ProfileSection/SignInButton.client.jsx
'use client';

import { LogIn } from 'lucide-react';

export default function SignInButton({ onClick, isLoading }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md
                text-xl font-semibold text-gray-200 text-tertiary hover:text-gray-800
                 hover:bg-tertiary/10 transition-colors"
    >
    
      <span>Sign In</span>
    </button>
  );
}