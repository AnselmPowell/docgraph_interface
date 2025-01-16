// src/app/hooks/usePdfTextSearch.js
'use client';

import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";

export const usePdfTextSearch = (file, searchString) => {
  const [pages, setPages] = useState([]);
  const [resultsList, setResultsList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load and store text content from all pages
  useEffect(() => {
    if (!file) return;
    
    console.log('[usePdfTextSearch] Loading PDF:', file);
    setIsSearching(true);

    pdfjs.getDocument(file).promise.then((pdf) => {
      console.log('[usePdfTextSearch] PDF loaded, pages:', pdf.numPages);
      
      const pagePromises = Array.from(
        { length: pdf.numPages },
        (_, pageNumber) => {
          return pdf.getPage(pageNumber + 1).then((page) => {
            return page.getTextContent().then((textContent) => {
              console.log(`[usePdfTextSearch] Processing page ${pageNumber + 1}`);
              return {
                pageNumber: pageNumber + 1,
                items: textContent.items.map((item, index) => ({
                  ...item,
                  itemIndex: index
                }))
              };
            });
          });
        }
      );

      Promise.all(pagePromises).then((pagesContent) => {
        console.log('[usePdfTextSearch] All pages loaded:', pagesContent.length);
        setPages(pagesContent);
        setIsSearching(false);
      });
    }).catch(error => {
      console.error('[usePdfTextSearch] Error loading PDF:', error);
      setIsSearching(false);
    });
  }, [file]);

  // Perform search when search string changes
  useEffect(() => {
    if (!searchString || !pages.length) {
      setResultsList([]);
      return;
    }

    console.log('[usePdfTextSearch] Searching for:', searchString);
    // console.log('[usePdfTextSearch] page item one:', pages[1].items[1]);
    const searchTerm = searchString.toLowerCase();
    const results = [];

    pages.forEach((page) => {
      page.items.forEach((item) => {
        if (item.str.toLowerCase().includes(searchTerm)) {
          results.push({
            pageNumber: page.pageNumber,
            itemIndex: item.itemIndex,
            text: item.str,
            str: item.str,
            transform: item.transform,
            width: item.width,
            height: item.height,
            startIndex: item.str.toLowerCase().indexOf(searchTerm),
            endIndex: item.str.toLowerCase().indexOf(searchTerm) + searchTerm.length
          });
        }
      });
    });

    console.log('[usePdfTextSearch] Search results:', results);
    setResultsList(results);
  }, [pages, searchString]);

  return { resultsList, isSearching, pages };
};