// src/app/components/research/DocumentManagement/DocumentSidebar.client.jsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import {  Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, Loader2 
} from 'lucide-react';

import { DocumentList } from './DocumentList.client';
import { UrlInput } from './UrlInput.client';
import { DeleteDocumentModal } from './DeleteDocumentModal.client';
import { DocumentDetailsModal } from './DocumentDetailsModal.client';
import { UploadConfirmationModal } from './UploadConfirmationModal.client';
import { toast } from '../../messages/Toast.client';

export function DocumentSidebar({
  documents = [],
  selectedDocuments = [],
  stagedDocuments = [],
  pendingDocuments = [],
  onSelect,
  onSelectAll,
  onView,
  onDelete,
  onDeleteAll,
  onStagedUpload,
  onUrlSubmit,
  isFetchingDocuments,
  
}) {
  // Existing state
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [deleteDocumentName, setDeleteDocumentName] = useState(null);
  const [documentDetails, setDocumentDetails] = useState(null);
  const [isUploading, setIsUploading] = useState(isFetchingDocuments);

  // New state for confirmation modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [duplicateFiles, setDuplicateFiles] = useState([]);

  // Function to check for duplicate files
  const checkForDuplicates = (files) => {
    // Get all existing filenames (from documents and staged documents)
    const existingFileNames = [
      ...documents.map(doc => doc.file_name),
      ...stagedDocuments.map(doc => doc.file_name),
      ...pendingDocuments.map(doc => doc.file_name)
    ];

    // Find duplicates in the new files
    const duplicates = files
      .filter(file => existingFileNames.includes(file.name))
      .map(file => file.name);

    return duplicates;
  };

  // Modified dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      if (files.length === 0) return;
      
      // Check for duplicates
      const duplicates = checkForDuplicates(files);
      
      // Set files for confirmation
      setFilesToUpload(files);
      setDuplicateFiles(duplicates);
      
      // Show confirmation modal
      setShowUploadModal(true);
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

  // Function to handle file removal from upload list
  const handleRemoveFileFromUpload = (fileToRemove) => {
    setFilesToUpload(prevFiles => 
      prevFiles.filter(file => 
        !(file.name === fileToRemove.name && file.size === fileToRemove.size)
      )
    );
    
    // Also remove from duplicates list if present
    if (duplicateFiles.includes(fileToRemove.name)) {
      setDuplicateFiles(prev => prev.filter(name => name !== fileToRemove.name));
    }
  };

  // Function to handle confirmation and actual upload
  const handleConfirmUpload = async () => {
    if (filesToUpload.length === 0) return;
    
    setIsUploading(true);
    setShowUploadModal(false);
    
    try {
      await onStagedUpload(filesToUpload);
    } finally {
      setIsUploading(false);
      setFilesToUpload([]);
      setDuplicateFiles([]);
    }
  };

  // handle select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      // onSelect([]);
      setIsAllSelected(false);
    } else {
      onSelectAll()
      setIsAllSelected(true);
    }
  }; 

  useEffect(() => {
   
  }, [selectedDocuments]);

  console.log("selected Documents: ", selectedDocuments)

  return (
    <div {...getRootProps()} className="flex flex-col pb-3 h-full ">
      <input {...getInputProps()} />

      {/* URL Input Section */}
      <UrlInput onUrlSubmit={onUrlSubmit} />
       {/* Upload Area */}
       <div className=" border-b border-tertiary/10">
        <div 
          onClick={() => document.querySelector('input[type="file"]').click()}
          className={`
            border-2 border-dashed border-tertiary/30 rounded-lg px-4 py-1
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
              
              <p className="text-xs text-tertiary/70 flex flex-col text-center items-center">
                <span className="font-semibold">You can drag & drop</span>
                <span className="font-semibold">Only <strong>PDF</strong> files are supported</span>
              </p>
            
            </>
          )}
        </div>
      </div>

      {/* Selection Header */}
      {documents.length > 0 && (
          <div className="px-4 py-2 border-b border-tertiary/10">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Documents {selectedDocuments.length > 0 && (<span> Selected: {selectedDocuments.length}</span> )} 
              </h3>
              {documents.length > 0 && (
              <div className='flex active:translate-y-[0.5px] active:scale-95' >
                 <button
                  onClick={()=>{
                    if(isAllSelected){
                      onSelect([])
                    } 
                    handleSelectAll()
                   
                  }}
                  className="text-sm text-tertiary hover:text-primary transition-colors"
                >
                  {isAllSelected ? 'Deselect all' : 'Select all'}
                </button>
                {selectedDocuments.length > 1 &&
                <button
                onClick={onDeleteAll}
                className="text-sm ml-2 pl-0.5 text-tertiary hover:text-primary transition-colors  text-red-800 active:translate-y-[0.5px] active:scale-95"
                >
               <Trash2 className="w-5 h-5" />
              </button>
                }
              
              </div>
             
              
            )}
            </div>
          </div>
        )}


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
      pendingDocuments={pendingDocuments} 
      isLoading={isUploading}
      selectedDocuments={selectedDocuments}
      onSelect={onSelect}
      onView={onView}
      onDelete={onDelete}
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

      {/* New Upload Confirmation Modal */}
      <UploadConfirmationModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setFilesToUpload([]);
          setDuplicateFiles([]);
        }}
        filesToUpload={filesToUpload}
        duplicateFiles={duplicateFiles}
        onConfirmUpload={handleConfirmUpload}
        onRemoveFile={handleRemoveFileFromUpload}
      />
    </div>
  );
}
