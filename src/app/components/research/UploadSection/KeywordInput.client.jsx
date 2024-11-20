// src/app/components/research/UploadSection/KeywordInput.client.jsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { toast } from '../../ui/Toast.client';

export function KeywordInput({ isProcessing, keywords, onKeywordsChange }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Add keyword handler
  const addKeyword = useCallback(() => {
    const trimmedInput = input.trim().toLowerCase();
    
    if (!trimmedInput) return;
    
    if (trimmedInput.length < 2) {
      toast.warning('Keywords must be at least 2 characters long');
      return;
    }

    if (keywords.includes(trimmedInput)) {
      toast.warning('This keyword has already been added');
      return;
    }

    if (keywords.length >= 10) {
      toast.warning('Maximum 10 keywords allowed');
      return;
    }

    onKeywordsChange([...keywords, trimmedInput]);
    setInput('');
    inputRef.current?.focus();
  }, [input, keywords, onKeywordsChange]);

  // Remove keyword handler
  const removeKeyword = useCallback((keywordToRemove) => {
    onKeywordsChange(keywords.filter(k => k !== keywordToRemove));
  }, [keywords, onKeywordsChange]);

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  }, [addKeyword]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-primary">
        Keywords (Optional)
      </label>

      {/* Input Section */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            placeholder="Add research keywords..."
            className={`
              w-full pl-9 pr-3 py-2 rounded-lg
              bg-background text-primary
              border border-tertiary/20
              hover:border-tertiary/40
              focus:border-primary focus:ring-1 focus:ring-primary
              transition-colors duration-200
              placeholder:text-tertiary/50
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
          <Tag className="w-4 h-4 text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="button"
          onClick={addKeyword}
          disabled={!input.trim() || isProcessing}
          className={`
            px-4 py-2 rounded-lg
            bg-primary text-background
            hover:bg-primary/90
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            flex items-center gap-2
          `}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Keywords Display */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
          {keywords.map((keyword, index) => (
            <span
              key={keyword}
              className={`
                group relative
                inline-flex items-center
                px-3 py-1 rounded-full
                bg-primary/10 text-primary text-sm
                animate-in fade-in slide-in-from-left-${index}
              `}
            >
              {keyword}
              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className={`
                    ml-2 p-0.5 rounded-full
                    opacity-0 group-hover:opacity-100
                    hover:bg-primary/20
                    transition-all duration-200
                  `}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Helper text */}
      <div className="flex flex-col gap-1 text-xs text-tertiary">
        <p>Add keywords to improve search accuracy (max 10 keywords)</p>
        <p>Press Enter or click Add to insert keywords</p>
        {keywords.length > 0 && (
          <p className="text-secondary">
            {keywords.length}/10 keywords added
          </p>
        )}
      </div>
    </div>
  );
}