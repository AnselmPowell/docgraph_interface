// src/app/components/research/header/Header.client.jsx
'use client';

import { motion } from 'framer-motion';
import { TabBar } from './TabBar.client';
import Image from 'next/image';

export function Header({ 
  tabs,              // Array<Tab>
  activeTab,         // string (tab.id)
  onTabChange,       // (tabId: string) => void
  onTabClose,        // (tabId: string) => void
  selectedDocuments,
  className         // string 
}) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`  
        bg-background
        ${activeTab && "border-b border-tertiary/10" }
        z-10 flex items-center px-4 overflow-hidden 
        ${className}
         h-16
      `}
     >
      <div className="flex items-center gap-4 w-full">
         {/* Logo Section */}
         <div className="flex items-center gap-1">
          <div className="relative w-16 h-16 p-3">
            <Image
              src="/docgraph_2_br.png"
              alt="DocGraph Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-semibold text-gray-800">
            DocGraph
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
    </motion.header>
  );
}



