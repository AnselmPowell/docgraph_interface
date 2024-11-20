// src/app/components/research/DocumentViewer/components/LoadingOverlay.client.jsx
'use client';

import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-tertiary">Loading document...</p>
      </div>
    </div>
  );
}



// // src/app/components/research/DocumentViewer/components/LoadingOverlay.client.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   BookOpen,
//   Search,
//   FileText,
//   Highlighter,
//   BookMarked,
//   Link2,
//   Sparkles
// } from 'lucide-react';

// export function LoadingOverlay() {
//   const [loadingPhase, setLoadingPhase] = useState(0);
//   const [showTip, setShowTip] = useState(null);

//   // Research-related loading tips
//   const loadingTips = [
//     "Analyzing document structure...",
//     "Extracting relevant sections...",
//     "Processing academic citations...",
//     "Mapping cross-references...",
//     "Building knowledge index...",
//     "Preparing search capabilities...",
//   ];

//   // Research assistant tips
//   const researchTips = [
//     {
//       icon: Search,
//       tip: "Use Ctrl+F to quickly search within documents"
//     },
//     {
//       icon: Highlighter,
//       tip: "Highlight key findings for easy reference"
//     },
//     {
//       icon: BookMarked,
//       tip: "Save important sections for your research"
//     },
//     {
//       icon: Link2,
//       tip: "Connect related concepts across documents"
//     }
//   ];

//   // Rotate through loading phases
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLoadingPhase(prev => (prev + 1) % loadingTips.length);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   // Rotate through research tips
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setShowTip(prev => {
//         const next = prev === null ? 0 : (prev + 1) % researchTips.length;
//         return next;
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm">
//       <div className="max-w-md w-full mx-auto p-8">
//         {/* Main Loading Animation */}
//         <motion.div
//           className="flex flex-col items-center"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           {/* Animated Book Icon */}
//           <div className="relative w-16 h-16 mb-6">
//             <motion.div
//               className="absolute inset-0 flex items-center justify-center"
//               animate={{ 
//                 rotateY: [0, 180, 360],
//                 scale: [1, 1.1, 1]
//               }}
//               transition={{ 
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             >
//               <BookOpen className="w-16 h-16 text-primary" />
//             </motion.div>
//             <motion.div
//               className="absolute inset-0 flex items-center justify-center"
//               animate={{ 
//                 opacity: [0, 1, 0],
//                 scale: [0.8, 1.2, 0.8]
//               }}
//               transition={{ 
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             >
//               <Sparkles className="w-8 h-8 text-primary/50" />
//             </motion.div>
//           </div>

//           {/* Loading Phase Text */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={loadingPhase}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="text-center"
//             >
//               <h3 className="text-lg font-medium text-primary mb-2">
//                 Research Assistant
//               </h3>
//               <p className="text-sm text-secondary">
//                 {loadingTips[loadingPhase]}
//               </p>
//             </motion.div>
//           </AnimatePresence>

//           {/* Loading Progress */}
//           <div className="w-64 h-1 bg-tertiary/10 rounded-full mt-6 overflow-hidden">
//             <motion.div
//               className="h-full bg-primary rounded-full"
//               animate={{
//                 x: ["-100%", "100%"],
//               }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             />
//           </div>
//         </motion.div>

//         {/* Research Tips Section */}
//         <div className="mt-12">
//           <AnimatePresence mode="wait">
//             {showTip !== null && (
//               <motion.div
//                 key={showTip}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 className="flex items-center space-x-3 bg-tertiary/5 rounded-lg p-4"
//               >
//                 <div className="p-2 bg-primary/10 rounded-lg">
//                   {React.createElement(researchTips[showTip].icon, {
//                     className: "w-5 h-5 text-primary"
//                   })}
//                 </div>
//                 <p className="text-sm text-secondary">
//                   {researchTips[showTip].tip}
//                 </p>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Note about preparation */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="text-xs text-tertiary text-center mt-8"
//         >
//           Preparing your research environment for optimal analysis
//         </motion.p>
//       </div>
//     </div>
//   );
// }