// src/app/components/research/Toolbar/SearchResults.client.jsx
'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp,
  Copy,
  Plus,
  Sparkles,
  Loader2,
  X,
  BookOpen,
  Search,
  FileText
} from 'lucide-react'; 

export function SearchResults({ 
  documents,
  results, 
  onSaveNote, 
  onViewSearchResults,
  isLoading, 
  onRemoveResult,
  onRemoveAllResult,
  isToolbarExpanded 
}) {
  const [expandedResult, setExpandedResult] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const [savedSection, setSavedSection] = useState(null);
  const [selectedResults, setSelectedResults] = useState([]);
  const [activeMatchType, setActiveMatchType] = useState('all');// 'all', 'context', 'keywords'

  console.log("Search results: ", results)

  if (!results?.length && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-tertiary">
        No search results yet
      </div>
    );
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedResults.length === results.length) {
      setSelectedResults([]);
    } else {
      setSelectedResults(results.map(result => result.search_results_id));
    }
  };

  // Handle single selection
  const handleSelect = (resultId) => {
    setSelectedResults(prev => {
      if (prev.includes(resultId)) {
        return prev.filter(id => id !== resultId);
      }
      return [...prev, resultId];
    });
  };

   // Handle batch deletion
   const handleRemoveSelected = async () => {
    try {
      // Call remove function for each selected result
      await Promise.all(selectedResults.map(resultId => onRemoveResult(resultId)));
      setSelectedResults([]); // Clear selection after deletion
      
    } catch (error) {
      toast.error('Failed to remove selected results');
    }
  };


  // Handlers
  const handleCopyText = (text, sectionId) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveNote = (section, sectionId) => {
    onSaveNote(section);
    setSavedSection(sectionId);
    setTimeout(() => setSavedSection(null), 2000);
  };

  return (
    <div className="relative h-full  overflow-y-auto">
       {/* Header */}
       <div className="shrink-0 px-4 pt-4 border-tertiary/10 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {isLoading ? "Analysing..." : "Search Results"}
          </h2>
          <div className="flex items-center gap-3">
            {/* Selection Controls - Only show when results exist */}
            {results.length > 0 && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-tertiary hover:text-primary transition-colors"
                >
                  {selectedResults.length === results.length ? 'Deselect all' : 'Select all'}
                </button>
                {selectedResults.length > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove selected ({selectedResults.length})
                  </button>
                )}
              </>
            )}
            <span className="text-sm text-tertiary">
              {results.length} {results.length === 1 ? 'document' : 'documents'}
            </span>
          </div>
        </div>

        {/* Match Type Filters */}
        <div className="sticky top-30 z-50 bg-white/80 py-2">
          <div className="flex gap-2 text-sm">
            {['all', 'context', 'keywords'].map(type => (
              <button
                key={type}
                onClick={() => setActiveMatchType(type)}
                className={`px-3 py-1 rounded-full transition-colors
                  ${activeMatchType === type 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-tertiary hover:text-primary hover:bg-tertiary/5'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="h-full flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary/80" />
            <p className="text-sm text-tertiary">
              Searching through selected documents...
            </p>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="">
        {results.map((result, idx) => (
          <DocumentResult
            key={result.question + result.title + idx}
            result={result}
            isExpanded={expandedResult === result.search_results_id}
            onExpand={() => setExpandedResult(
              expandedResult === result.search_results_id ? null : result.search_results_id
            )}
            onRemove={onRemoveResult}
            documents={documents}
            current_document_id={result.document_id}
            onViewDocument={onViewSearchResults}
            onCopyText={handleCopyText}
            onSaveNote={handleSaveNote}
            copiedSection={copiedSection}
            savedSection={savedSection}
            activeMatchType={activeMatchType}
            isToolbarExpanded={isToolbarExpanded}
            // Add selection props
            isSelected={selectedResults.includes(result.search_results_id)}
            onSelect={() => handleSelect(result.search_results_id)}
          />
        ))}
      </div>
    </div>
  );
}

//  Document Result Component
function DocumentResult({
  result,
  isExpanded,
  onExpand,
  onRemove,
  onViewDocument,
  documents,
  current_document_id,
  onCopyText,
  onSaveNote,
  copiedSection,
  savedSection,
  activeMatchType,
  isToolbarExpanded
}) {
  return (
    <div className=" pb-3 ">
      {/* Document Header */}
      <div className="flex group relative">
        <button
          onClick={onExpand}
          className="w-full pt-3 p-2 text-left hover:bg-tertiary/5 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
            <h4 className="font-medium text-primary text-sm truncate pr-4">
              {isToolbarExpanded ? result.title.slice(0, 100) : result.title.slice(0, 45)}
            </h4>
            <div className='flex gap-1 items-center py-1 '>
              <Search className="w-3 h-3" />
              <h4 className="font-small text-primary text-sm truncate pr-4">
                {isToolbarExpanded ? result.question.slice(0, 80): result.question.slice(0, 38)}
              </h4>
            </div>
            </div>
          </div>

          {/* Match Statistics */}
          <div className="flex items-center  gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {Math.round(result.relevance_score)}% Match
            </span>
            
            {/* Match Type Counts */}
            <div className="flex gap-2 text-xs text-tertiary">
              {result.matching_sections.length > 0 && (
                <div className="flex items-center gap-2">
                    <span>
                    {activeMatchType === "all"
                      ? result.matching_sections.reduce(
                          (total, section) =>
                            total +
                            (section.context_matches?.length || 0) +
                            (section.keyword_matches?.length || 0) +
                            (section.similar_matches?.length || 0),
                          0
                        )
                      : activeMatchType === "context"
                      ? result.matching_sections.reduce(
                          (total, section) => total + (section.context_matches?.length || 0),
                          0
                        )
                      : result.matching_sections.reduce(
                          (total, section) =>
                            total + (section.keyword_matches?.length || 0) + (section.similar_matches?.length || 0),
                          0
                        )}{" "}
                    matches
                  </span>
                  <span className="text-tertiary/50">•</span>
                  <span>From {result.matching_sections.length} Pages</span>
                </div>
              )}
              {isExpanded ? 
              <ChevronUp className="w-5 h-5 text-tertiary" /> : 
              <ChevronDown className="w-5 h-5 text-tertiary" />
              }
            </div>
          </div>
        </button>
         {/* Remove Button */}
         <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(result.search_results_id);
              }}
              className="p-1.5 mt-6 rounded-md text-tertiary hover:text-primary 
                hover:bg-tertiary/10 mr-2 opacity-0 group-hover:opacity-100
                transition-all duration-75"
              title="Remove result"
            >
              <X className="w-6 h-6" />
            </button>

      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-tertiary/5 ">
          {result.matching_sections.map((section, idx) => (
            <div key={idx} className="p-4 space-y-3">
              {/* Section Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-tertiary">Page {section.page_number}</span>
                </div>
              </div>

              {/* Context Matches */}
              {(activeMatchType === 'all' || activeMatchType === 'context') && 
                section.context_matches?.map((match, midx) => (
                  <MatchSection
                    key={`context-${midx}`}
                    type="context"
                    content={match.text}
                    citations={match.citations}
                    sectionId={section.section_id}
                    pageNumber={section.page_number}
                    onViewDocument={onViewDocument}
                    documents={documents}
                    current_document_id={current_document_id}
                    onCopy={onCopyText}
                    onSave={onSaveNote}
                    isCopied={copiedSection === section.section_id}
                    isSaved={savedSection === section.section_id}
                  />
                ))
              }

              {/* Keyword Matches */}
              {(activeMatchType === 'all' || activeMatchType === 'keywords') && 
                section.keyword_matches?.map((match, midx) => (
                  <MatchSection
                    key={`keyword-${midx}`}
                    type="keyword"
                    content={match.text}
                    keyword={match.keyword}
                    sectionId={section.section_id}
                    pageNumber={section.page_number}
                    onViewDocument={onViewDocument}
                    documents={documents}
                    current_document_id={current_document_id}
                    onCopy={onCopyText}
                    onSave={onSaveNote}
                    isCopied={copiedSection === section.section_id}
                    isSaved={savedSection === section.section_id}
                  />
                ))
              }
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Match Section Component for both context and keyword matches
function MatchSection({ 
  type, 
  content, 
  citations, 
  keyword,
  sectionId, 
  pageNumber,
  onViewDocument,
  documents,
  current_document_id,
  onCopy, 
  onSave,
  isCopied,
  isSaved 
}) {
  return (
    <div className="relative group border-b border-tertiary/10 pb-3">
      {/* Action Buttons */}
      <div className="absolute top-4 right-0 flex items-center gap-2">
        <button
            onClick={() =>{
              const document = documents.filter(file => file.document_id == current_document_id)
              onViewDocument(content.slice(0, 25), ...document, pageNumber)}
            } 
            className=" text-xs hover:underline flex items-center gap-1 'hover:bg-tertiary/10 text-tertiary opacity-0 group-hover:opacity-100"
          >
            View
          </button>
          <button
            onClick={() => onCopy(content, sectionId)}
            className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-black
              ${isCopied 
                ? 'bg-green-500/10 ' 
                : 'hover:bg-tertiary/10 opacity-0 group-hover:opacity-100'}`}
          >
            <Copy className="w-4 h-4" />
            {isCopied && <span className="text-xs">Copied!</span>}
          </button>
          <button
            onClick={() => onSave(content, sectionId)}
            className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-black
              ${isSaved 
                ? 'bg-blue-500/10' 
                : 'hover:bg-tertiary/10  opacity-0 group-hover:opacity-100'}`}
          >
            <Plus className="w-4 h-4" />
            {isSaved && <span className="text-xs">Saved!</span>}
          </button>
        </div>
      <div className="bg-background rounded-md pt-10 ">
        {/* Match Type Indicator */}
        <div className="mb-2">
          <span className={`text-xs px-2 py-1 rounded-full text-gray-800
            ${type === 'context' ? 'bg-blue-500/10 ' : 'bg-green-500/10 '}`}
          >
            {type === 'context' ? 'Context Match' : 'Keyword Match'}
          </span>
          {keyword && (
            <span className="ml-2 text-xs text-tertiary">
              Keyword: {keyword}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="text-sm text-secondary">
          {content}
        </div>
      </div>
      {/* Citations Panel */}
              
      {citations?.length > 0 && (
                <div className="mt-2 pt-2 ">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-tertiary" />
                    <span className="text-xs text-tertiary">Citations</span>
                  </div>
                  <div className="">
                    {citations.map((citation, cidx) => (
                      <div key={cidx} className="mb-3">
                        {/* Citation Text */}
                        <div className="text-sm text-secondary mb-2">
                          {citation.text}
                        </div>
                        
                        {/* Reference List */}
                        {citation.references?.map((ref, refIdx) => (
                          <div key={refIdx} 
                            className="text-xs text-tertiary mb-1 pl-3 border-l border-tertiary/20">
                            {ref.text}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
   
    </div>
  );
}