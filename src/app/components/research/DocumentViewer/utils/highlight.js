// src/app/components/research/DocumentViewer/utils/highlight.js

export const HIGHLIGHT_COLORS = {
    search: 'rgba(255, 235, 59, 0.4)',    // Yellow
    pointer: 'rgba(33, 150, 243, 0.4)',   // Blue
    context: 'rgba(76, 175, 80, 0.4)',    // Green
    theme: 'rgba(156, 39, 176, 0.4)'      // Purple
};
  
export const findTextPositions = (
    pageContent,
    searchText,
    scale = 1
  )=> {
    const positions = [];
    const items = pageContent?.items || [];
    const text = searchText.toLowerCase();
  
    let currentMatch = '';
    let currentPositions = [];
  
    items.forEach((item) => {
      const itemText = item.str.toLowerCase();
      
      if (itemText.includes(text)) {
        positions.push({
          left: item.transform[4] * scale,
          top: item.transform[5] * scale,
          width: item.width * scale,
          height: item.height * scale,
          page: pageContent.pageNumber
        });
      } else {
        currentMatch += itemText;
        currentPositions.push(item);
  
        if (currentMatch.includes(text)) {
          // Calculate combined position
          const firstItem = currentPositions[0];
          const lastItem = currentPositions[currentPositions.length - 1];
  
          positions.push({
            left: firstItem.transform[4] * scale,
            top: firstItem.transform[5] * scale,
            width: (lastItem.transform[4] - firstItem.transform[4] + lastItem.width) * scale,
            height: Math.max(...currentPositions.map(p => p.height)) * scale,
            page: pageContent.pageNumber
          });
  
          currentMatch = '';
          currentPositions = [];
        }
      }
    });
  
    return positions;
  };