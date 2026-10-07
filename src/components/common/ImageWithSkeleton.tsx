import React, { useState, useEffect, useRef } from 'react';
import { FiImage } from 'react-icons/fi';

export interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. 'aspect-square', 'aspect-video', 'aspect-auto'
  rounded?: string; // e.g. 'rounded-xl', 'rounded-2xl', 'rounded-lg'
  showPlaceholderIcon?: boolean;
  fallbackSrc?: string | string[];
}

/**
 * ImageWithSkeleton Component
 *
 * Guarantees a visible, high-polish shimmering skeleton loader while any image
 * is being fetched, buffered, or rendered. Features multi-gateway IPFS fallback
 * so if an IPFS gateway or CDN fails, it automatically falls back to alternative
 * gateways or local character art seamlessly.
 */
export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-square',
  rounded = 'rounded-xl',
  showPlaceholderIcon = true,
  fallbackSrc,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Build candidate sources array
  const sources = React.useMemo(() => {
    const list: string[] = [];
    if (src && src.trim() !== '') list.push(src.trim());

    if (src && src.includes('/ipfs/')) {
      const hash = src.split('/ipfs/')[1];
      if (hash) {
        list.push(`https://gateway.pinata.cloud/ipfs/${hash}`);
        list.push(`https://ipfs.filebase.io/ipfs/${hash}`);
        list.push(`https://dweb.link/ipfs/${hash}`);
        list.push(`https://cloudflare-ipfs.com/ipfs/${hash}`);
      }
    }

    if (fallbackSrc) {
      if (Array.isArray(fallbackSrc)) {
        list.push(...fallbackSrc);
      } else {
        list.push(fallbackSrc);
      }
    }

    // Filter out duplicates and empty strings
    return Array.from(new Set(list.filter(Boolean)));
  }, [src, fallbackSrc]);

  const activeSrc = sources[currentSrcIndex] || src || '';

  useEffect(() => {
    // Reset state when src prop changes
    setIsLoaded(false);
    setHasError(false);
    setCurrentSrcIndex(0);

    if (!activeSrc) return;

    // Check if already in browser cache
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      const timer = setTimeout(() => setIsLoaded(true), 60);
      return () => clearTimeout(timer);
    }
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrcIndex < sources.length - 1) {
      // Try next IPFS gateway or fallback image
      setCurrentSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
      setIsLoaded(true);
      onError?.(e);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none flex items-center justify-center bg-[#28180E] ${aspectRatio} ${rounded} ${containerClassName}`}
    >
      {/* SHIMMER SKELETON LAYER */}
      {(!isLoaded && !hasError) && (
        <div
          className={`absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center overflow-hidden ${rounded} bg-[#2A180E]`}
        >
          {/* Animated Gold/Amber Shimmer Wave */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-[#C69B5A]/25 to-transparent pointer-events-none" />

          {/* Glowing Ambient Core */}
          <div className="w-12 h-12 rounded-full bg-[#C69B5A]/10 animate-pulse flex items-center justify-center">
            {showPlaceholderIcon && (
              <FiImage className="w-6 h-6 text-[#C69B5A]/60" />
            )}
          </div>

          <span className="font-mono text-[9px] text-[#CDBCA8]/50 uppercase tracking-widest mt-2 animate-pulse">
            Loading Art...
          </span>
        </div>
      )}

      {/* ACTUAL IMAGE */}
      {activeSrc && !hasError && (
        <img
          ref={imgRef}
          src={activeSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={(e) => {
            setIsLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            handleImageError(e);
          }}
          className={`w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105 ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageWithSkeleton;
