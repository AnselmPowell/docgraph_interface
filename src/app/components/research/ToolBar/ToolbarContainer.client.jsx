
// src/app/components/research/layout/ToolbarContainer.client.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles,
  FileText, 
  BookOpen, 
  ListTodo,
  PlusSquare,
  ArrowLeftFromLine, 
  ArrowRightFromLine,
  X,
  ArrowUp
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
  pendingSearches,
  onToggleSearchBarVisibility,
  onViewDocument,
  onViewSearchResults,
  notes,
  onSaveNote,
  onDeleteNote,
  onNoteSelect,
  isSearching,
  onRemoveResult,
  onRemoveAllResult,
  onClose,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const [noteIconAnimating, setNoteIconAnimating] = useState(false);


  // Enhanced onSaveNote that triggers icon animation
  const handleSaveNote = (noteData) => {
    // First animate the icon
    setNoteIconAnimating(true);
    
    // Wait for animation to finish before turning it off
    setTimeout(() => {
      setNoteIconAnimating(false);
    }, 1000); // Same duration as the wiggle animation
    
    // Forward the note data to the parent handler
    onSaveNote(noteData);
  };
  
  // Determine tool visibility based on available data
  const toolVisibility = {
    'search-results': results || activeTool == 'search-results' || true,
    'document-details': !!document,
    'references': !!(document?.references?.entries),
    'notes-list': true,
    'create-note': true
  };

  // Handle scroll events to show/hide the "back to top" button
  useEffect(() => {
    setShowScrollToTop(false)
    const handleScroll = () => {
      if (!contentRef.current) return;

      // Show button when scrolled down 20% of the content height
      const scrollThreshold = contentRef.current.scrollHeight * 0.2;
      setShowScrollToTop(contentRef.current.scrollTop > 200);
    };
    
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeTool]);
  
  // Scroll to top function
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Get content for active tool
  const getToolContent = () => {
    switch(activeTool) {
      case 'search-results':
        return (
          <SearchResults 
            documents={documents}
            results={results}
            pendingSearches={pendingSearches}
            onSaveNote={handleSaveNote}
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
        return <NotesList notes={notes} onDeleteNote={onDeleteNote} onNoteSelect={onNoteSelect} />;
      case 'create-note':
        return <NoteCreator onSave={onSaveNote} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex w-auto h-full overflow-hidden">
      
      {/* Tool Content Area with Fixed Buttons */}
      <AnimatePresence mode="wait">
        <div 
          className={`flex-1 relative mr-2 
            ${activeTool 
              ? isExpanded 
                ?  `${ !results?.length && activeTool == 'search-results' ? 'w-[400px] min-w-[400px]' : 'w-[520px] min-w-[500px]'  } `
                : `${ !results?.length && activeTool == 'search-results' ? 'w-[400px] min-w-[400px]' : 'w-[420px] min-w-[400px]'  } `
              : 'w-[0px] pr-0'
            } 
            overflow-hidden transition-all duration-300`}
        >
          {/* Fixed Buttons Container */}
          {activeTool && (
            <div className="absolute top-0 left-1 right-0 z-10 flex items-center ">
              {/* Expand Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 px-3 rounded-lg bg-white
                  text-tertiary hover:text-primary hover:bg-tertiary/5 
                  transition-colors active:translate-y-[0.5px] active:scale-95"
              >
                {isExpanded ? <ArrowRightFromLine className="w-6 h-6" /> : <ArrowLeftFromLine className="w-6 h-6" />}
              </button>
              {/* Close Button */}
              <button
                onClick={() => onToolSelect(null)}
                className="p-1.5 px-3 rounded-lg bg-white
                  text-tertiary hover:text-primary hover:bg-tertiary/5 
                  transition-colors active:translate-y-[0.5px] active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Scrollable Content Area with Padding for Fixed Buttons */}
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
            className={`h-full overflow-y-auto overflow-x-hidden pl-6 border-l ${activeTool ? 'pt-14' : ''} custom-scrollbar`}
            ref={contentRef}
          >
            {getToolContent()}
            
            {/* Back to Top Button */}
            <AnimatePresence>
              {showScrollToTop && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={scrollToTop}
                  className="fixed bottom-6 right-5 p-3 rounded-full bg-primary text-black shadow-lg hover:bg-primary/90 transition-colors z-30"
                  title="Back to top"
                >
                  <ArrowUp className="w-7 h-7"/>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </AnimatePresence>

     {/* Tool Icons */}
     <div className="w-16 relative right-2 h-full px-8 bg-tertiary/5">
        <div className="flex flex-col items-center py-4 gap-4">
          {tools.map(tool => {
            const Icon = tool.icon;
            if (!toolVisibility[tool.id]) return null;

            // Apply wiggle animation to notes-list icon when a note is saved
            const isAnimating = tool.id === 'notes-list' && noteIconAnimating;

            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect(tool.id)}
                className={`
                  relative p-3 rounded-2xl transition-all active:translate-y-[0.5px] active:scale-95 
                 
                  ${activeTool === tool.id 
                    ? 'bg-primary/10 bg-gray-200 text-primary scale-120' 
                    : 'text-tertiary hover:text-primary hover:bg-tertiary/5'
                  }
                  ${isAnimating ? 'animate-[wiggle_0.6s_ease-in-out] brightness-110' : ''}
                `}
                title={tool.label}
              >
                <Icon className="w-6 h-6" />
      
                {tool.id === 'notes-list' && notes?.length > 0 && (
                  <span className={`absolute top-2 right-2 w-4 h-4 bg-primary 
                    rounded-full flex items-center justify-center bg-slate-100
                    ${isAnimating ? 'animate-pulse' : ''}`}>
                    <span className="text-sm font-medium text-gray rounded-full  bg-slate-100  w-5 h-5 justify-center items-center">
                      {notes.length}
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