
// // src/app/components/research/DocumentViewer/renderers/PDFRenderer.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// import { AlertTriangle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
// import { useDocumentViewer } from '../context/DocumentViewerContext';
// import { HighlightLayer } from '../components/HighlightLayer';

// // Configure worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// export function PDFRenderer({ url, pointers, activeSection}) {
//   console.log('PDFRenderer: Initializing with url:', url);
//   console.log('[PDFRender] pointers ', pointers);
//   const { 
//     currentPage,
//     setCurrentPage,
//     setTotalPages,
//     scale_,
//     activeSection_,
//     setIsLoading 
//   } = useDocumentViewer();

//   console.log('useDoc  set');
  
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [scale, setScale] = useState(scale_);
//   const [pdfData, setPdfData] = useState(null);
//   const [pageTextContent, setPageTextContent] = useState(null);

//   const [activePointer, setActivePointer] = useState(null);

//   // Add state to track text positions and matches
//   const [textMatches, setTextMatches] = useState([]);
//   const [hasScrolledToMatch, setHasScrolledToMatch] = useState(false);

//   console.log('state set');

//   useEffect(() => {
//     console.log("run useeffect ")
//     const fetchPDF = async () => {
//       console.log(" inside fetch")
//       if (!url) {
//         setError('No URL provided');
//         setLoading(false);
//         return;
//       }
  
//         console.log('[PDFRenderer] Fetching document through proxy:', url);
        
//         const response = await fetch(url);
  
//         if (!response.ok) {
//           throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
//         }
  
//         const blob = await response.blob();
//         console.log('[PDFRenderer] Document received:', blob.type, blob.size);
  
//         // Convert to ArrayBuffer for react-pdf
//         const arrayBuffer = await blob.arrayBuffer();
//         setPdfData(arrayBuffer);
//         setError(null);
  

//         setLoading(false);
//     };
  
//     fetchPDF();
//     console.log('fetchPDF/ effect set');
  
//     // No need for cleanup since we're using ArrayBuffer
//   }, [url]);

//   console.log(" pass useeffect fetchPDF")

//   useEffect(() => {
//     if (pointers && pointers.length > 0) {
//       const initialPointer = pointers[0];
//       console.log('Setting initial pointer:', initialPointer);
//       setActivePointer(initialPointer);
      
//       // Navigate to the correct page
//       setCurrentPage(initialPointer.page_number);
//     }
//   }, [pointers]);


//    console.log(" pass useeffect pointers")

//    // Handle document load success
//     const handleDocumentLoadSuccess = ({ numPages }) => {
//       setTotalPages(numPages);
//       setIsLoading(false);
      
//       // If we have an active section, navigate to its page
//       if (activeSection?.page_number) {
//         setCurrentPage(activeSection.page_number);
//       }
//     };

//   // const handlePageLoadSuccess = async (page) => {
//   //   try {
//   //     console.log("[handlePageLoadSuccess] Starting page processing");
      
//   //     // Create viewport
//   //     const viewport = page.getViewport({ scale });
  
//   //     // Get text content - this is what's actually available in PDF.js
//   //     const textContent = await page.getTextContent();
//   //     console.log("[handlePageLoadSuccess] Text content retrieved:", textContent);
  
//   //     if (!textContent?.items?.length) {
//   //       console.log("[handlePageLoadSuccess] No text content found");
//   //       return;
//   //     }
  
//   //     // Only proceed if we have an active section
//   //     if (activeSection && currentPage === activeSection.page_number) {
//   //       console.log("[handlePageLoadSuccess] Processing active section:", activeSection);
  
//   //       // Get the text to match (use either text or start_text)
//   //       const searchText = activeSection.text || activeSection.start_text;
//   //       if (!searchText) {
//   //         console.log("[handlePageLoadSuccess] No search text available");
//   //         return;
//   //       }
  
//   //       // Build text blocks from items
//   //       const textBlocks = buildTextBlocks(textContent.items, viewport);
//   //       console.log("[handlePageLoadSuccess] Built text blocks:", textBlocks.length);
  
//   //       // Find matching block
//   //       const match = findMatchingBlock(textBlocks, searchText);
//   //       if (match) {
//   //         console.log("[handlePageLoadSuccess] Found matching block:", match);
//   //         highlightMatch(match);
//   //         scrollToMatch(match);
//   //       } else {
//   //         console.log("[handlePageLoadSuccess] No matching block found");
//   //       }
        
//   //     }
  
//   //   } catch (error) {
//   //     console.error("[handlePageLoadSuccess] Error:", error);
//   //   }
//   // };

//   const handlePageLoadSuccess = async (page) => {
//     try {
//       const container = document.querySelector('.document_view');
//       const containerWidth = container.clientWidth;
//       const containerHeight = container.clientHeight;

//       // Create initial viewport to get page dimensions
//       const initialViewport = page.getViewport({ scale: 1.0 });

//       // Calculate scale to fit width (with some padding)
//       const containerPadding = 40; // 20px padding on each side
//       const fitScale = (containerWidth - containerPadding) / initialViewport.width;

//       // Create final viewport with calculated scale
//       const viewport = page.getViewport({ 
//         scale: scale * fitScale  // Combine user zoom with fit scale
//       });
  
//       // Get text content
//       const textContent = await page.getTextContent();
//       console.log("[handlePageLoadSuccess] Viewport:", {
//         width: viewport.width,
//         height: viewport.height,
//         scale: viewport.scale,
//         containerSize: { width: containerWidth, height: containerHeight }
//       });
  
//       if (!textContent?.items?.length) {
//         console.log("[handlePageLoadSuccess] No text content found");
//         return;
//       }
  
//       // Only proceed if we have an active section
//       if (activeSection && currentPage === activeSection.page_number) {
//         console.log("[handlePageLoadSuccess] Processing active section:", activeSection);
//         const searchText = activeSection.text;
        
//         if (!searchText) {
//           console.log("[handlePageLoadSuccess] No search text available");
//           return;
//         }
  
//         // Build text blocks
//         const blocks = buildTextBlocks(textContent.items, viewport);
//         const match = findMatchingBlock(blocks, searchText);
//         console.log("[handlePageLoadSuccess] Found match:", match);
//         if (match) {
//           // Convert match to highlight coordinates
//           const highlights = createHighlightsFromMatch(match, textContent.items, viewport);
//           setTextMatches(highlights);
//           scrollToHighlight(highlights[0]);
//         }
//       }
//     } catch (error) {
//       console.error("[handlePageLoadSuccess] Error:", error);
//     }
//   };
  
  
//   const createHighlightsFromMatch = (match, textItems, viewport) => {
//     console.log("[createHighlightsFromMatch] Starting with match:", match.text);
//     console.log("[createHighlightsFromMatch] viewport:", viewport);
    
//     // First build accurate text mapping
//     const textMap = textItems.map(item => ({
//       text: item.str,
//       x: item.transform[4],
//       y: item.transform[5],
//       width: item.width,
//       height: item.height || (item.transform[0] || 12), // Use transform scale if height not available
//       endX: item.transform[4] + item.width,
//     }));
  
//     const normalizedSearch = match.text.toLowerCase().trim();
//     const startText = normalizedSearch.slice(0, 15);
//     const endText = normalizedSearch.slice(-15);
  
//     console.log("[createHighlightsFromMatch] Looking for:", { startText, endText });
    
//     // Find matching text items
//     let matchingItems = [];
//     let foundStart = false;
//     let textSoFar = '';
  
//     for (let i = 0; i < textMap.length; i++) {
//       const item = textMap[i];
//       textSoFar += item.text;
      
//       if (!foundStart && textSoFar.toLowerCase().includes(startText)) {
//         foundStart = true;
//         console.log("[createHighlightsFromMatch] Found start with item:", item);
//         matchingItems.push(item);
//       } else if (foundStart) {
//         matchingItems.push(item);
//         if (textSoFar.toLowerCase().includes(endText)) {
//           console.log("[createHighlightsFromMatch] Found end with item:", item);
//           break;
//         }
//       }
//     }
  
//     if (!matchingItems.length) {
//       console.log("[createHighlightsFromMatch] No matching items found");
//       return [];
//     }
  
//     console.log("[createHighlightsFromMatch] Found matching items:", matchingItems);
  
//     // Group items by line (items close in Y position)
//     const lineGroups = [];
//     let currentLine = [matchingItems[0]];
//     const LINE_THRESHOLD = matchingItems[0].height * 1.2; // Allow some overlap
  
//     for (let i = 1; i < matchingItems.length; i++) {
//       const currentItem = matchingItems[i];
//       const prevItem = matchingItems[i - 1];
      
//       if (Math.abs(currentItem.y - prevItem.y) < LINE_THRESHOLD) {
//         // Same line
//         currentLine.push(currentItem);
//       } else {
//         // New line
//         lineGroups.push([...currentLine]);
//         currentLine = [currentItem];
//       }
//     }
//     if (currentLine.length) lineGroups.push(currentLine);
  
//     console.log("[createHighlightsFromMatch] Line groups:", lineGroups);
  
//     // Create highlight bounds for each line
//     const highlights = lineGroups.map(line => {
//       // Sort items in line by X position
//       line.sort((a, b) => a.x - b.x);
      
//       const bound = {
//         left: line[0].x,
//         right: line[line.length - 1].endX,
//         top: Math.min(...line.map(item => item.y)),
//         bottom: Math.max(...line.map(item => item.y + item.height))
//       };
  
//       // Apply viewport scale
//       return {
//         left: bound.left * viewport.scale,
//         top: bound.top * viewport.scale,
//         width: (bound.right - bound.left) * viewport.scale,
//         height: (bound.bottom - bound.top) * viewport.scale
//       };
//     });
//     console.log("[createHighlightsFromMatch] bound:", bound);
//     console.log("[createHighlightsFromMatch] viewport:", viewport);
//     console.log("[createHighlightsFromMatch] viewport scale:", viewport.scale);
//     console.log("[createHighlightsFromMatch] Created highlights:", highlights);
//     return highlights;
//   };

//   const buildTextBlocks = (items, viewport) => {
//     const validItems = items.filter(item => item.str.trim().length > 0);
//     const blocks = [];
//     const CONTEXT_WINDOW = 60;
//     let currentIndex = 0;
  
//     // Helper to get item position in viewport coordinates
//     const getItemPosition = (item) => {
//       // PDF coordinates start from bottom-left, we need to adjust to top-left
//       const [scaleX, , , scaleY, itemX, itemY] = item.transform;
      
//       return {
//         x: itemX,
//         y: viewport.height - itemY, // Convert to top-left coordinate system
//         width: item.width,
//         height: item.height || scaleY,
//         endX: itemX + item.width
//       };
//     };
  
//     while (currentIndex < validItems.length) {
//       const windowEnd = Math.min(currentIndex + CONTEXT_WINDOW, validItems.length);
//       let contextItems = validItems.slice(currentIndex, windowEnd);
      
//       // Get positions for all items in window
//       const itemPositions = contextItems.map(getItemPosition);
      
//       // Find bounds of this block
//       const blockBounds = {
//         x: Math.min(...itemPositions.map(p => p.x)),
//         y: Math.min(...itemPositions.map(p => p.y)),
//         right: Math.max(...itemPositions.map(p => p.endX)),
//         bottom: Math.max(...itemPositions.map(p => p.y + p.height))
//       };
      
//       // Build text with proper spacing
//       let blockText = [];
//       let lastPos = null;
  
//       contextItems.forEach((item, idx) => {
//         const pos = itemPositions[idx];
        
//         if (lastPos) {
//           // Check for new line
//           const verticalGap = Math.abs(pos.y - lastPos.y);
//           const horizontalGap = pos.x - lastPos.endX;
          
//           if (verticalGap > Math.min(pos.height, lastPos.height) * 0.5) {
//             blockText.push('\n');
//           } else if (horizontalGap > pos.width * 0.3) {
//             blockText.push(' ');
//           }
//         }
  
//         blockText.push(item.str.trim());
//         lastPos = pos;
//       });
  
//       blocks.push({
//         text: blockText.join(''),
//         bounds: {
//           x: blockBounds.x,
//           y: blockBounds.y,
//           width: blockBounds.right - blockBounds.x,
//           height: blockBounds.bottom - blockBounds.y
//         },
//         items: contextItems,
//         positions: itemPositions,
//         pageIndex: currentIndex / CONTEXT_WINDOW | 0
//       });
  
//       currentIndex += Math.max(1, CONTEXT_WINDOW / 2);
//     }
  
//     console.log("[buildTextBlocks] Created blocks:", blocks.map(b => ({
//       text: b.text.substring(0, 50) + "...",
//       bounds: b.bounds,
//       itemCount: b.items.length
//     })));
  
//     return blocks;
//   };


//   const findMatchingBlock = (blocks, searchText) => {
//     if (!searchText || !blocks.length) {
//       console.log("[findMatchingBlock] Invalid input:", { searchText, blocksLength: blocks?.length });
//       return null;
//     }
  
//     const normalizedSearch = searchText.toLowerCase().trim();
//     const startText = normalizedSearch.slice(0, 25);
//     const endText = normalizedSearch.slice(-25);
    
//     console.log("[findMatchingBlock] Search parameters:", {
//       startText,
//       endText,
//       totalBlocks: blocks.length
//     });
  
//     // Find blocks containing start and end
//     let startBlock = null;
//     let endBlock = null;
//     let startIndex = -1;
//     let endIndex = -1;
  
//     blocks.forEach((block, index) => {
//       const blockText = block.text.toLowerCase();
      
//       // Look for start text
//       if (blockText.includes(startText)) {
//         startBlock = block;
//         startIndex = index;
//         console.log("[findMatchingBlock] Found start in block:", index);
//       }
      
//       // Look for end text
//       if (blockText.includes(endText)) {
//         endBlock = block;
//         endIndex = index;
//         console.log("[findMatchingBlock] Found end in block:", index);
//       }
//     });
  
//     // If we found both start and end
//     if (startBlock && endBlock) {
//       console.log("[findMatchingBlock] Found match spanning blocks:", startIndex, "to", endIndex);
  
//       // If start and end are in the same block
//       if (startIndex === endIndex) {
//         return {
//           ...startBlock,
//           matchType: 'single',
//           matchIndex: startIndex
//         };
//       }
  
//       // If start and end are in adjacent or nearby blocks
//       if (endIndex - startIndex <= 1) {
//         // Combine the blocks
//         const combinedText = blocks.slice(startIndex, endIndex + 1)
//           .map(block => block.text)
//           .join(' ');
  
//         return {
//           ...startBlock,
//           text: combinedText,
//           matchType: 'combined',
//           matchIndex: startIndex,
//           matchSpan: endIndex - startIndex + 1
//         };
//       }
//     }
  
//     console.log("[findMatchingBlock] No match found");
//     return null;
//   }; 
  
  
//     // Scroll to matched text
//     const scrollToHighlight = (highlight) => {
//       if (!highlight) return;
    
//       console.log("[scrollToHighlight] Scrolling to highlight:", highlight);
    
//       // Get the PDF container element
//       const container = document.querySelector('.document_view');
//       if (!container) {
//         console.log("[scrollToHighlight] Container not found");
//         return;
//       }
    
//       // Calculate scroll position
//       // Subtract offset to position highlight in viewport center
//       const scrollPosition = {
//         top: Math.max(0, highlight.top - (container.clientHeight / 3)),
//         behavior: 'smooth'
//       };
    
//       console.log("[scrollToHighlight] Scrolling to position:", scrollPosition);
    
//       // Scroll container
//       container.scrollTo({
//         top: scrollPosition.top,
//         behavior: 'smooth'
//       });
    
//       // Add visual feedback for highlight location (optional)
//       const pulseHighlight = document.createElement('div');
//       pulseHighlight.style.cssText = `
//         position: absolute;
//         left: ${highlight.left}px;
//         top: ${highlight.top}px;
//         width: ${highlight.width}px;
//         height: ${highlight.height}px;
//         background-color: rgba(255, 255, 0, 0.5);
//         animation: pulse 1s ease-in-out;
//         pointer-events: none;
//       `;
    
//       container.appendChild(pulseHighlight);
//       setTimeout(() => pulseHighlight.remove(), 1000);
//     };


//   const LoadingDisplay = () => (
//     <div className="flex flex-col items-center justify-center p-8">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
//       <p className="text-primary">Loading document...</p>
//     </div>
//   );

//   const ErrorDisplay = ({ message }) => (
//     <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
//       <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
//       <h3 className="text-lg font-medium text-red-800 mb-2">
//         Failed to load PDF
//       </h3>
//       <p className="text-sm text-red-600 text-center">
//         {message || 'An error occurred while loading the document'}
//       </p>
//       <button 
//         onClick={() => window.location.reload()}
//         className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//       >
//         Try Again
//       </button>
//     </div>
//   );

//   if (error) {
//     return <ErrorDisplay message={error} />;
//   }

//   if (loading || !pdfData) {
//     return <LoadingDisplay />;
//   }

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
//               disabled={pageNumber <= 1}
//               className="px-3 py-1.5 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Previous
//             </button>
//             <span className="text-sm">
//               Page {pageNumber} of {numPages || '?'}
//             </span>
//             <button
//               onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
//               disabled={pageNumber >= (numPages || pageNumber)}
//               className="px-3 py-1.5 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
//             >
//               Next
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
//               className="p-1.5 bg-primary text-white rounded-lg flex items-center"
//               title="Zoom out"
//             >
//               <ZoomOut className="w-4 h-4" />
//             </button>
//             <span className="text-sm min-w-[4rem] text-center">
//               {Math.round(scale * 100)}%
//             </span>
//             <button
//               onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
//               className="p-1.5 bg-primary text-white rounded-lg flex items-center"
//               title="Zoom in"
//             >
//               <ZoomIn className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         <div className="border rounded-lg overflow-auto bg-gray-50">
//           <Document
//             file={url}
//             onLoadSuccess={handleDocumentLoadSuccess}
//             loading={<LoadingDisplay />}
//           >
//             <Page
//               pageNumber={currentPage}
//               scale={scale}
//               onLoadSuccess={handlePageLoadSuccess}
//               loading={<div>Loading page...</div>}
//               renderTextLayer={true}
//               renderAnnotationLayer={false}
//             >
//               {pageTextContent && textMatches.length > 0 && (
//                 <HighlightLayer 
//                   matches={textMatches}
//                   scale={scale}
//                   type={activeSection?.type}
//                 />
//               )}
//             </Page>
//           </Document>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default PDFRenderer;





// src/app/components/research/DocumentViewer/renderers/PDFRenderer.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeObserver } from '../../../../hooks/useResizeObserver';
import { Loader2 } from 'lucide-react';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFRenderer({
  url,
  pointers = [],
  activeSection = null,
  onPageChange,
  onError
}) {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const { width = 1, height = 1 } = useResizeObserver(containerRef);

  // Handle document load success
  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    if (activeSection?.page_number) {
      setPageNumber(activeSection.page_number);
    }
  };

  // Handle page render success
  const handlePageRenderSuccess = useCallback((page) => {
    const canvas = page.canvas;
    const ctx = canvas.getContext('2d');

    // Clear any existing highlights
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply highlights for current page
    highlights.forEach((highlight) => {
      if (highlight.pageNumber === pageNumber) {
        ctx.fillStyle = highlight.color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(
          highlight.position.x,
          highlight.position.y,
          highlight.position.width,
          highlight.position.height
        );
      }
    });
  }, [highlights, pageNumber]);

  // Update scale based on container size
  useEffect(() => {
    if (width && height) {
      const newScale = Math.min(
        width / 800, // Standard page width
        height / 1100 // Standard page height
      );
      setScale(newScale);
    }
  }, [width, height]);

  // Process pointers for highlighting
  useEffect(() => {
    if (!pointers || !activeSection) return;

    const newHighlights = pointers.map(pointer => ({
      pageNumber: pointer.page_number,
      position: {
        x: 0, // Calculate from pointer data
        y: 0,
        width: width * 0.8,
        height: 50
      },
      color: getHighlightColor(pointer.relevance_type[0])
    }));

    setHighlights(newHighlights);
  }, [pointers, activeSection, width]);

  // Helper function to get highlight color
  const getHighlightColor = (type) => {
    const colors = {
      context: '#3B82F6', // blue
      theme: '#8B5CF6', // purple
      keyword: '#10B981', // green
      similar: '#F59E0B' // amber
    };
    return colors[type] || '#9CA3AF';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-auto bg-tertiary/5"
    >
      <Document
        file={url}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={(error) => onError?.(error)}
        loading={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          rotate={rotation}
          onRenderSuccess={handlePageRenderSuccess}
          className="shadow-xl"
          renderAnnotationLayer={false}
          renderTextLayer={true}
        />

        {/* Navigation Controls */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-tertiary/10">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            className="p-2 rounded-lg hover:bg-tertiary/10 disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-tertiary">
            Page {pageNumber} of {numPages}
          </span>
          
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            className="p-2 rounded-lg hover:bg-tertiary/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </Document>
    </div>
  );
}
