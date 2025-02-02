'use client';

export function NotesList({ notes = [], onNoteSelect }) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-lg font-semibold text-primary mb-4">Notes</h2>
      {notes.length === 0 ? (
        <div className="text-center text-tertiary">
          No notes saved yet
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div 
              key={note.id}
              className="p-4 rounded-lg border border-tertiary/10 hover:bg-tertiary/5"
              onClick={() => onNoteSelect(note)}
            >
              <h3 className="font-medium text-primary">{note.title}</h3>
              <p className="text-sm text-tertiary mt-1 line-clamp-2">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}