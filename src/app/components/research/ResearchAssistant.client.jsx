// // src/app/components/research/ResearchAssistant.client.jsx
// 'use client';

// import dynamic from 'next/dynamic';

// // Dynamically import components that need browser APIs
// const DocumentViewer = dynamic(
//   () => import('./DocumentViewer.client'),
//   { ssr: false }
// );


// import { useState } from 'react';
// import { ResearchLayout } from './ResearchLayout.client';
// import { UploadSection } from './UploadSection.client';
// import { ProcessingStatus } from './ProcessingStatus.client';
// import { ResultsSection } from './ResultsSection.client';
// import { toast } from '../ui/Toast.client';

// export function ResearchAssistant() {
//   // Core state management
//   const [analysisState, setAnalysisState] = useState({
//     isProcessing: false,
//     currentStage: null,
//     progress: 0,
//     documentsProcessed: 0,
//     totalDocuments: 0
//   });
  
//   const [activeDocuments, setActiveDocuments] = useState([]);
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [savedDocuments, setSavedDocuments] = useState([]);

//   // Handle document analysis
//   const handleAnalysis = async (formData) => {
//     try {
//       // Update initial processing state
//       const totalDocs = formData.getAll('files').length;
//       setAnalysisState({
//         isProcessing: true,
//         currentStage: 'processing',
//         progress: 0,
//         documentsProcessed: 0,
//         totalDocuments: totalDocs
//       });

//       const response = await fetch('/api/research/search', {
//         method: 'POST',
//         body: formData
//       });

//       if (!response.ok) {
//         throw new Error('Analysis failed');
//       }

//       const data = await response.json();
      
//       if (data.status === 'success') {
//         setActiveDocuments(data.results);
//         setAnalysisState(prev => ({
//           ...prev,
//           isProcessing: false,
//           currentStage: 'complete',
//           progress: 100,
//           documentsProcessed: totalDocs
//         }));
//         toast.success(data.message);
//       } else {
//         throw new Error(data.error);
//       }

//     } catch (error) {
//       console.error('Research analysis error:', error);
//       toast.error(error.message || 'Failed to analyze documents');
//       setAnalysisState(prev => ({
//         ...prev,
//         isProcessing: false,
//         currentStage: null,
//         progress: 0
//       }));
//     }
//   };

//   // Document management handlers
//   const handleSaveDocument = async (documentId) => {
//     try {
//       const document = activeDocuments.find(doc => doc.document_id === documentId);
//       if (!document) return;

//       setSavedDocuments(prev => [...prev, document]);
//       toast.success('Document saved successfully');
//     } catch (error) {
//       toast.error('Failed to save document');
//     }
//   };

//   const handleRemoveDocument = async (documentId) => {
//     try {
//       setActiveDocuments(prev => prev.filter(doc => doc.document_id !== documentId));
//       setSavedDocuments(prev => prev.filter(doc => doc.document_id !== documentId));
      
//       const response = await fetch('/api/research/search', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ document_ids: [documentId] })
//       });

//       if (!response.ok) throw new Error('Failed to remove document');
//       toast.success('Document removed successfully');

//     } catch (error) {
//       toast.error('Failed to remove document');
//     }
//   };

//   // Document viewer handlers
//   const handleViewDocument = (documentId) => {
//     const document = activeDocuments.find(doc => doc.document_id === documentId);
//     if (document) {
//       setSelectedDocument(document);
//     }
//   };

//   return (
//     <ResearchLayout savedDocuments={savedDocuments}>
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Upload Section */}
//         <div className="bg-background rounded-lg border border-tertiary/10 p-6">
//           <h2 className="text-xl font-semibold text-primary mb-4">
//             Research Assistant
//           </h2>
//           <UploadSection 
//             onAnalyze={handleAnalysis} 
//             isProcessing={analysisState.isProcessing} 
//           />
//         </div>

//         {/* Processing Status */}
//         {analysisState.isProcessing && (
//           <ProcessingStatus 
//             currentStage={analysisState.currentStage}
//             progress={analysisState.progress}
//             documentsProcessed={analysisState.documentsProcessed}
//             totalDocuments={analysisState.totalDocuments}
//           />
//         )}

//         {/* Results Section */}
//         {activeDocuments.length > 0 && (
//           <ResultsSection
//             results={activeDocuments}
//             onRemoveDocument={handleRemoveDocument}
//             onSaveDocument={handleSaveDocument}
//             onToggleViewer={handleViewDocument}
//           />
//         )}

//         {/* Document Viewer */}
//         {selectedDocument && (
//           <DocumentViewer
//             documentUrl={selectedDocument.url}
//             metadata={{
//               title: selectedDocument.title,
//               authors: selectedDocument.authors,
//               citation: selectedDocument.citation,
//               pageCount: selectedDocument.total_pages
//             }}
//             relevantSections={selectedDocument.relevant_sections}
//             onClose={() => setSelectedDocument(null)}
//           />
//         )}
//       </div>
//     </ResearchLayout>
//   );
// }

// export default ResearchAssistant;






// src/app/components/research/ResearchAssistant.client.jsx
'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { toast } from '../ui/Toast.client';
import { UploadSection } from './UploadSection/UploadSection.client';
import { ProcessingStatus } from './ProcessingStatus/ProcessingStatus.client';
import { ResultsContainer } from './Results/ResultsContainer.client';

// Dynamically import components that need browser APIs
const DocumentViewer = dynamic(
  () => import('./DocumentViewer/DocumentViewer.client'),
  { ssr: false }
);

// Processing stages for status tracking
const PROCESSING_STAGES = {
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  ANALYSIS: 'analysis',
  CONTEXT: 'context',
  COMPLETE: 'complete'
};

export function ResearchAssistant() {
  // Core state management
  const [processingState, setProcessingState] = useState({
    stage: null,
    isProcessing: false,
    progress: 0,
    processedCount: 0,
    totalCount: 0
  });
  
  // Document management state
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeTheme, setActiveTheme] = useState(null);
  const [savedDocuments, setSavedDocuments] = useState([]);

  // Search parameters state
  const [searchParams, setSearchParams] = useState({
    context: '',
    theme: null,
    keywords: []
  });

  // Handle document analysis
  const handleAnalysis = useCallback(async (formData) => {
    console.log("handle analysis")
    try {
      // Update initial processing state
      setProcessingState({
        stage: PROCESSING_STAGES.UPLOAD,
        isProcessing: false,
        progress: 0,
        processedCount: 0,
        totalCount: formData.getAll('files').length
      });

      // Simulate different processing stages
      const simulateStage = async (stage, duration) => {
        setProcessingState(prev => ({ ...prev, stage }));
        for (let i = 0; i <= 100; i += 5) {
          await new Promise(resolve => setTimeout(resolve, duration / 20));
          updateProgress(stage, i);
        }
      };
      console.log("Simulating stages")

      // Simulate processing stages
      await simulateStage(PROCESSING_STAGES.UPLOAD, 50);
      await simulateStage(PROCESSING_STAGES.PROCESSING, 50);
      await simulateStage(PROCESSING_STAGES.ANALYSIS, 50);
      await simulateStage(PROCESSING_STAGES.CONTEXT, 50);

      // Make API request
      console.log("Sending request")
      const response = await fetch('/api/research/search', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.error);
      }

      // Update documents with results
      setDocuments(data.results);
      setActiveTheme(JSON.parse(formData.get('theme')));
      
      // Update processing state to complete
      setProcessingState(prev => ({
        ...prev,
        stage: PROCESSING_STAGES.COMPLETE,
        isProcessing: false,
        progress: 100,
        processedCount: prev.totalCount
      }));

      toast.success(`Successfully analyzed ${data.results.length} documents`);

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze documents');
      
      // Reset processing state
      setProcessingState({
        stage: null,
        isProcessing: false,
        progress: 0,
        processedCount: 0,
        totalCount: 0
      });
    }
  }, []);

  // Handle document saving
  const handleSaveDocument = useCallback(async (documentId) => {
    try {
      const document = documents.find(doc => doc.document_id === documentId);
      if (!document) throw new Error('Document not found');

      setSavedDocuments(prev => [...prev, { ...document, saved_at: new Date() }]);
      toast.success('Document saved successfully');

    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save document');
    }
  }, [documents]);

  // Handle document removal
  const handleRemoveDocument = useCallback(async (documentId) => {
    try {
      const response = await fetch('/api/research/search', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentIds: [documentId],
          theme: activeTheme 
        })
      });

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.error);
      }

      // Remove document from state
      setDocuments(prev => prev.filter(doc => doc.document_id !== documentId));
      
      if (selectedDocument?.document_id === documentId) {
        setSelectedDocument(null);
      }

      toast.success('Document removed successfully');

    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove document');
    }
  }, [activeTheme, selectedDocument]);

  // Handle document selection for viewing
  const handleDocumentSelect = useCallback((document) => {
    setSelectedDocument(document);
  }, []);

  // Handle search parameter updates
  const handleSearchUpdate = useCallback((newParams) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams
    }));
  }, []);

  // Update progress during processing
  const updateProgress = useCallback((stage, progress) => {
    setProcessingState(prev => ({
      ...prev,
      stage,
      progress,
      processedCount: Math.floor((progress / 100) * prev.totalCount)
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        <section>
          <UploadSection 
            onAnalyze={handleAnalysis}
            isProcessing={processingState.isProcessing}
            activeTheme={activeTheme}
            searchParams={searchParams}
            onSearchUpdate={handleSearchUpdate}
          />
        </section>

        {/* Processing Status */}
        {processingState.isProcessing && (
          <section>
            <ProcessingStatus
              stage={processingState.stage}
              progress={processingState.progress}
              processedCount={processingState.processedCount}
              totalCount={processingState.totalCount}
            />
          </section>
        )}

        {/* Results Section */}
        {documents.length > 0 && !processingState.isProcessing && (
          <section className="animate-in fade-in slide-in-from-bottom-4">
            <ResultsContainer
              documents={documents}
              onRemoveDocument={handleRemoveDocument}
              onSaveDocument={handleSaveDocument}
              onViewDocument={handleDocumentSelect}
            />
          </section>
        )}

        {/* Document Viewer */}
        {selectedDocument && (
      <DocumentViewer
        document={{
          file_url: selectedDocument.url,
          metadata: {
            title: selectedDocument.title,
            authors: selectedDocument.authors,
            citation: selectedDocument.citation,
            pageCount: selectedDocument.total_pages
          },
          pointers: selectedDocument.relevant_sections.map(section => ({
            section_id: section.section_id,
            page_number: section.page_number,
            section_start: section.start_text,
            text: section.content,
            matching_context: section.matching_context,
            matching_theme: section.matching_theme
          }))
        }}
        onClose={() => setSelectedDocument(null)}
        onRemove={handleRemoveDocument}
        onSave={handleSaveDocument}
      />
    )}
      </div> 
    </div>
  
  )
}

export default ResearchAssistant;