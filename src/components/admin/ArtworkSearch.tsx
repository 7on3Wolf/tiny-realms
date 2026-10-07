import React from 'react';
import { Search, X } from 'lucide-react';

interface ArtworkSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  totalCount?: number;
  filteredCount?: number;
}

export default function ArtworkSearch({
  value,
  onChange,
  placeholder = 'Search artwork...',
  className = '',
}: ArtworkSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#CDBCA8]">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search artworks"
        className="w-full pl-10 pr-9 py-2 bg-[#24170F] border border-[#5A351E] rounded-lg text-xs text-[#F5EBDD] placeholder-[#CDBCA8]/60 focus:outline-none focus:border-[#C69B5A] transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#CDBCA8] hover:text-[#F5EBDD] cursor-pointer"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
