// src/app/components/research/utils/useKeyboardShortcut.js
'use client';

import { useEffect, useCallback } from 'react';

export function useKeyboardShortcut(keys, callback, deps = []) {
  const handleKeyDown = useCallback((event) => {
    // For single key shortcuts
    if (typeof keys === 'string') {
      if (event.key.toLowerCase() === keys.toLowerCase()) {
        callback(event);
      }
      return;
    }

    // For combination shortcuts (e.g., ['Control', 'g'])
    const pressedKeys = new Set();
    if (event.ctrlKey) pressedKeys.add('Control');
    if (event.altKey) pressedKeys.add('Alt');
    if (event.shiftKey) pressedKeys.add('Shift');
    pressedKeys.add(event.key.toLowerCase());

    const allKeysPressed = keys.every(k => 
      pressedKeys.has(k.toLowerCase())
    );

    if (allKeysPressed) {
      event.preventDefault();
      callback(event);
    }
  }, [callback, ...deps]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}