
// // src/app/components/research/ResearchAssistant.client.jsx
// 'use client';

// import { useState, useCallback, useEffect } from 'react';
// import { ResearchLayout } from './layout/ResearchLayout.client';
// import { FloatingActionButton } from './core/FloatingActionButton.client';
// import { UploadModal } from './Upload/UploadModal.client';
// import { DocumentSidebar } from './DocumentManagement/DocumentSidebar.client';
// import { SearchBar } from './Search/SearchBar.client';
// import { DocumentViewer } from './DocumentViewer/DocumentViewer.client';
// import { ResultsContainer } from './Results/ResultsContainer.client';
// import { NoResults } from './Results/NoResults.client';
// import { toast } from '../ui/Toast.client';
// import { getCache, setCache, clearCache } from '../../services/cache';
// import { storageManager } from '../../services/storageManager';

// export function ResearchAssistant() {
//   // Modal & UI States
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [searchVisible, setSearchVisible] = useState(false);
  
//   // Document States
//   const [documents, setDocuments] = useState([]);
//   const [selectedDocuments, setSelectedDocuments] = useState([]);
//   const [activeDocument, setActiveDocument] = useState(null);
//   const [stagedDocuments, setStagedDocuments] = useState([]);
  
//   // Search & Results States
//   const [searchResults, setSearchResults] = useState(null);
//   const [storedDocuments, setStoredDocuments] = useState(new Map());

//   // Initial load of documents
//   useEffect(() => {
//     storageManager.clearExpiredCachedDocuments();
//     fetchDocuments();
//   }, []);

//   useEffect(() => {
//     const cachedSearchParams = getCache('searchParams');
//     if (cachedSearchParams) {
//       setContext(cachedSearchParams.context || '');
//       setTheme(cachedSearchParams.theme || null);
//       setKeywords(cachedSearchParams.keywords || []);
//     }
//   }, []);

//   // Fetch processed documents
//   const fetchDocuments = async () => {
//     try {
//       const response = await fetch('/api/research/documents/upload');
//       const data = await response.json();

//       if (data.status === 'error') {
//         throw new Error(data.error);
//       }
  
//       setDocuments(data.documents);
//     } catch (error) {
//       console.error('Failed to fetch documents:', error);
//       toast.error('Failed to load documents');
//     }
//   };



//   // Add this function to handle Pinata uploads
//   const storeToPinata = async (file) => {
//     console.log('[ResearchAssistant] Uploading to Pinata:', file.name);
    
//     const formData = new FormData();
//     formData.append('files', file);

//     const response = await fetch('/api/research/documents/file', {
//       method: 'POST',
//       body: formData
//     });

//     const data = await response.json();
//     console.log('[ResearchAssistant] Pinata upload response:', data);

//     if (data.status === 'error') {
//       throw new Error(data.error);
//     }

//     const storedDocument = data.documents[0];
//     console.log('[ResearchAssistant] Uploaded document:', storedDocument);

//     // Cache the document URL
//     storageManager.cacheDocumentUrl(
//       storedDocument.file_id,
//       storedDocument.file_name,
//       storedDocument.file_url,
//       storedDocument.file_cid
//     );
    
//     return storedDocument;
//   };

//   // Handle staging new documents
//   const handleStagedUpload = useCallback((files) => {
//     console.log('Staging documents:', files);
//     setStagedDocuments(prev => [...prev, ...files]);
//     toast.success(`${files.length} document${files.length !== 1 ? 's' : ''} staged`);
//   }, []);

//   // Remove document from staging
//   const handleRemoveStaged = useCallback((fileToRemove) => {
//     setStagedDocuments(prev => 
//       prev.filter(file => file !== fileToRemove)
//     );
//     toast.success('Document removed from staging');
//   }, []);


//   const handleRemoveUpload = useCallback((documentName) => {
//       setStoredDocuments(prev => {
//           const newMap = new Map(prev);
//           newMap.delete(documentName);
//           return newMap;
//       });
//       toast.success('Document removed from staging');
//   }, []);

//   // Process staged documents
//   const handleUploadStaged = useCallback(async () => {
//     if (stagedDocuments.length === 0) return;

//     try {
//       setIsProcessing(true);
//       const formData = new FormData();
//       stagedDocuments.forEach(file => {
//         formData.append('files', file);
//       });

//       console.log('Uploading staged documents:', stagedDocuments);

//       const response = await fetch('/api/research/documents/upload', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (data.status === 'error') {
//         throw new Error(data.error);
//       }
      
//       setDocuments(prev => [...prev, ...data.documents]);
//       setStagedDocuments([]); // Clear staged documents
//       toast.success('Documents uploaded successfully');

//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.message || 'Failed to upload documents');
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [stagedDocuments]);

//   // Handle document upload from modal
//   const handleUpload = useCallback(async (formData) => {
//     try {
//       setIsProcessing(true);

//       const response = await fetch('/api/research/documents/upload', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (data.status === 'error') {
//         throw new Error(data.error);
//       }
      
//       setDocuments(prev => [...prev, ...data.documents]);
//       setIsUploadModalOpen(false);
//       toast.success(data.message);

//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.message || 'Failed to upload documents');
//     } finally {
//       setIsProcessing(false);
//     }
//   }, []);

//   // Document selection handler
//   const handleDocumentSelect = useCallback((fileIds) => {
//     setSelectedDocuments(fileIds);
//     setSearchVisible(fileIds.length > 0);
//   }, []);

  
//   // Modify document view handler
//   const handleDocumentView = useCallback(async (document) => {
//     console.log('[ResearchAssistant] Viewing document -:', document);
//     try {
//       let docToView = document;


//       if (document instanceof File) {
//         // Check cache first
//         let storedDocument = storedDocuments.get(document.name);
//         if (storedDocument) {
//           console.log('[ResearchAssistant] Using stored document:', storedDocument);
//           docToView = { ...storedDocument, url: storedDocument.file_url };
//         } else {
//           // store and cache if not found
//           storedDocument = await storeToPinata(document);
//           console.log('[ResearchAssistant] Stored document:', storedDocument);
//           docToView = { ...document, url: storedDocument.file_url };
//           setStoredDocuments(prev => new Map(prev).set(storedDocument.file_name, storedDocument));
//           console.log('[ResearchAssistant] Set Store document:', storedDocument);
//         }
//       } else {
//         // For already processed documents, check storage cache
//         const cachedUrl = storageManager.getCachedDocumentUrl(document.file_id, document.file_name);
//         if (cachedUrl) {
//           docToView = { ...document, url: cachedUrl };
//         }
//       }
      
//       console.log('[ResearchAssistant] Viewing document:', docToView.url);
//       setActiveDocument(docToView);
//     } catch (error) {
//       console.error('[ResearchAssistant] Error viewing document:', error);
//       toast.error('Failed to prepare document for viewing');
//     }
//   }, [storedDocuments]);


//   const handleDeleteDocument = async (documentName) => {
//     // try {
//       // Get CID before removing from storage
//       const uploadedDocument = storedDocuments.get(documentName);
//       let fileId;

//       if (storedDocuments.size > 0) {
//           fileId = uploadedDocument.file_id;
          
//       } else {
//           fileId = document.file_id;
//       }

  
//       const cid = storageManager.getCachedCid(fileId);
      
//       console.log('[handleDeleteDocument] Deleting file with CID:', cid);
//       if (cid) {
        
//         const response = await fetch('/api/research/documents/file', {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ cid })
//         });
  
//         if (!response.ok) {
//           const error = await response.json();
//           throw new Error(error.error || 'Failed to unpin file from Pinata');
//         }
  
//         console.log('[handleDeleteDocument] File unpinned successfully');
           
//       }

//       handleRemoveUpload(uploadedDocument)
//       console.log('[handleDeleteDocument] Removing document from storage:', fileId);
//       storageManager.removeDocument(fileId);
  
//       toast.success('Document deleted successfully');

//   };


//   // Search handler
//   const handleSearch = useCallback(async (searchParams) => {
//     try {
//       setIsProcessing(true);

//       const response = await fetch('/api/research/documents/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           document_ids: selectedDocuments,
//           ...searchParams
//         })
//       });

//       const data = await response.json();

//       if (data.status === 'error') {
//         throw new Error(data.error);
//       }

//       setCache('searchParams', searchParams);
//       setSearchResults(data.results);
//       toast.success(`Found matches in ${data.results.length} documents`);
//     } catch (error) {
//       console.error('Search error:', error);
//       toast.error(error.message || 'Failed to perform search');
//       setSearchResults(null);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [selectedDocuments]);

//   const handleClearSearch = useCallback(() => {
//     setSearchResults(null);
//     clearCache('searchParams');
//   }, []);




//   return (
//     <> 
//       <ResearchLayout
//         sidebarContent={
//           <DocumentSidebar
//             documents={documents}
//             selectedDocuments={selectedDocuments}
//             onSelect={handleDocumentSelect}
//             onView={handleDocumentView}
//             onDelete={handleDeleteDocument}
//             // New staged document props
//             stagedDocuments={stagedDocuments}
//             onStagedUpload={handleStagedUpload}
//             onRemoveStaged={handleRemoveStaged}
//             onUploadStaged={handleUploadStaged}
//           />
//         }
//         mainContent={
//           <div className="relative min-h-full">
//             {searchResults ? (
//               <ResultsContainer
//                 results={searchResults}
//                 onViewDocument={handleDocumentView}
//               />
//             ) : activeDocument ? (
//               <DocumentViewer
//                 document={activeDocument}
//                 onClose={() => setActiveDocument(null)}
//               />
//             ) : (
//               <div className="flex items-center justify-center h-full text-tertiary">
//                 <NoResults />
//               </div>
//             )}
//           </div>
//         }
//         searchBarContent={
//           <SearchBar
//             visible={searchVisible}
//             onSearch={handleSearch}
//             onClose={handleClearSearch}
//           />
//         }
//       />

//       {/* Floating Action Button */}
//       <FloatingActionButton
//         onClick={() => setIsUploadModalOpen(true)}
//       />

//       {/* Upload Modal */}
//       <UploadModal
//         isOpen={isUploadModalOpen}
//         onClose={() => setIsUploadModalOpen(false)}
//         onUpload={handleUpload}
//         isProcessing={isProcessing}
//       />
//     </>
//   );
// }

// export default ResearchAssistant;














