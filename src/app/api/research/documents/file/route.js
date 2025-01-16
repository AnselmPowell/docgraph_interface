
// src/app/api/research/documents/file/route.js

import { NextResponse } from 'next/server';
import config from '../../../../../config';
import { pinata, deletePinataFile } from '../../../../api/file/pinata';

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
                        expires: 3600  
                    });

                    return {
                        file_name: file.name,
                        file_url: signedUrl,
                        file_id: uploadData.id,
                        file_type: file.type,
                        file_size: file.size,
                        file_cid: uploadData.cid
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

        return NextResponse.json({
            status: 'success',
            documents: validFiles,
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




export async function DELETE(request) {
    try {
      const { cid } = await request.json();
      
      if (!cid) {
        return NextResponse.json({
          status: 'error',
          error: 'No CID provided'
        }, { status: 400 });
      }
  
      console.log('[DELETE] Attempting to unpin file with CID:', cid);
      const success = await deletePinataFile(cid);
  
      if (!success) {
        throw new Error('Failed to unpin file from Pinata');
      }
  
      return NextResponse.json({
        status: 'success',
        message: 'File unpinned successfully'
      });
  
    } catch (error) {
      console.error('[DELETE] Error:', error);
      return NextResponse.json({
        status: 'error', 
        error: error.message || 'Failed to unpin file'
      }, { status: 500 });
    }
  }