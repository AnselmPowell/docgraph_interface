// src/app/components/header/Header.client.jsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TabBar } from './TabBar.client';
import Image from 'next/image';
import ProfileSection from './ProfileSection';

export function Header({ 
  authState,
  tabs,
  activeTab,
  isSideBarOpen,
  showSidebar,
  handleSideBarToggle,
  onTabChange,
  onTabClose,
  selectedDocuments,
  setUserData,
  className
}) {

  useEffect(() => {

  }, [authState]);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`  
        bg-background
        z-50 flex items-center justify-between px-4 overflow-hidden
        ${className}
        h-16 pr-6
      `}
    >
      <div className="flex items-center gap-4">
        {/* Logo Section */}
        
        <div className="flex items-center gap-1">
       
          <div className="relative pt-4 w-16 h-16 p-3 ">
            <Image
              src="/docgraph_image_br.png"
              alt="StudyGraph Logo"
              fill
              className="object-contain"
              priority
            />
          </div> 
          <span className="text-2xl font-semibold text-gray-800">
            StudyGraph
          </span>
        
        </div>

        {/* Tab Bar */}
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onTabClose={onTabClose}
          selectedDocuments={selectedDocuments}
        />
      </div>

      <ProfileSection authState={authState} setUserData={setUserData} />
    </motion.header>
  );
}







