import React from 'react';
import bearKingImg from '../../assets/images/characters/bear_king.png';
import monkeyPandaImg from '../../assets/images/characters/monkey_panda.png';
import pirateMonkeyImg from '../../assets/images/characters/pirate_monkey.png';
import pupMonkeyImg from '../../assets/images/characters/pup_monkey.png';
import { BaseCard, CardImage } from '../ui/BaseCard';
import SectionHeader from '../common/SectionHeader';

interface RoadmapItem {
  milestone: string;
  character: string;
  image: string;
  description: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    milestone: '50 MINTED',
    character: 'BEAR KING',
    image: bearKingImg,
    description: 'The kingdom awakes.',
  },
  {
    milestone: '100 MINTED',
    character: 'MONKEY PANDA',
    image: monkeyPandaImg,
    description: 'A new story begins to unfold.',
  },
  {
    milestone: '150 MINTED',
    character: 'PIRATE MONKEY',
    image: pirateMonkeyImg,
    description: 'The realm grows stronger.',
  },
  {
    milestone: '200 MINTED',
    character: 'PUP MONKEY & FRIEND',
    image: pupMonkeyImg,
    description: 'More allies join the adventure.',
  },
];

const DesktopConnector: React.FC = () => (
  <div className="shrink-0 flex items-center justify-center px-1 xl:px-2 select-none pointer-events-none self-center">
    <svg
      className="w-5 h-5 xl:w-6 xl:h-6 text-[#C69B5A]/70 transform rotate-0 drop-shadow-xs"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const MobileDownArrow: React.FC = () => (
  <div className="flex justify-center items-center py-1 select-none pointer-events-none">
    <svg
      className="w-4 h-4 text-[#C69B5A]/70 transform rotate-90"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const RoadmapHomeSection: React.FC = () => {
  return (
    <section
      id="roadmap"
      className="w-full bg-[#24170F] text-[#F5EBDD] min-h-[100svh] snap-start snap-always flex flex-col justify-start pt-14 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 relative scroll-mt-12 sm:scroll-mt-14"
      aria-label="Tiny Realms Roadmap Section"
    >
      {/* Subtle Warm Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(198, 155, 90, 0.18), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 w-full relative z-10 flex flex-col justify-start">
        
        {/* CONTAINER: Redesigned Slate-Gray Panel */}
        <div className="w-full bg-[#4E4B47]/95 border border-[#696866]/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(10,5,2,0.55)] backdrop-blur-sm">
          
          {/* Section Header */}
          <SectionHeader
            eyebrow="MILESTONES & JOURNEY"
            title="ROADMAP"
            subtitle="A visual progression of characters and lore unlocking as the collection expands."
            variant="dark"
            className="mb-6 sm:mb-8 lg:mb-10"
          />

          {/* ======================================================== */}
          {/* DESKTOP PROGRESSION VIEW (>= lg)                          */}
          {/* ======================================================== */}
          <div className="hidden lg:flex items-stretch justify-between w-full gap-2 xl:gap-3">
            {roadmapItems.map((item) => (
              <React.Fragment key={item.milestone}>
                <div className="flex-1 min-w-0 flex flex-col items-center text-center p-2 rounded-2xl bg-[#1D110A]/80 border border-[#5A3820]/60 hover:border-[#C69B5A]/60 transition-all duration-300 group">
                  
                  {/* Milestone Pill - Kopi Susu Accent */}
                  <div className="text-center mb-2.5">
                    <span className="inline-block bg-[#D8C3A5] text-[#2B170B] border border-[#BFA588] font-mono font-bold text-[10px] xl:text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      {item.milestone}
                    </span>
                  </div>

                  {/* Character Image in Paper BaseCard (Strictly for image framing) */}
                  <div className="w-full aspect-square max-w-[120px] xl:max-w-[140px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                    <BaseCard
                      aspectRatio="square"
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      contentClassName="p-2 flex items-center justify-center"
                    >
                      <CardImage
                        src={item.image}
                        alt={item.character}
                        skeletonBorderRadius={10}
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(36,23,15,0.3)] select-none pointer-events-none"
                      />
                    </BaseCard>
                  </div>

                  {/* Character Title */}
                  <h3 className="font-hero-title font-bold text-xs xl:text-sm text-[#F5EBDD] uppercase tracking-wide mt-3 mb-1 group-hover:text-[#D9A85C] transition-colors">
                    {item.character}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-[11px] text-[#CDBCA8] leading-tight px-1 max-w-[160px]">
                    {item.description}
                  </p>
                </div>

                <DesktopConnector />
              </React.Fragment>
            ))}

            {/* Final Milestone: The Journey Continues */}
            <div className="flex-1 min-w-0 flex flex-col items-center text-center p-2 rounded-2xl bg-[#1D110A]/80 border border-[#5A3820]/60 hover:border-[#C69B5A]/60 transition-all duration-300 group">
              
              <div className="text-center mb-2.5">
                <span className="inline-block bg-[#D8C3A5] text-[#2B170B] border border-[#BFA588] font-mono font-bold text-[10px] xl:text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  CONTINUES
                </span>
              </div>

              {/* Mystery Frame in Paper BaseCard */}
              <div className="w-full aspect-square max-w-[120px] xl:max-w-[140px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                <BaseCard
                  aspectRatio="square"
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  contentClassName="p-2 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-3xl xl:text-4xl text-[#8C5D19] font-serif leading-none">
                    ✦
                  </span>
                  <span className="font-mono text-[9px] xl:text-[10px] text-[#5A351E] tracking-widest uppercase font-bold mt-1">
                    FUTURE REALMS
                  </span>
                </BaseCard>
              </div>

              <h3 className="font-hero-title font-bold text-xs xl:text-sm text-[#F5EBDD] uppercase tracking-wide mt-3 mb-1 group-hover:text-[#D9A85C] transition-colors">
                THE JOURNEY CONTINUES
              </h3>

              <p className="font-sans text-[11px] text-[#CDBCA8] leading-tight px-1 max-w-[160px]">
                More realms, characters, and stories will unfold.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MOBILE PROGRESSION VIEW (< lg)                            */}
          {/* ======================================================== */}
          <div className="lg:hidden flex flex-col space-y-2 py-1 w-full">
            {roadmapItems.map((item) => (
              <React.Fragment key={`mob-${item.milestone}`}>
                <div className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#1D110A]/80 border border-[#5A3820]/60">
                  <div className="flex-1 flex flex-col items-start text-left min-w-0">
                    <span className="inline-block bg-[#D8C3A5] text-[#2B170B] border border-[#BFA588] font-mono font-bold text-[9px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
                      {item.milestone}
                    </span>

                    <h3 className="font-hero-title font-bold text-xs sm:text-base text-[#F5EBDD] uppercase tracking-wide leading-snug truncate w-full">
                      {item.character}
                    </h3>

                    <p className="font-sans text-[11px] sm:text-xs text-[#CDBCA8] leading-tight mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {/* Character Image in Paper BaseCard */}
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                    <BaseCard
                      aspectRatio="square"
                      className="w-full h-full"
                      contentClassName="p-1 flex items-center justify-center"
                    >
                      <CardImage
                        src={item.image}
                        alt={item.character}
                        skeletonBorderRadius={8}
                        className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(36,23,15,0.3)] select-none pointer-events-none"
                      />
                    </BaseCard>
                  </div>
                </div>

                <MobileDownArrow />
              </React.Fragment>
            ))}

            {/* Final Milestone Mobile */}
            <div className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#1D110A]/80 border border-[#5A3820]/60">
              <div className="flex-1 flex flex-col items-start text-left min-w-0">
                <span className="inline-block bg-[#D8C3A5] text-[#2B170B] border border-[#BFA588] font-mono font-bold text-[9px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 shadow-xs">
                  CONTINUES
                </span>

                <h3 className="font-hero-title font-bold text-xs sm:text-base text-[#F5EBDD] uppercase tracking-wide leading-snug">
                  THE JOURNEY CONTINUES
                </h3>

                <p className="font-sans text-[11px] sm:text-xs text-[#CDBCA8] leading-tight mt-0.5">
                  More realms, characters, and stories will unfold.
                </p>
              </div>

              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
                <BaseCard
                  aspectRatio="square"
                  className="w-full h-full"
                  contentClassName="p-1 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-xl sm:text-2xl text-[#8C5D19] font-serif leading-none">
                    ✦
                  </span>
                  <span className="font-mono text-[8px] sm:text-[9px] text-[#5A351E] tracking-widest uppercase font-bold">
                    FUTURE
                  </span>
                </BaseCard>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default RoadmapHomeSection;
