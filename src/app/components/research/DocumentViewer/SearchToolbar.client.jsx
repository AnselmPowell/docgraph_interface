// src/app/components/research/DocumentViewer/SearchToolbar.client.jsx
'use client';


import { useState } from 'react';
import { Search, ArrowUp, ArrowDown, X, Loader2 } from 'lucide-react';



export function SearchToolbar({ 
    onSearch, 
    onNavigate,
    totalResults = 0, 
    currentMatch = 0,
    isSearching = false
  }) {
    const [inputValue, setInputValue] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch(inputValue);
    };
  
    return (
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 px-4 py-2 border-tertiary/10">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search in document (press Enter)"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-tertiary/5 
                       border border-tertiary/10 focus:border-primary 
                       text-sm text-primary placeholder:text-tertiary"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                onSearch('');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 
                         rounded-full hover:bg-tertiary/10 text-tertiary 
                         hover:text-primary transition-colors active:translate-y-[0.5px] active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
  
        {isSearching ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-tertiary">Searching...</span>
          </div>
        ) : inputValue && totalResults > 0 ? (
          <>
            <div className="flex items-center gap-1 text-sm text-tertiary">
              <span>{currentMatch}</span>
              <span>/</span>
              <span>{totalResults}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                className="p-1.5 rounded hover:bg-tertiary/10 text-tertiary 
                           hover:text-primary transition-colors active:translate-y-[0.5px] active:scale-95"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                className="p-1.5 rounded hover:bg-tertiary/10 text-tertiary 
                           hover:text-primary transition-colors active:translate-y-[0.5px] active:scale-95"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : null}
      </form>
    );
  }