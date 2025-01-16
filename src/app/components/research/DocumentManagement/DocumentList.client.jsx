// src/app/components/research/DocumentManagement/DocumentList.client.jsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

const DocumentStatusIcon = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    case 'failed':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <Loader2 className="w-4 h-4 animate-spin text-tertiary" />;
  }
};

export function DocumentList({
  documents = [],
  selectedDocuments = [],
  onSelect,
  onView
}) {
  // Group documents by status
  const groupedDocuments = useMemo(() => {
    return documents.reduce((acc, doc) => {
      const status = doc.processing_status || 'pending';
      if (!acc[status]) acc[status] = [];
      acc[status].push(doc);
      return acc;
    }, {});
  }, [documents]);

  // Order status groups
  const statusOrder = ['processing', 'completed', 'failed', 'pending'];

  return (
    <div className="space-y-6">
      {statusOrder.map(status => {
        const docs = groupedDocuments[status];
        if (!docs?.length) return null;

        return (
          <div key={status} className="space-y-2">
            <h3 className="text-sm font-medium text-tertiary capitalize px-2">
              {status} ({docs.length})
            </h3>
            
            <div className="space-y-2">
              {docs.map(document => (
                <motion.div
                  key={document.document_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    relative p-3 rounded-lg
                    border transition-all duration-200
                    ${selectedDocuments.includes(document.document_id)
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-tertiary/10 hover:border-tertiary/20'
                    }
                    cursor-pointer
                  `}
                  onClick={() => onSelect?.(document.document_id)}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 mt-0.5 text-tertiary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-primary truncate">
                          {document.title || document.file_name}
                        </h4>
                        <DocumentStatusIcon status={document.processing_status} />
                      </div>
                      
                      {document.authors?.length > 0 && (
                        <p className="text-sm text-tertiary truncate mt-0.5">
                          {document.authors.join(', ')}
                        </p>
                      )}

                      {status === 'failed' && document.error_message && (
                        <p className="text-sm text-red-500 mt-1">
                          {document.error_message}
                        </p>
                      )}
                    </div>
                  </div>

                  {status === 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(document);
                      }}
                      className="
                        mt-2 w-full px-3 py-1.5
                        bg-background
                        border border-tertiary/10
                        rounded-md
                        text-sm text-tertiary
                        hover:text-primary hover:border-primary/20
                        transition-colors
                      "
                    >
                      View Document
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}