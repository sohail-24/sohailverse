import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  itemType?: string;
  resourceType?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title = "Remove this item?",
  itemName,
  itemType = "record",
  resourceType,
  isDeleting = false,
  onConfirm,
  onCancel,
  onClose,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    else if (onClose) onClose();
  };

  const effectiveItemType = resourceType || itemType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-3xl border border-red-500/20 bg-slate-950/95 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <button
          onClick={handleCancel}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="h-10 w-10 shrink-0 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1 pr-4">
            <h3
              id="delete-dialog-title"
              className="font-display text-lg font-bold text-white leading-snug"
            >
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {itemName ? (
                <>
                  Are you sure you want to delete{" "}
                  <span className="text-white font-medium">"{itemName}"</span>?
                </>
              ) : (
                `Are you sure you want to delete this ${effectiveItemType}?`
              )}{" "}
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(239,68,68,0.35)] disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <span>Remove</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
