// src/services/cache/cacheManager.js

import LocalStorageAdapter from './adapters/localStorage';
import SessionStorageAdapter from './adapters/sessionStorage';

const CACHE_CATEGORIES = {
    DOCUMENTS: 'documents',
    SEARCH: 'search',
    UI: 'ui',
    USER: 'user'
  };
  
  const CACHE_LEVELS = {
    SESSION: 'session',    // Survives page refresh
    PERSISTENT: 'persist', // Survives browser close
    TEMPORARY: 'temp'      // Component-level state
  };
  
  const DEFAULT_CONFIG = {
    version: '1.0.0',
    level: CACHE_LEVELS.SESSION,
    expiry: 24 * 60 * 60 * 1000 // 24 hours
  };
  
  class CacheManager {
    constructor() {
      // Initialize storage adapters
      this.localStorage = new LocalStorageAdapter();
      this.sessionStorage = new SessionStorageAdapter();
      this.memoryStorage = new Map(); // For temporary storage
      
      // Clean up expired items
      this.cleanupInterval = setInterval(() => {
        this.cleanExpiredItems();
      }, 60 * 60 * 1000); // Every hour
    }
  
    async set(key, value, options = {}) {
      const config = { ...DEFAULT_CONFIG, ...options };
      console.log('cache manager: 2', {key, value, options} )
      const entry = {
        data: value,
        timestamp: Date.now(),
        version: config.version,
        expiry: config.expiry
      };
  
      try {
        switch (config.level) {
          case CACHE_LEVELS.PERSISTENT:
            await this.localStorage.set(key, entry);
            console.log('cache manager: 3p', {key, entry} )
            break;
          case CACHE_LEVELS.SESSION:
            await this.sessionStorage.set(key, entry);
            console.log('cache manager: 3s', {key, entry} )
            break;
          case CACHE_LEVELS.TEMPORARY:
            this.memoryStorage.set(key, entry);
            console.log('cache manager: 3t', {key, entry} )
            break;
        }
      } catch (error) {
        console.error('Cache set error:', error);
      }
    }
  
    async get(key, level = CACHE_LEVELS.SESSION) {
      try {
        let entry;
        
        switch (level) {
          case CACHE_LEVELS.PERSISTENT:
            entry = await this.localStorage.get(key);
            console.log('cache manager: 4p', {key, entry} )
            break;
          case CACHE_LEVELS.SESSION:
            entry = await this.sessionStorage.get(key);
            console.log('cache manager: 4s', {key, entry} )
            break;
          case CACHE_LEVELS.TEMPORARY:
            entry = this.memoryStorage.get(key);
            console.log('cache manager: 4t', {key, entry} )
            break;
        }
  
        if (!entry) return null;
  
        // Check expiration
        if (this.isExpired(entry)) {
          await this.remove(key, level);
          return null;
        }
  
        return entry.data;
      } catch (error) {
        console.error('Cache get error:', error);
        return null;
      }
    }
  
    async remove(key, level = CACHE_LEVELS.SESSION) {
      try {
        switch (level) {
          case CACHE_LEVELS.PERSISTENT:
            await this.localStorage.remove(key);
            break;
          case CACHE_LEVELS.SESSION:
            await this.sessionStorage.remove(key);
            break;
          case CACHE_LEVELS.TEMPORARY:
            this.memoryStorage.delete(key);
            break;
        }
      } catch (error) {
        console.error('Cache remove error:', error);
      }
    }
  
    async clear(level) {
      try {
        if (level) {
          switch (level) {
            case CACHE_LEVELS.PERSISTENT:
              await this.localStorage.clear();
              break;
            case CACHE_LEVELS.SESSION:
              await this.sessionStorage.clear();
              break;
            case CACHE_LEVELS.TEMPORARY:
              this.memoryStorage.clear();
              break;
          }
        } else {
          // Clear all levels
          await this.localStorage.clear();
          await this.sessionStorage.clear();
          this.memoryStorage.clear();
        }
      } catch (error) {
        console.error('Cache clear error:', error);
      }
    }
  
    isExpired(entry) {
      if (!entry.expiry) return false;
      return Date.now() > entry.timestamp + entry.expiry;
    }
  
    async cleanExpiredItems() {
      // Clean localStorage
      const persistentKeys = await this.localStorage.keys();
      for (const key of persistentKeys) {
        const entry = await this.localStorage.get(key);
        if (entry && this.isExpired(entry)) {
          await this.localStorage.remove(key);
        }
      }
  
      // Clean sessionStorage
      const sessionKeys = await this.sessionStorage.keys();
      for (const key of sessionKeys) {
        const entry = await this.sessionStorage.get(key);
        if (entry && this.isExpired(entry)) {
          await this.sessionStorage.remove(key);
        }
      }
  
      // Clean memoryStorage
      for (const [key, entry] of this.memoryStorage.entries()) {
        if (this.isExpired(entry)) {
          this.memoryStorage.delete(key);
        }
      }
    }
  }
  
  export const cacheManager = new CacheManager();
  export { CACHE_CATEGORIES, CACHE_LEVELS };