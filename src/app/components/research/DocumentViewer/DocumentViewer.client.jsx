// src/app/components/research/DocumentViewer/DocumentViewer.client.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { SearchToolbar } from './SearchToolbar.client';
import { usePdfTextSearch } from '../../../hooks/usePdfTextSearch'
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  Download,
  Loader2
} from 'lucide-react';

// Configure PDF.js worker
console.log('[DocumentViewer] Configuring PDF.js worker');
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;



export function DocumentViewer({ document, onClose, searchInResults, className = '' }) {
  console.log('[DocumentViewer] Component mounted with document:', document);
  // console.log('[DocumentViewer] Document type:', document instanceof File ? 'File' : typeof document);

  // Viewer state
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchResult, setCurrentSearchResult] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchResults, setIsSearchResults] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const [pageTextContent, setPageTextContent] = useState({});

  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  
  const { resultsList, isSearching } = usePdfTextSearch(documentUrl, searchTerm);




  const handleGetTextSuccess = useCallback(({ items, pageIndex }) => {
    console.log('[DocumentViewer] Got text content for page:', { pageIndex, itemCount: items.length });
    
    setPageTextContent(prev => ({
      ...prev,
      [pageIndex]: items.map(item => ({
        text: item.str,
        height: item.height,
        width: item.width,
        transform: item.transform
      }))
    }));
  }, []);



  const getProxiedUrl = async (url) => {
    console.log('[DocumentViewer] Getting proxied URL for:', url);
    
    try {
        const response = await fetch('/api/research/documents/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        // Check for error responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to proxy document');
        }

        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/pdf')) {
            console.warn('[DocumentViewer] Unexpected content type:', contentType);
        }

        const blob = await response.blob();

        return URL.createObjectURL(blob);
        
    } catch (error) {
        console.error('[DocumentViewer] Proxy error:', error);
        throw error;
    }
};
  

  const handleSearch = useCallback((query, isResults = false, pageNumber = 1) => {

    setSearchTerm(query);
    setCurrentMatchIndex(0);
    setIsSearchResults(isResults)
    setCurrentPage(pageNumber)
  }, []);

  


  const handleSearchNavigate = useCallback(
    (direction) => {
      if (!resultsList.length) return;
  
      setCurrentMatchIndex((prev) => {
        const next =
          direction === 'next'
            ? (prev + 1) % resultsList.length
            : prev === 0
            ? resultsList.length - 1
            : prev - 1;
  
        // Navigate to the page containing the match
        setCurrentPage(resultsList[next].pageNumber);
        return next;
      });
    },
    [resultsList]
  );
  

  const customTextRenderer = useCallback(
    ({ str, itemIndex }) => {
      if (!searchTerm || !resultsList.length) return str;
  
      const matches = resultsList.filter(
        result => result.itemIndex === itemIndex && result.pageNumber === currentPage
      );
  
      if (!matches.length) return str;
  
      return matches.map((match, idx) => {
        const { startIndex, endIndex } = match;
        const beforeMatch = str.slice(0, startIndex);
        const matchText = str.slice(startIndex, endIndex);
        const afterMatch = str.slice(endIndex);
  
        // Check if this match is the active one
        const isActive = resultsList.indexOf(match) === currentMatchIndex;
  
        // Convert to string for React-PDF compatibility
        return ReactDOMServer.renderToStaticMarkup(
          <>
            {beforeMatch}
            <mark
              style={{
                backgroundColor: isActive ? 'yellow' : 'blue',
                color: 'transparent',
                padding: 0,
                margin: 0,
                whiteSpace: 'pre',
              }}
            >
              {matchText}
            </mark>
            {afterMatch}
          </>
        );
      })[0]; // Only render the first match for the text item
    },
    [searchTerm, resultsList, currentPage, currentMatchIndex] 
  );
  

  // Set document URL
  useEffect(() => {
    // console.log('[DocumentViewer] Document changed, initialising URL');
    let isMounted = true;
    
    const initializeDocument = async () => {
      if (!document) {
        console.log('[DocumentViewer] No document provided');
        return;
      }
  
      try {
        const url = document.file_url;
        // console.log('[DocumentViewer] Using document URL:',  url);
  
        // Get proxied URL
        const proxiedUrl = await getProxiedUrl(url);
        console.log('[DocumentViewer] Created proxied URL:', proxiedUrl);
    
    
        if (isMounted) {
          console.log('[DocumentViewer] Mount proxied URL');
          setDocumentUrl(proxiedUrl);
          setError(null);
        }
      } catch (error) {
        console.error('[DocumentViewer] Error initializing document:', error);
        if (isMounted) {
          setError(`Failed to prepare document: ${error.message}`);
        }
      }
    };
  
    initializeDocument();
  
    return () => {
      isMounted = false;
    };
  }, [document]);

  // Reset state when document changes
  useEffect(() => {
    // console.log('[DocumentViewer] Resetting viewer state for new document');
    setCurrentPage(1);
    setScale(1);
    setError(null);
    setIsLoading(true);
    setNumPages(null);
  }, [document]);


  useEffect(() => {
    if(searchInResults){
      setSearchTerm(searchInResults);
      setCurrentMatchIndex(0);
      const isResults = true
      const {text, page} = searchInResults
      handleSearch(text, isResults, page)
    }
  }, [searchInResults, handleSearch]);



  const handleLoadSuccess = ({ numPages }) => {
    // console.log('[DocumentViewer] Document loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setIsLoading(false);
  };

  const handleLoadError = (error) => {
    console.log('[DocumentViewer] Document load error:', error);
    console.log('[DocumentViewer] Current document URL:', documentUrl);
    setError('Failed to load document');
    setIsLoading(false);
  };

  const goToPrevPage = () => {
    console.log('[DocumentViewer] Navigating to previous page');
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      console.log('[DocumentViewer] Page change:', prev, '->', newPage);
      return newPage;
    });
  };

  const goToNextPage = () => {
    console.log('[DocumentViewer] Navigating to next page');
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, numPages || prev);
      console.log('[DocumentViewer] Page change:', prev, '->', newPage);
      return newPage;
    });
  };

  const zoomIn = () => {
    console.log('[DocumentViewer] Zooming in');
    setScale(prev => {
      const newScale = Math.min(prev + 0.2, 3);
      console.log('[DocumentViewer] Scale change:', prev, '->', newScale);
      return newScale;
    });
  };

  const zoomOut = () => {
    console.log('[DocumentViewer] Zooming out');
    setScale(prev => {
      const newScale = Math.max(prev - 0.2, 0.5);
      console.log('[DocumentViewer] Scale change:', prev, '->', newScale);
      return newScale;
    });
  };

  const resetZoom = () => {
    console.log('[DocumentViewer] Resetting zoom');
    setScale(1);
  };

  if (!document) {
    console.log('[DocumentViewer] No document to render');
    return null;
  }

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      
      <div className="flex sticky top-0 items-center justify-center px-4 py-2 border-b border-tertiary/10 min-w-0 z-50 bg-white">
      {/* Left Section - Always visible */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded hover:bg-tertiary/10 text-tertiary hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {/* Search - Collapsible on smaller widths */}
      <div className="flex-shrink items-center">
          <SearchToolbar 
            onSearch={handleSearch}
            onNavigate={handleSearchNavigate}
            totalResults={resultsList.length}
            currentMatch={resultsList.length ? currentMatchIndex + 1 : 0}
            isSearching={isSearching}
          />
        </div>

      {/* Center/Right Section - Flexible layout */}
      <div className="flex items-center gap-4">

        {/* Navigation - Fixed size */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="p-1 rounded hover:bg-tertiary/10 text-tertiary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            <input
              type="text" // Changed from number to text
              value={currentPage}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty input for typing
                if (value === '') {
                  setCurrentPage(value);
                  return;
                }
                // Parse number and validate
                const pageNum = parseInt(value);
                if (!isNaN(pageNum) && pageNum > 0 && pageNum <= numPages) {
                  setCurrentPage(pageNum);
                }
              }}
              // Handle blur to reset invalid values
              onBlur={() => {
                if (currentPage === '' || currentPage < 1) {
                  setCurrentPage(1);
                } else if (currentPage > numPages) {
                  setCurrentPage(numPages);
                }
              }}
              className="w-12 px-1 py-0.5 text-center text-sm text-tertiary 
                bg-tertiary/5 border border-tertiary/10 rounded
                focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <span className="text-sm text-tertiary whitespace-nowrap">/ {numPages || '?'}</span>
          </div>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= (numPages || 1) || isLoading}
            className="p-1 rounded hover:bg-tertiary/10 text-tertiary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Zoom Controls - Rightmost */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5 || isLoading}
            className="p-1 rounded hover:bg-tertiary/10 text-tertiary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="px-2 py-1 text-xs text-tertiary min-w-[48px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= 3 || isLoading}
            className="p-1 rounded hover:bg-tertiary/10 text-tertiary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={resetZoom}
            disabled={isLoading}
            className="p-1 rounded hover:bg-tertiary/10 text-tertiary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          {uploadStatus ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-tertiary">{uploadStatus}</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <p className="text-sm mt-2 text-tertiary">
                Document URL: {documentUrl || 'Not available'}
              </p>
            </div>
          ) : documentUrl ? (
            <Document
              file={documentUrl}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={handleLoadError}
              renderAnnotationLayer={false}
              renderMode="canvas"
              renderTextLayer={true}
              loading={
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-tertiary">Loading document...</p>
                </div>
              }
            >
              <Page
                key={`${currentPage}-${searchTerm}`}
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                customTextRenderer={customTextRenderer}
                width={containerWidth}
                className="relative"
                onGetTextSuccess={handleGetTextSuccess}
                loading={
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-tertiary">Loading page {currentPage}...</p>
                  </div>
                }
              />
            </Document>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-tertiary">Preparing document...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

