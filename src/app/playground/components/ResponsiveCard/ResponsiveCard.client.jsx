// src/app/playground/components/ResponsiveCard/ResponsiveCard.client.jsx
'use client';

import Image from 'next/image';
import { useResponsiveCard } from './ResponsiveCardLogic';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

export default function ResponsiveCard({
  title,
  description,
  features,
  metrics,
  price,
  image,
  tags,
  ctaButton,
  status
}) {
  const {
    isExpanded,
    toggleExpand,
    activeMetric,
    handleMetricChange,
    handleCtaClick,
    formatPrice
  } = useResponsiveCard({ metrics, features, ctaButton });

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Card Header */}
      <div className="relative  ">
      <Image 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2  ">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-indigo-500 text-white text-sm font-semibold rounded-full  "
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 scrollbar-hide">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-500 mt-1">{description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(price.amount)}
            </div>
            <div className="text-gray-500">per {price.period}</div>
          </div>
        </div>

        {/* Metrics Carousel */}
        <div className="flex justify-between mb-6 bg-gray-50 p-4 rounded-lg">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`text-center cursor-pointer transition-all duration-300 ${
                activeMetric === index ? 'scale-110 text-indigo-600' : 'text-gray-600'
              }`}
              onClick={() => handleMetricChange(index)}
            >
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className={`space-y-3 ${isExpanded ? 'block' : 'hidden md:block'}`}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Mobile Expand Button */}
        <button
          onClick={toggleExpand}
          className="w-full md:hidden mt-4 text-indigo-600 flex items-center justify-center"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              <span>Show More</span>
              <ChevronDown className="ml-2 h-5 w-5" />
            </>
          )}
        </button>

        {/* CTA Button */}
        <button
          onClick={handleCtaClick}
          className="w-full mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
        >
          {ctaButton.label}
        </button>
      </div>
    </div>
  );
}