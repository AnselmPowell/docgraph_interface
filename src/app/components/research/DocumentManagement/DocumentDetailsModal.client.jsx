// src/app/components/research/DocumentManagement/DocumentDetailsModal.client.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function DocumentDetailsModal({ isOpen, onClose, document }) {
  if (!document) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-2xl p-6 bg-background border border-tertiary/10 rounded-lg shadow-lg"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-tertiary hover:text-primary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-primary mb-4">
              {document.title}
            </h2>
            <div className="text-tertiary mb-6">
              <p className="mb-4">
                <strong>Authors:</strong>{' '}
                {document.authors?.join(', ')}
              </p>
              <p className="mb-4">
                <strong>Summary:</strong>{' '}
                {document.summary}
              </p>
              <div>
                <strong>References:</strong>
                <ul className="list-disc list-inside">
                  {Object.entries(document.references?.entries || {}).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

