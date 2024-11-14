// // src/app/api/governance/analysis/route.js
// import { NextResponse } from 'next/server';
// import config from '@/config';
// import { pinata, deletePinataFile } from '@/app/api/file/pinata';

// const GOVERNANCE_API_URL = `${config.backendApiUrl}governance/analysis/analyze_documents/`;

// export async function POST(request) {
//     console.log("Inside POST");
//     const formData = await request.formData();
//     console.log("request formdata:", formData);
//     const file = formData.get('file');
//     const fileType = formData.get('fileType');

//     console.log("file:", file);
//     if (!file) {
//       return NextResponse.json(
//         { error: "No file provided" },
//         { status: 400 }
//       );
//     }

//     console.log('Uploading file:', file.name, 'Size:', file.size);

//      // Upload to Pinata
//      const uploadData = await pinata.upload.file(file);
//      const uploadedFileId = uploadData.id;

//      console.log("uploadData:", uploadedFileId);
     
//      // Get signed URL
//      const signedUrl = await pinata.gateways.createSignedURL({
//        cid: uploadData.cid,
//        expires: 3600,
//      });


//      console.log("uploadData URL:", signedUrl);
//      console.log("uploadData ID:", uploadedFileId);
//      console.log("uploadData Type:", fileType);

//    try {

//     // Send the request to the Django backend
//     const response = await fetch(GOVERNANCE_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         file_name: file.name,
//         file_url: signedUrl,
//         file_id: uploadedFileId,
//         file_type: fileType,
//       }),
//       credentials: 'include',
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Backend error:', errorData);
//       return NextResponse.json(
//         { error: errorData.message || 'Failed to analyze documents' },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Analysis error:', error);
//     return NextResponse.json(
//       { error: 'An unexpected error occurred' },
//       { status: 500 }
//     );
//   }
// }



// src/app/api/governance/analysis/route.js
import { NextResponse } from 'next/server';
import config from '@/config';
import { pinata } from '@/app/api/file/pinata';

const GOVERNANCE_API_URL = `${config.backendApiUrl}governance/analysis/analyze_documents/`;

export async function POST(request) {
    console.log("[POST] Starting document analysis upload");
    const formData = await request.formData();
    const files = formData.getAll('files'); // Get all files

    if (!files || files.length === 0) {
        return NextResponse.json(
            { error: "No files provided" },
            { status: 400 }
        );
    }

    console.log(`[POST] Processing ${files.length} files`);
    
    try {
        // Process all files in parallel
        const filePromises = files.map(async (file) => {
            console.log(`[POST] Uploading file: ${file.name}, Size: ${file.size}`);
            
            // Upload to Pinata
            const uploadData = await pinata.upload.file(file);
            const signedUrl = await pinata.gateways.createSignedURL({
                cid: uploadData.cid,
                expires: 3600,
            });

            return {
                file_name: file.name,
                file_url: signedUrl,
                file_id: uploadData.id,
                file_type: file.type
            };
        });

        // Wait for all files to be processed
        const filesData = await Promise.all(filePromises);
        console.log(`[POST] All files uploaded to Pinata, sending to backend`);

        // Send to Django backend
        const response = await fetch(GOVERNANCE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filesData),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[POST] Backend error:', errorData);
            return NextResponse.json(
                { error: errorData.message || 'Failed to analyze documents' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('[POST] Analysis error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}