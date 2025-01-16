// src/app/hooks/useResizeObserver.js
'use client';

import { useState, useEffect } from 'react';

export function useResizeObserver(ref) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(entries => {
      if (!Array.isArray(entries)) return;
      
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return dimensions;
}