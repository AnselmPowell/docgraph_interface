'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Users, Book } from 'lucide-react';

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
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 bg-background border border-tertiary/10 rounded-lg shadow-lg"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-tertiary hover:text-primary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Title */}
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {document.title || document.file_name}
            </h2>

            {/* Basic Info */}
            <div className="grid gap-4 mb-6">
              {/* Authors */}
              {document.authors?.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-tertiary shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-primary">Authors</h3>
                    <p className="text-sm text-tertiary mt-1">
                      {document.authors.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Summary */}
              {document.summary && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-tertiary shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-primary">Summary</h3>
                    <p className="text-sm text-tertiary mt-1">
                      {document.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* References */}
              {document.references?.entries && (
                <div className="flex items-start gap-3">
                  <Book className="w-5 h-5 text-tertiary shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-primary">References</h3>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {Object.entries(document.references.entries).map(([key, value]) => (
                        <div 
                          key={key}
                          className="text-sm text-tertiary p-2 rounded-lg bg-tertiary/5"
                        >
                          <span className="font-medium text-primary">[{key}]</span>
                          {" "}
                          {value.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}