import React from 'react';
import Skeleton from 'react-loading-skeleton';
import parchmentTransparentAsset from '../../assets/images/parchment_card_transparent.png';

export type CardStatus = 'available' | 'sold_out' | 'coming_soon';

export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  aspectRatio?: 'portrait' | 'wide' | 'square' | 'auto' | string;
  status?: CardStatus;
  className?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

/**
 * ParchmentBackground Component
 * - Lowest visual layer (z-index: 0)
 * - Transparent outside area
 * - High-fidelity aged parchment with small angular corner folds & torn edges
 */
export const ParchmentBackground: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <img
      src={parchmentTransparentAsset}
      alt="Parchment Paper"
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)] ${className}`}
      {...props}
    />
  );
};

export const ParchmentImage = ParchmentBackground;

/**
 * CardContent Component
 * - Lies directly above the parchment background (z-index: 10)
 * - Large, comfortable content surface
 */
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`relative z-10 w-full h-full p-3.5 xs:p-4 sm:p-4.5 pb-4 sm:pb-5 flex flex-col items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const BaseCardContent = CardContent;

/**
 * Global BaseCard Component
 * Reusable fantasy parchment card with support for statuses:
 * - 'available': Active, bright, interactive
 * - 'sold_out': Darkened artwork with carved wood & ink stamped "SOLD OUT" seal
 * - 'coming_soon': Mysterious shadowy aura with carved "COMING SOON" rune plaque
 */
export const BaseCard: React.FC<BaseCardProps> = ({
  interactive = false,
  aspectRatio = 'portrait',
  status = 'available',
  className = '',
  contentClassName = '',
  children,
  ...props
}) => {
  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[7/10]'
      : aspectRatio === 'wide'
      ? 'aspect-[5/4]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'auto'
      ? ''
      : aspectRatio;

  const isSoldOut = status === 'sold_out';

  return (
    <div
      className={`group relative w-full ${aspectClass} flex flex-col justify-between bg-transparent border-0 outline-none transition-all duration-200 ease-out ${
        interactive && !isSoldOut
          ? 'hover:-translate-y-1 hover:brightness-[1.02] cursor-pointer select-none'
          : ''
      } ${isSoldOut ? 'opacity-95' : ''} ${className}`}
      {...props}
    >
      <ParchmentBackground />
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </div>
  );
};

/**
 * CardMedia / CardArtwork with integrated status overlays
 * Designed to match the exact carved wood & parchment aesthetic of the card
 */
export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  status?: CardStatus;
}

export const CardMedia: React.FC<CardMediaProps> = ({
  src,
  alt = '',
  status = 'available',
  className = '',
  children,
  ...props
}) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(src?.trim() ? src.trim() : undefined);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const isSoldOut = status === 'sold_out';
  const isComingSoon = status === 'coming_soon';

  React.useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
    const target = src && src.trim() !== '' ? src.trim() : undefined;
    setImgSrc(target);

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      const timer = setTimeout(() => setImgLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [src]);

  const handleImageError = () => {
    setImgError(true);
    setImgLoaded(true);
  };

  return (
    <div
      className={`relative w-full aspect-square select-none flex items-center justify-center bg-transparent border-0 ${className}`}
      {...props}
    >
      {/* Abstract warm ambient glow behind the character that softens edges onto parchment */}
      <div className="absolute inset-3 rounded-full bg-[#E5CCA0]/35 blur-xl pointer-events-none -z-10" />

      {/* High-visibility Shimmer Skeleton loading placeholder (seamless with parchment) */}
      {imgSrc && !imgLoaded && !imgError && (
        <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-[#D8C29D]/40 border border-[#A67E4E]/30 pointer-events-none">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[#FFF2D6]/50 to-transparent pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-[#8C5D19]/15 animate-pulse flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-[#8C5D19]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-mono text-[9px] text-[#5A3820]/70 font-bold uppercase tracking-widest animate-pulse">
            Loading...
          </span>
        </div>
      )}

      {imgSrc && !imgError ? (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl">
          <img
            ref={imgRef}
            src={imgSrc}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={handleImageError}
            className={`w-full h-full object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 border-0 bg-transparent group-hover:scale-105 ${
              isSoldOut
                ? 'brightness-[0.45] contrast-125 grayscale-[40%]'
                : isComingSoon
                ? 'brightness-75 saturate-125'
                : 'contrast-[1.03] brightness-[1.02]'
            }`}
          />
        </div>
      ) : !children ? (
        <div className="w-full h-full aspect-square rounded-lg border border-dashed border-[#8C5D19]/40 bg-[#D8C29D]/20 flex flex-col items-center justify-center p-3 text-center transition-colors">
          <svg className="w-6 h-6 text-[#8C5D19]/60 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[10px] font-mono text-[#5A3820]/60 uppercase tracking-widest font-bold">
            Digital Collectible
          </span>
        </div>
      ) : null}

      {/* Children elements (e.g. custom artwork or SVGs) */}
      {children}

      {/* 1. STATUS: SOLD OUT OVERLAY (Plakat Kayu Berukir / Segel Perkamen Terbakar) */}
      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-3">
          {/* Subtle dark vignette matching parchment tone */}
          <div className="absolute inset-0 bg-[#1A0E07]/45 rounded-lg" />

          {/* Carved Dark Wood & Parchment Stamped Banner */}
          <div
            className="relative z-20 transform -rotate-12 px-4 py-2 rounded-lg border-2 border-[#542B15] bg-[#221209]/95 shadow-[0_6px_16px_rgba(0,0,0,0.85)] flex items-center justify-center"
            style={{
              boxShadow: 'inset 0 1px 1px rgba(217,168,92,0.35), inset 0 -1px 2px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.9)',
            }}
          >
            {/* Background carved wood texture effect */}
            <div className="absolute inset-0.5 rounded border border-[#3E1E0E]/80 pointer-events-none opacity-60" />

            <span
              className="relative z-10 font-hero-title font-extrabold tracking-widest text-xs sm:text-sm text-[#E8CBA0] uppercase"
              style={{
                // Chiseled burnt wood engraving shadow
                textShadow: '0 -1px 1px rgba(0,0,0,0.95), 0 1px 0.5px rgba(255,235,190,0.3), 0 2px 4px rgba(0,0,0,0.9)',
              }}
            >
              SOLD OUT
            </span>
          </div>
        </div>
      )}

      {/* 2. STATUS: COMING SOON OVERLAY (Plakat Kayu Pahat Bernuansa Mistis) */}
      {isComingSoon && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-3">
          {/* Subtle mystical cosmic aura backdrop */}
          <div className="absolute inset-0 bg-[#140D08]/50 backdrop-blur-[0.5px] rounded-lg" />

          {/* Carved Rune Plaque matching Card Materials */}
          <div
            className="relative z-20 px-3.5 py-1.5 rounded-lg border-2 border-[#8B5A2B]/90 bg-[#24140A]/95 shadow-[0_0_14px_rgba(217,168,92,0.35)] flex items-center justify-center gap-1.5"
            style={{
              boxShadow: 'inset 0 1px 1px rgba(255,235,180,0.4), inset 0 -1px 2px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.85)',
            }}
          >
            <div className="absolute inset-0.5 rounded border border-[#523016]/80 pointer-events-none opacity-60" />

            <span
              className="relative z-10 font-hero-title font-bold tracking-widest text-[11px] sm:text-xs text-[#FDE8B5] uppercase animate-pulse"
              style={{
                textShadow: '0 0 8px rgba(217,168,92,0.7), 0 -1px 1px rgba(0,0,0,0.9), 0 1px 0.5px rgba(255,245,210,0.35)',
              }}
            >
              COMING SOON
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * CardImage Component
 * For any custom image placed inside a BaseCard.
 * Automatically displays a smooth shimmer Skeleton until the image finishes loading.
 */
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonBorderRadius?: number | string;
  containerClassName?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  skeletonBorderRadius = 8,
  onLoad,
  onError,
  ...props
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [currentSrc, setCurrentSrc] = React.useState<string | undefined>(
    src && src.trim() !== '' ? src.trim() : undefined
  );
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    setLoaded(false);
    setHasError(false);
    const target = src && src.trim() !== '' ? src.trim() : undefined;
    setCurrentSrc(target);

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      const timer = setTimeout(() => setLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setLoaded(true);
    onError?.(e);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl flex items-center justify-center bg-transparent ${containerClassName}`}>
      {currentSrc && !loaded && !hasError && (
        <div className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center bg-transparent pointer-events-none">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[#C69B5A]/20 to-transparent pointer-events-none" />
          <div className="w-8 h-8 rounded-full bg-[#C69B5A]/10 animate-pulse flex items-center justify-center">
            <svg className="w-4 h-4 text-[#C69B5A]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}
      {currentSrc && !hasError && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={handleImageError}
          className={`w-full h-full object-contain rounded-xl sm:rounded-2xl transition-transform duration-300 ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

/**
 * CardTitle with Engraved / Chiseled Calligraphy Ink Text Style
 * (Desain ukiran / coretan tinta berukir di atas perkamen, tajam dan mudah dibaca)
 */
export const CardTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement> & { title?: string; status?: CardStatus }
> = ({ title, status = 'available', className = '', children, ...props }) => {
  const isSoldOut = status === 'sold_out';
  const isComingSoon = status === 'coming_soon';

  return (
    <div className={`my-1 sm:my-1.5 text-center ${className}`}>
      <h3
        className={`
          font-hero-title font-extrabold text-sm sm:text-base tracking-wide uppercase truncate
          ${isSoldOut ? 'text-[#5C3A24]' : isComingSoon ? 'text-[#4A2D1B]' : 'text-[#261207]'}
        `}
        style={{
          // Efek ukiran / coretan pahatan tinta pada perkamen (Chiseled Iron-Gall Ink Style)
          textShadow: isSoldOut
            ? '0 1px 0 rgba(255, 255, 255, 0.4), 0 -0.5px 0 rgba(0, 0, 0, 0.3)'
            : isComingSoon
            ? '0 1px 0 rgba(255, 245, 220, 0.6), 0 0 6px rgba(217, 168, 92, 0.25)'
            : '0 1px 0.5px rgba(255, 248, 235, 0.75), 0 -1px 0.5px rgba(20, 10, 5, 0.45), 0 2px 4px rgba(38, 18, 7, 0.15)',
        }}
        {...props}
      >
        {title || children}
      </h3>
    </div>
  );
};

/**
 * CardDescription with Etched Script Font Style
 */
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p
    className={`text-[11px] sm:text-xs text-[#3E2211] leading-relaxed font-sans text-center font-medium ${className}`}
    style={{
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
    }}
    {...props}
  >
    {children}
  </p>
);

export const CardAction: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`w-full mt-auto pt-1.5 pb-0.5 sm:pb-1 flex justify-center items-center ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`w-full mb-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`w-full mt-auto pt-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export default BaseCard;
