// src/app/components/research/ResearchLayout.client.jsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function ResearchLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-full w-64 
          bg-background border-r border-tertiary/10
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-tertiary/10">
          <h2 className="text-lg font-semibold text-primary">Saved Documents</h2>
        </div>

        {/* Sidebar Content - Will be implemented later */}
        <div className="p-4">
          {/* Placeholder for saved documents list */}
          <p className="text-sm text-tertiary">No documents saved yet</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-200
        ${isSidebarOpen ? 'md:ml-64' : ''}
      `}>
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md 
                     bg-background border border-tertiary/10
                     md:hidden"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-primary" />
          ) : (
            <Menu className="w-5 h-5 text-primary" />
          )}
        </button>

        {/* Content Area */}
        <div className="px-4 py-6 md:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default ResearchLayout;