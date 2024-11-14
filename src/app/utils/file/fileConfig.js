// src/app/utils/file/fileConfig.js
'use client';

// File type definitions
export const FILE_TYPES = {
    IMAGE: 'image',
    DOCUMENT: 'document'
  };


// File type configurations
export const ACCEPTED_FILES = {
  [FILE_TYPES.IMAGE]: {
    accept: {
      'image/*': [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    previewTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  [FILE_TYPES.DOCUMENT]: {
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.oasis.opendocument.text': ['.odt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    analyzableTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text'
    ],
    icons: {
      'application/pdf': 'FileText',
      'application/msword': 'FileText',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'FileText'
    }
  }
};

// File type checker
export const getFileType = (file) => {
    const type = file.type;
    
    // Handle images
    if (type.startsWith('image/')) {
      return {
        type: type, // Return actual image MIME type (e.g., 'image/jpeg')
        category: FILE_TYPES.IMAGE,
        canPreview: ACCEPTED_FILES[FILE_TYPES.IMAGE].previewTypes.includes(type)
      };
    }
    
    // Handle documents
    const documentTypes = Object.keys(ACCEPTED_FILES[FILE_TYPES.DOCUMENT].accept);
    if (documentTypes.includes(type)) {
      return {
        type: type, // Return actual document MIME type (e.g., 'application/pdf')
        category: FILE_TYPES.DOCUMENT,
        canAnalyze: ACCEPTED_FILES[FILE_TYPES.DOCUMENT].analyzableTypes.includes(type),
        icon: ACCEPTED_FILES[FILE_TYPES.DOCUMENT].icons[type] || 'FileText' // Fallback icon
      };
    }
    
    return null;
  };

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024; // Correct value for byte conversion
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  