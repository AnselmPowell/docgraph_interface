// src/app/components/governance/UploadForm.client.jsx
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, AlertCircle, X } from 'lucide-react';
import { toast } from '../ui/Toast.client';

export function UploadForm({ onUpload, isProcessing }) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      // Check total files limit including existing files
      const totalFiles = files.length + acceptedFiles.length;
      if (totalFiles > 3) {
        toast.error('Maximum 3 files allowed');
        return;
      }

      // Check for duplicates and add new files
      const newFiles = acceptedFiles.filter(newFile => 
        !files.some(existingFile => 
          existingFile.name === newFile.name && 
          existingFile.size === newFile.size
        )
      );

      if (newFiles.length !== acceptedFiles.length) {
        toast.warning('Some files were skipped as they were already added');
      }

      // Combine existing files with new unique files
      setFiles(currentFiles => [...currentFiles, ...newFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 3,
    disabled: isProcessing
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }
    onUpload(files);
  };

  const removeFile = (fileToRemove) => {
    setFiles(currentFiles => 
      currentFiles.filter(file => file.name !== fileToRemove.name)
    );
  };

  return (
    <div className="card p-6 bg-background">
      <div
        {...getRootProps({
          className: `
            relative p-8 mt-6
            border-2 border-dashed border-tertiary
            rounded-lg
            transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-y-4">
          <Upload className={`w-12 h-12 ${isDragActive ? 'text-primary' : 'text-tertiary'}`} />
          {isDragActive ? (
            <p className="text-primary animate-pulse">Drop files here...</p>
          ) : (
            <>
              <p className="text-secondary text-center">
                Drag and drop governance documents, or click to select
              </p>
              <p className="text-xs text-tertiary">
                Supported formats: PDF, DOCX, TXT (Max 3 files)
              </p>
              <p className="text-xs text-tertiary">
                {files.length}/3 files selected
              </p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-primary mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map(file => (
              <li
                key={file.name}
                className="flex items-center justify-between p-2 rounded-md bg-background/50 group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm text-secondary truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-tertiary shrink-0">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </div>
                {!isProcessing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering dropzone click
                      removeFile(file);
                    }}
                    className="p-1 rounded-full hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-tertiary hover:text-primary" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          
          <button
            onClick={handleSubmit}
            disabled={isProcessing || files.length === 0}
            className="btn w-full mt-4"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing {files.length} file{files.length !== 1 ? 's' : ''}...
              </span>
            ) : (
              `Analyse ${files.length} Document${files.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}