
// src/app/components/research/DocumentManagement/UrlInput.client.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link, X, Loader2, ArrowRight } from 'lucide-react';
import { toast } from '../../../components/messages/Toast.client';

export function UrlInput({ onUrlSubmit }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Persist the URL input state when component is unmounted
  useEffect(() => {
    const savedUrl = localStorage.getItem('urlInputState');
    if (savedUrl) {
      console.log('Saved URL:', savedUrl)
      setUrl(savedUrl);
      setIsExpanded(true);
    }
    
    return () => {
      // Save state when component unmounts
      if (url.trim()) {
        localStorage.setItem('urlInputState', url);
      } else {
        localStorage.removeItem('urlInputState');
      }
    };
  }, []);

  // Update localStorage whenever URL changes
  useEffect(() => {
    if (url.trim()) {
      localStorage.setItem('urlInputState', url);
    } else {
      localStorage.removeItem('urlInputState');
    }
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    
    // URL format validation
    if (!url.match(/^(https?:\/\/)/i)) {
      toast.error('Please enter a valid URL (starting with http:// or https://)');
      return;
    }
    
    // Basic PDF validation - just a warning
    if (!url.toLowerCase().includes('.pdf') && !url.toLowerCase().includes('/pdf')) {
      toast.warn('URL might not point to a PDF document');
    }
    
    try {
      setIsLoading(true);
      
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('url', url);
  
      // Call the handler with FormData
      await onUrlSubmit(formData);
      
      // Reset the form on success
      setUrl('');
      setIsExpanded(false);
      localStorage.removeItem('urlInputState');
      
    } catch (error) {
      console.error('URL submission error:', error);
      toast.error(error.message || 'Failed to process URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUrl('');
    setIsExpanded(false);
    localStorage.removeItem('urlInputState');
  };

  return (
    <div className=" px-2 pt-3 border-b border-tertiary/10">
        <form onSubmit={handleSubmit} >
          <div className="flex items-center">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter PDF URL..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-tertiary/20 
                  rounded-md focus:outline-none focus:ring-1 focus:ring-primary
                  focus:border-primary transition-colors"
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex w-full items-center justify-between gap-4 px-3">
           
              {isLoading ? (
                <span className="flex items-center justify-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <button
                type="submit"
                className={`
                  py-1.5 rounded-md text-sm font-medium flex items-center justify-center gap-2              
                            text-gray-900 
                            shadow-lg              
                            active:translate-y-[0.5px] active:scale-95
                            disabled:opacity-50 disabled:cursor-not-allowed 
                            disabled:hover:translate-y-0
                `}
              >
                   {url &&  (
                    <div>
                    <span>Upload</span>
                  </div>
                    )}
                
                </button>
              )}
           
            {url &&  (
            <button
              type="button"
              onClick={handleCancel}
              className="py-1.5 px-3 text-sm text-tertiary hover:text-primary active:translate-y-[0.5px] active:scale-95
               rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            )}
          </div>
        </form>
    
    </div>
  );
}