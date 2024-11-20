// src/app/components/research/ResultsSection.client.jsx
'use client';

import { useState, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Bookmark,
  BookmarkX,
  Link2,
  Eye,
  Search,
  ArrowUpDown,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from '../ui/Toast.client';

export function ResultsSection({ 
  results, 
  onRemoveDocument,
  onSaveDocument,
  onToggleViewer 
}) {
  const [sortBy, setSortBy] = useState('relevance');
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [showConnections, setShowConnections] = useState(false);

  // Sort documents based on selected criteria
  const sortedDocuments = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.relevance_score - a.relevance_score;
      case 'matches':
        return b.total_matches - a.total_matches;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Format relevance score for display
  const formatRelevanceScore = (score) => {
    const percentage = Math.round(score);
    let color = 'text-red-500';
    if (percentage >= 80) color = 'text-green-500';
    else if (percentage >= 60) color = 'text-yellow-500';
    return { percentage, color };
  };

  // Handle document save/remove
  const handleDocumentAction = useCallback(async (documentId, action) => {
    try {
      if (action === 'save') {
        await onSaveDocument(documentId);
        toast.success('Document saved successfully');
      } else {
        await onRemoveDocument(documentId);
        toast.success('Document removed successfully');
      }
    } catch (error) {
      toast.error(`Failed to ${action} document`);
    }
  }, [onSaveDocument, onRemoveDocument]);

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-primary">
          Analysis Results ({results.length} Documents)
        </h3>
        
        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-tertiary">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-tertiary/20 rounded-md px-2 py-1 bg-background"
          >
            <option value="relevance">Relevance</option>
            <option value="matches">Matches</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {sortedDocuments.map((document) => {
          const { percentage, color } = formatRelevanceScore(document.relevance_score);
          const isExpanded = expandedDocId === document.document_id;

          return (
            <div 
              key={document.document_id}
              className="border border-tertiary/10 rounded-lg overflow-hidden bg-background"
            >
              {/* Document Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-5 h-5 text-tertiary" />
                  <div>
                    <h4 className="font-medium text-primary">{document.title}</h4>
                    <p className="text-sm text-tertiary">
                      {document.authors.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Relevance Score */}
                  <div className="text-right">
                    <div className={`text-lg font-bold ${color}`}>
                      {percentage}%
                    </div>
                    <div className="text-xs text-tertiary">
                      Relevance
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDocumentAction(document.document_id, 'save')}
                      className="p-2 hover:bg-tertiary/10 rounded-md transition-colors"
                      title="Save document"
                    >
                      <Bookmark className="w-5 h-5 text-tertiary" />
                    </button>
                    <button
                      onClick={() => onToggleViewer(document.document_id)}
                      className="p-2 hover:bg-tertiary/10 rounded-md transition-colors"
                      title="View document"
                    >
                      <Eye className="w-5 h-5 text-tertiary" />
                    </button>
                    <button
                      onClick={() => setExpandedDocId(isExpanded ? null : document.document_id)}
                      className="p-2 hover:bg-tertiary/10 rounded-md transition-colors"
                      title="Show details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-tertiary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-tertiary" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-tertiary/10 p-4 space-y-4">
                  {/* Match Statistics */}
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(document.total_matches).map(([type, count]) => (
                      <div key={type} className="p-3 bg-tertiary/5 rounded-lg">
                        <div className="text-lg font-bold text-primary">
                          {count}
                        </div>
                        <div className="text-sm text-tertiary capitalize">
                          {type} Matches
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Relevant Sections */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-primary">
                      Relevant Sections ({document.relevant_sections.length})
                    </h5>
                    {document.relevant_sections.map((section, index) => (
                      <div 
                        key={`${document.document_id}-section-${index}`}
                        className="p-3 bg-tertiary/5 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-tertiary">
                            Page {section.page_number}
                          </span>
                          <div className="flex items-center space-x-1">
                            {section.relevance_type.map((type) => (
                              <span
                                key={type}
                                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-secondary">
                          {section.matching_context || section.content}
                        </p>
                        {section.matching_keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {section.matching_keywords.map((keyword, kidx) => (
                              <span
                                key={kidx}
                                className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Document Citation */}
                  <div className="pt-4 border-t border-tertiary/10">
                    <h5 className="font-medium text-primary mb-2">Citation</h5>
                    <p className="text-sm text-secondary font-mono p-3 bg-tertiary/5 rounded-lg">
                      {document.citation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {results.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-tertiary mx-auto mb-4" />
          <h4 className="text-lg font-medium text-primary mb-2">
            No Relevant Documents Found
          </h4>
          <p className="text-sm text-tertiary">
            Try adjusting your search criteria or uploading different documents.
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultsSection;