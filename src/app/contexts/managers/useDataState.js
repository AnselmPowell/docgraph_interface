// src/app/contexts/managers/useDataState.js
import { useState, useCallback } from 'react';
import { usePersistedState } from '../utils/usePersistedState';

export function useDataState() {
  const [data, setData] = usePersistedState('app_data', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [setData]); 

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, [setData]); 

  return {
    data,
    loading, 
    error,
    fetchData,
    clearData,
  };
}