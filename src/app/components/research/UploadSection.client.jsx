// src/app/components/research/UploadSection.client.jsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '../ui/Toast.client';

export function UploadSection({ onAnalyze, isProcessing }) {
  // Form state
  const [files, setFiles] = useState([]);
  const [context, setContext] = useState('');
  const [theme, setTheme] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  
  // Character counter for context
  const maxChars = 800; // Approximately 200 words
  const remainingChars = maxChars - context.length;

  // File upload handling
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (isProcessing) return;

    // Handle rejected files
    rejectedFiles.forEach(rejection => {
      const reason = rejection.errors[0]?.message || 'Invalid file';
      toast.error(`${rejection.file.name}: ${reason}`);
    });

    // Add new files
    console.log("Add files")
    setFiles(currentFiles => {
      const newFiles = acceptedFiles.filter(newFile => 
        !currentFiles.find(existingFile => 
          existingFile.name === newFile.name
        )
      );
      console.log("new files", newFiles)
      if (newFiles.length !== acceptedFiles.length) {
        toast.warning('Some files were already added');
      }
      
      return [...currentFiles, ...newFiles];
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

  // Keyword handling
  const addKeyword = useCallback((e) => {
    e.preventDefault();
    if (!currentKeyword.trim()) return;
    
    setKeywords(prev => {
      if (prev.includes(currentKeyword.trim())) {
        toast.warning('Keyword already added');
        return prev;
      }
      return [...prev, currentKeyword.trim()];
    });
    setCurrentKeyword('');
  }, [currentKeyword]);

  const removeKeyword = useCallback((keywordToRemove) => {
    setKeywords(prev => prev.filter(k => k !== keywordToRemove));
  }, []);

  // Remove file
  const removeFile = useCallback((fileToRemove) => {
    setFiles(prev => prev.filter(f => f.name !== fileToRemove.name));
  }, []);

  // Form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!files.length) {
      toast.error('Please upload at least one document');
      return;
    }

    if (!context.trim()) {
      toast.error('Please provide research context');
      return;
    }

    if (!theme.trim()) {
      toast.error('Please specify a research theme');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('context', context);
    formData.append('theme', theme);
    formData.append('keywords', keywords.join(','));

    onAnalyze(formData);
  }, [files, context, theme, keywords, onAnalyze]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Document Upload Zone */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Research Documents
        </label>
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

      {/* Research Context */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Research Context
        </label>
        <div className="relative">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            maxLength={maxChars}
            disabled={isProcessing}
            className="w-full h-32 p-3 rounded-lg border border-tertiary/20 
                     bg-background text-primary resize-none"
            placeholder="Describe what you're researching (max 200 words)..."
          />
          <span className={`
            absolute bottom-2 right-2 text-xs
            ${remainingChars < 100 ? 'text-primary' : 'text-tertiary'}
          `}>
            {remainingChars} characters remaining
          </span>
        </div>
      </div>

      {/* Theme Input */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Research Theme
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          disabled={isProcessing}
          className="w-full p-3 rounded-lg border border-tertiary/20 
                   bg-background text-primary"
          placeholder="Enter main research theme..."
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Keywords (Optional)
        </label>
        <div className="space-y-3">
          {/* Keyword Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword(e)}
              disabled={isProcessing}
              className="flex-1 p-3 rounded-lg border border-tertiary/20 
                       bg-background text-primary"
              placeholder="Add keyword..."
            />
            <button
              type="button"
              onClick={addKeyword}
              disabled={!currentKeyword.trim() || isProcessing}
              className="px-4 py-2 rounded-lg bg-primary text-background 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          {/* Keyword Tags */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map(keyword => (
                <span
                  key={keyword}
                  className="inline-flex items-center px-3 py-1 rounded-full 
                           bg-primary/10 text-primary text-sm"
                >
                  {keyword}
                  {!isProcessing && (
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 hover:text-primary/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !files.length || !context.trim() || !theme.trim()}
        className="w-full py-3 px-4 rounded-lg bg-primary text-background
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center space-x-2"
      >
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
      </button>
    </form>
  );
}