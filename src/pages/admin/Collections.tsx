import React, { useState, useRef } from 'react';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  X,
  Image as ImageIcon,
  UploadCloud,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Collection, CollectionStatus } from '../../types';
import { processImageFile, validateImageFile } from '../../utils/imageUtils';
import { CollectionGridSkeleton } from '../../components/common/Skeletons';

export default function AdminCollections() {
  const { collections, artworks, createCollection, updateCollection, deleteCollection } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [status, setStatus] = useState<CollectionStatus>('Active');
  const [coverImage, setCoverImage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Toast notification
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverFileUpload = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setToast({ text: validation.error || 'Invalid cover image.', type: 'error' });
      return;
    }
    try {
      const result = await processImageFile(file);
      setCoverImage(result.dataUrl);
    } catch {
      setToast({ text: 'Failed to process cover image file.', type: 'error' });
    }
  };

  // Open modal for new collection
  const handleOpenCreate = () => {
    setEditingCollection(null);
    setName('');
    setDescription('');
    setYear(2026);
    setStatus('Active');
    setCoverImage('');
    setErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing collection
  const handleOpenEdit = (col: Collection) => {
    setEditingCollection(col);
    setName(col.name);
    setDescription(col.description);
    setYear(col.year);
    setStatus(col.status);
    setCoverImage(col.coverImage || '');
    setErrors({});
    setIsModalOpen(true);
  };

  // Count how many artworks are in each collection
  const getArtworkCount = (col: Collection): number => {
    return artworks.filter(
      (art) =>
        art.collectionId === col.id ||
        art.collection.toLowerCase() === col.name.toLowerCase()
    ).length;
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Collection name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingCollection) {
      updateCollection(editingCollection.id, {
        name: name.trim(),
        description: description.trim(),
        year: Number(year) || 2026,
        status,
        coverImage: coverImage.trim(),
      });
      setToast({ text: `Collection "${name}" updated successfully.`, type: 'success' });
    } else {
      createCollection({
        name: name.trim(),
        description: description.trim(),
        year: Number(year) || 2026,
        status,
        coverImage: coverImage.trim(),
      });
      setToast({ text: `Collection "${name}" created successfully.`, type: 'success' });
    }

    setIsModalOpen(false);
    setTimeout(() => setToast(null), 3000);
  };

  // Handle Delete Request
  const handleDeleteRequest = (col: Collection) => {
    const count = getArtworkCount(col);
    if (count > 0) {
      setDeleteWarning(
        `Cannot delete "${col.name}" because it still contains ${count} artwork(s). Please reassign or delete the artworks first.`
      );
      setTimeout(() => setDeleteWarning(null), 4000);
      return;
    }
    setDeletingCollection(col);
  };

  const handleConfirmDelete = () => {
    if (!deletingCollection) return;
    deleteCollection(deletingCollection.id);
    setToast({ text: `Collection "${deletingCollection.name}" deleted.`, type: 'success' });
    setDeletingCollection(null);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5A351E]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5EBDD] tracking-tight">
              Collections Management
            </h1>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#4A2D1A] text-[#C69B5A] border border-[#5A351E]">
              {collections.length} Series
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#C69B5A]/20 text-[#FFE3B3] border border-[#C69B5A]/60 hidden sm:inline-block">
              Site Section: Gallery
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#CDBCA8] mt-1">
            Manages series groups, cover images, and lore displayed in the public Site Section Gallery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold font-mono uppercase tracking-wider transition-colors shadow-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Collection</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between font-medium shadow-xs ${
            toast.type === 'success'
              ? 'bg-[#4A2D1A] border-[#7FAF45] text-[#F5EBDD]'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7FAF45]" />
            <span>{toast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 text-[#CDBCA8] hover:text-[#F5EBDD] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Delete Warning Notice */}
      {deleteWarning && (
        <div className="p-4 rounded-xl bg-[#4A2D1A] border border-[#C69B5A] text-[#F5EBDD] text-xs flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D9A85C] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#D9A85C]">Cannot Delete Collection</p>
              <p className="mt-0.5 text-[#CDBCA8]">{deleteWarning}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeleteWarning(null)}
            className="p-1 text-[#CDBCA8] hover:text-[#F5EBDD] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Collections Grid Cards */}
      {isLoading ? (
        <CollectionGridSkeleton count={3} />
      ) : collections.length === 0 ? (
        <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-12 text-center max-w-lg mx-auto space-y-4">
          <FolderKanban className="w-12 h-12 text-[#C69B5A]/60 mx-auto" />
          <h3 className="text-base font-bold text-[#F5EBDD]">No Collections Yet</h3>
          <p className="text-xs text-[#CDBCA8] leading-relaxed">
            All previous collections have been deleted. You can create a new collection to organize and showcase your NFTs.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create First Collection</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {collections.map((col) => {
          const artworkCount = getArtworkCount(col);
          const displayImage = col.coverImage || '';

          return (
            <div
              key={col.id}
              className="bg-[#4A2D1A] rounded-xl border border-[#5A351E] overflow-hidden shadow-xs flex flex-col justify-between transition-shadow hover:shadow-sm"
            >
              {/* Cover Banner with Avatar Thumbnail */}
              <div className="relative h-28 bg-[#24170F] border-b border-[#5A351E] flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-[#1A0E07] border border-[#5A351E] p-1.5 flex items-center justify-center shrink-0 shadow-md">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={col.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    ) : (
                      <Layers className="w-7 h-7 text-[#C69B5A]/70" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#F5EBDD] truncate max-w-[160px]">
                      {col.name}
                    </h2>
                    <span className="text-[10px] font-mono text-[#C69B5A] block mt-0.5">
                      {col.year} Series
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase self-start ${
                    col.status === 'Active'
                      ? 'bg-[#7FAF45]/30 text-[#F5EBDD] border border-[#7FAF45]'
                      : 'bg-[#77736D]/40 text-[#CDBCA8] border border-[#77736D]'
                  }`}
                >
                  {col.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-[#CDBCA8] line-clamp-3 leading-relaxed">
                  {col.description}
                </p>

                {/* Bottom Details & Actions */}
                <div className="pt-3 border-t border-[#5A351E] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#CDBCA8]">
                    <Layers className="w-3.5 h-3.5 text-[#C69B5A]" />
                    <span className="font-bold text-[#F5EBDD]">{artworkCount}</span>
                    <span>artwork(s)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(col)}
                      className="p-1.5 rounded-lg text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#24170F] transition-colors cursor-pointer"
                      title="Edit Collection"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(col)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#24170F]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#5A351E]">
              <h3 className="font-bold text-base text-[#F5EBDD]">
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#24170F] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#CDBCA8] uppercase font-bold mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tiny Realms Season 1"
                  className="w-full px-3 py-2 bg-[#24170F] border border-[#5A351E] rounded-xl text-sm text-[#F5EBDD] placeholder-[#CDBCA8]/50 focus:outline-none focus:border-[#C69B5A]"
                />
                {errors.name && (
                  <p className="text-rose-400 text-[11px] mt-1">{errors.name}</p>
                )}
              </div>

              {/* Cover Image Selector */}
              <div>
                <input
                  ref={coverFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleCoverFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#CDBCA8] uppercase font-bold">
                    Cover Image / Emblem
                  </label>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] text-[#C69B5A] hover:underline font-semibold cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-[#24170F] border border-[#5A351E] p-1 flex items-center justify-center shrink-0">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[#CDBCA8]" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://... or upload image above"
                    className="flex-1 px-3 py-2 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs text-[#F5EBDD] placeholder-[#CDBCA8]/50 focus:outline-none focus:border-[#C69B5A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CDBCA8] uppercase font-bold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of this artwork series..."
                  className="w-full px-3 py-2 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs text-[#F5EBDD] placeholder-[#CDBCA8]/50 focus:outline-none focus:border-[#C69B5A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CDBCA8] uppercase font-bold mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs text-[#F5EBDD] focus:outline-none focus:border-[#C69B5A]"
                  />
                </div>

                <div>
                  <label className="block text-[#CDBCA8] uppercase font-bold mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CollectionStatus)}
                    className="w-full px-3 py-2 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs text-[#F5EBDD] focus:outline-none focus:border-[#C69B5A]"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#5A351E] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#24170F] text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#70431F] border border-[#5A351E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold font-mono uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCollection && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#24170F]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[#F5EBDD]">
              Delete Collection
            </h3>
            <p className="text-xs text-[#CDBCA8]">
              Are you sure you want to delete the collection &ldquo;{deletingCollection.name}&rdquo;?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCollection(null)}
                className="px-4 py-2 rounded-xl bg-[#24170F] text-[#CDBCA8] hover:text-[#F5EBDD] border border-[#5A351E] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
