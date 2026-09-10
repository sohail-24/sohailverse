import { useState, useMemo, useCallback } from "react";
import {
  Terminal,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";
import type { DevOpsPost } from "./AuthenticatedCMS";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ResourceCard from "./devops/ResourceCard";
import ResourceEditorModal from "./devops/ResourceEditorModal";
import PillarHeader from "./devops/PillarHeader";
import VideoPlayerModal from "./devops/VideoPlayerModal";
import NoteReaderModal from "./devops/NoteReaderModal";
import ImageLightboxModal from "./devops/ImageLightboxModal";
import DedicatedPillarManager from "./devops/DedicatedPillarManager";
import {
  LearningPillar,
  PillarResource,
  parsePillarResource,
  serializePillarResource,
} from "../../lib/pillarContent";

interface DevOpsManagerProps {
  devops: DevOpsPost[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

export default function DevOpsManager({
  devops,
  isLoading,
  onRefresh,
}: DevOpsManagerProps) {
  // Navigation & Filter states
  const [activePillar, setActivePillar] = useState<LearningPillar | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<PillarResource | null>(null);
  const [deletingResource, setDeletingResource] = useState<PillarResource | null>(null);
  const [preselectedPillar, setPreselectedPillar] = useState<LearningPillar>("DevOps");

  // Viewers (Video player, Note reader, Image lightbox)
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [readingResource, setReadingResource] = useState<PillarResource | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Status feedback
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Convert raw devops posts into clean PillarResource items
  const parsedResources: PillarResource[] = useMemo(() => {
    return devops.map((item) => parsePillarResource(item));
  }, [devops]);

  // Pillar counts
  const pillarCounts = useMemo(() => {
    const counts: Record<LearningPillar | "all", number> = {
      all: parsedResources.length,
      Notes: 0,
      Networking: 0,
      AWS: 0,
      DevOps: 0,
      "Learn & Test Projects": 0,
    };
    parsedResources.forEach((res) => {
      if (counts[res.pillar] !== undefined) {
        counts[res.pillar] += 1;
      }
    });
    return counts;
  }, [parsedResources]);

  // Unique statuses for filter dropdown
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    parsedResources.forEach((r) => {
      if (r.status && r.status.trim()) {
        set.add(r.status.trim());
      }
    });
    return Array.from(set).sort();
  }, [parsedResources]);

  // Filtered resources based on pillar, search, and status
  const filteredResources = useMemo(() => {
    return parsedResources.filter((res) => {
      // 1. Pillar filter
      if (activePillar !== "all" && res.pillar !== activePillar) {
        return false;
      }

      // 2. Status filter
      if (selectedStatus !== "all" && res.status !== selectedStatus) {
        return false;
      }

      // 3. Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q);
        const matchesTech = res.technologies.toLowerCase().includes(q);
        const matchesTakeaways = res.highlights.toLowerCase().includes(q);
        const matchesLinks = res.links.some(
          (l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
        );
        return matchesTitle || matchesDesc || matchesTech || matchesTakeaways || matchesLinks;
      }

      return true;
    });
  }, [parsedResources, activePillar, selectedStatus, searchTerm]);

  // Trigger Add Modal
  const handleAddNew = (pillar?: LearningPillar) => {
    setEditingResource(null);
    setPreselectedPillar(pillar || (activePillar === "all" ? "DevOps" : activePillar));
    setIsEditorOpen(true);
  };

  // Trigger Edit Modal
  const handleEdit = (resource: PillarResource) => {
    setEditingResource(resource);
    setPreselectedPillar(resource.pillar);
    setIsEditorOpen(true);
  };

  // Trigger Delete Confirmation
  const handleDeletePrompt = (resource: PillarResource) => {
    setDeletingResource(resource);
  };

  // Save (Create or Update)
  const handleSaveResource = async (data: any) => {
    const isUpdating = !!data.id;
    const url = isUpdating ? `/api/devops/${data.id}` : "/api/devops";
    const method = isUpdating ? "PUT" : "POST";

    const payload = serializePillarResource(data);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || `Failed to ${isUpdating ? "update" : "create"} resource.`);
    }

    showFeedback(
      "success",
      `✅ Successfully ${isUpdating ? "updated" : "added"} "${data.title}" in ${data.pillar}.`
    );
    await onRefresh();
  };

  // Execute Deletion
  const handleConfirmDelete = async () => {
    if (!deletingResource) return;
    try {
      const res = await fetch(`/api/devops/${deletingResource.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete resource.");
      }
      showFeedback("success", `✅ Removed "${deletingResource.title}" from ${deletingResource.pillar}.`);
      setDeletingResource(null);
      await onRefresh();
    } catch (err: any) {
      showFeedback("error", `❌ Error deleting: ${err?.message || "Unknown error"}`);
    }
  };

  // Dedicated Pillar Save handler (Networking / AWS)
  const handleSaveDedicatedResource = async (data: {
    id?: number;
    title: string;
    name: string;
    image_url: string;
    video_url: string;
    pillar: "Networking" | "AWS";
  }) => {
    await handleSaveResource({
      id: data.id,
      title: data.title,
      name: data.name,
      pillar: data.pillar,
      category: data.pillar,
      image_url: data.image_url,
      video_url: data.video_url,
    });
  };

  // Dedicated Pillar Delete handler (Networking / AWS)
  const handleDeleteDedicatedResource = async (id: number) => {
    const res = await fetch(`/api/devops/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || "Failed to delete resource.");
    }
    showFeedback("success", "✅ Resource removed successfully.");
    await onRefresh();
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner feedback */}
      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 backdrop-blur-md animate-fadeIn ${
            feedback.type === "success"
              ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-200"
              : "border-rose-500/30 bg-rose-950/40 text-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {activePillar === "Networking" || activePillar === "AWS" ? (
        <DedicatedPillarManager
          pillar={activePillar}
          resources={parsedResources}
          onBack={() => setActivePillar("all")}
          onSaveResource={handleSaveDedicatedResource}
          onDeleteResource={handleDeleteDedicatedResource}
        />
      ) : (
        <>
          {/* 5-Pillar Navigation & Header */}
          <PillarHeader
            activePillar={activePillar}
            onSelectPillar={setActivePillar}
            pillarCounts={pillarCounts}
            onAddNew={handleAddNew}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statusOptions={statusOptions}
          />

          {/* Grid of Resource Cards */}
          {isLoading ? (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-950/50">
              <RefreshCw className="h-8 w-8 text-sky-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-400">Loading resources from database...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur">
              <Layers className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No resources found</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                {searchTerm
                  ? `No resources matched your search query "${searchTerm}". Try resetting search or filters.`
                  : activePillar !== "all"
                  ? `No resources yet in the "${activePillar}" pillar. Click "Add to ${activePillar}" to create one.`
                  : "No resources found in the database. Click 'Add to Hub' to create the first resource."}
              </p>
              <button
                type="button"
                onClick={() => handleAddNew(activePillar === "all" ? "DevOps" : activePillar)}
                className="mt-5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Resource to {activePillar === "all" ? "Hub" : activePillar}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {filteredResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  onEdit={handleEdit}
                  onDelete={handleDeletePrompt}
                  onWatchVideo={(url, title) => setActiveVideo({ url, title })}
                  onReadNotes={(r) => setReadingResource(r)}
                  onViewImage={(url, title) => setLightboxImage({ url, title })}
                />
              ))}
            </div>
          )}

          {/* Editor Modal (Add / Edit) */}
          <ResourceEditorModal
            isOpen={isEditorOpen}
            resource={editingResource}
            defaultPillar={preselectedPillar}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSaveResource}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={!!deletingResource}
            itemName={deletingResource?.title || ""}
            itemType={`[${deletingResource?.pillar || "DevOps"}] Resource`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingResource(null)}
          />

          {/* Video Player Modal */}
          <VideoPlayerModal
            videoUrl={activeVideo?.url || null}
            title={activeVideo?.title || ""}
            onClose={() => setActiveVideo(null)}
          />

          {/* Note Reader Modal */}
          <NoteReaderModal
            resource={readingResource}
            onClose={() => setReadingResource(null)}
            onWatchVideo={(url, title) => setActiveVideo({ url, title })}
          />

          {/* Image Lightbox Modal */}
          <ImageLightboxModal
            imageUrl={lightboxImage?.url || null}
            title={lightboxImage?.title || ""}
            onClose={() => setLightboxImage(null)}
          />
        </>
      )}
    </div>
  );
}
