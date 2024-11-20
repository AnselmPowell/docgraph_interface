// src/app/components/research/ProcessingStatus.client.jsx
'use client';

import { useEffect, useMemo } from 'react';
import { 
  FileText,      // Document processing
  Search,        // Content analysis
  BookOpen,      // Context matching
  Link,          // Connection finding
  Check,         // Completion
  Loader2
} from 'lucide-react';

const STAGES = [
  {
    id: 'processing',
    title: 'Document Processing',
    description: 'Analyzing document structure and content',
    icon: FileText
  },
  {
    id: 'analysis',
    title: 'Content Analysis',
    description: 'Extracting key information and themes',
    icon: Search
  },
  {
    id: 'context',
    title: 'Context Matching',
    description: 'Finding relevant sections',
    icon: BookOpen
  },
  {
    id: 'connections',
    title: 'Finding Connections',
    description: 'Identifying related content across documents',
    icon: Link
  }
];

export function ProcessingStatus({ 
  currentStage,
  progress,
  documentsProcessed = 0,
  totalDocuments = 0
}) {
  // Calculate current stage index
  const currentStageIndex = useMemo(() => {
    return Math.max(0, STAGES.findIndex(stage => stage.id === currentStage));
  }, [currentStage]);

  // Calculate progress for progress bar
  const progressWidth = useMemo(() => {
    if (!currentStage) return 0;
    const baseProgress = (currentStageIndex / STAGES.length) * 100;
    const stageProgress = (progress / 100) * (100 / STAGES.length);
    return Math.min(baseProgress + stageProgress, 100);
  }, [currentStageIndex, progress, currentStage]);

  return (
    <div className="bg-background rounded-lg border border-tertiary/10 p-6 animate-in fade-in">
      {/* Header with document count */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-primary">
          Analyzing Documents
        </h3>
        <span className="text-sm text-tertiary">
          {documentsProcessed} of {totalDocuments} documents
        </span>
      </div>

      {/* Main progress bar */}
      <div className="relative h-2 bg-tertiary/10 rounded-full overflow-hidden mb-8">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Stages display */}
      <div className="relative">
        {/* Stage connection line */}
        <div className="absolute top-6 left-6 right-6 h-px bg-tertiary/10" />
        
        {/* Progress line */}
        <div 
          className="absolute top-6 left-6 h-px bg-primary transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        />

        {/* Stages */}
        <div className="relative grid grid-cols-4 gap-4">
          {STAGES.map((stage, index) => {
            const StageIcon = stage.icon;
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            const isFuture = index > currentStageIndex;

            return (
              <div 
                key={stage.id}
                className={`
                  flex flex-col items-center
                  ${isFuture ? 'opacity-50' : ''}
                `}
              >
                {/* Stage Icon */}
                <div className={`
                  relative z-10 w-12 h-12 rounded-full
                  flex items-center justify-center
                  transition-all duration-200
                  ${isActive ? 'bg-primary ring-4 ring-primary/20' : 
                    isCompleted ? 'bg-primary' : 
                    'bg-background border-2 border-tertiary/20'}
                `}>
                  {isActive ? (
                    <Loader2 className="w-6 h-6 text-background animate-spin" />
                  ) : (
                    <StageIcon className={`
                      w-6 h-6
                      ${isCompleted ? 'text-background' : 'text-tertiary'}
                    `} />
                  )}

                  {/* Completion check mark */}
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 bg-background rounded-full">
                      <Check className="w-4 h-4 text-primary" />
                    </span>
                  )}
                </div>

                {/* Stage Title */}
                <div className="mt-4 text-center">
                  <h4 className={`
                    text-sm font-medium mb-1
                    ${isActive ? 'text-primary' : 
                      isCompleted ? 'text-secondary' : 
                      'text-tertiary'}
                  `}>
                    {stage.title}
                  </h4>
                  
                  {/* Description - Only show for active stage */}
                  {isActive && (
                    <p className="text-xs text-tertiary">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status message */}
      <div className="mt-6 text-center">
        <p className="text-sm text-tertiary">
          {currentStage === 'complete' 
            ? 'Analysis complete!'
            : 'Please wait while we analyze your documents...'}
        </p>
      </div>
    </div>
  );
}

export default ProcessingStatus;