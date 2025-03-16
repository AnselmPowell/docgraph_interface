

// import { NextResponse } from 'next/server';
// import config from '../../../../../config';

// const DOCUMENT_SEARCH_URL = `${config.backendApiUrl}research/documents/search/`;

// export async function POST(request) {
//     console.log("[POST] Starting document search");


//     try {
//         const data = await request.json();
         
//         // Validate required fields
//         const { document_ids, context, keywords = [] } = data;
        
//         const file_name = document_ids
//         if (!document_ids?.length) {
//             return NextResponse.json({ 
//                 status: 'error',
//                 error: "No documents selected for search" 
//             }, { status: 400 });
//         }

//         if (!context?.trim()) {
//             return NextResponse.json({ 
//                 status: 'error',
//                 error: "Search context is required" 
//             }, { status: 400 });
//         }

//         // Word count validation for context
//         const wordCount = context.trim().split(/\s+/).length;
//         if (wordCount > 200) {
//             return NextResponse.json({ 
//                 status: 'error',
//                 error: "Context must be 200 words or less" 
//             }, { status: 400 });
//         }
        
//         const authHeader = request.headers.get('authorization');
//         console.log("[POST] Sending Request to backend:", document_ids);
        
//         // Send search request to backend
//         const response = await fetch(DOCUMENT_SEARCH_URL, {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `${authHeader}` },
//             credentials: 'include',
//             body: JSON.stringify({
//                 file_name,
//                 context: context.trim(),
//                 keywords: keywords
//             })
//         });

//         const searchResults = await response.json();
//         console.log("[POST] SEARCH RESULTS RESPONSE: \n", searchResults);

//         if (!response.ok) {
//             throw new Error(searchResults.message || 'Failed to perform search');
//         }

//         console.log("[POST] Search initiated");

//         return NextResponse.json({
//             status: 'success',
//             results: searchResults.results.map(result => ({
//                 search_results_id: result.search_results_id,
//                 document_id: result.document_id,
//                 title: result.title,
//                 question: result.question,
//                 keywords: result.keywords,
//                 authors: result.authors,
//                 summary: result.summary,
//                 relevance_score: result.relevance_score,
//                 processing_status: result.processing_status || 'pending',
//                 matching_sections: result.matching_sections || []
//             })),
//             metadata: {
//                 total_results: searchResults.results.length,
//                 search_params: {
//                     context,
//                     keywords,
//                     document_count: document_ids.length
//                 }
//             }
//         });

//     } catch (error) {
//         console.error('[POST] Search error:', error);
//         return NextResponse.json({ 
//             status: 'error',
//             error: error.message || 'Failed to perform document search' 
//         }, { status: 500 });
//     }
// }

// // New endpoint to check search status
// export async function PATCH(request) {
//     console.log("[PATCH] Checking search status");

//     try {
//         const { search_result_ids } = await request.json();
        
//         if (!search_result_ids?.length) {
//             return NextResponse.json({ 
//                 status: 'error',
//                 error: "No search result IDs provided" 
//             }, { status: 400 });
//         }

//         const authHeader = request.headers.get('authorization');
        
//         // Check status from backend
//         const response = await fetch(SEARCH_STATUS_URL, {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `${authHeader}` 
//             },
//             credentials: 'include',
//             body: JSON.stringify({ search_result_ids })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || 'Failed to check search status');
//         }

//         return NextResponse.json({
//             status: 'success',
//             results: data.results
//         });

//     } catch (error) {
//         console.error('[PATCH] Error checking search status:', error);
//         return NextResponse.json({ 
//             status: 'error',
//             error: error.message || 'Failed to check search status' 
//         }, { status: 500 });
//     }
// }



// export async function GET(request) {
//     console.log("[GET] Fetching documents search results ");

//     const authHeader = request.headers.get('authorization');
//     console.log("[GET] Auth header:", authHeader);
    
//     // try {
//       const response = await fetch(DOCUMENT_SEARCH_URL, {
//         method: 'GET',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `${authHeader}` },
//         credentials: 'include'
//       });
//         console.log(" [GET] RESPONSE GET SEARCH: ", response)

//         const searchResults = await response.json();
//         console.log(' [GET] Search results response: \n', searchResults)

//         if (!response.ok) {
//             throw new Error(searchResults.message || 'Failed to perform search');
//         }

//         // const data = await response.json();
//         // console.log('[GET] Search results:', data);

//         // return NextResponse.json({
//         //     status: 'success',
//         //     results: data.results,
//         //     total_matches: data.total_matches
//         // });

//         console.log("[GET] Search complete");

//         return NextResponse.json({
//             status: 'success',
//             results: searchResults.results.map(result => ({
//                 search_results_id: result.search_results_id,
//                 document_id: result.document_id,
//                 title: result.title,
//                 question: result.question,
//                 keywords: result.keywords,
//                 authors: result.authors,
//                 summary: result.summary,
//                 relevance_score: result.relevance_score,
//                 matching_sections: result.matching_sections.map(section => ({
//                     section_id: section.section_id,
//                     page_number: section.page_number,
//                     start_text: section.start_text,
//                     // Map each match type array
//                     context_matches: section.context_matches?.map(match => ({
//                         text: match.text,
//                         citations: match.citations || []
//                     })) || [],
//                     keyword_matches: section.keyword_matches?.map(match => ({
//                         keyword: match.keyword,
//                         text: match.text
//                     })) || [],
//                     similar_matches: section.similar_matches?.map(match => ({
//                         similar_keyword: match.similar_keyword,
//                         text: match.text
//                     })) || [],
//                     // Keep any remaining metadata
//                     citations: section.citations || []
//                 }))
//             })),
//             metadata: {
//                 total_results: searchResults.results.length,
//                 search_params: {
//                     context: searchResults.results.question,
//                     keywords: searchResults.results.keywords,
//                     document_count: searchResults.length
//                 }
//             }
//         });
//     }


//     export async function DELETE(request) {
//         console.log("Request Delete Route")
//         try {
//             const data = await request.json();
//             const searchId = data.search_result_id;
//             const searchIds = data.search_result_ids;  // New field for multiple files
      
//             console.log("[DELETE]: searchId", searchId )
//             console.log("[DELETE]: searchIds", searchIds)
      
//             const authHeader = request.headers.get('authorization');

//              // Handle single file deletion
//           if (searchId ) {

//             const response = await fetch(DOCUMENT_SEARCH_URL, {
//               method: 'DELETE',
//               headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `${authHeader}` },
//               credentials: 'include',
//               body: JSON.stringify({ search_result_id: searchId  })
//           });
            
//             return NextResponse.json({
//                 status: 'success',
//                 message: 'Search Results Successfully Deleted'
//             });
//         }
//         if (searchIds) {
//             console.log('[DELETE] Attempting to unpin multiple files:', searchIds);
            
//             const results = await Promise.all(
//                 searchIds.map(async (id) => {
//                     try {
//                          await deleteFile(id);
                        
//                          console.log("[DELETE] Deleting ID :", id)
//                          const response = await fetch(DOCUMENT_DELETE_URL, {
//                             method: 'DELETE',
//                             headers: { 
//                               'Content-Type': 'application/json',
//                               'Authorization': `${authHeader}` },
//                             credentials: 'include',
//                             body: JSON.stringify({ search_result_id: id })
//                         });
              
  
  
//                     } catch (error) {
//                         console.error(`Failed to delete file ${id}:`, error);
//                         return false;
//                     }
//                 })
//             );
            
//           const successCount = results.filter(Boolean).length;
  
//             return NextResponse.json({
//                 status: 'success',
//                 message: `Successfully removed ${successCount} of ${searchIds.length} results`,
//                 details: {
//                     total: searchIds.length,
//                     successful: successCount,
//                     failed: searchIds.length - successCount
//                 }
//             });
//         }
        
//         return NextResponse.json({
//             status: 'error',
//             error: 'No result id provided'
//         }, { status: 400 });
        
    
//         } catch (error) {
//             console.error('[DELETE] Search result removal error:', error);
//             return NextResponse.json(
//                 { error: 'Failed to remove search result' },
//                 { status: 500 }
//             );
//         }
//     }




// src/app/api/research/documents/search/route.js
import { NextResponse } from 'next/server';
import config from '../../../../../config';

const DOCUMENT_SEARCH_URL = `${config.backendApiUrl}research/documents/search/`;
const DOCUMENT_SEARCH_STATUS_URL = `${config.backendApiUrl}research/documents/search/check-status/`;

export async function POST(request) {
    console.log("[POST] Starting document search");

    try {
        const data = await request.json();
         
        // Validate required fields
        const { document_ids, context, keywords = [] } = data;
        
        const file_name = document_ids
        if (!document_ids?.length) {
            return NextResponse.json({ 
                status: 'error',
                error: "No documents selected for search" 
            }, { status: 400 });
        }

        if (!context?.trim()) {
            return NextResponse.json({ 
                status: 'error',
                error: "Search context is required" 
            }, { status: 400 });
        }

        // Word count validation for context
        const wordCount = context.trim().split(/\s+/).length;
        if (wordCount > 200) {
            return NextResponse.json({ 
                status: 'error',
                error: "Context must be 200 words or less" 
            }, { status: 400 });
        }
        
        const authHeader = request.headers.get('authorization');
        console.log("[POST] Sending Request to backend:", document_ids);
        
        // Send search request to backend
        const response = await fetch(DOCUMENT_SEARCH_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `${authHeader}` },
            credentials: 'include',
            body: JSON.stringify({
                file_name,
                context: context.trim(),
                keywords: keywords
            })
        });

        const searchResults = await response.json();
        console.log("[POST] SEARCH RESULTS RESPONSE: \n", searchResults);

        if (!response.ok) {
            throw new Error(searchResults.message || 'Failed to perform search');
        }

        console.log("[POST] Search initiated");

        return NextResponse.json({
            status: 'success',
            results: searchResults.results.map(result => ({
                search_results_id: result.search_results_id,
                document_id: result.document_id,
                title: result.title,
                question: result.question,
                keywords: result.keywords,
                authors: result.authors,
                summary: result.summary,
                relevance_score: result.relevance_score,
                matching_sections: result.matching_sections || [],
                processing_status: result.processing_status || 'pending',
                error_message: result.error_message
            })),
            metadata: {
                total_results: searchResults.results.length,
                search_params: {
                    context,
                    keywords,
                    document_count: document_ids.length
                }
            }
        });

    } catch (error) {
        console.error('[POST] Search error:', error);
        return NextResponse.json({ 
            status: 'error',
            error: error.message || 'Failed to perform document search' 
        }, { status: 500 });
    }
}

// New endpoint to check search status
export async function PATCH(request) {
    console.log("[PATCH] Checking search status");

    try {
        const { search_ids } = await request.json();
        
        if (!search_ids?.length) {
            return NextResponse.json({ 
                status: 'error',
                error: "No search IDs provided" 
            }, { status: 400 });
        }

        const authHeader = request.headers.get('authorization');
        
        // Check status from backend
        const response = await fetch(DOCUMENT_SEARCH_STATUS_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `${authHeader}` 
            },
            credentials: 'include',
            body: JSON.stringify({ search_ids })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to check search status');
        }

        return NextResponse.json({
            status: 'success',
            results: data.results.map(result => ({
                search_results_id: result.search_results_id,
                document_id: result.document_id,
                title: result.title,
                question: result.question,
                keywords: result.keywords,
                authors: result.authors,
                summary: result.summary,
                relevance_score: result.relevance_score,
                matching_sections: result.matching_sections || [],
                processing_status: result.processing_status || 'pending',
                error_message: result.error_message
            }))
        });

    } catch (error) {
        console.error('[PATCH] Error checking search status:', error);
        return NextResponse.json({ 
            status: 'error',
            error: error.message || 'Failed to check search status' 
        }, { status: 500 });
    }
}

export async function GET(request) {
    console.log("[GET] Fetching documents search results ");

    const authHeader = request.headers.get('authorization');
    console.log("[GET] Auth header:", authHeader);
    
    try {
        const response = await fetch(DOCUMENT_SEARCH_URL, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${authHeader}` },
          credentials: 'include'
        });
        console.log(" [GET] RESPONSE GET SEARCH: ", response)

        if (!response.ok) {
            throw new Error(`Failed to fetch search results: ${response.statusText}`);
        }

        const searchResults = await response.json();
        console.log(' [GET] Search results response: \n', searchResults)

        console.log("[GET] Search complete");

        return NextResponse.json({
            status: 'success',
            results: searchResults.results.map(result => ({
                search_results_id: result.search_results_id,
                document_id: result.document_id,
                title: result.title,
                question: result.question,
                keywords: result.keywords,
                authors: result.authors,
                summary: result.summary,
                relevance_score: result.relevance_score,
                processing_status: result.processing_status,
                matching_sections: result.matching_sections.map(section => ({
                    section_id: section.section_id,
                    page_number: section.page_number,
                    start_text: section.start_text,
                    // Map each match type array
                    context_matches: section.context_matches?.map(match => ({
                        text: match.text,
                        citations: match.citations || []
                    })) || [],
                    keyword_matches: section.keyword_matches?.map(match => ({
                        keyword: match.keyword,
                        text: match.text
                    })) || [],
                    similar_matches: section.similar_matches?.map(match => ({
                        similar_keyword: match.similar_keyword,
                        text: match.text
                    })) || [],
                    // Keep any remaining metadata
                    citations: section.citations || []
                }))
            })),
            metadata: {
                total_results: searchResults.results.length
            }
        });
    } catch (error) {
        console.error('[GET] Error fetching search results:', error);
        return NextResponse.json({ 
            status: 'error',
            error: error.message || 'Failed to fetch search results' 
        }, { status: 500 });
    }
}

export async function DELETE(request) {
    console.log("Request Delete Route")
    try {
        const data = await request.json();
        const searchId = data.search_result_id;
        const searchIds = data.search_result_ids;  // New field for multiple files
  
        console.log("[DELETE]: searchId", searchId )
        console.log("[DELETE]: searchIds", searchIds)
  
        const authHeader = request.headers.get('authorization');

        // Handle single file deletion
        if (searchId) {
            const response = await fetch(DOCUMENT_SEARCH_URL, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `${authHeader}` },
                credentials: 'include',
                body: JSON.stringify({ search_result_id: searchId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete search result');
            }
            
            return NextResponse.json({
                status: 'success',
                message: 'Search Results Successfully Deleted'
            });
        }
    
        if (searchIds) {
            console.log('[DELETE] Attempting to delete multiple search results:', searchIds);
            
            const results = await Promise.all(
                searchIds.map(async (id) => {
                    try {
                        const response = await fetch(DOCUMENT_SEARCH_URL, {
                            method: 'DELETE',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `${authHeader}` },
                            credentials: 'include',
                            body: JSON.stringify({ search_result_id: id })
                        });
                        
                        return response.ok;
                    } catch (error) {
                        console.error(`Failed to delete search result ${id}:`, error);
                        return false;
                    }
                })
            );
            
            const successCount = results.filter(Boolean).length;
  
            return NextResponse.json({
                status: 'success',
                message: `Successfully removed ${successCount} of ${searchIds.length} results`,
                details: {
                    total: searchIds.length,
                    successful: successCount,
                    failed: searchIds.length - successCount
                }
            });
        }
    
        return NextResponse.json({
            status: 'error',
            error: 'No result id provided'
        }, { status: 400 });
    
    } catch (error) {
        console.error('[DELETE] Search result removal error:', error);
        return NextResponse.json(
            { error: 'Failed to remove search result' },
            { status: 500 }
        );
    }
}