// src/app/components/research/DocumentViewer/components/PageNavigation.client.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDocumentViewer } from '../context/DocumentViewerContext';

export function PageNavigation() {
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage 
  } = useDocumentViewer();

  const [inputPage, setInputPage] = useState(currentPage.toString());

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageInput = (e) => {
    const value = e.target.value;
    setInputPage(value);

    const pageNumber = parseInt(value, 10);
    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(inputPage, 10);
      if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      } else {
        setInputPage(currentPage.toString());
      }
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 bg-background/95 backdrop-blur-sm 
                   rounded-lg border border-tertiary/10 p-1 shadow-lg"
      >
        {/* Previous Page */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage <= 1}
          className={`
            p-2 rounded-lg transition-colors
            ${currentPage <= 1 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-tertiary/10'
            }
          `}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-tertiary" />
        </button>

        {/* Page Input */}
        <div className="flex items-center space-x-2 px-2">
          <input
            type="text"
            value={inputPage}
            onChange={handlePageInput}
            onKeyPress={handleKeyPress}
            className="w-12 text-center p-1 rounded border border-tertiary/20 
                     bg-background text-primary text-sm"
            aria-label="Page number"
          />
          <span className="text-sm text-tertiary">
            of {totalPages}
          </span>
        </div>

        {/* Next Page */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className={`
            p-2 rounded-lg transition-colors
            ${currentPage >= totalPages 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-tertiary/10'
            }
          `}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-tertiary" />
        </button>
      </motion.div>
    </div>
  );
}