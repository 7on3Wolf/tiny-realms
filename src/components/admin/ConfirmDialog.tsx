import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  itemName,
  confirmLabel = 'Delete Artwork',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isDanger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDangerous = isDanger ?? isDestructive;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 bg-[#24170F]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        className="bg-[#4A2D1A] rounded-2xl border border-[#5A351E] p-6 max-w-md w-full shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDangerous
                ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
                : 'bg-[#70431F] text-[#D9A85C] border border-[#C69B5A]'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-[#CDBCA8] hover:text-[#F5EBDD] hover:bg-[#24170F] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3
            id="confirm-dialog-title"
            className="text-base sm:text-lg font-bold text-[#F5EBDD]"
          >
            {title}
          </h3>
          {itemName && (
            <div className="mt-1 font-mono text-xs text-[#C69B5A] font-semibold">
              {itemName}
            </div>
          )}
          <p className="mt-2 text-xs sm:text-sm text-[#CDBCA8] leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#5A351E]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-[#24170F] hover:bg-[#70431F] border border-[#5A351E] text-xs font-semibold text-[#F5EBDD] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm ${
              isDangerous
                ? 'bg-rose-700 hover:bg-rose-600 text-white'
                : 'bg-[#70431F] hover:bg-[#4A2D1A] text-[#F5EBDD] border border-[#C69B5A]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
