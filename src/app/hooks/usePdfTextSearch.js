// // src/app/hooks/usePdfTextSearch.js
// 'use client';

// import { useState, useEffect } from "react";
// import { pdfjs } from "react-pdf";

// export const usePdfTextSearch = (file, searchString) => {
//   const [pages, setPages] = useState([]);
//   const [resultsList, setResultsList] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);

//   // Load and store text content from all pages
//   useEffect(() => {
//     if (!file) return;
    
//     console.log('[usePdfTextSearch] Loading PDF:', file);
//     setIsSearching(true);

//     pdfjs.getDocument(file).promise.then((pdf) => {
//       console.log('[usePdfTextSearch] PDF loaded, pages:', pdf.numPages);
      
//       const pagePromises = Array.from(
//         { length: pdf.numPages },
//         (_, pageNumber) => {
//           return pdf.getPage(pageNumber + 1).then((page) => {
//             return page.getTextContent().then((textContent) => {
//               // console.log(`[usePdfTextSearch] Processing page ${pageNumber + 1}`);
//               return {
//                 pageNumber: pageNumber + 1,
//                 items: textContent.items.map((item, index) => ({
//                   ...item,
//                   itemIndex: index
//                 }))
//               };
//             });
//           });
//         }
//       );

//       Promise.all(pagePromises).then((pagesContent) => {
//         console.log('[usePdfTextSearch] All pages loaded:', pagesContent.length);
//         setPages(pagesContent);
//         setIsSearching(false);
//       });
//     }).catch(error => {
//       console.error('[usePdfTextSearch] Error loading PDF:', error);
//       setIsSearching(false);
//     });
//   }, [file]);

//   // Perform search when search string changes
//   useEffect(() => {
//     if (!searchString || !pages.length) {
//       setResultsList([]);
//       return;
//     }

//     console.log('[usePdfTextSearch] Searching for:', searchString);
//     // console.log('[usePdfTextSearch] page item one:', pages[1].items[1]);
//     const searchTerm = searchString.toLowerCase();
//     const results = [];

//     // pages.forEach((page) => {
//     //   page.items.forEach((item) => {
//     //     if (item.str.toLowerCase().includes(searchTerm)) {
//     //       results.push({
//     //         pageNumber: page.pageNumber,
//     //         itemIndex: item.itemIndex,
//     //         text: item.str,
//     //         str: item.str,
//     //         transform: item.transform,
//     //         width: item.width,
//     //         height: item.height,
//     //         startIndex: item.str.toLowerCase().indexOf(searchTerm),
//     //         endIndex: item.str.toLowerCase().indexOf(searchTerm) + searchTerm.length
//     //       });
//     //     }
//     //   });
//     // });


//     // pages.forEach((page) => {
//     //   const pageItems = page.items;
      
//     //   pageItems.forEach((item, index) => {
//     //     // Get previous, current and next items
//     //     const prevItem = index > 0 ? pageItems[index - 1] : null;
//     //     const currentItem = item;
//     //     const nextItem = index < pageItems.length - 1 ? pageItems[index + 1] : null;
        
//     //     // Combine text from adjacent items
//     //     const combinedText = [
//     //       prevItem?.str || '',
//     //       currentItem.str,
//     //       nextItem?.str || ''
//     //     ].join(' ').trim();
    
//     //     if (combinedText.toLowerCase().includes(searchTerm)) {
//     //       results.push({
//     //         pageNumber: page.pageNumber,
//     //         itemIndex: item.itemIndex,
//     //         text: searchTerm,
//     //         originalText: item.str,
//     //         prevText: prevItem?.str || null,
//     //         nextText: nextItem?.str || null,
//     //         str: searchTerm,
//     //         transform: item.transform,
//     //         width: item.width,
//     //         height: item.height,
//     //         startIndex: combinedText.toLowerCase().indexOf(searchTerm),
//     //         endIndex: combinedText.toLowerCase().indexOf(searchTerm) + searchTerm.length
//     //       });
//     //     }
//     //   });
//     // });

//     pages.forEach((page) => {
//       page.items.forEach((item) => {
//         if (item.str.toLowerCase().includes(searchTerm)) {
//           results.push({
//             pageNumber: page.pageNumber,
//             itemIndex: item.itemIndex,
//             text: item.str,
//             str: item.str,
//             transform: item.transform,
//             width: item.width,
//             height: item.height,
//             startIndex: item.str.toLowerCase().indexOf(searchTerm),
//             endIndex: item.str.toLowerCase().indexOf(searchTerm) + searchTerm.length
//           });
//         }
//       });
//     });

//     // pages.forEach((page) => {
//     //   const pageItems = page.items;
//     //   const processedIndices = new Set();
      
//     //   pageItems.forEach((item, index) => {
//     //     // Skip if this item was part of a previous match
//     //     // if (processedIndices.has(index)) return;
    
//     //     const prevItem = index > 0 ? pageItems[index - 1] : null;
//     //     const currentItem = item;
//     //     const nextItem = index < pageItems.length - 1 ? pageItems[index + 1] : null;
        
//     //     const combinedText = [
//     //       prevItem?.str || '',
//     //       currentItem.str,
//     //       nextItem?.str || ''
//     //     ].join(' ').trim();
    
//     //     if (combinedText.toLowerCase().includes(searchTerm)) {
//     //       // Mark items as processed
//     //       if (prevItem && prevItem.str.toLowerCase().includes(searchTerm)) {
//     //         // processedIndices.add(index - 1);
//     //       }
//     //       if (nextItem && nextItem.str.toLowerCase().includes(searchTerm)) {
//     //         // processedIndices.add(index + 1);
//     //       }
//     //       processedIndices.add(index);
    
//     //       results.push({
//     //         pageNumber: page.pageNumber,
//     //         itemIndex: item.itemIndex,
//     //         text: searchTerm,
//     //         prevText: prevItem?.str || null,
//     //         nextText: nextItem?.str || null,
//     //         transform: item.transform,
//     //         str: item.str,
//     //         width: item.width,
//     //         height: item.height,
//     //         startIndex: item.str.toLowerCase().indexOf(searchTerm),
//     //         endIndex: item.str.toLowerCase().indexOf(searchTerm) + searchTerm.length 
//     //       });
//     //     }
//     //   });
//     // });

//     console.log('[usePdfTextSearch] Search results:', results);
//     setResultsList(results);
//   }, [pages, searchString]);

//   return { resultsList, isSearching, pages };
// };


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

    // pages.forEach((page) => {
    //   page.items.forEach((item) => {
    //     if (item.str.toLowerCase().includes(searchTerm)) {
    //       results.push({
    //         pageNumber: page.pageNumber,
    //         itemIndex: item.itemIndex,
    //         text: item.str,
    //         str: item.str,
    //         transform: item.transform,
    //         width: item.width,
    //         height: item.height,
    //         startIndex: item.str.toLowerCase().indexOf(searchTerm),
    //         endIndex: item.str.toLowerCase().indexOf(searchTerm) + searchTerm.length
    //       });
    //     }
    //   });
    // });


    // pages.forEach((page) => {
    //   const pageItems = page.items;
      
    //   pageItems.forEach((item, index) => {
    //     // Get previous, current and next items
    //     const prevItem = index > 0 ? pageItems[index - 1] : null;
    //     const currentItem = item;
    //     const nextItem = index < pageItems.length - 1 ? pageItems[index + 1] : null;
        
    //     // Combine text from adjacent items
    //     const combinedText = [
    //       prevItem?.str || '',
    //       currentItem.str,
    //       nextItem?.str || ''
    //     ].join(' ').trim();
    
    //     if (combinedText.toLowerCase().includes(searchTerm)) {
    //       results.push({
    //         pageNumber: page.pageNumber,
    //         itemIndex: item.itemIndex,
    //         text: searchTerm,
    //         originalText: item.str,
    //         prevText: prevItem?.str || null,
    //         nextText: nextItem?.str || null,
    //         str: searchTerm,
    //         transform: item.transform,
    //         width: item.width,
    //         height: item.height,
    //         startIndex: combinedText.toLowerCase().indexOf(searchTerm),
    //         endIndex: combinedText.toLowerCase().indexOf(searchTerm) + searchTerm.length
    //       });
    //     }
    //   });
    // });

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

    // pages.forEach((page) => {
    //   const pageItems = page.items;
    //   const processedIndices = new Set();
      
    //   pageItems.forEach((item, index) => {
    //     // Skip if this item was part of a previous match
    //     // if (processedIndices.has(index)) return;
    
    //     const prevItem = index > 0 ? pageItems[index - 1] : null;
    //     const currentItem = item;
    //     const nextItem = index < pageItems.length - 1 ? pageItems[index + 1] : null;
        
    //     const combinedText = [
    //       prevItem?.str || '',
    //       currentItem.str,
    //       nextItem?.str || ''
    //     ].join(' ').trim();
    
    //     if (combinedText.toLowerCase().includes(searchTerm)) {
    //       // Mark items as processed
    //       if (prevItem && prevItem.str.toLowerCase().includes(searchTerm)) {
    //         // processedIndices.add(index - 1);
    //       }
    //       if (nextItem && nextItem.str.toLowerCase().includes(searchTerm)) {
    //         // processedIndices.add(index + 1);
    //       }
    //       processedIndices.add(index);
    
    //       results.push({
    //         pageNumber: page.pageNumber,
    //         itemIndex: item.itemIndex,
    //         text: searchTerm,
    //         prevText: prevItem?.str || null,
    //         nextText: nextItem?.str || null,
    //         transform: item.transform,
    //         str: item.str,
    //         width: item.width,
    //         height: item.height,
    //         startIndex: item.str.toLowerCase().indexOf(searchTerm),
    //         endIndex: item.str.toLowerCase().indexOf(searchTerm) + searchTerm.length 
    //       });
    //     }
    //   });
    // });

    console.log('[usePdfTextSearch] Search results:', results);
    setResultsList(results);
  }, [pages, searchString]);

  return { resultsList, isSearching, pages };
};