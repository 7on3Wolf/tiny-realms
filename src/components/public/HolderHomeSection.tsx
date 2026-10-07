import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers } from 'react-icons/fi';
import SectionHeader from '../common/SectionHeader';
import BaseButton from '../ui/BaseButton';
import { fetchLiveXRPLHolders, RealHolderItem, CollectionStats } from '../../services/xrplHolderService';

/**
 * HolderHomeSection Component
 *
 * Clean, responsive leaderboard for mobile (Android), tablet, and desktop PC.
 */
export const HolderHomeSection: React.FC = () => {
  const [holders, setHolders] = useState<RealHolderItem[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);

  const loadData = async () => {
    const data = await fetchLiveXRPLHolders();
    setHolders(data.holders.slice(0, 5));
    setStats(data.stats);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section
      id="holder"
      className="w-full bg-[#4E4B47] text-[#F5EBDD] min-h-[100svh] snap-start snap-always flex flex-col justify-start pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 relative scroll-mt-12 sm:scroll-mt-14 overflow-hidden"
      aria-label="Tiny Realms Holders Section"
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
        {/* MAIN PANEL CONTAINER */}
        <div className="w-full bg-[#2D1B11]/90 border border-[#6B4226]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(10,5,2,0.55)] backdrop-blur-sm flex flex-col justify-between">
          
          {/* Section Header */}
          <SectionHeader
            eyebrow="COMMUNITY"
            title="HOLDERS"
            subtitle="Real-time XRPL holders from XRP Cafe."
            variant="dark"
            className="mb-4 sm:mb-6 lg:mb-8"
          />

          {/* MAIN LEADERBOARD CARD */}
          <div className="flex flex-col rounded-xl sm:rounded-2xl bg-[#1D110A]/90 border border-[#5A3820]/70 shadow-md relative overflow-hidden mb-5 sm:mb-8">
            {/* Top Subtle Ambient Glow */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#C69B5A]/10 to-transparent pointer-events-none" />

            {/* Table Action Header */}
            <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 bg-[#25160E] border-b border-[#5A3820] relative z-10">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[#C69B5A] shrink-0" />
                <span className="font-hero-title font-bold text-xs sm:text-sm text-[#F5EBDD] uppercase tracking-wider truncate">
                  TOP COLLECTORS
                </span>
              </div>

              <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#D8C3A5] text-[#2B170B] text-[10px] sm:text-xs font-mono font-bold shadow-xs shrink-0">
                {stats?.totalMinted || 87} NFTs
              </span>
            </div>

            {/* Table Column Labels */}
            <div className="flex items-center px-3.5 sm:px-6 py-2 bg-[#1A0E08] border-b border-[#5A3820]/50 text-[10px] sm:text-xs font-mono font-bold text-[#8C5D19] uppercase tracking-wider relative z-10">
              <div className="w-10 sm:w-16 text-center shrink-0">RANK</div>
              <div className="flex-1 text-left px-2 sm:px-6">HOLDER / ALIAS</div>
              <div className="w-16 sm:w-28 text-right shrink-0">OWNED</div>
            </div>

            {/* Leaderboard Rows */}
            <div className="divide-y divide-[#5A3820]/30 relative z-10">
              {holders.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center px-3.5 sm:px-6 py-3 hover:bg-[#25160E]/80 transition-colors group"
                >
                  {/* Rank */}
                  <div className="w-10 sm:w-16 text-center shrink-0">
                    <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full font-mono font-bold text-[10px] sm:text-xs ${
                      item.rank === 1
                        ? 'bg-[#C69B5A] text-[#2B170B] shadow-xs'
                        : item.rank === 2
                        ? 'bg-[#D8C3A5] text-[#2B170B]'
                        : item.rank === 3
                        ? 'bg-[#BFA588] text-[#2B170B]'
                        : 'bg-[#2D1B11] text-[#D5C4B1] border border-[#5A3820]'
                    }`}>
                      #{item.rank}
                    </span>
                  </div>

                  {/* Alias / Profile link */}
                  <div className="flex-1 text-left px-2 sm:px-6 min-w-0">
                    <a
                      href={item.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-xs sm:text-sm text-[#F5EBDD] group-hover:text-[#D9A85C] transition-colors truncate block"
                      title={item.name}
                    >
                      {item.name}
                    </a>
                  </div>

                  {/* Owned Count */}
                  <div className="w-16 sm:w-28 text-right shrink-0">
                    <span className="inline-block font-mono font-bold text-[10px] sm:text-xs text-[#2B170B] bg-[#D8C3A5] px-2.5 py-0.5 rounded-full border border-[#BFA588] shadow-xs">
                      {item.owned}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM CALL-TO-ACTION */}
          <div className="flex items-center justify-center pt-1">
            <Link to="/holders" className="focus:outline-none">
              <BaseButton
                variant="wood"
                size="md"
                icon={<FiArrowRight className="w-4 h-4 text-[#FFE3B3]" />}
                iconPosition="right"
              >
                View Full Leaderboard
              </BaseButton>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HolderHomeSection;
