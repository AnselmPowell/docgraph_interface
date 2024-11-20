// src/app/components/research/ProcessingStatus/ProcessingStatus.client.jsx
'use client';

import { useEffect, useMemo } from 'react';
import { 
  FileText,        // Document upload & initial processing
//   SplitSquare,     // Document parsing & sectioning
  Brain,           // Content extraction & analysis
  Search,          // Context matching
  Lightbulb,       // Theme analysis
  Link2,           // Cross-document linking
  Stars,           // Relevance scoring
  CheckCircle      // Completion
} from 'lucide-react';

// Map processing stages to backend pipeline
const PROCESSING_STAGES = [
  {
    id: 'upload',
    title: 'Document Processing',
    description: 'Uploading and preparing documents',
    icon: FileText,
    progress: 15,
    subStages: ['File verification', 'Format validation', 'Initial processing']
  },
  {
    id: 'parsing',
    title: 'Content Extraction',
    description: 'Parsing document structure and content',
    icon: FileText,
    progress: 30,
    subStages: ['Section identification', 'Content extraction', 'Structure analysis']
  },
  {
    id: 'analysis',
    title: 'Content Analysis',
    description: 'Analyzing document content and relationships',
    icon: Brain,
    progress: 50,
    subStages: [
      'Text processing',
      'Citation extraction',
      'Reference mapping'
    ]
  },
  {
    id: 'matching',
    title: 'Context Matching',
    description: 'Finding relevant content matches',
    icon: Search,
    progress: 65,
    subStages: [
      'Context analysis',
      'Semantic matching',
      'Relevance scoring'
    ]
  },
  {
    id: 'themes',
    title: 'Theme Analysis',
    description: 'Processing themes and relationships',
    icon: Lightbulb,
    progress: 80,
    subStages: [
      'Theme identification',
      'Cross-document themes',
      'Theme grouping'
    ]
  },
  {
    id: 'linking',
    title: 'Content Linking',
    description: 'Establishing document connections',
    icon: Link2,
    progress: 90,
    subStages: [
      'Section linking',
      'Reference connections',
      'Theme relationships'
    ]
  },
  {
    id: 'scoring',
    title: 'Final Processing',
    description: 'Calculating final scores and relationships',
    icon: Stars,
    progress: 95,
    subStages: [
      'Relevance calculation',
      'Document scoring',
      'Final validation'
    ]
  }
];

export function ProcessingStatus({ 
  currentStage,
  progress,
  documentsProcessed = 0,
  totalDocuments = 0
}) {
  // Calculate current stage and sub-stage
  const stageInfo = useMemo(() => {
    const stageIndex = Math.max(0, PROCESSING_STAGES.findIndex(s => s.id === currentStage));
    const stage = PROCESSING_STAGES[stageIndex];
    const subStageIndex = Math.floor((progress % (100 / PROCESSING_STAGES.length)) * stage.subStages.length);
    
    return {
      currentIndex: stageIndex,
      stage,
      subStage: stage?.subStages[subStageIndex] || ''
    };
  }, [currentStage, progress]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (!currentStage) return 0;
    const { currentIndex } = stageInfo;
    const baseProgress = (currentIndex / PROCESSING_STAGES.length) * 100;
    const stageProgress = (progress / 100) * (100 / PROCESSING_STAGES.length);
    return Math.min(baseProgress + stageProgress, 100);
  }, [stageInfo, progress, currentStage]);

  return (
    <div className="bg-background rounded-lg border border-tertiary/10 p-6 animate-in fade-in">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-primary">
            Processing Documents
          </h3>
          <p className="text-sm text-tertiary">
            {documentsProcessed} of {totalDocuments} documents processed
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">
            {Math.round(overallProgress)}%
          </span>
          <p className="text-xs text-tertiary">Overall Progress</p>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="relative h-2 bg-tertiary/10 rounded-full overflow-hidden mb-8">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Processing Stages */}
      <div className="relative">
        {/* Stage Connection Line */}
        <div className="absolute top-6 left-6 right-6 h-px bg-tertiary/10" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-6 left-6 h-px bg-primary transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />

        {/* Stages */}
        <div className="relative grid grid-cols-7 gap-4">
          {PROCESSING_STAGES.map((stage, index) => {
            const StageIcon = stage.icon;
            const isActive = index === stageInfo.currentIndex;
            const isCompleted = index < stageInfo.currentIndex;
            const isFuture = index > stageInfo.currentIndex;

            return (
              <div 
                key={stage.id}
                className={`
                  flex flex-col items-center
                  ${isFuture ? 'opacity-50' : ''}
                  transition-opacity duration-300
                `}
              >
                {/* Stage Icon */}
                <div className={`
                  relative z-10 w-12 h-12 rounded-full
                  flex items-center justify-center
                  transition-all duration-300
                  ${isActive ? 'bg-primary ring-4 ring-primary/20' : 
                    isCompleted ? 'bg-primary' : 
                    'bg-background border-2 border-tertiary/20'}
                `}>
                  {isActive ? (
                    <div className="animate-pulse">
                      <StageIcon className="w-6 h-6 text-background" />
                    </div>
                  ) : (
                    <StageIcon className={`
                      w-6 h-6
                      ${isCompleted ? 'text-background' : 'text-tertiary'}
                    `} />
                  )}

                  {/* Completion Check */}
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </span>
                  )}
                </div>

                {/* Stage Title & Description */}
                <div className="mt-4 text-center">
                  <h4 className={`
                    text-sm font-medium mb-1
                    ${isActive ? 'text-primary' : 
                      isCompleted ? 'text-secondary' : 
                      'text-tertiary'}
                  `}>
                    {stage.title}
                  </h4>
                  
                  {/* Show description and current sub-stage for active stage */}
                  {isActive && (
                    <div className="space-y-1 animate-in fade-in duration-300">
                      <p className="text-xs text-tertiary">
                        {stage.description}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {stageInfo.subStage}...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Processing Details */}
      <div className="mt-8 p-4 bg-tertiary/5 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary">
            Current Operation:
          </span>
          <span className="text-primary font-medium">
            {stageInfo.stage?.description}
          </span>
        </div>
        {stageInfo.subStage && (
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-secondary">
              Processing:
            </span>
            <span className="text-primary">
              {stageInfo.subStage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcessingStatus;