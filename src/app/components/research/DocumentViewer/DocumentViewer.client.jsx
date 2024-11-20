// src/app/components/research/DocumentViewer/DocumentViewer.client.jsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { DocumentViewerProvider } from './context/DocumentViewerContext';
import { ViewerToolbar } from './components/ViewerToolbar.client';
import { PageNavigation } from './components/PageNavigation.client';
import { PageThumbnails } from './components/PageThumbnails.client';
import { SearchOverlay } from './components/SearchOverlay.client';
import { LoadingOverlay } from './components/LoadingOverlay.client';

const PDFRenderer = dynamic(() => import('./renderers/PDFRenderer'), {
  ssr: false,
  loading: () => <LoadingOverlay />
});

const DOCXRenderer = dynamic(() => import('./renderers/DOCXRenderer'), {
  ssr: false,
  loading: () => <LoadingOverlay />
});

export function DocumentViewer({
  document,
  onClose,
  onSave,
  onRemove
}) {
  const [documentType, setDocumentType] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);

  useEffect(() => {
    if (!document?.file_url) return;
    
    setDocumentUrl(document.file_url);
    setDocumentType(document.file_url.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx');

    return () => {
      if (documentUrl) URL.revokeObjectURL(documentUrl);
    };
  }, [document]);

  if (!documentType || !documentUrl) {
    return <LoadingOverlay />;
  }

  return (
    <DocumentViewerProvider initialPointers={document?.pointers}>
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="h-full flex flex-col">
          {/* Toolbar */}
          <ViewerToolbar 
            onClose={onClose}
            onSave={() => onSave(document.id)}
            metadata={document.metadata}
          />

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Thumbnails */}
            <PageThumbnails />

            {/* Document Area */}
            <div className="flex-1 relative">
              {/* Document Display */}
              <div className="absolute inset-0 overflow-auto">
                {documentType === 'pdf' ? (
                  <PDFRenderer
                    url={documentUrl}
                    pointers={document.pointers}
                  />
                ) : (
                  <DOCXRenderer
                    url={documentUrl}
                    pointers={document.pointers}
                  />
                )}
              </div>

              {/* Navigation */}
              <PageNavigation />

              {/* Search Overlay */}
              <SearchOverlay />
            </div>
          </div>
        </div>
      </div>
    </DocumentViewerProvider>
  );
}

export default DocumentViewer;