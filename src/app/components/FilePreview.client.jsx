// src/app/components/FilePreview.client.jsx
'use client';

import Image from 'next/image';
import { FileText, File, FileImage } from 'lucide-react';
import { FILE_TYPES } from '@/app/utils/file/fileConfig';
import { AnalysisResults } from './AnalysisResults.client';


export function FilePreview({ 
  file, 
  fileType, 
  analysis,
  className = '' 
}) {
  const FileIcon = () => {
    switch(fileType.icon) {
      case 'FileText':
        return <FileText className="w-12 h-12 text-tertiary" />;
      case 'FileImage':
        return <FileImage className="w-12 h-12 text-tertiary" />;
      default:
        return <File className="w-12 h-12 text-tertiary" />;
    }
  };

  if (fileType.type === FILE_TYPES.IMAGE && fileType.canPreview) {
    return (
      <div className={`relative aspect-square rounded-lg overflow-hidden ${className}`}>
        <Image
          src={URL.createObjectURL(file)}
          alt={file.name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`
        relative aspect-square rounded-lg overflow-hidden
        bg-background border border-tertiary
        flex flex-col items-center justify-center
        ${className}
      `}>
        <FileIcon />
        <div className="absolute bottom-0 inset-x-0 p-2 bg-background/80 backdrop-blur-sm">
          <p className="text-xs text-secondary text-center truncate">
            {file.name.split('.').pop().toUpperCase()}
          </p>
        </div>
      </div>
      
      {/* Add Analysis Results if available */}
      {analysis && <AnalysisResults analysis={analysis} />}
    </div>
  );
}