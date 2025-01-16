
// src/app/components/research/Upload/UploadModal.client.jsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from '../../ui/Toast.client';

export function UploadModal({
  isOpen,
  onClose,
  onUpload,
  isProcessing = false,
}) {
  const [files, setFiles] = useState([]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles, rejectedFiles) => {
      if (isProcessing) return;

      // Handle rejected files
      rejectedFiles.forEach(rejection => {
        const reason = rejection.errors[0]?.message || 'Invalid file';
        toast.error(`${rejection.file.name}: ${reason}`);
      });

      // Add new files
      setFiles(currentFiles => {
        const newFiles = acceptedFiles.filter(newFile => 
          !currentFiles.find(existingFile => 
            existingFile.name === newFile.name
          )
        );
        
        if (newFiles.length !== acceptedFiles.length) {
          toast.warning('Some files were already added');
        }
        
        return [...currentFiles, ...newFiles];
      });
    }, [isProcessing]),
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    disabled: isProcessing,
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isProcessing, onClose]);

  // Handle upload
  const handleUpload = useCallback(() => {
    if (isProcessing || !files.length) return;
    
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    onUpload?.(formData);
  }, [files, isProcessing, onUpload]);

  // Remove file from list
  const removeFile = useCallback((fileToRemove) => {
    setFiles(prev => prev.filter(f => f !== fileToRemove));
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65]"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="
          fixed top-[10%] left-[50%] transform -translate-x-1/2
          w-[90vw] max-w-2xl
          bg-background
          rounded-xl
          shadow-2xl
          z-[70]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tertiary/10">
          <h2 className="text-lg font-semibold text-primary">
            Upload Documents
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg hover:bg-tertiary/10 text-tertiary hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`
              relative p-8
              border-2 border-dashed 
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-tertiary/20'}
              rounded-lg
              transition-colors
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <Upload className={`w-12 h-12 ${isDragActive ? 'text-primary' : 'text-tertiary'}`} />
              {isDragActive ? (
                <p className="text-primary">Drop files here...</p>
              ) : (
                <>
                  <p className="text-secondary text-center">
                    Drag & drop research documents or click to select
                  </p>
                  <p className="text-sm text-tertiary">
                    PDF, DOC, DOCX (max 50MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-tertiary/5"
                >
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-tertiary" />
                    <div>
                      <p className="text-sm font-medium text-primary">{file.name}</p>
                      <p className="text-xs text-tertiary">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    disabled={isProcessing}
                    className="p-1.5 rounded-lg hover:bg-tertiary/10 text-tertiary hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-tertiary/10 bg-tertiary/5">
          <p className="text-sm text-tertiary">
            {files.length} file{files.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={handleUpload}
            disabled={isProcessing || !files.length}
            className="
              px-4 py-2 rounded-lg
              bg-primary text-background
              hover:bg-primary/90
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-colors
              flex items-center gap-2
            "
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}

