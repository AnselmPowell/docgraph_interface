// src/store/contexts/managers/useCacheState.js

import { useCallback } from 'react';
import { cacheManager, CACHE_LEVELS } from '../../services/cache/cacheManager';

export function useCacheState() {
  /**
   * Set value in cache with specified level and expiry
   */
  const setCache = useCallback(async (key, value, options = {}) => {
    try {
      await cacheManager.set(key, value, options);
      return true;
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }, []);

  /**
   * Get value from cache
   */
  const getCache = useCallback(async (key, level = CACHE_LEVELS.SESSION) => {
    try {
      return await cacheManager.get(key, level);
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }, []);

  /**
   * Remove value from cache
   */
  const removeCache = useCallback(async (key, level = CACHE_LEVELS.SESSION) => {
    try {
      await cacheManager.remove(key, level);
      return true;
    } catch (error) {
      console.error('Error removing cache:', error);
      return false;
    }
  }, []);

  /**
   * Clear all cache or specific level
   */
  const clearCache = useCallback(async (level) => {
    try {
      await cacheManager.clear(level);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }, []);

  return {
    setCache,
    getCache,
    removeCache,
    clearCache
  };
}