import React from 'react';
import { Collection, ArtworkStatus } from '../../types';
import { RotateCcw } from 'lucide-react';

interface ArtworkFiltersProps {
  statusFilter: 'All' | ArtworkStatus;
  publishedFilter: 'All' | 'Published' | 'Draft';
  collectionFilter: string;
  sortBy: 'Newest' | 'Oldest' | 'Title A-Z' | 'Title Z-A' | 'Year Newest' | 'Year Oldest';
  collections: Collection[];
  onStatusChange: (status: 'All' | ArtworkStatus) => void;
  onPublishedChange: (published: 'All' | 'Published' | 'Draft') => void;
  onCollectionChange: (collection: string) => void;
  onSortChange: (sortBy: 'Newest' | 'Oldest' | 'Title A-Z' | 'Title Z-A' | 'Year Newest' | 'Year Oldest') => void;
  onReset: () => void;
  isFiltered: boolean;
}

export default function ArtworkFilters({
  statusFilter,
  publishedFilter,
  collectionFilter,
  sortBy,
  collections,
  onStatusChange,
  onPublishedChange,
  onCollectionChange,
  onSortChange,
  onReset,
  isFiltered,
}: ArtworkFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-xs">
      {/* Published Filter */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="filter-published" className="text-[11px] font-semibold text-[#CDBCA8] uppercase whitespace-nowrap">
          Visibility:
        </label>
        <select
          id="filter-published"
          value={publishedFilter}
          onChange={(e) => onPublishedChange(e.target.value as 'All' | 'Published' | 'Draft')}
          className="py-1.5 px-2.5 bg-[#24170F] border border-[#5A351E] rounded-lg text-xs text-[#F5EBDD] focus:outline-none focus:border-[#C69B5A] transition-colors cursor-pointer"
        >
          <option value="All">All Visibility</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Commercial Status Filter */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="filter-status" className="text-[11px] font-semibold text-[#CDBCA8] uppercase whitespace-nowrap">
          Status:
        </label>
        <select
          id="filter-status"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as 'All' | ArtworkStatus)}
          className="py-1.5 px-2.5 bg-[#24170F] border border-[#5A351E] rounded-lg text-xs text-[#F5EBDD] focus:outline-none focus:border-[#C69B5A] transition-colors cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Reserved">Reserved</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Collection Filter */}
      <div className="flex items-center gap-1.5">
        <label htmlFor="filter-collection" className="text-[11px] font-semibold text-[#CDBCA8] uppercase whitespace-nowrap">
          Collection:
        </label>
        <select
          id="filter-collection"
          value={collectionFilter}
          onChange={(e) => onCollectionChange(e.target.value)}
          className="py-1.5 px-2.5 bg-[#24170F] border border-[#5A351E] rounded-lg text-xs text-[#F5EBDD] focus:outline-none focus:border-[#C69B5A] transition-colors cursor-pointer max-w-[160px]"
        >
          <option value="All">All Collections</option>
          {collections.map((col) => (
            <option key={col.id} value={col.name}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="flex items-center gap-1.5 ml-auto">
        <label htmlFor="filter-sort" className="text-[11px] font-semibold text-[#CDBCA8] uppercase whitespace-nowrap">
          Sort:
        </label>
        <select
          id="filter-sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="py-1.5 px-2.5 bg-[#24170F] border border-[#5A351E] rounded-lg text-xs text-[#F5EBDD] focus:outline-none focus:border-[#C69B5A] transition-colors cursor-pointer"
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Title A-Z">Title (A-Z)</option>
          <option value="Title Z-A">Title (Z-A)</option>
          <option value="Year Newest">Year (Newest)</option>
          <option value="Year Oldest">Year (Oldest)</option>
        </select>
      </div>

      {/* Reset Filter Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#24170F] hover:bg-[#70431F] text-[#CDBCA8] hover:text-[#F5EBDD] border border-[#5A351E] text-xs font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
