// src/app/components/research/Toolbar/ReferenceList.client.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, BookOpen } from 'lucide-react';

export function ReferenceList({ document }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  if (!document?.references) return (
    <div className="flex items-center justify-center h-full text-tertiary">
      No references available
    </div>
  );

  
    const entries = document.references?.entries || {};
    const total = Object.keys(entries).length;
    const displayCount = isExpanded ? total : 5;
  
    // Filter references based on search term
    const filteredEntries = Object.entries(entries)
      .filter(([id, ref]) => {
        const searchLower = searchTerm.toLowerCase();
        return searchTerm === '' || 
               ref.text.toLowerCase().includes(searchLower) ||
               id.includes(searchLower);
      });

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Fixed Header */}
      <div className="shrink-0 p-4 border-tertiary/10 bg-background/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          References
        </h2>
      </div>

      <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search references..."
          className="w-full pl-9 pr-4 py-2 bg-tertiary/5  text-sm border-2 rounded-2xl text-primary placeholder:text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* References List */}
        <div className="space-y-2">
          {filteredEntries.slice(0, displayCount).map(([id, ref]) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-tertiary/5 text-sm"
            >
              <div className="flex gap-2">
                <span className="text-primary font-medium whitespace-nowrap">
                  [{id}]
                </span>
                <p className="text-tertiary">
                  {ref.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {filteredEntries.length > 5 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-tertiary hover:text-primary transition-colors active:translate-y-[0.5px] active:scale-95"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More ({filteredEntries.length - 5} more) <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}

        {/* No Results Message */}
        {filteredEntries.length === 0 && searchTerm && (
          <p className="text-sm text-tertiary text-center py-4">
            No references found matching {searchTerm}
          </p>
        )}
      </div>
    </div>
  );
}