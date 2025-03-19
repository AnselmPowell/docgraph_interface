// src/app/components/research/DocumentManagement/DocumentList.client.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { DocumentActions } from './DocumentActions.client';

export function DocumentList({
  documents = [],
  stagedDocuments = [],
  pendingDocuments = [],
  isLoading,
  selectedDocuments = [],
  onSelect,
  onView,
  onDelete,
  onDetails
}) {
  // Get all documents in processing state
  const processingDocs = [
    ...stagedDocuments,
    ...(pendingDocuments || [])
  ];
  
  const hasProcessingDocs = processingDocs.length > 0;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar mb-5">
      {/* Processing Documents Section */}
      {hasProcessingDocs && (
        <div className="border-b-4 border-gray-300">
          <div className="divide-y divide-gray-200">
            {/* Staged Documents */}
            {stagedDocuments.map((doc) => (
              <div
                key={doc.file_name + doc.file_size}
                 className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(doc);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.title || doc.file_name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(doc);
                    }}
                    className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors active:translate-y-[0.5px] active:scale-95"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(doc);
                    }}
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors active:translate-y-[0.5px] active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Pending Documents */}
            {pendingDocuments?.map((doc) => (
              <div
                key={doc.document_id}
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(doc);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.title || doc.file_name}
                      </p>
                      
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <p className="text-xs text-gray-500">
                        {doc.error_message || "Processing..."}
                      </p>
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(doc);
                    }}
                    className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors active:translate-y-[0.5px] active:scale-95"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(doc);
                    }}
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors active:translate-y-[0.5px] active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Documents */}
      <div className="divide-y divide-gray-200">
    
        {documents.map((doc) => (
          <div
            key={doc.file_name}
            className={`
              px-4 py-3 
              ${selectedDocuments.includes(doc.file_name) ? 'bg-blue-50' : 'hover:bg-gray-50'} 
              transition-colors
            `}
          >
            <div className="flex items-center gap-3">
              <div 
                className="min-w-0 flex-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(doc);
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.title || doc.file_name}
                  </p>
                </div>
                {doc.authors?.length > 0 && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {doc.authors.join(', ')}
                  </p>
                )}
              </div>
              <DocumentActions
                document={doc}
                isSelected={selectedDocuments.includes(doc.file_name)}
                onView={() => onView(doc)}
                onDelete={() => onDelete(doc)}
                onSelect={() => {
                  if (selectedDocuments.includes(doc.file_name)) {
                    onSelect(selectedDocuments.filter(id => id !== doc.file_name));
                  } else {
                    onSelect([...selectedDocuments, doc.file_name]);
                  }
                }}
              />
            </div>
          </div>
        ))}

        {/* Empty State */}
        {documents.length === 0 && !hasProcessingDocs && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-sm font-medium text-gray-900">
              No documents yet
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drop files here or paste a URL to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}