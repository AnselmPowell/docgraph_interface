// src/app/components/research/Search/SearchBar.client.jsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  
  FileText, 
  Tag, 
  X, 
  ChevronDown, 
  ChevronUp,
  Search,
  Loader2,
  Sparkles
} from 'lucide-react';


// Add SparklesCore component for animation
const SparklesCore = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 animate-pulse duration-1000" />
    </div>
  );
};

export function SearchBar({
  visible = true,
  onSearch,
  onClose,
  selectedDocuments = [],
  isSearching,
  onToggleVisibility, // Add new prop
  onSelect,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [context, setContext] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentsToSearch, setDocumentsToSearch] = useState([...selectedDocuments]);

  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const keywordInputRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`; // Max height of 200px
    }
  
  }, [context]);

  useEffect(() => {
    if(!isSearching) {
      setIsProcessing(false)
    }

  },[isSearching])

  useEffect(() => {
    setDocumentsToSearch([...selectedDocuments])

  },[selectedDocuments])

  // Keyword management
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

  // Search handling
  const handleSubmit = useCallback(() => {
    if (!context.trim()) return;
    
    setIsProcessing(true); // Show loading in search button

    
    const searchParams = {
      context: context.trim(),
      keywords: !keywords || keywords < 1 ? ["No Keywords Provided"] : keywords
    };
  
    onSearch?.(searchParams);
    setIsExpanded(false);
  }, [context, keywords, onSearch]);

  // Clear search
  const handleClear = useCallback(() => {
    setContext('');
    setKeywords([]);
    setKeywordInput('');
    onClose?.();
  }, [onClose]);


if (!visible) {
  return (
    <div className="relative">
      {/* Popup for selected documents */}
          {selectedDocuments.length > 0 && (
      <div className="absolute -top-[0] right-2 mb-2">
        <div className="relative">
          {/* Compact round popup bubble */}
          <div className="
            bg-gradient-to-br from-primary/70 to-primary/80
            text-white px-4 py-4
            rounded-full
            text-xs font-medium
            shadow-[0_4px_12px_rgba(0,0,0,0.08)]
            backdrop-blur-sm
            border border-white/20
            animate-[wiggle_0.6s_ease-in-out,fadeOut_2s_ease-in-out]
          ">
            {/* Compact content */}
            <div className="flex items-center gap-1.5 text-black">
              <span>{selectedDocuments.length} Selected</span>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Search Button */}
      <button
        onClick={() => onToggleVisibility(true)}
        className={`fixed bottom-10 right-36 
          p-8
          rounded-full 
          bg-white/95
          shadow-[0_8px_30px_rgb(0,0,0,0.06)]
          border border-tertiary/20
          group 
          hover:bg-white
          hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)]
          hover:border-primary/20
          hover:scale-105 
          transition-all duration-500 ease-out z-50
          ${selectedDocuments.length > 0 ? 'animate-[wiggle_1s_ease-in-out] brightness-110' : ''}
        `}
        title={`${selectedDocuments.length} document${selectedDocuments.length !== 1 ? 's' : ''} selected`}
      >
        <div className="relative flex items-center justify-center gap-4">
          <Sparkles 
            className={`absolute w-9 h-9 
              text-primary/10
              ${selectedDocuments.length > 0 ? 'opacity-80' : 'opacity-20'}
              group-hover:opacity-80 
              group-hover:rotate-6
              transition-all duration-500
            `} 
          />
        </div>
      </button>
    </div>
  );
}
  
  return (
    <div ref={containerRef} className="fixed bottom-10 left-1/2 -translate-x-1/2 
      w-full max-w-5xl mx-auto px-4 z-30">
      
      <div className="max-w-5xl mx-auto items-center p-3">
        
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : '80px',
          }}
          transition={{ duration: 0.2 }}
          className={`
            ${isExpanded ? 'rounded-xl p-5' : 'rounded-full'}
            bg-white border border-tertiary/20 shadow-sm overflow-hidden
            relative group
          `}
        >
           {/* Hide Button */}
        <button
          onClick={() => onToggleVisibility(false)}
          className="absolute top-3 right-3 
            px-3 py-1.5  pt-4
            rounded-full
            bg-background/50 backdrop-blur-sm
            text-tertiary hover:text-primary
            text-m font-medium
            flex items-center gap-1.5
            hover:bg-tertiary/5 hover:border-primary/30
            transition-all duration-200 z-50
            group"
        >
          <span>Hide</span>
        </button>
        




                  {isExpanded && ( 
            <>
              <div className="space-y-4 pt-2">
                {/* Header with guidance */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <h3 className="text-sm font-medium text-primary">
                      Search Documents
                    </h3>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 
                      bg-primary/5 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <span className="text-xs text-primary/70">
                        {documentsToSearch.length} selected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document Selection Area */}
                <div className={`
                  relative 
                  ${documentsToSearch.length === 0 ? 'bg-tertiary/5' : 'bg-white'}
                  transition-colors duration-300
                `}>
                  {documentsToSearch.length === 0 ? (
                    // Empty State
                    <div className=" p-5 flex flex-col items-center text-center">
                      <div className=" rounded-full bg-tertiary/5 mb-1">
                        <FileText className="w-5 h-5 text-tertiary/50" />
                      </div>
                      <p className="text-sm text-primary/70">
                        Select documents to search through
                      </p>
                      <p className="text-xs text-tertiary max-w-[250px]">
                        {"Click the 'Select' button next to documents in the left sidebar"}
                      </p>
                    </div>
                  ) : ( 
                    // Selected Documents
                    <div className="">
                      <div className="flex flex-wrap gap-2">
                        {documentsToSearch.map((docFileName) => (
                          <div
                            key={docFileName}
                            className="group flex items-center gap-2 
                              pl-3 pr-2 py-1.5 
                              bg-tertiary/5 hover:bg-tertiary/10
                              rounded-full border 
                              hover:border-primary/20
                              transition-all duration-200"
                          >
                            <span className="text-sm text-primary/70 truncate max-w-[180px]">
                              {docFileName}
                            </span>
                            <button
                              onClick={() => {
                                 const updatedDocouments = documentsToSearch.filter(id => id !== docFileName)
                                 setDocumentsToSearch(updatedDocouments)
                                 onSelect(updatedDocouments)
                                 
                              
                              }
                                
                              }
                              className="p-1 rounded-full
                                text-tertiary hover:text-primary
                                hover:bg-white/50
                                transition-colors duration-200"
                              title="Remove from search"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Helpful hint */}
                      <div className="my-3 flex items-center gap-2 px-1">
                        <div className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full 
                            rounded-full bg-primary/30"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 
                            bg-primary/50"></span>
                        </div>
                        <p className="text-xs text-tertiary">
                          Select more documents to expand your search
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}



          {/* Main Search Input */}
            <div className={`flex items-center w-auto
               ${isExpanded ? 'pb-5'  : 'h-[80px]' }`}>

                {isExpanded ? null : (<button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className=" p-4 rounded-lg hover:bg-tertiary/10 text-tertiary
                    transition-colors"
                >  <Search className="w-6 h-6" />
                </button>
                )}
                <div className={`relative flex hide-scrollbar w-full
                  
                  ${isExpanded  ?  "rounded-xl" :  "rounded-full"} `}>
                  <textarea
                    ref={textareaRef}
                    value={context}
                    onChange={(e) => {
                      setContext(e.target.value);
                      // Auto-resize
                      e.target.style.height = 'inherit';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onFocus={() => setIsExpanded(true)}
                    onClick={() => setIsExpanded(true)}
                    placeholder="Enter your research query to search the papaer..."
                    className={`
                      ${isExpanded  ? 'min-h-[160px] p-3  border-2'
                        : 'min-h-[100px] flex items-center justify-center border-none relative top-3 p-3 pt-10 ' } 
                      w-full bg-white text-primary rounded-xl
                      
                       border-tertiary/20 
                      placeholder:text-tertiary/50 
                      focus:outline-none focus:border-primary/30 focus:ring-2 
                      focus:ring-primary/20 
                      
                      transition-all duration-200 
                  
                      hover:border-primary/30 hide-scrollbar`}
                    style={{
                      minHeight: '80px',
                      maxHeight: '400px'
                    }}
                  />

                  {/* Character Count */}
                  {context.length > 0 && (
                    <div className="absolute bottom-2 right-4 px-2 pt-3 
                      bg-background/80 rounded-md text-xs text-tertiary 
                      backdrop-blur-sm "
                    >
                      {context.length}/2000 characters
                    </div>
                  )}
                    
                </div>
              
          </div>

         {/* Expanded Content */}
         <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className=" border-tertiary/10"
              >
                
                  {/* Right Column - Keywords */}
                  
                    <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Keywords
                    </h3>
                    <div className="bg-tertiary/5 rounded-lg p-3">
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                              bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(keyword)}
                              className="p-0.5 hover:bg-primary/20 rounded-full"
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
                          className="flex-1 min-w-[150px] px-2 py-1 bg-transparent text-primary 
                            placeholder:text-tertiary/60 focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                {/* Action Bar */}
                <div className=" bg-tertiary/5 border-tertiary/10 
                  flex items-center justify-between">
                  <p className="text-xs text-tertiary flex items-center gap-1">
                    Press <span className="font-medium px-1 py-0.5 bg-tertiary/10 rounded-md">⏎ Enter</span> 
                    to add keywords
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleClear}
                      className="px-2 py-2 text-sm text-tertiary hover:text-primary 
                        hover:bg-tertiary/10 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!context.trim() || isProcessing}
                      className="px-6 py-2.5 text-sm font-medium
                          bg-gradient-to-b from-gray-50 to-gray-100
                          text-gray-900 rounded-lg
                          border border-gray-200
                          shadow-sm 
                          hover:bg-gray-100 hover:border-gray-300 hover:translate-y-[1px]
                          active:bg-gray-200 active:translate-y-[2px]
                          disabled:opacity-50 disabled:cursor-not-allowed 
                          disabled:hover:translate-y-0
                          transition-all duration-150 ease-in-out
                          flex items-center gap-2 overflow-hidden "
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
        
    
  )
  
  }