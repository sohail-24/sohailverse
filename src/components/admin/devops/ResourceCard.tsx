import React from "react";
import {
  Edit3,
  Trash2,
  ExternalLink,
  Video,
  BookOpen,
  Image as ImageIcon,
  GitBranch,
  Presentation,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { PillarResource, ResourceLink } from "../../../lib/pillarContent";
import { PILLAR_CONFIG } from "../../../lib/pillarContent";

interface ResourceCardProps {
  resource: PillarResource;
  onEdit: (resource: PillarResource) => void;
  onDelete: (resource: PillarResource) => void;
  onWatchVideo?: (videoUrl: string, title: string) => void;
  onReadNotes?: (resource: PillarResource) => void;
  onViewImage?: (imageUrl: string, title: string) => void;
}

function getLinkIcon(link: ResourceLink) {
  if (link.type === "github" || link.url.includes("github.com")) {
    return <GitBranch className="h-3 w-3 text-lime-400" />;
  }
  if (link.type === "slides" || link.url.includes("slides") || link.url.includes("deck")) {
    return <Presentation className="h-3 w-3 text-purple-400" />;
  }
  if (link.type === "docs" || link.url.includes("docs") || link.url.includes("ietf")) {
    return <FileText className="h-3 w-3 text-cyan-400" />;
  }
  return <ExternalLink className="h-3 w-3 text-slate-400" />;
}

export default function ResourceCard({
  resource,
  onEdit,
  onDelete,
  onWatchVideo,
  onReadNotes,
  onViewImage,
}: ResourceCardProps) {
  const config = PILLAR_CONFIG[resource.pillar];

  return (
    <article
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/60 hover:bg-slate-900/90 p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      aria-labelledby={`resource-title-${resource.id}`}
    >
      {/* Top Part: Image (if any) + Header */}
      <div>
        {/* Image / Diagram Banner */}
        {resource.image_url ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3.5 border border-white/10 bg-slate-950 group-hover:border-white/20 transition-all">
            <img
              src={resource.image_url}
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {onViewImage && (
              <button
                type="button"
                onClick={() => onViewImage(resource.image_url, resource.title)}
                className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 hover:bg-black/90 text-[10px] font-mono font-medium text-white flex items-center gap-1 backdrop-blur-sm transition-all"
                title="View full image"
              >
                <ImageIcon className="h-3 w-3 text-slate-300" />
                <span>Zoom</span>
              </button>
            )}
            {/* Overlay Pillar Tag */}
            <span
              className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${config.badgeBg} ${config.badgeText}`}
            >
              {resource.pillar}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${config.badgeBg} ${config.badgeText}`}
            >
              {resource.pillar}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ID #{resource.id}
            </span>
          </div>
        )}

        {/* Status + Title */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3
            id={`resource-title-${resource.id}`}
            className="font-display text-base sm:text-lg font-bold text-white group-hover:text-white transition-colors leading-snug"
          >
            {resource.title}
          </h3>
          <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300 whitespace-nowrap">
            {resource.status}
          </span>
        </div>

        {/* Notes / Content Preview */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-3">
          {resource.description}
        </p>

        {/* Read full notes button */}
        {resource.description.length > 100 && onReadNotes && (
          <button
            type="button"
            onClick={() => onReadNotes(resource)}
            className="text-[11px] font-mono font-medium text-slate-400 hover:text-white flex items-center gap-1 mb-3 transition-colors cursor-pointer"
          >
            <BookOpen className="h-3 w-3 text-slate-400" />
            <span>Read full notes & details →</span>
          </button>
        )}

        {/* Video Trigger (if present) */}
        {resource.video_url && onWatchVideo ? (
          <div className="mb-3.5 p-2 rounded-xl border border-sky-500/20 bg-sky-950/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-6 w-6 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                <Video className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-sky-200 truncate">
                  Video Demonstration Available
                </div>
                {resource.video_duration && (
                  <div className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{resource.video_duration}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onWatchVideo(resource.video_url, resource.title)}
              className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Video className="h-3 w-3" />
              <span>Watch</span>
            </button>
          </div>
        ) : null}

        {/* PDF Document Trigger (if present) */}
        {resource.pdf_url && (
          <div className="mb-3.5 p-2 rounded-xl border border-purple-500/20 bg-purple-950/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-6 w-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <FileText className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-medium text-purple-200 truncate">
                  PDF Document Attached
                </div>
                <div className="text-[10px] text-purple-400 font-mono truncate max-w-[170px]">
                  {resource.pdf_url}
                </div>
              </div>
            </div>

            <a
              href={resource.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-semibold shrink-0 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Open PDF document"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Read PDF</span>
            </a>
          </div>
        )}

        {/* Technologies Tags */}
        {resource.technologies && (
          <div className="flex flex-wrap gap-1 mb-3.5">
            {resource.technologies.split(",").slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/5 text-slate-400"
              >
                {tech.trim()}
              </span>
            ))}
            {resource.technologies.split(",").length > 4 && (
              <span className="text-[10px] font-mono text-slate-500 self-center">
                +{resource.technologies.split(",").length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Links Preview */}
        {resource.links.length > 0 && (
          <div className="mb-4 pt-2.5 border-t border-white/5 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Links ({resource.links.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {resource.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border border-white/10 bg-white/[0.03] hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  {getLinkIcon(link)}
                  <span className="truncate max-w-[130px]">{link.title || link.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 mt-auto">
        <div className="text-[11px] font-mono text-slate-500">
          Pillar {config.stepNumber} · {resource.pillar}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(resource)}
            className="h-8 px-3 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Edit resource"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onDelete(resource)}
            className="h-8 px-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
            title="Remove resource"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </article>
  );
}
