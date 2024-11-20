// src/app/components/research/DocumentViewer/components/PageThumbnails.client.jsx
'use client';

import { useDocumentViewer } from '../context/DocumentViewerContext';
import { useState, useEffect } from 'react';

export function PageThumbnails() {
  const { currentPage, totalPages, setCurrentPage } = useDocumentViewer();
  const [thumbnails, setThumbnails] = useState([]);
  const [visibleRange, setVisibleRange] = useState({ start: 1, end: 5 });

  useEffect(() => {
    // Update visible range based on current page
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    setVisibleRange({ start, end });
  }, [currentPage, totalPages]);

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-2">
      {Array.from({ length: visibleRange.end - visibleRange.start + 1 }, (_, i) => {
        const pageNum = visibleRange.start + i;
        return (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`
              w-12 h-16 rounded border transition-all
              ${pageNum === currentPage 
                ? 'border-primary bg-primary/5' 
                : 'border-tertiary/20 hover:border-tertiary/40'
              }
            `}
          >
            <div className="text-xs text-tertiary">
              {pageNum}
            </div>
            {/* Thumbnail preview would go here */}
          </button>
        );
      })}
    </div>
  );
}