// // src/app/components/research/Results/ResultsContainer.client.jsx
// 'use client';

// import { useState, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { Search, BookOpen, Target } from 'lucide-react';
// import { ResultCard } from './ResultCard.client';

// export function ResultsContainer({ 
//   results = [],
//   onViewDocument
// }) {
//   const [selectedSort, setSelectedSort] = useState('relevance');
  
//   // Organize and sort results
//   const sortedResults = useMemo(() => {
//     const sorted = [...results].sort((a, b) => {
//       switch (selectedSort) {
//         case 'relevance':
//           return b.relevance_score - a.relevance_score;
//         case 'matches':
//           return b.matching_sections.length - a.matching_sections.length;
//         case 'title':
//           return a.title.localeCompare(b.title);
//         default:
//           return 0;
//       }
//     });
//     return sorted;
//   }, [results, selectedSort]);

//   // Calculate statistics
//   const stats = useMemo(() => ({
//     totalMatches: results.reduce((sum, doc) => sum + doc.matching_sections.length, 0),
//     totalDocuments: results.length,
//     averageRelevance: results.reduce((sum, doc) => sum + doc.relevance_score, 0) / results.length
//   }), [results]);

//   if (!results.length) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[50vh] text-center">
//         <Search className="w-12 h-12 text-tertiary mb-4" />
//         <h3 className="text-lg font-medium text-primary">No matches found</h3>
//         <p className="text-tertiary mt-2">Try adjusting your search criteria</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 px-6 py-4">
//       {/* Results Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-semibold text-primary">
//             Search Results
//           </h2>
//           <p className="text-sm text-tertiary mt-1">
//             Found matches in {stats.totalDocuments} documents
//           </p>
//         </div>

//         <select
//           value={selectedSort}
//           onChange={(e) => setSelectedSort(e.target.value)}
//           className="px-3 py-1.5 rounded-lg text-sm bg-background border border-tertiary/20 text-primary focus:border-primary"
//         >
//           <option value="relevance">Sort by Relevance</option>
//           <option value="matches">Sort by Matches</option>
//           <option value="title">Sort by Title</option>
//         </select>
//       </div>

//       {/* Results Stats */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
//           <div className="flex items-center gap-2 mb-1">
//             <Search className="w-4 h-4 text-primary" />
//             <h3 className="text-sm font-medium text-primary">Total Matches</h3>
//           </div>
//           <p className="text-2xl font-semibold text-primary">{stats.totalMatches}</p>
//         </div>
        
//         <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
//           <div className="flex items-center gap-2 mb-1">
//             <BookOpen className="w-4 h-4 text-blue-500" />
//             <h3 className="text-sm font-medium text-blue-500">Documents</h3>
//           </div>
//           <p className="text-2xl font-semibold text-blue-500">{stats.totalDocuments}</p>
//         </div>
        
//         <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
//           <div className="flex items-center gap-2 mb-1">
//             <Target className="w-4 h-4 text-green-500" />
//             <h3 className="text-sm font-medium text-green-500">Avg. Relevance</h3>
//           </div>
//           <p className="text-2xl font-semibold text-green-500">
//             {Math.round(stats.averageRelevance)}%
//           </p>
//         </div>
//       </div>

//       {/* Results List */}
//       <div className="space-y-4">
//         {sortedResults.map((result) => (
//           <motion.div
//             key={result.document_id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <ResultCard 
//               result={result}
//               onView={onViewDocument}
//             />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }




