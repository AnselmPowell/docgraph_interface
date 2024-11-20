// src/app/components/research/DocumentViewer/context/DocumentViewerContext.jsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const DocumentViewerContext = createContext(null);

export function DocumentViewerProvider({ children, initialPointers = [] }) {
  // Core viewer state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  // Search and highlight state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  // Navigation state
  const [thumbnailsVisible, setThumbnailsVisible] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);

  // Highlight management
  const addHighlight = useCallback((highlight) => {
    setHighlights(prev => [...prev, highlight]);
  }, []);

  const removeHighlight = useCallback((id) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  }, []);

  const updateHighlight = useCallback((id, updates) => {
    setHighlights(prev => prev.map(h => 
      h.id === id ? { ...h, ...updates } : h
    ));
  }, []);

  // Search management
  const performSearch = useCallback(async (query) => {
    setSearchQuery(query);
    // Search implementation will be added
  }, []);

  return (
    <DocumentViewerContext.Provider
      value={{
        // Core state
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        scale,
        setScale,
        isLoading,
        setIsLoading,

        // Search and highlights
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        highlights,
        selectedHighlight,
        setSelectedHighlight,

        // Navigation
        thumbnailsVisible,
        setThumbnailsVisible,
        searchVisible,
        setSearchVisible,

        // Actions
        addHighlight,
        removeHighlight,
        updateHighlight,
        performSearch,
      }}
    >
      {children}
    </DocumentViewerContext.Provider>
  );
}

export const useDocumentViewer = () => {
  const context = useContext(DocumentViewerContext);
  if (!context) {
    throw new Error('useDocumentViewer must be used within DocumentViewerProvider');
  }
  return context;
};