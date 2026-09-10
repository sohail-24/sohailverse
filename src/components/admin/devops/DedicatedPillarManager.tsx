import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Video,
  Image as ImageIcon,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  AlertTriangle,
  Play,
  X,
  Eye,
} from "lucide-react";
import { FaAws } from "react-icons/fa";
import type { PillarResource } from "../../../lib/pillarContent";
import PillarVideoResourceModal from "./PillarVideoResourceModal";
import VideoPlayerModal from "./VideoPlayerModal";
import DeleteConfirmModal from "../DeleteConfirmModal";

interface DedicatedPillarManagerProps {
  pillar: "Networking" | "AWS";
  resources: PillarResource[];
  onBack: () => void;
  onSaveResource: (data: {
    id?: number;
    title: string;
    name: string;
    image_url: string;
    video_url: string;
    pillar: "Networking" | "AWS";
  }) => Promise<void>;
  onDeleteResource: (id: number) => Promise<void>;
}

export default function DedicatedPillarManager({
  pillar,
  resources,
  onBack,
  onSaveResource,
  onDeleteResource,
}: DedicatedPillarManagerProps) {
  const isNetworking = pillar === "Networking";

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<PillarResource | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<PillarResource | null>(null);

  // Video Player Modal
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  // Image Lightbox
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Strictly filter only resources belonging to this pillar
  const pillarResources = useMemo(() => {
    return resources.filter((r) => r.pillar === pillar);
  }, [resources, pillar]);

  // Apply search query
  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return pillarResources;
    const q = searchQuery.toLowerCase().trim();
    return pillarResources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.technologies && r.technologies.toLowerCase().includes(q))
    );
  }, [pillarResources, searchQuery]);

  // Color variables
  const theme = isNetworking
    ? {
        name: "Networking",
        accent: "cyan",
        border: "border-cyan-500/30",
        badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        glow: "shadow-[0_0_30px_rgba(6,182,212,0.15)]",
        btn: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.35)]",
        cardBorder: "border-cyan-500/20 hover:border-cyan-400/50",
        iconText: "text-cyan-400",
        subtitle: "Manage Networking learning resources",
        addText: "+ Add Networking Resource",
      }
    : {
        name: "AWS",
        accent: "orange",
        border: "border-orange-500/30",
        badge: "bg-orange-500/15 text-orange-300 border-orange-500/30",
        glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]",
        btn: "bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-[0_0_20px_rgba(249,115,22,0.35)]",
        cardBorder: "border-orange-500/20 hover:border-orange-400/50",
        iconText: "text-orange-400",
        subtitle: "Manage AWS learning resources",
        addText: "+ Add AWS Resource",
      };

  const handleOpenAdd = () => {
    setEditingResource(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (res: PillarResource) => {
    setEditingResource(res);
    setEditorOpen(true);
  };

  const handleSaveModal = async (data: {
    id?: number;
    title: string;
    name: string;
    image_url: string;
    video_url: string;
  }) => {
    await onSaveResource({
      ...data,
      pillar,
    });
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn text-left">
      {/* 1. TOP NAVIGATION: Back to DevOps */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to DevOps</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>SohailVerse DevOps CMS</span>
          <span className="text-slate-600">/</span>
          <span className={theme.iconText}>{theme.name}</span>
        </div>
      </div>

      {/* 2. DEDICATED PILLAR HEADER */}
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border ${theme.border} bg-slate-900/90 p-5 sm:p-8 backdrop-blur-xl ${theme.glow}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl border flex items-center justify-center ${theme.badge}`}
              >
                {isNetworking ? (
                  <Globe className="h-5 w-5 text-cyan-400" />
                ) : (
                  <FaAws className="h-5 w-5 text-orange-400" />
                )}
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${theme.badge}`}
              >
                {pillar}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                Resources: {pillarResources.length}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase">
              {pillar}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal">
              {theme.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              type="button"
              onClick={handleOpenAdd}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${theme.btn}`}
            >
              <Plus className="h-4 w-4" />
              <span>{theme.addText}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${pillar} resources...`}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. RESOURCE CARDS OR EMPTY STATE */}
      {filteredResources.length === 0 ? (
        /* PART 20: EMPTY STATE */
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/50 p-8 sm:p-14 text-center">
          <div
            className={`mx-auto h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border flex items-center justify-center mb-4 ${theme.badge}`}
          >
            {isNetworking ? (
              <Globe className="h-6 w-6 text-cyan-400" />
            ) : (
              <FaAws className="h-6 w-6 text-orange-400" />
            )}
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
            {pillar}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {searchQuery ? "No matching resources found for this search." : "No resources yet."}
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleOpenAdd}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${theme.btn}`}
            >
              <Plus className="h-4 w-4" />
              <span>{theme.addText}</span>
            </button>
          </div>
        </div>
      ) : (
        /* RESOURCE CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredResources.map((item) => {
            const hasVideo = !!item.video_url && item.video_url.trim().length > 0;
            const hasImage = !!item.image_url && item.image_url.trim().length > 0;

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-slate-900/80 backdrop-blur-xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 ${theme.cardBorder} shadow-lg`}
              >
                <div className="space-y-3.5">
                  {/* Image / Thumbnail Container */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/10">
                    {hasImage ? (
                      <>
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxImage({
                              url: item.image_url,
                              title: item.title,
                            })
                          }
                          className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-slate-950/70 border border-white/15 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="View image"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-1.5 p-4">
                        <ImageIcon className="h-6 w-6 text-slate-500" />
                        <span className="text-[11px] font-mono text-slate-500">
                          No image attached
                        </span>
                      </div>
                    )}

                    {/* Video Indicator on top of image */}
                    {hasVideo && (
                      <div className="absolute bottom-2 left-2">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVideo({
                              url: item.video_url,
                              title: item.title,
                            })
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/90 text-white border border-white/20 text-[11px] font-mono font-semibold backdrop-blur-md hover:bg-white hover:text-slate-950 transition-colors"
                        >
                          <Play className="h-3 w-3 fill-current text-lime-400" />
                          <span>Watch Video</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Name badge */}
                  <div>
                    <span
                      className={`inline-block text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${theme.badge}`}
                    >
                      {item.name || (isNetworking ? "Networking Fundamentals" : "Amazon EC2")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Video URL details */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Video
                        className={`h-3.5 w-3.5 shrink-0 ${
                          hasVideo ? theme.iconText : "text-slate-600"
                        }`}
                      />
                      {hasVideo ? (
                        <span className="font-mono text-[11px] text-slate-300 truncate">
                          Video attached
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-slate-500">
                          No video URL
                        </span>
                      )}
                    </div>

                    {hasVideo && (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVideo({
                            url: item.video_url,
                            title: item.title,
                          })
                        }
                        className={`inline-flex items-center gap-1 text-[11px] font-mono hover:underline ${theme.iconText}`}
                      >
                        <span>Preview Video ↗</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Card Actions: [ Edit ] and [ Remove ] */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-slate-200 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 hover:text-rose-200 transition-colors"
                    title={`Remove ${item.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODALS */}
      {/* Add / Edit Video Resource Modal */}
      <PillarVideoResourceModal
        isOpen={editorOpen}
        pillar={pillar}
        resource={editingResource}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveModal}
        onPreviewVideo={(url, title) => setActiveVideo({ url, title })}
      />

      {/* Delete Confirmation Modal (Part 9) */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || ""}
        resourceType={`${pillar} resource`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await onDeleteResource(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        videoUrl={activeVideo?.url || null}
        title={activeVideo?.title || `${pillar} Video Lesson`}
        onClose={() => setActiveVideo(null)}
      />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-white/20 bg-slate-900 shadow-2xl p-2"
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <span className="font-display text-sm font-bold text-white truncate">
                {lightboxImage.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black rounded-b-xl overflow-hidden max-h-[80vh]">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
