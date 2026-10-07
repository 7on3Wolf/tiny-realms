import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Edit2, ExternalLink, Tag } from 'lucide-react';
import { Artwork } from '../../types';
import StatusBadge from './StatusBadge';

interface ArtworkLightboxModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export default function ArtworkLightboxModal({
  artwork,
  onClose,
}: ArtworkLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!artwork) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#4A2D1A] border border-[#5A351E] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#5A351E] bg-[#24170F]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#C69B5A] bg-[#4A2D1A] px-2.5 py-0.5 rounded border border-[#5A351E]">
              {artwork.code}
            </span>
            <h3 className="font-bold text-sm text-[#F5EBDD] truncate">
              {artwork.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#4A2D1A] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Main Visual Image */}
          <div className="w-full aspect-square max-h-[420px] rounded-xl bg-[#24170F] border border-[#5A351E] p-3 flex items-center justify-center overflow-hidden shadow-inner">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
            />
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-[#24170F] rounded-lg border border-[#5A351E]">
              <span className="text-[10px] text-[#CDBCA8] uppercase block">Collection</span>
              <span className="font-bold text-[#F5EBDD] truncate block mt-0.5">{artwork.collection}</span>
            </div>
            <div className="p-2.5 bg-[#24170F] rounded-lg border border-[#5A351E]">
              <span className="text-[10px] text-[#CDBCA8] uppercase block">Category</span>
              <span className="font-bold text-[#F5EBDD] truncate block mt-0.5">{artwork.category}</span>
            </div>
            <div className="p-2.5 bg-[#24170F] rounded-lg border border-[#5A351E]">
              <span className="text-[10px] text-[#CDBCA8] uppercase block">Year</span>
              <span className="font-bold text-[#F5EBDD] block mt-0.5">{artwork.year || 2026}</span>
            </div>
            <div className="p-2.5 bg-[#24170F] rounded-lg border border-[#5A351E]">
              <span className="text-[10px] text-[#CDBCA8] uppercase block">Status</span>
              <div className="mt-0.5"><StatusBadge status={artwork.status} /></div>
            </div>
          </div>

          {/* Description */}
          {artwork.description && (
            <div className="p-3 bg-[#24170F] rounded-lg border border-[#5A351E] text-xs text-[#CDBCA8] leading-relaxed">
              <span className="font-bold text-[#F5EBDD] block mb-1">Story & Lore:</span>
              <p>{artwork.description}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between p-4 border-t border-[#5A351E] bg-[#24170F]">
          <Link
            to={`/artwork/${artwork.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A2D1A] hover:bg-[#70431F] border border-[#5A351E] text-xs font-semibold text-[#F5EBDD] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C69B5A]" />
            <span>Open Public Page</span>
          </Link>

          <Link
            to={`/admin/artworks/${artwork.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold font-mono uppercase tracking-wider transition-colors shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Artwork</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
