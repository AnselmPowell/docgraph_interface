// src/app/playground/components/DraggableSeparator/DraggableSeparator.client.jsx
'use client';

import { useCallback, useRef } from 'react';

export default function DraggableSeparator({ onChange }) {
  const separatorRef = useRef(null);

  const handleDrag = useCallback(
    (e) => {
      if (!separatorRef.current) return;

      const container = separatorRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newPosition = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      
      // Convert to percentage and limit between 20% and 80%
      let percentage = (newPosition / containerWidth) * 100;
      percentage = Math.min(Math.max(percentage, 20), 80);
      
      onChange(percentage);
    },
    [onChange]
  );

  const initDrag = useCallback(
    (e) => {
      e.preventDefault();
      
      const mouseMoveHandler = (e) => {
        e.preventDefault();
        handleDrag(e);
      };

      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      document.body.style.userSelect = 'none';
    },
    [handleDrag]
  );

  return (
    <div
      ref={separatorRef}
      className="w-1 bg-gray-300 hover:bg-indigo-400 cursor-col-resize active:bg-indigo-600 transition-colors"
      onMouseDown={initDrag}
    />
  );
}