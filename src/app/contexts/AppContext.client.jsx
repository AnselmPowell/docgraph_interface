// src/store/contexts/AppContext.client.jsx
'use client';

import { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { useUIState } from './managers/useUIState';
import { useDataState } from './managers/useDataState';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const ui = useUIState();
  const data = useDataState();

  const value = useMemo(() => ({
    ui,
    data,
  }), [ui, data]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};


