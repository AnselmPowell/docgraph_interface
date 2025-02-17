'use client';

import { XCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StatusMessage({ type, message }) {
  const variants = {
    error: {
      icon: <XCircle className="h-4 w-4" />,
      styles: `
        border-l-2 border-l-primary
        bg-background/50
      `
    },
    success: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      styles: `
        border-l-2 border-l-accent
        bg-background/50
      `
    },
    warning: {
      icon: <AlertCircle className="h-4 w-4" />,
      styles: `
        border-l-2 border-l-tertiary
        bg-background/50
      `
    }
  };

  const variant = variants[type] || variants.error;

  return (
    <div 
      role="alert" 
      className={`
        ${variant.styles}
        rounded-sm
        py-4 px-3
        animate-fade-in
        transition-fast
      `}
    >
      <div className="flex items-center justify-start min-h-[20px]">
        <div className={`${
          type === 'error' ? 'text-primary' : 
          type === 'success' ? 'text-accent' : 
          'text-tertiary'
        }`}>
          {variant.icon}
        </div>
        <span className="ml-2 text-xs text-primary">
          {message}
        </span>
      </div>
    </div>
  );
}