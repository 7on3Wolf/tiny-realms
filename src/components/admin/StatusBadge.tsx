import React from 'react';
import { ArtworkStatus } from '../../types';

interface StatusBadgeProps {
  status?: ArtworkStatus;
  published?: boolean;
  type?: 'status' | 'published';
  className?: string;
  onClick?: () => void;
}

export default function StatusBadge({
  status,
  published,
  type = 'status',
  className = '',
  onClick,
}: StatusBadgeProps) {
  if (type === 'published') {
    const isPublished = Boolean(published);
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
          isPublished
            ? 'bg-[#7FAF45]/30 text-[#F5EBDD] border border-[#7FAF45]'
            : 'bg-[#77736D]/40 text-[#CDBCA8] border border-[#77736D]'
        } ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            isPublished ? 'bg-[#7FAF45]' : 'bg-[#CDBCA8]'
          }`}
        />
        {isPublished ? 'Published' : 'Draft'}
      </span>
    );
  }

  // Commercial status badges
  const getStatusStyles = (st?: ArtworkStatus) => {
    switch (st) {
      case 'Available':
        return 'bg-[#7FAF45]/30 text-[#F5EBDD] border-[#7FAF45]';
      case 'Sold':
        return 'bg-[#77736D]/40 text-[#CDBCA8] border-[#77736D]';
      case 'Reserved':
        return 'bg-[#70431F] text-[#D9A85C] border-[#C69B5A]/60';
      case 'Archived':
        return 'bg-[#24170F] text-[#CDBCA8] border-[#5A351E]';
      default:
        return 'bg-[#4A2D1A] text-[#CDBCA8] border-[#5A351E]';
    }
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusStyles(
        status
      )} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
    >
      {status || 'Unknown'}
    </span>
  );
}
