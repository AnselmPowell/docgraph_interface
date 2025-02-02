// src/app/components/research/DocumentManagement/DocumentSidebar.client.jsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Loader2 
} from 'lucide-react';



import { DocumentList } from './DocumentList.client';
import { UrlInput } from './UrlInput.client';
import { DeleteDocumentModal } from './DeleteDocumentModal.client';
import { DocumentDetailsModal } from './DocumentDetailsModal.client';
import {ReferencesModal} from '../ToolBar/ReferenceList.client'
import { toast } from '../../messages/Toast.client';
import { useDocumentCache } from '../../../hooks/useDocumentCache';
import { X } from 'lucide-react'; 


export function DocumentSidebar({
  documents = [],
  selectedDocuments = [],
  stagedDocuments = [],
  onSelect,
  onView,
  onDelete,
  onStagedUpload,
  onUploadStaged,
  onClose  
}) {
  // Existing state
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [deleteDocumentName, setDeleteDocumentName] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [showReferences, setShowReferences] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const {
    cacheDocument,
  } = useDocumentCache();


  // URL submission handler
  const handleUrlSubmit = useCallback(async (url) => {
    try {
      await onStagedUpload([{ url, name: url.split('/').pop() }]);
      toast.success('URL added successfully');
    } catch (error) {
      toast.error('Failed to add URL');
    }
  }, [onStagedUpload]);


  // UPDATE dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      setIsUploading(true);
      try {
        await onStagedUpload(files);
      } finally {
        setIsUploading(false);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024,
    noClick: true, // Disable click to upload - IMPORTANT
    noDragEventsBubbling: true // Prevent drag events from bubbling
  });

  // handle select all
   const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelect([]);
      setIsAllSelected(false);
    } else {
      const selectableDocIds = documents
        .filter(doc => doc.processing_status === 'completed')
        .map(doc => doc.file_name);
      onSelect(selectableDocIds);
      setIsAllSelected(true);
    }
  }, [documents, onSelect, isAllSelected]);



  return (
    <div {...getRootProps()} className="flex flex-col pt-10 h-full ">
      <input {...getInputProps()} />

      {/* URL Input Section */}
      <UrlInput onUrlSubmit={handleUrlSubmit} />
       {/* Upload Area */}
       <div className=" border-b border-tertiary/10">
        <div 
          onClick={() => document.querySelector('input[type="file"]').click()}
          className={`
            border-2 border-dashed border-tertiary/30 rounded-lg p-4
            hover:border-primary/30 transition-colors cursor-pointer
            flex flex-col items-center
            ${isUploading ? 'bg-tertiary/5' : ''}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <p className="text-sm text-tertiary text-center">
                Uploading files...
              </p>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-tertiary" />
              <p className="text-sm text-tertiary text-center">
                Drop files here or <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-tertiary/70">
                Supports PDF, DOCX, DOC, TXT
              </p>
            </>
          )}
        </div>
      </div>

      {/* Selection Header */}
        <div className="px-4 py-2 border-b border-tertiary/10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-primary">Documents  {selectedDocuments.length > 0 && (<span> Selected: {selectedDocuments.length}</span> )} </h2>
            {documents.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-tertiary hover:text-primary transition-colors"
              >
                {isAllSelected ? 'Deselect all' : 'Select all'}
              </button>
            )}
          </div>
        </div>

      {/* Dropzone Indicator */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm 
          border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-blue-600 font-medium">
            Drop files here...
          </div>
        </div>
      )}

      {/* Document Lists */}
      <DocumentList
        documents={documents}
        stagedDocuments={stagedDocuments}
        selectedDocuments={selectedDocuments}
        onSelect={onSelect}
        onView={onView}
        onDelete={setDeleteDocumentName}
        onDetails={setDocumentDetails}
        onUploadStaged={onUploadStaged}
      />

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



