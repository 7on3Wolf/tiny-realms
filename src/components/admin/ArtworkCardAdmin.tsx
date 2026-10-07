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
  Layers,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ArtworkCardAdminProps {
  artwork: Artwork;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onOpenLightbox?: (artwork: Artwork) => void;
  onTogglePublish: (artwork: Artwork) => void;
  onDuplicate: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

export default function ArtworkCardAdmin({
  artwork,
  isSelected = false,
  onToggleSelect,
  onOpenLightbox,
  onTogglePublish,
  onDuplicate,
  onDelete,
}: ArtworkCardAdminProps) {
  return (
    <div
      className={`bg-[#4A2D1A] rounded-2xl border transition-all duration-200 overflow-hidden shadow-md flex flex-col ${
        isSelected ? 'border-[#C69B5A] ring-2 ring-[#C69B5A]/50' : 'border-[#5A351E] hover:border-[#8C5D19]'
      }`}
    >
      {/* ======================================================== */}
      {/* 1. ARTWORK IMAGE DISPLAY (1:1 Aspect Ratio)              */}
      {/* ======================================================== */}
      <div className="relative w-full aspect-square bg-[#24170F] p-3 flex items-center justify-center overflow-hidden border-b border-[#5A351E] group">
        <img
          src={artwork.image}
          alt={artwork.title}
          referrerPolicy="no-referrer"
          onClick={() => onOpenLightbox && onOpenLightbox(artwork)}
          className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top-Left Selection Checkbox */}
        {onToggleSelect && (
          <div className="absolute top-3 left-3 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(artwork.id)}
              aria-label={`Select ${artwork.title}`}
              className="w-4 h-4 rounded border-[#5A351E] text-[#C69B5A] focus:ring-[#C69B5A] bg-[#24170F] cursor-pointer shadow-md"
            />
          </div>
        )}

        {/* Top-Right Status Badge (Live vs Draft Toggle) */}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge
            type="published"
            published={artwork.published}
            onClick={() => onTogglePublish(artwork)}
          />
        </div>

        {/* Hover Lightbox Trigger Overlay */}
        <button
          type="button"
          onClick={() => onOpenLightbox && onOpenLightbox(artwork)}
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
          title="Click to preview large image"
        >
          <div className="px-3 py-1.5 rounded-full bg-[#24170F]/90 text-[#F5EBDD] border border-[#5A351E] flex items-center gap-1.5 text-xs font-mono shadow-md backdrop-blur-xs">
            <Maximize2 className="w-3.5 h-3.5 text-[#C69B5A]" />
            <span>Click to Preview</span>
          </div>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. CARD BODY & 2x2 METADATA GRID                        */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Header: Title & Code */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-base text-[#F5EBDD] truncate" title={artwork.title}>
              {artwork.title}
            </h3>
            <p className="text-xs text-[#CDBCA8] truncate mt-0.5">
              {artwork.category || 'Digital Character'}
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-[#C69B5A] bg-[#24170F] px-2.5 py-1 rounded-lg border border-[#5A351E] shrink-0">
            {artwork.code}
          </span>
        </div>

        {/* 2 x 2 Metadata Layout inside Card */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {/* Cell 1: Series / Collection */}
          <div className="p-2.5 rounded-xl bg-[#24170F]/90 border border-[#5A351E]/70 flex flex-col justify-center">
            <span className="text-[10px] text-[#CDBCA8] uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#C69B5A]" />
              <span>Series</span>
            </span>
            <span className="font-bold text-[#F5EBDD] truncate mt-0.5" title={artwork.collection}>
              {artwork.collection}
            </span>
          </div>

          {/* Cell 2: Year / Era */}
          <div className="p-2.5 rounded-xl bg-[#24170F]/90 border border-[#5A351E]/70 flex flex-col justify-center">
            <span className="text-[10px] text-[#CDBCA8] uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#C69B5A]" />
              <span>Year</span>
            </span>
            <span className="font-bold text-[#F5EBDD] mt-0.5">
              {artwork.year || 2026}
            </span>
          </div>

          {/* Cell 3: Commercial Status */}
          <div className="p-2.5 rounded-xl bg-[#24170F]/90 border border-[#5A351E]/70 flex flex-col justify-center">
            <span className="text-[10px] text-[#CDBCA8] uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3 h-3 text-[#C69B5A]" />
              <span>Status</span>
            </span>
            <div>
              <StatusBadge status={artwork.status} />
            </div>
          </div>

          {/* Cell 4: NFT / Token Link */}
          <div className="p-2.5 rounded-xl bg-[#24170F]/90 border border-[#5A351E]/70 flex flex-col justify-center">
            <span className="text-[10px] text-[#CDBCA8] uppercase tracking-wider flex items-center gap-1">
              <LinkIcon className="w-3 h-3 text-[#C69B5A]" />
              <span>XRPL NFT</span>
            </span>
            {artwork.nftUrl ? (
              <a
                href={artwork.nftUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#7FAF45] hover:underline flex items-center gap-1 mt-0.5 truncate text-[11px]"
                title="View XLS-20 Ledger Token"
              >
                <span>Linked</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            ) : (
              <span className="text-[#77736D] text-[11px] mt-0.5 font-normal">Unlinked</span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. CARD ACTIONS ROW                                      */}
        {/* ======================================================== */}
        <div className="pt-3 border-t border-[#5A351E] flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => onOpenLightbox && onOpenLightbox(artwork)}
            className="flex-1 py-2 rounded-xl bg-[#24170F] hover:bg-[#70431F] text-center text-xs font-semibold text-[#F5EBDD] transition-colors flex items-center justify-center gap-1.5 border border-[#5A351E] cursor-pointer"
            title="Preview full size artwork"
          >
            <Eye className="w-3.5 h-3.5 text-[#C69B5A]" />
            <span>Preview</span>
          </button>

          <Link
            to={`/admin/artworks/${artwork.id}/edit`}
            className="flex-1 py-2 rounded-xl bg-[#70431F] hover:bg-[#8C5D19] text-center text-xs font-semibold text-[#F5EBDD] transition-colors flex items-center justify-center gap-1.5 border border-[#C69B5A] shadow-xs"
            title="Edit artwork details"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          <button
            type="button"
            onClick={() => onDuplicate(artwork)}
            className="p-2 rounded-xl bg-[#24170F] hover:bg-[#70431F] text-[#CDBCA8] hover:text-[#C69B5A] transition-colors border border-[#5A351E] cursor-pointer"
            title="Duplicate artwork"
            aria-label="Duplicate artwork"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(artwork)}
            className="p-2 rounded-xl bg-[#24170F] hover:bg-rose-950/70 text-rose-400 hover:text-rose-200 transition-colors border border-[#5A351E] cursor-pointer"
            title="Delete artwork"
            aria-label="Delete artwork"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
