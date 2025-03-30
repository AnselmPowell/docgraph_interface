// src/app/components/research/DocumentManagement/DocumentActions.client.jsx
'use client';

import {  Trash2, Check, FileText } from 'lucide-react';


export function DocumentActions({ 
  document, 
  isSelected,
  onView,
  onDelete,
  onSelect
}) {
  return (
    <div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-1"
    >

      <button
        onClick={(e) => {
          e.stopPropagation();
          onView(document);
        }}
        className="p-2 rounded-md flex flex-col items-center justify-center text-gray-600  transition-colors active:translate-y-[0.5px] active:scale-95"
      >
       <FileText className="w-3 h-3 text-gray-400" /> 
       <p className="text-xs ">View</p>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(document);
        }}
        className="p-1.5 rounded-md text-red-600 transition-colors active:translate-y-[0.5px] active:scale-95"
      >
        <Trash2 className="w-4 h-4" />
      </button>
       {/* Checkbox */}
       <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(document);
        }}
        className={`
          w-5 h-5 ml-2 rounded border transition-colors active:translate-y-[0.5px] active:scale-95
          ${isSelected 
            ? 'bg-primary border-primary' 
            : 'border-black hover:border-primary'
          }
          flex items-center justify-center
        `}
      >
        {isSelected && <Check className="w-4 h-4 text-black font-bold" />}
      </button>
    </div>
  );
}