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
  AlertCircle,
  Filter,
  Check,
  FileText
} from 'lucide-react'; 
import { DeleteConfirmationModal } from './DeleteConfirmationModal.client';
import { toast } from '../../messages/Toast.client';

export function SearchResults({ 
  documents,
  results, 
  pendingSearches = [], // Add this prop with default value
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
  const [activeMatchType, setActiveMatchType] = useState('all');
  const [resultToDelete, setResultToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  // Add filter state
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Extract unique document titles for filter dropdown
  const documentTitles = results && results.length > 0
    ? ['all', ...new Set(results.map(result => result.title))]
    : ['all'];
  
  // Filter results based on selected filter
  const filteredResults = selectedFilter === 'all'
    ? results
    : results.filter(result => result.title === selectedFilter);
  
  // Function to truncate long titles
  const truncateTitle = (title, maxLength = 20) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + '...'
      : title;
  };


  // Empty state - no results and not loading
  if (!results?.length && !pendingSearches?.length && !isLoading) {
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

  // Handle deletion confirmation
  const handleOpenDeleteModal = (resultId) => {
    setResultToDelete(resultId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (resultToDelete) {
      await onRemoveResult(resultToDelete);
      setResultToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Handle batch deletion
  const handleRemoveSelected = async () => {
    try {
      await Promise.all(selectedResults.map(resultId => onRemoveResult(resultId)));
      setSelectedResults([]);
    } catch (error) {
      toast.error('Failed to remove selected results');
    }
  };



  const handleCopyText = (text, document, citations, sectionId) => {
    // Format content with citations
    let textToCopy = text;
    
    // Add citations if available
    if (citations && citations.length > 0) {
      textToCopy += '\n\n';
      citations.forEach((citation) => {
        
        // Add reference details if available
        if (citation.references && citation.references.length > 0) {
          citation.references.forEach((ref) => {
            textToCopy += `${ref.text}\n`;
          });
        }
      });
    } else {
      textToCopy += `\n\n${document.citation}\n`;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };


  
  const handleSaveNote = (content, pageNumber, document, citations, sectionId) => {
    // Create structured note
    const note = {
      id: Date.now(),
      title: document?.title || "Untitled Document",
      pageNumber: pageNumber,
      content: content,
      citations: citations?.length > 0 ? citations : (document?.citation ? [{ 

        text: document.citation,
        type: "document_citation",
        references: []
      }] : []),
      source: document?.title || "Unknown Source",
      timestamp: new Date().toISOString()
    };
    
    // Pass the structured note to parent handler
    onSaveNote(note);
    console.log("Savenote:", note)
    // Only set the specific sectionId that was clicked
    setSavedSection(sectionId);
    setTimeout(() => setSavedSection(null), 2000);
  };

  // Count pending documents
  const pendingCount = pendingSearches?.length || 0;
  
  return (
    <div className="relative  overflow-y-auto">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 border-tertiary/10 bg-background/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {isLoading ? "Analysing..." : "Search Results"}
        </h2>
      

        <div className="flex relative items-center gap-2 ">
          
            {/* Add Filter Dropdown */}
            {results.length > 1 && (
            <div className="relative filter-dropdown z-[500]">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="text-sm flex items-center gap-1 text-tertiary hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-tertiary/5 active:translate-y-[0.5px] active:scale-95"
                title="Filter by document"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">{selectedFilter === 'all' ? 'All documents' : truncateTitle(selectedFilter)}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showFilter && (
                <div className="fixed right-12 mt-2 bg-white shadow-xl rounded-md border border-tertiary/20 py-1 w-56 max-h-60 overflow-y-auto animate-in fade-in duration-100">
                  {documentTitles.map(title => (
                    <button
                      key={title}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 active:translate-y-[0.5px] active:scale-95
                        ${selectedFilter === title 
                          ? 'text-primary bg-primary/10 font-medium' 
                          : 'text-secondary hover:text-primary'}`}
                      onClick={() => {
                        setSelectedFilter(title);
                        setShowFilter(false);
                      }}
                    >
                      {title === 'all' ? 'All documents' : truncateTitle(title)}
                    </button> 
                  ))}
            
              </div>
              )}
            </div>

          )}

            {/* Selection Controls - Only show when results exist */}
            {results.length > 0 && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-tertiary hover:text-primary transition-colors active:translate-y-[0.5px] active:scale-95"
                >
                  {selectedResults.length === results.length ? 'Deselect all' : 'Select all'}
                </button>
                {selectedResults.length > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors active:translate-y-[0.5px] active:scale-95"
                  >
                    Remove all
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        </div>

        {/* Match Type Filters - Only show when we have results */}
        {results.length > 0 && (
          <div className=" top-30 z-30 py-4">
            <div className="flex gap-2 text-sm">
              {['all', 'context', 'keywords'].map(type => (
                <button
                  key={type}
                  onClick={() => setActiveMatchType(type)}
                  className={`px-3 py-1 rounded-full transition-colors active:translate-y-[0.5px] active:scale-95
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
        )}
      

      {/* Main Search Status Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-6 border-b border-tertiary/10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-tertiary text-center">
              Searching documents...
            </p>
          </div>
        </div>
      )}

      {/* Pending Documents Display */}
      {pendingCount > 0 && (
        <div className="px-4 py-3 border-b border-tertiary/10">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <h3 className="text-sm font-medium text-primary">
              Searching {pendingCount} Document{pendingCount !== 1 ? 's' : ''}
            </h3>
          </div>
          
          <div className="mt-2">
            {pendingSearches.map(search => (
              <div 
                key={search.search_results_id}
                className="flex items-center justify-between p-1 bg-tertiary/5 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary truncate">
                    {search.title}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 ml-2 text-xs rounded-full ">
                  <span>
                    Extracting results...
                  </span>
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="relative z-10">
        {results.length > 0 && pendingCount > 0 ? (
          
          <div className="pt-3">
            <h3 className="text-sm font-medium text-primary mb-2">
            Completed Results
            </h3>
          </div>
        ) : null }
        
        {filteredResults.map((result, idx) => (
        <DocumentResult
          key={result.search_results_id || (result.question + result.title + idx)}
          result={result}
          isExpanded={expandedResult === result.search_results_id}
          onExpand={() => setExpandedResult(
            expandedResult === result.search_results_id ? null : result.search_results_id
          )}
          onOpenDeleteModal={handleOpenDeleteModal}
          documents={documents}
          current_document_id={result.document_id}
          onViewDocument={onViewSearchResults}
          onCopyText={handleCopyText}
          onSaveNote={handleSaveNote}
          copiedSection={copiedSection}
          savedSection={savedSection}
          activeMatchType={activeMatchType}
          isToolbarExpanded={isToolbarExpanded}
          isSelected={selectedResults.includes(result.search_results_id)}
          onSelect={() => handleSelect(result.search_results_id)}
        />
      ))}
      </div>

      {/* Empty Results with Pending Searches */}
      {results.length === 0 && pendingCount > 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center p-6 mt-4">
          <p className="text-sm text-tertiary text-center">
            Your search results will appear here once processing is complete.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Search Result"
        message="Are you sure you want to delete this search result? This action cannot be undone."
      />
    </div>
  );
}




//  Document Result Component
function DocumentResult({
  result,
  isExpanded,
  onExpand,
  onOpenDeleteModal,
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
  // Add loading/processing status display
  const isPending = result.processing_status === 'pending' || result.processing_status === 'processing';
  const isFailed = result.processing_status === 'failed';
  
  // If the search is still processing and not expanded, show minimal info
  if (isPending && !isExpanded) {
    return (
      <div className="pb-3">
        {/* Document Header */}
        <div className="flex group relative">
          <button
            onClick={onExpand}
            className="w-full pt-3 p-2 text-left hover:bg-tertiary/5 transition-colors active:translate-y-[0.5px] active:scale-95"
          >
            <div className="flex items-center justify-between mb-1">
              <div>
                <h4 className="font-medium text-primary text-sm truncate pr-4">
                  {isToolbarExpanded ? result.title.slice(0, 100) : result.title.slice(0, 64)}
                </h4>
                <div className='flex gap-1 items-center py-1 '>
                  <Search className="w-3 h-3" />
                  <h4 className="font-small text-primary text-sm truncate pr-4">
                    {isToolbarExpanded ? result.question.slice(0, 80): result.question.slice(0, 58)}
                  </h4>
                </div>
              </div>
            </div>

            {/* Processing Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                {result.processing_status === 'pending' ? 'Pending' : 'Processing'}
              </span>
              {isExpanded ? 
              <ChevronUp className="w-5 h-5 text-tertiary" /> : 
              <ChevronDown className="w-5 h-5 text-tertiary" />
              }
            </div>
          </button>
        </div>
      </div>
    );
  }
  
  // If the search failed, show error state
  if (isFailed) {
    return (
      <div className="pb-3">
        {/* Document Header */}
        <div className="flex group relative">
          <button
            onClick={onExpand}
            className="w-full pt-3 p-2 text-left hover:bg-tertiary/5 transition-colors active:translate-y-[0.5px] active:scale-95"
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

            {/* Error Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Search Failed
              </span>
              {isExpanded ? 
              <ChevronUp className="w-5 h-5 text-tertiary" /> : 
              <ChevronDown className="w-5 h-5 text-tertiary" />
              }
            </div>
          </button>
          
          {/* Remove Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDeleteModal(result.search_results_id);
            }}
            className="p-1.5 mt-6 rounded-md text-tertiary hover:text-primary 
              hover:bg-tertiary/10 mr-2 opacity-0 group-hover:opacity-100
              transition-all duration-75 active:translate-y-[0.5px] active:scale-95"
            title="Remove result"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Error Details when expanded */}
        {isExpanded && (
          <div className="p-4 bg-tertiary/5">
            <p className="text-sm text-red-500">
              {result.error_message || "Search failed. Please try again."}
            </p>
          </div>
        )}
      </div>
    );
  }
  
  // For pending searches that are expanded, show a loading indicator
  if (isPending && isExpanded) {
    return (
      <div className="pb-3">
        {/* Document Header */}
        <div className="flex group relative">
          <button
            onClick={onExpand}
            className="w-full pt-3 p-2 text-left hover:bg-tertiary/5 transition-colors active:translate-y-[0.5px] active:scale-95"
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

            {/* Processing Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                {result.processing_status === 'pending' ? 'Pending' : 'Processing'}
              </span>
              {isExpanded ? 
              <ChevronUp className="w-5 h-5 text-tertiary" /> : 
              <ChevronDown className="w-5 h-5 text-tertiary" />
              }
            </div>
          </button>
        </div>
        
        {/* Loading indicator in expanded view */}
        <div className="bg-tertiary/5 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-tertiary">Searching document content...</p>
          </div>
        </div>
      </div>
    );
  }
  // Filter sections based on activeMatchType to only show relevant ones
  const filteredSections = result.matching_sections.filter(section => {
    if (activeMatchType === 'all') {
      return (
        (section.context_matches && section.context_matches.length > 0) ||
        (section.keyword_matches && section.keyword_matches.length > 0) ||
        (section.similar_matches && section.similar_matches.length > 0)
      );
    } else if (activeMatchType === 'context') {
      return section.context_matches && section.context_matches.length > 0;
    } else if (activeMatchType === 'keywords') {
      return (
        (section.keyword_matches && section.keyword_matches.length > 0) ||
        (section.similar_matches && section.similar_matches.length > 0)
      );
    }
    return false;
  });

  // If no relevant sections after filtering, don't show anything
  if (filteredSections.length === 0 && isExpanded) {
    return (
      <div className="pb-3">
        {/* Document Header */}
        <div className="flex group relative">
          <button
            onClick={onExpand}
            className="w-full pt-3 p-2 text-left hover:bg-tertiary/5 transition-colors active:translate-y-[0.5px] active:scale-95"
          >
            {/* Header content same as below */}
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
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {Math.round(result.relevance_score)}% Match
              </span>
              
              {/* Match Type Counts */}
              <div className="flex gap-2 text-xs text-tertiary">
                <span>No matching content for the selected filter</span>
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
              onOpenDeleteModal(result.search_results_id);
            }}
            className="p-1.5 mt-6 rounded-md text-tertiary hover:text-primary 
              hover:bg-tertiary/10 mr-2 opacity-0 group-hover:opacity-100
              transition-all duration-75 active:translate-y-[0.5px] active:scale-95"
            title="Remove result"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-3">
      {/* Document Header */}
      <div className="flex group relative">
        <button
          onClick={onExpand}
          className="w-full pt-3 p-2 text-left hover:bg-tertiary/5 transition-colors active:translate-y-[0.5px] active:scale-95"
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
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {Math.round(result.relevance_score)}% Match
            </span>
            
            {/* Match Type Counts */}
            <div className="flex gap-2 text-xs text-tertiary">
              {filteredSections.length > 0 && (
                <div className="flex items-center gap-2">
                    <span>
                    {activeMatchType === "all"
                      ? filteredSections.reduce(
                          (total, section) =>
                            total +
                            (section.context_matches?.length || 0) +
                            (section.keyword_matches?.length || 0) +
                            (section.similar_matches?.length || 0),
                          0
                        )
                      : activeMatchType === "context"
                      ? filteredSections.reduce(
                          (total, section) => total + (section.context_matches?.length || 0),
                          0
                        )
                      : filteredSections.reduce(
                          (total, section) =>
                            total + (section.keyword_matches?.length || 0) + (section.similar_matches?.length || 0),
                          0
                        )}{" "}
                    matches
                  </span>
                  <span className="text-tertiary/50">•</span>
                  <span>From {filteredSections.length} Pages</span>
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
              onOpenDeleteModal(result.search_results_id);
            }}
            className="p-1.5 mt-6 rounded-md text-tertiary hover:text-primary 
              hover:bg-tertiary/10 mr-2 opacity-0 group-hover:opacity-100
              transition-all duration-75 active:translate-y-[0.5px] active:scale-95"
            title="Remove result"
          >
            <X className="w-6 h-6" />
          </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-tertiary/5">
          {filteredSections.map((section, idx) => {
            // Only render sections with relevant matches based on activeMatchType
            const hasContextMatches = section.context_matches && section.context_matches.length > 0;
            const hasKeywordMatches = section.keyword_matches && section.keyword_matches.length > 0;
            const hasSimilarMatches = section.similar_matches && section.similar_matches.length > 0;
            
            // Skip rendering this section if it has no relevant matches
            if ((activeMatchType === 'context' && !hasContextMatches) ||
                (activeMatchType === 'keywords' && !hasKeywordMatches && !hasSimilarMatches) ||
                (activeMatchType === 'all' && !hasContextMatches && !hasKeywordMatches && !hasSimilarMatches)) {
              return null;
            }
           
            
            return (
              <div key={idx} className="px-4 py-1 space-y-3">
                {/* Section Header */}
                
                
                
                {/* Context Matches */}
                {(activeMatchType === 'all' || activeMatchType === 'context') && 
                  hasContextMatches && 
                  section.context_matches.map((match, midx) => (
                    <MatchSection
                      key={`context-${midx}`}
                      type="context"
                      section={section}
                      content={match.text}
                      citations={match.citations}
                      sectionId={`${section.sectionId}-${midx}-${match.text.slice(0, 20)}`}
                      pageNumber={section.page_number}
                      onViewDocument={onViewDocument}
                      documents={documents}
                      current_document_id={current_document_id}
                      onCopyNote={onCopyText}
                      onSaveNote={onSaveNote}
                      isCopied={copiedSection === `${section.sectionId}-${midx}-${match.text.slice(0, 20)}`}  
                      isSaved={savedSection === `${section.sectionId}-${midx}-${match.text.slice(0, 20)}`} 
                    />
                  ))
                }


                {/* Keyword Matches */}
                {(activeMatchType === 'all' || activeMatchType === 'keywords') && 
                  hasKeywordMatches  &&
                  section.keyword_matches.map((match, midx) => (
                    <MatchSection
                      key={`keyword-${midx}`}
                      type="keyword"
                      section={section}
                      content={match.text}
                      keyword={match.keyword}
                      sectionId={`${section.sectionId}-${midx}-${match.text.slice(0, 20)}`}
                
                      pageNumber={section.page_number}
                      onViewDocument={onViewDocument}
                      documents={documents}
                      current_document_id={current_document_id}
                      onCopyNote={onCopyText}
                      onSaveNote={onSaveNote}
                      isCopied={copiedSection === `${section.sectionId}-${midx}-${match.text.slice(0, 20)}`}  
                      isSaved={savedSection === `${section.sectionId}-${midx}-${match.text.slice(0, 20)}`} 
                       
                    />
                  ))
                }
                
              </div>
            );
          })}
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
    section,
    sectionId,
    pageNumber,
    onViewDocument,
    documents,
    current_document_id,
    onCopyNote, 
    onSaveNote,
    isCopied,
    isSaved 
  }) {
    // Create a unique ID for this specific match section combination
    
    // Find the current document object
    const currentDocument = documents.find(doc => doc.document_id === current_document_id) || {};

    
    return (
      <div className="relative group border-b border-tertiary/10 pt-2 pb-5">
        <div className="flex items-center my-3 justify-between text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-tertiary">Page {section.page_number}</span>
              </div>
            </div>
       {/* Action Buttons */}
        <div className="absolute top-3 right-0 flex items-center gap-2">
          {/* View button */}
          <button
            onClick={() => {
              onViewDocument(content.slice(0, 25), currentDocument, pageNumber);
            }}   
            className="text-sm hover:underline flex items-center gap-1 hover:bg-tertiary/10 text-tertiary opacity-0 group-hover:opacity-100 active:translate-y-[0.5px] active:scale-95"
            title="View in document"  // Added tooltip
          > 
            View
          </button>
          
          {/* Copy button */}
          <button
            onClick={() => onCopyNote(content, currentDocument, citations, sectionId)} 
            className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-black opacity-0 group-hover:opacity-100 active:translate-y-[0.5px] active:scale-95`}
            title="Copy"  
          >
            {isCopied ? ( 
              <span className="text-xs font-semibold">Copied</span>
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          
          {/* Save note button with icon instead of text */}
          <button
            onClick={() => onSaveNote(content, pageNumber, currentDocument, citations, sectionId)} 
            className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-black  active:translate-y-[0.5px] active:scale-95`}
            title="Save as note"  // Added tooltip
          >
            {isSaved ? ( 
              <span className="text-xs font-semibold">Saved</span>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
              


      <div className="bg-background rounded-md pt-3 ">
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
        <div className="text-s text-secondary my-3">
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







