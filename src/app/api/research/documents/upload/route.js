// src/app/api/research/documents/upload/route.js

import { NextResponse } from 'next/server';
import config from '../../../../../config';
import { pinata } from '../../../../api/file/pinata';

const DOCUMENT_UPLOAD_URL = `${config.backendApiUrl}research/documents/upload_documents/`;
const DOCUMENT_LIST_URL = `${config.backendApiUrl}research/documents/list/`;
const DOCUMENT_DELETE_URL = `${config.backendApiUrl}research/documents/delete`;

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

        // Send to Django backend
        const response = await fetch(DOCUMENT_UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
export async function GET() {
    console.log("[GET] Fetching documents get list ");
    
    // try {
      const response = await fetch(DOCUMENT_LIST_URL, {
        method: 'GET',
        credentials: 'include'
      });
     console.log("response: ", response)
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch documents');
      }
  
      return NextResponse.json({
        status: 'success',
        documents: data.documents
      });
  
    // } catch (error) {
    //   console.error('[GET] Error:', error);
    //   return NextResponse.json({ 
    //     status: 'error',
    //     error: error.message || 'Failed to fetch documents' 
    //   }, { status: 500 });
    // }
  }

  export async function DELETE(request) {
    console.log("[DELETE] Starting document deletion");
    
    try {
        const data = await request.json();
        const document_id = data.document_id;

        if (!document_id) {
            return NextResponse.json(
                { status: 'error', error: 'No document ID provided' },
                { status: 400 }
            );
        }
        
        console.log("Processing deletion of document:", document_id);
        const response = await fetch(DOCUMENT_DELETE_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ document_id })
        });
  
        const result = await response.json();
  
        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete document');
        }
  
            console.log("[DELETE] Document deleted successfully", result);
      
            return NextResponse.json({
                status: 'success',
                message: 'Document deleted successfully'
            });
      
        } catch (error) {
            console.error('[DELETE] Error:', error);
            return NextResponse.json(
                { status: 'error', error: error.message || 'Failed to delete document' },
                { status: 500 }
            );
        }
    }


    