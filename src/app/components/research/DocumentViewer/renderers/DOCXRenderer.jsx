// src/app/components/research/DocumentViewer/renderers/DOCXRenderer.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import mammoth from 'mammoth';
import { useDocumentViewer } from '../context/DocumentViewerContext';
import { findTextPositions, HIGHLIGHT_COLORS } from '../utils/highlight';

export function DOCXRenderer({ url, pointers }) {
  const {
    currentPage,
    setTotalPages,
    setIsLoading,
    searchQuery,
    addHighlight,
    removeHighlight,
    scale
  } = useDocumentViewer();

  // State for DOCX content
  const [rawContent, setRawContent] = useState('');
  const [pages, setPages] = useState([]);
  const [pageElements, setPageElements] = useState({});
  const [isProcessing, setIsProcessing] = useState(true);

  // Load and convert DOCX
  const loadDocument = useCallback(async () => {
    try {
      setIsProcessing(true);
      
      // Fetch document
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();

      // Convert to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer }, {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh"
        ]
      });

      setRawContent(result.value);

      // Process content into pages
      const processedPages = paginateContent(result.value);
      setPages(processedPages);
      setTotalPages(processedPages.length);
      
      // Create virtual DOM for text position calculations
      const parser = new DOMParser();
      const pageElements = {};
      
      processedPages.forEach((page, index) => {
        const doc = parser.parseFromString(page, 'text/html');
        pageElements[index + 1] = Array.from(doc.body.children);
      });
      
      setPageElements(pageElements);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error loading DOCX:', error);
      setIsLoading(false);
    } finally {
      setIsProcessing(false);
    }
  }, [url, setTotalPages, setIsLoading]);

  // Initialize document loading
  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Process pointers and search highlights for current page
  useEffect(() => {
    if (!pageElements[currentPage] || isProcessing) return;

    // Clear existing highlights
    removeHighlight(`search-${currentPage}`);
    
    // Process pointers
    const pagePointers = pointers.filter(p => p.page_number === currentPage);
    pagePointers.forEach(pointer => {
      const positions = findTextPositionsInElements(
        pageElements[currentPage],
        pointer.section_start
      );

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
      const positions = findTextPositionsInElements(
        pageElements[currentPage],
        searchQuery
      );

      if (positions.length > 0) {
        addHighlight({
          id: `search-${currentPage}`,
          positions,
          type: 'search',
          text: searchQuery
        });
      }
    }
  }, [currentPage, pageElements, searchQuery, pointers, isProcessing, addHighlight, removeHighlight]);

  // Helper function to find text positions in HTML elements
  const findTextPositionsInElements = (elements, searchText) => {
    const positions = [];
    const searchLower = searchText.toLowerCase();

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const text = element.textContent.toLowerCase();
      
      if (text.includes(searchLower)) {
        positions.push({
          left: rect.left * scale,
          top: rect.top * scale,
          width: rect.width * scale,
          height: rect.height * scale,
          page: currentPage
        });
      }
    });

    return positions;
  };

  // Paginate content based on word count and natural breaks
  const paginateContent = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const elements = Array.from(tempDiv.children);
    const pages = [];
    let currentPage = [];
    let wordCount = 0;
    const WORDS_PER_PAGE = 500; // Adjust based on your needs

    elements.forEach((element) => {
      const elementWords = element.textContent.split(/\s+/).length;
      
      // Check for natural breaks (headings) or word count threshold
      const isHeading = /^h[1-6]$/i.test(element.tagName);
      
      if (isHeading || (wordCount + elementWords > WORDS_PER_PAGE && currentPage.length > 0)) {
        if (currentPage.length > 0) {
          pages.push(currentPage.map(el => el.outerHTML).join(''));
          currentPage = [];
          wordCount = 0;
        }
      }

      currentPage.push(element);
      wordCount += elementWords;
    });

    // Add remaining content
    if (currentPage.length > 0) {
      pages.push(currentPage.map(el => el.outerHTML).join(''));
    }

    return pages;
  };

  return (
    <div className="relative min-h-screen bg-background">
      {isProcessing ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Current page content */}
          <div
            className="prose max-w-none mx-auto p-8"
            dangerouslySetInnerHTML={{ __html: pages[currentPage - 1] || '' }}
          />

          {/* Highlight overlay */}
          <div 
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{ height: '100%' }}
          >
            {/* Highlights will be rendered here by HighlightLayer */}
          </div>
        </>
      )}
    </div>
  );
}

export default DOCXRenderer;