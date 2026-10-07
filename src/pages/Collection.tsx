import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiGrid, FiArrowLeft, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import ArtworkCard from '../components/ArtworkCard';
import BaseButton from '../components/ui/BaseButton';
import { ArtworkGridSkeleton } from '../components/common/Skeletons';

type StatusFilterType = 'All' | 'Available' | 'Sold';

/**
 * Collection Page
 *
 * Distinctive dark fantasy character catalog with fast responsive filtering,
 * instant search, polished typography, and zero-pill discipline.
 */
export default function Collection() {
  const { publishedArtworks: artworks } = useApp();
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = 'Collection Archives — Tiny Realms';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 180);
    return () => clearTimeout(timer);
  }, [statusFilter]);

  // Filter artworks based ONLY on Status (Available / Sold / All) & Search
  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      // Must be published
      if (artwork.published === false) return false;

      // Status filter: Available vs Sold
      if (statusFilter !== 'All' && artwork.status !== statusFilter) {
        return false;
      }

      // Search query
      const query = searchQuery.trim().toLowerCase();
      if (query === '') return true;

      return (
        artwork.title.toLowerCase().includes(query) ||
        (artwork.code && artwork.code.toLowerCase().includes(query)) ||
        (artwork.collection && artwork.collection.toLowerCase().includes(query)) ||
        (artwork.tags && artwork.tags.some((t) => t.toLowerCase().includes(query)))
      );
    });
  }, [artworks, statusFilter, searchQuery]);

  // Counts for filters
  const counts = useMemo(() => {
    const published = artworks.filter((a) => a.published !== false);
    return {
      all: published.length,
      available: published.filter((a) => a.status === 'Available').length,
      sold: published.filter((a) => a.status === 'Sold').length,
    };
  }, [artworks]);

  return (
    <main id="collection" className="flex-1 w-full py-8 sm:py-12 lg:py-16 bg-[#696866] text-[#F5EBDD]">
      <div className="max-w-[1560px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Navigation Return Link */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors group"
            aria-label="Return to home page"
          >
            <FiArrowLeft className="w-3.5 h-3.5 text-[#C69B5A] group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO HOME</span>
          </Link>
        </div>

        {/* ======================================================== */}
        {/* HEADER & FILTER TOOLBAR                                  */}
        {/* ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-[#5A351E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#D9A85C] uppercase mb-1">
              <span>CATALOGUE</span>
              <span aria-hidden="true" className="text-[#8C5D19]">·</span>
              <span>{counts.all} TOTAL EDITIONS</span>
            </div>
            <h1 className="font-hero-title font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#F5EBDD] uppercase">
              COLLECTION
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#CDBCA8] max-w-xl">
              Verified XLS-20 digital collectibles on the XRP Ledger. Explore and collect 1-of-1 characters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Direct Link to XRP.Cafe Official Collection Page */}
            <a
              href="https://xrp.cafe/id/collection/tinyrealms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#3A2213] to-[#54301B] hover:from-[#54301B] hover:to-[#70431F] border border-[#D9A85C]/60 text-[#FFE3B3] hover:text-[#FFFFFF] text-xs font-hero-title font-bold tracking-wide uppercase transition-all shadow-md group cursor-pointer"
            >
              <span>VIEW ON XRP.CAFE</span>
              <span className="text-[#D9A85C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>

            {/* Interactive Segmented Filter Control */}
            <div className="inline-flex p-1 rounded-2xl bg-[#1A0E07]/90 border border-[#3D2214] shadow-inner">
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-hero-title font-bold uppercase transition-all duration-200 cursor-pointer ${
                  statusFilter === 'All'
                    ? 'bg-gradient-to-b from-[#8C5D19] via-[#6E4210] to-[#4D2D09] text-[#FFE8C2] border border-[#D9A85C] shadow-sm'
                    : 'text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#2A180E]'
                }`}
              >
                All ({counts.all})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('Available')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-hero-title font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'Available'
                    ? 'bg-gradient-to-b from-[#3E6B42] via-[#2A4E2D] to-[#1C351E] text-[#E8F8EA] border border-[#7FAF45] shadow-sm'
                    : 'text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#2A180E]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7FAF45]" />
                <span>Available ({counts.available})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('Sold')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-hero-title font-bold uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'Sold'
                    ? 'bg-gradient-to-b from-[#7A3A26] via-[#542415] to-[#3A160B] text-[#F8EADA] border border-[#A85B3E] shadow-sm'
                    : 'text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#2A180E]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C69B5A]" />
                <span>Sold ({counts.sold})</span>
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-60 lg:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-9 pr-8 py-2 bg-[#1A0E07]/90 border border-[#3D2214] rounded-2xl text-xs font-mono text-[#F5EBDD] placeholder-[#CDBCA8]/40 focus:outline-none focus:border-[#C69B5A] transition-colors"
                aria-label="Search collection by title or tag"
              />
              <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-[#C69B5A]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#CDBCA8] hover:text-[#F5EBDD] p-0.5 rounded-md cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* ARTWORKS GRID                                            */}
        {/* ======================================================== */}
        <section aria-label="Collection Artworks Grid" className="py-8 sm:py-12">
          {isLoading ? (
            <ArtworkGridSkeleton count={8} />
          ) : filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredArtworks.map((artwork) => (
                <div key={artwork.id} className="flex flex-col">
                  <ArtworkCard artwork={artwork} variant="chocolate" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#24170F]/90 rounded-3xl border border-[#5A351E] p-8 shadow-xl max-w-lg mx-auto">
              <FiGrid className="w-12 h-12 text-[#C69B5A] mx-auto mb-3 opacity-60" />
              <h2 className="font-hero-title font-bold text-xl text-[#F5EBDD] uppercase">
                No Characters Found
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#CDBCA8] leading-relaxed">
                {searchQuery
                  ? `No character match found for "${searchQuery}".`
                  : `No characters currently match the "${statusFilter}" status filter.`}
              </p>
              <div className="mt-5 flex justify-center">
                <BaseButton
                  variant="wood"
                  size="md"
                  onClick={() => {
                    setStatusFilter('All');
                    setSearchQuery('');
                  }}
                >
                  Reset Filter & Search
                </BaseButton>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
