// src/app/components/research/Toolbar/DeleteConfirmationModal.client.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../../ui/Button.client';

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item", 
  message = "Are you sure you want to delete this item? This action cannot be undone." 
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
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
              {title}
            </h3>
            <p className="text-tertiary mb-6">
              {message}
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
                onClick={handleConfirm}
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