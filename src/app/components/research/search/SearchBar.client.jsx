// src/app/components/research/Search/SearchBar.client.jsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronUp, Book, Tag, X, Plus } from 'lucide-react';

import { useSearchCache } from '../../../hooks/useSearchCache';

export function SearchBar({
  visible = false,
  onSearch,
  onClose
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [context, setContext] = useState('');
  const [theme, setTheme] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const containerRef = useRef(null);
  const keywordInputRef = useRef(null);

  const { 
    cacheSearchParams, 
    getCachedParams 
  } = useSearchCache();

  const handleClickOutside = useCallback((event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsExpanded(false);
      setShowThemeDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

   // Add cache initialization effect
   useEffect(() => {
    const restoreSearchState = async () => {
      if (visible) {
        const cachedParams = await getCachedParams();
        if (cachedParams) {
          setContext(cachedParams.context || '');
          setTheme(cachedParams.theme || null);
          setKeywords(cachedParams.keywords || []);
        }
      }
    };

    restoreSearchState();
  }, [visible, getCachedParams]);


  // Sample themes (replace with actual data)
  const themes = [
    { id: '1', name: 'Academic Research' },
    { id: '2', name: 'Literature Review' },
    { id: '3', name: 'Case Study' }
  ];

 



  const addKeyword = useCallback((keyword) => {
    const trimmed = keyword.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords(prev => [...prev, trimmed]);
      setKeywordInput('');
    }
  }, [keywords]);

  const removeKeyword = useCallback((keywordToRemove) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove));
  }, []);


  const handleSubmit = useCallback(() => {
    if (!context.trim() || !theme) return;
    
    const searchParams = {
      context: context.trim(),
      theme,
      keywords
    };

    // Cache search parameters
    cacheSearchParams(searchParams);
    onSearch?.(searchParams);
    setIsExpanded(false);
  }, [context, theme, keywords, onSearch, cacheSearchParams]);

  if (!visible) return null;

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        animate={{ 
          height: isExpanded ? 'auto' : '64px',
          borderRadius: isExpanded ? '12px 12px 0 0' : '0'
        }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl bg-background border border-tertiary/10 shadow-lg overflow-hidden z-40"
      >
        {/* Context Input */}
        <div className="flex items-center px-4 h-16">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
            <input
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Enter your research context..."
              onFocus={() => setIsExpanded(true)}
              className="w-full pl-9 pr-4 py-2 bg-transparent text-primary placeholder:text-tertiary/50 focus:outline-none"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 p-2 rounded-lg hover:bg-tertiary/10 text-tertiary"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-4 h-4" />
            </motion.div>
          </button>
        </div>

        {/* Expanded Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-tertiary/10"
            >
              {/* Theme Selection */}
              <div className="p-4 border-b border-tertiary/10">
                <div className="relative">
                  <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                  <input
                    readOnly
                    value={theme?.name ?? ''}
                    placeholder="Select a research theme..."
                    onFocus={() => setShowThemeDropdown(true)}
                    className="w-full pl-9 pr-4 py-2 bg-transparent text-primary placeholder:text-tertiary/50 focus:outline-none cursor-pointer"
                  />
                  
                  {/* Theme Dropdown */}
                  <AnimatePresence>
                    {showThemeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-background border border-tertiary/10 rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setTheme(t);
                              setShowThemeDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-tertiary/5 transition-colors"
                          >
                            {t.name}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => {
                            // Handle new theme creation
                            setShowThemeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-primary hover:bg-tertiary/5 transition-colors flex items-center gap-2 border-t border-tertiary/10"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create New Theme</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Keywords */}
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <span
                      // Continuing src/app/components/research/Search/SearchBar.client.jsx

                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  <input
                    ref={keywordInputRef}
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && keywordInput.trim()) {
                        addKeyword(keywordInput);
                      }
                    }}
                    placeholder={keywords.length === 0 ? "Add keywords..." : ""}
                    className="flex-1 min-w-[150px] bg-transparent text-primary placeholder:text-tertiary/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-tertiary/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <p className="text-xs text-tertiary">
                    Press Enter to add keywords
                  </p>
                  {context.length > 0 && (
                    <p className="text-xs text-tertiary">
                      {context.trim().split(/\s+/).length}/200 words
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setContext('');
                      setTheme(null);
                      setKeywords([]);
                      setIsExpanded(false);
                      onClose?.();
                    }}
                    className="px-4 py-2 rounded-lg text-tertiary hover:text-primary hover:bg-tertiary/10 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!context.trim() || !theme}
                    className="px-4 py-2 rounded-lg bg-primary text-background hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Search Documents
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}