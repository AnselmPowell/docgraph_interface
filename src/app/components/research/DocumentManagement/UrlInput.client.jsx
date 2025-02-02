// src/app/components/research/DocumentManagement/UrlInput.client.jsx
'use client';

import { useState } from 'react';
import { LinkIcon, Loader2 } from 'lucide-react';

export function UrlInput({ onUrlSubmit }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsLoading(true);
      await onUrlSubmit(url);
      setUrl('');
    } catch (error) {
      console.error('URL submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="px-4 py-3 border-b border-gray-200"
    >
      <div className="relative flex items-center">
        <LinkIcon className="absolute left-3 w-4 h-4 text-gray-400" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter PDF URL..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-blue-500" />
        )}
      </div>
    </form>
  );
}