// src/app/components/research/core/FloatingActionButton.client.jsx
'use client';

import { Upload, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function FloatingActionButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        fixed right-6 bottom-6
        p-4 rounded-full
        bg-primary text-background
        shadow-lg shadow-primary/20
        hover:shadow-xl hover:shadow-primary/30
        transition-shadow duration-200
        flex items-center gap-2
        z-50
      "
    >
      <Upload className="w-5 h-5" />
      <span className="font-medium">Upload Documents</span>
    </motion.button>
  );
}
