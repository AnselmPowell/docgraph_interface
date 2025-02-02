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
import { 
  Search, 
  Sparkles,
  FileText, 
  BookOpen, 
  ListTodo,
  PlusSquare 
} from 'lucide-react';


import { DocGraphLogo } from '../svg/DocGraphLogo.client';

// Layout Components
import { ResearchLayout } from './layout/ResearchLayout.client';


// Document Management Components
import { DocumentSidebar } from './DocumentManagement/DocumentSidebar.client';
import { DocumentViewer } from './DocumentViewer/DocumentViewer.client';


// Search Components
import { SearchBar } from './Search/SearchBar.client';
import { ResultsContainer } from './Results/ResultsContainer.client';
import { NoResults } from './Results/NoResults.client';

// ToolBar Component
import {ToolbarContainer} from './ToolBar/ToolbarContainer.client'

// UI Components
import { toast } from '../messages/Toast.client';

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

  const [searchVisible, setSearchVisible] = useState(false);
  
  // Document Management States
  // Handles different states of documents in the system
  const [documents, setDocuments] = useState([]); // Processed documents
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Selected for search
  const [activeDocument, setActiveDocument] = useState(null); // Currently viewed
  const [stagedDocuments, setStagedDocuments] = useState([]); // Pending upload
  
  // Search & Results States
  // Manages search functionality and results
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // States for Document Status
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  
  // Toolbar States
   const [activeTool, setActiveTool] = useState(null);
   const [notes, setNotes] = useState([]);


  // Cache 
  // Cache System  Hooks 
  const { cacheDocument, getCachedDocument,cacheStagedDocuments, 
          getCachedStaged, removeCachedStaged, cacheTabDocuments, getCacheTabDocuments, removeCachedTabDocument} = useDocumentCache();
  const { cacheSearchParams, cacheSearchResults, getCachedResults, removeCachedResults } = useSearchCache();
  const { cacheUIPreferences } = useUICache();


  const [isProcessing, setIsProcessing] = useState(false);

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
      const tabs = await getCacheTabDocuments();
      if (tabs) {
           console.log("stored tabs:", tabs)
           setTabs(tabs)
      } else {setTabs([])}

      const results = await getCachedResults();
      if(results) {
        console.log("stored search results:", results.data)
        setSearchResults(results.data)
      }


    };

    initializeFromCache();
  }, [getCachedDocument, getCachedStaged, getCacheTabDocuments, getCachedResults]);

  // Search Parameters Cache Effect
  // Restores previous search parameters from cache
  useEffect(() => {
    const cachedSearchParams = getCache('searchParams');
    if (cachedSearchParams) {
      setContext(cachedSearchParams.context || '');
      setKeywords(cachedSearchParams.keywords || []);
    }
  }, []);


  // Search Results Effect
  useEffect(() => {
    if (searchResults?.length > 0) {
      setActiveTool('search-results');
    }
  }, [searchResults]);

  // Document Details Effect
  useEffect(() => {
    if (activeDocument && searchResults?.length < 1 ) {
      setActiveTool('document-details');
    }
  }, [activeDocument, searchResults]);


 

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
      setIsProcessing(true);
      const response = await fetch('/api/research/documents/upload');
      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }
  
      setDocuments(data.documents);
      setIsProcessing(false);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents');
    }
  };


  const handleUrlSubmit = useCallback(async (url) => {
    try {
      const formData = new FormData();
      formData.append('url', url);

      const response = await fetch('/api/research/documents/url', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.status === 'error') throw new Error(data.error);

      setStagedDocuments(prev => [...prev, data.document]);
      toast.success('Document added from URL');
    } catch (error) {
      console.error('URL submission error:', error);
      toast.error(error.message || 'Failed to add document from URL');
    }
  }, []);

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

    const stagedDocument = data.documents[0];

    return stagedDocument;
  };



  /**************************************************************************
   * DOCUMENT STAGING & UPLOAD HANDLERS
   * Manages document upload workflow
   **************************************************************************/

  /**
   * Handles initial document staging before upload
   * Flow: Files → Staging Area → Upload Queue
   */

  const handleStagedUpload = useCallback(async (files) => {
    console.log('Staging documents:', files);
    setIsProcessing(true);

    const stagedDocuments = [];
    for (const file of files) {
        const stagedDocument = await storeToPinata(file);
        stagedDocuments.push(stagedDocument)
    }

    console.log('All documents staged:', stagedDocuments);
    let newDocs = [];
    await setStagedDocuments(prev => {
      newDocs = [...prev, ...stagedDocuments];
      // Add cache update
      console.log('cache manager: 0-', {newDocs} )
      cacheStagedDocuments(newDocs);
      return newDocs;
    });

    toast.success(`${files.length} document${files.length !== 1 ? 's' : ''} staged`);
    const delayedUpload = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Pass newDocs directly to ensure we have the latest data
      await handleUploadStaged(newDocs);
    };
    
    await delayedUpload();
  }, [cacheStagedDocuments]);

  /**
   * Removes document 
   * Flow: Staging Area → Remove → Update UI
   */
  const handleRemoveDocument = useCallback(async(document) => {
  
    await handleTabClose(document.document_id)
    await removeCachedStaged(document)
    await deleteFromPinata(document)
    await deleteUploadedDocument(document)
    await handleTabClose(document.document_id)
    setDocuments(prev => 
      prev.filter(file => file.document_id !== document.document_id)
    );
  }, []);


  const deleteFromPinata = async (document) => {
    console.log("Document delete:", document)
    let file_id = document.document_id


    console.log('[handleDeleteDocument] Deleting file with fileId:', file_id);
    
    if (file_id) {
      const response = await fetch('/api/research/documents/file', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unpin file from Pinata');
      }
    }
  };

  
  const deleteUploadedDocument = async (document) => {
      console.log("Document uploaded deleted:", document)
      let document_id = document.document_id

      console.log('[handleDeleteDocumentUpload] Deleting document:', document_id);
      
      if (document_id) {
          try {
              const response = await fetch('/api/research/documents/delete', {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ document_id }), // Send single ID
              });

              if (!response.ok) {
                  const error = await response.json();
                  throw new Error(error.error || 'Failed to delete document');
              }

              toast.success('Document deleted successfully');
          } catch (error) {
              console.error('Delete error:', error);
              toast.error(error.message || 'Failed to delete document');
          }
          }
      };




  /**
   * Process all staged documents for upload
   * Flow: Staging → Processing → Upload → Storage
   */

  const handleUploadStaged = useCallback(async (stagedDocuments) => {
    console.log("Upload Staged document!!!:", stagedDocuments)
    if (stagedDocuments.length === 0) return;
    console.log("Number of staged docs:", stagedDocuments.length)
  
    try {
  
      const filesData = stagedDocuments.map(file => ({
        file_name: file.file_name,
        file_url: file.file_url,
        file_id: file.file_id,
        file_type: file.file_type,
        file_size: file.file_size,
        file_cid: file.file_cid,
      }));
  
      console.log('Uploading staged documents:', filesData);

      toast.success(`Now processing documents ...`);
  
      const response = await fetch('/api/research/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: filesData }),
      });
  
      const data = await response.json();
      console.log("data response: ", data)
  
      if (data.status === 'error') {
        throw new Error(data.error);
      }
      const firstDocument = data.documents[0]
      
      await setDocuments(prev => [...prev, ...data.documents]);
      await setStagedDocuments([]); // Clear staged documents
      await removeCachedStaged(...data.documents); 
      // await handleDocumentView(firstDocument)

      toast.success('Documents successfully Processed');
      setIsProcessing(false);
  
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload documents');
    } finally {
    }
  }, [stagedDocuments]);


 /**************************************************************************
   * DOCUMENT SELECTION & VIEWING
   * Handles document interaction and viewing functionality
   **************************************************************************/

  /**
   * Handles document selection for search
   * Flow: Selection → Search Visibility → UI Update
   */

  const handleDocumentSelect = useCallback((documentFileName) => {
    console.log("selected Docs:", documentFileName)
    setSelectedDocuments(documentFileName);
    setSearchVisible(documentFileName.length > 0);
    // Cache selection state
    cacheDocument({ type: 'selection', data: documentFileName });
  }, [cacheDocument]);



  /**
   * Manages document viewing functionality
   * Flow: View Request → Cache Check → Document Display
   */
  const handleDocumentView = useCallback(async (document) => {
    console.log('[ResearchAssistant] Viewing document:', document);
    try {
      let docToView = document
      let tabId;
      // Create new tab or focus existing
      if(document?.document_id) {
        console.log(" [ResearchAssistant] Viewing --Doc")
        tabId = `${document.document_id}`;
      }
      if(document?.file_id) {
        console.log(" [ResearchAssistant] Viewing --File")
        tabId = `${document.file_id}`;
      }
      setSelectedDocuments([document.file_name])
      const existingTab = tabs.find(t => t.id === tabId);

      console.log("all Tabs: ", tabs)
      
      if (existingTab) {
        setActiveTab(tabId);
      } else {
       createTab(document)
      }

     
      console.log('active docuement', {docToView} )
      setActiveDocument(docToView);
      setSearchBarVisible(true);
      
    } catch (error) {
      console.error('[ResearchAssistant] Error viewing document:', error);
      toast.error('Failed to prepare document for viewing');
    }
  }, [tabs]);



  // Tab Management
  const createTab =(document)=>{
    const newTab = {
      id: document.document_id || document.file_id,
      title:  document.file_name || document.title,
      type: 'document',
      document: document
    };
    console.log("New tab:", newTab)
    setTabs(prev => {
      cacheTabDocuments([...prev, newTab]);
      return [...prev, newTab];
    })
    setActiveTab(document.document_id);
  
  } 
    

  // Tab Change Handler
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.document) {
      setActiveDocument(tab.document);
      handleDocumentView(tab.document)
      
    }
  }, [tabs]);


  // Tab Close Handler
  const handleTabClose = useCallback(async(tabId) => {
    console.log("tab remove:", tabId)
    // Remove tab
    setTabs(prev => prev.filter(t => t.id !== tabId));
    await removeCachedTabDocument(tabId)
    

    // If closing active tab
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(t => t.id !== tabId);
      if (remainingTabs.length > 0) {
        // Switch to last remaining tab
        const lastTab = remainingTabs[remainingTabs.length - 1];
        setActiveTab(lastTab.id);
        setActiveDocument(lastTab.document);
        handleDocumentView(lastTab.document)
      } else {
        // No tabs left
        setActiveTab(null);
        setActiveDocument(null);
      }
    }
  }, [activeTab, tabs]);


/**************************************************************************
   * TOOLBAR FUNCTIONALITY
   * Manages all our tools 
   **************************************************************************/


    // Toolbar Handlers
    const handleToolSelect = useCallback((toolId) => {
      if (activeTool === toolId) {
        setActiveTool(null);
      } else {
        setActiveTool(toolId);
      }
    }, [activeTool]);


  
  /**************************************************************************
   * SEARCH FUNCTIONALITY
   * Manages document search and result handling
   **************************************************************************/


  const handleSearchBarVisibility = useCallback((visible) => {
    setSearchBarVisible(visible);
  }, []);

  const handleSearch = useCallback(async (searchParams) => {
    try {
      setIsSearching(true);
      
      // Show toolbar and search results immediately
      setActiveTool('search-results');
      
      const response = await fetch('/api/research/documents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_ids: selectedDocuments,
          context: searchParams.context,
          keywords: searchParams.keywords
        })
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }

      await cacheSearchResults(data.results);
      setSearchResults(prev=> [...prev, ...data.results]);
      toast.success(`Found matches in ${data.results.length} documents`);

    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.message || 'Failed to perform search');
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  }, [selectedDocuments, cacheSearchResults]);



  const handleRemoveSearchResult = useCallback((documentQuestion, documentTitle) => {
    setSearchResults(prev => {
      const newResults = prev.filter(result => 
        
        
        !(result.question == documentQuestion &&result.title == documentTitle )
      );
      removeCachedResults(newResults)
      return newResults;
    });
  }, []);



  /**
   * Clears search results and cached parameters
   * Flow: Clear Request → Reset States → UI Update
   */
  const handleClearSearch = useCallback(() => {
    setSearchResults(null);
    clearCache('searchParams');
  }, []);






  // Note Management
  const handleSaveNote = useCallback((noteData) => {
    const newNote = {
      id: Date.now(),
      ...noteData,
      source: activeDocument?.title || activeDocument?.file_name,
      timestamp: new Date().toISOString()
    };
    setNotes(prev => [...prev, newNote]);
    setActiveTool('notes-list');
  }, [activeDocument]);

  const handleNoteSelect = useCallback((note) => {
    setActiveTool('create-note');
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
            onDelete={handleRemoveDocument}
            stagedDocuments={stagedDocuments}
            onStagedUpload={handleStagedUpload}
            onUploadStaged={handleUploadStaged}
            onUrlSubmit={handleUrlSubmit}
          />
        }

        // Main Content Area - Dynamic Content Display
        mainContent={
          <div className="relative min-h-full min-w-full border-emerald-600 ">
            {/* Conditional Content Rendering */}
            <DocGraphLogo isAnimating={isProcessing} />
            { activeDocument ? (
              // Document Viewer
              <DocumentViewer
                document={activeDocument}
                onClose={() => setActiveDocument(null)}
              />
            ) : (
              // Empty State
              <div className="flex items-center justify-center h-full text-tertiary">
                {/* <NoResults /> */}
                <DocGraphLogo isAnimating={isProcessing} />
              </div>
            )}
          </div>
        }

        // // Search Interface
        searchBarContent={
          <SearchBar
          visible={searchBarVisible}
          onSearch={handleSearch}
          onClose={handleClearSearch}
          selectedDocuments={selectedDocuments}
          onToggleVisibility={handleSearchBarVisibility}
          isSearching={isSearching}
          onSelect={handleDocumentSelect}
        />
        }

        toolbarContent={
          <ToolbarContainer
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
            document={activeDocument}
            results={searchResults}
            onSaveNote={handleSaveNote}
            onViewDocument={handleDocumentView}
            notes={notes}
            onNoteSelect={handleNoteSelect}
            isSearching={isSearching}
            onRemoveResult={handleRemoveSearchResult}

          />
        }

        tabs={tabs}
        activeTab={activeTab}
        activeTool={activeTool}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        selectedDocuments={selectedDocuments}

        


      />

     
    </>
  );
}


export default ResearchAssistant;