import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { teamMembers } from '../../data/team';
import BaseButton from '../ui/BaseButton';
import SectionHeader from '../common/SectionHeader';

/**
 * TeamHomeSection Component
 *
 * Professional 3-column card grid showcasing the Tiny Realms core team
 * (AGIP as Artist & Owner, LIEBE as Web Developer, KIKO as Visual Artist)
 * on the Home page, adhering to the rich chocolate, wood, and kopi-susu palette.
 * Keeps photos in their authentic square proportions without distortion.
 */
export const TeamHomeSection: React.FC = () => {
  return (
    <section
      id="team"
      className="w-full bg-[#24170F] text-[#F5EBDD] min-h-[100svh] snap-start snap-always flex flex-col justify-start pt-14 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 relative scroll-mt-12 sm:scroll-mt-14"
      aria-label="Team Section"
    >
      {/* Subtle Warm Amber Glow */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at 50% 40%, rgba(198, 155, 90, 0.2), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* STANDARD CONTAINER: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col items-center justify-start space-y-8 sm:space-y-10 lg:space-y-12 w-full relative z-10">
        
        {/* CONTAINER PANEL: Matching Roadmap Rich Chocolate & Timber Panel */}
        <div className="w-full bg-[#2D1B11]/90 border border-[#6B4226]/60 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(10,5,2,0.55)] backdrop-blur-sm flex flex-col items-center">
          
          {/* SECTION HEADER */}
          <SectionHeader
            eyebrow="THE ARCHITECTS"
            title="TEAM"
            subtitle="Meet the artists, developers, and creative minds building the Tiny Realms ecosystem."
            variant="dark"
            className="mb-8 sm:mb-10"
          />

          {/* 3-COLUMN TEAM GRID: Rich Wood, Chocolate & Kopi Susu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#1D110A]/90 border border-[#5A3820]/70 hover:border-[#C69B5A] rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center shadow-[0_16px_36px_rgba(10,5,2,0.45)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              >
                {/* Card Header Top Glow */}
                <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#C69B5A]/10 to-transparent pointer-events-none" />

                {/* Photo Frame: Preserves Original Shape without Deformation */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 aspect-square rounded-2xl p-1 bg-[#28180E] border-2 border-[#5A3820] group-hover:border-[#C69B5A] shadow-md mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-xl select-none pointer-events-none bg-[#1A0F0A]"
                    loading="lazy"
                  />
                </div>

                {/* Member Name */}
                <h3 className="font-hero-title font-extrabold text-base sm:text-lg text-[#F5EBDD] tracking-wider uppercase leading-tight group-hover:text-[#D9A85C] transition-colors duration-200">
                  {member.name}
                </h3>

                {/* Role Badge: Kopi Susu Accent */}
                <div className="mt-1.5 mb-3">
                  <span className="inline-block font-mono text-[11px] sm:text-xs font-bold text-[#2B170B] bg-[#D8C3A5] border border-[#BFA588] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {member.role}
                  </span>
                </div>

                {/* Bio */}
                <p className="font-sans text-xs sm:text-sm text-[#D5C4B1] leading-relaxed line-clamp-3 mb-4 flex-1">
                  {member.bio}
                </p>

                {/* Contribution Tags: Kopi Susu & Chocolate */}
                <div className="flex flex-wrap justify-center gap-1.5 pt-3 border-t border-[#5A3820]/60 w-full">
                  {member.contributions.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] text-[#E8DCCB] bg-[#2A170C] border border-[#5A3820] px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM ACTION BUTTON */}
          <div className="mt-8 pt-4">
            <Link to="/team" className="focus:outline-none">
              <BaseButton
                variant="wood"
                size="md"
                icon={<FiArrowRight className="w-4 h-4 text-[#FFE3B3]" />}
                iconPosition="right"
                aria-label="Meet the full team on dedicated team page"
              >
                Meet Full Team
              </BaseButton>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TeamHomeSection;
