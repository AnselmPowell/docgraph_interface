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
import { useState, useCallback, useEffect, useMemo } from 'react'; // Add useMemo

// Layout/Core Components
import { DocGraphLogo } from '../svg/DocGraphLogo.client';
import { ResearchLayout } from './layout/ResearchLayout.client';

// Feature Components
import { DocumentSidebar } from './DocumentManagement/DocumentSidebar.client';
import { DocumentViewer } from './DocumentViewer/DocumentViewer.client';
import { SearchBar } from './search/SearchBar.client';
import { ToolbarContainer } from './ToolBar/ToolbarContainer.client';

// Utilities & Services
import { toast } from '../messages/Toast.client';
import { WelcomeMessage } from '../messages/WelcomeMessage.client';
import { getCache, setCache, clearCache } from '../../services/caches';


// Hooks
import { useDocumentCache } from '../../hooks/useDocumentCache';
import { useSearchCache } from '../../hooks/useSearchCache';
import { useUICache } from '../../hooks/useUICache';
import { useAuth } from '../../hooks/useAuth';




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

  // User Role Management State

  const [userData, setUserData] = useState(); // Processed documents
  

  // Document Management States
  // Handles different states of documents in the system
  const [isDocumentFetched,  setIsDocumentsFetched] = useState(false)
  const [documents, setDocuments] = useState([]); // Processed documents
  const [openSidebar, setOpenSidebar] = useState(true); // Processed documents
  const [selectedDocuments, setSelectedDocuments] = useState([]); // Selected for search
  const [activeDocument, setActiveDocument] = useState(null); // Currently viewed
  const [stagedDocuments, setStagedDocuments] = useState([]); // Pending upload
  const [isProcessing, setIsProcessing] = useState(false);

  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  
  // Search & Results States
  // Manages search functionality and results
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchInDocumentResults, setSearchInDocumentResults] = useState({});

  const [pendingSearches, setPendingSearches] = useState([]);
  const [searchStatusInterval, setSearchStatusInterval] = useState(null);
 

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


  const { user, setUser, loading, error, login, register, logout, checkAuth, updateUser } = useAuth();

  
  /**************************************************************************
   * EFFECTS
   **************************************************************************/

  // Initial Load Effect
  const initializeFromCache = async () => {
    // Restore staged documents
    const staged = await getCachedStaged();
      if (staged) {
        console.log('cache manager: 5', staged )
        setStagedDocuments(staged);
    }
    const cacheTabs = await getCacheTabDocuments();
    if (cacheTabs) {
         console.log("stored tabs:", cacheTabs)
         setTabs(cacheTabs)
    } else {setTabs([])}

  };

  
  // Loadings user documents 
  useEffect( () => {

    const fetchUserData = async () => {
    console.log("User Data:", user);
    console.log("User Data (userData):", userData);

    const savedUser = localStorage.getItem("user");  

    let userDataCookie = await document.cookie
        .split("; ")
        .find(row => row.startsWith("userData="));

    let accessTokenCookie = await document.cookie
        .split("; ")
        .find(row => row.startsWith("accessToken="));

    let refreshTokenCookie = await document.cookie
        .split("; ")
        .find(row => row.startsWith("accessToken="));

    if( accessTokenCookie && refreshTokenCookie) {
      userDataCookie = await JSON.parse(decodeURIComponent(userDataCookie.split("=")[1]));
      accessTokenCookie = await decodeURIComponent(accessTokenCookie.split("=")[1]);  // No JSON.parse()
      refreshTokenCookie = await  decodeURIComponent(refreshTokenCookie.split("=")[1]); // No JSON.parse()
      
      await localStorage.setItem('user', JSON.stringify(userDataCookie));
      await localStorage.setItem('accessToken', accessTokenCookie);
      await localStorage.setItem('refreshToken', refreshTokenCookie );
      console.log("refresh token cookie:", refreshTokenCookie)

    }

   const fetchData = async () => {
        await fetchDocuments();
        await fetchSearchResult();
        await fetchNotes();
    };

    if (user) {
      
        fetchData();
        return;
    }


    if (userDataCookie) {
        // const parsedUserData = JSON.parse(decodeURIComponent(userDataCookie.split("=")[1]));
        await updateUser(userDataCookie);
        await initializeFromCache();
        // updateUser(userDataCookie);

        // Clean up cookie
        document.cookie = "userData=; Max-Age=0; path=/;";

        // Clean up by removing the cookies after reading
        document.cookie = 'userData=; Max-Age=0; path=/;';
        document.cookie = 'accessToken=; Max-Age=0; path=/;';
        document.cookie = 'refreshToken=; Max-Age=0; path=/;';
    } else if (savedUser || userData) {
        console.log("[ResearchAssistant] Fetching documents for saved user or userData:", userData?.email);
        // fetchData();
    } else {
        console.log("User not found, resetting state.");
        setUserData("");
        setDocuments([]);
        setTabs([]);
        setSearchResults([]);
        setActiveDocument(null)
        setActiveTab(null)
        // fetchData();
    }
  }

  fetchUserData()
}, [user]);




useEffect(() => {
  const handleUserChange = (event) => {
    if(event.detail.user) {
      console.log("user found")
      
      setUserData(event.detail.user)
    } else {
      console.log("user not found")
      setUserData("")
      handleDocumentView([])
      setDocuments([])
      setTabs([])
      setSearchResults([])
      setActiveDocument(null)
      setActiveTab(null)
      
    }
  };

  window.addEventListener('userStateChanged', handleUserChange);
  return () => window.removeEventListener('userStateChanged', handleUserChange);
}, [ ]);



   // Initial Cache Effect
  //  useEffect(() => {
  //    const initializeFromCache = async () => {
  //     // Restore staged documents
  //     const staged = await getCachedStaged();
  //       if (staged) {
  //         console.log('cache manager: 5', staged )
  //         setStagedDocuments(staged);
  //     }
  //     const cacheTabs = await getCacheTabDocuments();
  //     if (cacheTabs) {
  //          console.log("stored tabs:", cacheTabs)
  //          setTabs(cacheTabs)
  //     } else {setTabs([])}

  //   };

  //   initializeFromCache();
  // }, [getCachedDocument, getCachedStaged, getCacheTabDocuments, getCachedResults]);


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




  // Add useEffect for status checking
  useEffect(() => {
    console.log("[StatusCheck] Pending documents:", pendingDocuments.length);
    
    // Clear any existing interval
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
    
    // Set up new interval if we have pending documents
    if (pendingDocuments.length > 0) {
      console.log("[StatusCheck] Setting up status check interval");
      const interval = setInterval(() => {
        const docIds = pendingDocuments.map(doc => doc.document_id);
        console.log("[StatusCheck] Checking status for:", docIds);
        checkDocumentStatus(docIds);
      }, 5000); // Check every 5 seconds
      
      setStatusCheckInterval(interval);
    }
    
    // Cleanup on unmount
    return () => {
      if (statusCheckInterval) {
        console.log("[StatusCheck] Clearing interval on cleanup");
        clearInterval(statusCheckInterval);
      }
    };
  }, [pendingDocuments]);



  useEffect(() => {
    // Clean up any existing interval
    if (searchStatusInterval) {
      clearInterval(searchStatusInterval);
      setSearchStatusInterval(null);
    }
    
    // Set up interval if we have pending searches
    if (pendingSearches.length > 0) {
      console.log("[StatusCheck] Setting up search status check interval");
      const interval = setInterval(() => {
        const searchIds = pendingSearches.map(search => search.search_results_id);
        console.log("[StatusCheck] Checking status for searches:", searchIds);
        checkSearchStatus(searchIds);
      }, 5000); // Check every 3 seconds
      
      setSearchStatusInterval(interval);
    }
    
    // Cleanup on unmount
    return () => {
      if (searchStatusInterval) {
        console.log("[StatusCheck] Clearing search interval on cleanup");
        clearInterval(searchStatusInterval);
      }
    };
  }, [pendingSearches]);

   /**************************************************************************
   * USER ROLE MANAGEMENT
   * Core functionality for handling User activity 
   **************************************************************************/

  const SetAuthUserData = async (userData) => {

    if(userData){
      console.log(" Set User Data {userData}:", userData )
      setUserData(userData)
    }

  }
 

  /**************************************************************************
   * DOCUMENT MANAGEMENT
   * Core functionality for handling document operations
   **************************************************************************/

  /**
   * Fetches processed documents from backend
   * Data Flow: API → documents state → DocumentSidebar
   */
  const fetchDocuments = useMemo(() => async () => {
    if(isDocumentFetched){
      console.log("Documents already fetched")
      return
    }
    try {
        setIsProcessing(true);
        const response = await fetch('/api/research/documents/upload', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        const data = await response.json();

        if (data.status === 'error') {
            console.error('[fetchDocuments] Error:', data.detail); 
            throw new Error(data.message);
        }
    
        // Set documents (might be empty array)
        setDocuments(data.documents);
        setIsDocumentsFetched(true);

        // Only show success toast if documents were actually found
        if (data.documents.length > 0) {
            toast.success('Documents loaded successfully');
        } else {
            // Optional: Show informative message for no documents
            console.log('[fetchDocuments] No documents found');
        }
        setIsProcessing(false);
    } catch (error) {
        console.error('[fetchDocuments] Critical error:', error); // Dev logging
    } finally {
        setIsProcessing(false);
        
    }
  }, []);


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

  const handleOpenSidebar = useCallback(async (isOpen) => {
    if(!isOpen){
      setOpenSidebar(true)

     } else {
      setOpenSidebar(false)
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



  /**************************************************************************
   * DOCUMENT STAGING & UPLOAD HANDLERS
   * Manages document upload workflow
   **************************************************************************/

  /**
   * Handles initial document staging before upload
   * Flow: Files → Staging Area → Upload Queue
   */

  const handleStagedDocuments = useCallback(async (files) => {
    console.log('Staging documents:', files);
  setIsProcessing(true);

  let newDocs = [];
  const stagedDocuments = [];
  for (const file of files) {
      const stagedDocument = await storeToPinata(file);
      stagedDocuments.push(stagedDocument);
      await setStagedDocuments(prev => {
        newDocs = [...prev, stagedDocument];
        cacheStagedDocuments(newDocs);
        return newDocs;
      });
  }

  console.log('All documents staged:', stagedDocuments);
  

  const delayedUpload = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await handleUploadStaged(stagedDocuments);
  };
  
  await delayedUpload();
}, [cacheStagedDocuments]);



  /**
   * Process all staged documents for upload
   * Flow: Staging → Processing → Upload → Storage
   */

  // Updated handleUploadStaged to properly handle response and pending docs
const handleUploadStaged = useCallback(async (stagedDocuments) => {
  console.log("Upload Staged document:", stagedDocuments);
  if (stagedDocuments.length === 0) return;
  setStagedDocuments([]);
  setPendingDocuments(stagedDocuments);

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
    setIsProcessing(true);

    const response = await fetch('/api/research/documents/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ files: filesData })
    });

    const data = await response.json();
    console.log("Upload response:", data);

    if (data.status === 'error') {
      throw new Error(data.message || data.error);
    }

    // Add pending documents to state for status tracking
    if (Array.isArray(data.documents) && data.documents.length > 0) {
      console.log("Adding pending documents:", data.documents.length);
      
      // Make sure we have the expected document structure
      const validPendingDocs = data.documents.filter(doc => doc.document_id && doc.processing_status);
      
      // Update pending documents state to trigger status checking
      setPendingDocuments(validPendingDocs);
      await removeCachedStaged(...data.documents);
      
      toast.success(`Started processing ${validPendingDocs.length} document${validPendingDocs.length !== 1 ? 's' : ''}`);
    } else {
      console.error("Invalid or empty document data in response");
      toast.error("Received invalid response from server");
    }

  } catch (error) {
    console.error('[handleUploadStaged] Processing error:', error);
    toast.error('Unable to process documents. Please try again.');
  } finally {
    setIsProcessing(false);
  }
}, [removeCachedStaged, toast]);




 // Updated version of checkDocumentStatus in ResearchAssistant.client.jsx

const checkDocumentStatus = useCallback(async (documentIds) => {
  if (!documentIds || documentIds.length === 0) return;
  
  console.log("[checkDocumentStatus] Checking status for documents:", documentIds);
  
  try {
    const response = await fetch('/api/research/documents/upload', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        document_ids: documentIds
      })
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[checkDocumentStatus] Response data:", data);
    
    if (data.status === 'success' && Array.isArray(data.documents)) {
      // Process completed documents first
      const completedDocs = data.documents.filter(doc => 
        doc.processing_status === 'completed' || doc.processing_status === 'failed'
      );
      
      console.log("[checkDocumentStatus] Completed documents:", completedDocs.length);
      
      if (completedDocs.length > 0) {
        // Add completed documents to the main document list
        setDocuments(prevDocuments => {
          // Filter out documents that are already in the list
          const newDocs = completedDocs.filter(
            newDoc => !prevDocuments.some(doc => doc.document_id === newDoc.document_id)
          );
          
          
          // Return combined list if we have new docs
          return newDocs.length > 0 ? [...prevDocuments, ...newDocs] : prevDocuments;
        });
        
        // Remove completed documents from pending list
        setPendingDocuments(prevPending => 
          prevPending.filter(pendingDoc => 
            !completedDocs.some(doc => doc.document_id === pendingDoc.document_id)
          )
        );
      }
      
      // Update status for documents still in progress
      const inProgressDocs = data.documents.filter(doc => 
        doc.processing_status === 'pending' || doc.processing_status === 'processing'
      );
      
      if (inProgressDocs.length > 0) {
        setPendingDocuments(prevPending => {
          const updatedPending = [...prevPending];
          
          // Update each pending document with latest status
          inProgressDocs.forEach(updatedDoc => {
            const index = updatedPending.findIndex(doc => doc.document_id === updatedDoc.document_id);
            if (index !== -1) {
              updatedPending[index] = updatedDoc;
            }
          });
          
          return updatedPending;
        });
      }
    }
  } catch (error) {
    console.error('[checkDocumentStatus] Error:', error);
  }
}, [setDocuments, setPendingDocuments]);


  

  const handleSelectDocuments = useCallback((documentFileName) => {
    console.log("selected Docs:", documentFileName)
    setSelectedDocuments(documentFileName);
    setSearchBarVisible(documentFileName.length > 0);
    // Cache selection state
    cacheDocument({ type: 'selection', data: documentFileName });
  }, [cacheDocument]);

  
  const handleSelectAllDocuments = () => {

    const selectableDocIds = documents
      .filter(doc => doc.processing_status === 'completed')
      .map(doc => doc.file_name);

      handleSelectDocuments(selectableDocIds);
} 


   /**
   * Removes document 
   * Flow: Staging Area → Remove → Update UI
   */
   const handleRemoveDocument = useCallback(async(document) => {

    const updates = () => {
    if(stagedDocuments){
      setStagedDocuments(prev => 
        prev.filter(file => file.document_id !== document.document_id)
      );
    }
    setDocuments(prev => 
      prev.filter(file => file.document_id !== document.document_id)
    );
    }

    console.log("DETELE DOCUMENT")
    updates();
    await handleTabClose(document.document_id)
    await removeCachedStaged(document)
    await deleteFromPinata(document)
    await deleteUploadedDocument(document)

    
   
  }, []);

  const deleteUploadedDocument = async (document) => {
    console.log("Document uploaded deleted:", document)
    let document_id = document.document_id

    console.log('[handleDeleteDocumentUpload] Deleting document:', document_id);

    if(document.file_id) {
      handleTabClose(document.file_id)
    }
    
    
    if (document_id) {
        try {
            const response = await fetch('/api/research/documents/upload', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ document_id }), // Send single ID
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete document');
            }

            toast.success('Document removed successfully', 6000);
          } catch (error) {
            console.error('[handleRemoveDocument] Deletion error:', error); // Dev logging
            toast.error('Unable to remove document. Please try again');
          }
        }
    };



  const handleRemoveAllDocument = async () => {
    console.log("[handleRemoveAllDocument] Starting batch deletion");
    
    console.log("[handleRemoveAllDocument]  Selected Documents: ", selectedDocuments);
    // try {
      const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.file_name));
      let documentIds = []; 
      setSelectedDocuments([])
      setActiveTab(null);  
      setActiveDocument(null);
        selectedDocs.forEach(doc => {
          if (doc.document_id) {
              documentIds.push(doc.document_id);  // Use push instead of append
              handleTabClose(doc.document_id)
              removeCachedStaged(doc)
              deleteFromPinata(doc)
              setDocuments(prev => prev.filter(doc => !documentIds.includes(doc.document_id)));
              
          }
      });

      
        console.log("[handleRemoveAllDocument] Remove document Ids: ", documents);
        
        const response = await fetch('/api/research/documents/upload', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ document_ids: documentIds })
        });

        const result = await response.json();
        console.log("[handleRemoveAllDocument] backend response ", result );  
        
        toast.success(`Successfully removed ${selectedDocuments.length} documents`);
        return true;
        

    // } catch (error) {
    //     console.error('[handleRemoveAllDocument] Batch deletion error:', error);
    //     toast.error('Unable to remove documents. Please try again');
    //     return false;
    // }
};


 /**************************************************************************
   * DOCUMENT SELECTION & VIEWING
   * Handles document interaction and viewing functionality
   **************************************************************************/

  /**
   * Handles document selection for search
   * Flow: Selection → Search Visibility → UI Update
   */

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
  }, []);

 


  const handleViewSearchResults = useCallback(async (text, document, page) => { 
    console.log("view document search:", document)
    if(text) {
      await handleDocumentView(document)
      await setSearchInDocumentResults({text, page})
    }

  }, [searchInDocumentResults, handleDocumentView]);


  const handleCloseDocumentView = () => { 
    setActiveDocument(null)
    if(activeDocument.file_id){
      handleTabClose(activeDocument.file_id)
    } else {
      handleTabClose(activeDocument.document_id)
    }

  }


  /**************************************************************************
   * TAB MANAGMENT 
   * Manages all our tabs
   **************************************************************************/

  // Tab Management
  const createTab = useCallback((document) => {
    const newTab = {
      id: document?.document_id || document?.file_id,
      title:  document.file_name || document.title,
      type: 'document',
      document: document
    };
    console.log("New tab:", newTab)
    setTabs((prev) => {
      const tabExists = prev.some(tab => tab.id === newTab.id);
      if (!tabExists) {
        cacheTabDocuments([...prev, newTab]); 
        return [...prev, newTab];
      }
      
      return prev; 
    });
    setActiveTab(document.document_id);
  
  }, [cacheTabDocuments]); 
    
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
    console.log("Tester tab remove--:", activeTab)
    // Remove tab 
    setTabs(prev => prev.filter(t => t.id !== tabId));
    await removeCachedTabDocument(tabId)
    
    // If closing active tab
    if (activeTab === tabId) {
      setActiveDocument(null);
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
        handleSearchBarVisibility(false)
    }, [activeTool]);



  /**************************************************************************
   * SEARCH FUNCTIONALITY
   * Manages document search and result handling
   **************************************************************************/

  const fetchSearchResult = useMemo(() => async () => {
    if (!user && !userData) {
        return;
    }
    try {
    setIsSearching(true);
    const cachedResults = await getCachedResults();

    // if(cachedResults.data > 0) {
    //   console.log("stored search results:", cachedResults.data)
    //   setSearchResults(cachedResults.data)
    // await setIsSearching(false);  
    // } else {
    setIsSearching(true);
    console.log("USER FOUND FETCHING SEARCH RESULTS");

        const response = await fetch('/api/research/documents/search', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        console.log("Search Response:", response)
        // Check if response is OK (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check if response has content
        const text = await response.text();
        if (!text) {
            throw new Error("Empty response from server");
        }

        // Parse JSON safely
        const data = JSON.parse(text);
        console.log("FETCH SEARCH RESULTS: ", data);

        setIsSearching(false);

        if (data.status === 'error') {
            throw new Error(data.error);
        }

        // setSearchResults(prev => [...prev, ...data.results]);
        // cacheSearchResults([]);
        cacheSearchResults([...data.results]);
        setSearchResults(data.results)
    // }

    } catch (error) {
        console.error('Failed to fetch search results:', error);
        setIsSearching(false);
    }
  }, [user, userData, getCachedResults, cacheSearchResults]);



  const handleSearchBarVisibility = useCallback((visible) => {
    setSearchBarVisible(visible);
  }, []);
  

// Update handleSearch function
const handleSearch = useCallback(async (searchParams) => {
  try {
    setIsSearching(true);
    
    // Show toolbar and search results immediately
    setActiveTool('search-results');
    
    const response = await fetch('/api/research/documents/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        document_ids: selectedDocuments,
        context: searchParams.context,
        keywords: searchParams.keywords
      })
    });

    const data = await response.json();

    if (response.status === 500) {
      console.error('[handleSearch] Search error:', data.detail);
      toast.error('Search failed. Please try again');
      throw new Error(data.error);
    }

    if (data.results.length === 0) {
      toast.info('No matches found. Try adjusting your search terms', 8000);
    } else {
      toast.success(`Started search in ${data.results.length} document${data.results.length !== 1 ? 's' : ''}`);
      
      // Add pending searches
      const pendingSearchResults = data.results.filter(result => 
        result.processing_status === 'pending' || result.processing_status === 'processing'
      );
      
      if (pendingSearchResults.length > 0) {
        setPendingSearches(prev => [...prev, ...pendingSearchResults]);
      }
      
      // Add completed results directly
      const completedResults = data.results.filter(result => 
        result.processing_status === 'completed'
      );
      
      if (completedResults.length > 0) {
        setSearchResults(prev => [...prev, ...completedResults]);
      }
    }

  } catch (error) {
    console.error('[handleSearch] Search failure:', error);
    toast.error('Search failed. Please try again');
  } finally {
    setIsSearching(false);
  }
}, [selectedDocuments]);



  const checkSearchStatus = useCallback(async (searchIds) => {
    if (!searchIds || searchIds.length === 0) return;
    
    try {
      const response = await fetch('/api/research/documents/search', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          search_ids: searchIds
        })
      });
  
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      if (data.status === 'success') {
        // Process completed searches
        const completedSearches = data.results.filter(search => 
          search.processing_status === 'completed' || search.processing_status === 'failed'
        );
        
        if (completedSearches.length > 0) {
          // Update search results
          setSearchResults(prev => {
            // Create a map of existing results for quick lookup
            const existingResultsMap = new Map(prev.map(result => [result.search_results_id, result]));
            
            // Add completed searches to results
            completedSearches.forEach(search => {
              if (search.processing_status === 'completed') {
                existingResultsMap.set(search.search_results_id, search);
              } else {
                // Remove failed searches from the map - we don't want to show them
                existingResultsMap.delete(search.search_results_id);
                toast.error(`Search failed for ${search.title}: ${search.error_message || 'Unknown error'}`);
              }
            });
            
            return Array.from(existingResultsMap.values());
          });
          
          // Remove completed searches from pending
          setPendingSearches(prev => 
            prev.filter(pendingSearch => 
              !completedSearches.some(search => search.search_results_id === pendingSearch.search_results_id)
            )
          );
        }
        
        // Update status for searches still in progress
        const inProgressSearches = data.results.filter(search => 
          search.processing_status === 'pending' || search.processing_status === 'processing'
        );
        
        if (inProgressSearches.length > 0) {
          setPendingSearches(prev => {
            const updatedPending = [...prev];
            
            inProgressSearches.forEach(updatedSearch => {
              const index = updatedPending.findIndex(search => 
                search.search_results_id === updatedSearch.search_results_id
              );
              
              if (index !== -1) {
                updatedPending[index] = updatedSearch;
              }
            });
            
            return updatedPending;
          });
        }
      }
    } catch (error) {
      console.error('[checkSearchStatus] Error:', error);
    }
  }, []);




  const handleRemoveSearchResult = useCallback(async (search_results_id) => {
    console.log("Handle remove search result: ", search_results_id)
    let newResults = []
    setSearchResults(prev => {
      newResults = prev.filter(result => 
        
        !(result.search_results_id == search_results_id )
      );
      removeCachedResults(newResults)
      return newResults;
    });
    console.log("Fetch remove search result: ", search_results_id)
    if (search_results_id) {
      // try {
          console.log("Fetch remove search result: Endpoint " )
          const response = await fetch('/api/research/documents/search', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ search_result_id: search_results_id })
        });

          if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Failed to delete document');
          }

          toast.success('Document removed successfully', 6000);
        // } catch (error) {
        //   console.error('[handleRemoveDocument] Deletion error:', error); // Dev logging
        //   toast.error('Unable to remove document. Please try again');
        // }
      }
  }, []);


  const handleRemoveAllSearchResult = async (selectedSearchResults) => {
    console.log("[handleRemoveAllSearchResult] Starting batch deletion searchResults");
    
    console.log("[handleRemoveAllSearchResult]  Selected Documents: ", selectedSearchResults);
    // try {
      let searchIds = []; 
      selectedSearchResults.forEach(result => {
          if (result.search_result_id) {
            searchIds.push(result.search_result_id); 
          }
      });
      
        console.log("[handleRemoveAllSearchResult] Remove Search IDs: ", searchIds);
        
        const response = await fetch('/api/research/documents/search', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ search_result_ids: searchIds })
        });

        console.log("[handleRemoveAllSearchResult] backend response ", response );

        const result = await response.json();
        console.log("[handleRemoveAllSearchResult]  response OK  ", result );

        return true;
      }

    // } catch (error) {
    //     console.error('[handleRemoveAllDocument] Batch deletion error:', error);
    //     toast.error('Unable to remove documents. Please try again');
    //     return false;
    // }



  /**
   * Clears search results and cached parameters
   * Flow: Clear Request → Reset States → UI Update
   */
  const handleClearSearch = useCallback(() => {
    setSearchResults([]);
    clearCache('searchParams');
  }, []);



 /**************************************************************************
   * NOTES FUNCTIONALITY
   * Manages document Notes
   **************************************************************************/


  
  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch('/api/research/documents/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      
      if (!response.ok) {
        console.log("No Notes Found")
        
      }
      
      const data = await response.json();
      setNotes(data.notes || []);
      
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Don't show error toast here as it's not critical
    }
  }, []);



 // In ResearchAssistant.client.jsx
const handleSaveNote = useCallback(async (noteData) => {
  try {
    console.log("Note data", noteData)
    setNotes(prev => [...prev, noteData]);
     
  
    // Send to backend
    const response = await fetch('/api/research/documents/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(noteData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save note to server');
    }

    
  } catch (error) {
    console.error('Error saving note:', error);
    toast.error('Failed to save note');
  }
}, [setActiveTool, setNotes]);


  const handleNoteSelect = useCallback((note) => {
    setActiveTool('create-note');
  }, []);



  const handleDeleteNote = useCallback(async (noteId) => {
    try {
      // Remove from local state first for responsive UI
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      // Send delete request to backend
      const response = await fetch('/api/research/documents/notes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ note_id: noteId })
      });
      
      if (!response.ok) {
        // If the request fails, restore the note in the UI
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete note');
      }
      
    } catch (error) {
      console.error('Error deleting note:', error);
      // Fetch notes again to ensure UI is in sync with server
      fetchNotes();
      throw error;
    }
  }, [fetchNotes]);


  /**************************************************************************
   * RENDER
   * Component render logic with conditional content display
   **************************************************************************/
  
  

  return (
    <> 
      <ResearchLayout 

        onOpenSidebar={handleOpenSidebar}
        isSidebarOpen={openSidebar}
        tabs={tabs}
        activeTab={activeTab}
        activeTool={activeTool}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        selectedDocuments={selectedDocuments}
        setAuthUserData={SetAuthUserData}
        onToggleSearchBarVisibility={handleSearchBarVisibility}


        authState={{
          user,
          loading,
          error, 
          login,
          logout,
          
        }}
        
        // Sidebar Component - Document Management
        sidebarContent={
          <DocumentSidebar
            documents={documents}
            selectedDocuments={selectedDocuments}
            onSelect={handleSelectDocuments}
            onSelectAll={handleSelectAllDocuments}
            onView={handleDocumentView}
            onDelete={handleRemoveDocument}
            onDeleteAll={handleRemoveAllDocument}
            stagedDocuments={stagedDocuments}
            pendingDocuments={pendingDocuments} 
            onStagedUpload={handleStagedDocuments}
            onUploadStaged={handleUploadStaged}
            onUrlSubmit={handleUrlSubmit}
            isFetchingDocuments={isProcessing}
          />
        }

        // Main Content Area - Dynamic Content Display
        mainContent={
          <div className="relative min-h-full min-w-full border-emerald-600 ">
            <WelcomeMessage 
              documents={documents}
              stagedDocuments={stagedDocuments}
              pendingDocuments={pendingDocuments}
              userData={userData}
            />
            {/* Conditional Content Rendering */}
            <DocGraphLogo isAnimating={isProcessing} hasUser={userData} />

            { activeDocument && (
              // Document Viewer
              <DocumentViewer
              document={activeDocument}
              onClose={handleCloseDocumentView}
              searchInResults={searchInDocumentResults}
            />
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
          onSelect={handleSelectDocuments}
        />
        }

        toolbarContent={
          <ToolbarContainer
            documents={documents}
            activeTool={activeTool}
            pendingSearches={pendingSearches}
            onToolSelect={handleToolSelect}
            document={activeDocument}
            results={searchResults}
            onViewDocument={handleDocumentView}
            onViewSearchResults={handleViewSearchResults}
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote} 
            onNoteSelect={handleNoteSelect}
            isSearching={isSearching}
            onRemoveResult={handleRemoveSearchResult}
            onRemoveAllResult={handleRemoveAllSearchResult}

          />
        }
      


      />

     
    </>
  );
}


export default ResearchAssistant;