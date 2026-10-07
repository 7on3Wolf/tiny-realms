import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: 'dark' | 'parchment';
  className?: string;
  showDivider?: boolean;
}

/**
 * SectionHeader Component
 * Standardized header used across all Home sections (About, Our Story, Roadmap, Collection, Gallery, Holders, Team).
 * - Identical typography model & size
 * - Zero background (pure typography)
 * - Harmonized color variants for dark background or inside parchment BaseCard
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  variant = 'dark',
  className = '',
  showDivider = false,
}) => {
  const isParchment = variant === 'parchment';

  const eyebrowColor = isParchment ? 'text-[#8C5D19]' : 'text-[#C69B5A]';
  const titleColor = isParchment ? 'text-[#2B1407]' : 'text-[#F5EBDD]';
  const subtitleColor = isParchment ? 'text-[#3D210F]' : 'text-[#CDBCA8]';

  return (
    <div
      className={`flex flex-col items-center text-center space-y-1.5 sm:space-y-2 max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 w-full ${className}`}
    >
      {eyebrow && (
        <span
          className={`text-xs sm:text-sm font-mono font-bold uppercase tracking-widest block ${eyebrowColor}`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-hero-title font-extrabold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide leading-tight ${titleColor}`}
        style={
          isParchment
            ? {
                textShadow:
                  '0 1px 0.5px rgba(255, 248, 235, 0.75), 0 -1px 0.5px rgba(20, 10, 5, 0.45)',
              }
            : undefined
        }
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-sans text-xs xs:text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium ${subtitleColor}`}
        >
          {subtitle}
        </p>
      )}
      {showDivider && (
        <div className="w-full relative flex items-center justify-center pt-2 pb-1">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#5A3012]/30 to-transparent" />
          <div className="absolute px-2.5 bg-transparent text-[#5A3012]/70 text-[10px] sm:text-xs">
            ✦ ✦ ✦
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
