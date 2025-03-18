// // src/app/components/research/Toolbar/NoteList.client.jsx
// 'use client';
// import { useState } from 'react';
// import { Quote, NotepadText, Copy, Check } from 'lucide-react';

// export function NotesList({ notes = [], onNoteSelect }) {
//   return (
//     <div className="h-full overflow-y-auto">
//        <div className="shrink-0 p-4 border-tertiary/10 bg-background/50 backdrop-blur-sm">
//         <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
//           <NotepadText className="w-5 h-5" />
//           Notes
//         </h2>
//       </div>

//       {notes.length === 0 ? (
//         <div className="text-center text-tertiary">
//           No notes saved yet
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notes.map(note => (
//             <div 
//               key={note.id}
//               className="p-4 rounded-lg border border-tertiary/10 hover:bg-tertiary/5 cursor-pointer"
//               // onClick={() => onNoteSelect(note)}
//             >
//               <div className="flex justify-between items-start">
//                 <h3 className=" text-xs text-secondary ">{note.title}</h3>
//                 {note.pageNumber && (
//                   <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">
//                     Page {note.pageNumber}
//                   </span>
//                 )}
//               </div>
              
//               <p className="font-medium text-primary my-3 line-clamp-3">
//                 {note.content}
//               </p>
              
//              {/* Citations/References */}
//               {note.citations && note.citations.length > 0 && (
//                 <div className="mt-2 pt-2 border-t border-tertiary/10">
//                   <div className="flex items-center gap-1 mb-1">
//                     <Quote className="w-3 h-3 text-tertiary" />
//                     <span className="text-xs text-tertiary">Citations</span>
//                   </div>
                  
//                   {/* If citations is an array with complex structure */}
//                   {Array.isArray(note.citations) && note.citations[0]?.text ? (
//                     <div>
//                       {note.citations.map((citation, idx) => (
//                         <div key={idx} className="mb-1">
                          
//                           {/* Show references for this citation if available */}
//                           {citation.references && citation.references.length > 0 && (
//                             <div className="ml-3 mt-1">
//                               {citation.references.map((ref, refIdx) => (
//                                 <div key={refIdx} className="text-xs text-tertiary opacity-80 mt-0.5">
//                                   {ref.text}
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     /* If citations is just a string */
//                     <div className="text-xs text-tertiary  ">
//                       {typeof note.citations === 'string' ? note.citations : note.citations[0]}
//                     </div>
//                   )}
//                 </div>
//               )}
              
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// src/app/components/research/Toolbar/NoteList.client.jsx
'use client';
import { Quote, NotepadText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function NotesList({ notes = [], onNoteSelect }) {
  const [copiedNoteId, setCopiedNoteId] = useState(null);
  
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
  const sortedNotes = [...notes].sort((a, b) => {
    // If timestamps are available, sort by timestamp
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    // If no timestamps, sort by ID (assuming ID increases with creation time)
    return b.id - a.id;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="shrink-0 p-4 border-tertiary/10 bg-background/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <NotepadText className="w-5 h-5" />
          Notes
        </h2>
      </div>

      {sortedNotes.length === 0 ? (
        <div className="text-center text-tertiary p-4">
          No notes saved yet
        </div>
      ) : (
        <div className="space-y-8 p-4 py-8">
          {sortedNotes.map(note => (
            <div 
              key={note.id}
              className="p-4 py-8 mt-3 rounded-lg border border-tertiary/10 hover:bg-tertiary/5 relative group"
            >
              {/* Copy Button - Position in top right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyNote(note);
                }}
                className={`absolute top-1 right-1 p-1.5 rounded-md 
                  transition-all flex items-center gap-1 text-black
                  `}
              >
                {copiedNoteId === note.id ? (
                  <span className="text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <div className="flex justify-between items-start mt-3">
                <h3 className="text-xs text-secondary">{note.title}</h3>
                {note.pageNumber && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">
                    Page {note.pageNumber}
                  </span>
                )}
              </div>
              
              <p className="font-medium text-primary my-3 line-clamp-3">
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
                  {Array.isArray(note.citations) && note.citations[0]?.text ? (
                    <div>
                      {note.citations.map((citation, idx) => (
                        <div key={idx} className="mb-1">
                          <div className="text-xs text-tertiary">
                            {citation.text}
                          </div>
                          
                          {/* Show references for this citation if available */}
                          {citation.references && citation.references.length > 0 && (
                            <div className="ml-3 mt-1">
                              {citation.references.map((ref, refIdx) => (
                                <div key={refIdx} className="text-xs text-tertiary opacity-80 mt-0.5">
                                  {ref.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* If citations is just a string */
                    <div className="text-xs text-tertiary">
                      {typeof note.citations === 'string' ? note.citations : note.citations[0]?.text || ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}