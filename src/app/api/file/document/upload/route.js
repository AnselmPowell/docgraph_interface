// src/app/api/file/document/upload/route.js
import { NextResponse } from 'next/server';
import { pinata, deletePinataFile } from '@/app/api/file/pinata';
import config from '@/config';

const DJANGO_API_URL = config.backendApiUrl;

export async function POST(request) {
    let uploadedFileId = null;
    
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      const fileType = formData.get('fileType');
  
      // Upload to Pinata
      const uploadData = await pinata.upload.file(file);
      uploadedFileId = uploadData.id;
      
      // Get signed URL
      const signedUrl = await pinata.gateways.createSignedURL({
        cid: uploadData.cid,
        expires: 3600,
      });
  
      // If it's a document, send for analysis
      if (fileType !== 'image') {
        const analysisResponse = await fetch(`${DJANGO_API_URL}document/analys/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_url: signedUrl,
            file_id: uploadData.id,
            file_type: fileType,
          }),
        });
  
        const analysisData = await analysisResponse.json();
        console.log("Analysis Results:", analysisData);
  
        // Check if analysis was successful
        if (analysisData.status !== 'success') {
          // Delete the file from Pinata if analysis failed
          await deletePinataFile(uploadedFileId);
          
          return NextResponse.json({
            error: analysisData.error || 'Document analysis failed',
            status: 'failed'
          }, { status: 400 });
        }
  
        // If analysis was successful, return all data
        return NextResponse.json({
          fileId: uploadData.id,
          cid: uploadData.cid,
          url: signedUrl,
          analysis: analysisData.result,
          status: 'success'
        });
      }
  
      // For images, just return the upload info
      return NextResponse.json({
        fileId: uploadData.id,
        cid: uploadData.cid,
        url: signedUrl,
        status: 'success'
      });
  
    } catch (error) {
      console.error('Upload/Analysis error:', error);
      
      // If we have a fileId but encountered an error, clean up the uploaded file
      if (uploadedFileId) {
        await deletePinataFile(uploadedFileId);
      }
  
      return NextResponse.json({
        error: "Failed to process file",
        status: 'failed'
      }, { status: 500 });
    }
  }