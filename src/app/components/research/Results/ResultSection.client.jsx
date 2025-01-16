// src/app/components/research/Results/ResultSection.client.jsx
'use client';

import { Target, Book, Tag } from 'lucide-react';

export function ResultSection({ section, onViewSection }) {
  return (
    <div className="p-4 hover:bg-tertiary/5 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-tertiary">
            Page {section.page_number} 
          </span>
          {section.matching_context && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-500">
              Context Match
            </span>
          )}
          {section.matching_theme && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500">
              Theme Match
            </span>
          )}
        </div>
        
        <button
          onClick={onViewSection}
          className="text-xs text-tertiary hover:text-primary hover:underline"
        >
          View in document
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {section.matching_context && (
          <div className="rounded-lg bg-blue-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-medium text-blue-500">Context Match</h4>
            </div>
            <p className="text-sm text-secondary">
              {section.matching_context}
            </p>
          </div>
        )}

        {section.matching_theme && (
          <div className="rounded-lg bg-purple-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Book className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-medium text-purple-500">Theme Match</h4>
            </div>
            <p className="text-sm text-secondary">
              {section.matching_theme}
            </p>
          </div>
        )}

        {section.matching_keywords?.length > 0 && (
          <div className="rounded-lg bg-green-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-green-500" />
              <h4 className="text-sm font-medium text-green-500">Keywords</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {section.matching_keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-500"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Citations */}
        {section.citations?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-tertiary/10">
            <p className="text-xs font-medium text-tertiary mb-2">Citations</p>
            <div className="space-y-2">
              {section.citations.map((citation, idx) => (
                <div 
                  key={idx}
                  className="text-sm text-tertiary"
                >
                  [{citation.id}] {citation.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


