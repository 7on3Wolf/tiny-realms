import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '../../types';
import StatusBadge from './StatusBadge';
import {
  ArrowLeft,
  Eye,
  ExternalLink,
  CheckCircle,
  Copy,
  Check,
  Edit2,
  Sparkles,
} from 'lucide-react';

interface ArtworkPreviewProps {
  artwork: Artwork;
}

export default function ArtworkPreview({ artwork }: ArtworkPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Admin Preview Top Banner */}
      <div className="bg-[#4A2D1A] text-[#F5EBDD] rounded-2xl p-4 sm:p-5 shadow-lg border border-[#5A351E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#24170F] text-[#C69B5A] border border-[#5A351E] flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-[#C69B5A] uppercase bg-[#24170F] px-2.5 py-0.5 rounded border border-[#5A351E]">
                ADMIN PREVIEW
              </span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                  artwork.published
                    ? 'bg-[#7FAF45]/20 text-[#7FAF45] border border-[#7FAF45]/40'
                    : 'bg-[#70431F] text-[#D9A85C] border border-[#C69B5A]'
                }`}
              >
                {artwork.published ? 'LIVE ON PUBLIC SITE' : 'DRAFT MODE (HIDDEN FROM PUBLIC)'}
              </span>
            </div>
            <p className="text-xs text-[#CDBCA8] mt-1">
              Simulating public visitor view. No live changes are committed here.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            to={`/admin/artworks/${artwork.id}/edit`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#24170F] hover:bg-[#70431F] text-xs font-semibold text-[#F5EBDD] border border-[#5A351E] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#C69B5A]" />
            <span>Edit Artwork</span>
          </Link>
          <Link
            to="/admin/artworks"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-xs font-bold font-mono uppercase tracking-wider text-[#24170F] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Artworks</span>
          </Link>
        </div>
      </div>

      {/* 2. Public Site Layout Simulation (Tiny Realm Dark Japanese Storybook Aesthetic) */}
      <div className="bg-[#4A2D1A] text-[#F5EBDD] rounded-3xl border border-[#5A351E] p-6 sm:p-10 lg:p-12 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Artwork Image */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full aspect-square bg-[#24170F] rounded-2xl overflow-hidden border border-[#5A351E] flex items-center justify-center p-4 shadow-inner">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#CDBCA8] px-1">
              <span>CANVAS DIMENSION: 4000 × 4000 PX</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 text-[#C69B5A] hover:text-[#F5EBDD] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#7FAF45]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Link'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Public Artwork Specifications */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs">
                <span className="font-bold text-[#C69B5A] bg-[#24170F] border border-[#5A351E] px-2.5 py-0.5 rounded-md">
                  {artwork.code}
                </span>
                <span className="font-semibold text-[#F5EBDD] bg-[#24170F] border border-[#5A351E] px-2.5 py-0.5 rounded-md uppercase">
                  {artwork.collection}
                </span>
                <span className="text-[#CDBCA8]">{artwork.year || 2026}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#F5EBDD] tracking-tight leading-tight">
                {artwork.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                <span className="text-[#CDBCA8]">
                  CATEGORY: <strong className="text-[#F5EBDD]">{artwork.category}</strong>
                </span>
                <span className="text-[#5A351E]">•</span>
                <StatusBadge status={artwork.status} />
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-[#24170F] rounded-xl border border-[#5A351E] space-y-2 text-sm text-[#CDBCA8] leading-relaxed">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C69B5A] block">
                Editorial Synopsis & Lore
              </span>
              <p>{artwork.description || 'No extended character lore provided for this entry.'}</p>
            </div>

            {/* NFT Marketplace CTA */}
            {artwork.nftUrl?.trim() && (
              <div className="p-4 bg-[#24170F] border border-[#5A351E] rounded-xl space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#C69B5A] font-bold uppercase text-[10px]">
                    MARKETPLACE ACCESS
                  </span>
                  <span className="text-[#7FAF45] font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Listing
                  </span>
                </div>
                <a
                  href={artwork.nftUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <span>VIEW ON MARKETPLACE</span>
                  <ExternalLink className="w-4 h-4 text-[#24170F]" />
                </a>
              </div>
            )}

            {/* Technical Metadata Table */}
            <div className="border border-[#5A351E] rounded-xl p-4 bg-[#24170F] space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-[#5A351E]">
                <span className="font-bold text-[#F5EBDD] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C69B5A]" />
                  <span>SPECIFICATIONS</span>
                </span>
                <span className="text-[#C69B5A] font-bold">{artwork.year || 2026} ARCHIVE</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#CDBCA8]">CODE:</span>
                <span className="font-semibold text-[#F5EBDD]">{artwork.code}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-[#5A351E]/60">
                <span className="text-[#CDBCA8]">COLLECTION:</span>
                <span className="font-semibold text-[#F5EBDD]">{artwork.collection}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-[#5A351E]/60">
                <span className="text-[#CDBCA8]">STATUS:</span>
                <span className="font-semibold text-[#F5EBDD]">{artwork.status}</span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-[#5A351E]/60">
                <span className="text-[#CDBCA8]">VISIBILITY:</span>
                <span className={artwork.published ? 'text-[#7FAF45] font-bold' : 'text-[#D9A85C] font-bold'}>
                  {artwork.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
