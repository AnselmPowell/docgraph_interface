// src/app/api/research/documents/search/route.js

import { NextResponse } from 'next/server';
import config from '../../../../../config';

const DOCUMENT_SEARCH_URL = `${config.backendApiUrl}research/documents/search/`;

export async function POST(request) {
    console.log("[POST] Starting document search");
    
    try {
        const data = await request.json();
         
        // Validate required fields
        const { document_ids, context, theme, keywords = [] } = data;
        
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

        if (!theme) {
            return NextResponse.json({ 
                status: 'error',
                error: "Theme selection is required" 
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
                document_ids,
                context: context.trim(),
                theme,
                keywords: keywords.filter(Boolean)
            })
        });

        const searchResults = await response.json();

        if (!response.ok) {
            throw new Error(searchResults.message || 'Failed to perform search');
        }

        console.log("[POST] Search complete");

        return NextResponse.json({
            status: 'success',
            results: searchResults.results.map(result => ({
                document_id: result.document_id,
                title: result.title,
                authors: result.authors,
                summary: result.summary,
                relevance_score: result.relevance_score,
                matching_sections: result.matching_sections.map(section => ({
                    section_id: section.section_id,
                    page_number: section.page_number,
                    content: section.content,
                    matching_context: section.matching_context,
                    matching_theme: section.matching_theme,
                    matching_keywords: section.matching_keywords,
                    citations: section.citations,
                    context_citations: section.context_citations || [],
                    theme_citations: section.theme_citations || []
                }))
            })),
            metadata: {
                total_results: searchResults.results.length,
                search_params: {
                    context,
                    theme,
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