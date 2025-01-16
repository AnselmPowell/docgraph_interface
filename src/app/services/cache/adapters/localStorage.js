// src/services/cache/adapters/localStorage.js

class LocalStorageAdapter {
    constructor(prefix = 'research_assistant_') {
      this.prefix = prefix;
    }
  
    /**
     * Get item from localStorage
     */
    async get(key) {
      try {
        const fullKey = this.prefix + key;
        const item = localStorage.getItem(fullKey);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('LocalStorage get error:', error);
        return null;
      }
    }
  
    /**
     * Set item in localStorage
     */
    async set(key, value) {
      try {
        const fullKey = this.prefix + key;
        const serialized = JSON.stringify(value);
        localStorage.setItem(fullKey, serialized);
        return true;
      } catch (error) {
        console.error('LocalStorage set error:', error);
        return false;
      }
    }
  
    /**
     * Remove item from localStorage
     */
    async remove(key) {
      try {
        const fullKey = this.prefix + key;
        localStorage.removeItem(fullKey);
        return true;
      } catch (error) {
        console.error('LocalStorage remove error:', error);
        return false;
      }
    }
  
    /**
     * Clear all items with prefix
     */
    async clear() {
      try {
        const keys = await this.keys();
        keys.forEach(key => localStorage.removeItem(this.prefix + key));
        return true;
      } catch (error) {
        console.error('LocalStorage clear error:', error);
        return false;
      }
    }
  
    /**
     * Get all keys with prefix
     */
    async keys() {
      try {
        return Object.keys(localStorage)
          .filter(key => key.startsWith(this.prefix))
          .map(key => key.slice(this.prefix.length));
      } catch (error) {
        console.error('LocalStorage keys error:', error);
        return [];
      }
    }
  }
  
  export default LocalStorageAdapter;