// src/app/components/file/AnalysisResults.client.jsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Book, Type } from 'lucide-react';

export function AnalysisResults({ analysis, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!analysis) return null;

  const metrics = {
    'Read Time': {
      value: analysis.estimated_read_time,
      icon: Clock,
      description: 'Estimated time to read'
    },
    'Word Count': {
      value: analysis.word_count,
      icon: Type,
      description: 'Total number of words'
    },
    'Unique Words': {
      value: analysis.unique_words,
      icon: Book,
      description: 'Number of different words used'
    }
  };

  return (
    <div className={`
      mt-2 rounded-md border border-tertiary
      bg-background/95 backdrop-blur-sm
      overflow-hidden
      transition-all duration-200
      ${className}
    `}>
      {/* Summary Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 flex items-center justify-between text-primary hover:bg-primary/5"
      >
        <span className="text-sm font-medium">Document Analysis</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Detailed Analysis - Expandable */}
      <div className={`
        overflow-hidden transition-all duration-200
        ${isExpanded ? 'max-h-96' : 'max-h-0'}
      `}>
        <div className="p-3 space-y-3">
          {Object.entries(metrics).map(([key, { value, icon: Icon, description }]) => (
            <div key={key} className="flex items-start space-x-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-primary">{key}:</span>
                  <span className="text-sm text-secondary">{value}</span>
                </div>
                <p className="text-xs text-tertiary">{description}</p>
              </div>
            </div>
          ))}

          {/* Additional Metrics */}
          <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-tertiary/30">
            <div>
              <dt className="text-xs text-tertiary">Sentences</dt>
              <dd className="text-sm text-secondary">{analysis.sentence_count}</dd>
            </div>
            <div>
              <dt className="text-xs text-tertiary">Avg. Sentence Length</dt>
              <dd className="text-sm text-secondary">{analysis.average_sentence_length} words</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}