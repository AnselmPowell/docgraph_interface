// src/app/components/research/ToolBar/ArxivSearch.client.jsx
'use client';

import { useState, useEffect } from 'react';
import { Search, TextSearch, Loader2, ExternalLink, Check, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { TbListSearch } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa6"
import { toast } from '../../messages/Toast.client';

export function ArxivSearch({ researchContext, onSetArxivSearchResult, searchArxivSearchResults, onUploadUrl }) {
  const [query, setQuery] = useState('');
  const [useContext, setUseContext] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(searchArxivSearchResults);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  useEffect(() => {
    if (researchContext) {
      setUseContext(true);
    }
  }, [researchContext]);

  useEffect(() => {
    setSearchResults(searchArxivSearchResults)
  }, []);
  
  const handleSearch = async () => {
    try {
      if (!useContext && !query.trim()) {
        toast.error('Please enter a search query');
        return;
      }
      
      if (useContext && !researchContext) {
        toast.error('No research context available. Please create one first.');
        return;
      }
      
      setIsSearching(true);
      
      const searchData = useContext 
        ? { context_id: researchContext.id, max_results_per_term: 6 }
        : { query, max_results: 10 };
      
      const response = await fetch('/api/research/arxiv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(searchData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search');
      }
      
      const data = await response.json();
      
      setSearchResults(data);
      onSetArxivSearchResult(data)
      
      // Initialize expanded state for categories
      if (data.categories) {
        const initialExpanded = {};
        data.categories.forEach(category => {
          initialExpanded[category.category] = true;
        });
        setExpandedCategories(initialExpanded);
      }
      
      toast.success('Search completed successfully');
    } catch (error) {
      console.error('Error searching arXiv:', error);
      toast.error(error.message || 'Failed to search');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleToggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
 
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-tertiary/10">
        <div className="flex items-center gap-2">
          <TbListSearch className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Research Papers</h2>
        </div>

        {researchContext && (
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useContext}
              onChange={() => setUseContext(!useContext)}
              className="mr-2 h-4 w-4"
              disabled={!researchContext}
            />
            <span className="text-sm text-secondary">
              {researchContext ? 'Use Research Context' : 'No Research Context Available'}
            </span>
          </label>
        </div>
      )}
      
      </div>
      {/* Search Form */}
      <div className="px-4 py-1 border-b border-tertiary/10">
        
        
        {!useContext && (
          <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter search query to find research papers..."
                className="w-full pl-10 pr-3 py-2 border border-tertiary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
        </div>
        )}
        
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className={`w-full flex ${  useContext ? 'items-center justify-center ' : 'items-end justify-end '} gap-2 py-1 rounded-md transition-colors pr-4  active:translate-y-[0.5px] active:scale-95${
            isSearching ? 'bg-tertiary/20 cursor-wait' : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          {isSearching ? (
             <div className='flex items-center gap-1' >
              Searching...
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <div className={`flex items-center gap-1 py-1 px-2  ${  useContext ? "text-m" : "text-sm" } text-gray-900 font-medium rounded-xl cursor-pointer hover:bg-gray-100 transition`}>
                {  useContext ? 
               
                <div className='flex items-center gap-1' >
                   <Search className="w-4 h-4" />
                    Search Using Research Context
              </div>
                : 
                <div className='flex items-center gap-1' >
                    Search
                </div>
                }
            </div>
          )}
        </button>
      </div>
      
      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {!searchResults && !isSearching && (
          <div className="text-center text-tertiary py-8">
            <TextSearch className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Search for research papers</p>
            {researchContext && (
              <p className="text-xs mt-2">
                Tip: Use your research context to find relevant papers automatically
              </p>
            )}
          </div>
        )}
        
        {/* Direct Search Results */}
        {searchResults && !searchResults.categories && (
          <div>
            <h3 className="text-md font-medium mb-4">
              Search Results for: {searchResults.query}
            </h3>
            {searchResults.results.map((paper, index) => (
              <PaperCard 
                key={index} 
                paper={paper} 
                onUploadUrl={onUploadUrl} 
              />
            ))}
          </div>
        )}
        
        {/* Context-Based Search Results */}
        {searchResults && searchResults.categories && (
          <div>
            <h3 className="text-md font-medium mb-1">
              Context-Based Search Results
            </h3>
            <p className="text-xs text-tertiary ">
              Results based on your research context: {searchResults.context_title || 'Research Context'}
            </p>
            
            {searchResults.categories.map((category, catIndex) => (
              <div key={catIndex} className="mb-2 border-b pb-3 mt-2 border-tertiary/20 rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between px-3 pt-3 bg-tertiary/5 cursor-pointer"
                  onClick={() => handleToggleCategory(category.category)}
                >
                  <div>
                    <h4 className="font-medium text-primary">{category.category}</h4>
                    {/* <p className="text-xs text-tertiary mt-1">{category.description}</p> */}
                  </div>
                  <div>
                    {expandedCategories[category.category] ? (
                      <ChevronUp className="w-5 h-5 text-tertiary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-tertiary" />
                    )}
                  </div>
                </div>
                
                {expandedCategories[category.category] && (
                  <div className="p-3">
                    <div className="px-2 py-1 bg-primary/5 rounded-md border-b border-tertiary/10 pb-2 mb-4">
                      <h5 className="text-xs font-medium mb-1">Search Terms Used:</h5>
                      <div className="flex flex-wrap gap-1">
                        {category.search_terms.map((term, termIndex) => (
                          <span 
                            key={termIndex}
                            className="text-xs p-1 py-2 m-2 bg-primary/10 text-primary rounded-xl bg-gray-100"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {category.papers.map((paper, paperIndex) => (
                        <PaperCard 
                          key={paperIndex} 
                          paper={paper} 
                          searchTerm={paper.search_term}
                          onUploadUrl={onUploadUrl} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaperCard({ paper, searchTerm, onUploadUrl }) {
  const [expanded, setExpanded] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  
  // Find the URL (typically the first link is the abstract, others are PDF, etc)
  const abstractUrl = paper.links.find(link => link.rel === 'alternate')?.href || paper.links[0]?.href;
  const pdfUrl = paper.links.find(link => link.title === 'pdf')?.href;
  
  // Format date string
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };
  
  const handleUploadUrl = async () => {

    console.log("PDF URL:", pdfUrl)
    const formData = new FormData();
    formData.append('url', pdfUrl);
    
    setUploadingPdf(true)
    await onUploadUrl(pdfUrl)
    setUploadingPdf(false)
  };
  
  return (
    <div className="border-b border-tertiary/20 rounded-lg overflow-hidden mb-1 pb-2">
      <div className="">
        {searchTerm && (
            <div className="mb-3">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Search term: {searchTerm}
                </span>
            </div>
            )}
        <div className="flex items-center justify-between bg-tertiary/5 p-2 ">
        
        <div className="flex items-center gap-2 pl-3">
          {abstractUrl && (
            <a
              href={abstractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-primary hover:underline active:translate-y-[0.5px] active:scale-95"
            >
              <ExternalLink className="w-3 h-3" />
              Abstract
            </a>
          )}
          
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-primary hover:underline active:translate-y-[0.5px] active:scale-95"
            >
              <ExternalLink className="w-3 h-3" />
              PDF
            </a>
          )}
        </div>
        
        <button
         title='Upload to StudyGraph'
          onClick={handleUploadUrl}
          disabled={uploadingPdf}
          className="text-xs flex items-center gap-1 text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition-colors active:translate-y-[0.5px] active:scale-95"
        >
          {uploadingPdf ? (
            <Check className="w-3 h-3" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          Upload
        </button>
      </div>
        
        <div className='flex '>
        <FaRegFilePdf className='w-8 h-8 mr-2'/>
        <h4 className="font-medium text-primary mb-1">{paper.title}</h4>
        </div>
        
        <div className="pl-6 flex flex-wrap text-xs text-tertiary mb-2">
          <span className="mr-3">{paper.authors.join(', ')}</span>
          <span>{formatDate(paper.published)}</span>
        </div>
        
        <div className={`text-sm text-secondary`}>
          {expanded && paper.summary}
        </div>
        
        {!expanded && (
          <button 
            onClick={() => setExpanded(true)}
            className="pl-6 text-xs text-primary mt-1 hover:underline font-medium active:translate-y-[0.5px] active:scale-95"
          >
            Read discription...
          </button>
        )}
        
        {expanded && (
          <button 
            onClick={() => setExpanded(false)}
            className="pl-6 text-xs text-primary mt-1 hover:underline active:translate-y-[0.5px] active:scale-95"
          >
            Hide discription
          </button>
        )}
      </div>
      
    </div>
  );
}