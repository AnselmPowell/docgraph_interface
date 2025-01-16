// src/app/components/research/Results/NoResults.client.jsx
'use client';

import { FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';

export function NoResults() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        flex flex-col items-center justify-center
        py-12 px-4
        text-center
      "
    >
      <div className="
        w-16 h-16 mb-6
        rounded-full
        bg-tertiary/10
        flex items-center justify-center
      ">
        <FileSearch className="w-8 h-8 text-tertiary" />
      </div>
      
      <h3 className="text-lg font-semibold text-primary mb-2">
        No Documents Found
      </h3>
      
      <p className="text-sm text-tertiary max-w-md">
        Upload research documents or modify your search to find relevant content.
        You can use the button in the bottom right to get started.
      </p>

      {/* Keyboard shortcut hint */}
      <div className="
        mt-6 px-3 py-1.5
        rounded-lg
        bg-tertiary/5
        text-xs text-tertiary
      ">
        Press <kbd className="px-1.5 py-0.5 rounded bg-tertiary/10">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-tertiary/10">G</kbd> to open upload
      </div>
    </motion.div>
  );
}