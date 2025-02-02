// src/app/components/research/DocumentManagement/DeleteDocumentModal.client.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../ui/Button.client';
import { toast } from '../../messages/Toast.client';
 
export function DeleteDocumentModal({ isOpen, onClose, documentName, onDeleteDocument }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!documentName) return;
    setIsDeleting(true);
    await onDeleteDocument(documentName)
    setIsDeleting(false);
    onClose();
  };

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
            className="relative w-full max-w-lg p-6 bg-background border border-tertiary/10 rounded-lg shadow-lg"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-tertiary hover:text-primary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-primary mb-4">
              Delete Document
            </h3>
            <p className="text-tertiary mb-6">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            
            <div className="flex justify-end gap-4">
              <Button
                onClick={onClose}
                variant="secondary"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}