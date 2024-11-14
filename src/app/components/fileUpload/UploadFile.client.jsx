// src/app/components/file/UploadFile.client.jsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, AlertCircle, FileX, X } from 'lucide-react';
import { getFileType, ACCEPTED_FILES, FILE_TYPES, formatFileSize } from '@/app/utils/file/fileConfig';
import { FilePreview } from '../FilePreview.client';
import { toast } from '@/app/components/ui/Toast.client';

export function UploadFile({
  acceptedTypes = [FILE_TYPES.IMAGE, FILE_TYPES.DOCUMENT],
  maxFiles = 5,
  onAnalysisComplete
}) {
  const [files, setFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState(new Map()); // Track loading state per file
  const [errorFiles, setErrorFiles] = useState(new Map()); // Track errors per file

  const uploadFile = async (file) => {
    // Set loading state for this file
    console.log("uploading file:", file.name);
    setUploadingFiles(prev => new Map(prev).set(file.name, true));
    setErrorFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(file.name);
      return newMap;
    });

    try {
        const fileType = getFileType(file);
        
        if (!fileType) {
          throw new Error('Unsupported file type');
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType.type); // Send actual MIME type instead of category
    
        const response = await fetch('/api/file/document/upload', {
          method: 'POST',
          body: formData,
        });
    
        const data = await response.json();
    
        if (data.status === 'failed') {
          toast.error(`Failed to upload ${file.name}`);
          throw new Error(data.error || 'Upload failed');
        }

      // Update files state with upload result and analysis
      setFiles(prev => [...prev, {
        id: data.fileId,
        file,
        fileType,
        url: data.url,
        analysis: data.analysis
      }]);

      if (data.analysis) {
        setAnalysisResults(prev => ({
          ...prev,
          [data.fileId]: data.analysis
        }));
        onAnalysisComplete?.(data.analysis);
      }

      toast.success(`File ${file.name} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      setErrorFiles(prev => new Map(prev).set(file.name, {
        message: error.message,
        file
      }));
      toast.error(error.message || `Failed to upload ${file.name}`);
    } finally {
      setUploadingFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(file.name);
        return newMap;
      });
    }
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files first
    console.log("acceptedFiles:", acceptedFiles);
    console.log("rejectedFiles:", rejectedFiles);
    rejectedFiles.forEach(rejection => {
      const { file, errors } = rejection;
      let errorMessage = 'File upload failed: ';
      
      errors.forEach(error => {
        switch (error.code) {
          case 'file-too-large':
            errorMessage = `File ${file.name} is too large. Maximum size is ${formatFileSize(error.maxSize)}`;
            break;
          case 'file-invalid-type':
            errorMessage = `File ${file.name} is not a supported format`;
            break;
          case 'too-many-files':
            errorMessage = `Too many files. Maximum allowed is ${maxFiles}`;
            break;
          default:
            errorMessage += error.message;
        }
      });

      toast.error(errorMessage);
      setErrorFiles(prev => new Map(prev).set(file.name, {
        message: errorMessage,
        file
      }));
    });

    // Process accepted files
    acceptedFiles.forEach(uploadFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({
      ...acc,
      ...ACCEPTED_FILES[type].accept
    }), {}),
    maxFiles,
    maxSize: Math.max(...acceptedTypes.map(type => ACCEPTED_FILES[type].maxSize)),
    disabled: uploadingFiles.size > 0,
  });

  const removeError = (fileName) => {
    setErrorFiles(prev => {
      const newMap = new Map(prev);
      newMap.delete(fileName);
      return newMap;
    });
  };

  return (
    <div className="card w-full max-w-4xl mx-auto p-4">
      {/* Drop Zone */}
      <div
        {...getRootProps({
          className: `
            relative p-8 mt-6
            border-2 border-dashed border-tertiary
            rounded-lg
            transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
            ${uploadingFiles.size > 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            animate-fade-in
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
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-tertiary">
                Supported types: Images, PDF, Word Documents
              </p>
              <p className="text-xs text-tertiary">
                Maximum file size: {formatFileSize(Math.max(...acceptedTypes.map(type => ACCEPTED_FILES[type].maxSize)))}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Files Display */}
      {errorFiles.size > 0 && (
  <div className="mt-4">
    <h4 className="text-sm font-medium text-primary flex items-center gap-2 mb-2">
      <AlertCircle className="w-4 h-4" />
      Failed Upload
    </h4>
    <div className="space-y-2 max-h-32 overflow-y-auto">
      {Array.from(errorFiles.values()).map(({ message, file }) => (
        <div 
          key={file.name} 
          className="flex items-center gap-2 p-2 rounded-md bg-primary/5 text-xs"
        >
          <FileX className="w-4 h-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-primary font-medium truncate">
              {file.name}
            </p>
            <p className="text-tertiary truncate">
              {message}
            </p>
          </div>
          <button
            onClick={() => removeError(file.name)}
            className="p-1 hover:bg-background/50 rounded-full transition-colors"
            aria-label="Remove error"
          >
            <X className="w-3 h-3 text-tertiary hover:text-primary" />
          </button>
            </div>
        ))}
        </div>
        </div>
    )}

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Uploaded Files</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map(({ file, fileType, analysis }) => (
              <FilePreview
                key={file.name}
                file={file}
                fileType={fileType}
                analysis={analysis}
                className="animate-fade-in"
              />
            ))}
          </div>
        </div>
      )}

      {/* Global Loading State */}
      {uploadingFiles.size > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 ">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-primary">
              Uploading {uploadingFiles.size} file{uploadingFiles.size > 1 ? 's' : ''}...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadFile;