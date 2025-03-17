// // src/app/components/research/header/TabBar.client.jsx
// 'use client';

// import { useRef, useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// export function TabBar({
//   tabs,
//   activeTab,
//   onTabChange,
//   onTabClose,
//   selectedDocuments,
// }) {
//   const scrollRef = useRef(null);
//   const [showScrollButtons, setShowScrollButtons] = useState(false);
//   // Check if tabs overflow
//   useEffect(() => {
//     const checkScroll = () => {
//       if (scrollRef.current) {
//         const { scrollWidth, clientWidth } = scrollRef.current;
//         setShowScrollButtons(scrollWidth > clientWidth);
//       }
//     };

//     checkScroll();
//     const resizeObserver = new ResizeObserver(checkScroll);
//     if (scrollRef.current) {
//       resizeObserver.observe(scrollRef.current);
//     }

//     return () => resizeObserver.disconnect();
//   }, [tabs, selectedDocuments]);

//   return (
//     <div className="flex-1 flex items-center overflow-hidden">
//       {/* Scroll Buttons */}
//       {showScrollButtons && (
//         <button 
//           className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
//           onClick={() => {
//             scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
//           }}
//         >
//           <ChevronLeft className="w-4 h-4" />
//         </button>
//       )}

//       {/* Tabs */}
//       <div 
//         ref={scrollRef}
//         className="flex-1 ml-5 overflow-hidden flex items-center hide-scrollbar"
//       >
//         <AnimatePresence mode="popLayout">
//           {tabs.map(tab => (
//               <motion.div
//               key={tab.id}
//               layout
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               onClick={() => onTabChange(tab.id)}
//               className={`
//                 group flex items-center py-8
//                 rounded-md cursor-pointer transition-colors
//                 ${activeTab === tab.id 
//                   ? 'bg-gray-200 text-gray-800 shadow-sm ' 
//                   : selectedDocuments?.some(doc => doc === tab.title)
//                     ? 'bg-gray-100 hover:bg-gray-50 border-b-8 border-black' 
//                     : 'bg-white text-gray-800 hover:text-gray-800 hover:bg-gray-50'
//                 }
//               `}
//             >
//               <span className={` px-2  ${activeTab === tab.id ? "text-m font-medium border-b-8 border-primary" : "text-sm font-small " } truncate max-w-[160px]`}>
//                 {tab.title}
//               </span>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onTabClose(tab.id);
//                 }}
//                 className="opacity-0 group-hover:opacity-100 
//                   p-0.5 rounded-sm cursor-pointer
//                   transition-opacity"
//               >
//                 <X className="w-5 h-5 m-1" />
//               </button>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       {showScrollButtons && (
//         <button 
//           className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
//           onClick={() => {
//             scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
//           }}
//         >
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// }
































// // src/app/components/research/header/TabBar.client.jsx
// 'use client';

// import { useRef, useEffect, useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// export function TabBar({
//   tabs,
//   activeTab,
//   onTabChange,
//   onTabClose,
//   selectedDocuments,
// }) {
//   const scrollRef = useRef(null);
//   const [showScrollButtons, setShowScrollButtons] = useState(false);
//   const [hoveredTab, setHoveredTab] = useState(null);
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [tooltipTimer, setTooltipTimer] = useState(null);

  
  
//   // Calculate compression values based on tab count
//   const tabProperties = useMemo(() => {
//     // Base values
//     const maxTabWidth = 160;  // Maximum width for tabs (1-6 tabs)
//     const minTabWidth = 100;  // Minimum width for tabs (10+ tabs)
//     const maxOverlap = 16;    // Maximum overlap in pixels
    
//     // Calculate compression factor (0 to 1)
//     let compressionFactor = 0;
//     if (tabs.length > 6) {
//       // Smooth progression from 0 to 1 between 6 and 10 tabs
//       compressionFactor = Math.min(1, (tabs.length - 6) / 4);
//     }
    
//     // Calculate current values based on compression factor
//     const tabWidth = Math.floor(maxTabWidth - (compressionFactor * (maxTabWidth - minTabWidth)));
//     const overlap = Math.floor(compressionFactor * maxOverlap);
//     const scale = 1 - (compressionFactor * 0.05); // Subtle scale reduction
    
//     return { tabWidth, overlap, scale, compressionFactor };
//   }, [tabs.length]);
  
//   // Check if tabs overflow and scroll to active tab when it changes
//   useEffect(() => {
//     const checkScroll = () => {
//       if (scrollRef.current) {
//         const { scrollWidth, clientWidth } = scrollRef.current;
//         setShowScrollButtons(scrollWidth > clientWidth);
//       }
//     };

//     checkScroll();
    
//     // Scroll to active tab when it changes
//     if (activeTab && scrollRef.current) {
//       const activeTabElement = scrollRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
//       if (activeTabElement) {
//         const scrollContainer = scrollRef.current;
//         const tabRect = activeTabElement.getBoundingClientRect();
//         const containerRect = scrollContainer.getBoundingClientRect();
        
//         // Center the active tab if it's outside the visible area
//         if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
//           const scrollLeft = activeTabElement.offsetLeft - (scrollContainer.clientWidth / 2) + (tabRect.width / 2);
//           scrollContainer.scrollTo({
//             left: scrollLeft,
//             behavior: 'smooth'
//           });
//         }
//       }
//     }

//     const resizeObserver = new ResizeObserver(checkScroll);
//     if (scrollRef.current) {
//       resizeObserver.observe(scrollRef.current);
//     }

//     return () => resizeObserver.disconnect();
//   }, [tabs, selectedDocuments, activeTab]);
  
//   // Handle mouse wheel scrolling
//   const handleWheel = (e) => {
//     if (scrollRef.current) {
//       e.preventDefault();
//       scrollRef.current.scrollLeft += e.deltaY;
//     }
//   };
  
//   // Handle tab hover for tooltip
//   const handleTabHover = (tabId, title) => {
//     setHoveredTab({ id: tabId, title });
    
//     // Clear any existing tooltip timer
//     if (tooltipTimer) {
//       clearTimeout(tooltipTimer);
//     }
    
//     // Set a new timer to show tooltip after 2 seconds
//     const timer = setTimeout(() => {
//       setShowTooltip(true);
//     }, 2000);
    
//     setTooltipTimer(timer);
//   };
  
//   // Handle tab hover end
//   const handleTabHoverEnd = () => {
//     if (tooltipTimer) {
//       clearTimeout(tooltipTimer);
//     }
//     setShowTooltip(false);
//     setHoveredTab(null);
//   };

//   return (
//     <div className="flex-1 flex items-center overflow-hidden">
//       {/* Scroll Buttons */}
//       {showScrollButtons && (
//         <button 
//           className="p-1.5 mr-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
//           onClick={() => {
//             scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
//           }}
//         >
//           <ChevronLeft className="w-4 h-4" />
//         </button>
//       )}

//       {/* Tabs */}
//       <div 
//         ref={scrollRef}
//         className="flex-1 overflow-x-auto hide-scrollbar"
//         onWheel={handleWheel}
//       >
//         <div className="flex items-center transition-all duration-300">
//           <AnimatePresence mode="popLayout">
//             {tabs.map((tab, index) => {
//               const isActive = activeTab === tab.id;
//               const isSelected = selectedDocuments?.some(doc => doc === tab.title);
              
//               // Apply increased z-index for active tab and hover state
//               const zIndex = isActive ? 20 : 10 - Math.min(10, Math.abs(tabs.length/2 - index));
              
//               return (
//                 <motion.div
//                   key={tab.id}
//                   layout
//                   data-tab-id={tab.id}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ 
//                     opacity: 1, 
//                     x: 0,
//                     scale: isActive ? 1 : tabProperties.scale,
//                     transition: { duration: 0.3 }
//                   }}
//                   exit={{ opacity: 0, x: -20 }}
//                   onClick={() => onTabChange(tab.id)}
//                   onMouseEnter={() => handleTabHover(tab.id, tab.title)}
//                   onMouseLeave={handleTabHoverEnd}
//                   style={{
//                     zIndex: zIndex,
//                     marginLeft: index === 0 ? '0px' : `-${tabProperties.overlap}px`,
//                     maxWidth: `${isActive ? tabProperties.tabWidth + 20 : tabProperties.tabWidth}px`
//                   }}
//                   className={`
//                     group flex items-center py-8 relative
//                     rounded-md cursor-pointer transition-all duration-300
//                     shadow-sm
//                     ${isActive 
//                       ? 'bg-gray-200 text-gray-800' 
//                       : isSelected
//                         ? 'bg-gray-100 hover:bg-gray-50 border-b-4 border-primary' 
//                         : 'bg-white text-gray-800 hover:bg-gray-50'
//                     }
//                     ${tabProperties.compressionFactor > 0 ? 'px-2 border border-gray-200' : 'px-3'}
//                     ${tabProperties.compressionFactor > 0 ? 'hover:z-30 hover:scale-105' : ''}
//                   `}
//                 >
//                   <span 
//                     className={`
//                       truncate
//                       ${isActive ? "text-m font-medium border-primary px-1" : "text-sm font-small"} 
//                     `}
//                     style={{
//                       maxWidth: `${isActive ? tabProperties.tabWidth - 10 : tabProperties.tabWidth - 30}px`
//                     }}
//                   >
//                     {tab.title}
//                   </span>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onTabClose(tab.id);
//                     }}
//                     className="opacity-0 group-hover:opacity-100 
//                       p-0.5 rounded-sm cursor-pointer ml-0.5
//                       transition-opacity"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
                  
//                   {/* Tooltip */}
//                   {hoveredTab?.id === tab.id && showTooltip && (
//                     <div 
//                       className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5
//                         bg-gray-300 text-black text-sm rounded-sm shadow-lg z-[500] whitespace-nowrap"
//                     >
//                       {tab.title}
//                     </div>
//                   )}
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//         </div>
//       </div>

//       {showScrollButtons && (
//         <button 
//           className="p-1.5 ml-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
//           onClick={() => {
//             scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
//           }}
//         >
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// }



// src/app/components/research/header/TabBar.client.jsx
'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
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
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState(null);
  
  // Calculate compression values based on tab count
  const tabProperties = useMemo(() => {
    // Base values
    const maxTabWidth = 160;  // Maximum width for tabs (1-6 tabs)
    const minTabWidth = 100;  // Minimum width for tabs (10+ tabs)
    const maxOverlap = 16;    // Maximum overlap in pixels
    
    // Calculate compression factor (0 to 1)
    let compressionFactor = 0;
    if (tabs.length > 6) {
      // Smooth progression from 0 to 1 between 6 and 10 tabs
      compressionFactor = Math.min(1, (tabs.length - 6) / 4);
    }
    
    // Calculate current values based on compression factor
    const tabWidth = Math.floor(maxTabWidth - (compressionFactor * (maxTabWidth - minTabWidth)));
    const overlap = Math.floor(compressionFactor * maxOverlap);
    const scale = 1 - (compressionFactor * 0.05); // Subtle scale reduction
    
    return { tabWidth, overlap, scale, compressionFactor };
  }, [tabs.length]);
  
  // Check if tabs overflow and scroll to active tab when it changes
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    
    // Scroll to active tab when it changes
    if (activeTab && scrollRef.current) {
      const activeTabElement = scrollRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeTabElement) {
        const scrollContainer = scrollRef.current;
        const tabRect = activeTabElement.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        // Center the active tab if it's outside the visible area
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          const scrollLeft = activeTabElement.offsetLeft - (scrollContainer.clientWidth / 2) + (tabRect.width / 2);
          scrollContainer.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }

    const resizeObserver = new ResizeObserver(checkScroll);
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [tabs, selectedDocuments, activeTab]);
  
  // Handle mouse wheel scrolling
  const handleWheel = (e) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };
  
  // Handle tab hover for tooltip
  const handleTabHover = (tabId, title) => {
    setHoveredTab({ id: tabId, title });
    
    // Clear any existing tooltip timer
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
    }
    
    // Set a new timer to show tooltip after 2 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);
    
    setTooltipTimer(timer);
  };
  
  // Handle tab hover end
  const handleTabHoverEnd = () => {
    if (tooltipTimer) {
      clearTimeout(tooltipTimer);
    }
    setShowTooltip(false);
    setHoveredTab(null);
  };

  return (
    <div className="flex-1 flex items-center overflow-hidden">
      {/* Scroll Buttons */}
      {showScrollButtons && (
        <button 
          className="p-1.5 mr-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Tabs Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-x-auto hide-scrollbar"
        onWheel={handleWheel}
      >
        {/* Fixed Container for Tabs - Prevents layout shifts */}
        <div className="flex items-center">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isSelected = selectedDocuments?.some(doc => doc === tab.title);
            
            // Apply increased z-index for active tab and hover state
            const zIndex = isActive ? 20 : 10 - Math.min(10, Math.abs(tabs.length/2 - index));
            
            return (
              <div
                key={tab.id}
                data-tab-id={tab.id}
                style={{
                  zIndex: zIndex,
                  marginLeft: index === 0 ? '0px' : `-${tabProperties.overlap}px`,
                  width: `${isActive ? tabProperties.tabWidth + 20 : tabProperties.tabWidth}px`,
                  // Use fixed height to prevent vertical jitter
                  height: '38px'
                }}
                className="flex items-center relative"
              >
                <div
                  onClick={() => onTabChange(tab.id)}
                  onMouseEnter={() => handleTabHover(tab.id, tab.title)}
                  onMouseLeave={handleTabHoverEnd}
                  className={`
                    group flex items-center justify-between h-full w-full
                    rounded-md cursor-pointer transition-all duration-200
                    ${isActive 
                      ? 'bg-gray-200 text-gray-800' 
                      : isSelected
                        ? 'bg-gray-100 hover:bg-gray-50 border-b-4 border-primary' 
                        : 'bg-white text-gray-800 hover:bg-gray-50'
                    }
                    ${tabProperties.compressionFactor > 0 ? 'px-2 border border-gray-200' : 'px-3'}
                  `}
                >
                  <span 
                    className={`
                      truncate
                      ${isActive ? "text-m font-medium border-primary px-1" : "text-sm font-small"} 
                    `}
                    style={{
                      maxWidth: `${isActive ? tabProperties.tabWidth - 30 : tabProperties.tabWidth - 40}px`
                    }}
                  >
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
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Tooltip */}
                  {hoveredTab?.id === tab.id && showTooltip && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5
                        bg-gray-300 text-black text-sm rounded-sm shadow-lg z-[500] whitespace-nowrap"
                    >
                      {tab.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showScrollButtons && (
        <button 
          className="p-1.5 ml-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
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