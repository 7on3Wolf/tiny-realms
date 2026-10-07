import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Shield,
  Database,
  RotateCcw,
  Check,
  Palette,
  Download,
  Upload,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  exportAllDataAsJSON,
  importDataFromJSON,
  getLocalStorageUsage,
  StorageUsageReport,
} from '../../services/storageService';

export default function AdminSettings() {
  const { user, artworks, collections, resetArtworksToDefault, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'data'>('data');
  const [storageReport, setStorageReport] = useState<StorageUsageReport>(() => getLocalStorageUsage());

  // Feedback notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUsage = () => {
    setStorageReport(getLocalStorageUsage());
  };

  useEffect(() => {
    updateUsage();
  }, [artworks, collections]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Export Backup JSON
  const handleExportBackup = () => {
    const result = exportAllDataAsJSON();
    if (result.success) {
      showToast(`Backup exported successfully as ${result.filename}!`, 'success');
    } else {
      showToast(result.error || 'Failed to export backup.', 'error');
    }
  };

  // 2. Import / Restore JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        showToast('Empty backup file provided.', 'error');
        return;
      }

      const result = importDataFromJSON(content);
      if (result.success) {
        refreshData();
        updateUsage();
        showToast(
          `Successfully restored ${result.artworksCount} artworks and ${result.collectionsCount} collections!`,
          'success'
        );
      } else {
        showToast(result.error || 'Invalid backup file structure.', 'error');
      }
    };

    reader.onerror = () => {
      showToast('Error reading the selected JSON file.', 'error');
    };

    reader.readAsText(file);

    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 3. Factory Reset
  const handleReset = () => {
    if (
      window.confirm(
        'Reset all artworks and collections to the factory preset? Any custom uploads will be replaced with initial characters.'
      )
    ) {
      resetArtworksToDefault();
      updateUsage();
      showToast('Factory catalogue restored successfully!', 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hidden file input for JSON restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload JSON backup file"
      />

      {/* Header */}
      <div className="pb-5 border-b border-[#5A351E]">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#4A2D1A] text-[#C69B5A] border border-[#5A351E] uppercase tracking-wider">
            Configuration
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#F5EBDD] tracking-tight">
          Admin Settings & Studio Info
        </h1>
        <p className="text-xs sm:text-sm text-[#CDBCA8] mt-0.5">
          Manage storage quota, backup/restore catalogue data, authentication status, and studio provenance.
        </p>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between font-medium shadow-xs ${
            toast.type === 'success'
              ? 'bg-[#4A2D1A] border-[#7FAF45] text-[#F5EBDD]'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#7FAF45] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-[#CDBCA8] hover:text-[#F5EBDD] text-xs font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#5A351E]">
        <button
          type="button"
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'data'
              ? 'border-[#C69B5A] text-[#C69B5A]'
              : 'border-transparent text-[#CDBCA8] hover:text-[#F5EBDD]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data, Backup & Quota</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#C69B5A] text-[#C69B5A]'
              : 'border-transparent text-[#CDBCA8] hover:text-[#F5EBDD]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Studio & Artist Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'system'
              ? 'border-[#C69B5A] text-[#C69B5A]'
              : 'border-transparent text-[#CDBCA8] hover:text-[#F5EBDD]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Authentication & System</span>
        </button>
      </div>

      {/* TAB 1: Data, Backup & Quota (Prioritas 1) */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          {/* 1. Storage Quota Usage Meter */}
          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#5A351E]">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#C69B5A]" />
                <h3 className="text-sm font-bold text-[#F5EBDD]">
                  LocalStorage Quota Meter
                </h3>
              </div>
              <span className="font-mono text-xs text-[#CDBCA8]">
                Browser Quota: <strong className="text-[#F5EBDD]">{storageReport.formattedMax}</strong>
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#CDBCA8]">
                  Storage Used: <strong className="text-[#F5EBDD]">{storageReport.formattedUsed}</strong> ({storageReport.percentage}%)
                </span>
                <span
                  className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                    storageReport.isCritical
                      ? 'bg-rose-950 border border-rose-800 text-rose-300'
                      : storageReport.isHighUsage
                      ? 'bg-[#70431F] border border-[#C69B5A] text-[#D9A85C]'
                      : 'bg-[#24170F] border border-[#7FAF45] text-[#7FAF45]'
                  }`}
                >
                  {storageReport.isCritical ? 'CRITICAL QUOTA' : storageReport.isHighUsage ? 'MODERATE QUOTA' : 'OPTIMAL'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-[#24170F] rounded-full overflow-hidden border border-[#5A351E] p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    storageReport.isCritical
                      ? 'bg-rose-500'
                      : storageReport.isHighUsage
                      ? 'bg-[#C69B5A]'
                      : 'bg-[#7FAF45]'
                  }`}
                  style={{ width: `${Math.max(3, storageReport.percentage)}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#CDBCA8] pt-1">
                <span>Tracking {artworks.length} artworks • {collections.length} series collections</span>
                <span>Max safe capacity ~5 MB (standard web storage)</span>
              </div>
            </div>
          </div>

          {/* 2. Backup & Export / Restore Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Backup Card */}
            <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C69B5A]" />
                  <h4 className="text-sm font-bold text-[#F5EBDD]">Export JSON Backup</h4>
                </div>
                <p className="text-xs text-[#CDBCA8] leading-relaxed">
                  Download a complete JSON snapshot containing all your artworks, metadata, and custom uploaded character images.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#5A351E]">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup File</span>
                </button>
              </div>
            </div>

            {/* Import / Restore Card */}
            <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#C69B5A]" />
                  <h4 className="text-sm font-bold text-[#F5EBDD]">Restore From Backup</h4>
                </div>
                <p className="text-xs text-[#CDBCA8] leading-relaxed">
                  Import a previously exported <code className="text-[#C69B5A]">.json</code> file to restore or transfer your catalogue across different browsers and devices.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#5A351E]">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#24170F] hover:bg-[#70431F] border border-[#5A351E] text-[#F5EBDD] hover:text-[#C69B5A] text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <FileCode className="w-4 h-4 text-[#C69B5A]" />
                  <span>Choose JSON File to Restore</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Factory Reset Zone */}
          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Factory Default Reset</span>
            </h4>
            <p className="text-xs text-[#CDBCA8]">
              Restore all artworks and collections to the factory preset (Bear King, Pirate Monkey, Pup Monkey, Monkey & Panda). Custom uploads will be cleared.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#24170F] hover:bg-rose-950/60 text-rose-400 hover:text-rose-200 border border-rose-900/60 text-xs font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Presets</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Studio & Artist Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-5">
          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 shadow-xs">
            <h2 className="text-sm font-bold text-[#F5EBDD] mb-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#C69B5A]" />
              <span>Artistic & Engineering Provenance</span>
            </h2>
            <p className="text-xs text-[#CDBCA8] mb-5">
              Official credits and operational roles for Tiny Realms Studio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#24170F] rounded-xl border border-[#5A351E]">
                <span className="text-[10px] uppercase font-semibold text-[#C69B5A] block tracking-wider">
                  Brand / Studio
                </span>
                <span className="text-sm font-bold text-[#F5EBDD] mt-1 block">
                  TINY REALMS
                </span>
                <span className="text-[#CDBCA8] text-[11px] mt-0.5 block">
                  Original Character Universe & Japanese Storybook Aesthetic
                </span>
              </div>

              <div className="p-4 bg-[#24170F] rounded-xl border border-[#5A351E]">
                <span className="text-[10px] uppercase font-semibold text-[#C69B5A] block tracking-wider">
                  Owner & Artist
                </span>
                <span className="text-sm font-bold text-[#F5EBDD] mt-1 block">
                  AGIP
                </span>
                <span className="text-[#CDBCA8] text-[11px] mt-0.5 block">
                  Original Character Illustration & Worldbuilding
                </span>
              </div>

              <div className="p-4 bg-[#24170F] rounded-xl border border-[#5A351E]">
                <span className="text-[10px] uppercase font-semibold text-[#C69B5A] block tracking-wider">
                  Software Developer & Engineer
                </span>
                <span className="text-sm font-bold text-[#F5EBDD] mt-1 block">
                  LIEBE
                </span>
                <span className="text-[#CDBCA8] text-[11px] mt-0.5 block">
                  Full-Stack Architecture & Studio CMS Engineering
                </span>
              </div>

              <div className="p-4 bg-[#24170F] rounded-xl border border-[#5A351E]">
                <span className="text-[10px] uppercase font-semibold text-[#C69B5A] block tracking-wider">
                  Active Session User
                </span>
                <span className="text-sm font-bold text-[#F5EBDD] mt-1 block">
                  {user?.name || 'AGIP Admin'}
                </span>
                <span className="text-[#CDBCA8] text-[11px] mt-0.5 block">
                  Role: {user?.role || 'Curator'} ({user?.username})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#F5EBDD] mb-3">Public Showcase URLs</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 bg-[#24170F] rounded-lg border border-[#5A351E]">
                <span className="text-[#CDBCA8]">Public Gallery Home:</span>
                <span className="text-[#C69B5A] font-medium">/</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#24170F] rounded-lg border border-[#5A351E]">
                <span className="text-[#CDBCA8]">Exhibition Archive:</span>
                <span className="text-[#C69B5A] font-medium">/gallery</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#24170F] rounded-lg border border-[#5A351E]">
                <span className="text-[#CDBCA8]">Full Collection:</span>
                <span className="text-[#C69B5A] font-medium">/collection</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Authentication & System */}
      {activeTab === 'system' && (
        <div className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] p-6 space-y-4 text-xs font-mono">
          <h3 className="text-sm font-bold text-[#F5EBDD] font-sans">System & Authentication Environment</h3>
          <div className="p-3 bg-[#24170F] rounded-xl border border-[#5A351E] flex items-center justify-between">
            <span className="text-[#CDBCA8]">Authentication Provider:</span>
            <span className="text-[#7FAF45] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7FAF45] animate-pulse" />
              Firebase Authentication (Google)
            </span>
          </div>
          <div className="p-3 bg-[#24170F] rounded-xl border border-[#5A351E] flex items-center justify-between">
            <span className="text-[#CDBCA8]">Firebase Project:</span>
            <span className="text-[#C69B5A] font-bold">potent-bee-mt3g1</span>
          </div>
          <div className="p-3 bg-[#24170F] rounded-xl border border-[#5A351E] flex items-center justify-between">
            <span className="text-[#CDBCA8]">Color System:</span>
            <span className="text-[#C69B5A] font-bold">Tiny Realms Global Palette v1.0</span>
          </div>
          <div className="p-3 bg-[#24170F] rounded-xl border border-[#5A351E] flex items-center justify-between">
            <span className="text-[#CDBCA8]">Build Version:</span>
            <span className="text-[#F5EBDD] font-bold">Tiny Realms Studio v2.5 (Firebase Auth)</span>
          </div>
        </div>
      )}
    </div>
  );
}
