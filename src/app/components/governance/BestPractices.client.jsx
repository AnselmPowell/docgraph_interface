
// src/app/components/governance/BestPractices.client.jsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Tag, BookOpen } from 'lucide-react';

export function BestPractices({ analysisResult }) {
  const [expandedPractice, setExpandedPractice] = useState(null);

  if (!analysisResult || !analysisResult.document) {
    return null;
  }

  const { document, best_practices } = analysisResult;

  return (
    
    <div className="space-y-6 animate-fade-in">
      {/* Document Summary Card */}
      <div className="card bg-background p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">Document Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-tertiary">Filename</p>
            <p className="text-secondary font-medium">{document.filename}</p>
          </div>
          <div>
            <p className="text-tertiary">Size</p>
            <p className="text-secondary font-medium">
              {(document.file_size / 1024).toFixed(2)} KB
            </p>
          </div>
          <div>
            <p className="text-tertiary">Upload Date</p>
            <p className="text-secondary font-medium">
              {new Date(document.upload_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-tertiary">Total Pages</p>
            <p className="text-secondary font-medium">{document.total_pages}</p>
          </div>
        </div>
      </div>

      {/* Best Practices List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">
          Best Practices ({best_practices.length})
        </h3>
        
        {best_practices.map((practice, index) => (
          <div 
            key={index}
            className="card bg-background p-4 hover:shadow-md transition-shadow"
          >
            {/* Header - Always visible */}
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedPractice(expandedPractice === index ? null : index)}
            >
              <div className="flex-1">
                <h4 className="font-medium text-primary line-clamp-2">
                  {practice.text}
                </h4>
                <p className="text-sm text-tertiary">
                  Page {practice.page_number}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-tertiary">
                  {(practice.confidence_score * 100).toFixed(0)}% confidence
                </div>
                {expandedPractice === index ? (
                  <ChevronUp className="w-5 h-5 text-tertiary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-tertiary" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedPractice === index && (
              <div className="mt-4 space-y-4 animate-expand">
                {/* Context Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary">
                    <BookOpen className="w-4 h-4" />
                    <h5 className="font-medium">Context</h5>
                  </div>
                  <p className="text-sm text-secondary pl-6">
                    {practice.context}
                  </p>
                </div>

                {/* Impact Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary">
                    <FileText className="w-4 h-4" />
                    <h5 className="font-medium">Impact</h5>
                  </div>
                  <p className="text-sm text-secondary pl-6">
                    {practice.impact}
                  </p>
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary">
                    <Tag className="w-4 h-4" />
                    <h5 className="font-medium">Keywords & Themes</h5>
                  </div>
                  <div className="pl-6 flex flex-wrap gap-2">
                    {/* Keywords */}
                    {practice.keywords.map((keyword, i) => (
                      <span 
                        key={`kw-${i}`}
                        className="px-2 py-1 bg-tertiary/10 rounded-md text-xs text-tertiary"
                      >
                        {keyword}
                      </span>
                    ))}
                    {/* Themes */}
                    {practice.themes.map((theme, i) => (
                      <span 
                        key={`theme-${i}`}
                        className="px-2 py-1 bg-primary/10 rounded-md text-xs text-primary"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}