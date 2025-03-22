
// src/app/components/research/ToolBar/ResearchContext.client.jsx
'use client';

import { useState, useEffect } from 'react';
import { BookPlus, Save, AlertCircle, Check, Trash2, Loader2, SaveAll } from 'lucide-react';
import { toast } from '../../messages/Toast.client';

export function ResearchContext({ context, onSave, onDelete }) {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasContext, setHasContext] = useState(false);
  
  useEffect(() => {
    if (context) {
      setContent(context.content || '');
      updateWordCount(context.content || '');
      setHasContext(true);
    } else {
      setContent('');
      setWordCount(0);
      setHasContext(false);
    }
  }, [context]);
  
  const updateWordCount = (text) => {
    const words = text.trim().split(/\s+/);
    setWordCount(words.length > 0 && words[0] !== '' ? words.length : 0);
  };
  
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateWordCount(newContent);
  };
  
  const handleSave = async () => {
    try {
      if (!content.trim()) {
        toast.error('Research context cannot be empty');
        return;
      }
      
      if (wordCount > 1200) {
        toast.error('Research context cannot exceed 1200 words');
        return;
      }
      
      setIsSaving(true);
      
      const contextData = {
        content
      };
      
      await onSave(contextData);
      
      setSaveSuccess(true);
      setHasContext(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      
      
    } catch (error) {
      console.error('Error saving research context:', error);
      toast.error('Failed to save research context');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      setContent('');
      setWordCount(0);
      setHasContext(false);
      toast.success('Research context deleted');
    } catch (error) {
      console.error('Error deleting research context:', error);
      toast.error('Failed to delete research context');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-tertiary/10">
        <div className="flex items-center gap-2">
          <BookPlus className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Research Context</h2>
        </div>
        <div className="flex items-center gap-2">
          
          {hasContext && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`p-2 rounded-md transition-colors active:translate-y-[0.5px] active:scale-95 ${
                isDeleting ? 'bg-tertiary/20 cursor-wait' :
                ' text-red-700'
              }`}
              title="Clear context"
            >
              {isDeleting ? (
                 <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving || wordCount > 1200}
            className={`p-2 rounded-md transition-colors active:translate-y-[0.5px] active:scale-95 ${
              isSaving ? 'bg-tertiary/20 cursor-wait' :
              saveSuccess ? 'bg-green-100 text-green-700' :
              'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
            title={` ${hasContext ? 'Update context': 'Save context' }`}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-5 h-5" />
            ) : (
               hasContext ? <SaveAll className='w-5 h-5'/> : 
              <Save className={`w-5 h-5  ${content.length > 0  ? " animate-[wiggle_0.6s_ease-in-out] scale-110 brightness-110 transition-[scale]" :  " " } `} />
            )}
          </button>
        </div>
      </div>
      
      {/* Content textarea */}
      <div className="flex-1 px-4 py-4 overflow-hidden">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Enter your research context here (up to 1200 words). Describe what you're researching, key concepts, and specific information you're looking for."
          className="w-full h-full p-3 border border-tertiary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
        
      </div>

      
      {/* Warning for word limit */}
      {wordCount > 1200 ?  (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border-t border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Content exceeds 1200 word limit. Please shorten your text.</span>
        </div>
      ) : 
      <div className="flex w-full items-end justify-end  ">
            <span className={`text-xs px-2 py-1 rounded-full text-end ${
                wordCount > 1200 ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'
                }`}>
                    {wordCount}/1200 words
            </span>
        </div>
      }
      
      {/* Help text */}
      <div className="px-4 py-3 bg-tertiary/5 border-t border-tertiary/10">
        <p className="text-xs text-tertiary">
          This research context helps guide your document analysis and searches. Describe your research topic, 
          key questions, and specific information. <span className='font-semibold'> You can have only one research context at a time.</span>
        </p>
      </div>
    </div>
  );
}