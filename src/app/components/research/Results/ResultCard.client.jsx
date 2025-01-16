// src/app/components/research/Results/ResultCard.client.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ResultSection } from './ResultSection.client';

export function ResultCard({ result, onView }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return ( 
    <div className="rounded-lg border border-tertiary/10 bg-background overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-primary">
            {result.title}
          </h3>
          {result.authors?.length > 0 && (
            <p className="text-sm text-tertiary mt-1">
              {result.authors.join(', ')}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-tertiary">
              {result.matching_sections.length} matches
            </span>
            <div className="h-4 w-px bg-tertiary/20" />
            <div className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {Math.round(result.relevance_score)}% relevant
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-tertiary/10 text-tertiary hover:text-primary transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => onView(result)}
            className="px-3 py-1.5 rounded-lg bg-primary text-background text-sm hover:bg-primary/90 transition-colors"
          >
            View Document
          </button>
        </div>
      </div>

      {/* Matching Sections */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-tertiary/10"
          >
            <div className="divide-y divide-tertiary/10">
              {result.matching_sections.map((section, index) => (
                <ResultSection
                  key={section.section_id || index}
                  section={section}
                  onViewSection={() => onView(result, section)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


