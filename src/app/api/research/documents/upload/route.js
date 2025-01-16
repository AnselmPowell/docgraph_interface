// src/app/api/research/documents/upload/route.js

import { NextResponse } from 'next/server';
import config from '../../../../../config';
import { pinata } from '../../../../api/file/pinata';

const DOCUMENT_UPLOAD_URL = `${config.backendApiUrl}research/documents/upload_documents/`;
const DOCUMENT_LIST_URL = `${config.backendApiUrl}research/documents/list/`;
const DOCUMENT_DELETE_URL = `${config.backendApiUrl}research/documents/delete/`;

export async function POST(request) {
    console.log("[POST] Starting document upload");
     
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');
        
        if (!files?.length) {
            return NextResponse.json({ 
                status: 'error',
                error: "No files provided" 
            }, { status: 400 });
        }

        console.log(`[POST] Processing ${files.length} files`);
        
        // Process files with Pinata
        const processedFiles = await Promise.all(
            files.map(async (file) => {
                try {
                    console.log(`[POST] Processing: ${file.name}`);
                    const uploadData = await pinata.upload.file(file);
                    const signedUrl = await pinata.gateways.createSignedURL({
                        cid: uploadData.cid,
                        expires: 3600  // 1 hour expiry
                    });

                    return {
                        file_name: file.name,
                        file_url: signedUrl,
                        file_id: uploadData.id,
                        file_type: file.type,
                        file_size: file.size
                    };
                } catch (error) {
                    console.error(`[POST] File processing error: ${file.name}`, error);
                    return null;
                }
            })
        );

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
      const { document_ids } = await request.json();
  
      if (!document_ids?.length) {
        return NextResponse.json(
          { status: 'error', error: 'No document IDs provided' },
          { status: 400 }
        );
      }
  
      const response = await fetch(DOCUMENT_DELETE_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ document_ids }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete documents');
      }
  
      console.log("[DELETE] Documents deleted successfully", data);
  
      return NextResponse.json({
        status: 'success',
        message: `Successfully deleted ${document_ids.length} documents`,
      });
  
    } catch (error) {
      console.error('[DELETE] Error:', error);
      return NextResponse.json(
        { status: 'error', error: error.message || 'Failed to delete documents' },
        { status: 500 }
      );
    }
  }
  

  