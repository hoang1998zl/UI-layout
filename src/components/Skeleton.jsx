import React from 'react';
import { motion } from 'framer-motion';

const SkeletonBase = ({ className = '', animate = true, ...props }) => {
  const baseClasses = "bg-gray-200 rounded";
  
  if (animate) {
    return (
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    );
  }
  
  return <div className={`${baseClasses} ${className}`} {...props} />;
};

// Individual skeleton components
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBase
        key={index}
        className={`h-4 ${index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  return (
    <SkeletonBase
      className={`${sizeClasses[size]} rounded-full ${className}`}
    />
  );
};

export const SkeletonButton = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28'
  };
  
  return (
    <SkeletonBase
      className={`${sizeClasses[size]} rounded-lg ${className}`}
    />
  );
};

export const SkeletonCard = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonAvatar size="md" />
      <div className="flex-1">
        <SkeletonBase className="h-4 w-1/4 mb-2" />
        <SkeletonBase className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex justify-between items-center mt-4">
      <SkeletonButton size="sm" />
      <SkeletonBase className="h-3 w-16" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="border-b border-gray-200 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonBase key={index} className="h-4 w-3/4" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b border-gray-100 p-4 last:border-b-0">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBase
              key={colIndex}
              className={`h-4 ${colIndex === 0 ? 'w-full' : 'w-2/3'}`}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Main Skeleton component with presets
export default function Skeleton({ 
  type = 'text', 
  lines = 1, 
  className = '',
  animate = true,
  ...props 
}) {
  switch (type) {
    case 'text':
      return <SkeletonText lines={lines} className={className} {...props} />;
    case 'avatar':
      return <SkeletonAvatar className={className} {...props} />;
    case 'button':
      return <SkeletonButton className={className} {...props} />;
    case 'card':
      return <SkeletonCard className={className} {...props} />;
    case 'table':
      return <SkeletonTable className={className} {...props} />;
    default:
      return <SkeletonBase className={`h-4 ${className}`} animate={animate} {...props} />;
  }
}