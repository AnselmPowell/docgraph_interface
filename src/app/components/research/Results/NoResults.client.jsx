// src/app/components/research/Results/NoResults.client.jsx
'use client';

import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

export function NoResults() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        text-center py-12
        border-2 border-dashed border-tertiary/20
        rounded-xl
      "
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary/10 mb-4"
      >
        <SearchX className="w-8 h-8 text-tertiary" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-primary mb-2">
        No Results Found
      </h3>
      
      <p className="text-sm text-tertiary max-w-md mx-auto">
        Try adjusting your search criteria or uploading different documents to find relevant matches.
      </p>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="
            px-4 py-2 rounded-lg
            bg-primary text-background
            hover:bg-primary/90
            transition-colors duration-200
          "
        >
          Modify Search
        </button>
      </div>
    </motion.div>
  );
}