// src/app/services/cache.js

const CACHE_PREFIX = 'research_assistant_';

export function getCache(key) {
  const cacheKey = CACHE_PREFIX + key;
  const cacheValue = localStorage.getItem(cacheKey);
  return cacheValue ? JSON.parse(cacheValue) : null;
}

export function setCache(key, value) {
  const cacheKey = CACHE_PREFIX + key;
  localStorage.setItem(cacheKey, JSON.stringify(value));
}

export function clearCache(key) {
  const cacheKey = CACHE_PREFIX + key;
  localStorage.removeItem(cacheKey);
}