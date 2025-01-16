// src/app/components/research/Upload/ProcessingStatus.client.jsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle2, Loader2 } from 'lucide-react';

export function ProcessingStatus({ 
  stage,
  className = ''
}) {
  const stages = [
    {
      id: 'upload',
      name: 'Uploading Files',
      description: 'Uploading documents to server',
      icon: Upload
    },
    {
      id: 'processing',
      name: 'Processing',
      description: 'Extracting content and metadata',
      icon: FileText
    },
    {
      id: 'complete',
      name: 'Complete',
      description: 'Documents ready',
      icon: CheckCircle2
    }
  ];

  const currentIndex = stages.findIndex(s => s.id === stage);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        p-4 rounded-lg
        bg-background/95 backdrop-blur-sm
        border border-tertiary/10
        shadow-lg
        ${className}
      `}
    >
      <div className="flex items-center gap-6">
        {stages.map((s, idx) => {
          const Icon = s.icon;
          const isActive = s.id === stage;
          const isComplete = idx < currentIndex;

          return (
            <div 
              key={s.id}
              className="flex flex-col items-center gap-2"
            >
              <div className={`
                p-2 rounded-full
                ${isActive ? 'bg-primary text-background' :
                  isComplete ? 'bg-green-500 text-background' :
                  'bg-tertiary/10 text-tertiary'}
              `}>
                {isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${
                  isActive ? 'text-primary' : 
                  isComplete ? 'text-green-500' : 
                  'text-tertiary'
                }`}>
                  {s.name}
                </p>
                <p className="text-xs text-tertiary">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}