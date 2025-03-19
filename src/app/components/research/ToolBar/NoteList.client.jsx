
// src/app/components/research/Toolbar/NoteList.client.jsx
'use client';
import { useState, useEffect } from 'react';
import { Quote, NotepadText, Copy, Check, Trash2, Filter, ChevronDown } from 'lucide-react';

export function NotesList({ notes = [], onDeleteNote }) {
  const [copiedNoteId, setCopiedNoteId] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  
  // Add filter states
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Extract unique document sources for filter dropdown
  const documentSources = notes && notes.length > 0
    ? ['all', ...new Set(notes.map(note => note.source))]
    : ['all'];
  
  // Filter notes based on selected filter
  const filteredNotes = selectedFilter === 'all'
    ? notes
    : notes.filter(note => note.source === selectedFilter);
  
  // Function to truncate long titles
  const truncateTitle = (title, maxLength = 20) => {
    return title?.length > maxLength
      ? title.substring(0, maxLength) + '...'
      : title || 'Untitled';
  };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilter && !event.target.closest('.filter-dropdown')) {
        setShowFilter(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilter]);
  
  // Function to handle copying a note
  const handleCopyNote = (note) => {
    // Format content with citations
    let textToCopy = note.content;
    // Add citations if available
    if (note.citations && note.citations.length > 0) {
      textToCopy += '\n\n';
      
      // Handle different citation formats
      if (Array.isArray(note.citations) && note.citations[0]?.text) {
        note.citations.forEach((citation) => {    
          // Add references if available
          if (citation.references && citation.references.length > 0) {
            citation.references.forEach((ref) => {
              textToCopy += `${ref.text}\n`;
            });
          } else {
            textToCopy += `${citation.text}\n`;
          }
        });
      } 
    } 
    
    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Sort notes by timestamp (most recent first)
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // If timestamps are available, sort by timestamp
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    // If no timestamps, sort by ID (assuming ID increases with creation time)
    return b.id - a.id;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="shrink-0 px-4 pt-4 border-tertiary/10 bg-background/50 backdrop-blur-sm sticky top-0 z-20">
       <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <NotepadText className="w-5 h-5" />
            Notes
          </h2>
          
          {/* Add Filter Dropdown */}
          {notes.length > 1 && (
          <div className="relative filter-dropdown z-[500]">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="text-sm flex items-center gap-1 text-tertiary hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-tertiary/5"
              title="Filter by document"
            >
              <Filter className={` w-5 h-5
               
               ${selectedFilter === 'all' ? 'text-black' : 'text-green-700' }
              `}
              
              />
              <span className={`hidden sm:inline   ${selectedFilter === 'all' ? '' : 'text-bold' }`}>{selectedFilter === 'all' ? 'All documents' : truncateTitle(selectedFilter)}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showFilter && (
              <div className="fixed right-12 mt-2 bg-white shadow-xl rounded-md border border-tertiary/20 py-1 w-56 max-h-60 overflow-y-auto animate-in fade-in duration-100">
                {documentSources.map(source => (
                  <button
                    key={source}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-grey-50
                      ${selectedFilter === source 
                        ? 'text-primary bg-primary/10 font-medium' 
                        : 'text-secondary hover:text-primary'}`}
                    onClick={() => {
                      setSelectedFilter(source);
                      setShowFilter(false);
                    }}
                  >
                    {source === 'all' ? 'All documents' : truncateTitle(source)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
        
        {/* Show counts when filtering */}
        {selectedFilter !== 'all' && (
          <div className="mt-1 text-xs text-tertiary">
            Showing {filteredNotes.length} of {notes.length} notes
          </div>
        )}
      </div>

      {sortedNotes.length === 0 ? (
        <div className="text-center text-tertiary p-4">
          {notes.length > 0 && filteredNotes.length === 0 
            ? `No notes from "${truncateTitle(selectedFilter)}" document` 
            : "No notes saved yet"}
        </div>
      ) : (
        <div className="space-y-8 p-4 py-8 z-10 relative">
          {sortedNotes.map(note => (
            <div 
              key={note.id}
              className="p-4 py-8 mt-3 rounded-lg border border-tertiary/10 hover:bg-tertiary/5 relative group"
            >
              {/* Copy Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyNote(note);
                }}
                className={`absolute top-1 right-8 p-1.5 rounded-md 
                  transition-all flex items-center gap-1 text-black`}
                title="Copy"
              >
                {copiedNoteId === note.id ? (
                  <span className="text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                disabled={deletingNoteId === note.id}
                className="absolute top-1 right-1 p-1.5 rounded-md transition-all flex items-center gap-1 
                  text-red-600 opacity-0 group-hover:opacity-60 hover:opacity-100"
                title="Delete note"
              >
                {deletingNoteId === note.id ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>

              <div className="flex justify-between items-start mt-2">
                <h3 className="text-xs text-secondary">Ttile: {note.title}</h3>
                {note.pageNumber && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">
                    Page {note.pageNumber}
                  </span>
                )}
              </div>
              
              <p className="font-medium my-8 text-primary line-clamp-3">
                {note.content}
              </p>
              
              {/* Citations/References */}
              {note.citations && note.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-tertiary/10">
                  <div className="flex items-center gap-1 mb-1">
                    <Quote className="w-3 h-3 text-tertiary" />
                    <span className="text-xs text-tertiary">Citations</span>
                  </div>
                  
                  {/* If citations is an array with complex structure */}
                  {Array.isArray(note.citations) && note.citations[0]?.text && (
                    <div>
                      {note.citations.map((citation, idx) => (
                        <div key={idx} className="mb-1">
                          
                          {/* Show references for this citation if available */}
                          {citation.references && citation.references.length > 0 ? (
                            <div className="ml-3 mt-1">
                              {citation.references.map((ref, refIdx) => (
                                <div key={refIdx} className="text-xs text-tertiary opacity-80 mt-0.5">
                                  {ref.text}
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* If citations is just a string */
                            <div className="text-xs text-tertiary">
                              
                              {citation.text}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) }
                </div>
              )}
            
            </div>
          ))}
        </div>
      )}
    </div>
  );
}