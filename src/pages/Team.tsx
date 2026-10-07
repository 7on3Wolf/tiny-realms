import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { teamMembers } from '../data/team';
import { TeamMemberSkeleton } from '../components/common/Skeletons';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';

/**
 * Team Page
 *
 * Dedicated showcase for the creators, illustrators, and architects behind Tiny Realms.
 * Preserves all logic, data bindings, and links while elevating aesthetics.
 */
export default function Team() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'The Team — Tiny Realms';
    window.scrollTo({ top: 0, behavior: 'instant' });
    const timer = setTimeout(() => setIsLoading(false), 180);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main id="team" className="flex-1 w-full py-8 sm:py-12 lg:py-16 bg-[#696866] text-[#F5EBDD]">
      <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Return Link */}
        <div className="mb-6 sm:mb-10">
          <Link
            to="/#team"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors group"
            aria-label="Return to home page"
          >
            <FiArrowLeft className="w-3.5 h-3.5 text-[#C69B5A] group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO HOME</span>
          </Link>
        </div>

        {/* ======================================================== */}
        {/* PAGE INTRODUCTION                                        */}
        {/* ======================================================== */}
        <header className="pb-8 sm:pb-12 border-b border-[#5A351E]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#D9A85C] uppercase mb-1">
            <span>CREATIVE GUILD</span>
            <span aria-hidden="true" className="text-[#8C5D19]">·</span>
            <span>CORE TEAM</span>
          </div>

          <h1 className="font-hero-title font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#F5EBDD] uppercase">
            THE TEAM
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#E8DCCB] font-medium leading-relaxed max-w-2xl">
            Meet the artists, developers, and creative minds crafting the Tiny Realms universe.
          </p>
        </header>

        {/* ======================================================== */}
        {/* TEAM MEMBERS LIST                                        */}
        {/* ======================================================== */}
        <section
          aria-label="Core Team Members"
          className="py-10 sm:py-14"
        >
          {isLoading ? (
            <TeamMemberSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#24170F]/95 rounded-3xl border border-[#5A351E] p-6 sm:p-7 flex flex-col justify-between hover:border-[#C69B5A] transition-all duration-300 shadow-xl group"
                >
                  <div>
                    {/* Top Avatar & Handle */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-[#5A351E] group-hover:border-[#C69B5A] transition-colors bg-[#1A0E07] shadow-inner">
                        <ImageWithSkeleton
                          src={member.avatar}
                          alt={member.name}
                          aspectRatio="aspect-square"
                          rounded="rounded-xl"
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#D9A85C] bg-[#1A0E07] border border-[#3D2214] px-3 py-1 rounded-xl uppercase tracking-wider shadow-xs">
                        {member.handle}
                      </span>
                    </div>

                    {/* Name & Role */}
                    <h2 className="font-hero-title font-black text-xl sm:text-2xl text-[#F5EBDD] uppercase tracking-wide group-hover:text-[#D9A85C] transition-colors">
                      {member.name}
                    </h2>
                    <p className="font-mono text-xs text-[#C69B5A] mt-1 uppercase tracking-wider font-semibold">
                      {member.role}
                    </p>

                    {/* Bio */}
                    <p className="mt-4 text-xs sm:text-sm text-[#CDBCA8] leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Contributions */}
                  <div className="mt-6 pt-5 border-t border-[#3D2214]">
                    <span className="text-[10px] font-mono text-[#D9A85C] uppercase tracking-wider block mb-2 font-bold">
                      FOCUS & CRAFT
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {member.contributions.map((contrib) => (
                        <span
                          key={contrib}
                          className="text-[11px] font-mono bg-[#1A0E07] text-[#F5EBDD] px-2.5 py-1 rounded-lg border border-[#3D2214]"
                        >
                          {contrib}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
