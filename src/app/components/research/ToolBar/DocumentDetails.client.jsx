// src/app/components/research/Toolbar/DocumentDetails.client.jsx
'use client';

import { 
  FileText, 
  Users, 
  Book,
  Clock,
  Hash,
  Calendar,
  Bookmark,
  BookOpen,
  File
} from 'lucide-react';

export function DocumentDetails({ document, onToolSelect }) {
  if (!document) {
    return (
      <div className="flex items-center justify-center p-4 text-tertiary">
        No document selected
      </div>
    );
  }
  console.log("Document detail:", document)

  // Helper function for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Fixed Header */}
      <div className="shrink-0 p-4 border-tertiary/10 bg-background/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Details
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto ">
        <div className="p-4 space-y-6">
          {/* Title Section */}
          <section className="space-y-2">
            <h1 className="text-xl font-semibold text-primary leading-tight">
              {document.title || document.file_name}
            </h1>
            <p className="text-sm text-tertiary">
              {document.file_name}
            </p>
          </section>

          {/* Quick Stats Grid */}
          <section className="grid grid-cols-2 gap-3">
            {/* Document Stats */}
            <div className="p-3 rounded-lg bg-tertiary/5 space-y-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-tertiary" />
                <span className="text-sm text-tertiary">Pages</span>
              </div>
              <p className="text-2xl font-semibold text-primary">
                {document.pages || '—'}
              </p>
            </div>

            {/* References Count */}
            <div className="p-3 rounded-lg bg-tertiary/5 space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-tertiary" />
                <span className="text-sm text-tertiary">References</span>
              </div>
              <p className="text-2xl font-semibold text-primary">
                {document.references?.entries 
                  ? Object.keys(document.references.entries).length 
                  : '—'
                }
              </p>
            </div>

            {/* Upload Date */}
            {document.created_at && (
              <div className="p-3 rounded-lg bg-tertiary/5 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-tertiary" />
                  <span className="text-sm text-tertiary">Added</span>
                </div>
                <p className="text-sm font-medium text-primary">
                  {formatDate(document.created_at)}
                </p>
              </div>
            )}

            {/* Processing Time */}
            {document.processing_duration && (
              <div className="p-3 rounded-lg bg-tertiary/5 space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-tertiary" />
                  <span className="text-sm text-tertiary">Process Time</span>
                </div>
                <p className="text-sm font-medium text-primary">
                  {Math.round(document.processing_duration)}s
                </p>
              </div>
            )}
          </section>

          {/* Summary Section */}
          {document.summary && (
            <section className="space-y-2">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Summary
              </h3>
              <div className="p-3 rounded-lg bg-tertiary/5">
                <p className="text-sm text-tertiary leading-relaxed">
                  {document.summary}
                </p>
              </div>
            </section>
          )}

          {/* Authors Section */}
          {document.authors?.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                <Users className="w-4 h-4" /> Authors
              </h3>
              <div className="p-3 rounded-lg bg-tertiary/5">
                <div className="flex flex-wrap gap-2">
                  {document.authors.map((author, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md 
                        bg-tertiary/10 text-sm text-tertiary"
                    >
                      {author}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* File Information */}
          <section className="space-y-2">
            <h3 className="text-sm font-medium text-primary flex items-center gap-2">
              <File className="w-4 h-4" /> File Information
            </h3>
            <div className="p-3 rounded-lg bg-tertiary/5 space-y-3">
              {/* File Size */}
              {document.file_size && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-tertiary">Size</span>
                  <span className="text-sm font-medium text-primary">
                    {(document.file_size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              )}
              
              {/* File Type */}
              {document.mime_type && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-tertiary">Type</span>
                  <span className="text-sm font-medium text-primary">
                    {document.mime_type.split('/')[1].toUpperCase()}
                  </span>
                </div>
              )}

              {/* File URL - Truncated */}
              {document.file_url && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-tertiary">Location</span>
                  <span className="text-sm font-medium text-primary max-w-[200px] truncate">
                    {document.file_url}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* References Preview */}
          {document.references?.entries && (
            <section className="space-y-2">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                <Book className="w-4 h-4" /> Recent References
              </h3>
              <div className="space-y-2">
                {Object.entries(document.references.entries)
                  .slice(0, 5) // Show only first 3 references
                  .map(([key, value]) => (
                    <div 
                      key={key}
                      className="p-3 rounded-lg bg-tertiary/5 text-sm"
                    >
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 font-medium text-primary">
                          [{key}]
                        </span>
                        <span className="text-tertiary line-clamp-2">
                          {value.text}
                        </span>
                      </div>
                    </div>
                  ))
                }
                {Object.keys(document.references.entries).length > 5 && (
                  <button
                  className='ml-8 '
                  onClick={() => onToolSelect('references')}
                  >
                    <p className="text-sm text-tertiary text-center">
                    + {Object.keys(document.references.entries).length - 5} more references
                  </p>

                  </button>
                  
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
