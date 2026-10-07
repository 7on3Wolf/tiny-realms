import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Plus,
  CheckCircle2,
  AlertTriangle,
  X,
  Palette,
  Eye,
  EyeOff,
  Trash2,
  CheckSquare,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Artwork, ArtworkStatus } from '../../types';
import ArtworkSearch from '../../components/admin/ArtworkSearch';
import ArtworkFilters from '../../components/admin/ArtworkFilters';
import ArtworkTable from '../../components/admin/ArtworkTable';
import ArtworkCardAdmin from '../../components/admin/ArtworkCardAdmin';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ArtworkLightboxModal from '../../components/admin/ArtworkLightboxModal';
import { ArtworkGridSkeleton, AdminTableRowSkeleton } from '../../components/common/Skeletons';

export default function AdminArtworks() {
  const {
    artworks,
    collections,
    deleteArtwork,
    togglePublished,
    duplicateArtwork,
    batchSetPublished,
    batchDeleteArtworks,
    resetArtworksToDefault,
  } = useApp();
  const location = useLocation();

  // View Mode: 'grid' (2x2 cards) or 'table' (dense rows)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ArtworkStatus>('All');
  const [publishedFilter, setPublishedFilter] = useState<'All' | 'Published' | 'Draft'>('All');
  const [collectionFilter, setCollectionFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<
    'Newest' | 'Oldest' | 'Title A-Z' | 'Title Z-A' | 'Year Newest' | 'Year Oldest'
  >('Newest');

  // Loading state with smooth skeleton transition
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [statusFilter, publishedFilter, collectionFilter, sortBy]);

  // Multi-select & Bulk operations state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState<boolean>(false);

  // Lightbox Modal state
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);

  // Confirmation & Feedback state
  const [deletingArtwork, setDeletingArtwork] = useState<Artwork | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  // Check for navigation location state toast (e.g. from create/edit page)
  useEffect(() => {
    if (location.state && (location.state as { toast?: string }).toast) {
      setToastMessage({
        text: (location.state as { toast: string }).toast,
        type: 'success',
      });
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Compute filtered & sorted list
  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    // Search filter across title, code, collection, category, and year
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.code.toLowerCase().includes(q) ||
          art.collection.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          String(art.year).includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((art) => art.status === statusFilter);
    }

    // Published/Draft filter
    if (publishedFilter === 'Published') {
      result = result.filter((art) => art.published === true);
    } else if (publishedFilter === 'Draft') {
      result = result.filter((art) => art.published === false);
    }

    // Collection filter
    if (collectionFilter !== 'All') {
      result = result.filter((art) => art.collection === collectionFilter);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'Newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'Oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'Title A-Z':
          return a.title.localeCompare(b.title);
        case 'Title Z-A':
          return b.title.localeCompare(a.title);
        case 'Year Newest':
          return (b.year || 0) - (a.year || 0);
        case 'Year Oldest':
          return (a.year || 0) - (b.year || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [artworks, searchQuery, statusFilter, publishedFilter, collectionFilter, sortBy]);

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArtworks.map((a) => a.id));
    }
  };

  const allSelected =
    filteredArtworks.length > 0 &&
    filteredArtworks.every((a) => selectedIds.includes(a.id));

  // Toggle publish state handler
  const handleTogglePublish = (art: Artwork) => {
    const success = togglePublished(art.id);
    if (success) {
      setToastMessage({
        text: `Artwork "${art.title}" is now ${!art.published ? 'Published Live' : 'Draft'}.`,
        type: 'success',
      });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Duplicate artwork handler
  const handleDuplicate = (art: Artwork) => {
    const duplicated = duplicateArtwork(art.id);
    if (duplicated) {
      setToastMessage({
        text: `Duplicated artwork "${art.title}" as "${duplicated.title}" (${duplicated.code}).`,
        type: 'success',
      });
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Single delete handler
  const handleConfirmDelete = () => {
    if (!deletingArtwork) return;
    const success = deleteArtwork(deletingArtwork.id);
    if (success) {
      setSelectedIds((prev) => prev.filter((id) => id !== deletingArtwork.id));
      setToastMessage({
        text: `Artwork "${deletingArtwork.title}" was permanently deleted.`,
        type: 'success',
      });
      setDeletingArtwork(null);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Bulk publish / draft handler
  const handleBulkPublish = (targetPublished: boolean) => {
    const updatedCount = batchSetPublished(selectedIds, targetPublished);
    setToastMessage({
      text: `Updated ${updatedCount} artworks to ${targetPublished ? 'Published Live' : 'Draft'}.`,
      type: 'success',
    });
    setSelectedIds([]);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bulk delete handler
  const handleConfirmBulkDelete = () => {
    const count = batchDeleteArtworks(selectedIds);
    setToastMessage({
      text: `Successfully deleted ${count} selected artworks.`,
      type: 'success',
    });
    setSelectedIds([]);
    setIsBulkDeleting(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset catalogue handler
  const handleConfirmReset = () => {
    resetArtworksToDefault();
    setSelectedIds([]);
    setIsResetConfirmOpen(false);
    setToastMessage({
      text: 'Catalogue reset to default original characters successfully.',
      type: 'success',
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPublishedFilter('All');
    setCollectionFilter('All');
    setSortBy('Newest');
  };

  const isFiltered =
    Boolean(searchQuery.trim()) ||
    statusFilter !== 'All' ||
    publishedFilter !== 'All' ||
    collectionFilter !== 'All';

  const publishedCount = artworks.filter((a) => a.published).length;
  const draftCount = artworks.filter((a) => !a.published).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & STATS                                     */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#5A351E]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#F5EBDD] tracking-tight">
              Collections Management
            </h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#4A2D1A] text-[#C69B5A] border border-[#5A351E]">
              {artworks.length} Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#CDBCA8] mt-1">
            Curate and manage character artworks and digital image assets displayed on the public site.
          </p>
        </div>

        {/* Quick Actions & Navigation */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/artworks/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8C5D19] hover:bg-[#A36D1F] active:bg-[#724B14] text-[#F5EBDD] text-xs font-hero-title font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer border border-[#C69B5A]"
          >
            <Plus className="w-4 h-4 text-[#F5EBDD]" />
            <span>+ Add Collection</span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. STATS PILLS & VIEW TOGGLE BAR                          */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#3A2214]/60 p-3.5 rounded-2xl border border-[#5A351E]">
        {/* Stats Summary */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7FAF45]" />
            <span className="text-[#CDBCA8]">Published:</span>
            <span className="font-bold text-[#F5EBDD]">{publishedCount}</span>
          </div>
          <span className="text-[#5A351E]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C69B5A]" />
            <span className="text-[#CDBCA8]">Drafts:</span>
            <span className="font-bold text-[#F5EBDD]">{draftCount}</span>
          </div>
          <span className="text-[#5A351E]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#CDBCA8]">Collections:</span>
            <span className="font-bold text-[#F5EBDD]">{collections.length}</span>
          </div>
        </div>

        {/* View Mode Switcher: 4x2 Grid vs Table */}
        <div className="flex items-center gap-1 bg-[#24170F] p-1 rounded-xl border border-[#5A351E] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#C69B5A] text-[#24170F] shadow-xs'
                : 'text-[#CDBCA8] hover:text-[#F5EBDD]'
            }`}
            title="Display cards in a 4-column grid (4x2 layout)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card Grid (4x2)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#C69B5A] text-[#24170F] shadow-xs'
                : 'text-[#CDBCA8] hover:text-[#F5EBDD]'
            }`}
            title="Display items in a structured administrative table"
          >
            <List className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. INLINE TOAST FEEDBACK NOTIFICATION                    */}
      {/* ======================================================== */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between font-medium shadow-xs transition-all ${
            toastMessage.type === 'success'
              ? 'bg-[#4A2D1A] border-[#7FAF45] text-[#F5EBDD]'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#7FAF45] shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-[#24170F] rounded text-[#CDBCA8] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SEARCH & FILTER CONTROLS                              */}
      {/* ======================================================== */}
      <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-4 sm:p-5 space-y-4 shadow-xs">
        <ArtworkSearch
          value={searchQuery}
          onChange={setSearchQuery}
          totalCount={artworks.length}
          filteredCount={filteredArtworks.length}
        />

        <ArtworkFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          publishedFilter={publishedFilter}
          onPublishedChange={setPublishedFilter}
          collectionFilter={collectionFilter}
          onCollectionChange={setCollectionFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          collections={collections}
          isFiltered={isFiltered}
          onReset={handleResetFilters}
        />
      </div>

      {/* ======================================================== */}
      {/* 5. BULK SELECTION ACTION BAR                             */}
      {/* ======================================================== */}
      {selectedIds.length > 0 && (
        <div className="bg-[#24170F] border border-[#C69B5A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#C69B5A]" />
            <span className="font-mono text-xs font-bold text-[#F5EBDD]">
              {selectedIds.length} {selectedIds.length === 1 ? 'artwork' : 'artworks'} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkPublish(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A2D1A] hover:bg-[#70431F] border border-[#7FAF45] text-xs font-semibold text-[#F5EBDD] transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#7FAF45]" />
              <span>Publish Selected</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkPublish(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A2D1A] hover:bg-[#70431F] border border-[#5A351E] text-xs font-semibold text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5 text-[#CDBCA8]" />
              <span>Move to Draft</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBulkDeleting(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-xs font-semibold text-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-xs text-[#CDBCA8] hover:text-[#F5EBDD] font-mono cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ARTWORKS PRESENTATION: 4-COLUMN CARD GRID OR TABLE     */}
      {/* ======================================================== */}
      <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] shadow-xs overflow-hidden">
        {isLoading ? (
          viewMode === 'grid' ? (
            <div className="p-4 sm:p-6">
              <ArtworkGridSkeleton count={8} />
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <AdminTableRowSkeleton count={6} />
                </tbody>
              </table>
            </div>
          )
        ) : filteredArtworks.length === 0 ? (
          <div className="p-12 text-center text-[#CDBCA8] space-y-3">
            <Palette className="w-12 h-12 mx-auto text-[#C69B5A]/60" />
            <h3 className="text-base font-bold text-[#F5EBDD]">
              {isFiltered ? 'No artworks match your query' : 'No Artworks Catalogued Yet'}
            </h3>
            <p className="text-xs text-[#CDBCA8] max-w-sm mx-auto">
              {isFiltered
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : 'All previous artworks have been deleted. You can now upload new NFTs using the button below.'}
            </p>
            {isFiltered ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-[#24170F] hover:bg-[#70431F] text-[#F5EBDD] border border-[#5A351E] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/admin/artworks/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New NFT / Artwork</span>
                </Link>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* ====================================================== */
          /* CARD VIEW: 4x2 GRID (4 ACROSS, CONTINUING DOWNWARDS)    */
          /* ====================================================== */
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredArtworks.map((artwork) => (
                <ArtworkCardAdmin
                  key={artwork.id}
                  artwork={artwork}
                  isSelected={selectedIds.includes(artwork.id)}
                  onToggleSelect={handleToggleSelect}
                  onOpenLightbox={(art) => setLightboxArtwork(art)}
                  onTogglePublish={handleTogglePublish}
                  onDuplicate={handleDuplicate}
                  onDelete={setDeletingArtwork}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ====================================================== */
          /* TABLE VIEW: DENSE ADMINISTRATIVE LIST                  */
          /* ====================================================== */
          <div className="overflow-x-auto">
            <ArtworkTable
              artworks={filteredArtworks}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              allSelected={allSelected}
              onOpenLightbox={(art) => setLightboxArtwork(art)}
              onTogglePublish={handleTogglePublish}
              onDuplicate={handleDuplicate}
              onDelete={setDeletingArtwork}
            />
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 7. MODALS & CONFIRMATION DIALOGS                         */}
      {/* ======================================================== */}
      {/* Single Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingArtwork)}
        title="Delete Artwork"
        message={`Are you sure you want to permanently delete "${deletingArtwork?.title}" (${deletingArtwork?.code})? This action removes it from the catalog and cannot be undone.`}
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingArtwork(null)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        title={`Delete ${selectedIds.length} Artworks`}
        message={`Are you sure you want to permanently delete ${selectedIds.length} selected artworks? This action cannot be undone.`}
        confirmLabel="Delete All Selected"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setIsBulkDeleting(false)}
      />

      {/* Reset Catalogue Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Reset Artwork Catalogue"
        message="This will restore the 12 original Tiny Realms character artworks to their initial state. Any custom modifications will be replaced."
        confirmLabel="Reset to Defaults"
        cancelLabel="Keep Current"
        isDanger={false}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Artwork Quick Lightbox Modal */}
      <ArtworkLightboxModal
        artwork={lightboxArtwork}
        onClose={() => setLightboxArtwork(null)}
      />
    </div>
  );
}
