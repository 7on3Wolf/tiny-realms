import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiFeather, FiCompass, FiHeart } from "react-icons/fi";
import SectionHeader from "../common/SectionHeader";
import BaseButton from "../ui/BaseButton";

// Character artwork assets for the 3 story blocks
import sproutBear from "../../assets/images/characters/bamboru.png";
import pandaWizard from "../../assets/images/characters/brunko.png";
import celestialAngelBear from "../../assets/images/characters/kumo.png";

/**
 * AboutHomeSection Component
 *
 * An exquisite, modern, asymmetric Bento Grid layout for the About Section.
 * Highly responsive across Mobile Android (single-column stack), Tablet, and Desktop PC.
 * Incorporates glassmorphic container cards, glowing celestial frames, and micro-interactions.
 */
export const AboutHomeSection: React.FC = () => {
  return (
    <section
      id="about"
      className="w-full bg-[#4E4B47] text-[#F5EBDD] min-h-[100svh] snap-start snap-always flex flex-col justify-start pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 relative scroll-mt-12 sm:scroll-mt-14 overflow-hidden"
      aria-label="About Tiny Realms Section"
    >
      {/* Subtle Warm Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(198, 155, 90, 0.22), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full relative z-10 flex flex-col justify-start">
        {/* MAIN PANEL CONTAINER WITH MODERN GLASSMORPHISM */}
        <div className="w-full bg-[#1A1108]/90 border border-[#5A3820]/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(10,5,2,0.7)] backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Decorative Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C69B5A]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8C5D19]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <SectionHeader
            eyebrow="OUR ORIGIN & CREATOR STORY"
            title="ABOUT"
            subtitle="The journey, vision, and heart behind Tiny Realms."
            variant="dark"
            className="mb-6 sm:mb-10 lg:mb-12"
          />

          {/* MODERN ASYMMETRIC BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch mb-8 sm:mb-10">
            {/* CARD 1: THE ORIGIN & XRPL (col-span-2) */}
            <div className="group relative md:col-span-2 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2D1B11]/95 to-[#1A1108]/95 border border-[#5A3820]/60 hover:border-[#C69B5A]/70 hover:shadow-[0_12px_40px_rgba(198,155,90,0.12)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              {/* Ambient Top Glow on Hover */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#C69B5A]/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col sm:flex-row gap-6 items-center h-full justify-between relative z-10">
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  {/* Badge & Number */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#3D2214]/60">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A0E07]/90 border border-[#5A3820] text-[9px] font-mono font-bold text-[#D9A85C] uppercase tracking-widest">
                      <FiCompass className="w-3.5 h-3.5 text-[#C69B5A]" />
                      <span>THE BEGINNING</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#C69B5A]/80">
                      01
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-hero-title font-black text-lg sm:text-xl text-[#F5EBDD] uppercase tracking-wider group-hover:text-[#D9A85C] transition-colors">
                    THE ORIGIN & XRPL
                  </h3>

                  {/* Text */}
                  <p className="font-sans text-xs sm:text-sm text-[#CDBCA8] sm:text-[#D5C4B1] leading-relaxed">
                    Tiny Realms was founded by two creators from Indonesia with
                    a shared passion for character design. Discovering the XRPL
                    ecosystem inspired us to bring our hand-drawn characters and
                    creative world to life.
                  </p>
                </div>

                {/* Character Showcase Viewport inside Card */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative flex items-center justify-center rounded-2xl bg-[#1A0E07]/80 border border-[#5A3820]/50 p-3 shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,155,90,0.1)_0%,transparent_70%)] pointer-events-none" />
                  <img
                    src={sproutBear}
                    alt="Tiny Realms Origin Character"
                    className="w-full h-full object-contain brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: HANDMADE CRAFT (col-span-1, row-span-2 tall card) */}
            <div className="group relative md:col-span-1 md:row-span-2 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2D1B11]/95 to-[#1A1108]/95 border border-[#5A3820]/60 hover:border-[#C69B5A]/70 hover:shadow-[0_12px_40px_rgba(198,155,90,0.12)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              {/* Ambient Top Glow on Hover */}
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#C69B5A]/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col justify-between h-full space-y-6 relative z-10">
                <div className="space-y-4">
                  {/* Badge & Number */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#3D2214]/60">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A0E07]/90 border border-[#5A3820] text-[9px] font-mono font-bold text-[#D9A85C] uppercase tracking-widest">
                      <FiFeather className="w-3.5 h-3.5 text-[#C69B5A]" />
                      <span>ARTISAN PROCESS</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#C69B5A]/80">
                      02
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-hero-title font-black text-lg sm:text-xl text-[#F5EBDD] uppercase tracking-wider group-hover:text-[#D9A85C] transition-colors">
                    HANDMADE CRAFT
                  </h3>
                </div>

                {/* Prominent Center Illustration Frame */}
                <div className="flex-1 min-h-[140px] flex items-center justify-center">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#1A0E07]/80 border border-[#5A3820]/50 p-4 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,155,90,0.15)_0%,transparent_75%)] pointer-events-none rounded-full" />
                    <img
                      src={pandaWizard}
                      alt="Handmade Craft Character"
                      className="w-full h-full object-contain brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-[#CDBCA8] sm:text-[#D5C4B1] leading-relaxed">
                  Every character begins with authentic hand-drawn sketches. We
                  enjoy experimenting with distinct outfits, whimsical lore, and
                  unique personalities—slowly building our realm one idea at a
                  time.
                </p>
              </div>
            </div>

            {/* CARD 3: EXPLORATION & VISION (col-span-2) */}
            <div className="group relative md:col-span-2 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2D1B11]/95 to-[#1A1108]/95 border border-[#5A3820]/60 hover:border-[#C69B5A]/70 hover:shadow-[0_12px_40px_rgba(198,155,90,0.12)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              {/* Ambient Top Glow on Hover */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#C69B5A]/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col sm:flex-row gap-6 items-center h-full justify-between relative z-10">
                {/* Image Showcase Frame (On Left on PC for Asymmetry) */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 relative flex items-center justify-center rounded-2xl bg-[#1A0E07]/80 border border-[#5A3820]/50 p-3 shadow-inner overflow-hidden order-last sm:order-first group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,155,90,0.1)_0%,transparent_70%)] pointer-events-none" />
                  <img
                    src={celestialAngelBear}
                    alt="Exploration and Vision Character"
                    className="w-full h-full object-contain brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 space-y-4 text-center sm:text-left">
                  {/* Badge & Number */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#3D2214]/60">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A0E07]/90 border border-[#5A3820] text-[9px] font-mono font-bold text-[#D9A85C] uppercase tracking-widest">
                      <FiHeart className="w-3.5 h-3.5 text-[#C69B5A]" />
                      <span>OUR HORIZON</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#C69B5A]/80">
                      03
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-hero-title font-black text-lg sm:text-xl text-[#F5EBDD] uppercase tracking-wider group-hover:text-[#D9A85C] transition-colors">
                    EXPLORATION & VISION
                  </h3>

                  {/* Text */}
                  <p className="font-sans text-xs sm:text-sm text-[#CDBCA8] sm:text-[#D5C4B1] leading-relaxed">
                    There is still so much we want to explore—new character
                    realms, stories, and engaging perks for collectors. We are
                    deeply grateful to everyone supporting us on this journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM CALL-TO-ACTION */}
          <div className="flex items-center justify-center pt-2">
            <Link to="/info" className="focus:outline-none">
              <BaseButton
                variant="wood"
                size="md"
                icon={<FiArrowRight className="w-4 h-4 text-[#FFE3B3]" />}
                iconPosition="right"
              >
                Learn More About Tiny Realms
              </BaseButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHomeSection;
