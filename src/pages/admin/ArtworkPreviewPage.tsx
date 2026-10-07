import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ArtworkPreview from '../../components/admin/ArtworkPreview';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function ArtworkPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { artworks } = useApp();

  const artwork = artworks.find(
    (a) => String(a.id) === String(id) || a.code.replace(/\s+/g, '') === String(id).replace(/\s+/g, '')
  );

  if (!artwork) {
    return (
      <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-10 text-center max-w-md mx-auto space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-[#24170F] text-[#C69B5A] border border-[#5A351E] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-[#D9A85C]" />
        </div>
        <h2 className="text-lg font-bold text-[#F5EBDD]">Artwork Not Found</h2>
        <p className="text-xs text-[#CDBCA8]">
          No artwork with ID &ldquo;{id}&rdquo; was found in the catalogue.
        </p>
        <div>
          <Link
            to="/admin/artworks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold font-mono uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Artworks</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ArtworkPreview artwork={artwork} />;
}
