// src/app/components/research/layout/ResearchLayout.client.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight } from 'lucide-react';

export function ResearchLayout({ 
 children,
 sidebarContent,
 searchBarContent,
 mainContent,
 detailContent,
}) {
 const [showSidebar, setShowSidebar] = useState(true);
 const [showDetail, setShowDetail] = useState(false);
 
 const mainWidth = `w-[calc(100%-${showSidebar ? '320px' : '0px'}-${showDetail ? '33.333%' : '0px'})]`;

 return (
   <div className="relative flex w-full h-screen bg-background overflow-hidden">
     {/* Sidebar Toggle */}
     <motion.button
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       onClick={() => setShowSidebar(prev => !prev)}
       className="absolute left-0 top-1/2 -translate-y-1/2 z-50 p-1.5 bg-background/80 backdrop-blur-sm border border-tertiary/10 rounded-r-lg hover:bg-tertiary/5 transition-colors group"
     >
       {showSidebar ? (
         <ChevronLeft className="w-4 h-4 text-tertiary group-hover:text-primary" />
       ) : (
         <PanelLeft className="w-4 h-4 text-tertiary group-hover:text-primary" />
       )}
     </motion.button>

     {/* Document Sidebar */}
     <AnimatePresence mode="wait">
       {showSidebar && (
         <motion.aside
           initial={{ width: 0, opacity: 0 }}
           animate={{ width: 320, opacity: 1 }}
           exit={{ width: 0, opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="shrink-0 h-full border-r border-tertiary/10 bg-background/50"
         >
           {sidebarContent}
         </motion.aside>
       )}
     </AnimatePresence>

     {/* Main Content */}
     <main className={`flex-1 h-full relative transition-all duration-300 ease-in-out ${mainWidth}`}>
       <div className="h-full overflow-y-auto scrollbar-hide">
         {mainContent}
       </div>

       {/* Search Bar */}
       <div className="absolute bottom-0 left-0 right-0">
         {searchBarContent}
       </div>
     </main>

     {/* Detail Panel Toggle */}
     <motion.button
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       onClick={() => setShowDetail(prev => !prev)}
       className="absolute right-0 top-1/2 -translate-y-1/2 z-50 p-1.5 bg-background/80 backdrop-blur-sm border border-tertiary/10 rounded-l-lg hover:bg-tertiary/5 transition-colors group"
     >
       {showDetail ? (
         <ChevronRight className="w-4 h-4 text-tertiary group-hover:text-primary" />
       ) : (
         <PanelRight className="w-4 h-4 text-tertiary group-hover:text-primary" />
       )}
     </motion.button>

     {/* Detail Panel */}
     <AnimatePresence mode="wait">
       {showDetail && (
         <motion.aside
           initial={{ width: 0, opacity: 0 }}
           animate={{ width: '33.333333%', opacity: 1 }}
           exit={{ width: 0, opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="shrink-0 h-full border-l border-tertiary/10 bg-background/50"
         >
           {detailContent}
         </motion.aside>
       )}
     </AnimatePresence>
   </div>
 );
}



