import React from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '../../types';
import StatusBadge from './StatusBadge';
import {
  Edit2,
  Trash2,
  Eye,
  Copy,
  Link as LinkIcon,
  Maximize2,
} from 'lucide-react';

interface ArtworkTableProps {
  artworks: Artwork[];
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
  onOpenLightbox?: (artwork: Artwork) => void;
  onTogglePublish: (artwork: Artwork) => void;
  onDuplicate: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworkTable({
  artworks,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  allSelected = false,
  onOpenLightbox,
  onTogglePublish,
  onDuplicate,
  onDelete,
}: ArtworkTableProps) {
  const selectedSet = new Set(selectedIds);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#24170F] border-b border-[#5A351E] text-[11px] font-semibold text-[#CDBCA8] uppercase tracking-wider">
            {/* Multi-select Header Checkbox */}
            {onSelectAll && (
              <th className="py-3.5 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected && artworks.length > 0}
                  onChange={onSelectAll}
                  aria-label="Select all artworks"
                  className="rounded border-[#5A351E] text-[#C69B5A] focus:ring-[#C69B5A] bg-[#24170F] cursor-pointer"
                />
              </th>
            )}
            <th className="py-3.5 px-3">Artwork</th>
            <th className="py-3.5 px-3">Code</th>
            <th className="py-3.5 px-4">Title</th>
            <th className="py-3.5 px-4">Collection</th>
            <th className="py-3.5 px-3">Year</th>
            <th className="py-3.5 px-3">Status</th>
            <th className="py-3.5 px-3">Published</th>
            <th className="py-3.5 px-3">NFT</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#5A351E] text-xs">
          {artworks.map((artwork) => {
            const isSelected = selectedSet.has(artwork.id);

            return (
              <tr
                key={artwork.id}
                className={`transition-colors ${
                  isSelected ? 'bg-[#70431F]/50' : 'hover:bg-[#70431F]/30'
                }`}
              >
                {/* Row Checkbox */}
                {onToggleSelect && (
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(artwork.id)}
                      aria-label={`Select artwork ${artwork.title}`}
                      className="rounded border-[#5A351E] text-[#C69B5A] focus:ring-[#C69B5A] bg-[#24170F] cursor-pointer"
                    />
                  </td>
                )}

                {/* Artwork Thumbnail with Lightbox trigger */}
                <td className="py-3.5 px-3">
                  <div
                    onClick={() => onOpenLightbox && onOpenLightbox(artwork)}
                    className="relative w-12 h-12 rounded-lg bg-[#24170F] p-0.5 border border-[#5A351E] overflow-hidden shrink-0 flex items-center justify-center cursor-pointer group hover:border-[#C69B5A] transition-colors"
                    title="Click to preview large image"
                  >
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5 text-[#F5EBDD]" />
                    </div>
                  </div>
                </td>

                {/* Code */}
                <td className="py-3.5 px-3 font-mono font-medium text-[#C69B5A] whitespace-nowrap">
                  {artwork.code}
                </td>

                {/* Title & Category */}
                <td className="py-3.5 px-4">
                  <div className="min-w-0">
                    <span className="font-bold text-[#F5EBDD] block truncate max-w-[200px] sm:max-w-xs">
                      {artwork.title}
                    </span>
                    <span className="text-[11px] text-[#CDBCA8] block truncate">
                      {artwork.category}
                    </span>
                  </div>
                </td>

                {/* Collection */}
                <td className="py-3.5 px-4 text-[#CDBCA8] whitespace-nowrap">
                  {artwork.collection}
                </td>

                {/* Year */}
                <td className="py-3.5 px-3 font-mono text-[#CDBCA8] whitespace-nowrap">
                  {artwork.year || 2026}
                </td>

                {/* Status */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <StatusBadge status={artwork.status} />
                </td>

                {/* Published Toggle Badge */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <StatusBadge
                    type="published"
                    published={artwork.published}
                    onClick={() => onTogglePublish(artwork)}
                  />
                </td>

                {/* NFT Link Status */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  {artwork.nftUrl ? (
                    <a
                      href={artwork.nftUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7FAF45] hover:underline"
                      title="External NFT link configured"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Linked</span>
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-[#77736D]">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    {/* Lightbox / Preview */}
                    <button
                      type="button"
                      onClick={() => onOpenLightbox && onOpenLightbox(artwork)}
                      className="p-1.5 rounded-lg text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#24170F] transition-colors cursor-pointer"
                      title="Quick Image Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => onDuplicate(artwork)}
                      className="p-1.5 rounded-lg text-[#CDBCA8] hover:text-[#C69B5A] hover:bg-[#24170F] transition-colors cursor-pointer"
                      title="Duplicate as draft"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <Link
                      to={`/admin/artworks/${artwork.id}/edit`}
                      className="p-1.5 rounded-lg text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#24170F] transition-colors"
                      title="Edit artwork"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDelete(artwork)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete artwork"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
