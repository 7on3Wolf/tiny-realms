import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiMaximize2,
  FiCheck,
  FiCopy,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiLayers,
  FiTag,
  FiX
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import ArtworkCard from '../components/ArtworkCard';
import BaseButton from '../components/ui/BaseButton';
import { ArtworkDetailSkeleton } from '../components/common/Skeletons';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';

export default function ArtworkDetail() {
  const { publishedArtworks: artworks } = useApp();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Quick smooth skeleton animation on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [id]);

  // Match artwork by id, code, or slug
  const currentIndex = artworks.findIndex(
    (item) =>
      String(item.id).toLowerCase() === String(id).toLowerCase() ||
      item.code.toLowerCase().replace(/\s+/g, '') === String(id).toLowerCase().replace(/\s+/g, '') ||
      item.title.toLowerCase().replace(/\s+/g, '-') === String(id).toLowerCase() ||
      item.title.toLowerCase() === String(id).toLowerCase()
  );

  const artwork = currentIndex !== -1 ? artworks[currentIndex] : null;

  // Sync document title
  useEffect(() => {
    if (artwork) {
      document.title = `Tiny Realms — ${artwork.title}`;
    } else {
      document.title = 'Tiny Realms — Artwork';
    }
  }, [artwork]);

  // Previous & Next navigation
  const prevArtwork = currentIndex > 0 ? artworks[currentIndex - 1] : null;
  const nextArtwork =
    currentIndex !== -1 && currentIndex < artworks.length - 1
      ? artworks[currentIndex + 1]
      : null;

  // Related artworks
  const relatedArtworks = useMemo(() => {
    if (!artwork) return [];
    return artworks
      .filter((item) => item.id !== artwork.id)
      .slice(0, 4);
  }, [artworks, artwork]);

  const handleCopyContract = (contract?: string) => {
    if (!contract) return;
    navigator.clipboard.writeText(contract);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Keyboard navigation & escape listener for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (isLoading) {
    return (
      <main id="artwork-detail" className="flex-1 w-full py-6 sm:py-10 lg:py-14 bg-[#696866] text-[#F5EBDD]">
        <ArtworkDetailSkeleton />
      </main>
    );
  }

  // If artwork is not found or unpublished
  if (!artwork) {
    return (
      <main id="artwork-detail-notfound" className="flex-1 w-full py-16 sm:py-24 bg-[#696866] text-[#F5EBDD]">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-[#4A2D1A] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#5A351E] text-[#C69B5A] shadow-md">
            <FiTag className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono uppercase text-[#C69B5A] tracking-widest block mb-1 font-bold">
            CATALOGUE STATUS
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#F5EBDD]">
            Artwork Not Available
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#CDBCA8] leading-relaxed">
            The requested artwork is currently unavailable or saved as an unpublished draft.
          </p>
          <div className="mt-8">
            <Link
              id="notfound-back-btn"
              to="/collection"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4A2D1A] hover:bg-[#70431F] text-[#F5EBDD] hover:text-[#D9A85C] border border-[#C69B5A] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Collection</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="artwork-detail" className="flex-1 w-full py-10 sm:py-16 lg:py-20 bg-[#696866] text-[#F5EBDD]">
      <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Top Bar: Return Link + Prev/Next switchers */}
        <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-[#5A351E]">
          <Link
            id="back-to-collection-nav-btn"
            to="/collection"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO COLLECTION</span>
          </Link>

          {/* Prev / Next switchers */}
          <div className="flex items-center gap-2">
            {prevArtwork ? (
              <button
                type="button"
                onClick={() => navigate(`/artwork/${prevArtwork.id}`)}
                className="p-2 rounded-lg border border-[#5A351E] bg-[#4A2D1A] text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#70431F] transition-colors cursor-pointer shadow-xs"
                title={`Previous: ${prevArtwork.title}`}
                aria-label="Previous Artwork"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <span className="p-2 rounded-lg border border-[#5A351E]/40 bg-[#4A2D1A]/40 text-[#77736D] cursor-not-allowed">
                <FiChevronLeft className="w-4 h-4" />
              </span>
            )}

            <span className="text-xs font-mono text-[#C69B5A] px-1 hidden sm:inline-block font-semibold">
              {artwork.dimensions || '2048 x 2048 px'}
            </span>

            {nextArtwork ? (
              <button
                type="button"
                onClick={() => navigate(`/artwork/${nextArtwork.id}`)}
                className="p-2 rounded-lg border border-[#5A351E] bg-[#4A2D1A] text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#70431F] transition-colors cursor-pointer shadow-xs"
                title={`Next: ${nextArtwork.title}`}
                aria-label="Next Artwork"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="p-2 rounded-lg border border-[#5A351E]/40 bg-[#4A2D1A]/40 text-[#77736D] cursor-not-allowed">
                <FiChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        {/* Main Detail Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Large 1:1 Square Artwork Container */}
          <div className="lg:col-span-7">
            <div className="relative group bg-[#4A2D1A] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[#5A351E] shadow-xl">
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#24170F] aspect-square flex items-center justify-center p-2 border border-[#5A351E]">
                <ImageWithSkeleton
                  id="artwork-detail-main-image"
                  src={artwork.image}
                  alt={artwork.title}
                  aspectRatio="aspect-square"
                  rounded="rounded-xl sm:rounded-2xl"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="absolute top-4 right-4 bg-[#24170F]/80 hover:bg-[#24170F] text-[#F5EBDD] border border-[#5A351E] p-2.5 rounded-xl backdrop-blur-md transition-all shadow-sm focus:outline-none cursor-pointer"
                  title="View Fullscreen"
                  aria-label="View Fullscreen"
                >
                  <FiMaximize2 className="w-4 h-4 text-[#C69B5A]" />
                </button>

                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-[#24170F]/85 backdrop-blur-md text-[#F5EBDD] text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#5A351E] flex items-center gap-1.5 shadow-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${artwork.status === 'Sold' ? 'bg-[#77736D]' : artwork.status === 'Reserved' ? 'bg-[#C69B5A]' : 'bg-[#7FAF45]'}`} />
                  <span>{artwork.status}</span>
                </div>
              </div>

              {/* Sub-bar below Image */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-[#CDBCA8]">
                <span className="font-mono text-[11px] text-[#CDBCA8] uppercase">
                  DIMENSIONS: {artwork.dimensions || '2048 x 2048 px'} • 1-OF-1 EDITION
                </span>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 text-[#CDBCA8] hover:text-[#F5EBDD] font-mono text-xs transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5 text-[#7FAF45]" />
                      <span className="text-[#7FAF45] font-medium">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5 text-[#C69B5A]" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Artwork Metadata & External NFT CTA */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Category & Code in IBM Plex Mono */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="font-mono text-xs font-bold text-[#C69B5A] bg-[#4A2D1A] border border-[#5A351E] px-2.5 py-0.5 rounded-md">
                {artwork.code}
              </span>
              <span className="font-mono text-xs font-semibold text-[#F5EBDD] bg-[#70431F] border border-[#5A351E] px-2.5 py-0.5 rounded-md">
                TINY REALMS
              </span>
              <span className="font-mono text-xs text-[#CDBCA8]">
                {artwork.year || 2026}
              </span>
            </div>

            {/* Title & Collection */}
            <div>
              <h1
                id="artwork-detail-title"
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-[#F5EBDD] leading-tight"
              >
                {artwork.title}
              </h1>
              {artwork.subtitle && (
                <p className="font-mono text-xs sm:text-sm text-[#CDBCA8] font-semibold mt-1 uppercase tracking-wider">
                  {artwork.subtitle}
                </p>
              )}
            </div>

            {/* Artist & Status badge */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[#CDBCA8]">
                COLLECTION: <strong className="text-[#F5EBDD]">{artwork.collection || 'Tiny Realms'}</strong>
              </span>
              <span className="text-[#5A351E]">•</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md uppercase text-[10px] ${
                  artwork.status === 'Available'
                    ? 'text-[#F5EBDD] bg-[#7FAF45]/40 border border-[#7FAF45]'
                    : artwork.status === 'Sold'
                    ? 'text-[#CDBCA8] bg-[#77736D]/40 border border-[#77736D]'
                    : 'text-[#D9A85C] bg-[#70431F] border border-[#C69B5A]/60'
                }`}
              >
                {artwork.status}
              </span>
            </div>

            {/* Descriptions */}
            <div className="mt-6 space-y-3 text-sm sm:text-base text-[#CDBCA8] leading-relaxed">
              <p>{artwork.description}</p>
              {artwork.longDescription && (
                <p className="text-xs sm:text-sm text-[#CDBCA8]/80 leading-relaxed">
                  {artwork.longDescription}
                </p>
              )}
            </div>

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {artwork.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono text-[#CDBCA8] bg-[#4A2D1A] border border-[#5A351E] px-2.5 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* External NFT CTA Box (Only shown if nftUrl is available) */}
            {artwork.nftUrl && artwork.nftUrl.trim() && (
              <div className="mt-8 p-6 bg-[#4A2D1A] border border-[#5A351E] rounded-2xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C69B5A]">
                      BLOCKCHAIN PROVENANCE
                    </span>
                    <p className="text-xs text-[#CDBCA8]">
                      Hosted on {artwork.platform || 'xrp.cafe'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7FAF45]">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Verified Authenticity
                  </span>
                </div>

                <div className="flex justify-center w-full">
                  <a
                    id="artwork-detail-view-nft-btn"
                    href={artwork.nftUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center"
                  >
                    <BaseButton
                      variant="wood"
                      size="lg"
                      icon={<FiArrowUpRight className="w-4 h-4 text-[#FFE3B3]" />}
                      iconPosition="right"
                    >
                      VIEW ON XRP.CAFE
                    </BaseButton>
                  </a>
                </div>

                <p className="mt-2.5 text-[11px] font-mono text-center text-[#CDBCA8]">
                  Opens external marketplace verified listing in new tab
                </p>
              </div>
            )}

            {/* Technical Metadata Table */}
            <div className="mt-6 border border-[#5A351E] rounded-2xl p-4 sm:p-5 bg-[#4A2D1A] space-y-2.5 text-xs font-mono shadow-md">
              <div className="flex justify-between items-center pb-2 border-b border-[#5A351E]">
                <span className="font-bold uppercase text-[#F5EBDD]">ARTWORK SPECIFICATIONS</span>
                <span className="text-[#C69B5A] font-bold">2026 ARCHIVE</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#CDBCA8]">DIMENSIONS</span>
                <span className="font-semibold text-[#F5EBDD]">{artwork.dimensions || '2048 x 2048 px'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-[#5A351E]">
                <span className="text-[#CDBCA8]">COLLECTION</span>
                <span className="font-semibold text-[#F5EBDD]">{artwork.collection || 'Tiny Realms'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-[#5A351E]">
                <span className="text-[#CDBCA8]">FORMAT</span>
                <span className="font-semibold text-[#C69B5A]">Digital Artwork</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-[#5A351E]">
                <span className="text-[#CDBCA8]">MARKETPLACE PLATFORM</span>
                <span className="font-semibold text-[#F5EBDD]">{artwork.platform || 'xrp.cafe'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-[#5A351E]">
                <span className="text-[#CDBCA8]">DIMENSIONS</span>
                <span className="font-semibold text-[#F5EBDD]">
                  {artwork.dimensions?.replace(' (1:1 Square)', '') || '4000 x 4000 px'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-[#5A351E]">
                <span className="text-[#CDBCA8]">EDITION</span>
                <span className="font-semibold text-[#F5EBDD]">
                  {artwork.edition || '1 of 1 Edition'}
                </span>
              </div>

              {artwork.contractAddress && (
                <div className="flex justify-between items-center py-1 border-t border-[#5A351E]">
                  <span className="text-[#CDBCA8]">CONTRACT</span>
                  <button
                    type="button"
                    onClick={() => handleCopyContract(artwork.contractAddress)}
                    className="font-mono text-xs text-[#F5EBDD] bg-[#24170F] hover:bg-[#70431F] border border-[#5A351E] px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    title="Click to copy contract"
                  >
                    <span>{artwork.contractAddress}</span>
                    {copiedContract ? (
                      <FiCheck className="w-3 h-3 text-[#7FAF45]" />
                    ) : (
                      <FiCopy className="w-3 h-3 text-[#C69B5A]" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Navigation links back to Gallery / Collection */}
            <div className="mt-6 flex flex-wrap gap-3 items-center justify-center sm:justify-start">
              <Link id="artwork-detail-back-gallery-btn" to="/gallery">
                <BaseButton
                  variant="wood"
                  size="md"
                  icon={<FiArrowLeft className="w-3.5 h-3.5 text-[#FFE3B3]" />}
                  iconPosition="left"
                >
                  Gallery
                </BaseButton>
              </Link>

              <Link id="artwork-detail-back-collection-btn" to="/collection">
                <BaseButton
                  variant="wood"
                  size="md"
                  icon={<FiLayers className="w-3.5 h-3.5 text-[#FFE3B3]" />}
                  iconPosition="left"
                >
                  Collection
                </BaseButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Character Artworks */}
        {relatedArtworks.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-[#5A351E]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#C69B5A] uppercase font-bold bg-[#4A2D1A] px-2.5 py-0.5 rounded-full border border-[#5A351E]">
                    EXPLORE
                  </span>
                  <span className="text-xs font-mono uppercase text-[#CDBCA8] tracking-widest">
                    MORE ARTWORKS
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#F5EBDD]">
                  From The Tiny Realms Series
                </h2>
              </div>
              <Link
                to="/collection"
                className="text-xs font-mono font-bold text-[#C69B5A] hover:text-[#D9A85C] transition-colors"
              >
                VIEW ALL →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedArtworks.map((related) => (
                <ArtworkCard key={related.id} artwork={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          id="fullscreen-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen image of ${artwork.title}`}
          className="fixed inset-0 z-50 bg-[#24170F]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-[#F5EBDD] hover:text-[#D9A85C] text-xs font-mono uppercase bg-[#4A2D1A] hover:bg-[#70431F] px-4 py-2 rounded-xl border border-[#5A351E] transition-colors cursor-pointer flex items-center gap-1.5"
            aria-label="Close fullscreen view"
          >
            <FiX className="w-4 h-4" />
            <span>Close (Esc)</span>
          </button>
          <img
            src={artwork.image}
            alt={artwork.title}
            className="max-h-[90vh] max-w-[90vw] aspect-square object-contain rounded-xl shadow-2xl border border-[#5A351E]"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </main>
  );
}
