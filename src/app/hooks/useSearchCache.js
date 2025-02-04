// src/app//hooks/useSearchCache.js

import { useCallback } from 'react';
import { useAppCache } from '../contexts/AppContext.client';
import { CACHE_LEVELS } from '../services/cache/cacheManager';

export function useSearchCache() {
  const { setCache, getCache, removeCache } = useAppCache();

  /**
   * Cache search parameters
   */
  const cacheSearchParams = useCallback(async (params) => {
    await setCache('search_params', {
      ...params,
      timestamp: Date.now()
    }, {
      level: CACHE_LEVELS.SESSION
    });
  }, [setCache]);

  /**
   * Get cached search parameters
   */
  const getCachedParams = useCallback(async () => {
    return await getCache('search_params', CACHE_LEVELS.SESSION);
  }, [getCache]);

  
  /**
   * Cache search results
   */
  const cacheSearchResults = useCallback(async (results) => {
    console.log("Cache search results", results)
    await setCache('search_results', {
      data: results,
      timestamp: Date.now()
    }, {
      level: CACHE_LEVELS.SESSION,
      expiry: 30 * 60 * 1000 // 30 minutes
    });
  }, [setCache]);

  /**
   * Get cached search results
   */
  const getCachedResults = useCallback(async () => {
    return await getCache('search_results', CACHE_LEVELS.SESSION);
  }, [getCache]);


  const removeCachedResults = async (newResults) => {
 
    cacheSearchResults(newResults)

    return true;
 
}

  /**
   * Clear search cache
   */
  const clearSearchCache = useCallback(async () => {
    await removeCache('search_params', CACHE_LEVELS.SESSION);
    await removeCache('search_results', CACHE_LEVELS.SESSION);
  }, [removeCache]);

  return {
    cacheSearchParams,
    getCachedParams,
    cacheSearchResults,
    getCachedResults,
    removeCachedResults,
    clearSearchCache
  };
}