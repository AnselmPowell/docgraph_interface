// src/app/components/research/Results/DocumentCard.client.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Eye, 
  Trash2, 
  Bookmark,
  ChevronDown,
  ChevronUp,
  Book,
  Tag,
  Link
} from 'lucide-react';
import { RelevanceScore } from './RelevanceScore.client';
import { MatchIndicators } from './MatchIndicators.client';

export function DocumentCard({
  document,
  viewMode,
  onRemove,
  onSave,
  onView
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log("document", document)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        group relative
        bg-background rounded-xl
        border border-tertiary/10
        transition-shadow duration-200
        hover:shadow-lg hover:shadow-primary/5
        overflow-hidden
        ${viewMode === 'list' ? 'flex gap-4' : ''}
      `}
    >
      {/* Header Section */}
      <div className={`
        p-4 flex items-start gap-4
        ${viewMode === 'list' ? 'flex-1' : ''}
      `}>
        {/* Document Icon */}
        <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/5">
          <FileText className="w-5 h-5 text-primary" />
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-primary truncate">
            {document.title}
          </h3>
          <p className="text-sm text-tertiary truncate">
            {document.authors.join(', ')}
          </p>
          
          {/* Match Summary */}
          <div className="mt-2">
            {/* <MatchIndicators matches={document.matches} /> */}
          </div>
        </div>

        {/* Relevance Score */}
        <div className="shrink-0">
          <RelevanceScore score={document.relevance_score} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`
        absolute right-2 top-2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        flex items-center gap-1
      `}>
        <button
          onClick={() => onView(document.document_id)}
          className="p-1.5 rounded-lg hover:bg-tertiary/10 text-tertiary hover:text-primary transition-colors"
          title="View document"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSave(document.document_id)}
          className="p-1.5 rounded-lg hover:bg-tertiary/10 text-tertiary hover:text-primary transition-colors"
          title="Save document"
        >
          <Bookmark className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(document.document_id)}
          className="p-1.5 rounded-lg hover:bg-tertiary/10 text-tertiary hover:text-primary transition-colors"
          title="Remove document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="
          w-full px-4 py-2 
          border-t border-tertiary/10
          text-sm text-tertiary
          hover:bg-tertiary/5
          transition-colors duration-200
          flex items-center justify-center gap-2
        "
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show Details
          </>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-tertiary/10 p-4 space-y-4"
        >
          {/* Relevant Sections Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary flex items-center gap-2">
              <Book className="w-4 h-4" />
              Relevant Sections
            </h4>
            <div className="space-y-2">
              {document.sections.slice(0, 2).map((section) => (
                <div
                  key={section.section_id}
                  className="p-2 rounded-lg bg-tertiary/5 text-sm text-secondary"
                >
                  {section.content.substring(0, 150)}...
                </div>
              ))}
            </div>
          </div>

          {/* Citation Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Citation</h4>
            <p className="text-sm text-secondary font-mono p-2 bg-tertiary/5 rounded-lg">
              {document.citation}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}