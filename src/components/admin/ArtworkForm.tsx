import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArtworkFormData,
  ArtworkStatus,
  Collection,
} from '../../types';
import MetadataField from './MetadataField';
import {
  Tag,
  ShieldCheck,
  Eye,
  Check,
  AlertCircle,
  Link as LinkIcon,
  Clipboard,
  ExternalLink,
  Sparkles,
  Maximize2,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Upload,
} from 'lucide-react';
import { getNextArtworkCode } from '../../services/artworkService';

interface ArtworkFormProps {
  initialData?: Partial<ArtworkFormData & { dimensions?: string }>;
  artworkId?: string;
  collections?: Collection[];
  isEditing?: boolean;
  onSubmit: (data: ArtworkFormData, publishStatus: boolean) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function ArtworkForm({
  initialData,
  artworkId,
  isEditing = false,
  onSubmit,
  onCancel,
  loading = false,
}: ArtworkFormProps) {
  const navigate = useNavigate();

  // Exactly the 6 requested fields:
  // 1. Image ONLY URL
  const [image, setImage] = useState(initialData?.image || '');
  // 2. Public Status (Published vs Draft)
  const [published, setPublished] = useState<boolean>(initialData?.published ?? true);
  // 3. Judul (Artwork Title)
  const [title, setTitle] = useState(initialData?.title || '');
  // 4. Dimensi Ukuran Gambar (Image Dimensions) - Default 2400 x 2400 px
  const [dimensions, setDimensions] = useState(initialData?.dimensions || '2400 x 2400 px');
  // 5. Commercial Status (Available, Sold, Reserved)
  const [status, setStatus] = useState<ArtworkStatus>(initialData?.status || 'Available');
  // 6. NFT URL
  const [nftUrl, setNftUrl] = useState(initialData?.nftUrl || '');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Normalize image URL
  const normalizeUrl = (input: string): string => {
    let clean = input.trim();
    if (clean.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${clean.replace('ipfs://', '')}`;
    }
    if (
      !clean.startsWith('http://') &&
      !clean.startsWith('https://') &&
      !clean.startsWith('data:') &&
      !clean.startsWith('/')
    ) {
      clean = `https://${clean}`;
    }
    return clean;
  };

  // Direct image file upload processor with auto-resize canvas compression
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select an image file (PNG, JPG, WebP, GIF).' }));
      return;
    }

    setCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Auto set dimensions
        setDimensions(`${img.naturalWidth} x ${img.naturalHeight} px`);

        // Auto suggest title if title is empty
        if (!title.trim() && file.name) {
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setTitle(cleanName);
        }

        // Compress image to max 1024px to ensure it stays lightweight in localStorage
        const canvas = document.createElement('canvas');
        const maxDim = 1024;
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            setImage(dataUrl);
            setPreviewError(false);
            if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
          } catch {
            const fallbackDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setImage(fallbackDataUrl);
            setPreviewError(false);
            if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
          }
        }
        setCompressing(false);
      };
      img.onerror = () => {
        setErrors((prev) => ({ ...prev, image: 'Could not parse selected image.' }));
        setCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, image: 'Failed to read image file.' }));
      setCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handlePasteClipboardUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const normalized = normalizeUrl(text.trim());
        setImage(normalized);
        setPreviewError(false);
        if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch {
      // Clipboard fallback
    }
  };

  // Auto-detect dimensions when image loads in browser
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setPreviewError(false);
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight && (!dimensions || dimensions === '2400 x 2400 px' || dimensions === '2400 x 2400')) {
      setDimensions(`${img.naturalWidth} x ${img.naturalHeight} px`);
    }
  };

  // Validation function
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!image.trim()) {
      newErrors.image = 'Image is required (upload a file, select a preset, or enter a URL).';
    }

    if (!title.trim()) {
      newErrors.title = 'Artwork title is required (e.g. Kumo Bamboru).';
    }

    if (nftUrl.trim()) {
      try {
        new URL(nftUrl.trim());
      } catch {
        newErrors.nftUrl = 'Please provide a valid URL (e.g. https://xrp.cafe/nft/...).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (targetPublishState: boolean) => {
    if (!validate()) {
      if (!title.trim()) {
        const titleInput = document.getElementById('artwork-title');
        titleInput?.focus();
        titleInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!image.trim()) {
        const imageInput = document.getElementById('artwork-image-url');
        imageInput?.focus();
        imageInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const effectiveCode = initialData?.code || getNextArtworkCode();

    const formData: ArtworkFormData = {
      title: title.trim(),
      image: normalizeUrl(image),
      dimensions: dimensions.trim() || '2400 x 2400 px',
      status,
      published: targetPublishState,
      nftUrl: nftUrl.trim(),
      code: effectiveCode,
      description: `${title.trim()} - 1-of-1 Digital Artwork`,
      collectionId: initialData?.collectionId || 'col_tiny_realms',
      collection: initialData?.collection || 'Tiny Realms',
      year: initialData?.year || 2026,
      category: 'Digital Character',
    };

    onSubmit(formData, targetPublishState);
  };

  const DIMENSION_PRESETS = [
    '2400 x 2400 px',
    '2048 x 2048 px',
    '1080 x 1080 px',
    '3000 x 3000 px',
    '4000 x 4000 px',
  ];

  const primaryButtonLabel = isEditing
    ? published
      ? 'Save Changes'
      : 'Update & Publish'
    : published
    ? 'Publish Collection'
    : 'Save as Draft';

  return (
    <div className="space-y-6">
      {/* Action Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5A351E]">
        <div>
          <span className="text-xs font-mono font-bold text-[#C69B5A] uppercase tracking-wider block">
            {isEditing ? 'EDIT COLLECTION ENTRY' : 'NEW COLLECTION ENTRY'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5EBDD] tracking-tight">
            {isEditing ? `Edit Item: ${title || 'Untitled'}` : 'Add New Collection Item'}
          </h2>
          <p className="text-xs text-[#CDBCA8] mt-0.5">
            Images and items displayed on the public site Section Collections.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-[#24170F] hover:bg-[#4A2D1A] text-[#CDBCA8] hover:text-[#F5EBDD] border border-[#5A351E] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={() => handleFormSubmit(false)}
            className="px-4 py-2 rounded-xl bg-[#4A2D1A] hover:bg-[#70431F] text-[#F5EBDD] border border-[#5A351E] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleFormSubmit(true)}
            className="px-5 py-2 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#24170F]" />
            <span>{primaryButtonLabel}</span>
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <p className="font-bold">Please check the required fields:</p>
              <p className="mt-0.5 text-rose-300">{Object.values(errors).join(' ')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrors({})}
            className="text-rose-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Two Column Layout: Left Image URL & Preview, Right Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* FIELD 1: INPUT GAMBAR ONLY URL + PREVIEW                                  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#24170F] rounded-2xl border border-[#5A351E] p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#5A351E]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#C69B5A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EBDD] font-mono">
                  1. Artwork Media *
                </h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center bg-[#1A0E07] p-0.5 rounded-lg border border-[#5A351E]">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    imageInputMode === 'upload'
                      ? 'bg-[#C69B5A] text-[#24170F]'
                      : 'text-[#CDBCA8] hover:text-[#F5EBDD]'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    imageInputMode === 'url'
                      ? 'bg-[#C69B5A] text-[#24170F]'
                      : 'text-[#CDBCA8] hover:text-[#F5EBDD]'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>URL / IPFS</span>
                </button>
              </div>
            </div>

            {/* Upload File Mode */}
            {imageInputMode === 'upload' && (
              <div className="space-y-2">
                <label
                  htmlFor="artwork-file-upload"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#C69B5A] bg-[#C69B5A]/15 scale-[1.01]'
                      : 'border-[#5A351E] hover:border-[#C69B5A]/60 bg-[#1A0E07]/60 hover:bg-[#1A0E07]'
                  }`}
                >
                  <input
                    id="artwork-file-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Upload className={`w-8 h-8 mb-2 ${compressing ? 'animate-bounce text-[#C69B5A]' : 'text-[#C69B5A]'}`} />
                  <p className="text-xs font-bold text-[#F5EBDD]">
                    {compressing ? 'Processing & Optimizing Image...' : 'Click to Upload or Drag & Drop'}
                  </p>
                  <p className="text-[11px] text-[#CDBCA8] mt-1">
                    PNG, JPG, WebP (Auto-optimized for instant web display)
                  </p>
                </label>
              </div>
            )}

            {/* URL Input Mode */}
            {imageInputMode === 'url' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#CDBCA8]">Direct Image URL / IPFS:</span>
                  <button
                    type="button"
                    onClick={handlePasteClipboardUrl}
                    className="text-[11px] font-mono text-[#C69B5A] hover:text-[#F5EBDD] flex items-center gap-1.5 cursor-pointer bg-[#4A2D1A] px-2 py-0.5 rounded-md border border-[#5A351E]"
                    title="Paste image URL from clipboard"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>{pasteSuccess ? 'Pasted!' : 'Paste URL'}</span>
                  </button>
                </div>
                <input
                  id="artwork-image-url"
                  type="text"
                  required
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setPreviewError(false);
                    if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
                  }}
                  placeholder="https://... or ipfs://..."
                  className={`w-full px-3.5 py-2.5 bg-[#1A0E07] border rounded-xl text-xs font-mono text-[#F5EBDD] placeholder-[#CDBCA8]/40 focus:outline-none focus:border-[#C69B5A] transition-colors ${
                    errors.image ? 'border-rose-500 bg-rose-950/20' : 'border-[#5A351E]'
                  }`}
                />
              </div>
            )}

            {/* Image Preview Box */}
            <div className="relative w-full aspect-square bg-[#1A0E07] rounded-2xl overflow-hidden border-2 border-[#5A351E] flex items-center justify-center p-4 shadow-inner group">
              {image.trim() ? (
                <>
                  {!previewError ? (
                    <img
                      src={image}
                      alt={title || 'Artwork Preview'}
                      onLoad={handleImageLoad}
                      onError={() => setPreviewError(true)}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                    />
                  ) : (
                    <div className="text-center p-4 space-y-2">
                      <ImageIcon className="w-10 h-10 text-[#C69B5A] mx-auto opacity-70" />
                      <p className="text-xs font-bold text-[#F5EBDD]">External Asset Connected</p>
                      <p className="text-[11px] text-[#CDBCA8] max-w-xs leading-relaxed mx-auto">
                        URL is valid & saved. Direct cross-origin live preview is protected by the host CDN.
                      </p>
                    </div>
                  )}

                  {/* Floating Action Controls */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <a
                      href={image}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#24170F]/90 hover:bg-[#24170F] text-[#C69B5A] hover:text-[#F5EBDD] border border-[#5A351E] text-xs font-semibold shadow-md backdrop-blur-xs flex items-center gap-1"
                      title="Open Image URL in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setImage('');
                        setPreviewError(false);
                      }}
                      className="p-1.5 rounded-lg bg-rose-900/90 hover:bg-rose-800 text-white shadow-md border border-rose-700 cursor-pointer"
                      title="Clear image URL"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2 text-[#CDBCA8]/60">
                  <ImageIcon className="w-10 h-10 mx-auto opacity-40 text-[#C69B5A]" />
                  <p className="text-xs font-mono font-medium">Image preview will appear here</p>
                  <p className="text-[10px]">Paste an image URL into the field above</p>
                </div>
              )}
            </div>

            {/* Source String Preview */}
            {image.trim() && (
              <div className="text-[11px] font-mono text-[#CDBCA8] text-center truncate pt-1">
                Source: <span className="text-[#F5EBDD]">{image.slice(0, 70)}{image.length > 70 ? '...' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: FIELDS 2, 3, 4, 5, 6                                        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Artwork Identification & Details */}
          <div className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-6 shadow-xs space-y-6">
            {/* =================================================================== */}
            {/* FIELD 2: PUBLIC STATUS (Published vs Draft)                         */}
            {/* =================================================================== */}
            <div className="pb-5 border-b border-[#5A351E]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5EBDD] font-mono mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#C69B5A]" />
                <span>2. Public Visibility Status</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPublished(true)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    published
                      ? 'bg-[#2E5A36]/30 border-[#448350] ring-1 ring-[#448350]'
                      : 'bg-[#24170F] border-[#5A351E] text-[#CDBCA8] hover:bg-[#3A2214]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${published ? 'bg-[#7FAF45]' : 'bg-[#5A351E]'}`} />
                  <div>
                    <span className={`text-xs font-bold block ${published ? 'text-[#D4F0DB]' : 'text-[#F5EBDD]'}`}>
                      Published (Live)
                    </span>
                    <span className="text-[11px] text-[#CDBCA8]">
                      Visible to site visitors in Section Collections
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPublished(false)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    !published
                      ? 'bg-[#70431F]/40 border-[#C69B5A] ring-1 ring-[#C69B5A]'
                      : 'bg-[#24170F] border-[#5A351E] text-[#CDBCA8] hover:bg-[#3A2214]'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${!published ? 'bg-[#C69B5A]' : 'bg-[#5A351E]'}`} />
                  <div>
                    <span className={`text-xs font-bold block ${!published ? 'text-[#FFE3B3]' : 'text-[#F5EBDD]'}`}>
                      Draft (Hidden)
                    </span>
                    <span className="text-[11px] text-[#CDBCA8]">
                      Hidden from public site, editable in admin
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* FIELD 3: JUDUL (Artwork Title)                                      */}
            {/* =================================================================== */}
            <MetadataField
              label="3. Artwork Title *"
              required
              htmlFor="artwork-title"
              error={errors.title}
              hint="Official name of the character or digital artwork."
            >
              <input
                id="artwork-title"
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="e.g. Kumo Bamboru"
                className={`w-full px-3.5 py-2.5 bg-[#24170F] border rounded-xl text-sm font-semibold text-[#F5EBDD] placeholder-[#CDBCA8]/50 focus:outline-none focus:border-[#C69B5A] transition-colors ${
                  errors.title ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500' : 'border-[#5A351E]'
                }`}
              />
            </MetadataField>

            {/* =================================================================== */}
            {/* FIELD 4: DIMENSI UKURAN GAMBAR (Image Dimensions)                   */}
            {/* =================================================================== */}
            <MetadataField
              label="4. Image Dimensions (Ukuran Gambar)"
              htmlFor="artwork-dimensions"
              hint="Resolution / aspect dimensions of the artwork asset."
            >
              <div className="space-y-2">
                <div className="relative">
                  <input
                    id="artwork-dimensions"
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="2400 x 2400 px"
                    className="w-full px-3.5 py-2.5 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs font-mono font-semibold text-[#C69B5A] placeholder-[#CDBCA8]/50 focus:outline-none focus:border-[#C69B5A] transition-colors"
                  />
                  <Maximize2 className="w-4 h-4 text-[#C69B5A] absolute right-3 top-3 opacity-60 pointer-events-none" />
                </div>

                {/* Dimension Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] font-mono text-[#CDBCA8] mr-1">Presets:</span>
                  {DIMENSION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDimensions(preset)}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono transition-colors cursor-pointer ${
                        dimensions === preset
                          ? 'bg-[#C69B5A] text-[#24170F] font-bold border-[#C69B5A]'
                          : 'bg-[#24170F] text-[#CDBCA8] hover:text-[#F5EBDD] border-[#5A351E]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </MetadataField>

            {/* =================================================================== */}
            {/* FIELD 5: COMMERCIAL STATUS (Available, Sold, Reserved)              */}
            {/* =================================================================== */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5EBDD] font-mono mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#C69B5A]" />
                <span>5. Commercial Status</span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {(['Available', 'Sold', 'Reserved'] as ArtworkStatus[]).map((st) => {
                  const isCurrent = status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isCurrent
                          ? st === 'Available'
                            ? 'bg-[#2E5A36]/40 border-[#448350] text-[#D4F0DB] font-bold ring-1 ring-[#448350]'
                            : st === 'Sold'
                            ? 'bg-[#77736D]/40 border-[#8C5D19] text-[#F5EBDD] font-bold ring-1 ring-[#8C5D19]'
                            : 'bg-[#8C5D19]/40 border-[#C69B5A] text-[#FFE3B3] font-bold ring-1 ring-[#C69B5A]'
                          : 'bg-[#24170F] border-[#5A351E] text-[#CDBCA8] hover:text-[#F5EBDD]'
                      }`}
                    >
                      <span className="text-xs font-mono uppercase tracking-wider block">
                        {st}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================================== */}
            {/* FIELD 6: NFT URL                                                    */}
            {/* =================================================================== */}
            <MetadataField
              label="6. NFT Marketplace / Explorer URL"
              htmlFor="artwork-nft-url"
              error={errors.nftUrl}
              hint="Link to verified NFT marketplace listing (e.g. https://xrp.cafe/nft/...)."
            >
              <div className="relative">
                <input
                  id="artwork-nft-url"
                  type="url"
                  value={nftUrl}
                  onChange={(e) => {
                    setNftUrl(e.target.value);
                    if (errors.nftUrl) setErrors((prev) => ({ ...prev, nftUrl: '' }));
                  }}
                  placeholder="https://xrp.cafe/nft/..."
                  className={`w-full px-3.5 py-2.5 bg-[#24170F] border rounded-xl text-xs font-mono text-[#F5EBDD] placeholder-[#CDBCA8]/40 focus:outline-none focus:border-[#C69B5A] transition-colors ${
                    errors.nftUrl ? 'border-rose-500 bg-rose-950/20' : 'border-[#5A351E]'
                  }`}
                />
                <ExternalLink className="w-3.5 h-3.5 text-[#C69B5A] absolute right-3 top-3 opacity-60 pointer-events-none" />
              </div>
            </MetadataField>
          </div>

          {/* Bottom Submit Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleFormSubmit(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#24170F]" />
              <span>{primaryButtonLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
