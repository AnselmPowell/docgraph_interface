// src/app/components/research/UploadSection/UploadSection.client.jsx
'use client';

import { useState, useCallback } from 'react';
// import { FileUpload } from './FileUpload.client';
import { ContextInput } from './ContextInput.client';
import { ThemeSelector } from './ThemeSelector.client';
import { KeywordInput } from './KeywordInput.client';
import { Button } from '../../ui/Button.client';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '../../ui/Toast.client';

import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X } from 'lucide-react';

export function UploadSection({
  onAnalyze,
  isProcessing,
  activeTheme,
  searchParams,
  onSearchUpdate
}) {
  // Local state for form validation
  const [isValid, setIsValid] = useState({
    files: true,
    context: true,
    theme: true
  });
  const [files, setFiles] = useState([]);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    console.log("Sumbit file!")
    e.preventDefault();
    
    // if (!isValid.files || !isValid.context || !isValid.theme) {
    //   toast.error('Please complete all required fields');
    //   return;
    // }

    // Construct FormData from all inputs
    const formData = new FormData(e.target);
    console.log("form data", formData.getAll('files'))
    // Add theme as JSON string
    files.forEach(file => formData.append('files', file));
    formData.set('context', JSON.stringify(searchParams.context));
    formData.set('theme', JSON.stringify(searchParams.theme));
    
    // Add keywords as comma-separated string
    if (searchParams.keywords?.length) {
      formData.set('keywords', searchParams.keywords.join(','));
    }

    await onAnalyze(formData);
  }, [isValid, searchParams, onAnalyze]);

  // File upload handling
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
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
      
      const updatedFiles = [...currentFiles, ...newFiles];
      
      
      return updatedFiles;
    });
  }, [isProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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

  // Remove file handler
  const removeFile = useCallback((fileToRemove) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.name !== fileToRemove.name);
      return updatedFiles;
    });
  }, []);



  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-background rounded-lg border border-tertiary/10 p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">
          Research Document Analysis
        </h2>

        {/* File Upload */}
        <div className="mb-8">
        <div className="space-y-4">
      <label className="block text-sm font-medium text-primary">
        Research Documents <span className="text-primary">*</span>
      </label>

      {/* Dropzone */}
      <div
        {...getRootProps({
          className: `
            relative border-2 border-dashed rounded-lg p-6
            transition-colors duration-200
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-tertiary/20 hover:border-tertiary/40'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-primary' : 'text-tertiary'}`} />
          {isDragActive ? (
            <p className="text-primary">Drop files here...</p>
          ) : (
            <>
              <p className="text-secondary text-center">
                Drag & drop research documents or click to select
              </p>
              <p className="text-sm text-tertiary mt-2">
                PDF, DOC, DOCX, TXT (max 50MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div 
              key={file.name}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-tertiary/10"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-tertiary" />
                <div className="flex flex-col">
                  <span className="text-sm text-primary font-medium truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-tertiary">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="p-1 hover:bg-tertiary/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-tertiary" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
        </div>

        {/* Context Input */}
        <div className="mb-8">
          <ContextInput
            isProcessing={isProcessing}
            value={searchParams.context}
            onChange={(context) => {
              onSearchUpdate({ context });
            }}
          />
        </div>

        {/* Theme Selector */}
        <div className="mb-8">
          <ThemeSelector
            isProcessing={isProcessing}
            selectedTheme={searchParams.theme}
            onThemeChange={(theme) => {
              onSearchUpdate({ theme });
            }}
          />
        </div>

        {/* Keyword Input */}
        <div className="mb-8">
          <KeywordInput
            isProcessing={isProcessing}
            keywords={searchParams.keywords}
            onKeywordsChange={(keywords) => onSearchUpdate({ keywords })}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
        >
          <div className="flex items-center justify-center gap-2">
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing Documents...</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Analyze Documents</span>
              </>
            )}
          </div>
        </Button>
      </div>
    </form>
  );
}

