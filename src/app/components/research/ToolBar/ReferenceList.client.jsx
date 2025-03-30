
// src/app/components/research/Toolbar/ReferenceList.client.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, PenLine, Save, Check, X, Loader2, AlertTriangle,  } from 'lucide-react';
import { LiaListOlSolid } from "react-icons/lia";
import { toast } from '../../messages/Toast.client';

export function ReferenceList({ document, onUpdateReferences}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]) ;
  const [allEntries, setAllEntries] = useState([]) ;
  const [displayCount, setDisplayCount] = useState();
  const [referenceText, setReferenceText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);


  useEffect(() => {
    if (!document?.references) {
      setFilteredEntries([]);
      return;
    }
  
    console.log("REF TEST :1", filteredEntries);
    console.log("REF TEST :2", document.references?.entries);
    console.log("REF TEST :", allEntries);
  
    // Determine source of entries (as an object)
    const entriesObj = (filteredEntries && Object.keys(filteredEntries).length > 0) 
      ? filteredEntries 
      : document.references?.entries || {};
  
      let entriesArray
    if(filteredEntries && Object.keys(filteredEntries).length > 0){
      entriesArray = entriesObj
    } else {
      // Convert to an array once
      entriesArray = Object.entries(entriesObj);
    }
  
    // Set display count
    setDisplayCount(isExpanded ? entriesArray.length : 5);
    // Apply search filter if needed
    if (searchTerm) {
      if(!(allEntries && Object.keys(allEntries).length > 0)){
        setAllEntries(entriesArray)
      }
      const searchLower = searchTerm.toLowerCase();

      entriesArray = entriesArray.filter(([id, ref]) => 
        ref?.text?.toLowerCase().includes(searchLower) || id.includes(searchLower)
      );
      setFilteredEntries(entriesArray); 
      setIsExpanded(true)
      return 
    } else if(allEntries && Object.keys(allEntries).length > 0){
      setFilteredEntries(allEntries);
      setIsExpanded(false)
      setAllEntries([])
      return
    }
      
    setFilteredEntries(entriesArray); 
    
   
  
  }, [document, isExpanded, searchTerm]);
  
  
  

  if (!document?.references) return (
    <div className="flex items-center justify-center h-full text-tertiary">
      No references available
    </div>
  );
  

  const handleSaveReferences = async () => {
    if (!referenceText.trim()) {
      toast.error('Reference list cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const referenceData = await onUpdateReferences(document.document_id, referenceText);
      console.log('referenceData.:', referenceData) 
      console.log('referenceData.entries:', referenceData.references.entries) 
      
      if(referenceData.references.entries ){

      const entries = referenceData.references?.entries || {};
      const referenceEntries = Object.entries(entries)
      const total = Object.keys(entries).length;
      const count = isExpanded ? total : 5;
      setDisplayCount(count)

      
        
      setFilteredEntries(referenceEntries)
      setAllEntries(referenceEntries)


      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditMode(false);
      }, 2000);
      toast.success('References updated successfully');
    }  else {
      setTimeout(() => {
        toast.error('References data could not be added please try again', 7000);
        setIsSaving(false);
      }, 2000);
    
    }

   
    } catch (error) {
      console.error('Error updating references:', error);
      toast.error('Failed to update references');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col overflow-y-auto overflow-x-hidden h-full pb-5">
      {/* Fixed Header */}
      <div className="shrink-0 p-4 border-tertiary/10 bg-background/50 backdrop-blur-sm flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <LiaListOlSolid className="w-5 h-5" />
          References List
        </h2>
        
        {!isEditMode ? (
          <button
            onClick={() => {
              setReferenceText(''); // Clear text when entering edit mode
              setIsEditMode(true);
            }}
            className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors active:translate-y-[0.5px] active:scale-95"
            title="Edit references manually"
          >
            <PenLine className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(false)}
              className="p-2 rounded-md text-tertiary hover:text-primary hover:bg-tertiary/10 transition-colors active:translate-y-[0.5px] active:scale-95"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSaveReferences}
              disabled={isSaving}
              className={`p-2 rounded-md transition-colors active:translate-y-[0.5px] active:scale-95 ${
                isSaving ? 'bg-tertiary/20 cursor-wait' :
                saveSuccess ? 'bg-green-100 text-green-700' :
                'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
              title="Save references"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Warning Message */}
      <div className="flex items-center gap-2 p-2 border-b-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <p className="text-xs">
          References may not always be extracted correctly. You can manually update the reference list by clicking the edit button in the top left.
        </p>
      </div>

      {isEditMode ? (
        <div className="flex-1 p-4 overflow-hidden">
          <textarea
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            placeholder="Paste your complete reference list here."
            className="w-full h-[95%] p-3 border border-tertiary/20 rounded-md  resize-none"
          />
          <div className="mt-2 text-xs text-tertiary">
            Paste your complete reference list to update the document references.
          </div>
        </div>
      ) : (
        <div className="space-y-3 p-4 overflow-visible">

          {/* Search Bar */}
          {displayCount &&
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search references..."
              className="w-full pl-9 pr-4 py-2 bg-tertiary/5 text-sm border-2 rounded-2xl text-primary placeholder:text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>}

          {/* References List */}
          <div className="space-y-2 overflow-visible">
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
                    {ref?.text}
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
              No references found matching: {searchTerm}
            </p>
          )}
        </div>
      )}
    </div>
  );
}