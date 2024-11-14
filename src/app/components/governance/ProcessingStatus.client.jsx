// src/app/components/governance/ProcessingStatus.client.jsx
'use client';

import { useEffect, useState } from 'react';
import { 
  Loader2, 
  FileText, 
  Search, 
  BarChart, 
  CheckCircle2
} from 'lucide-react';

export function ProcessingStatus({ status }) {
  const [progress, setProgress] = useState(0);
  
  const stages = [
    { 
      name: 'Document Processing', 
      icon: FileText,
      description: 'Parsing and extracting content'
    },
    { 
      name: 'Practice Extraction', 
      icon: Search,
      description: 'Analyzing governance practices'
    },
    { 
      name: 'Theme Analysis', 
      icon: BarChart,
      description: 'Identifying patterns and insights'
    }
  ];

  const currentStageIndex = Math.floor((progress / 100) * stages.length);

  useEffect(() => {
    if (status.status === 'processing') {
      const interval = setInterval(() => {
        setProgress(p => p < 95 ? p + 1.5 : p);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  if (!status.status) return null;

  return (
    <div className="card bg-background">
      {/* Header Section */}
      <div className="p-6 border-b border-tertiary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5">
              {status.status === 'processing' ? (
                <>
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <Loader2 className="w-5 h-5 animate-spin text-primary absolute inset-0" />
                </>
              ) : (
                <CheckCircle2 className="w-5 h-5 text-primary animate-in fade-in" />
              )}
            </div>
            <p className="text-sm font-medium text-primary">
              {status.status === 'processing' ? 'Analyzing Documents' : 'Analysis Complete'}
            </p>
          </div>
          <div className="text-sm text-secondary font-medium">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="mt-4 h-1.5 bg-tertiary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }} 
          />
        </div>

        {status.message && (
          <p className="text-xs text-tertiary mt-2">{status.message}</p>
        )}
      </div>

      {/* Stages Section */}
      <div className="p-6 pt-8">
        <div className="relative">
          {/* Stage Connection Line */}
          <div className="absolute top-5 left-[1.65rem] right-[1.65rem] h-0.5 bg-tertiary/10" />
          <div 
            className="absolute top-5 left-[1.65rem] h-0.5 bg-primary transition-all duration-500"
            style={{ width: `${(progress / 100) * (100 - (100/stages.length/2))}%` }} 
          />

          {/* Stages */}
          <div className="relative flex justify-between">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isActive = index === currentStageIndex;
              const isComplete = index < currentStageIndex;
              
              return (
                <div key={stage.name} className="text-center relative">
                  {/* Stage Icon */}
                  <div className={`
                    relative z-10 w-10 h-10 mx-auto rounded-full
                    flex items-center justify-center
                    transition-all duration-300
                    ${isActive ? 'bg-primary ring-4 ring-primary/20' : 
                      isComplete ? 'bg-primary' : 
                      'bg-background border-2 border-tertiary/20'
                    }
                  `}>
                    <StageIcon className={`
                      w-5 h-5
                      ${isActive || isComplete ? 'text-background' : 'text-tertiary'}
                      ${isActive ? 'animate-pulse' : ''}
                    `} />
                  </div>

                  {/* Stage Name */}
                  <div className="mt-4 space-y-1">
                    <p className={`
                      text-sm font-medium
                      ${isActive ? 'text-primary' : 
                        isComplete ? 'text-secondary' : 'text-tertiary'
                      }
                    `}>
                      {stage.name}
                    </p>
                    
                    {/* Description - Only show for active stage */}
                    {isActive && (
                      <p className="text-xs text-tertiary/80 max-w-[120px] mx-auto">
                        {stage.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}