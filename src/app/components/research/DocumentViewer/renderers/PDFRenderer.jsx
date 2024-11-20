// src/app/components/research/DocumentViewer/renderers/PDFRenderer.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { useDocumentViewer } from '../context/DocumentViewerContext';
import { findTextPositions, HIGHLIGHT_COLORS } from '../utils/highlight';
import { HighlightLayer } from '../components/HighlightLayer';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}


export function PDFRenderer({ url, pointers }) {
  const {
    currentPage,
    scale,
    setTotalPages,
    setIsLoading,
    searchQuery,
    addHighlight,
    removeHighlight
  } = useDocumentViewer();

  const [pageContent, setPageContent] = useState(null);
  const containerRef = useRef(null);

  // Handle document load
  const handleDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
    setIsLoading(false);
  };

  // Handle page load and text content extraction
  const handlePageLoadSuccess = async (page) => {
    try {
      const content = await page.getTextContent();
      setPageContent(content);

      // Process pointers for current page
      const pagePointers = pointers.filter(p => p.page_number === currentPage);
      pagePointers.forEach(pointer => {
        const positions = findTextPositions(content, pointer.section_start, scale);
        if (positions.length > 0) {
          addHighlight({
            id: pointer.section_id,
            positions,
            type: 'pointer',
            text: pointer.text,
            metadata: {
              context: pointer.matching_context,
              theme: pointer.matching_theme
            }
          });
        }
      });

      // Process search query
      if (searchQuery) {
        const positions = findTextPositions(content, searchQuery, scale);
        if (positions.length > 0) {
          addHighlight({
            id: `search-${currentPage}`,
            positions,
            type: 'search',
            text: searchQuery
          });
        }
      }
    } catch (error) {
      console.error('Error processing page:', error);
    }
  };

  // Cleanup highlights when page changes
  useEffect(() => {
    return () => {
      removeHighlight(`search-${currentPage}`);
    };
  }, [currentPage, removeHighlight]);

  return (
    <div className="relative" ref={containerRef}>
      <Document
        file={url}
        onLoadSuccess={handleDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
      >
        <Page
          pageNumber={currentPage}
          scale={scale}
          onLoadSuccess={handlePageLoadSuccess}
          loading={<div>Loading page...</div>}
          renderTextLayer={true}
          renderAnnotationLayer={false}
        >
          <HighlightLayer
            pageContent={pageContent}
            scale={scale}
            colors={HIGHLIGHT_COLORS}
          />
        </Page>
      </Document>
    </div>
  );
}

export default PDFRenderer;