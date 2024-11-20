// src/app/components/research/DocumentViewer/components/HighlightLayer.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocumentViewer } from '../context/DocumentViewerContext';


export function HighlightLayer({ pageContent, scale, colors }) {
  const { highlights } = useDocumentViewer();
  const [visibleHighlights, setVisibleHighlights] = useState([]);

  useEffect(() => {
    if (pageContent) {
      setVisibleHighlights(highlights.filter(h => 
        h.positions.some(p => p.page === pageContent.pageNumber)
      ));
    }
  }, [highlights, pageContent]);

  if (!pageContent) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {visibleHighlights.map(highlight => (
          <motion.div
            key={highlight.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {highlight.positions.map((position, index) => (
              <div
                key={`${highlight.id}-${index}`}
                className="absolute"
                style={{
                  left: position.left,
                  top: position.top,
                  width: position.width,
                  height: position.height,
                  backgroundColor: colors[highlight.type],
                  mixBlendMode: 'multiply'
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}