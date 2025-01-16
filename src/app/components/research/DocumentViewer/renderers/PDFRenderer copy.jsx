
// src/app/components/research/DocumentViewer/renderers/PDFRenderer.jsx
'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { AlertTriangle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useDocumentViewer } from '../context/DocumentViewerContext';
import { HighlightLayer } from '../components/HighlightLayer';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PDFRenderer({ url, pointers, activeSection}) {
  console.log('PDFRenderer: Initializing with url:', url);
  console.log('[PDFRender] pointers ', pointers);
  const { 
    currentPage,
    setCurrentPage,
    setTotalPages,
    scale_,
    activeSection_,
    setIsLoading 
  } = useDocumentViewer();

  console.log('useDoc  set');
  
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(scale_);
  const [pdfData, setPdfData] = useState(null);
  const [pageTextContent, setPageTextContent] = useState(null);

  const [activePointer, setActivePointer] = useState(null);

  // Add state to track text positions and matches
  const [textMatches, setTextMatches] = useState([]);
  const [hasScrolledToMatch, setHasScrolledToMatch] = useState(false);

  console.log('state set');

  useEffect(() => {
    console.log("run useeffect ")
    const fetchPDF = async () => {
      console.log(" inside fetch")
      if (!url) {
        setError('No URL provided');
        setLoading(false);
        return;
      }
  
        console.log('[PDFRenderer] Fetching document through proxy:', url);
        
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
        }
  
        const blob = await response.blob();
        console.log('[PDFRenderer] Document received:', blob.type, blob.size);
  
        // Convert to ArrayBuffer for react-pdf
        const arrayBuffer = await blob.arrayBuffer();
        setPdfData(arrayBuffer);
        setError(null);
  

        setLoading(false);
    };
  
    fetchPDF();
    console.log('fetchPDF/ effect set');
  
    // No need for cleanup since we're using ArrayBuffer
  }, [url]);

  console.log(" pass useeffect fetchPDF")

  useEffect(() => {
    if (pointers && pointers.length > 0) {
      const initialPointer = pointers[0];
      console.log('Setting initial pointer:', initialPointer);
      setActivePointer(initialPointer);
      
      // Navigate to the correct page
      setCurrentPage(initialPointer.page_number);
    }
  }, [pointers]);


  console.log(" pass useeffect pointers")

   // Handle document load success
    const handleDocumentLoadSuccess = ({ numPages }) => {
      setTotalPages(numPages);
      setIsLoading(false);
      
      // If we have an active section, navigate to its page
      if (activeSection?.page_number) {
        setCurrentPage(activeSection.page_number);
      }
    };



  //   const handlePageLoadSuccess = async (page) => {
  //     console.log("[handlePageLoadSuccess] Page loaded:", currentPage);
  //     console.log("[handlePageLoadSuccess] Active section:", activeSection);

  //     try {
  //         // Get text content from page
  //         const textContent = await page.getTextContent();
  //         console.log("[handlePageLoadSuccess] Text content loaded for page:", currentPage);

  //         // Only proceed if we have both text content and an active section
  //         if (!textContent || !activeSection || currentPage !== activeSection.page_number) {
  //             setPageTextContent(textContent);  // Still set content for other features
  //             return;
  //         }

  //         // Get the text to match - focusing on start of section
  //         let textToMatch = null;
  //         if (activeSection.text) {
  //           let initialText = activeSection.text.substring(0, 40);
  //           const nextSpace = activeSection.text.indexOf(' ', 40);
  //           if (nextSpace !== -1 && nextSpace < 50) {
  //               initialText = activeSection.text.substring(0, nextSpace);
  //           }
  //           textToMatch = initialText;
  //           console.log("[handlePageLoadSuccess] Initial text for matching:", initialText);
  //       }

  //         // Fallback to start_text if needed
  //         if (!textToMatch && activeSection.start_text) {
  //             textToMatch = activeSection.start_text;
  //         }

  //         console.log("[handlePageLoadSuccess] Searching for text:", textToMatch);

  //         if (textToMatch) {
  //             // Find matches before updating any state
  //             const fullText = activeSection.text
  //             const matches = findTextPosition(textContent, textToMatch, fullText );
  //             console.log("[handlePageLoadSuccess] Found matches:", matches);

  //             // Batch our state updates
  //             if (matches && matches.length > 0) {
  //                 // Update both states at once to avoid multiple re-renders
  //                 setPageTextContent(textContent);
  //                 setTextMatches(matches);

  //                 // Only scroll if we haven't already
  //                 if (!hasScrolledToMatch) {
  //                     requestAnimationFrame(() => {
  //                         scrollToMatch(matches[0]);
  //                         setHasScrolledToMatch(true);
  //                     });
  //                 }
  //             } else {
  //                 // Just update text content if no matches
  //                 setPageTextContent(textContent);
  //             }
  //         }
  //     } catch (error) {
  //         console.error("[handlePageLoadSuccess] Error processing page:", error);
  //     }
  // };


  //   const findTextPosition = (textContent, searchText, fullText) => {
  //     if (!textContent?.items || !searchText || !fullText) return [];
      
  //     console.log("[findTextPosition] Starting enhanced text search");
      
  //     // Helper function to normalize text for comparison
  //     const normalizeText = (text) => text
  //         .toLowerCase()
  //         .replace(/\s+/g, ' ')
  //         .trim();

  //     // Function to get context window around a position
  //     // This gives us 20 items before and 20 items after our current position
  //     const getContextWindow = (items, currentIndex) => {
  //         const windowStart = Math.max(0, currentIndex - 20);
  //         const windowEnd = Math.min(items.length, currentIndex + 21); // +21 to include current item
          
  //         // Get the previous 20 items
  //         const prevItems = items.slice(windowStart, currentIndex);
  //         // Get the current item
  //         const currentItem = items[currentIndex];
  //         // Get the next 20 items
  //         const nextItems = items.slice(currentIndex + 1, windowEnd);
          
  //         // Combine all items into one text string
  //         const contextText = [
  //             ...prevItems,
  //             currentItem,
  //             ...nextItems
  //         ].map(item => item.str).join(' ');

  //         return {
  //             text: contextText,
  //             items: [...prevItems, currentItem, ...nextItems],
  //             startIndex: windowStart,
  //             endIndex: windowEnd - 1
  //         };
  //     };

  //     // Normalize our search texts
  //     const normalizedStart = searchText;
  //     const normalizedEnd = fullText.slice(-40); // Last 40 chars as end marker
      
  //     let matches = [];
      
  //     // Search through the document with context windows
  //     for (let i = 0; i < textContent.items.length; i++) {
  //         // Get the context window for current position
  //         const context = getContextWindow(textContent.items, i);
  //         const normalizedContext = context.text;

  //         // If we find our start text in this context window
  //         if (normalizedContext.includes(normalizedStart)) {
  //             console.log("[findTextPosition] Found potential start in context:", {
  //                 index: i,
  //                 contextStart: context.startIndex,
  //                 contextEnd: context.endIndex
  //             });

  //             // Now look ahead for the end marker
  //             let sectionItems = [];
  //             let j = context.startIndex;
  //             let collectingSection = true;
              
  //             while (collectingSection && j < textContent.items.length) {
  //                 // Get new context window as we move forward
  //                 const forwardContext = getContextWindow(textContent.items, j);
  //                 sectionItems.push(textContent.items[j]);

  //                 // Check if we've found our end marker
  //                 if (forwardContext.text.includes(normalizedEnd)) {
  //                     collectingSection = false;
  //                     // Add the remaining items from this context
  //                     sectionItems.push(...textContent.items.slice(j + 1, forwardContext.endIndex));
  //                 }
  //                 j++;
  //             }

  //             // Calculate the bounds for our complete section
  //             const bounds = sectionItems.reduce((acc, item) => ({
  //                 left: Math.min(acc.left, item.transform[4]),
  //                 top: Math.min(acc.top, item.transform[5]),
  //                 right: Math.max(acc.right, item.transform[4] + item.width),
  //                 bottom: Math.max(acc.bottom, item.transform[5] + item.height)
  //             }), {
  //                 left: Infinity,
  //                 top: Infinity,
  //                 right: -Infinity,
  //                 bottom: -Infinity
  //             });

  //             const highlightPosition = {
  //                 left: bounds.left,
  //                 top: bounds.top,
  //                 width: bounds.right - bounds.left,
  //                 height: bounds.bottom - bounds.top,
  //                 text: sectionItems.map(item => item.str).join(' ')
  //             };

  //             matches.push(highlightPosition);
  //             break; // We found our section, no need to continue
  //         }
  //     }

  //     console.log("[findTextPosition] Final matches:", matches);
  //     return matches;
  // };

  const handlePageLoadSuccess = async (page) => {
    try {
      console.log("[handlePageLoadSuccess] Starting page processing");
      
      // Create viewport
      const viewport = page.getViewport({ scale });
  
      // Get text content - this is what's actually available in PDF.js
      const textContent = await page.getTextContent();
      console.log("[handlePageLoadSuccess] Text content retrieved:", textContent);
  
      if (!textContent?.items?.length) {
        console.log("[handlePageLoadSuccess] No text content found");
        return;
      }
  
      // Only proceed if we have an active section
      if (activeSection && currentPage === activeSection.page_number) {
        console.log("[handlePageLoadSuccess] Processing active section:", activeSection);
  
        // Get the text to match (use either text or start_text)
        const searchText = activeSection.text || activeSection.start_text;
        if (!searchText) {
          console.log("[handlePageLoadSuccess] No search text available");
          return;
        }
  
        // Build text blocks from items
        const textBlocks = buildTextBlocks(textContent.items, viewport);
        console.log("[handlePageLoadSuccess] Built text blocks:", textBlocks.length);
  
        // Find matching block
        const match = findMatchingBlock(textBlocks, searchText);
        if (match) {
          console.log("[handlePageLoadSuccess] Found matching block:", match);
          highlightMatch(match);
          scrollToMatch(match);
        }
      }
  
    } catch (error) {
      console.error("[handlePageLoadSuccess] Error:", error);
    }
  };
  
  // Helper to build text blocks from items
  const buildTextBlocks = (items, viewport) => {
    const blocks = [];
    let currentBlock = null;
  
    items.forEach((item) => {
      // Transform PDF coordinates to viewport coordinates
      const [x, y] = viewport.transform([item.transform[4], item.transform[5]]);
  
      if (!currentBlock) {
        currentBlock = {
          text: item.str,
          bounds: {
            x,
            y,
            width: item.width * viewport.scale,
            height: (item.height || 12) * viewport.scale // Default height if not provided
          },
          items: [item]
        };
      } else {
        // Check if item should be part of current block
        const lastItem = currentBlock.items[currentBlock.items.length - 1];
        const isSameLine = Math.abs(y - currentBlock.bounds.y) < 2;
        const isNearby = (x - (currentBlock.bounds.x + currentBlock.bounds.width)) < 20;
  
        if (isSameLine && isNearby) {
          // Add to current block
          currentBlock.text += ' ' + item.str;
          currentBlock.items.push(item);
          currentBlock.bounds.width = (x + item.width * viewport.scale) - currentBlock.bounds.x;
        } else {
          // Start new block
          blocks.push(currentBlock);
          currentBlock = {
            text: item.str,
            bounds: {
              x,
              y,
              width: item.width * viewport.scale,
              height: (item.height || 12) * viewport.scale
            },
            items: [item]
          };
        }
      }
    });
  
    // Add final block
    if (currentBlock) {
      blocks.push(currentBlock);
    }
  
    return blocks;
  };
  
  // Helper to find matching text block
  const findMatchingBlock = (blocks, searchText) => {
    const normalizedSearch = searchText.toLowerCase().trim();
    
    // First try exact matches
    let match = blocks.find(block => 
      block.text.toLowerCase().includes(normalizedSearch)
    );
  
    // If no exact match, try fuzzy matching
    if (!match) {
      match = blocks.reduce((best, current) => {
        const similarity = calculateSimilarity(
          current.text.toLowerCase(),
          normalizedSearch
        );
        if (similarity > 0.8 && (!best || similarity > best.similarity)) {
          return { ...current, similarity };
        }
        return best;
      }, null);
    }
  
    return match;
  };
  
  // Simple string similarity calculation
  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - editDistance(longer, shorter)) / longer.length;
  };

  // Create PDF.js annotation for highlighting
  const createHighlightAnnotation = (bounds, type) => {
    const colors = {
      context: [0.3, 0.6, 1], // Blue
      theme: [0.8, 0.3, 1],   // Purple
      keyword: [0.3, 1, 0.5]  // Green
    };

    return {
      type: 'highlight',
      rect: bounds,
      color: colors[type] || colors.context,
      opacity: 0.3,
      invisible: false
    };
  };
  
    // Scroll to matched text
  const scrollToMatch = (match) => {
    const element = document.querySelector('.document_view');
    if (element && match) {
      // Add small offset to ensure text is visible
      const scrollTop = (match.top * 1.0) - 100;
      
      element.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
      
      console.log("[scrollToMatch] Scrolled to position:", scrollTop);
    }
  };


  const LoadingDisplay = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
      <p className="text-primary">Loading document...</p>
    </div>
  );

  const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Failed to load PDF
      </h3>
      <p className="text-sm text-red-600 text-center">
        {message || 'An error occurred while loading the document'}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (loading || !pdfData) {
    return <LoadingDisplay />;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1.5 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm">
              Page {pageNumber} of {numPages || '?'}
            </span>
            <button
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
              disabled={pageNumber >= (numPages || pageNumber)}
              className="px-3 py-1.5 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
              className="p-1.5 bg-primary text-white rounded-lg flex items-center"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm min-w-[4rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
              className="p-1.5 bg-primary text-white rounded-lg flex items-center"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border rounded-lg overflow-auto bg-gray-50">
          <Document
            file={url}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<LoadingDisplay />}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              onLoadSuccess={handlePageLoadSuccess}
              loading={<div>Loading page...</div>}
              renderTextLayer={true}
              renderAnnotationLayer={false}
            >
              {pageTextContent && textMatches.length > 0 && (
                <HighlightLayer 
                  matches={textMatches}
                  scale={scale}
                  type={activeSection?.type}
                />
              )}
            </Page>
          </Document>
        </div>

      </div>
    </div>
  );
}

export default PDFRenderer;




