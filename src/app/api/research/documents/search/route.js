// // src/app/api/research/documents/search/route.js


import { NextResponse } from 'next/server';
import config from '../../../../../config';

const DOCUMENT_SEARCH_URL = `${config.backendApiUrl}research/documents/search/`;

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

        // Send search request to backend
        const response = await fetch(DOCUMENT_SEARCH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                file_name,
                context: context.trim(),
                keywords: keywords.filter(Boolean)
            })
        });

        const searchResults = await response.json();
        console.log('search results \n', searchResults)

        if (!response.ok) {
            throw new Error(searchResults.message || 'Failed to perform search');
        }

        console.log("[POST] Search complete");

        return NextResponse.json({
            status: 'success',
            results: searchResults.results.map(result => ({
                document_id: result.document_id,
                title: result.title,
                question: result.question,
                keywords: result.keywords,
                authors: result.authors,
                summary: result.summary,
                relevance_score: result.relevance_score,
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














