import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  FileImage,
  Link as LinkIcon,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Laptop,
  Clipboard,
  Check,
} from 'lucide-react';
import { processImageFile, validateImageFile } from '../../utils/imageUtils';

// Import local character image assets
import bearKingImg from '../../assets/images/characters/bear_king.png';
import pirateMonkeyImg from '../../assets/images/characters/pirate_monkey.png';
import monkeyPandaImg from '../../assets/images/characters/monkey_panda.png';
import pupMonkeyImg from '../../assets/images/characters/pup_monkey.png';
import sproutBearImg from '../../assets/images/characters/sprout_bear.png';
import pandaWizardImg from '../../assets/images/characters/panda_wizard.png';
import crimsonReaperImg from '../../assets/images/characters/crimson_reaper.png';
import celestialAngelBearImg from '../../assets/images/characters/celestial_angel_bear.png';
import chibiAngelGirlImg from '../../assets/images/characters/chibi_angel_girl.png';
import doggyOnesieBearImg from '../../assets/images/characters/doggy_onesie_bear.png';
import monkeyRidingPandaImg from '../../assets/images/characters/monkey_riding_panda.png';
import skullHoodieBearImg from '../../assets/images/characters/skull_hoodie_bear.png';

interface ArtworkImageUploaderProps {
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  error?: string;
}

export default function ArtworkImageUploader({
  value,
  onChange,
  error,
}: ArtworkImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<'device' | 'url' | 'presets'>('url');
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploaderError, setUploaderError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [appliedFeedback, setAppliedFeedback] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Sync initial URL input if value is an external URL
  useEffect(() => {
    if (value && !value.startsWith('data:') && !urlInput) {
      setUrlInput(value);
    }
  }, [value, urlInput]);

  // Reset preview failed whenever value changes
  useEffect(() => {
    setPreviewFailed(false);
  }, [value]);

  // Support Clipboard Paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelection(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // 1. Handle Device File Selection
  const handleFileSelection = async (file: File) => {
    setUploaderError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploaderError(validation.error || 'Invalid image file.');
      return;
    }

    setProcessing(true);
    try {
      const result = await processImageFile(file);
      onChange(result.dataUrl);
      setUploaderError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image file.';
      setUploaderError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Normalize URL (IPFS, missing https://, etc.)
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

  // 2. Handle URL Apply (Unconditional and instant without blocking preloads)
  const handleApplyUrl = (customUrl?: string) => {
    const target = (customUrl || urlInput).trim();
    if (!target) {
      setUploaderError('Please enter or paste an image URL.');
      return;
    }

    const normalized = normalizeUrl(target);
    setUrlInput(normalized);
    setUploaderError(null);
    setPreviewFailed(false);

    // Apply directly to parent state
    onChange(normalized);

    // Show instant success feedback
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 2500);
  };

  // Paste from clipboard button for URL
  const handlePasteClipboardUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const normalized = normalizeUrl(text.trim());
        setUrlInput(normalized);
        handleApplyUrl(normalized);
      }
    } catch {
      // Fallback
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setUploaderError(null);
    setUrlInput('');
    setPreviewFailed(false);
  };

  // Quick Character Presets
  const CHARACTER_PRESETS = [
    { label: 'Bear King', url: bearKingImg },
    { label: 'Sprout Bear', url: sproutBearImg },
    { label: 'Pirate Monkey', url: pirateMonkeyImg },
    { label: 'Monkey & Panda', url: monkeyPandaImg },
    { label: 'Pup Monkey', url: pupMonkeyImg },
    { label: 'Panda Wizard', url: pandaWizardImg },
    { label: 'Crimson Reaper', url: crimsonReaperImg },
    { label: 'Celestial Angel', url: celestialAngelBearImg },
    { label: 'Chibi Angel', url: chibiAngelGirlImg },
    { label: 'Doggy Onesie', url: doggyOnesieBearImg },
    { label: 'Riding Panda', url: monkeyRidingPandaImg },
    { label: 'Skull Hoodie', url: skullHoodieBearImg },
  ];

  const hasImage = Boolean(value && value.trim().length > 0);
  const isBase64 = value ? value.startsWith('data:') : false;

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif,image/*"
        onChange={onFileInputChange}
        className="hidden"
        aria-label="Upload artwork image file from device"
      />

      <div className="bg-[#24170F] rounded-2xl border border-[#5A351E] p-4 sm:p-6 space-y-4 shadow-sm">
        {/* Top Header & Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#5A351E]">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C69B5A]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5EBDD] font-mono">
              Artwork Image Asset *
            </h3>
          </div>

          {/* Mode Switch Tabs: Device, URL, Presets */}
          <div className="flex items-center gap-1 bg-[#4A2D1A] p-1 rounded-xl border border-[#5A351E] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('device')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'device'
                  ? 'bg-[#C69B5A] text-[#24170F] shadow-xs'
                  : 'text-[#CDBCA8] hover:text-[#F5EBDD]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Upload from Device</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-[#C69B5A] text-[#24170F] shadow-xs'
                  : 'text-[#CDBCA8] hover:text-[#F5EBDD]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image URL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-[#C69B5A] text-[#24170F] shadow-xs'
                  : 'text-[#CDBCA8] hover:text-[#F5EBDD]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {(uploaderError || error) && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 space-y-1">
              <span className="font-bold block">Image Notice</span>
              <p>{uploaderError || error}</p>
            </div>
            <button
              type="button"
              onClick={() => setUploaderError(null)}
              className="text-rose-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: UPLOAD VIA DEVICE (DRAG & DROP / FILE BROWSER / CLIPBOARD PASTE)     */}
        {/* ========================================================================= */}
        {activeTab === 'device' && (
          <div className="space-y-3">
            <div
              ref={dropZoneRef}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#C69B5A] bg-[#4A2D1A]/80 scale-[0.99]'
                  : 'border-[#5A351E] bg-[#1A0E07]/60 hover:bg-[#1A0E07] hover:border-[#C69B5A]'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4A2D1A] border border-[#5A351E] shadow-xs flex items-center justify-center mb-3 text-[#C69B5A]">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h4 className="text-sm font-bold text-[#F5EBDD] mb-1">
                Upload image file from your device
              </h4>
              <p className="text-xs text-[#CDBCA8] max-w-sm mb-4 leading-relaxed">
                Click anywhere to browse, drag & drop a file here, or paste from clipboard (<kbd className="px-1.5 py-0.5 rounded bg-[#4A2D1A] text-[#F5EBDD] border border-[#5A351E] font-mono text-[10px]">Ctrl+V</kbd>).
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={processing}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <FileImage className="w-4 h-4 text-[#24170F]" />
                  <span>{processing ? 'Optimizing Image...' : 'Browse Device Files'}</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-[#CDBCA8]/70 mt-3">
                Supports PNG, JPG, WebP, GIF, SVG (Optimized automatically for fast loading)
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: UPLOAD VIA URL (DIRECT LINK / IPFS / EXTERNAL HOSTING / XRP.CAFE)   */}
        {/* ========================================================================= */}
        {activeTab === 'url' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A0E07] border border-[#5A351E] space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#F5EBDD] uppercase font-mono">
                Image Web URL:
              </label>
              <button
                type="button"
                onClick={handlePasteClipboardUrl}
                className="text-[11px] font-mono text-[#C69B5A] hover:text-[#F5EBDD] flex items-center gap-1.5 cursor-pointer bg-[#24170F] px-2.5 py-1 rounded-lg border border-[#5A351E]"
              >
                <Clipboard className="w-3.5 h-3.5 text-[#C69B5A]" />
                <span>Paste from Clipboard</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (uploaderError) setUploaderError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl();
                    }
                  }}
                  placeholder="https://cdn.xrp.cafe/... or any image URL"
                  className="w-full px-3.5 py-2.5 bg-[#24170F] border border-[#5A351E] rounded-xl text-xs font-mono text-[#F5EBDD] placeholder-[#CDBCA8]/40 focus:outline-none focus:border-[#C69B5A]"
                />
              </div>

              <button
                type="button"
                disabled={!urlInput.trim()}
                onClick={() => handleApplyUrl()}
                className="px-5 py-2.5 rounded-xl bg-[#C69B5A] hover:bg-[#D9A85C] active:bg-[#B78A43] text-[#24170F] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0 shadow-md"
              >
                {appliedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-[#24170F]" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#24170F]" />
                    <span>Apply Image URL</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#CDBCA8] flex-wrap gap-2 pt-1">
              <span>
                Accepts direct image URLs (HTTPS), CDN links (e.g. cdn.xrp.cafe), and IPFS addresses.
              </span>
              {urlInput.trim() && (
                <button
                  type="button"
                  onClick={() => handleApplyUrl()}
                  className="text-[#C69B5A] hover:underline font-mono font-bold cursor-pointer"
                >
                  Press Enter to Apply
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CHARACTER PRESETS (QUICK RE-USE OF CATALOGUE ASSETS)                */}
        {/* ========================================================================= */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#F5EBDD] uppercase font-mono block">
              Choose from Tiny Realms Character Archive:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {CHARACTER_PRESETS.map((preset, idx) => {
                const isSelected = value === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setUploaderError(null);
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C69B5A] bg-[#4A2D1A] ring-2 ring-[#C69B5A]'
                        : 'border-[#5A351E] bg-[#1A0E07] hover:bg-[#4A2D1A] hover:border-[#C69B5A]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#24170F] overflow-hidden p-1 flex items-center justify-center">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-[#F5EBDD] truncate w-full">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ACTIVE LIVE IMAGE PREVIEW FRAME                                           */}
        {/* ========================================================================= */}
        {hasImage && (
          <div className="mt-4 pt-4 border-t border-[#5A351E] space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C69B5A] flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#7FAF45]" />
                <span>Active Selected Asset</span>
              </span>

              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#4A2D1A] text-[#CDBCA8] border border-[#5A351E]">
                {isBase64 ? 'Device Upload (Base64)' : 'External Web URL'}
              </span>
            </div>

            <div className="relative w-full max-w-sm mx-auto aspect-square bg-[#1A0E07] rounded-2xl overflow-hidden border-2 border-[#5A351E] flex items-center justify-center p-4 shadow-inner group">
              {!previewFailed ? (
                <img
                  src={value}
                  alt="Selected Artwork Visual Asset"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => {
                    // Soft fallback if host CDN has strict hotlinking
                    setPreviewFailed(true);
                  }}
                />
              ) : (
                <div className="text-center p-4 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#24170F] border border-[#5A351E] flex items-center justify-center mx-auto text-[#C69B5A]">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#F5EBDD]">External Asset Connected</p>
                  <p className="text-[11px] text-[#CDBCA8] max-w-xs leading-relaxed mx-auto">
                    URL is saved. Host server protects live iframe preview, but the image is securely attached.
                  </p>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#C69B5A] hover:underline font-mono font-bold"
                  >
                    <span>Open Image in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Action Controls Floating Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#24170F]/90 hover:bg-[#24170F] border border-[#5A351E] text-[#F5EBDD] text-xs font-semibold shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer backdrop-blur-xs"
                  title="Replace file from device"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#C69B5A]" />
                  <span>Replace File</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-lg bg-rose-900/90 hover:bg-rose-800 text-white shadow-md transition-transform hover:scale-105 cursor-pointer border border-rose-700"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* URL/Data snippet string preview */}
            <div className="text-[11px] font-mono text-[#CDBCA8] text-center truncate max-w-md mx-auto">
              Source: <span className="text-[#F5EBDD]">{value.slice(0, 75)}{value.length > 75 ? '...' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
