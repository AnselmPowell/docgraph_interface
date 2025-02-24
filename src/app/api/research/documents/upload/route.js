
// src/app/api/research/documents/upload/route.js

import { NextResponse } from 'next/server';
import config from '../../../../../config';
import { pinata } from '../../../../api/file/pinata';

const DOCUMENT_UPLOAD_URL = `${config.backendApiUrl}research/documents/upload_documents/`;
const DOCUMENT_LIST_URL = `${config.backendApiUrl}research/documents/list/`;
const DOCUMENT_DELETE_URL = `${config.backendApiUrl}research/documents/delete`;

async function deleteFile(fileId) {
  try {
      // 0194ae86-c97f-7ae8-a405-f81b7c8fdf3b
    const result = await pinata.files.delete([fileId]);
    console.log("File deleted:", result);
    return result;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function POST(request) {
    console.log("[POST] Starting document upload");
     
    try {
        const { files } = await request.json();
        
        if (!files?.length) {
            return NextResponse.json({ 
                status: 'error',
                error: "No files provided" 
            }, { status: 400 });
        }

        console.log(`[POST] Processing ${files.length} files`);
        
        // Process files with Pinata
        const processedFiles = await Promise.all(files.map(async (file) => {
          try {
            console.log(`[POST] Processing file: ${file.file_name}`);
            console.log(`[POST] file url: ${file.file_url}`);
            console.log(`[POST] Processing file data:, ${file}`);
            let fileUrl = '';
            
            if (!file.file_url) {
              const uploadData = await pinata.upload.file(file);
              const signedUrl = await pinata.gateways.createSignedURL({
                cid: uploadData.cid,
                expires: 3600  // 1 hour expiry
              });
        
              fileUrl = signedUrl;
            } else {
              fileUrl = file.file_url;
            }
        
            return {
              file_name: file.file_name,
              file_url: fileUrl,
              file_id: file.file_id,
              file_type: file.file_type,
              file_size: file.file_size
            };
          } catch (error) {
            console.error(`[POST] File processing error: ${file.file_name}`, error);
            throw error;
          }
        }));

        // Filter out failed uploads
        const validFiles = processedFiles.filter(Boolean);
        
        if (validFiles.length === 0) {
            return NextResponse.json({ 
                status: 'error',
                error: "Failed to process uploaded documents" 
            }, { status: 500 });
        }

        const authHeader = request.headers.get('authorization');
        console.log("[POST] Auth header:", authHeader);
        console.log("valid file data: ", JSON.stringify(validFiles))

        // Send to Django backend
        const response = await fetch(DOCUMENT_UPLOAD_URL, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `${authHeader}` },
            credentials: 'include',
            body: JSON.stringify(validFiles)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to process documents');
        }

        console.log("[POST] Processing complete", data);

        return NextResponse.json({
            status: 'success',
            documents: data.documents,
            processingDetails: {
                totalFiles: validFiles.length,
                totalSize: validFiles.reduce((acc, file) => acc + file.file_size, 0)
            },
            message: `Successfully uploaded ${validFiles.length} documents`
        });

    } catch (error) {
        console.error('[POST] Error:', error);
        return NextResponse.json({ 
            status: 'error',
            error: error.message || 'Failed to upload documents' 
        }, { status: 500 });
    }
}



// Get uploaded documents
export async function GET(request) {
    console.log("[GET] Fetching documents get list ");

    const authHeader = request.headers.get('authorization');
    console.log("[POST] Auth header:", authHeader);
    
    // try {
      const response = await fetch(DOCUMENT_LIST_URL, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `${authHeader}` },
        credentials: 'include'
      });
     console.log("response: ", response)
      const data = await response.json();
  
      return NextResponse.json({
        status: 'success',
        message: data.message,
        documents: data.documents || []
    });

//   } catch (error) {
//     console.error('[GET] Error:', error);
//     return NextResponse.json({ 
//         status: 'error',
//         error: 'Failed to connect to server'
//     }, { status: 500 });
// }
  
  }


  
export async function DELETE(request) {
  console.log("DELETE ALL FETCH")
  try {
      const data = await request.json();
      const docId = data.document_id;
      const docIds = data.document_ids;  // New field for multiple files

      console.log("[DELETE]: fileId", docId )
      console.log("[DELETE]: fileIds", docIds)

      const authHeader = request.headers.get('authorization');
      
      // Handle single file deletion
      if (docId ) {
          console.log('[DELETE] Attempting to unpin single file:', docId );
          const success = await deleteFile(docId );

          const response = await fetch(DOCUMENT_DELETE_URL, {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `${authHeader}` },
            credentials: 'include',
            body: JSON.stringify({ document_id: docId  })
        });
          
          if (!success) {
              throw new Error('Failed to unpin file from Pinata');
          }
          
          return NextResponse.json({
              status: 'success',
              message: 'File unpinned successfully'
          });
      }

      console.log(" [DELETE] file ")
      
      // Handle multiple file deletion
      if (docIds) {
          console.log('[DELETE] Attempting to unpin multiple files:', docIds);
          
          const results = await Promise.all(
            docIds.map(async (id) => {
                  try {
                       await deleteFile(id);
                      
                       console.log("[DELETE] Deleting ID :", id)
                       const response = await fetch(DOCUMENT_DELETE_URL, {
                          method: 'DELETE',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `${authHeader}` },
                          credentials: 'include',
                          body: JSON.stringify({ document_id: id })
                      });
            


                  } catch (error) {
                      console.error(`Failed to delete file ${id}:`, error);
                      return false;
                  }
              })
          );
          
        const successCount = results.filter(Boolean).length;

          return NextResponse.json({
              status: 'success',
              message: `Successfully removed ${successCount} of ${docIds.length} files`,
              details: {
                  total: docIds.length,
                  successful: successCount,
                  failed: docIds.length - successCount
              }
          });
      }
      
      return NextResponse.json({
          status: 'error',
          error: 'No file id or file ids provided'
      }, { status: 400 });
      
  } catch (error) {
      console.error('[DELETE] Error:', error);
      return NextResponse.json({
          status: 'error',
          error: error.message || 'Failed to unpin file(s)'
      }, { status: 500 });
  }
}


