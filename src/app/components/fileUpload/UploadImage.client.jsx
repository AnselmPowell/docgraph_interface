
// src/app/components/fileUpload/UploadImage.client.jsx
'use client';

import { useCallback, useState, } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/Button.client';
import { DeleteButton } from '../ui/DeleteButton.client';
import { toast } from '../ui/Toast.client';

export function UploadImage() {
  const [files, setFiles] = useState([]);
  const [deletingFiles, setDeletingFiles] = useState(new Set());

  const uploadFile = async (file) => {
    try {
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.file === file ? { ...f, uploading: true } : f))
      );

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/file/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await response.json();

      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file === file ? { 
            ...f, 
            uploading: false, 
            id: uploadData.fileId,
            url: uploadData.url 
          } : f
        )
      );

      toast.success(`File ${file.name} uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.file === file ? { ...f, uploading: false } : f))
      );
      toast.error("Failed to upload file");
    }
  };

  const removeFile = async (fileId, fileName) => {
    if (fileId && !deletingFiles.has(fileId)) {
      try {
        // Add file to deleting set
        setDeletingFiles(prev => new Set(prev).add(fileId));

        const response = await fetch('/api/file/image/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId }),
        });

        const result = await response.json();
        if (result[0].status === "OK") {
          setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileId));
          toast.success(`File ${fileName} deleted successfully`);
        } else {
          throw new Error("Failed to delete file");
        }
      } catch (error) {
        toast.error("Error deleting file");
      } finally {
        // Remove file from deleting set
        setDeletingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({ file, uploading: false })),
      ]);

      acceptedFiles.forEach(uploadFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      if (fileRejections.length) {
        if (fileRejections.find(r => r.errors[0].code === "too-many-files")) {
          toast.error("Too many files selected, max is 5");
        }
        if (fileRejections.find(r => r.errors[0].code === "file-too-large")) {
          toast.error("File size exceeds 5MB limit");
        }
      }
    },
    maxFiles: 5,
    maxSize: 1024 * 1024 * 5,
    accept: { "image/*": [] },
  });

  return (
    <div className="card w-full max-w-4xl mx-auto p-4">
      <div
        {...getRootProps({
          className: `
            relative p-8 mt-6
            border-2 border-dashed border-tertiary
            rounded-lg
            transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
            cursor-pointer
            animate-fade-in
          `,
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
              <Button variant="secondary" size="sm">
                Select Files
              </Button>
            </>
          )}
        </div>
      </div>

      
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-primary">Uploaded Files</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map(({ file, uploading, id }) => (
              <div key={file.name} className="group relative animate-fade-in">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className={`
                      object-cover transition-opacity 
                      ${uploading || deletingFiles.has(id) ? 'opacity-50' : ''}
                    `}
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                  {!uploading && (
                    <DeleteButton
                      onDelete={() => removeFile(id, file.name)}
                      isDeleting={deletingFiles.has(id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm text-secondary truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadImage;