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


// // src/store/contexts/utils/usePersistedState.js

// import { useState, useEffect, useCallback } from 'react';
// import { cacheManager, CACHE_LEVELS } from '../../services/cache/cacheManager';

// export function usePersistedState(key, initialValue, options = {}) {
//   const [state, setState] = useState(() => {
//     // Initialize state
//     try {
//       // Get cached value
//       const cached = cacheManager.get(key, options.level || CACHE_LEVELS.SESSION);
//       if (cached !== null) {
//         return cached;
//       }
      
//       // If no cached value, use initial value
//       return typeof initialValue === 'function' ? initialValue() : initialValue;
//     } catch (error) {
//       console.error('Error initializing persisted state:', error);
//       return typeof initialValue === 'function' ? initialValue() : initialValue;
//     }
//   });

//   // Sync with cache
//   useEffect(() => {
//     const syncCache = async () => {
//       try {
//         await cacheManager.set(key, state, options);
//       } catch (error) {
//         console.error('Error syncing with cache:', error);
//       }
//     };
//     syncCache();
//   }, [key, state, options]);

//   // Enhanced setState with cache sync
//   const setPersistedState = useCallback((newValue) => {
//     setState(prev => {
//       const value = typeof newValue === 'function' ? newValue(prev) : newValue;
//       return value;
//     });
//   }, []);

//   return [state, setPersistedState];
// }