// src/services/cache/adapters/sessionStorage.js

class SessionStorageAdapter {
    constructor(prefix = 'research_assistant_') {
      this.prefix = prefix;
    }
  
    /**
     * Get item from sessionStorage
     */
    async get(key) {
      try {
        const fullKey = this.prefix + key;
        const item = sessionStorage.getItem(fullKey);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('SessionStorage get error:', error);
        return null;
      }
    }
  
    /**
     * Set item in sessionStorage
     */
    async set(key, value) {
      try {
        const fullKey = this.prefix + key;
        const serialized = JSON.stringify(value);
        sessionStorage.setItem(fullKey, serialized);
        return true;
      } catch (error) {
        console.error('SessionStorage set error:', error);
        return false;
      }
    }
  
    /**
     * Remove item from sessionStorage
     */
    async remove(key) {
      try {
        const fullKey = this.prefix + key;
        sessionStorage.removeItem(fullKey);
        return true;
      } catch (error) {
        console.error('SessionStorage remove error:', error);
        return false;
      }
    }
  
    /**
     * Clear all items with prefix
     */
    async clear() {
      try {
        const keys = await this.keys();
        keys.forEach(key => sessionStorage.removeItem(this.prefix + key));
        return true;
      } catch (error) {
        console.error('SessionStorage clear error:', error);
        return false;
      }
    }
  
    /**
     * Get all keys with prefix
     */
    async keys() {
      try {
        return Object.keys(sessionStorage)
          .filter(key => key.startsWith(this.prefix))
          .map(key => key.slice(this.prefix.length));
      } catch (error) {
        console.error('SessionStorage keys error:', error);
        return [];
      }
    }
  }
  
  export default SessionStorageAdapter;