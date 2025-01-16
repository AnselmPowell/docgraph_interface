// src/store/contexts/AppContext.client.jsx
'use client';

import { createContext, useContext, useMemo } from 'react';
import { useUIState } from './managers/useUIState';
import { useDataState } from './managers/useDataState';
import { useCacheState } from './managers/useCacheState';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // State managers
  const ui = useUIState();
  const data = useDataState();
  const cache = useCacheState();

  // Memoized context value
  const value = useMemo(() => ({
    ui,
    data,
    cache,
  }), [ui, data, cache]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Custom hook to use app context
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

/**
 * Convenience hook for cache operations
 */
export const useAppCache = () => {
  const { cache } = useApp();
  return cache;
};