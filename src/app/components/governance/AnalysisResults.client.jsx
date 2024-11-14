// src/app/components/governance/AnalysisResults.client.jsx
'use client';

import { useState } from 'react';
import { 
    ChevronDown, 
    ChevronUp, 
    CheckCircle, 
    XCircle, 
    BarChart2, 
    FileText, 
    Tag 
} from 'lucide-react';

// Tab Button Component
const TabButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            active 
                ? 'border-primary text-primary' 
                : 'border-transparent text-tertiary hover:text-secondary hover:border-tertiary/50'
        }`}
    >
        {children}
    </button>
);

// Practice Item Component
const PracticeItem = ({ item, type }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isGood = type === 'practice';
    
    return (
        <div className={`p-3 rounded-lg transition-all duration-200 ${
            isGood ? 'bg-accent/5' : 'bg-primary/5'
        }`}>
            {/* Header */}
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-start justify-between cursor-pointer gap-2"
            >
                <div className="flex-1">
                    <p className="text-sm text-secondary">{item.text}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.themes.map((theme, tIndex) => (
                            <span 
                                key={tIndex} 
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                    isGood 
                                        ? 'bg-accent/10 text-accent' 
                                        : 'bg-primary/10 text-primary'
                                }`}
                            >
                                {theme}
                            </span>
                        ))}
                    </div>
                </div>
                <ChevronDown 
                    className={`w-5 h-5 text-tertiary transition-transform ${
                        isExpanded ? 'transform rotate-180' : ''
                    }`}
                />
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-tertiary/10 space-y-3 animate-expand">
                    {/* Context Section */}
                    {item.context && (
                        <div>
                            <h5 className="text-xs font-medium text-tertiary mb-1">Context</h5>
                            <p className="text-sm text-secondary">{item.context}</p>
                        </div>
                    )}
                    
                    {/* Impact Section */}
                    {item.impact && (
                        <div>
                            <h5 className="text-xs font-medium text-tertiary mb-1">Impact</h5>
                            <p className="text-sm text-secondary">{item.impact}</p>
                        </div>
                    )}

                    {/* Confidence Score */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-tertiary">Confidence:</span>
                        <div className="flex-1 h-1.5 bg-tertiary/10 rounded-full">
                            <div 
                                className={`h-full rounded-full ${
                                    isGood ? 'bg-accent' : 'bg-primary'
                                }`}
                                style={{ width: `${item.confidence_score * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-tertiary">
                            {Math.round(item.confidence_score * 100)}%
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};


// Overview Tab Component
const OverviewTab = ({ results }) => {
    // Split practices and concerns
    const documents = results.documents.map(doc => ({
        ...doc,
        practices: doc.best_practices.filter(p => p.is_best_practice),
        concerns: doc.best_practices.filter(p => !p.is_best_practice)
    }));
 
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-background p-4">
                    <h3 className="text-sm font-medium text-tertiary mb-2">Documents Analyzed</h3>
                    <p className="text-2xl font-semibold text-primary">
                        {results.documents.length}
                    </p>
                </div>
                <div className="card bg-background p-4">
                    <h3 className="text-sm font-medium text-tertiary mb-2">Total Best Practices</h3>
                    <p className="text-2xl font-semibold text-accent">
                        {documents.reduce((sum, doc) => sum + doc.practices.length, 0)}
                    </p>
                </div>
                <div className="card bg-background p-4">
                    <h3 className="text-sm font-medium text-tertiary mb-2">Areas of Concern</h3>
                    <p className="text-2xl font-semibold text-primary">
                        {documents.reduce((sum, doc) => sum + doc.concerns.length, 0)}
                    </p>
                </div>
            </div>
 
            {/* Findings List */}
            {documents.map((doc, index) => (
                <div key={index} className="card bg-background p-4">
                    <h3 className="text-lg font-semibold text-primary mb-4">
                        {doc.document.filename}
                    </h3>
                    
                    {/* Best Practices Section */}
                    {doc.practices.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-accent flex items-center gap-2 mb-2">
                                <CheckCircle className="w-4 h-4" />
                                Best Practices
                            </h4>
                            <div className="space-y-2">
                                {doc.practices.map((practice, pIndex) => (
                                    <PracticeItem 
                                        key={pIndex} 
                                        item={practice} 
                                        type="practice"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
 
                    {/* Concerns Section */}
                    {doc.concerns.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-primary flex items-center gap-2 mb-2">
                                <XCircle className="w-4 h-4" />
                                Areas of Concern
                            </h4>
                            <div className="space-y-2">
                                {doc.concerns.map((concern, cIndex) => (
                                    <PracticeItem 
                                        key={cIndex} 
                                        item={concern} 
                                        type="concern"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
 };
 
 // Theme Analysis Tab Component
 const ThemeAnalysisTab = ({ results }) => {
    // Collect themes across all documents
    const themeMap = new Map();
    
    results.documents.forEach(doc => {
        doc.document_themes.forEach(theme => {
            if (!themeMap.has(theme)) {
                themeMap.set(theme, {
                    name: theme,
                    count: 0,
                    documents: new Set(),
                    practices: [],
                    concerns: []
                });
            }
            const themeData = themeMap.get(theme);
            themeData.count++;
            themeData.documents.add(doc.document.filename);
            
            // Collect related practices and concerns
            doc.best_practices.forEach(practice => {
                if (practice.themes.includes(theme)) {
                    if (practice.is_best_practice) {
                        themeData.practices.push(practice);
                    } else {
                        themeData.concerns.push(practice);
                    }
                }
            });
        });
    });
 
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="card bg-background p-4">
                <h3 className="text-lg font-semibold text-primary mb-4">Theme Distribution</h3>
                <div className="grid gap-4">
                    {Array.from(themeMap.values()).map((theme, index) => (
                        <div key={index} className="border-b border-tertiary/10 pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-primary">{theme.name}</h4>
                                <span className="text-sm text-tertiary">
                                    {theme.documents.size} documents
                                </span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="text-accent">
                                    {theme.practices.length} best practices
                                </span>
                                <span className="text-primary">
                                    {theme.concerns.length} concerns
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
 };
 
 // Document Details Tab Component
 const DocumentDetailsTab = ({ results }) => {
    const [expandedDoc, setExpandedDoc] = useState(null);
 
    return (
        <div className="space-y-4 animate-fade-in">
            {results.documents.map((doc, index) => (
                <div key={index} className="card bg-background p-4">
                    <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedDoc(expandedDoc === index ? null : index)}
                    >
                        <div>
                            <h3 className="font-medium text-primary">{doc.document.filename}</h3>
                            <p className="text-sm text-tertiary">
                                {doc.document_themes.length} themes • {doc.best_practices.length} findings
                            </p>
                        </div>
                        {expandedDoc === index ? (
                            <ChevronUp className="w-5 h-5 text-tertiary" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-tertiary" />
                        )}
                    </div>
 
                    {expandedDoc === index && (
                        <div className="mt-4 space-y-4 animate-expand">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-tertiary">Upload Date</p>
                                    <p className="text-secondary">{new Date(doc.document.upload_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-tertiary">File Size</p>
                                    <p className="text-secondary">{(doc.document.file_size / 1024).toFixed(2)} KB</p>
                                </div>
                                <div>
                                    <p className="text-tertiary">Pages</p>
                                    <p className="text-secondary">{doc.document.total_pages}</p>
                                </div>
                            </div>
 
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-primary">Document Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {doc.document_themes.map((theme, tIndex) => (
                                        <span 
                                            key={tIndex}
                                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                                        >
                                            {theme}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
 };
 
 // Main AnalysisResults Component
 export function AnalysisResults({ results }) {
    const [activeTab, setActiveTab] = useState('overview');
 
    return (
        <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex gap-4 border-b border-tertiary/20">
                <TabButton 
                    active={activeTab === 'overview'} 
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </TabButton>
                <TabButton 
                    active={activeTab === 'themes'} 
                    onClick={() => setActiveTab('themes')}
                >
                    Theme Analysis
                </TabButton>
                <TabButton 
                    active={activeTab === 'details'} 
                    onClick={() => setActiveTab('details')}
                >
                    Document Details
                </TabButton>
            </div>
 
            {/* Content */}
            {activeTab === 'overview' && <OverviewTab results={results} />}
            {activeTab === 'themes' && <ThemeAnalysisTab results={results} />}
            {activeTab === 'details' && <DocumentDetailsTab results={results} />}
        </div>
    );
 }