// src/app/components/research/layout/ResearchLayout.client.jsx
'use client'; 

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft, PanelRight, X } from 'lucide-react';
import { Header } from '../header/Header.client';
import { AuthModal } from '../../auth/AuthModal';

export function ResearchLayout({ 
  authState,
  sidebarContent,
  onOpenSidebar,
  isSidebarOpen,
  mainContent,
  searchBarContent,
  toolbarContent,
  tabs,
  activeTab,
  activeTool,
  onTabChange,
  onTabClose,
  selectedDocuments,
  setAuthUserData,
  onToggleSearchBarVisibility
}) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showToolbar, setShowToolbar] = useState(false);


  useEffect(() => {
  // Handle toolbar visibility based on tool selection
  setShowToolbar(!!toolbarContent);
}, [toolbarContent]);


// Add hover timer ref
const hoverTimerRef = useRef(null);
const sidebarRef = useRef(null);

const handleOpenSidebar = (isOpen)=> {
      setShowSidebar(isOpen);
      onOpenSidebar(isOpen)
}

// Handle hover effect
const handleMouseEnter = () => {
  if (!showSidebar) {
    hoverTimerRef.current = setTimeout(() => {
      handleOpenSidebar(true)
     
    
    }, 800); // 0.8 second delay
  }
};

const handleMouseLeave = () => {
  if (hoverTimerRef.current) {
    clearTimeout(hoverTimerRef.current);
  }
};

const handleClickOutside =(event)=> {
  if (sidebarRef.current && 
      !sidebarRef.current.contains(event.target) && 
      showSidebar) {
      handleOpenSidebar(false)
  }
}


 


 // Handle clicks outside sidebar

 useEffect(() => {

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showSidebar, ]);


 useEffect(() => {
  console.log("Open the side bar: User")

  const handleUserChange = (event) => {
    if(event.detail.user) {
      handleOpenSidebar(true)
    }
  };

  window.addEventListener('userStateChanged', handleUserChange);
  return () => window.removeEventListener('userStateChanged', handleUserChange);
}, [ ]);
  

  return (
    <div className="relative left-0 flex flex-col w-full min-w-fit h-screen bg-background  overflow-y-auto">
        {/* Fixed Header with Tabs */}
  <Header
    authState={authState}
    tabs={tabs}
    activeTab={activeTab}
    onTabChange={onTabChange}
    onTabClose={onTabClose}
    selectedDocuments={selectedDocuments}
    setUserData={setAuthUserData}
    className={` ${showSidebar || activeTool ? "border-b border-tertiary/10" : "" }`}
  />

  {/* Main Content Area - Adjusted for header */}
    <div className="flex flex-1 w-[100%] h-screen overflow-y-hidden ">
        {/* Hover detection area - only show when sidebar is closed */}
        {!showSidebar && (
          <div 
            className="fixed left-2 top-1/2 -translate-y-1/2 w-32 h-full z-50 cursor-pointer"
            onMouseEnter={() => {
              hoverTimerRef.current = setTimeout(() => {
                handleOpenSidebar(true)
              }, 200);
            }}
            onMouseLeave={() => {
              if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
              }
            }}
          />
        )}

        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              ref={sidebarRef}
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 250, 
                damping: 30,     
                duration: 4.6 
              }}
              className="shrink-0 h-full w-[320px] border-r border-tertiary/10 z-50 bg-white  relative"
            >
              {sidebarContent}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main 
          className={`
            relative flex-1 h-full w-full
            transition-all duration-300
            ${showSidebar && 'ml-0'}
            ${showToolbar && 'mr-0'}
          `}
        >
          <div className="h-full overflow-y-auto custom-scrollbar">
            {mainContent}
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            {searchBarContent}
          </div>
        </main>

        {/* Right Toolbar */}
        {/* Toolbar */}
        <div className="flex overflow-y-auto">
          {/* Pass through the ToolbarContainer */}
          {toolbarContent}
        </div>

        

        {/* Sidebar Toggle */}
        {!showSidebar && (
          <button
            onClick={() => handleOpenSidebar(true)}
            className="fixed left-0 top-1/2 p-1.5 bg-background/80 
              backdrop-blur-sm border border-tertiary/10 rounded-r-lg
              hover:bg-tertiary/5 transition-colors z-50 cursor-pointer"
          >
            <PanelLeft />
          </button>
        )}

      </div>
    </div>
  );
}




