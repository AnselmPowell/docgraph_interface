// src/app/components/research/DocumentViewer.client.jsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  X,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Download,
  Share,
  Highlighter,
  Trash2
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from '../ui/Toast.client';

// PDF.js worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Highlight color options
const HIGHLIGHT_COLORS = {
  yellow: 'rgba(255, 235, 59, 0.4)',
  green: 'rgba(76, 175, 80, 0.4)',
  blue: 'rgba(33, 150, 243, 0.4)',
  purple: 'rgba(156, 39, 176, 0.4)',
  pink: 'rgba(244, 143, 177, 0.4)'
};

export function DocumentViewer({ 
  documentUrl, 
  initialHighlights = [],
  onClose,
  metadata = {},
  relevantSections = [] 
}) {
  // Core viewer state
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  
  // Highlight state
  const [highlights, setHighlights] = useState(initialHighlights);
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  
  // Refs
  const containerRef = useRef(null);
  const pageRefs = useRef({});

  // Initialize relevant sections as highlights
  useEffect(() => {
    if (relevantSections.length > 0) {
      const relevantHighlights = relevantSections.map(section => ({
        id: `relevant-${section.id}`,
        pageNumber: section.page_number,
        position: calculatePositionFromSection(section),
        color: 'blue',
        metadata: {
          type: 'relevant',
          context: section.matching_context,
          theme: section.matching_theme,
          keywords: section.matching_keywords
        }
      }));

      setHighlights(prev => [...prev, ...relevantHighlights]);
    }
  }, [relevantSections]);

  useEffect(() => {
    // Ensure worker is loaded only once and in client
    if (typeof window !== 'undefined') {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }
  }, []);

    // In DocumentViewer.client.jsx
    useEffect(() => {
        return () => {
        // Cleanup URLs and large objects
        URL.revokeObjectURL(documentUrl);
        setHighlights([]);
        };
    }, [documentUrl]);

  // Handle text selection and highlighting
  const handleTextSelection = useCallback(() => {
    if (!isHighlighting) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const bounds = range.getBoundingClientRect();
    const pageElement = range.startContainer.parentElement.closest('.react-pdf__Page');
    
    if (!pageElement) return;

    const pageNumber = parseInt(pageElement.getAttribute('data-page-number'));
    const pageRect = pageElement.getBoundingClientRect();

    // Calculate relative position within the page
    const position = {
      top: (bounds.top - pageRect.top) / scale,
      left: (bounds.left - pageRect.left) / scale,
      width: bounds.width / scale,
      height: bounds.height / scale,
      text: selection.toString()
    };

    // Create new highlight
    const newHighlight = {
      id: `highlight-${Date.now()}`,
      pageNumber,
      position,
      color: selectedColor,
      metadata: {
        text: position.text,
        note: '',
        createdAt: new Date().toISOString(),
        type: 'user'
      }
    };

    setHighlights(prev => [...prev, newHighlight]);
    selection.removeAllRanges();
    toast.success('Highlight added');
  }, [isHighlighting, selectedColor, scale]);

  // Render highlights for a specific page
  const renderHighlights = useCallback((pageNumber) => {
    return highlights
      .filter(h => h.pageNumber === pageNumber)
      .map(highlight => (
        <div
          key={highlight.id}
          className="absolute cursor-pointer transition-opacity hover:opacity-80"
          style={{
            top: highlight.position.top * scale,
            left: highlight.position.left * scale,
            width: highlight.position.width * scale,
            height: highlight.position.height * scale,
            backgroundColor: HIGHLIGHT_COLORS[highlight.color],
            border: selectedHighlight?.id === highlight.id 
              ? '2px solid rgba(0,0,0,0.5)' 
              : 'none'
          }}
          onClick={() => setSelectedHighlight(highlight)}
        />
      ));
  }, [highlights, scale, selectedHighlight]);

  // Handle highlight deletion
  const deleteHighlight = useCallback((highlightId) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
    setSelectedHighlight(null);
    toast.success('Highlight removed');
  }, []);

  // Handle highlight note update
  const updateHighlightNote = useCallback((highlightId, note) => {
    setHighlights(prev => prev.map(h => 
      h.id === highlightId 
        ? { ...h, metadata: { ...h.metadata, note } }
        : h
    ));
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="h-full flex flex-col" ref={containerRef}>
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-tertiary/10">
          {/* Previous toolbar content ... */}

          {/* Highlight Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHighlighting(!isHighlighting)}
              className={`
                p-2 rounded-md transition-colors
                ${isHighlighting ? 'bg-primary text-background' : 'hover:bg-tertiary/10'}
              `}
            >
              <Highlighter className="w-5 h-5" />
            </button>

            {isHighlighting && (
              <div className="flex items-center space-x-2">
                {Object.entries(HIGHLIGHT_COLORS).map(([color, value]) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-6 h-6 rounded-full border-2
                      ${selectedColor === color ? 'border-primary' : 'border-transparent'}
                    `}
                    style={{ backgroundColor: value }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Display */}
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-5xl mx-auto">
              <Document
                file={documentUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                  <div className="text-center py-8">
                    Loading document...
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  onLoadSuccess={page => {
                    pageRefs.current[currentPage] = page;
                  }}
                  customTextRenderer={({ str, itemIndex }) => (
                    <span
                      key={`${str}-${itemIndex}`}
                      onMouseUp={handleTextSelection}
                    >
                      {str}
                    </span>
                  )}
                >
                  {renderHighlights(currentPage)}
                </Page>
              </Document>
            </div>
          </div>

          {/* Highlights Panel */}
          <div className="w-64 border-l border-tertiary/10 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-primary mb-4">Highlights</h3>
              
              {highlights.length > 0 ? (
                <div className="space-y-4">
                  {highlights.map(highlight => (
                    <div
                      key={highlight.id}
                      className={`
                        p-3 rounded-lg transition-colors cursor-pointer
                        ${selectedHighlight?.id === highlight.id 
                          ? 'bg-tertiary/10' 
                          : 'hover:bg-tertiary/5'}
                      `}
                      onClick={() => {
                        setSelectedHighlight(highlight);
                        setCurrentPage(highlight.page_number);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: HIGHLIGHT_COLORS[highlight.color] }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHighlight(highlight.id);
                          }}
                          className="p-1 hover:bg-tertiary/10 rounded-full"
                        >
                          <Trash2 className="w-4 h-4 text-tertiary" />
                        </button>
                      </div>

                      <div className="text-sm text-secondary line-clamp-2">
                        {highlight.metadata.text}
                      </div>

                      {highlight.metadata.type === 'relevant' && (
                        <div className="mt-2 text-xs">
                          <div className="text-primary font-medium">
                            Relevant Match:
                          </div>
                          {highlight.metadata.context && (
                            <div className="text-tertiary mt-1">
                              {highlight.metadata.context}
                            </div>
                          )}
                          {highlight.metadata.keywords?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {highlight.metadata.keywords.map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 bg-primary/10 rounded-full text-primary"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <textarea
                        value={highlight.metadata.note || ''}
                        onChange={(e) => updateHighlightNote(highlight.id, e.target.value)}
                        placeholder="Add note..."
                        className="mt-2 w-full text-xs p-2 rounded border border-tertiary/20
                                 bg-background resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-tertiary text-center">
                  No highlights yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}