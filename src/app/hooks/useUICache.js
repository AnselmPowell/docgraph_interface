// src/services/cache/hooks/useUICache.js

import { useCallback } from 'react';
import { useAppCache } from '../contexts/AppContext.client';
import { CACHE_LEVELS } from '../services/cache/cacheManager';

export function useUICache() {
  const { setCache, getCache, removeCache } = useAppCache();

  /**
   * Cache UI preferences
   */
  const cacheUIPreferences = useCallback(async (preferences) => {
    await setCache('ui_preferences', {
      ...preferences,
      timestamp: Date.now()
    }, {
      level: CACHE_LEVELS.PERSISTENT
    });
  }, [setCache]);

  /**
   * Get cached UI preferences
   */
  const getCachedPreferences = useCallback(async () => {
    return await getCache('ui_preferences', CACHE_LEVELS.PERSISTENT);
  }, [getCache]);

  /**
   * Cache sidebar state
   */
  const cacheSidebarState = useCallback(async (isOpen) => {
    await setCache('sidebar_state', {
      isOpen,
      timestamp: Date.now()
    }, {
      level: CACHE_LEVELS.SESSION
    });
  }, [setCache]);

  /**
   * Get cached sidebar state
   */
  const getCachedSidebarState = useCallback(async () => {
    return await getCache('sidebar_state', CACHE_LEVELS.SESSION);
  }, [getCache]);

  /**
   * Reset UI cache
   */
  const resetUICache = useCallback(async () => {
    await removeCache('ui_preferences', CACHE_LEVELS.PERSISTENT);
    await removeCache('sidebar_state', CACHE_LEVELS.SESSION);
  }, [removeCache]);

  return {
    cacheUIPreferences,
    getCachedPreferences,
    cacheSidebarState,
    getCachedSidebarState,
    resetUICache
  };
}