import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Video,
  BookOpen,
  GitBranch,
  Presentation,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import type {
  LearningPillar,
  PillarResource,
  ResourceLink,
} from "../../../lib/pillarContent";
import {
  PILLAR_CONFIG,
  getVideoEmbedUrl,
} from "../../../lib/pillarContent";

interface ResourceEditorModalProps {
  isOpen: boolean;
  resource: PillarResource | null;
  defaultPillar?: LearningPillar;
  onClose: () => void;
  onSave: (data: {
    id?: number;
    title: string;
    pillar: LearningPillar;
    description: string;
    image_url: string;
    video_url: string;
    video_duration: string;
    pdf_url?: string;
    links: ResourceLink[];
    technologies: string;
    highlights: string;
    status: string;
  }) => Promise<void>;
}

const PILLARS: LearningPillar[] = [
  "Notes",
  "Networking",
  "AWS",
  "DevOps",
  "Learn & Test Projects",
];

const STATUS_OPTIONS = [
  "Production Ready",
  "Running",
  "Active",
  "Hands-on Lab",
  "Beginner Lab",
  "Published Note",
  "In Development",
];

const IMAGE_PRESETS = [
  { label: "OSI & Network Architecture", url: "/dev-real-2102415.jpg" },
  { label: "VPC & Cloud Infrastructure", url: "/dev-real-3183150.jpg" },
  { label: "AWS Multi-AZ & High Availability", url: "/dev-real-2582937.jpg" },
  { label: "Kubernetes & Microservices Store", url: "/dev-real-1779487.jpg" },
  { label: "S3 & CloudFront Edge Lab", url: "/dev-desk-1.jpg" },
];

export default function ResourceEditorModal({
  isOpen,
  resource,
  defaultPillar = "DevOps",
  onClose,
  onSave,
}: ResourceEditorModalProps) {
  const isEditing = !!resource;

  // Form State
  const [pillar, setPillar] = useState<LearningPillar>(
    resource?.pillar || defaultPillar
  );
  const [title, setTitle] = useState(resource?.title || "");
  const [status, setStatus] = useState(resource?.status || "Production Ready");
  const [imageUrl, setImageUrl] = useState(resource?.image_url || "");
  const [videoUrl, setVideoUrl] = useState(resource?.video_url || "");
  const [videoDuration, setVideoDuration] = useState(
    resource?.video_duration || ""
  );
  const [pdfUrl, setPdfUrl] = useState(resource?.pdf_url || "");
  const [description, setDescription] = useState(resource?.description || "");
  const [highlights, setHighlights] = useState(resource?.highlights || "");
  const [technologies, setTechnologies] = useState(
    resource?.technologies || ""
  );
  const [links, setLinks] = useState<ResourceLink[]>(
    resource?.links ? [...resource.links] : []
  );

  // New Link inputs
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState<ResourceLink["type"]>("github");

  // Status & Previews
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Reset when modal opens or resource changes
  useEffect(() => {
    if (resource) {
      setPillar(resource.pillar);
      setTitle(resource.title);
      setStatus(resource.status || "Production Ready");
      setImageUrl(resource.image_url || "");
      setVideoUrl(resource.video_url || "");
      setVideoDuration(resource.video_duration || "");
      setPdfUrl(resource.pdf_url || "");
      setDescription(resource.description || "");
      setHighlights(resource.highlights || "");
      setTechnologies(resource.technologies || "");
      setLinks(resource.links ? [...resource.links] : []);
    } else {
      setPillar(defaultPillar);
      setTitle("");
      setStatus(
        defaultPillar === "Notes"
          ? "Published Note"
          : defaultPillar === "Learn & Test Projects"
          ? "Hands-on Lab"
          : "Production Ready"
      );
      setImageUrl("");
      setVideoUrl("");
      setVideoDuration("");
      setPdfUrl("");
      setDescription("");
      setHighlights("");
      setTechnologies("");
      setLinks([]);
    }
    setFormError(null);
    setImageLoadError(false);
    setNewLinkTitle("");
    setNewLinkUrl("");
  }, [resource, defaultPillar, isOpen]);

  if (!isOpen) return null;

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    setLinks((prev) => [
      ...prev,
      {
        title: newLinkTitle.trim() || newLinkUrl.trim(),
        url: newLinkUrl.trim(),
        type: newLinkType,
      },
    ]);
    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Please provide a title for this resource.");
      return;
    }
    if (!description.trim()) {
      setFormError("Please enter notes or content for this resource.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      await onSave({
        id: resource?.id,
        title: title.trim(),
        pillar,
        description: description.trim(),
        image_url: imageUrl.trim(),
        video_url: videoUrl.trim(),
        video_duration: videoDuration.trim(),
        pdf_url: pdfUrl.trim(),
        links,
        technologies: technologies.trim(),
        highlights: highlights.trim(),
        status,
      });
      onClose();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save resource.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const videoEmbed = getVideoEmbedUrl(videoUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-8 rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-950 p-5 sm:p-8 text-left shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-semibold">
              {isEditing ? `Edit Resource #${resource.id}` : "Create New Resource"}
            </span>
            <h2
              id="editor-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5"
            >
              {isEditing ? `Update ${resource.title}` : `Add to ${pillar}`}
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* SECTION 1: PILLAR SELECTION */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              1. Learning Pillar / Category <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {PILLARS.map((p) => {
                const cfg = PILLAR_CONFIG[p];
                const isSelected = pillar === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPillar(p)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left flex flex-col justify-between min-h-[58px] cursor-pointer ${
                      isSelected
                        ? `${cfg.badgeBg} ${cfg.borderColor} ring-1 ring-white/30 text-white font-bold`
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] text-slate-400">
                        Pillar 0{cfg.stepNumber}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                    <span className="truncate">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: TITLE & STATUS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="res-title"
                className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
              >
                2. Resource Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="res-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VPC Subnetting & CIDR Calculation Deep Dive"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="res-status"
                className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
              >
                Status Badge
              </label>
              <select
                id="res-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white text-sm focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-950 text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 3: IMAGE MANAGEMENT */}
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="res-image"
                className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <ImageIcon className="h-4 w-4 text-purple-400" />
                <span>3. Image / Diagram Management</span>
              </label>
              <span className="text-[11px] text-slate-400">Architecture visual or banner</span>
            </div>

            <input
              id="res-image"
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImageLoadError(false);
              }}
              placeholder="e.g. /dev-real-2102415.jpg or https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-white text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
            />

            {/* Quick image presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] font-mono text-slate-400">Quick Presets:</span>
              {IMAGE_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => {
                    setImageUrl(p.url);
                    setImageLoadError(false);
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Live Image Preview */}
            {imageUrl.trim() && (
              <div className="mt-3 relative w-full aspect-video max-h-48 rounded-xl overflow-hidden border border-white/10 bg-black/60">
                {!imageLoadError ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={() => setImageLoadError(true)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <AlertCircle className="h-5 w-5 text-amber-400 mb-1" />
                    <span>Unable to load image from this URL. Verify link is accessible.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 4: VIDEO MANAGEMENT */}
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="res-video"
                className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <Video className="h-4 w-4 text-sky-400" />
                <span>4. Video Walkthrough & Embed</span>
              </label>
              <span className="text-[11px] text-slate-400">YouTube, Vimeo, or MP4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                id="res-video"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=0k5G6FmE3s4"
                className="sm:col-span-3 px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-white text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
              />
              <input
                type="text"
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                placeholder="Duration (e.g. 14:20)"
                className="px-3 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-white text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Live Video Embed Preview */}
            {videoEmbed && (
              <div className="mt-3 relative w-full aspect-video max-h-48 rounded-xl overflow-hidden border border-sky-500/30 bg-black">
                <iframe
                  src={videoEmbed}
                  title="Live Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
          </div>

          {/* SECTION: PDF DOCUMENT / RUNBOOK */}
          <div className="space-y-3 rounded-2xl border border-purple-500/20 bg-purple-950/10 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="res-pdf"
                className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5"
              >
                <FileText className="h-4 w-4 text-purple-400" />
                <span>PDF Document URL</span>
              </label>
              <span className="text-[11px] text-slate-400">Runbook, cheat sheet, or whitepaper</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                id="res-pdf"
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="e.g. /resume.pdf or https://example.com/devops-cheatsheet.pdf"
                className="flex-1 px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-white text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
              />

              {pdfUrl.trim() ? (
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={pdfUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    title="Open PDF in new window"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Open PDF</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setPdfUrl("")}
                    className="h-9 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Remove PDF association"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove PDF</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPdfUrl("/resume.pdf")}
                  className="h-9 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-mono inline-flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  title="Insert sample PDF path"
                >
                  <FileText className="h-3.5 w-3.5 text-purple-400" />
                  <span>Use Sample PDF</span>
                </button>
              )}
            </div>

            {pdfUrl.trim() && (
              <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200">
                <span className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Active PDF Reference: {pdfUrl}</span>
                </span>
                <span className="shrink-0 text-purple-300">Ready to save</span>
              </div>
            )}
          </div>

          {/* SECTION 5: NOTES & CONTENT */}
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="res-desc"
                className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
              >
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>5. Notes / Technical Content <span className="text-rose-400">*</span></span>
              </label>
              <span className="text-[11px] text-slate-400">Markdown, commands, concepts</span>
            </div>

            <textarea
              id="res-desc"
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter comprehensive engineering notes, cheat sheets, CLI commands, or lab walkthrough steps..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white text-sm leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-sans"
            />

            {/* Key Takeaways */}
            <div className="space-y-1 pt-1">
              <label
                htmlFor="res-takeaways"
                className="text-[11px] font-mono text-amber-400 font-medium"
              >
                Key Takeaways / Highlights (Summarized takeaway)
              </label>
              <input
                id="res-takeaways"
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="e.g. Master slash-notation subnetting and enforce strict egress filtering."
                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900/90 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* SECTION 6: INTERACTIVE LINKS BUILDER */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4 text-cyan-400" />
                <span>6. Associated Links ({links.length})</span>
              </label>
              <span className="text-[11px] text-slate-400">GitHub, Slides, Docs, Demo</span>
            </div>

            {/* Existing Links List */}
            {links.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {links.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-white/10 bg-slate-900/70 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/10 text-slate-300">
                        {link.type || "link"}
                      </span>
                      <span className="font-semibold text-white truncate max-w-[140px]">
                        {link.title}
                      </span>
                      <span className="text-slate-400 truncate max-w-[240px] font-mono text-[11px]">
                        {link.url}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveLink(idx)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove link"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No links added yet. Add repository, slides, or documentation links below.
              </p>
            )}

            {/* Add New Link Bar */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2">
              <select
                value={newLinkType}
                onChange={(e) => setNewLinkType(e.target.value as any)}
                className="sm:col-span-3 px-2.5 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="github">GitHub Repo</option>
                <option value="slides">Slides / PPT</option>
                <option value="docs">Documentation</option>
                <option value="demo">Live Demo</option>
                <option value="other">External Link</option>
              </select>

              <input
                type="text"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="Link Title (e.g. GitHub Repo)"
                className="sm:col-span-4 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />

              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://..."
                className="sm:col-span-4 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
              />

              <button
                type="button"
                onClick={handleAddLink}
                className="sm:col-span-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                title="Add link"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* SECTION 7: TECHNOLOGIES */}
          <div className="space-y-1.5">
            <label
              htmlFor="res-tech"
              className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300"
            >
              Technologies & Tags
            </label>
            <input
              id="res-tech"
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. Kubernetes, AWS EKS, Terraform, ArgoCD, Docker"
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Changes" : `Add to ${pillar}`}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
