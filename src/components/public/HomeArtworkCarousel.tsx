import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import BaseButton from '../ui/BaseButton';
import heroDesktopImage from '../../assets/images/hero_fantasy_desktop_clean_1790404284326.jpg';
import heroMobileImage from '../../assets/images/hero_fantasy_mobile_clean_1790404301518.jpg';

/**
 * HomeArtworkCarousel (Simple, Clean Hero Section)
 *
 * Minimalist, elegant, and perfectly responsive across:
 * - Mobile Android (360px - 480px)
 * - Tablet (768px - 1024px)
 * - PC / Desktop (1024px+)
 *
 * Free of emojis, clutter, or distracting boxes.
 */
export default function HomeArtworkCarousel() {
  return (
    <section
      id="home-hero"
      className="relative w-full overflow-hidden select-none min-h-[100svh] h-[100svh] snap-start snap-always scroll-mt-0 flex flex-col justify-center"
      aria-label="Tiny Realms Hero"
    >
      {/* Background Fantasy Artwork */}
      <picture className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
        <source media="(max-width: 767px)" srcSet={heroMobileImage} />
        <source media="(min-width: 768px)" srcSet={heroDesktopImage} />
        <img
          src={heroDesktopImage}
          alt="Tiny Realms Fantasy World"
          className="w-full h-full object-cover object-center pointer-events-none select-none"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* Clean Gradient & Dark Vignette for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#24170F]/80 via-[#24170F]/45 to-[#4E4B47] pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(36,23,15,0.2)_0%,rgba(36,23,15,0.8)_100%)] pointer-events-none z-[2]" />

      {/* Hero Content: Centered, Clean & Simple */}
      <div className="relative z-[10] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center justify-center pt-16 pb-8">
        
        {/* Main Title: TINY REALMS */}
        <div className="relative flex flex-col items-center">
          <h1 className="font-hero-title font-black text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F5EBDD] uppercase leading-[0.95] drop-shadow-[0_4px_24px_rgba(20,10,5,0.95)] select-none">
            TINY REALMS
          </h1>

          {/* Clean Brush Underline */}
          <svg
            className="w-48 xs:w-60 sm:w-72 md:w-80 lg:w-96 h-2.5 sm:h-3 md:h-3.5 text-[#C69B5A] mt-2 opacity-90 drop-shadow-sm"
            viewBox="0 0 300 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 8C70 3 150 9 296 5"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Paragraph: Clean without Emojis */}
        <p className="font-sans font-medium text-sm sm:text-base md:text-lg text-[#E8DCCB] tracking-wide leading-relaxed max-w-xs sm:max-w-md md:max-w-xl drop-shadow-[0_2px_10px_rgba(20,10,5,0.9)] mt-4 sm:mt-5 mb-6 sm:mb-8">
          Small characters. Endless worlds. A hand-drawn fantasy character universe and digital collectibles created on the XRP Ledger.
        </p>

        {/* 2 Simple CTA Buttons */}
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
          {/* Primary CTA */}
          <Link to="/collection" className="focus:outline-none">
            <BaseButton
              variant="primary"
              size="md"
              aria-label="Explore Collection"
            >
              Explore Collection
            </BaseButton>
          </Link>

          {/* Secondary CTA */}
          <a href="#roadmap" className="focus:outline-none">
            <BaseButton
              variant="secondary"
              size="md"
              icon={<FiArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              aria-label="View Roadmaps"
            >
              Road Maps
            </BaseButton>
          </a>
        </div>

      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center z-[10] pointer-events-none">
        <a
          href="#about"
          className="pointer-events-auto flex flex-col items-center text-[#CDBCA8]/50 hover:text-[#F5EBDD] transition-colors"
          aria-label="Scroll to About section"
        >
          <div className="w-4 h-6 rounded-full border border-[#CDBCA8]/40 flex justify-center pt-1">
            <div className="w-1 h-1.5 rounded-full bg-[#C69B5A] animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
