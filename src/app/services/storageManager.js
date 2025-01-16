// src/app/services/storageManager.js
'use client';

class StorageManager {
 constructor() {
   this.STORAGE_KEY = 'document_urls';
   this.EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
 }

 getStoredDocuments() {
   if (typeof window === 'undefined') return new Map();
   
   try {
     const stored = localStorage.getItem(this.STORAGE_KEY);
     return stored ? new Map(JSON.parse(stored)) : new Map();
   } catch (error) {
     console.error('[StorageManager] Error reading from storage:', error);
     return new Map();
   }
 }

 saveStoredDocuments(docs) {
   if (typeof window === 'undefined') return;
   
   try {
     localStorage.setItem(this.STORAGE_KEY, 
       JSON.stringify(Array.from(docs.entries()))
     );
   } catch (error) {
     console.error('[StorageManager] Error saving to storage:', error);
   }
 }

 
 getCachedDocumentUrl(fileId, fileName) {
   const docs = this.getStoredDocuments();
   console.log('[StorageManager] Getting URL for:', { fileId, fileName });
   
   const doc = docs.get(fileId);

   if (!doc) {
     console.log('[StorageManager] No cached document found');
     return null;
   }
   
   // Check if URL is expired
   if (Date.now() - doc.timestamp > this.EXPIRY_TIME) {
     console.log('[StorageManager] Cached URL expired');
     docs.delete(fileId);
     this.saveStoredDocuments(docs);
     return null;
   }

   console.log('[StorageManager] Found cached URL');
   return doc.fileUrl;
 }

 cacheDocumentUrl(fileId, fileName, fileUrl, fileCid) {
   console.log('[StorageManager] Storing document:', { fileId, fileName, fileCid });
   
   const docs = this.getStoredDocuments();
   docs.set(fileId, {
     fileId,
     fileName,
     fileUrl,
     fileCid,
     timestamp: Date.now()
   });
   
   this.saveStoredDocuments(docs);
   console.log('[StorageManager] Document stored successfully:', docs.get(fileId));
 }

 getCachedCid(fileId) {
   console.log('[StorageManager] Getting CID for:', fileId);
   const docs = this.getStoredDocuments();
   console.log('[StorageManager] Found documents:', docs);
   const cid  =docs.get(fileId)?.fileCid || null;
   console.log('[StorageManager] Found CID:', cid);
   return cid
 }

 removeCachedDocument(fileId) {
   console.log('[StorageManager] Removing document:', fileId);
   const docs = this.getStoredDocuments();
   const doc = docs.get(fileId);
   
   if (doc) {
     docs.delete(fileId);
     this.saveStoredDocuments(docs);
     console.log('[StorageManager] Document removed successfully');
     return doc;
   }
   
   console.log('[StorageManager] No document found to remove');
   return null;
 }

 getAllDocuments() {
   const docs = this.getStoredDocuments();
   return Array.from(docs.values());
 }

 clearExpiredCachedDocuments() {
   const docs = this.getStoredDocuments();
   const now = Date.now();
   let cleaned = false;

   for (const [fileId, doc] of docs.entries()) {
     if (now - doc.timestamp > this.EXPIRY_TIME) {
       docs.delete(fileId);
       cleaned = true;
     }
   }

   if (cleaned) {
     this.saveStoredDocuments(docs);
     console.log('[StorageManager] Cleaned expired documents');
   }
 }
}

export const storageManager = new StorageManager();