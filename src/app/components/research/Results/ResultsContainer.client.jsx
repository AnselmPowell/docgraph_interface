// src/app/components/research/Results/ResultsContainer.client.jsx
'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, BarChart2, Grid, List } from 'lucide-react';
import { DocumentCard } from './DocumentCard.client';
import { NoResults } from './NoResults.client';

export function ResultsContainer({ 
  documents = [],
  onRemoveDocument,
  onSaveDocument,
  onViewDocument 
}) {
  // View state management
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');

  // Sort and filter documents
  const sortedDocuments = useMemo(() => {
    let filtered = [...documents];
    
    // Apply filters
    if (filterBy !== 'all') {
      filtered = filtered.filter(doc => 
        doc.matches[filterBy] > 0
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevance_score - a.relevance_score;
        case 'context':
          return b.matches.context - a.matches.context;
        case 'theme':
          return b.matches.theme - a.matches.theme;
        case 'keywords':
          return b.matches.keyword - a.matches.keyword;
        default:
          return 0;
      }
    });
  }, [documents, sortBy, filterBy]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">
          Analysis Results 
          <span className="ml-2 text-sm font-normal text-tertiary">
            ({documents.length} documents)
          </span>
        </h2>
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Sort Controls */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              px-3 py-1.5 rounded-lg text-sm
              border border-tertiary/20
              bg-background text-primary
              focus:border-primary focus:ring-1 focus:ring-primary
              transition-colors duration-200
            "
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="context">Sort by Context Matches</option>
            <option value="theme">Sort by Theme Matches</option>
            <option value="keywords">Sort by Keyword Matches</option>
          </select>

          {/* Filter Controls */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="
              px-3 py-1.5 rounded-lg text-sm
              border border-tertiary/20
              bg-background text-primary
              focus:border-primary focus:ring-1 focus:ring-primary
              transition-colors duration-200
            "
          >
            <option value="all">All Matches</option>
            <option value="context">Context Matches</option>
            <option value="theme">Theme Matches</option>
            <option value="keyword">Keyword Matches</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-tertiary/20 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                p-1.5 rounded-md transition-colors
                ${viewMode === 'grid' ? 
                  'bg-primary text-background' : 
                  'text-tertiary hover:text-primary hover:bg-tertiary/10'}
              `}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                p-1.5 rounded-md transition-colors
                ${viewMode === 'list' ? 
                  'bg-primary text-background' : 
                  'text-tertiary hover:text-primary hover:bg-tertiary/10'}
              `}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid/List */}
      <AnimatePresence mode="wait">
        {sortedDocuments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`
              grid gap-4
              ${viewMode === 'grid' ? 
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
                'grid-cols-1'}
            `}
          >
            {sortedDocuments.map((document) => (
              <DocumentCard
                key={document.document_id}
                document={document}
                viewMode={viewMode}
                onRemove={onRemoveDocument}
                onSave={onSaveDocument}
                onView={onViewDocument}
              />
            ))}
          </motion.div>
        ) : (
          <NoResults />
        )}
      </AnimatePresence>
    </div>
  );
}