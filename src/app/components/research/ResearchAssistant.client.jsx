/******************************************************************************
 * RESEARCH ASSISTANT - MAIN CONTAINER COMPONENT
 * // src/app/components/research/ResearchAssistant.client.jsx
 * TEAM GUIDELINES:
 * This file follows a strict organizational structure to maintain scalability
 * and readability. When modifying this component:
 * 1. Group imports by type (React, Components, Services)
 * 2. Add new states to appropriate state management sections
 * 3. Keep related functionality together (document handling, search, etc.)
 * 4. Document data flow with clear comments above each function
 * 5. Use spacing between sections for readability
 * 6. Follow existing error handling patterns
 * 7. Maintain state grouping structure
 * New features should be added to their relevant section with proper documentation
 * and flow comments. If creating a new section, follow the existing format with
 * clear headers and separation.
 *****************************************************************************/


// src/app/components/research/ResearchAssistant.client.jsx
'use client';

/******************************************************************************
 * IMPORTS
 *****************************************************************************/

// React Core
import { useState, useCallback, useEffect } from 'react';

// Layout Components
import { ResearchLayout } from './layout/ResearchLayout.client';
import { FloatingActionButton } from './core/FloatingActionButton.client';

// Document Management Components
import { DocumentSidebar } from './DocumentManagement/DocumentSidebar.client';
import { DocumentViewer } from './DocumentViewer/DocumentViewer.client';
import { UploadModal } from './Upload/UploadModal.client';

// Search Components
import { SearchBar } from './Search/SearchBar.client';
import { ResultsContainer } from './Results/ResultsContainer.client';
import { NoResults } from './Results/NoResults.client';

// UI Components
import { toast } from '../ui/Toast.client';

// Services & Utilities
import { getCache, setCache, clearCache } from '../../services/caches';
import { storageManager } from '../../services/storageManager';

import { useDocumentCache } from '../../hooks/useDocumentCache';
import { useSearchCache } from '../../hooks/useSearchCache';
import { useUICache } from '../../hooks/useUICache';

/******************************************************************************
 * TYPE DEFINITIONS
 *****************************************************************************/

/**
 * @typedef {Object} Document
 * @property {string} id - Document identifier
 * @property {string} name - Document name
 * @property {string} url - Document URL
 * @property {string} processing_status - Current processing status
 */

/******************************************************************************
 * COMPONENT: ResearchAssistant
 * 
 * Main container component for the research assistant application.
 * Manages document upload, processing, viewing, and searching functionality.
 * 
 * Data Flow:
 * 1. User uploads documents → Staged → Processed → Available for search
 * 2. Documents can be selected for searching
 * 3. Search results show relevant sections across documents
 *****************************************************************************/

export function ResearchAssistant() {

  /**************************************************************************
   * STATE MANAGEMENT
   **************************************************************************/

  // UI States
  // Controls visibility and processing states for UI elements
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  
  // Document Management States
  // Handles different states of documents in the system
  const [documents, setDocuments] = useState([]); // Processed documents
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Selected for search
  const [activeDocument, setActiveDocument] = useState(null); // Currently viewed
  const [stagedDocuments, setStagedDocuments] = useState([]); // Pending upload
  
  // Search & Results States
  // Manages search functionality and results
  const [searchResults, setSearchResults] = useState(null);
  const [storedDocuments, setStoredDocuments] = useState(new Map());

  // Cache 
  // Cache System  Hooks 
  const { cacheDocument, getCachedDocument,cacheStagedDocuments, getCachedStaged, removeCachedStaged } = useDocumentCache();
  const { cacheSearchParams, cacheSearchResults } = useSearchCache();
  const { cacheUIPreferences } = useUICache();

  /**************************************************************************
   * EFFECTS
   **************************************************************************/

  // Initial Load Effect
  // Clears expired documents and fetches existing ones
  useEffect(() => {
    storageManager.clearExpiredCachedDocuments();
    fetchDocuments();
  }, []);

   // Initial Cache Effect
   useEffect(() => {
     const initializeFromCache = async () => {
      // Restore staged documents
      const staged = await getCachedStaged();
        if (staged) {
          console.log('cache manager: 5', staged )
          setStagedDocuments(staged);
      }
    };

    initializeFromCache();
  }, [getCachedDocument, getCachedStaged]);

  // Search Parameters Cache Effect
  // Restores previous search parameters from cache
  useEffect(() => {
    const cachedSearchParams = getCache('searchParams');
    if (cachedSearchParams) {
      setContext(cachedSearchParams.context || '');
      setTheme(cachedSearchParams.theme || null);
      setKeywords(cachedSearchParams.keywords || []);
    }
  }, []);

  // restore cached documents 
  // useEffect(() => {
  //     const restoreState = async () => {
  //       const staged = await getCachedStaged();
  //       if (staged) {
  //         console.log('cache manager: 5', staged )
  //         setStagedDocuments(staged);
  //       }
  //     };
  
  //     restoreState();
  //   }, [getCachedStaged]);

/**************************************************************************
   * DOCUMENT MANAGEMENT
   * Core functionality for handling document operations
   **************************************************************************/

  /**
   * Fetches processed documents from backend
   * Data Flow: API → documents state → DocumentSidebar
   */
  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/research/documents/upload');
      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }
  
      setDocuments(data.documents);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents');
    }
  };

  /**************************************************************************
   * PINATA STORAGE INTEGRATION
   * Handles document storage in IPFS via Pinata
   **************************************************************************/

  /**
   * Stores document in Pinata IPFS
   * Flow: File → Pinata → URL Cache → Storage
   */
  const storeToPinata = async (file) => {
    console.log('[ResearchAssistant] Uploading to Pinata:', file.name);
    
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch('/api/research/documents/file', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.error);
    }

    const storedDocument = data.documents[0];


    
    return storedDocument;
  };

  /**************************************************************************
   * DOCUMENT STAGING & UPLOAD HANDLERS
   * Manages document upload workflow
   **************************************************************************/

  /**
   * Handles initial document staging before upload
   * Flow: Files → Staging Area → Upload Queue
   */
  // const handleStagedUpload = useCallback((files) => {
  //   console.log('Staging documents:', files);
  //   setStagedDocuments(prev => [...prev, ...files]);
  //   toast.success(`${files.length} document${files.length !== 1 ? 's' : ''} staged`);
  // }, []);

  const handleStagedUpload = useCallback(async (files) => {
    console.log('Staging documents:', files);

    const storedDocuments = [];
    for (const file of files) {
        const storedDocument = await storeToPinata(file);
        storedDocuments.push(storedDocument);
    }

    console.log('All documents staged:', storedDocuments);
    setStagedDocuments(prev => {
      const newDocs = [...prev, ...storedDocuments];
      // Add cache update
      console.log('cache manager: 0-', {newDocs} )
      cacheStagedDocuments(newDocs);
      return newDocs;
    });
    toast.success(`${files.length} document${files.length !== 1 ? 's' : ''} staged`);
  }, [cacheStagedDocuments]);

  /**
   * Removes document from staging area
   * Flow: Staging Area → Remove → Update UI
   */
  const handleRemoveStaged = useCallback((fileToRemove) => {
    setStagedDocuments(prev => 
      prev.filter(file => file !== fileToRemove)
    );
    toast.success('Document removed from staging');
  }, []);

  /**
   * Removes document from stored documents
   * Flow: Storage → Remove → Update UI
   */
  const handleRemoveUpload = useCallback( async(documentName) => {
    
    setStoredDocuments(prev => {
      const newMap = new Map(prev);
      newMap.delete(documentName);
      return newMap;
    });
    // setStagedDocuments(prev => { prev.filter(file => file.file_name !== documentName) });
    setStagedDocuments(prev => prev.filter(doc => doc.file_name !== documentName));
    await removeCachedStaged(documentName);
    
    toast.success('Document removed from staging');
  }, []);

  /**
   * Process all staged documents for upload
   * Flow: Staging → Processing → Upload → Storage
   */
  const handleUploadStaged = useCallback(async () => {
    if (stagedDocuments.length === 0) return;

    try {
      setIsProcessing(true);
      const formData = new FormData();
      stagedDocuments.forEach(file => {
        formData.append('files', file);
      });

      console.log('Uploading staged documents:', stagedDocuments);

      const response = await fetch('/api/research/documents/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }
      
      setDocuments(prev => [...prev, ...data.documents]);
      setStagedDocuments([]); // Clear staged documents
      toast.success('Documents uploaded successfully');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload documents');
    } finally {
      setIsProcessing(false);
    }
  }, [stagedDocuments]);

  /**
   * Handles document upload from modal
   * Flow: Modal → Upload → Process → Storage
   */
  const handleUpload = useCallback(async (formData) => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/research/documents/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }
      
      setDocuments(prev => [...prev, ...data.documents]);
      setIsUploadModalOpen(false);
      toast.success(data.message);

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload documents');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Handles document deletion
   * Flow: Delete Request → Pinata → Storage → UI Update
   */
  const handleDeleteDocument = async (documentName) => {
    const uploadedDocument = storedDocuments.get(documentName);
    // let fileId;

    // if (storedDocuments.size > 0) {
    //   fileId = uploadedDocument.file_id;
    // } else {
    //   fileId = document.file_id;
    // }

    // console.log('[handleDeleteDocument] Deleting file with CID:', cid);
    
    // if (cid) {
    //   const response = await fetch('/api/research/documents/file', {
    //     method: 'DELETE',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ cid })
    //   });

    //   if (!response.ok) {
    //     const error = await response.json();
    //     throw new Error(error.error || 'Failed to unpin file from Pinata');
    //   }
    // }
    

    handleRemoveUpload(uploadedDocument);
 
    toast.success('Document deleted successfully');
  };

 /**************************************************************************
   * DOCUMENT SELECTION & VIEWING
   * Handles document interaction and viewing functionality
   **************************************************************************/

  /**
   * Handles document selection for search
   * Flow: Selection → Search Visibility → UI Update
   */

  const handleDocumentSelect = useCallback((fileIds) => {
    setSelectedDocuments(fileIds);
    // Add cache update
    setSearchVisible(fileIds.length > 0);
  }, []);

  /**
   * Manages document viewing functionality
   * Flow: View Request → Cache Check → Document Display
   */
  const handleDocumentView = useCallback(async (document) => {
    console.log('[ResearchAssistant] Viewing document:', document);
    try {
      let docToView = document

      if (document instanceof File) {
        // Handle new file viewing
        let storedDocument = storedDocuments.get(document.file_name);
        if (storedDocument) {
          // Use cached document
          console.log('[ResearchAssistant] Using cached document');
          docToView = { ...storedDocument, file_url: storedDocument.file_url };
        } else {
          // Store and cache new document
          docToView = { ...document, file_url: storedDocument.file_url };
          setStoredDocuments(prev => new Map(prev).set(storedDocument.file_name, storedDocument));
        }
      } else {
        // Handle existing document viewing
        const cachedUrl = storageManager.getCachedDocumentUrl(document.file_id, document.file_name);
        if (cachedUrl) {
          docToView = { ...document, file_url: cachedUrl };
        }
      }
      console.log('active docuement', {docToView} )
      setActiveDocument(docToView);
    } catch (error) {
      console.error('[ResearchAssistant] Error viewing document:', error);
      toast.error('Failed to prepare document for viewing');
    }
  }, [storedDocuments]);

  /**************************************************************************
   * SEARCH FUNCTIONALITY
   * Manages document search and result handling
   **************************************************************************/

  /**
   * Handles document search across selected documents
   * Flow: Search Parameters → API → Results Display
   */
  // const handleSearch = useCallback(async (searchParams) => {
  //   try {
  //     setIsProcessing(true);

  //     const response = await fetch('/api/research/documents/search', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         document_ids: selectedDocuments,
  //         ...searchParams
  //       })
  //     });

  //     const data = await response.json();

  //     if (data.status === 'error') {
  //       throw new Error(data.error);
  //     }

  //     // Cache search parameters for future use
  //     setCache('searchParams', searchParams);
  //     setSearchResults(data.results);
  //     toast.success(`Found matches in ${data.results.length} documents`);
  //   } catch (error) {
  //     console.error('Search error:', error);
  //     toast.error(error.message || 'Failed to perform search');
  //     setSearchResults(null);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // }, [selectedDocuments]);


  const handleSearch = useCallback(async (searchParams) => {
    try {
      setIsProcessing(true);
      // Cache search parameters
      await cacheSearchParams(searchParams);

      const response = await fetch('/api/research/documents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_ids: selectedDocuments,
          ...searchParams
        })
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }

      // Cache search results
      await cacheSearchResults(data.results);
      setSearchResults(data.results);
      toast.success(`Found matches in ${data.results.length} documents`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.message || 'Failed to perform search');
      setSearchResults(null);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedDocuments, cacheSearchParams, cacheSearchResults]);



  /**
   * Clears search results and cached parameters
   * Flow: Clear Request → Reset States → UI Update
   */
  const handleClearSearch = useCallback(() => {
    setSearchResults(null);
    clearCache('searchParams');
  }, []);

  /**************************************************************************
   * RENDER
   * Component render logic with conditional content display
   **************************************************************************/

  return (
    <> 
      <ResearchLayout
        // Sidebar Component - Document Management
        sidebarContent={
          <DocumentSidebar
            documents={documents}
            selectedDocuments={selectedDocuments}
            onSelect={handleDocumentSelect}
            onView={handleDocumentView}
            onDelete={handleDeleteDocument}
            stagedDocuments={stagedDocuments}
            onStagedUpload={handleStagedUpload}
            onRemoveStaged={handleRemoveStaged}
            onUploadStaged={handleUploadStaged}
          />
        }

        // Main Content Area - Dynamic Content Display
        mainContent={
          <div className="relative min-h-full">
            {/* Conditional Content Rendering */}
            {searchResults ? (
              // Search Results View
              <ResultsContainer
                results={searchResults}
                onViewDocument={handleDocumentView}
              />
            ) : activeDocument ? (
              // Document Viewer
              <DocumentViewer
                document={activeDocument}
                onClose={() => setActiveDocument(null)}
              />
            ) : (
              // Empty State
              <div className="flex items-center justify-center h-full text-tertiary">
                <NoResults />
              </div>
            )}
          </div>
        }

        // Search Interface
        searchBarContent={
          <SearchBar
            visible={searchVisible}
            onSearch={handleSearch}
            onClose={handleClearSearch}
          />
        }
      />

      {/* Global Action Button */}
      <FloatingActionButton
        onClick={() => setIsUploadModalOpen(true)}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        isProcessing={isProcessing}
      />
    </>
  );
}


export default ResearchAssistant;