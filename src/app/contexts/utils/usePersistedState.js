import { useState, useEffect } from 'react';

export function usePersistedState(key, initialValue) {
  // Initialise state with proper SSR handling
  const [state, setState] = useState(() => {
    // Handle server-side rendering
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
    
    try {
      // Check localStorage for existing value
      const item = localStorage.getItem(key);
      if (item) {
        // Remove any quotes that might be present
        return item.replace(/['"]+/g, '');
      }
      // if (item) return JSON.parse(item);
      
      // Handle functional initial state
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  // Sync state with localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, state]);

  return [state, setState];
}