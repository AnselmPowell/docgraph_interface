// src/app/playground/components/ResponsiveCard/ResponsiveCardLogic.js
import { useState } from 'react';

export const useResponsiveCard = ({ metrics, features, ctaButton }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleMetricChange = (index) => {
    setActiveMetric(index);
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    ctaButton.onClick?.();
  };

  // Format price to always show 2 decimal places
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return {
    isExpanded,
    toggleExpand,
    activeMetric,
    handleMetricChange,
    handleCtaClick,
    formatPrice,
  };
};