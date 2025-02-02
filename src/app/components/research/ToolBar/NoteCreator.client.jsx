'use client';

import { useState } from 'react';

export function NoteCreator({ onSave, initialContent = '' }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-primary mb-4">Create Note</h2>
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="input mb-4"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content..."
        className="flex-1 input resize-none"
      />

      <button
        onClick={handleSave}
        disabled={!title.trim() || !content.trim()}
        className="btn btn-primary mt-4"
      >
        Save Note
      </button>
    </div>
  );
}