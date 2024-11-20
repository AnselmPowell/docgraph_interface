// src/app/components/research/DocumentViewer/components/ViewerToolbar.client.jsx
'use client';

import { useDocumentViewer } from '../context/DocumentViewerContext';
import { 
  ZoomIn, 
  ZoomOut, 
  Search, 
  X, 
  Download,
  Printer,
  RotateCcw,
  Share2
} from 'lucide-react';

export function ViewerToolbar({ onClose }) {
  const { 
    scale, 
    setScale,
    currentPage,
    totalPages,
    setSearchVisible,
  } = useDocumentViewer();

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  const handleReset = () => {
    setScale(1.0);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-tertiary/10">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors"
          aria-label="Close viewer"
        >
          <X className="w-5 h-5 text-tertiary" />
        </button>

        <div className="h-6 w-px bg-tertiary/10" />

        {/* Page Information */}
        <div className="text-sm text-tertiary">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Center Section - Zoom Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-tertiary" />
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-1 text-sm text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={scale >= 2.0}
          className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-tertiary" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setSearchVisible(true)}
          className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors"
          aria-label="Search document"
        >
          <Search className="w-5 h-5 text-tertiary" />
        </button>

        <div className="h-6 w-px bg-tertiary/10" />

        {/* Document Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => window.print()}
            className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors"
            aria-label="Print document"
          >
            <Printer className="w-5 h-5 text-tertiary" />
          </button>

          <button
            onClick={() => {/* Download implementation */}}
            className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors"
            aria-label="Download document"
          >
            <Download className="w-5 h-5 text-tertiary" />
          </button>

          <button
            onClick={() => {/* Share implementation */}}
            className="p-2 hover:bg-tertiary/10 rounded-lg transition-colors"
            aria-label="Share document"
          >
            <Share2 className="w-5 h-5 text-tertiary" />
          </button>
        </div>
      </div>
    </div>
  );
}