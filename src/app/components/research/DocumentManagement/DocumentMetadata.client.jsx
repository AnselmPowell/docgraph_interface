// src/app/components/research/DocumentManagement/DocumentMetadata.client.jsx
'use client';

import { motion } from 'framer-motion';
import { FileText, Users, Calendar, Quote } from 'lucide-react';

export function DocumentMetadata({ document }) {
  if (!document) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 space-y-6"
    >
      {/* Title & Basic Info */}
      <div>
        <h2 className="text-lg font-semibold text-primary">
          {document.title || document.file_name}
        </h2>
        <p className="text-sm text-tertiary mt-1">
          {document.file_name}
        </p>
      </div>

      {/* Authors */}
      {document.authors?.length > 0 && (
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 mt-1 text-tertiary" />
          <div>
            <h3 className="text-sm font-medium text-primary">Authors</h3>
            <p className="text-sm text-tertiary mt-1">
              {document.authors.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Publication Date */}
      {document.publication_date && (
        <div className="flex items-start gap-2">
          <Calendar className="w-4 h-4 mt-1 text-tertiary" />
          <div>
            <h3 className="text-sm font-medium text-primary">Published</h3>
            <p className="text-sm text-tertiary mt-1">
              {new Date(document.publication_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      {document.summary && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary">Summary</h3>
          <p className="text-sm text-tertiary leading-relaxed">
            {document.summary}
          </p>
        </div>
      )}

      {/* Citation */}
      {document.citation && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-tertiary" />
            <h3 className="text-sm font-medium text-primary">Citation</h3>
          </div>
          <div className="p-3 rounded-lg bg-tertiary/5 font-mono text-sm text-tertiary">
            {document.citation}
          </div>
        </div>
      )}

      {/* Reference List Preview */}
      {document.references?.entries && Object.keys(document.references.entries).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-primary">References</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {Object.entries(document.references.entries).map(([id, ref]) => (
              <div 
                key={id}
                className="text-sm text-tertiary p-2 rounded-lg bg-tertiary/5"
              >
                <span className="font-medium">[{id}]</span> {ref.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}