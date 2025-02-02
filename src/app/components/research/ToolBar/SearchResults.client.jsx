// src/app/components/research/Toolbar/SearchResults.client.jsx
'use client';

import { useState } from 'react';
import { 
 ChevronDown, 
 ChevronUp,
 Copy,
 Plus,
 Sparkles,
 Loader2,
 X,
 Trash,
 Trash2

} from 'lucide-react';

export function SearchResults({ results, onSaveNote, onViewDocument, isLoading, onRemoveResult }) {
 const [expandedResult, setExpandedResult] = useState(null);
 const [copiedSection, setCopiedSection] = useState(null);
 const [savedSection, setSavedSection] = useState(null);

 if (!results?.length && !isLoading) {
   return (
     <div className="flex items-center justify-center h-full text-tertiary">
       No search results yet
     </div>
   );
 }
 console.log("Search Results:", results)

 const handleCopyText = (text, sectionId) => {
   navigator.clipboard.writeText(text);
   setCopiedSection(sectionId);
   setTimeout(() => setCopiedSection(null), 2000);
 };

 const handleSaveNote = (section, sectionId) => {
   onSaveNote(section);
   setSavedSection(sectionId);
   setTimeout(() => setSavedSection(null), 2000);
 };

 const handleViewInDocument = (document, section) => {
   onViewDocument(document);
 };

 

 return (
   <div className="h-full flex flex-col">
     {/* Simple Fixed Header */}
     <div className="shrink-0 p-4 border-tertiary/10 bg-background/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {isLoading ? "Analysing..." : "Search Results" }
         
        </h2>
      </div>
  
      {isLoading && (
        <div className="h-full flex flex-col items-center justify-center p-4 bg-white/5">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary/80" />
            <p className="text-sm text-tertiary">
              Searching through selected documents..
            </p>
          </div>
        </div>
      )}

     {/* Results List */}
     <div className="flex-1 overflow-y-auto scrollbar-hide overflow-x-hidden">
       {results.map((result) => (
         <div
           key={result.question + result.title}
           className="border-b border-tertiary/10"
         >
          <div className='flex group relative '>
           {/* Document Header */}
           <button
             onClick={() => setExpandedResult(
               expandedResult === result.document_id ? null : result.document_id
             )}
             className="w-full p-3 text-wrap items-center justify-between hover:bg-tertiary/5"
           >
             <div className="flex-1 text-left">
               
             <h4 className="font-small text-primary text-sm truncate pr-2">
               {result.title.slice(0, 40)}...
               </h4>

               <h3 className="font-medium text-primary text-m truncate pr-2">
               {result.question.slice(0, 35)}...
               </h3>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                   {Math.round(result.relevance_score)}% Match
                 </span>
                 <span className="text-xs text-tertiary">
                   {result.matching_sections.length} matches
                 </span>
                 {expandedResult === result.document_id ? 
               <ChevronUp className="w-5 h-5 text-tertiary pl-4" /> : 
               <ChevronDown className="w-5 h-5 text-tertiary pl-4" />
             }
               </div>
             </div>
             
            
             
           </button>
           <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveResult(result.question, result.title);
                }}
                className="p-1.5 rounded-md
                  text-tertiary hover:text-primary hover:bg-tertiary/10 mr-4
                  opacity-0 group-hover:opacity-100
                  transition-all duration-75 z-40"
                title="Remove result"
              >
                <Trash2 className="w-5 h-4 ml-5" />
              </button>
              </div>

             

           {/* Matching Sections */}
           {expandedResult === result.document_id && (
             <div className="bg-tertiary/5">
               {result.matching_sections.map((section, idx) => (
                 <div 
                   key={idx}
                   className="p-3 border-t border-tertiary/10 space-y-3"
                 >
                   {/* Page and View Info */}
                   <div className="flex items-center justify-between">
                     <span className="text-xs text-tertiary">
                       Page {section.page_number}
                     </span>
                     <button
                       onClick={() => handleViewInDocument(result, section)}
                       className="text-xs text-primary hover:underline flex items-center gap-1"
                     >
                       View in document
                
                     </button>
                   </div>

                   {/* Section Context */}
                   {section.matching_context && (
                     <div className="relative group">
                       <div className="bg-background rounded-md p-3">
                         <div className="text-sm text-secondary">
                           {section.matching_context}
                         </div>
                         
                         {/* Action Buttons with Feedback */}
                         <div className="absolute top-[-2px] right-1 flex items-center gap-2">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleCopyText(section.matching_context, section.section_id);
                             }}
                             className={`p-1.5 rounded-md transition-all flex items-center gap-1
                               ${copiedSection === section.section_id 
                                 ? 'bg-green-500/10 text-grey-500' 
                                 : 'hover:bg-tertiary/10 text-tertiary opacity-0 group-hover:opacity-100'
                               }`}
                           >
                             <Copy className="w-4 h-4" />
                             {copiedSection === section.section_id && (
                               <span className="text-xs">Copied!</span>
                             )}
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleSaveNote(section, section.section_id);
                             }}
                             className={`p-1.5 rounded-md transition-all flex items-center gap-1
                               ${savedSection === section.section_id 
                                 ? 'bg-blue-500/10 text-blue-500' 
                                 : 'hover:bg-tertiary/10 text-tertiary opacity-0 group-hover:opacity-100'
                               }`}
                           >
                             <Plus className="w-4 h-4" />
                             {savedSection === section.section_id && (
                               <span className="text-xs">Saved!</span>
                             )}
                           </button>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Keywords */}
                   {section.matching_keywords?.length > 0 && (
                     <div className="px-1 flex items-center gap-2">
                       <span className="text-xs text-tertiary">Keywords:</span>
                       <div className="flex flex-wrap gap-1.5">
                         {section.matching_keywords.map((keyword, kidx) => (
                           <span
                             key={kidx}
                             className="px-2 py-0.5 text-xs rounded-full bg-tertiary/10 text-tertiary"
                           >
                             {keyword}
                           </span>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Citations */}
                   {section.citations?.length > 0 && (
                     <div className="mt-3">
                       <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs text-tertiary">
                         Citations 
                         </span>
                       </div>
                       <div className="space-y-2 pl-2 border-l-2 border-tertiary/10">
                         {section.citations.map((citation, idx) => (
                           <div key={idx}>
                             {citation.map((cite, citeIdx) => (
                               cite.references.map((ref, refIdx) => (
                                 <div 
                                   key={refIdx} 
                                   className="text-xs text-tertiary mb-2"
                                 >
                                   {ref.text}
                                 </div>
                               ))
                             ))}
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           )}
         </div>
       ))}
     </div>
   </div>
 );
}

