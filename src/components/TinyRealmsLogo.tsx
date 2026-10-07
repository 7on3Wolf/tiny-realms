import React from 'react';

interface TinyRealmsLogoProps {
  size?: number | string;
  className?: string;
  color?: string;
  variant?: 'white' | 'dark' | 'accent' | 'monochrome' | 'badge';
}

export default function TinyRealmsLogo({
  size = 32,
  className = '',
  color,
  variant = 'monochrome'
}: TinyRealmsLogoProps) {
  let fillColor = '#FFFFFF';
  let badgeBg = '#17171A';

  if (color) {
    fillColor = color;
  } else if (variant === 'dark') {
    fillColor = '#17171A';
  } else if (variant === 'accent') {
    fillColor = '#D94F70';
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-[#242429] border border-[#33333D] overflow-hidden shadow-xs shrink-0 ${className}`}
        style={{ width: typeof size === 'number' ? size : size, height: typeof size === 'number' ? size : size }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-4/5 h-4/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Planet Dome Head */}
          <path
            d="M 142 278 C 136 182, 196 150, 250 150 C 304 150, 364 182, 358 278 C 342 284, 320 290, 290 294 C 290 270, 280 250, 250 250 C 220 250, 210 270, 210 294 C 180 290, 158 284, 142 278 Z"
            fill={fillColor}
          />
          {/* Eyes */}
          <ellipse cx="205" cy="245" rx="13" ry="22" fill={fillColor} />
          <ellipse cx="295" cy="245" rx="13" ry="22" fill={fillColor} />

          {/* Sweeping Planetary Orbit Ring */}
          <path
            d="M 405 200 C 430 206, 435 224, 400 248 C 360 274, 295 306, 215 320 C 145 332, 90 328, 82 312 C 75 298, 100 278, 145 260 C 132 274, 115 288, 115 298 C 115 308, 155 316, 215 308 C 290 296, 365 264, 400 238 C 420 222, 412 210, 395 206 L 405 200 Z"
            fill={fillColor}
          />
          {/* Bottom Tapered Accent */}
          <path
            d="M 260 338 C 310 336, 350 310, 362 284 C 352 305, 310 330, 260 338 Z"
            fill={fillColor}
          />
        </svg>
      </div>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="70 140 360 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-300 ${className}`}
      aria-label="Tiny Realms Official Logo"
    >
      {/* 
        Tiny Realms Official Brandmark (Planetary Character with Orbit Ring)
      */}
      {/* Planet Dome Body */}
      <path
        d="M 144 280 C 138 184, 196 150, 250 150 C 304 150, 362 184, 356 280 C 330 288, 292 293, 250 293 C 208 293, 170 288, 144 280 Z"
        fill={fillColor}
      />

      {/* Two Vertical Oval Eyes */}
      <ellipse cx="206" cy="245" rx="14" ry="22" fill="#17171A" />
      <ellipse cx="294" cy="245" rx="14" ry="22" fill="#17171A" />
      {/* If fillColor is white on dark, or transparent eyes */}
      <ellipse cx="206" cy="245" rx="13" ry="20" fill={variant === 'dark' ? '#F7F5F2' : (fillColor === '#FFFFFF' ? '#17171A' : '#FFFFFF')} />
      <ellipse cx="294" cy="245" rx="13" ry="20" fill={variant === 'dark' ? '#F7F5F2' : (fillColor === '#FFFFFF' ? '#17171A' : '#FFFFFF')} />

      {/* Sweeping Planetary Orbit Ring */}
      <path
        d="M 390 202 C 426 210, 430 228, 396 250 C 352 278, 280 312, 195 324 C 130 334, 85 328, 80 312 C 75 296, 105 274, 148 256 C 136 270, 118 284, 118 296 C 118 308, 156 316, 212 308 C 285 296, 360 264, 396 238 C 418 222, 408 210, 386 206 L 390 202 Z"
        fill={fillColor}
      />
      {/* Dynamic bottom orbit swoop */}
      <path
        d="M 258 338 C 308 334, 348 308, 362 284 C 350 306, 308 328, 258 338 Z"
        fill={fillColor}
      />
    </svg>
  );
}
