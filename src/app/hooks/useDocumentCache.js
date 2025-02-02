// src/app/hooks/useDocumentCache.js

import { useCallback } from 'react';
import { useAppCache } from '../contexts/AppContext.client'
import { CACHE_LEVELS } from '../services/cache/cacheManager';

export function useDocumentCache() {
  const { setCache, getCache, removeCache } = useAppCache();

  const serializeFile = (file) => {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      path: file.path,
      relativePath: file.relativePath,
      url: file.url,
      // Add any other needed properties
      _isSerializedFile: true // Flag to identify serialized files
    };
  };
  
  // Add this helper function to reconstruct File-like objects
  const deserializeFile = (serializedFile) => {
    if (!serializedFile._isSerializedFile) return serializedFile;
    
    // Create a File-like object with the necessary properties
    return {
      name: serializedFile.name,
      size: serializedFile.size,
      type: serializedFile.type,
      lastModified: serializedFile.lastModified,
      path: serializedFile.path,
      relativePath: serializedFile.relativePath,
      url: serializedFile.url,
      // Add methods that might be needed
      slice: () => {}, // Add if needed
      stream: () => {}, // Add if needed
      // Flag to identify reconstructed files
      _isReconstructedFile: true
    };
  };

  /**
   * Cache document metadata and status
   */
  const cacheDocument = useCallback(async (document) => {

    const key = `doc_${document.id}`;
    const data = {
      id: document.id,
      title: document.title || document.file_name,
      authors: document.authors,
      metadata: document.metadata,
      status: document.processing_status,
      timestamp: Date.now()
    };
    
    console.log('cache manager: 0', {key, data} )
    await setCache(key, data, {
      level: CACHE_LEVELS.PERSISTENT,
      expiry: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }, [setCache]);

  /**
   * Get cached document
   */
  const getCachedDocument = useCallback(async (documentId) => {
    return await getCache(`doc_${documentId}`, CACHE_LEVELS.PERSISTENT);
  }, [getCache]);

  

  /**
   * Cache staged documents
   */
  const cacheStagedDocuments = useCallback(async (documents) => {
    // const serializedDocuments = documents.map(serializeFile);
    
    console.log('cache manager: 1', {documents} )
    await setCache('staged_documents', documents, {
      level: CACHE_LEVELS.SESSION
    });
  }, [setCache]);


  /**
   * Get cached staged documents
   */
  const getCachedStaged = useCallback(async () => {
    const documents = await getCache('staged_documents', CACHE_LEVELS.SESSION);
    if (!documents) return [];
    // const reconstructedDocuments = documents.map(deserializeFile);
    return documents
  }, [getCache]);


  /**
   * remove cached document
   */
  const removeCachedStaged = async (document) => {
    // try {
      // First get current staged documents
   
      const currentStaged = await getCache('staged_documents', CACHE_LEVELS.SESSION);
      if (!currentStaged) return true;
  
      // Filter out the document to remove
      const updatedStaged = currentStaged.filter(file => file.
        file_name
         !== document.
         file_name
         );

  
      // Update cache with remaining documents
      await setCache('staged_documents', updatedStaged, {
        level: CACHE_LEVELS.SESSION
      });
  
      return true;
    // } catch (error) {
    //   console.error('Error removing cached staged document:', error);
    //   return false;
    // }
  }


/**
   * Cache staged documents
   */
const cacheTabDocuments = useCallback(async (tabDocuments) => {
  // const serializedDocuments = documents.map(serializeFile);
  
  console.log('cache manager: 1', {tabDocuments} )
  await setCache('tab_documents', tabDocuments, {
    level: CACHE_LEVELS.SESSION
  });
}, [setCache]);


/**
 * Get cached staged documents
 */
const getCacheTabDocuments = useCallback(async () => {
  const tabDocuments = await getCache('tab_documents', CACHE_LEVELS.SESSION);
  if (!tabDocuments) return [];
  // const reconstructedDocuments = documents.map(deserializeFile);
  return tabDocuments
}, [getCache]);


const removeCachedTabDocument = async (tabDocumentId) => {
 
    const currentTabs = await getCacheTabDocuments('staged_documents', CACHE_LEVELS.SESSION);
    if (!currentTabs) return true;

    // Filter out the document to remove
    console.log("remove tab:", tabDocumentId)
    const updatedTabs = currentTabs.filter(tab => tab.id
       !== tabDocumentId
       );

     console.log("updated tab:", updatedTabs)
    // Update cache with remaining documents
    await setCache('tab_documents', updatedTabs, {
      level: CACHE_LEVELS.SESSION
    });

    return true;
 
}


    /**
 * Cache document view url
 */
  const cacheDocumentViewUrl = useCallback(async (documentName, url) => {
    // const serializedDocuments = documents.map(serializeFile);
    
    console.log('cache manager url:', {documentName, url} )
    await setCache(documentName, url, {
      level: CACHE_LEVELS.SESSION
    });
  }, [setCache]);



  /**
   * Get cached document view url
   */
const getCacheDocumentViewUrl = useCallback(async (documentName) => {
    const url = await getCache(documentName, CACHE_LEVELS.SESSION);
    if (!url) return null;
    // const reconstructedDocuments = documents.map(deserializeFile);
    return url
}, [getCache]);

  return {
    cacheDocument,
    getCachedDocument,
    cacheStagedDocuments,
    getCachedStaged,
    removeCachedStaged,
    cacheTabDocuments,
    getCacheTabDocuments,
    removeCachedTabDocument,
    cacheDocumentViewUrl,
    getCacheDocumentViewUrl,
  };
}