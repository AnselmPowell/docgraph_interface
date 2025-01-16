// src/app/components/research/DocumentManagement/DocumentSidebar.client.jsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, 
  Check, 
  Loader2, 
  AlertTriangle, 
  ChevronDown,
  Upload,
  Trash2, 
  Info
} from 'lucide-react';
import { DeleteDocumentModal } from './DeleteDocumentModal.client';
import { DocumentDetailsModal } from './DocumentDetailsModal.client';
import { toast } from '../../ui/Toast.client';
import { storageManager } from '../../../services/storageManager';

import { useDocumentCache } from '../../../hooks/useDocumentCache';

export function DocumentSidebar({

  documents = [],
  selectedDocuments = [],
  onSelect,
  onView,
  onDelete,
  onStagedUpload,
  stagedDocuments = [],
  onRemoveStaged,
  onUploadStaged
}) {
  // Existing state
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [deleteDocumentName, setDeleteDocumentName] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);

  const {
    cacheDocument,
  } = useDocumentCache();

  const storedDocs = storageManager.getAllDocuments();

 


  // UPDATE dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.filter(file => {
        const isDuplicateStaged = stagedDocuments.some(doc => 
          doc.file_name === file.name && doc.file_size === file.size
        );
        return !isDuplicateStaged;
      });

      if (newFiles.length > 0) {

        onStagedUpload?.(newFiles);
      }

    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  // handle select all
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelect([]);
      setIsAllSelected(false);
    } else {
      const allDocIds = documents
        .filter(doc => doc.processing_status === 'completed')
        .map(doc => doc.name);
      onSelect(allDocIds);
      setIsAllSelected(true);
    }
    // Cache selection state
    cacheDocument({ id: 'selection', selected: isAllSelected ? [] : allDocIds });
  }, [documents, onSelect, isAllSelected, cacheDocument]);


  const handleSelectDocument = useCallback((docId) => {
    if (selectedDocuments.includes(docId)) {
      onSelect(selectedDocuments.filter(id => id !== docId));
      setIsAllSelected(false);
    } else {
      onSelect([...selectedDocuments, docId]);
    }
  }, [selectedDocuments, onSelect]);


  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-tertiary/10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-primary">Documents</h2>
          <span className="text-sm text-tertiary">
            {selectedDocuments.length} of {documents.length} selected
          </span>
        </div>
        
        {documents.length > 0 && (
          <button
            onClick={handleSelectAll}
            className={`
              w-full px-3 py-1.5 rounded-lg
              border transition-colors
              ${isAllSelected ? 'bg-primary/10 border-primary/20' : 'border-tertiary/10 hover:border-tertiary/20'}
              text-sm font-medium
            `}
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>
  
      {/* Drop Zone Section */}
      <div
        {...getRootProps()}
        className={`
          px-4 py-3 border-b border-tertiary/10
          ${isDragActive ? 'bg-primary/5' : 'hover:bg-tertiary/5'}
          transition-colors cursor-pointer
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className={`w-5 h-5 ${isDragActive ? 'text-primary' : 'text-tertiary'}`} />
          <p className="text-sm text-center text-tertiary">
            {isDragActive ? 'Drop files here...' : 'Drag & drop documents here'}
          </p>
        </div>
      </div>
  
      {/* Document List Container */}
      <div className="flex-1 overflow-y-auto">
        {/* Staged Documents */}
        {stagedDocuments.length > 0 && (
          <div className="divide-y divide-tertiary/10">
            <div className="px-4 py-3 bg-tertiary/5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-primary">Staged Documents</h3>
                <button
                  onClick={onUploadStaged}
                  className="px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Upload All
                </button>
              </div>
            </div>
            {stagedDocuments.map((doc) => (
              <motion.div
                key={doc.file_name + doc.file_size}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group px-4 py-3 hover:bg-tertiary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-tertiary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-primary truncate">{doc.file_name}</p>
                    <p className="text-xs text-tertiary">
                      {(doc.file_size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(doc)}
                      className="px-2 py-1 text-xs text-tertiary hover:text-primary hover:bg-tertiary/10 rounded transition-colors"
                    >
                      View
                    </button>
                    <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await onDelete(doc.file_name);
                      onRemoveStaged(doc)
                      setDeleteDocumentName(doc.file_name);
                    }}
                    className="p-1 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
  
        {/* Processed Documents */}
        <div className="divide-y divide-tertiary/10">
          {documents.map((doc) => (
            <motion.div
              key={doc.name + file_size}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`
                group relative
                px-4 py-3
                hover:bg-tertiary/5
                transition-colors
                cursor-pointer
                ${selectedDocuments.includes(doc.file_name) ? 'bg-primary/5' : ''}
              `}
              onClick={() => handleSelectDocument(doc.file_name)}
            >
              <div className="flex items-center gap-3">
  
                {/* Document Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-primary truncate">
                    {doc.file_name}
                  </h3>
                  {doc.authors?.length > 0 && (
                    <p className="text-sm text-tertiary truncate">
                      {doc.authors.join(', ')}
                    </p>
                  )}
                </div>
  
                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {doc.processing_status === 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(doc);
                      }}
                      className="px-2 py-1 text-xs text-tertiary hover:text-primary hover:bg-tertiary/10 rounded transition-colors"
                    >
                      View
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(doc);
                    }}
                    className="p-1 text-tertiary hover:text-primary hover:bg-tertiary/10 rounded transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDocument(doc.file_name);
                      setDeleteDocumentName(doc.file_name);
                    }}
                    className="p-1 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
  
              {/* Error Message */}
              {doc.processing_status === 'failed' && doc.error_message && (
                <p className="mt-1 text-xs text-red-500">
                  {doc.error_message}
                </p>
              )}
            </motion.div>
          ))}
        </div>
  
        {/* Empty State */}
        {documents.length === 0 && stagedDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
            <FileText className="w-12 h-12 text-tertiary/50 mb-2" />
            <p className="text-tertiary">No documents uploaded</p>
            <p className="text-sm text-tertiary/50">
              Upload documents to begin searching
            </p>
          </div>
        )}
      </div>
  
      {/* Modals */}
      <DeleteDocumentModal
        isOpen={deleteDocumentName !== null}
        onClose={() => setDeleteDocumentName(null)}
        documentName={deleteDocumentName}
        onDeleteDocument={onDelete}
      />
  
      <DocumentDetailsModal
        isOpen={documentDetails !== null}
        onClose={() => setDocumentDetails(null)}
        document={documentDetails}
      />
    </div>
  );
}