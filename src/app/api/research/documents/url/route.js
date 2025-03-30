// // src/app/api/research/documents/url/route.js
// import { NextResponse } from 'next/server';
// import { pinata } from '../../../../api/file/pinata';
// import { writeFileSync, unlinkSync, readFileSync } from 'fs';
// import { join } from 'path';
// import os from 'os';
// import { File, FormData } from 'formdata-node'; 

// // Use the same private upload function as in file/route.js
// async function uploadToPrivateIPFS(file) {
//   try {
//     const upload = await pinata.upload.file(file, {
//       pinataOptions: {
//         cidVersion: 1,
//       },
//       pinataMetadata: {
//         name: "My Private File",
//       },
//     });
    
//     console.log("File uploaded to Private IPFS:", upload);
//     return upload;
//   } catch (error) {
//     console.error("Error uploading to Private IPFS:", error);
//     throw error; // Re-throw to handle in the main function
//   }
// }


// export async function POST(request) {
//   console.log("[POST] Starting URL document upload");
//   let tempFilePath = null;
  
//   try {
//     // Get URL from request body
//     const formData = await request.formData();
//     const url = formData.get('url');
//     console.log("[Post] URL", url)
    
//     if (!url) {
//       return NextResponse.json({ 
//         status: 'error',
//         error: "No URL provided" 
//       }, { status: 400 });
//     }
    
//     console.log(`[POST] Processing URL: ${url}`);
    
//     // Validate URL format
//     let targetUrl;
//     try {
//       targetUrl = new URL(url);
//     } catch (e) {
//       return NextResponse.json({ 
//         status: 'error',
//         error: "Invalid URL format" 
//       }, { status: 400 });
//     }
    
//     // Make request to fetch the document
//     const response = await fetch(targetUrl);
    
//     if (!response.ok) {
//       return NextResponse.json({ 
//         status: 'error',
//         error: `Failed to download file: ${response.status} ${response.statusText}` 
//       }, { status: 400 });
//     }
    
//     // Get filename from URL
//     let fileName = targetUrl.pathname.split('/').pop();
//     if (!fileName || !fileName.toLowerCase().endsWith('.pdf')) {
//       fileName = fileName || 'document';
//       fileName = `${fileName}.pdf`;
//     }
    
//     // Get file as arrayBuffer
//     const arrayBuffer = await response.arrayBuffer();
//     const fileBuffer = Buffer.from(arrayBuffer);
    
//     // Check if the content is too small
//     if (fileBuffer.length < 1000) {
//       return NextResponse.json({ 
//         status: 'error',
//         error: "The downloaded file is too small to be a valid PDF" 
//       }, { status: 400 });
//     }
    
//     // Create a temporary file to save the PDF
//     const timestamp = new Date().getTime();
//     tempFilePath = join(os.tmpdir(), `${timestamp}-${fileName}`);
//     writeFileSync(tempFilePath, fileBuffer);
    
//     console.log(`[POST] Created temporary file: ${tempFilePath}`);
    
//     // Create a File object for Pinata upload
//     const file = new File([fileBuffer], fileName, {
//       type: 'application/pdf',
//       lastModified: Date.now()
//     });
    
//     // Use the same private upload function as the file API
//     const uploadData = await uploadToPrivateIPFS(file);
    
//     // Create signed URL using the SDK
//     const signedUrl = await pinata.gateways.createSignedURL({
//       cid: uploadData.cid,
//       expires: 2592000 // 30 days in seconds
//     });
    

//     // Return document in expected format
//     const document = {
//       file_name: fileName,
//       file_url: signedUrl,
//       file_id: uploadData.id,
//       file_type: 'application/pdf',
//       file_size: fileBuffer.length,
//       file_cid: uploadData.cid
//     };
    
//     console.log(`[POST] Successfully processed URL document: ${fileName}`);
    
//     return NextResponse.json({
//       status: 'success',
//       documents: [document],
//       message: `Successfully uploaded ${fileName}`
//     });
    
//   } catch (error) {
//     console.error('[POST] URL processing error:', error);
//     return NextResponse.json({ 
//       status: 'error',
//       error: error.message || 'Failed to process URL' 
//     }, { status: 500 });
//   } finally {
//     // Clean up temporary file
//     if (tempFilePath) {
//       try {
//         unlinkSync(tempFilePath);
//         console.log(`[POST] Cleaned up temporary file`);
//       } catch (e) {
//         console.error(`[POST] Error cleaning up temporary file: ${e.message}`);
//       }
//     }
//   }
// }







// src/app/api/research/documents/url/route.js
import { NextResponse } from 'next/server';
import { pinata } from '../../../../api/file/pinata';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { join } from 'path';
import os from 'os';
import fetch from 'node-fetch';
import FormData from 'form-data';  // Use node-form-data instead

export async function POST(request) {
  console.log("[POST] Starting URL document upload");
  let tempFilePath = null;
  
  try {
    // Get URL from request body
    const formData = await request.formData();
    const url = formData.get('url');
    const file_name = formData.get('file_name');
    console.log("[Post] URL", url);
    
    if (!url) {
      return NextResponse.json({ 
        status: 'error',
        error: "No URL provided" 
      }, { status: 400 });
    }
    
    console.log(`[POST] Processing URL: ${url}`);
    
    // Validate URL format
    let targetUrl;
    try {
      targetUrl = new URL(url);
    } catch (e) {
      return NextResponse.json({ 
        status: 'error',
        error: "Invalid URL format" 
      }, { status: 400 });
    }
    
    // Make request to fetch the document
    const response = await fetch(targetUrl.toString());
    
    if (!response.ok) {
      return NextResponse.json({ 
        status: 'error',
        error: `Failed to download file: ${response.status} ${response.statusText}` 
      }, { status: 400 });
    }
    
    // Get filename from URL
    let fileName
    let fileNameUrl = targetUrl.pathname.split('/').pop();
    if (!fileNameUrl || !fileNameUrl.toLowerCase().endsWith('.pdf')) {
      fileName = file_name || fileNameUrl;
      fileName = `${fileName}.pdf`;
    }
    
    // Get file as buffer
    const fileBuffer = await response.buffer();
    
    // Check if the content is too small
    if (fileBuffer.length < 1000) {
      return NextResponse.json({ 
        status: 'error',
        error: "The downloaded file is too small to be a valid PDF" 
      }, { status: 400 });
    }
    
    // Create a temporary file to save the PDF
    const timestamp = new Date().getTime();
    tempFilePath = join(os.tmpdir(), `${timestamp}-${fileName}`);
    writeFileSync(tempFilePath, fileBuffer);
    
    console.log(`[POST] Created temporary file: ${tempFilePath}`);
    
    // Using raw FormData (Node.js compatible)
    const nodeFormData = new FormData();
    // Append the file to the form using a buffer
    nodeFormData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'application/pdf'
    });
    
    // Upload to Pinata using their API
    const uploadResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        ...nodeFormData.getHeaders()
      },
      body: nodeFormData
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Pinata upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }
    
    const uploadData = await uploadResponse.json();
    
    // Create signed URL using the SDK
    const signedUrl = await pinata.gateways.createSignedURL({
      cid: uploadData.IpfsHash,
      expires: 2592000 // 30 days in seconds
    });
    
    // Return document in expected format
    const document = {
      file_name: fileName,
      file_url: targetUrl,
      file_id: uploadData.IpfsHash,
      file_type: 'application/pdf',
      file_size: fileBuffer.length,
      file_cid: uploadData.IpfsHash
    };
    
    console.log(`[POST] Successfully processed URL document: ${fileName}`);
    
    return NextResponse.json({
      status: 'success',
      documents: [document],
      message: `Successfully uploaded ${fileName}`
    });
    
  } catch (error) {
    console.error('[POST] URL processing error:', error);
    return NextResponse.json({ 
      status: 'error',
      error: error.message || 'Failed to process URL' 
    }, { status: 500 });
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        unlinkSync(tempFilePath);
        console.log(`[POST] Cleaned up temporary file`);
      } catch (e) {
        console.error(`[POST] Error cleaning up temporary file: ${e.message}`);
      }
    }
  }
}