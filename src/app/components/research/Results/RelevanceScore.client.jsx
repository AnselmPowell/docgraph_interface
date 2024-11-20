// src/app/components/research/Results/RelevanceScore.client.jsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export function RelevanceScore({ score }) {
  const { color, ringColor, label } = useMemo(() => {
    if (score >= 80) {
      return {
        color: 'text-green-500',
        ringColor: 'ring-green-500',
        label: 'High'
      };
    } else if (score >= 60) {
      return {
        color: 'text-blue-500',
        ringColor: 'ring-blue-500',
        label: 'Good'
      };
    } else if (score >= 40) {
      return {
        color: 'text-amber-500',
        ringColor: 'ring-amber-500',
        label: 'Fair'
      };
    } else {
      return {
        color: 'text-red-500',
        ringColor: 'ring-red-500',
        label: 'Low'
      };
    }
  }, [score]);

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          relative inline-flex items-center justify-center
          w-12 h-12 rounded-full
          ring-2 ${ringColor}
          transition-colors duration-300
        `}
      >
        {/* Circular progress background */}
        <svg className="absolute w-full h-full">
          <circle
            className="text-gray-200"
            strokeWidth="2"
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="24"
            cy="24"
          />
          <motion.circle
            className={color}
            strokeWidth="2"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="24"
            cy="24"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              transformOrigin: "center",
              transform: "rotate(-90deg)",
            }}
          />
        </svg>

        {/* Score display */}
        <motion.span 
          className={`text-sm font-bold ${color}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
      </motion.div>
      <motion.p 
        className={`mt-1 text-xs ${color}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {label}
      </motion.p>
    </div>
  );
}