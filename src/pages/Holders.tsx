import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { fetchLiveXRPLHolders, TINY_REALMS_CONFIG, RealHolderItem, CollectionStats } from '../services/xrplHolderService';

export default function Holders() {
  const [holders, setHolders] = useState<RealHolderItem[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLiveXRPLHolders();
    setHolders(data.holders);
    setStats(data.stats);
    setLoading(false);
  };

  useEffect(() => {
    document.title = 'Tiny Realms — Holders Leaderboard';
    window.scrollTo(0, 0);
    loadData();
  }, []);

  const filteredHolders = holders.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main id="holders" className="flex-1 w-full py-10 sm:py-16 lg:py-20 bg-[#4E4B47] text-[#F5EBDD] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Return Link */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/#holder"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#D5C4B1] hover:text-[#F5EBDD] transition-colors"
            aria-label="Return to home page"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO HOME</span>
          </Link>

          {/* XRP Cafe Link */}
          <a
            href={TINY_REALMS_CONFIG.xrpCafeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2D1B11] border border-[#6B4226] text-[#C69B5A] hover:text-[#F5EBDD] text-xs font-mono transition-colors shadow-xs"
          >
            <span>View on XRP Cafe</span>
            <FiExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Page Header */}
        <header className="pb-8 border-b border-[#6B4226]/50 mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-[#2B170B] bg-[#D8C3A5] border border-[#BFA588] px-3 py-0.5 rounded-full uppercase shadow-xs">
              ON-CHAIN LEADERBOARD
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1D110A] border border-[#5A3820] text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE SYNC</span>
            </div>
          </div>

          <h1 className="font-hero-title font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-[#F5EBDD]">
            Holders Leaderboard
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#D5C4B1] max-w-2xl leading-relaxed">
            Meet the collectors and community custodians preserving the Tiny Realms universe on XRP Cafe.
          </p>

          {/* Clean Quick Stats Grid (3 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-[#2D1B11]/90 border border-[#6B4226]/60 shadow-sm">
              <div className="font-mono text-[10px] uppercase text-[#CDBCA8] mb-1">Total Minted</div>
              <div className="font-mono font-bold text-xl sm:text-2xl text-[#C69B5A]">
                {stats?.totalMinted || 87} <span className="text-xs text-[#D5C4B1]">NFTs</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#2D1B11]/90 border border-[#6B4226]/60 shadow-sm">
              <div className="font-mono text-[10px] uppercase text-[#CDBCA8] mb-1">Holders Count</div>
              <div className="font-mono font-bold text-xl sm:text-2xl text-[#F5EBDD]">
                {holders.length} <span className="text-xs text-[#D5C4B1]">Wallets</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#2D1B11]/90 border border-[#6B4226]/60 shadow-sm flex flex-col justify-between">
              <div className="font-mono text-[10px] uppercase text-[#CDBCA8] mb-1">Official Marketplace</div>
              <a
                href={TINY_REALMS_CONFIG.xrpCafeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-xs sm:text-sm text-[#D8C3A5] hover:text-[#C69B5A] flex items-center gap-1.5"
              >
                <span>xrp.cafe/id/collection/tinyrealms</span>
                <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          </div>
        </header>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CDBCA8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alias or address..."
              className="w-full pl-10 pr-4 py-2 bg-[#2D1B11] border border-[#6B4226]/70 rounded-xl text-xs sm:text-sm font-mono text-[#F5EBDD] placeholder-[#CDBCA8]/50 focus:outline-none focus:border-[#C69B5A]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="font-mono text-xs text-[#CDBCA8]">
              Showing {filteredHolders.length} collectors
            </span>
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2D1B11] hover:bg-[#3D2214] border border-[#6B4226] text-xs font-mono text-[#F5EBDD] transition-colors"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C69B5A]' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Holders Table */}
        <div className="bg-[#2D1B11]/95 border border-[#6B4226]/70 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {/* Table Header */}
          <div className="flex items-center px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#6B4226]/70 bg-[#1D110A] text-[11px] sm:text-xs font-mono font-bold text-[#C69B5A] uppercase tracking-wider">
            <div className="w-16 sm:w-20 text-center">RANK</div>
            <div className="flex-1 text-left px-3 sm:px-6">HOLDER / ALIAS</div>
            <div className="w-20 sm:w-28 text-right">OWNED</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#5A3820]/40">
            {filteredHolders.length > 0 ? (
              filteredHolders.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center px-4 py-3.5 sm:px-6 sm:py-4 transition-colors hover:bg-[#3D2214]/60 group"
                >
                  {/* Rank */}
                  <div className="w-16 sm:w-20 text-center font-mono font-bold text-xs sm:text-sm">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                      item.rank === 1
                        ? 'bg-[#C69B5A] text-[#2B170B] shadow-xs'
                        : item.rank === 2
                        ? 'bg-[#D8C3A5] text-[#2B170B]'
                        : item.rank === 3
                        ? 'bg-[#BFA588] text-[#2B170B]'
                        : 'text-[#CDBCA8]'
                    }`}>
                      #{item.rank < 10 ? `0${item.rank}` : item.rank}
                    </span>
                  </div>

                  {/* Name / Address with profile link */}
                  <div className="flex-1 text-left px-3 sm:px-6 min-w-0">
                    <div className="flex items-center gap-2">
                      <a
                        href={item.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans font-bold text-xs sm:text-sm text-[#F5EBDD] group-hover:text-[#C69B5A] transition-colors truncate flex items-center gap-1.5"
                      >
                        <span>{item.name}</span>
                        <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#C69B5A]" />
                      </a>
                    </div>
                    <div className="font-mono text-[10px] text-[#CDBCA8]/60 truncate">
                      {item.address}
                    </div>
                  </div>

                  {/* Owned */}
                  <div className="w-20 sm:w-28 text-right">
                    <span className="inline-block font-mono font-bold text-xs sm:text-sm text-[#2B170B] bg-[#D8C3A5] px-3 py-0.5 rounded-full border border-[#BFA588] shadow-xs">
                      {item.owned}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm font-mono text-[#CDBCA8]">
                No collectors found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
