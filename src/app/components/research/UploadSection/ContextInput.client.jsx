// src/app/components/research/UploadSection/ContextInput.client.jsx
'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export function ContextInput({ isProcessing, value, onChange }) {
  const [charCount, setCharCount] = useState(0);
  const maxChars = 1000; // ~200 words

  const handleChange = (e) => {
    const text = e.target.value;
    setCharCount(text.length);
    onChange(text);
  };

  // Character count color
  const getCounterColor = () => {
    const remaining = maxChars - charCount;
    if (remaining <= 100) return 'text-primary';
    if (remaining <= 300) return 'text-yellow-500';
    return 'text-tertiary';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-primary">
          Research Context <span className="text-primary">*</span>
        </label>
        <div className={`text-xs ${getCounterColor()} transition-colors`}>
          {maxChars - charCount} characters remaining
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          disabled={isProcessing}
          maxLength={maxChars}
          placeholder="Describe what you're researching and what kind of information you're looking for..."
          className={`
            w-full h-32 p-4 rounded-lg
            bg-background text-primary
            border border-tertiary/20
            hover:border-tertiary/40
            focus:border-primary focus:ring-1 focus:ring-primary
            transition-colors duration-200
            placeholder:text-tertiary/50
            resize-none
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        
        {/* Visual feedback indicator */}
        {value && (
          <div className={`
            absolute top-2 right-2 p-1 rounded-full
            transition-colors duration-200
            ${value.length >= 50 ? 'bg-green-500/10' : 'bg-yellow-500/10'}
          `}>
            {value.length >= 50 ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-tertiary">
        Provide specific details about your research topic and what information you're seeking.
        A detailed context helps find more relevant matches.
      </p>
    </div>
  );
}