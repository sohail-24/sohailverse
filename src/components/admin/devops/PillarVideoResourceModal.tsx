import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Video,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Eye,
} from "lucide-react";
import type { PillarResource } from "../../../lib/pillarContent";
import { getVideoEmbedUrl } from "../../../lib/pillarContent";

interface PillarVideoResourceModalProps {
  isOpen: boolean;
  pillar: "Networking" | "AWS";
  resource: PillarResource | null;
  onClose: () => void;
  onSave: (data: {
    id?: number;
    title: string;
    name: string;
    image_url: string;
    video_url: string;
  }) => Promise<void>;
  onPreviewVideo?: (videoUrl: string, title: string) => void;
}

const PRESET_IMAGES = {
  Networking: [
    { label: "OSI & Network Architecture", url: "/dev-real-2102415.jpg" },
    { label: "VPC & Cloud Topology", url: "/dev-real-3183150.jpg" },
    { label: "Subnetting & Gateway Routing", url: "/dev-real-2582937.jpg" },
    { label: "DNS & Edge Infrastructure", url: "/dev-desk-1.jpg" },
  ],
  AWS: [
    { label: "AWS Multi-AZ & HA", url: "/dev-real-2582937.jpg" },
    { label: "EC2 & Compute Infrastructure", url: "/dev-real-3183150.jpg" },
    { label: "S3 & CloudFront Edge", url: "/dev-desk-1.jpg" },
    { label: "IAM & Cloud Security", url: "/dev-real-2102415.jpg" },
  ],
};

export default function PillarVideoResourceModal({
  isOpen,
  pillar,
  resource,
  onClose,
  onSave,
  onPreviewVideo,
}: PillarVideoResourceModalProps) {
  const isEditing = !!resource;
  const isNetworking = pillar === "Networking";

  // Form Fields
  const [title, setTitle] = useState(resource?.title || "");
  const [name, setName] = useState(
    resource?.name || (isNetworking ? "Networking Fundamentals" : "Amazon EC2")
  );
  const [imageUrl, setImageUrl] = useState(resource?.image_url || "");
  const [videoUrl, setVideoUrl] = useState(resource?.video_url || "");

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Sync state on open/resource change
  useEffect(() => {
    if (resource) {
      setTitle(resource.title || "");
      setName(
        resource.name ||
          (pillar === "Networking"
            ? "Networking Fundamentals"
            : "Amazon EC2")
      );
      setImageUrl(resource.image_url || "");
      setVideoUrl(resource.video_url || "");
    } else {
      setTitle("");
      setName(
        pillar === "Networking"
          ? "Networking Fundamentals"
          : "Amazon EC2"
      );
      setImageUrl(
        pillar === "Networking"
          ? "/dev-real-3183150.jpg"
          : "/dev-real-2582937.jpg"
      );
      setVideoUrl("");
    }
    setFormError(null);
    setImageLoadError(false);
  }, [resource, pillar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await onSave({
        id: resource?.id,
        title: title.trim(),
        name: name.trim(),
        image_url: imageUrl.trim(),
        video_url: videoUrl.trim(),
      });
      onClose();
    } catch (err: any) {
      setFormError(err?.message || `Failed to save ${pillar} resource.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const accentColor = isNetworking ? "cyan" : "orange";
  const accentBorder = isNetworking ? "border-cyan-500/30" : "border-orange-500/30";
  const accentGlow = isNetworking ? "shadow-[0_0_25px_rgba(6,182,212,0.15)]" : "shadow-[0_0_25px_rgba(249,115,22,0.15)]";
  const accentBtn = isNetworking
    ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
    : "bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.4)]";
  const accentBadge = isNetworking ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" : "bg-orange-500/15 text-orange-300 border-orange-500/30";

  const videoEmbed = getVideoEmbedUrl(videoUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-resource-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl my-8 rounded-2xl sm:rounded-3xl border ${accentBorder} bg-slate-950 p-5 sm:p-8 text-left shadow-[0_25px_60px_rgba(0,0,0,0.9)] ${accentGlow} backdrop-blur-2xl max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${accentBadge}`}>
                {pillar} Resource
              </span>
              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-400 text-xs font-mono">
                {isEditing ? `ID #${resource.id}` : "New Entry"}
              </span>
            </div>
            <h2
              id="video-resource-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight uppercase"
            >
              {isEditing ? `Edit ${pillar} Resource` : `Create ${pillar} Resource`}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {formError && (
          <div className="mt-4 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* FIELD 1: TITLE */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isNetworking
                  ? "e.g. VPC Subnetting & CIDR Calculation"
                  : "e.g. EC2 Fundamentals"
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all font-sans"
            />
            <p className="text-[11px] text-slate-400">
              The primary title of this lesson or walkthrough.
            </p>
          </div>

          {/* FIELD 2: NAME */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
              Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                isNetworking
                  ? "e.g. Networking Fundamentals"
                  : "e.g. Amazon EC2"
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all font-sans"
            />
            <p className="text-[11px] text-slate-400">
              The category or module name (e.g. {isNetworking ? "Networking Fundamentals, Core OSI, DNS" : "Amazon EC2, Amazon S3, AWS IAM"}).
            </p>
          </div>

          {/* FIELD 3: IMAGE */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                Image
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-[11px] font-mono text-slate-400 hover:text-rose-300 transition-colors"
                >
                  Clear image
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <ImageIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageLoadError(false);
                }}
                placeholder="/dev-real-3183150.jpg or https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all font-mono"
              />
            </div>

            {/* Image Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Presets:</span>
              {PRESET_IMAGES[pillar].map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    setImageLoadError(false);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                    imageUrl === preset.url
                      ? isNetworking
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        : "bg-orange-500/20 text-orange-300 border-orange-500/40"
                      : "bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="mt-2.5 p-2 rounded-xl border border-white/10 bg-slate-900/60">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>Image Preview</span>
                </div>
                {!imageLoadError ? (
                  <div className="relative w-full aspect-[21/9] sm:aspect-video max-h-44 rounded-lg overflow-hidden border border-white/10 bg-black">
                    <img
                      src={imageUrl}
                      alt={title || "Resource preview"}
                      onError={() => setImageLoadError(true)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                    Image could not be loaded from this URL. Check the path or URL.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FIELD 4: VIDEO URL */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                Video URL
              </label>
              {videoUrl && (
                <div className="flex items-center gap-2">
                  {onPreviewVideo && (
                    <button
                      type="button"
                      onClick={() => onPreviewVideo(videoUrl, title || `${pillar} Walkthrough`)}
                      className={`text-[11px] font-mono flex items-center gap-1 hover:underline ${
                        isNetworking ? "text-cyan-400" : "text-orange-400"
                      }`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Preview Video ↗</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setVideoUrl("")}
                    className="text-[11px] font-mono text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Video className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or .mp4"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Supports YouTube, YouTube Shorts, Vimeo, or direct MP4/video link.
            </p>

            {videoEmbed && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Embed playable</span>
                {videoUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-slate-400 hover:text-white inline-flex items-center gap-1"
                  >
                    <span>Open link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-slate-300 font-medium text-xs sm:text-sm hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${accentBtn} ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Resource</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
