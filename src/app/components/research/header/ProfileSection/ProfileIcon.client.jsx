
// src/app/components/header/ProfileSection/ProfileIcon.client.jsx
'use client';

import { UserCircle } from 'lucide-react';

export default function ProfileIcon({ user, onClick, size = 'md' }) {
  // Simple size variants
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-base'
  };

  // If no user, show default icon
  if (!user) {
    return (
      <button 
        onClick={onClick}
        className={`
          flex items-center justify-center 
          rounded-full bg-gray-100
          ${sizes[size]}
        `}
      >
        <UserCircle className="w-5 h-5 text-gray-500" />
      </button>
    );
  }

  // Get user initials
  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user.email?.[0]?.toUpperCase() || '';

    return (
      <button  
        onClick={onClick}
        className={`
          flex items-center justify-center
          rounded-full
          bg-white
          border-2 border-gray-700
          shadow-md
          transition-all duration-200
          hover:bg-gray-100 hover:border-gray-900
         
          ${sizes[size]}
        `}
      >
        <span className="font-bold text-gray-700">
          {initials}
        </span>
      </button>
    );
}

// active:scale-95