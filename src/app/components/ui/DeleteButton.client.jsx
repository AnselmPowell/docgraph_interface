// src/app/components/ui/DeleteButton.client.jsx
'use client';

import { Loader2, Trash2 } from 'lucide-react';

export function DeleteButton({ 
  isDeleting = false, 
  onDelete, 
  className = '', 
  ...props 
}) {
  return (
    <button
      onClick={onDelete}
      disabled={isDeleting}
      className={`
        group
        p-1
        rounded-lg
        bg-background/90 
        backdrop-blur-sm
        border border-transparent
        hover:border-primary
        hover:shadow-md
        transition-fast
        focus-highlight
        ${isDeleting ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {isDeleting ? (
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      ) : (
        <Trash2 
          className="
            w-5 h-5 
            text-primary/70 
            group-hover:text-primary 
            transform
            group-hover:scale-110
            transition-fast
          "
        />
      )}
    </button>
  );
}