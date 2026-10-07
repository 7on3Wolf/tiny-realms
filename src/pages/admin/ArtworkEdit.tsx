import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import ArtworkForm from '../../components/admin/ArtworkForm';
import { useApp } from '../../context/AppContext';
import { ArtworkFormData } from '../../types';

interface ArtworkEditProps {
  isNew?: boolean;
}

export default function ArtworkEdit({ isNew = false }: ArtworkEditProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artworks, collections, addArtwork, updateArtwork } = useApp();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  // If editing, find existing artwork
  const existingArtwork = !isNew && id
    ? artworks.find((a) => String(a.id) === String(id))
    : null;

  const handleSubmit = (formData: ArtworkFormData, targetPublishState: boolean) => {
    setLoading(true);
    setToast(null);

    try {
      const payload: ArtworkFormData = {
        ...formData,
        published: targetPublishState,
      };

      if (isNew) {
        const result = addArtwork(payload);
        if (!result.success) {
          setToast({ message: result.error || 'Failed to create artwork.', type: 'error' });
          setLoading(false);
          return;
        }

        setToast({
          message: targetPublishState
            ? 'Artwork created and published live!'
            : 'Artwork saved as draft successfully.',
          type: 'success',
        });
      } else if (existingArtwork) {
        const result = updateArtwork(existingArtwork.id, payload);
        if (!result.success) {
          setToast({ message: result.error || 'Failed to update artwork.', type: 'error' });
          setLoading(false);
          return;
        }

        setToast({
          message: targetPublishState
            ? 'Artwork updated and published live!'
            : 'Artwork updated and saved as draft.',
          type: 'success',
        });
      }

      setLoading(false);
      setTimeout(() => {
        navigate('/admin/artworks', {
          state: {
            toast: isNew
              ? 'New artwork catalogued successfully.'
              : 'Artwork updated successfully.',
          },
        });
      }, 700);
    } catch {
      setToast({ message: 'An unexpected error occurred while saving.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/artworks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#CDBCA8] hover:text-[#F5EBDD] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </Link>
        <span className="text-xs font-mono text-[#C69B5A]">
          {isNew ? 'New Entry' : 'Edit Entry'}
        </span>
      </div>

      {/* Page Header */}
      <div className="pb-4 border-b border-[#5A351E]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F5EBDD] tracking-tight">
          {isNew ? 'New Collection Item' : `Edit Collection Item: ${existingArtwork?.title}`}
        </h1>
        <p className="text-xs sm:text-sm text-[#CDBCA8] mt-0.5">
          {isNew
            ? 'Enter image URL and metadata to catalogue a new collection item.'
            : 'Update image URL, public status, title, dimensions, commercial status, or NFT link.'}
        </p>
      </div>

      {/* Inline Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between font-medium shadow-xs ${
            toast.type === 'success'
              ? 'bg-[#4A2D1A] border-[#7FAF45] text-[#F5EBDD]'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7FAF45] shrink-0" />
            <span>{toast.message}</span>
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

      {/* Reusable Form Component */}
      <ArtworkForm
        key={existingArtwork ? String(existingArtwork.id) : (isNew ? 'new' : 'not-found')}
        isEditing={!isNew}
        artworkId={existingArtwork?.id}
        initialData={
          existingArtwork
            ? {
                title: existingArtwork.title,
                code: existingArtwork.code,
                description: existingArtwork.description,
                image: existingArtwork.image,
                dimensions: existingArtwork.dimensions || '2400 x 2400 px',
                collectionId: existingArtwork.collectionId,
                collection: existingArtwork.collection,
                year: existingArtwork.year,
                category: existingArtwork.category,
                status: existingArtwork.status,
                nftUrl: existingArtwork.nftUrl,
                published: existingArtwork.published,
              }
            : undefined
        }
        collections={collections}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/artworks')}
        loading={loading}
      />
    </div>
  );
}
