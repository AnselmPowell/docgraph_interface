// src/app/components/research/DocumentViewer/components/SearchOverlay.client.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useDocumentViewer } from '../context/DocumentViewerContext';

export function SearchOverlay() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentPage,
    setCurrentPage,
    searchVisible,
    setSearchVisible
  } = useDocumentViewer();

  const [currentMatch, setCurrentMatch] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset current match when results change
  useEffect(() => {
    setCurrentMatch(0);
  }, [searchResults]);

  // Handle search input
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Execute search
  const handleSearch = useCallback(async () => {
    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      setSearchQuery(searchInput.trim());
      // Search logic is handled by the PDFRenderer component
    } finally {
      setLoading(false);
    }
  }, [searchInput, setSearchQuery]);

  // Navigate between matches
  const navigateMatches = useCallback((direction) => {
    const total = searchResults.length;
    if (total === 0) return;

    let nextMatch;
    if (direction === 'next') {
      nextMatch = (currentMatch + 1) % total;
    } else {
      nextMatch = (currentMatch - 1 + total) % total;
    }

    setCurrentMatch(nextMatch);
    const result = searchResults[nextMatch];
    if (result?.page) {
      setCurrentPage(result.page);
    }
  }, [currentMatch, searchResults, setCurrentPage]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSearch();
      } else if (e.key === 'Enter' && !e.ctrlKey) {
        navigateMatches('next');
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setSearchVisible(true);
      } else if (e.key === 'Escape') {
        setSearchVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSearch, navigateMatches, setSearchVisible]);

  if (!searchVisible) return null;

  return (
    <div className="absolute top-4 right-4 z-20 w-96 bg-background rounded-lg border border-tertiary/10 shadow-lg animate-in fade-in slide-in-from-right-4">
      {/* Search Header */}
      <div className="flex items-center p-3 border-b border-tertiary/10">
        <Search className="w-5 h-5 text-tertiary mr-2" />
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search document..."
          className="flex-1 bg-transparent border-none focus:outline-none text-primary placeholder:text-tertiary/50"
          autoFocus
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="p-1 hover:bg-tertiary/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-tertiary" />
          </button>
        )}
        <button
          onClick={() => setSearchVisible(false)}
          className="ml-2 p-1 hover:bg-tertiary/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-tertiary" />
        </button>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="p-3">
          {loading ? (
            <div className="text-sm text-tertiary text-center py-2">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {/* Results Navigation */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-tertiary">
                  {currentMatch + 1} of {searchResults.length} matches
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => navigateMatches('prev')}
                    className="p-1 hover:bg-tertiary/10 rounded transition-colors"
                  >
                    <ChevronUp className="w-4 h-4 text-tertiary" />
                  </button>
                  <button
                    onClick={() => navigateMatches('next')}
                    className="p-1 hover:bg-tertiary/10 rounded transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-tertiary" />
                  </button>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentMatch(index);
                      setCurrentPage(result.page);
                    }}
                    className={`
                      w-full text-left p-2 rounded-lg text-sm
                      transition-colors duration-200
                      ${index === currentMatch 
                        ? 'bg-primary/10' 
                        : 'hover:bg-tertiary/5'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-tertiary">Page {result.page}</span>
                      {index === currentMatch && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-secondary line-clamp-2">
                      {result.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-tertiary text-center py-2">
              No matches found
            </div>
          )}

          {/* Search Tips */}
          <div className="mt-4 pt-3 border-t border-tertiary/10">
            <p className="text-xs text-tertiary">
              Pro tip: Use Ctrl+F to search, Enter to jump between matches
            </p>
          </div>
        </div>
      )}
    </div>
  );
}