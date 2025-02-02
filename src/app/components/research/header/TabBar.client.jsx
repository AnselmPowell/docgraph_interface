// src/app/components/research/header/TabBar.client.jsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  selectedDocuments,
}) {
  const scrollRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  console.log("tab selected", selectedDocuments)
  // Check if tabs overflow
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    const resizeObserver = new ResizeObserver(checkScroll);
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [tabs, selectedDocuments]);

  return (
    <div className="flex-1 flex items-center overflow-hidden">
      {/* Scroll Buttons */}
      {showScrollButtons && (
        <button 
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Tabs */}
      <div 
        ref={scrollRef}
        className="flex-1 ml-5 overflow-hidden flex items-center hide-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {tabs.map(tab => (
              <motion.div
              key={tab.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => onTabChange(tab.id)}
              className={`
                group flex items-center py-8
                rounded-md cursor-pointer transition-colors
                ${activeTab === tab.id 
                  ? 'bg-gray-200 text-gray-800 shadow-sm ' 
                  : selectedDocuments?.some(doc => doc === tab.title)
                    ? 'bg-gray-100 hover:bg-gray-50 border-b-8 border-black' 
                    : 'bg-white text-gray-800 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <span className={` px-2  ${activeTab === tab.id ? "text-m font-medium border-b-8 border-primary" : "text-sm font-small " } truncate max-w-[160px]`}>
                {tab.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 
                  p-0.5 rounded-sm cursor-pointer
                  transition-opacity"
              >
                <X className="w-5 h-5 m-1" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showScrollButtons && (
        <button 
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => {
            scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}