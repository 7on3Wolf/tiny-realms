import React, { useMemo } from 'react';
import { Collection, Artwork } from '../../types';
import { BaseCard, CardImage } from '../ui/BaseCard';

interface MarqueeImageItem {
  id: string;
  name: string;
  image: string;
}

interface HomeGalleryMarqueeProps {
  collections: Collection[];
  artworks?: Artwork[];
}

/**
 * Shuffles an array guaranteeing no adjacent duplicates
 */
function shuffleNoAdjacentDuplicates<T extends { id: string }>(items: T[], minLength = 8): T[] {
  if (items.length === 0) return [];
  if (items.length === 1) return Array(minLength).fill(items[0]);

  let pool: T[] = [];
  while (pool.length < minLength) {
    pool = [...pool, ...items];
  }

  let result: T[] = [];
  let attempts = 0;

  while (attempts < 50) {
    attempts++;
    const temp = [...pool];
    for (let i = temp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }

    let valid = true;
    for (let i = 0; i < temp.length; i++) {
      const prev = temp[(i - 1 + temp.length) % temp.length];
      if (temp[i].id === prev.id) {
        valid = false;
        break;
      }
    }

    if (valid) {
      result = temp;
      break;
    }
  }

  if (result.length === 0) {
    const arranged: T[] = [];
    for (let i = 0; i < pool.length; i++) {
      arranged.push(items[i % items.length]);
    }
    result = arranged;
  }

  return result;
}

export default function HomeGalleryMarquee({ collections, artworks }: HomeGalleryMarqueeProps) {
  // Extract all valid items strictly from published artworks (excluding items named Tiny Realms)
  const validItems = useMemo<MarqueeImageItem[]>(() => {
    const list: MarqueeImageItem[] = [];
    const seen = new Set<string>();

    if (Array.isArray(artworks)) {
      artworks.forEach((art) => {
        if (
          art &&
          art.published !== false &&
          typeof art.image === 'string' &&
          art.image.trim() !== '' &&
          art.title?.trim().toLowerCase() !== 'tiny realms'
        ) {
          const img = art.image.trim();
          if (!seen.has(img)) {
            seen.add(img);

            list.push({
              id: `art-${art.id}`,
              name: art.title || 'Artwork',
              image: img,
            });
          }
        }
      });
    }

    return list;
  }, [artworks]);

  // Construct r1Track and r2Track using duplicate-safe randomization
  const { r1Track, r2Track } = useMemo(() => {
    if (validItems.length === 0) return { r1Track: [], r2Track: [] };

    const r1 = shuffleNoAdjacentDuplicates(validItems, 8);
    const r2 = shuffleNoAdjacentDuplicates([...validItems].reverse(), 8);

    return { r1Track: r1, r2Track: r2 };
  }, [validItems]);

  if (validItems.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="font-mono text-sm text-[#CDBCA8]">
          No collection images found in uploaded collections.
        </p>
      </div>
    );
  }

  // Single Card Component for Marquee
  const renderCard = (item: MarqueeImageItem, keyPrefix: string, idx: number) => (
    <div
      key={`${keyPrefix}-${item.id}-${idx}`}
      className="shrink-0 w-[205px] xs:w-[225px] sm:w-[250px] pointer-events-none select-none transition-transform duration-300"
    >
      {/* BASE CARD STYLING KERTAS / PARCHMENT */}
      <BaseCard
        aspectRatio="auto"
        className="w-full shadow-md border-0"
        contentClassName="p-3.5 sm:p-4 flex flex-col justify-between items-center"
      >
        {/* Borderless Transparent Artwork Image Container with Rounded Corners */}
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-transparent border-0 shadow-none flex items-center justify-center p-1 my-0.5">
          <CardImage
            src={item.image}
            alt={item.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            skeletonBorderRadius={16}
            className="w-full h-full object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 select-none border-0"
          />
        </div>

        {/* Artwork Title (Nama Gambar) */}
        <div className="w-full text-center px-1 pt-2 pb-0.5">
          <h4
            className="font-hero-title font-extrabold text-xs sm:text-sm tracking-wider uppercase truncate text-[#241308]"
            style={{ textShadow: '0 1px 0 rgba(255,235,190,0.7)' }}
          >
            {item.name}
          </h4>
        </div>
      </BaseCard>
    </div>
  );

  return (
    <div className="w-full space-y-5 sm:space-y-7 select-none overflow-hidden cursor-default">
      {/* ======================================================== */}
      {/* ROW 1: RIGHT → LEFT CONTINUOUS MARQUEE                   */}
      {/* ======================================================== */}
      <div className="w-full overflow-x-hidden relative py-2.5">
        {/* Soft Clean Right Vignette Edge Only (Left Shadow Removed) */}
        <div
          className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, rgba(0,0,0,0.05) 0%, transparent 100%)',
          }}
        />

        {/* Double-Track Seamless Infinite Loop Container */}
        <div className="flex w-max animate-gallery-marquee-left">
          {/* Track 1 */}
          <div className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7 shrink-0">
            {r1Track.map((item, idx) => renderCard(item, 'r1-t1', idx))}
          </div>
          {/* Track 2 (Exact Duplicate including right gap padding) */}
          <div className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7 shrink-0" aria-hidden="true">
            {r1Track.map((item, idx) => renderCard(item, 'r1-t2', idx))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 2: LEFT → RIGHT CONTINUOUS MARQUEE                   */}
      {/* ======================================================== */}
      {r2Track.length > 0 && (
        <div className="w-full overflow-x-hidden relative py-2.5">
          {/* Soft Clean Right Vignette Edge Only (Left Shadow Removed) */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-20 pointer-events-none"
            style={{
              background:
                'linear-gradient(to left, rgba(0,0,0,0.05) 0%, transparent 100%)',
            }}
          />

          {/* Double-Track Seamless Infinite Loop Container */}
          <div className="flex w-max animate-gallery-marquee-right">
            {/* Track 1 */}
            <div className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7 shrink-0">
              {r2Track.map((item, idx) => renderCard(item, 'r2-t1', idx))}
            </div>
            {/* Track 2 (Exact Duplicate including right gap padding) */}
            <div className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7 shrink-0" aria-hidden="true">
              {r2Track.map((item, idx) => renderCard(item, 'r2-t2', idx))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
