// src/app/components/research/Results/MatchIndicators.client.jsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,  // Context matches
  Lightbulb,  // Theme matches
  Tag,  // Keyword matches
  Link2  // Similar matches
} from 'lucide-react';

export function MatchIndicators({ matches, showLabels = false }) {
  const indicators = useMemo(() => ([
    {
      type: 'context',
      icon: Search,
      label: 'Context',
      count: matches.context,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100'
    },
    {
      type: 'theme',
      icon: Lightbulb,
      label: 'Theme',
      count: matches.theme,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100'
    },
    {
      type: 'keyword',
      icon: Tag,
      label: 'Keywords',
      count: matches.keyword,
      color: 'bg-green-500',
      lightColor: 'bg-green-100'
    },
    {
      type: 'similar',
      icon: Link2,
      label: 'Similar',
      count: matches.similar,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-100'
    }
  ]), [matches]);

  return (
    <div className="flex flex-wrap gap-2">
      {indicators.map(({ type, icon: Icon, label, count, color, lightColor }) => (
        count > 0 && (
          <motion.div
            key={type}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`
              inline-flex items-center gap-1.5
              px-2 py-1 rounded-full
              ${lightColor} 
              transition-colors duration-200
            `}
          >
            <Icon className={`w-3.5 h-3.5 ${color.replace('bg-', 'text-')}`} />
            <span className={`text-xs font-medium ${color.replace('bg-', 'text-')}`}>
              {count}
            </span>
            {showLabels && (
              <span className="text-xs text-gray-600">
                {label}
              </span>
            )}
          </motion.div>
        )
      ))}
    </div>
  );
}