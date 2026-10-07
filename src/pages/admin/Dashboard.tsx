import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Palette,
  Eye,
  FileEdit,
  FolderKanban,
  Plus,
  ArrowRight,
  ExternalLink,
  Layers,
  Users,
  Activity,
  MousePointerClick,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardStatsSkeleton } from '../../components/common/Skeletons';
import {
  getVisitorStats,
  getRecentVisitEvents,
  resetVisitorStats,
  VisitorStats,
  VisitEvent,
} from '../../services/visitorService';

export default function AdminDashboard() {
  const { artworks, collections } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [visitorStats, setVisitorStats] = useState<VisitorStats>(() => getVisitorStats());
  const [recentEvents, setRecentEvents] = useState<VisitEvent[]>(() => getRecentVisitEvents(15));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadVisitorData = useCallback(() => {
    setVisitorStats(getVisitorStats());
    setRecentEvents(getRecentVisitEvents(15));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    loadVisitorData();

    // Listen to real-time visitor updates
    const handleVisitorUpdate = () => {
      loadVisitorData();
    };

    window.addEventListener('tinyrealms:visitor_update', handleVisitorUpdate);
    window.addEventListener('storage', handleVisitorUpdate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('tinyrealms:visitor_update', handleVisitorUpdate);
      window.removeEventListener('storage', handleVisitorUpdate);
    };
  }, [loadVisitorData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadVisitorData();
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage('Data kunjungan berhasil diperbarui!');
      setTimeout(() => setToastMessage(null), 2500);
    }, 400);
  };

  const handleResetStats = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset statistik kunjungan pengunjung?')) {
      resetVisitorStats();
      loadVisitorData();
      setToastMessage('Statistik kunjungan telah direset.');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Compute live statistics from LocalStorage data
  const stats = useMemo(() => {
    const total = artworks.length;
    const published = artworks.filter((a) => a.published === true).length;
    const draft = artworks.filter((a) => a.published === false).length;
    const totalCollections = collections.length;

    return { total, published, draft, totalCollections };
  }, [artworks, collections]);

  // Compute 5 most recent artworks sorted by createdAt
  const recentArtworks = useMemo(() => {
    return [...artworks]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
  }, [artworks]);

  // Format page names for friendly display
  const formatPageName = (path: string) => {
    if (path === '/') return 'Beranda (Home Page)';
    if (path === '/collection') return 'Katalog Koleksi (Collection)';
    if (path === '/gallery') return 'Galeri Seni (Gallery)';
    if (path === '/holders') return 'Leaderboard Holders';
    if (path === '/info') return 'Tentang & Cerita (Info Lore)';
    if (path === '/team') return 'Tim Kreator (Team)';
    if (path.startsWith('/artwork/')) return `Detail Karya (${path.replace('/artwork/', '')})`;
    if (path.startsWith('/gallery/')) return `Detail Galeri (${path.replace('/gallery/', '')})`;
    return path;
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#7FAF45] text-[#140C07] px-4 py-2.5 rounded-xl font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5A351E]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#4A2D1A] text-[#C69B5A] border border-[#5A351E]">
              TINY REALMS
            </span>
            <span className="text-xs font-mono text-[#CDBCA8]">
              Curator Studio & Visitor Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5EBDD] tracking-tight">
            Dashboard Owner
          </h1>
          <p className="text-xs sm:text-sm text-[#CDBCA8] mt-1">
            Pantau jumlah kunjungan pengunjung, interaksi karya, dan katalog Tiny Realms.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/artworks/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4A2D1A] hover:bg-[#70431F] text-[#F5EBDD] hover:text-[#D9A85C] border border-[#C69B5A] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Collection</span>
          </Link>

          <Link
            to="/admin/artworks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4A2D1A]/60 hover:bg-[#4A2D1A] border border-[#5A351E] text-xs font-semibold text-[#F5EBDD] transition-colors shadow-2xs"
          >
            <span>View Collections</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C69B5A]" />
          </Link>
        </div>
      </div>

      {/* 2. Top Statistic Cards Grid */}
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Total Visitors Card (HIGHLIGHTED) */}
          <div className="bg-gradient-to-br from-[#4A2D1A] to-[#2E1B10] rounded-xl border-2 border-[#C69B5A]/60 p-5 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C69B5A]/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D9A85C] uppercase tracking-wider">
                Total Kunjungan
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#C69B5A]/20 text-[#D9A85C] flex items-center justify-center border border-[#C69B5A]/40">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F5EBDD]">
                {visitorStats.totalVisits}
              </span>
              <span className="text-xs text-[#D9A85C] font-mono">views</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#5A351E] flex items-center justify-between text-[11px]">
              <span className="text-[#CDBCA8]">Hari Ini:</span>
              <span className="font-mono text-[#7FAF45] font-bold">+{visitorStats.todayVisits} visit</span>
            </div>
          </div>

          {/* Unique Visitors */}
          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#CDBCA8] uppercase tracking-wider">
                Pengunjung Unik
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#24170F] text-[#C69B5A] flex items-center justify-center border border-[#5A351E]">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F5EBDD]">
                {visitorStats.uniqueVisitors}
              </span>
              <span className="text-xs text-[#CDBCA8]">perangkat</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#5A351E] flex items-center justify-between text-[11px] text-[#CDBCA8]">
              <span>Klik Interaksi</span>
              <span className="font-mono text-[#C69B5A] font-semibold">{visitorStats.totalClicks} klik</span>
            </div>
          </div>

          {/* Total Artworks */}
          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#CDBCA8] uppercase tracking-wider">
                Total Artworks
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#24170F] text-[#C69B5A] flex items-center justify-center border border-[#5A351E]">
                <Palette className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F5EBDD]">
                {stats.total}
              </span>
              <span className="text-xs text-[#CDBCA8]">items</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#5A351E] flex items-center justify-between text-[11px] text-[#CDBCA8]">
              <span>Database Status</span>
              <span className="font-mono text-[#C69B5A] font-semibold">Active</span>
            </div>
          </div>

          {/* Published */}
          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#CDBCA8] uppercase tracking-wider">
                Published
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#7FAF45]/20 text-[#7FAF45] border border-[#7FAF45]/40 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F5EBDD]">
                {stats.published}
              </span>
              <span className="text-xs text-[#7FAF45] font-medium">live di site</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#5A351E] flex items-center justify-between text-[11px] text-[#CDBCA8]">
              <span>Tampil di Publik</span>
              <span className="font-semibold text-[#7FAF45]">Active</span>
            </div>
          </div>

          {/* Collections */}
          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#CDBCA8] uppercase tracking-wider">
                Collections
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#24170F] text-[#C69B5A] border border-[#5A351E] flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F5EBDD]">
                {stats.totalCollections}
              </span>
              <span className="text-xs text-[#CDBCA8]">series</span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#5A351E] flex items-center justify-between text-[11px] text-[#CDBCA8]">
              <span>Draft NFT</span>
              <span className="font-mono text-[#D9A85C] font-semibold">{stats.draft} draft</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DEDICATED VISITOR ANALYTICS & CLICK TRACKER SECTION  */}
      {/* ======================================================== */}
      <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5A351E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#24170F] border border-[#5A351E] flex items-center justify-center text-[#C69B5A] shadow-inner">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#F5EBDD]">
                  Statistik Kunjungan & Interaksi Web
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#7FAF45]/20 text-[#7FAF45] border border-[#7FAF45]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7FAF45] animate-pulse" />
                  Live Tracker Aktif
                </span>
              </div>
              <p className="text-xs text-[#CDBCA8] mt-0.5">
                Pantau jumlah kunjungan halaman, unique visitors, dan klik tombol secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#24170F] hover:bg-[#70431F] border border-[#5A351E] text-xs font-semibold text-[#F5EBDD] transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh data kunjungan"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#C69B5A] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <button
              type="button"
              onClick={handleResetStats}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#24170F] hover:bg-rose-950/50 border border-[#5A351E] hover:border-rose-700/60 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
              title="Reset statistik kunjungan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4 Detail Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#24170F] p-4 rounded-xl border border-[#5A351E]">
            <div className="flex items-center gap-2 text-xs text-[#CDBCA8] font-mono">
              <Eye className="w-3.5 h-3.5 text-[#C69B5A]" />
              <span>TOTAL PAGEVIEWS</span>
            </div>
            <div className="text-2xl font-black text-[#F5EBDD] mt-2 font-mono">
              {visitorStats.totalVisits.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#CDBCA8] mt-1">
              Seluruh halaman publik dikunjungi
            </div>
          </div>

          <div className="bg-[#24170F] p-4 rounded-xl border border-[#5A351E]">
            <div className="flex items-center gap-2 text-xs text-[#CDBCA8] font-mono">
              <Users className="w-3.5 h-3.5 text-[#7FAF45]" />
              <span>PENGUNJUNG UNIK</span>
            </div>
            <div className="text-2xl font-black text-[#7FAF45] mt-2 font-mono">
              {visitorStats.uniqueVisitors.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#CDBCA8] mt-1">
              Perangkat / browser berbeda
            </div>
          </div>

          <div className="bg-[#24170F] p-4 rounded-xl border border-[#5A351E]">
            <div className="flex items-center gap-2 text-xs text-[#CDBCA8] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#D9A85C]" />
              <span>KUNJUNGAN HARI INI</span>
            </div>
            <div className="text-2xl font-black text-[#D9A85C] mt-2 font-mono">
              {visitorStats.todayVisits.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#CDBCA8] mt-1">
              Sejak jam 00:00 hari ini
            </div>
          </div>

          <div className="bg-[#24170F] p-4 rounded-xl border border-[#5A351E]">
            <div className="flex items-center gap-2 text-xs text-[#CDBCA8] font-mono">
              <MousePointerClick className="w-3.5 h-3.5 text-[#C69B5A]" />
              <span>TOTAL KLIK & EVENT</span>
            </div>
            <div className="text-2xl font-black text-[#F5EBDD] mt-2 font-mono">
              {visitorStats.totalClicks.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#CDBCA8] mt-1">
              Tombol, Marketplace, & Navigasi
            </div>
          </div>
        </div>

        {/* Two Column Grid: Popular Pages & Click Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Popular Pages Breakdown */}
          <div className="lg:col-span-6 bg-[#24170F] p-5 rounded-xl border border-[#5A351E] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#5A351E]">
              <span className="text-xs font-mono font-bold uppercase text-[#F5EBDD] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C69B5A]" />
                <span>Halaman Paling Sering Dikunjungi</span>
              </span>
              <span className="text-[10px] font-mono text-[#CDBCA8]">Total Views</span>
            </div>

            {Object.keys(visitorStats.pageBreakdown || {}).length === 0 ? (
              <p className="text-xs text-[#CDBCA8] py-4 text-center font-mono">
                Belum ada data kunjungan halaman.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(visitorStats.pageBreakdown || {})
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([path, count]) => {
                    const percentage = visitorStats.totalVisits > 0
                      ? Math.round((count / visitorStats.totalVisits) * 100)
                      : 0;

                    return (
                      <div key={path} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#F5EBDD] font-medium truncate max-w-[200px] sm:max-w-[260px]">
                            {formatPageName(path)}
                          </span>
                          <span className="font-mono text-[#C69B5A] font-bold shrink-0">
                            {count}x ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#1A0E07] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#C69B5A] to-[#D9A85C]"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Right: Click Breakdown */}
          <div className="lg:col-span-6 bg-[#24170F] p-5 rounded-xl border border-[#5A351E] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#5A351E]">
              <span className="text-xs font-mono font-bold uppercase text-[#F5EBDD] flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-[#7FAF45]" />
                <span>Interaksi Klik Populer</span>
              </span>
              <span className="text-[10px] font-mono text-[#CDBCA8]">Jumlah Klik</span>
            </div>

            {Object.keys(visitorStats.clickBreakdown || {}).length === 0 ? (
              <p className="text-xs text-[#CDBCA8] py-4 text-center font-mono">
                Belum ada interaksi klik yang tercatat.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(visitorStats.clickBreakdown || {})
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([name, count]) => {
                    return (
                      <div
                        key={name}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#1A0E07] border border-[#5A351E]/60 text-xs"
                      >
                        <span className="text-[#F5EBDD] font-medium truncate max-w-[220px]">
                          {name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md font-mono text-[#7FAF45] bg-[#7FAF45]/15 font-bold">
                          {count} klik
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Real-Time Visitor Activity Log Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase text-[#F5EBDD] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#C69B5A]" />
              <span>Log Aktivitas Kunjungan Terakhir ({recentEvents.length})</span>
            </h3>
            <span className="text-[11px] text-[#CDBCA8]">Diperbarui otomatis saat pengunjung membuka web</span>
          </div>

          {recentEvents.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#24170F] border border-[#5A351E] text-center text-xs text-[#CDBCA8]">
              Belum ada aktivitas pengunjung terbaru yang terekam.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#5A351E] bg-[#24170F]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#5A351E] bg-[#1A0E07] text-[#CDBCA8] font-mono uppercase text-[10px]">
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Tipe Event</th>
                    <th className="p-3">Aktivitas / Halaman</th>
                    <th className="p-3">Perangkat</th>
                    <th className="p-3 text-right">Visitor ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A351E]/50">
                  {recentEvents.map((ev) => {
                    const timeFormatted = new Date(ev.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    });
                    const dateFormatted = new Date(ev.timestamp).toLocaleDateString([], {
                      day: '2-digit',
                      month: 'short',
                    });

                    return (
                      <tr key={ev.id} className="hover:bg-[#4A2D1A]/30 transition-colors">
                        <td className="p-3 font-mono text-[#CDBCA8] whitespace-nowrap">
                          {dateFormatted} {timeFormatted}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {ev.type === 'page_view' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C69B5A]/20 text-[#D9A85C] border border-[#C69B5A]/40">
                              Page View
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7FAF45]/20 text-[#7FAF45] border border-[#7FAF45]/40">
                              Click Event
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#F5EBDD] font-medium">
                          {ev.name}
                        </td>
                        <td className="p-3 text-[#CDBCA8] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            {ev.device === 'mobile' ? (
                              <Smartphone className="w-3.5 h-3.5 text-[#C69B5A]" />
                            ) : (
                              <Monitor className="w-3.5 h-3.5 text-[#C69B5A]" />
                            )}
                            <span className="capitalize">{ev.device}</span>
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono text-[#C69B5A]/80 text-[11px] whitespace-nowrap">
                          {ev.visitorId?.slice(0, 10)}...
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 4. Quick Actions Section */}
      <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 shadow-xs">
        <h2 className="text-sm font-bold text-[#F5EBDD] mb-1">Quick Actions</h2>
        <p className="text-xs text-[#CDBCA8] mb-4">
          Akses cepat kurasi galeri katalog Tiny Realms.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/artworks/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#70431F] hover:bg-[#4A2D1A] text-[#F5EBDD] hover:text-[#D9A85C] border border-[#C69B5A] text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Collection</span>
          </Link>

          <Link
            to="/admin/artworks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#24170F] hover:bg-[#70431F] border border-[#5A351E] text-xs font-semibold text-[#F5EBDD] transition-colors"
          >
            <Layers className="w-4 h-4 text-[#C69B5A]" />
            <span>View Collections</span>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#24170F] hover:bg-[#70431F] border border-[#5A351E] text-xs font-semibold text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors ml-auto"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C69B5A]" />
          </a>
        </div>
      </div>

      {/* 5. Recent Artworks Section */}
      <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#5A351E] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F5EBDD]">Recent Artworks</h2>
            <p className="text-xs text-[#CDBCA8] mt-0.5">
              5 karya terbaru yang telah dikurasi ke dalam katalog.
            </p>
          </div>
          <Link
            to="/admin/artworks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C69B5A] hover:text-[#D9A85C]"
          >
            <span>View all ({artworks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentArtworks.length === 0 ? (
          <div className="p-12 text-center text-[#CDBCA8]">
            <Palette className="w-10 h-10 mx-auto mb-2 text-[#C69B5A]/60" />
            <p className="text-sm font-semibold text-[#F5EBDD]">Belum ada artwork</p>
            <p className="text-xs text-[#CDBCA8] mt-1 mb-4">
              Mulai tambahkan karya NFT pertama Anda ke katalog Tiny Realms.
            </p>
            <Link
              to="/admin/artworks/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#70431F] text-[#F5EBDD] border border-[#C69B5A] text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Collection</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#5A351E] bg-[#24170F]/50 text-[#CDBCA8] font-mono uppercase text-[10px]">
                  <th className="p-4">Artwork</th>
                  <th className="p-4">Collection</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A351E]/60 text-xs">
                {recentArtworks.map((artwork) => (
                  <tr key={artwork.id} className="hover:bg-[#24170F]/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#24170F] border border-[#5A351E] overflow-hidden flex items-center justify-center shrink-0">
                        {artwork.image ? (
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Palette className="w-5 h-5 text-[#C69B5A]/50" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-[#F5EBDD] block">{artwork.title}</span>
                        <span className="text-[10px] font-mono text-[#C69B5A]">{artwork.code}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#CDBCA8] font-mono">{artwork.collection}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7FAF45]/20 text-[#7FAF45] border border-[#7FAF45]/40">
                        {artwork.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {artwork.published ? (
                        <span className="text-[#7FAF45] font-semibold text-xs flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="text-[#D9A85C] font-semibold text-xs flex items-center gap-1">
                          <FileEdit className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/artworks/${artwork.id}/edit`)}
                        className="text-xs font-semibold text-[#C69B5A] hover:text-[#D9A85C] p-1 cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
