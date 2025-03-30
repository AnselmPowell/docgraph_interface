// src/app/components/research/layout/ResearchLayout.client.jsx
'use client'; 

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft, PanelRight, X } from 'lucide-react';
import { Header } from '../header/Header.client';


export function ResearchLayout({ 
  authState,
  authModel,
  sidebarContent,
  onOpenSidebar,
  isSidebarOpen,
  isSidebarLocked,
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
  const [showSidebar, setShowSidebar] = useState();

  const [showToolbar, setShowToolbar] = useState(false);
  const [sidebarWidth] = useState(320); // Store sidebar width as state
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Handle toolbar visibility based on tool selection
    setShowToolbar(!!toolbarContent);
  }, [toolbarContent]);

  // Add hover timer ref
  const hoverTimerRef = useRef(null);
  const sidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && 
        !sidebarRef.current.contains(event.target) && 
        isSidebarOpen) {
        onOpenSidebar(false);
        setShowSidebar(false);
    }
  };

  // Handle clicks outside sidebar
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    console.log(" handle change isSidebarLocked", isSidebarLocked)
    if(!isSidebarLocked){
    const handleUserChange = (event) => {
      console.log
      
        if(event.detail.user) {
          onOpenSidebar(true);
          setShowSidebar(true);
        }
      }
    

    window.addEventListener('userStateChanged', handleUserChange);
    return () => window.removeEventListener('userStateChanged', handleUserChange);
    }
  }, [isSidebarLocked]);



    // Define shared animation settings with different configurations for opening/closing
    const getAnimationSettings = () => ({
      type: "spring",
      stiffness: isSidebarOpen ? 250 : 280, // Lower stiffness when opening
      damping: isSidebarOpen ? 26.8 : 26,     // Lower damping when opening
      mass: isSidebarOpen ? 1.0 : 1.1,      // Higher mass when opening (more inertia)
      duration: 0.4
    });

  
    return (
      <div className="relative left-0 flex flex-col w-full min-w-fit h-screen bg-background overflow-y-auto">
        {/* Fixed Header with Tabs */}
        <Header
          isSidebarOpen={isSidebarOpen}
          showSidebar={showSidebar}
          handleSidebarToggle={onOpenSidebar}
          authState={authState}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onTabClose={onTabClose}
          selectedDocuments={selectedDocuments}
          setUserData={setAuthUserData}
          className={`${!(isSidebarOpen || activeTool) && activeTab ? "border-b border-tertiary/10" : ""}`}
        />
  
        {/* Main Content Area - Adjusted for header */}
        <div className={`flex flex-1 w-[100%] h-screen overflow-y-hidden  `}>
          {/* Hover detection area - only show when sidebar is closed */}
          {!isSidebarOpen && (
            <div 
              className="fixed left-2 top-1/2 -translate-y-1/2 w-32 h-full z-50 cursor-pointer"
              onMouseEnter={() => {
                hoverTimerRef.current = setTimeout(() => {
                  onOpenSidebar(true);
                }, 200);
              }}
              onMouseLeave={() => {
                if (hoverTimerRef.current) {
                  clearTimeout(hoverTimerRef.current);
                }
              }}
            />
          )}
  
          {/* Layout container with animations */}
          <div className={` flex flex-1 relative overflow-hidden  `}>
            {/* Sidebar */}
            {/* <AnimatePresence mode="sync"> */}
              {isSidebarOpen && (
                <motion.aside
                  ref={sidebarRef}
                  initial={{ x: -sidebarWidth, width: sidebarWidth }}
                  animate={{ x: 0, width: sidebarWidth }}
                  exit={{ x: -sidebarWidth, width: 0 }}
                  transition={getAnimationSettings()}
                  className="shrink-0 h-full z-50 bg-white relative"
                >
                  {sidebarContent}
                </motion.aside>
              )}
            {/* </AnimatePresence> */}
  
            {/* Main Content with synchronized animation */}
            <motion.main
              initial={false}
              animate={{
                marginLeft: isSidebarOpen ? 0 : -sidebarWidth/2,
                x: isSidebarOpen ? 0 : sidebarWidth/2
              }}
              transition={getAnimationSettings()}
              className={`relative flex-1 h-full w-[fill] overflow-hidden ${ activeTool  ? "border-t-4 border-r-4 border-tertiary/10 rounded-tr-xl mr-[164px]" : ""} ${isSidebarOpen  ? "border-t-4 border-l-4 border-tertiary/10 rounded-tl-xl mr-0" : ""} ${isSidebarOpen && activeTool ? "mr-0" : ""} 
`}
            >
              <div className="h-full overflow-y-auto custom-scrollbar">
                {mainContent}
              </div>

            </motion.main>

        {/* Right Toolbar */}
        {/* Toolbar */}
        <div className={` flex overflow-y-auto z-10 ${isSidebarOpen && !activeTool  ? "border-t-4 border-tertiary/10" : ""} ${isSidebarOpen && !activeTool  ? "border-t-4 border-tertiary/10" : ""} `}>
          {/* Pass through the ToolbarContainer */}
          {toolbarContent}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-50">
                {searchBarContent}
        </div>

        {/* Sidebar Toggle */}
        {!isSidebarOpen && (
          <button
            onClick={() => onOpenSidebar(true)}
            className="fixed left-0 top-1/2 p-1.5 bg-background/80 
              backdrop-blur-sm border border-tertiary/10 rounded-r-lg
              hover:bg-tertiary/5 transition-colors z-50 cursor-pointer"
          >
            <PanelLeft />
          </button>
        )}
        
        {authModel}
      </div>
    </div>
    </div>
  );
}


