// // src/app/api/research/search/route.js
// import { NextResponse } from 'next/server';
// import config from '@/config';
// import { pinata } from '@/app/api/file/pinata';

// const RESEARCH_API_URL = `${config.backendApiUrl}research/analyze_documents/`;

// export async function POST(request) {
//     console.log("[POST] Starting document analysis request");
    
//     try {
//         const formData = await request.formData();
        
//         // Extract all files and parameters
//         const files = formData.getAll('files');
//         const context = formData.get('context');
//         const theme = formData.get('theme');
//         const keywords = formData.get('keywords')?.split(',').map(k => k.trim()) || [];

//         // Input Validation
//         if (!files?.length) {
//             console.log("[POST] No files provided");
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: "Please upload at least one document" 
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!context?.trim()) {
//             console.log("[POST] No context provided");
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: "Please provide research context" 
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!theme?.trim()) {
//             console.log("[POST] No theme provided");
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: "Please select or create a research theme" 
//                 },
//                 { status: 400 }
//             );
//         }

//         if (context.length > 1000) {
//             console.log("[POST] Context too long");
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: "Context must be 200 words or less" 
//                 },
//                 { status: 400 }
//             );
//         }

//         // Log processing start
//         console.log(`[POST] Processing ${files.length} files with theme: ${theme}`);
//         console.log(`[POST] Keywords: ${keywords.join(', ')}`);

//         // Process files with Pinata
//         const processedFiles = [];
//         for (const file of files) {
//             try {
//                 console.log(`[POST] Uploading file: ${file.name}`);
                
//                 // Upload to Pinata
//                 const uploadData = await pinata.upload.file(file);
//                 console.log(`[POST] File uploaded to Pinata: ${uploadData.id}`);

//                 // Get signed URL
//                 const signedUrl = await pinata.gateways.createSignedURL({
//                     cid: uploadData.cid,
//                     expires: 3600
//                 });

//                 processedFiles.push({
//                     file_name: file.name,
//                     file_url: signedUrl,
//                     file_id: uploadData.id,
//                     file_type: file.type
//                 });

//             } catch (error) {
//                 console.error(`[POST] Error uploading ${file.name}:`, error);
//                 // Continue with other files if one fails
//                 continue;
//             }
//         }

//         // Check if any files were processed successfully
//         if (processedFiles.length === 0) {
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: "Failed to upload any documents" 
//                 },
//                 { status: 500 }
//             );
//         }

//         console.log(`[POST] Successfully processed ${processedFiles.length} files`);

//         // Prepare payload for backend
//         const payload = {
//             files: processedFiles,
//             context: context,
//             theme: theme,
//             keywords: keywords
//         };

//         // Send to Django backend
//         const response = await fetch(RESEARCH_API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//             body: JSON.stringify(payload)
//         });

//         // Handle non-OK responses
//         if (!response.ok) {
//             let errorMessage = 'Failed to analyze documents';
//             try {
//                 const errorData = await response.json();
//                 errorMessage = errorData.message || errorMessage;
//             } catch {
//                 // If JSON parsing fails, use default error message
//             }
            
//             console.error('[POST] Backend error:', errorMessage);
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: errorMessage 
//                 },
//                 { status: response.status }
//             );
//         }

//         // Parse successful response
//         try {
//             const data = await response.json();
//             console.log('[POST] Analysis complete, returning results');

//             return NextResponse.json({
//                 status: 'success',
//                 results: data.results,
//                 message: `Successfully analyzed ${processedFiles.length} documents`
//             });
//         } catch (error) {
//             console.error('[POST] Error parsing response:', error);
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: 'Error processing analysis results' 
//                 },
//                 { status: 500 }
//             );
//         }

//     } catch (error) {
//         console.error('[POST] Unhandled error:', error);
//         return NextResponse.json({
//             status: 'error',
//             error: 'An unexpected error occurred during analysis'
//         }, {
//             status: 500
//         });
//     }
// }

// export async function DELETE(request) {
//     console.log("[DELETE] Starting document deletion request");
    
//     try {
//         const { document_ids } = await request.json();
        
//         if (!document_ids?.length) {
//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: "No document IDs provided" 
//                 },
//                 { status: 400 }
//             );
//         }

//         const response = await fetch(`${RESEARCH_API_URL}delete/`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include',
//             body: JSON.stringify({ document_ids })
//         });

//         if (!response.ok) {
//             let errorMessage = 'Failed to delete documents';
//             try {
//                 const errorData = await response.json();
//                 errorMessage = errorData.message || errorMessage;
//             } catch {
//                 // Use default error message if JSON parsing fails
//             }

//             return NextResponse.json(
//                 { 
//                     status: 'error',
//                     error: errorMessage 
//                 },
//                 { status: response.status }
//             );
//         }

//         return NextResponse.json({
//             status: 'success',
//             message: `Successfully deleted ${document_ids.length} documents`
//         });

//     } catch (error) {
//         console.error('[DELETE] Error:', error);
//         return NextResponse.json(
//             { 
//                 status: 'error',
//                 error: 'An unexpected error occurred while deleting documents' 
//             },
//             { status: 500 }
//         );
//     }
// }




// src/app/api/research/search/route.js

import { NextResponse } from 'next/server';
import config from '../../../../config';
// import { pinata } from '@/app/api/file/pinata';
import { pinata } from '../../../api/file/pinata'

const RESEARCH_API_URL = `${config.backendApiUrl}research/analyze_documents/`;

export async function POST(request) {
    console.log("[POST] Starting document analysis request");
    
    // try {
        const formData = await request.formData();
        
        console.log("Form data", formData)
        // Extract all files and parameters with validation
        const files = formData.getAll('files');
        const context = formData.get('context');
        const theme = JSON.parse(formData.get('theme') || '{}'); // Handle theme object
        const keywords = formData.get('keywords')?.split(',').map(k => k.trim()) || [];
        console.log(" continue pass value set") 
        // Enhanced validation
        if (!files?.length) {
            return NextResponse.json({ 
                status: 'error',
                error: "Please upload at least one document" 
            }, { status: 400 });
        }
        console.log("pass file check")
        if (!context?.trim() || context.length > 1000) {
            return NextResponse.json({ 
                status: 'error',
                error: "Please provide valid research context (200 words max)" 
            }, { status: 400 });
        }
        console.log("pass context check")
        if (!theme?.name) {
            return NextResponse.json({ 
                status: 'error',
                error: "Please select or create a research theme" 
            }, { status: 400 });
        }
        console.log("pass theme check")
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

        // Prepare backend payload
        const payload = {
            files: validFiles,
            context: context.trim(),
            theme: {
                id: theme.id,
                name: theme.name,
                is_new: theme.isNew || false
            },
            keywords: keywords.filter(Boolean)
        };

        // Send to Django backend
        const response = await fetch(RESEARCH_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to analyze documents');
        }

        return NextResponse.json({
            status: 'success',
            results: data.results,
            processingDetails: {
                totalFiles: validFiles.length,
                totalSize: validFiles.reduce((acc, file) => acc + file.file_size, 0),
                theme: theme.name,
                keywordCount: keywords.length
            },
            message: `Successfully analyzing ${validFiles.length} documents`
        });

    // } catch (error) {
    //     console.error('[POST] Error:', error);
    //     return NextResponse.json({
    //         status: 'error',
    //         error: error.message || 'An unexpected error occurred'
    //     }, { status: 500 });
    // }
}

// Add delete route for document removal
export async function DELETE(request) {
    console.log("[DELETE] Starting document deletion request");
    
    try {
        const { documentIds, theme } = await request.json();
        
        if (!documentIds?.length) {
            return NextResponse.json({ 
                status: 'error',
                error: "No document IDs provided" 
            }, { status: 400 });
        }

        const response = await fetch(`${RESEARCH_API_URL}delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ document_ids: documentIds, theme })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete documents');
        }

        return NextResponse.json({
            status: 'success',
            message: `Successfully deleted ${documentIds.length} documents`
        });

    } catch (error) {
        console.error('[DELETE] Error:', error);
        return NextResponse.json({ 
            status: 'error',
            error: error.message || 'Failed to delete documents' 
        }, { status: 500 });
    }
}