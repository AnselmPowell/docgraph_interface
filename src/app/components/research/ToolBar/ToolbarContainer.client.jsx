

// src/app/components/research/layout/ToolbarContainer.client.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  FileText, 
  BookOpen, 
  ListTodo,
  PlusSquare,
  PanelLeft,
  ArrowLeftFromLine, 
  ArrowRightFromLine,
  X
} from 'lucide-react';

// Import tool components
import { SearchResults } from './SearchResults.client';
import { DocumentDetails } from './DocumentDetails.client';
import { ReferenceList } from './ReferenceList.client';
import { NotesList } from './NoteList.client';
import { NoteCreator } from './NoteCreator.client';

// Tool definitions with fixed types
const tools = [
  { id: 'search-results', icon: Sparkles, label: 'Search Results' },
  { id: 'document-details', icon: FileText, label: 'Document Details' },
  { id: 'references', icon: BookOpen, label: 'References' },
  { id: 'notes-list', icon: ListTodo, label: 'Notes' },
  { id: 'create-note', icon: PlusSquare, label: 'Create Note' }
];

export function ToolbarContainer({ 
  documents,
  activeTool, 
  onToolSelect, 
  document,
  results,
  onToggleSearchBarVisibility,
  onSaveNote,
  onViewDocument,
  onViewSearchResults,
  notes,
  onNoteSelect,
  isSearching,
  onRemoveResult,
  onRemoveAllResult,
  onClose,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Determine tool visibility based on available data
  const toolVisibility = {
    'search-results': results || activeTool == 'search-results' || true ,
    'document-details': !!document,
    'references': !!(document?.references?.entries),
    'notes-list': true,
    'create-note': true
  };

  // Get content for active tool
  const getToolContent = () => {
    switch(activeTool) {
      case 'search-results':
        return (
          <SearchResults 
            documents={documents}
            results={results}

            onSaveNote={onSaveNote}
            onViewDocument={onViewDocument}
            onViewSearchResults={onViewSearchResults}
            isLoading={isSearching}
            onRemoveResult={onRemoveResult}
            onRemoveAllResult={onRemoveAllResult}
            isToolbarExpanded={isExpanded}
          />
        );
      case 'document-details':
        return <DocumentDetails document={document} onToolSelect={onToolSelect} />;
      case 'references':
        return <ReferenceList document={document} />;
      case 'notes-list':
        return <NotesList notes={notes} onNoteSelect={onNoteSelect} />;
      case 'create-note':
        return <NoteCreator onSave={onSaveNote} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-auto  overflow-y-hidden overflow-x-hidden">
      
      {/* Tool Content Area */}
      <AnimatePresence mode="wait">
      <div className={`flex-1 relative mr-2 
        ${activeTool 
          ? isExpanded 
            ? 'w-[700px] min-w-[400px]  pl-6 border-l' 
            : 'w-[400px] min-w-[300px]  pl-6 border-l' 
          : 'w-[0px] pr-0'
        } 
        custom-scrollbar overflow-x-hidden transition-all duration-300`}
      >
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, x: 320 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 320 }}
          transition={{ 
            type: "spring",
            stiffness: 250,
            damping: 30,
            duration: 0.6 
          }}
          className="overflow-x-hidden"
        >
            {activeTool && 
            <div className="flex items-center gap-1 relative ">
              {/* Expand Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg 
                  text-tertiary hover:text-primary hover:bg-tertiary/5 
                  transition-colors"
              >
                {isExpanded ? <ArrowRightFromLine className="w-6 h-6" /> : <ArrowLeftFromLine className="w-6 h-6" />}
              </button>
              {/* Close Button */}
              <button
                onClick={() => onToolSelect(null)}
                className="p-1.5 rounded-lg 
                  text-tertiary hover:text-primary hover:bg-tertiary/5 
                  transition-colors "
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          }
          {getToolContent()}
        </motion.div>
      </div>
    </AnimatePresence>

      {/* Tool Icons */}
      <div className="w-16 relative right-2 h-full px-8 bg-tertiary/5 ">
        <div className="flex flex-col items-center py-4 gap-4">
          {tools.map(tool => {
            const Icon = tool.icon;
            if (!toolVisibility[tool.id]) return null;

            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`
                  relative p-3 rounded-2xl transition-all 
                  ${activeTool === tool.id 
                    ? 'bg-primary/10 bg-gray-200 text-primary scale-120' // Added scale effect
                    : 'text-tertiary hover:text-primary hover:bg-tertiary/5'
                  }
                `}
                title={tool.label}
              >
                <Icon className="w-6 h-6" />
                {tool.id === 'search-results' && results?.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary 
                    rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-medium text-white">
                      {results.length}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


