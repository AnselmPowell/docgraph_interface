// src/app/components/research/UploadSection/ThemeSelector.client.jsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Edit2, Check, X } from 'lucide-react';

export function ThemeSelector({ isProcessing, selectedTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTheme, setNewTheme] = useState('');
  const [themes, setThemes] = useState([
    { id: '1', name: 'Academic Research' },
    { id: '2', name: 'Literature Review' },
    { id: '3', name: 'Case Study' },
    // We'll fetch these from backend later
  ]);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle theme creation
  const handleCreateTheme = useCallback(() => {
    if (!newTheme.trim()) return;
    
    const theme = {
      id: `new-${Date.now()}`,
      name: newTheme.trim(),
      isNew: true
    };

    setThemes(prev => [...prev, theme]);
    onThemeChange(theme);
    setNewTheme('');
    setIsCreating(false);
    setIsOpen(false);
  }, [newTheme, onThemeChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary">
        Research Theme <span className="text-primary">*</span>
      </label>

      <div ref={dropdownRef} className="relative">
        {/* Selected Theme Display / Create New Theme Input */}
        <div
          onClick={() => !isProcessing && !isCreating && setIsOpen(!isOpen)}
          className={`
            relative w-full p-3 rounded-lg
            bg-background
            border border-tertiary/20
            ${!isProcessing && !isCreating ? 'cursor-pointer hover:border-tertiary/40' : ''}
            transition-colors duration-200
          `}
        >
          {isCreating ? (
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={newTheme}
                onChange={(e) => setNewTheme(e.target.value)}
                placeholder="Enter new theme name..."
                className="flex-1 bg-transparent focus:outline-none text-primary"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCreateTheme}
                  className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                >
                  <Check className="w-4 h-4 text-primary" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-tertiary" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className={selectedTheme ? 'text-primary' : 'text-tertiary'}>
                  {selectedTheme ? selectedTheme.name : 'Select research theme'}
                </span>
                <ChevronDown className={`
                  w-4 h-4 text-tertiary transition-transform duration-200
                  ${isOpen ? 'transform rotate-180' : ''}
                `} />
              </div>
            </>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && !isCreating && (
          <div className="
            absolute z-50 w-full mt-1
            bg-background rounded-lg
            border border-tertiary/20
            shadow-lg
            animate-in fade-in slide-in-from-top-2
          ">
            <div className="max-h-60 overflow-auto py-1">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onThemeChange(theme);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2 text-left
                    flex items-center justify-between
                    hover:bg-tertiary/5
                    transition-colors duration-200
                    ${selectedTheme?.id === theme.id ? 'text-primary' : 'text-secondary'}
                  `}
                >
                  <span>{theme.name}</span>
                  {selectedTheme?.id === theme.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}

              {/* Create New Theme Option */}
              <button
                type="button"
                onClick={() => {
                  setIsCreating(true);
                  setIsOpen(false);
                }}
                className="
                  w-full px-4 py-2 text-left
                  flex items-center gap-2
                  text-primary hover:bg-tertiary/5
                  transition-colors duration-200
                "
              >
                <Plus className="w-4 h-4" />
                <span>Create New Theme</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-tertiary">
        Select an existing theme or create a new one to organize your research
      </p>
    </div>
  );
}