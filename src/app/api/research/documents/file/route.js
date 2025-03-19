
// src/app/api/research/documents/file/route.js

import { NextResponse } from 'next/server';
import config from '../../../../../config';
import { pinata, deletePinataFile } from '../../../../api/file/pinata';


async function uploadToPrivateIPFS(file) {
    try {
      const upload = await pinata.upload.file(file, {
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: "My Private File",
        },
      });
      
      console.log("File uploaded to Private IPFS:", upload);
      return upload;
    } catch (error) {
      console.error("Error uploading to Private IPFS:", error);
    }
  }



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
        const formData = await request.formData();
        const files = formData.getAll('files');
        
        if (!files?.length) {
            return NextResponse.json({ 
                status: 'error',
                error: "No files provided" 
            }, { status: 400 });
        }

        console.log(`[POST] Processing ${files.length} files`);
        console.log(`[POST] Processing file:`, files );
        
        // Process files with Pinata
        const processedFiles = await Promise.all(
            files.map(async (file) => {
                try {
                    console.log(`[POST] Processing: ${file.name}`);
                    // const uploadData = await pinata.upload.file(file);
                    const uploadData = await uploadToPrivateIPFS(file);
                    const signedUrl = await pinata.gateways.createSignedURL({
                        cid: uploadData.cid,
                        expires: 2592000 
                    });
                    console.log("uploadData id :", uploadData.id)
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
      const { file_id } = await request.json();
      
      if (!file_id) {
        return NextResponse.json({
          status: 'error',
          error: 'No file id provided'
        }, { status: 400 });
      }
  
      console.log('[DELETE] Attempting to unpin files with file_id:', file_id);
    //   const success = await deletePinataFile(file_id);
    const success =await deleteFile(file_id)
  
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