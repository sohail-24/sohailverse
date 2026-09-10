import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  Edit2,
  Video,
  FileText,
  Layers,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  Clock,
  Code2,
} from "lucide-react";
import {
  fetchProjectDetailsById,
  saveProjectContentToDatabase,
  normalizeProjectStatus,
  type FullProjectData,
  type ProjectVideoSession,
  type ProjectDocument,
  type ProjectArchitectureDiagram,
  type ProjectLinkItem,
  type ProjectStatus,
} from "../../lib/projectContent";
import type { UnifiedProject } from "../projects/projectData";

interface ProjectContentManagerModalProps {
  project: UnifiedProject;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export default function ProjectContentManagerModal({
  project,
  isOpen,
  onClose,
  onSaved,
}: ProjectContentManagerModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "videos" | "documents" | "architecture" | "links" | "highlights"
  >("overview");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Full working copy of project data
  const [fullData, setFullData] = useState<FullProjectData | null>(null);

  // Overview Form fields
  const [heroImage, setHeroImage] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [tagline, setTagline] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Ready");
  const [technologiesText, setTechnologiesText] = useState("");

  // Video Sessions State
  const [videos, setVideos] = useState<ProjectVideoSession[]>([]);
  const [videoForm, setVideoForm] = useState<{
    id?: string;
    title: string;
    name: string;
    video_url: string;
    duration: string;
    description: string;
  }>({
    title: "",
    name: "",
    video_url: "",
    duration: "",
    description: "",
  });
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);

  // Documents State
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [docForm, setDocForm] = useState<{
    id?: string;
    title: string;
    type: "pdf" | "readme" | "doc" | "link";
    url: string;
    content: string;
    description: string;
  }>({
    title: "",
    type: "pdf",
    url: "",
    content: "",
    description: "",
  });
  const [editingDocIndex, setEditingDocIndex] = useState<number | null>(null);

  // Architecture Diagrams State
  const [architecture, setArchitecture] = useState<ProjectArchitectureDiagram[]>([]);
  const [archForm, setArchForm] = useState<{
    id?: string;
    title: string;
    image_url: string;
    caption: string;
    description: string;
  }>({
    title: "",
    image_url: "",
    caption: "",
    description: "",
  });
  const [editingArchIndex, setEditingArchIndex] = useState<number | null>(null);

  // Links State
  const [links, setLinks] = useState<ProjectLinkItem[]>([]);
  const [linkForm, setLinkForm] = useState<{
    id?: string;
    title: string;
    url: string;
    type: "github" | "demo" | "docs" | "deploy" | "other";
  }>({
    title: "",
    url: "",
    type: "github",
  });
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  // Highlights State
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlightText, setNewHighlightText] = useState("");

  // Load project details
  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const details = await fetchProjectDetailsById(project.id);
        setFullData(details);

        // Populate fields
        setTitle(details.title);
        setCategory(details.category);
        setDescription(details.description);
        setOverview(details.content.overview || details.description);
        setTagline(details.tagline || "");
        setStatus(details.status);
        setHeroImage(details.hero_image || "");
        setTechnologiesText(details.technologies.join(", "));

        setVideos(details.content.videos || []);
        setDocuments(details.content.documents || []);
        setArchitecture(details.content.architecture || []);
        setLinks(details.content.links || []);
        setHighlights(details.content.highlightsList || []);
      } catch (err: any) {
        console.error("Failed to load project details:", err);
        setError("Failed to load project details for editor.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [project.id, isOpen]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Video Session Handlers
  // -------------------------------------------------------------
  const handleSaveVideo = () => {
    if (!videoForm.title.trim() || !videoForm.video_url.trim()) {
      setError("Video title and Video URL are required.");
      return;
    }

    if (editingVideoIndex !== null) {
      const updated = [...videos];
      updated[editingVideoIndex] = {
        ...updated[editingVideoIndex],
        title: videoForm.title.trim(),
        name: videoForm.name.trim() || undefined,
        video_url: videoForm.video_url.trim(),
        duration: videoForm.duration.trim() || undefined,
        description: videoForm.description.trim() || undefined,
      };
      setVideos(updated);
      setEditingVideoIndex(null);
    } else {
      setVideos([
        ...videos,
        {
          id: `vid-${Date.now()}`,
          title: videoForm.title.trim(),
          name: videoForm.name.trim() || `Session ${String(videos.length + 1).padStart(2, "0")}`,
          video_url: videoForm.video_url.trim(),
          duration: videoForm.duration.trim() || undefined,
          description: videoForm.description.trim() || undefined,
        },
      ]);
    }

    setVideoForm({
      title: "",
      name: "",
      video_url: "",
      duration: "",
      description: "",
    });
    setError(null);
  };

  const handleEditVideo = (idx: number) => {
    const v = videos[idx];
    setVideoForm({
      title: v.title,
      name: v.name || "",
      video_url: v.video_url,
      duration: v.duration || "",
      description: v.description || "",
    });
    setEditingVideoIndex(idx);
  };

  const handleDeleteVideo = (idx: number) => {
    setVideos(videos.filter((_, i) => i !== idx));
    if (editingVideoIndex === idx) {
      setEditingVideoIndex(null);
      setVideoForm({ title: "", name: "", video_url: "", duration: "", description: "" });
    }
  };

  // -------------------------------------------------------------
  // Document Handlers
  // -------------------------------------------------------------
  const handleSaveDoc = () => {
    if (!docForm.title.trim()) {
      setError("Document title is required.");
      return;
    }

    if (editingDocIndex !== null) {
      const updated = [...documents];
      updated[editingDocIndex] = {
        ...updated[editingDocIndex],
        title: docForm.title.trim(),
        type: docForm.type,
        url: docForm.url.trim() || undefined,
        content: docForm.content.trim() || undefined,
        description: docForm.description.trim() || undefined,
      };
      setDocuments(updated);
      setEditingDocIndex(null);
    } else {
      setDocuments([
        ...documents,
        {
          id: `doc-${Date.now()}`,
          title: docForm.title.trim(),
          type: docForm.type,
          url: docForm.url.trim() || undefined,
          content: docForm.content.trim() || undefined,
          description: docForm.description.trim() || undefined,
        },
      ]);
    }

    setDocForm({
      title: "",
      type: "pdf",
      url: "",
      content: "",
      description: "",
    });
    setError(null);
  };

  const handleEditDoc = (idx: number) => {
    const d = documents[idx];
    setDocForm({
      title: d.title,
      type: d.type,
      url: d.url || "",
      content: d.content || "",
      description: d.description || "",
    });
    setEditingDocIndex(idx);
  };

  const handleDeleteDoc = (idx: number) => {
    setDocuments(documents.filter((_, i) => i !== idx));
    if (editingDocIndex === idx) {
      setEditingDocIndex(null);
      setDocForm({ title: "", type: "pdf", url: "", content: "", description: "" });
    }
  };

  // -------------------------------------------------------------
  // Architecture Diagram Handlers
  // -------------------------------------------------------------
  const handleSaveArch = () => {
    if (!archForm.title.trim() || !archForm.image_url.trim()) {
      setError("Diagram title and Image URL are required.");
      return;
    }

    if (editingArchIndex !== null) {
      const updated = [...architecture];
      updated[editingArchIndex] = {
        ...updated[editingArchIndex],
        title: archForm.title.trim(),
        image_url: archForm.image_url.trim(),
        caption: archForm.caption.trim() || undefined,
        description: archForm.description.trim() || undefined,
      };
      setArchitecture(updated);
      setEditingArchIndex(null);
    } else {
      setArchitecture([
        ...architecture,
        {
          id: `arch-${Date.now()}`,
          title: archForm.title.trim(),
          image_url: archForm.image_url.trim(),
          caption: archForm.caption.trim() || undefined,
          description: archForm.description.trim() || undefined,
        },
      ]);
    }

    setArchForm({
      title: "",
      image_url: "",
      caption: "",
      description: "",
    });
    setError(null);
  };

  const handleEditArch = (idx: number) => {
    const a = architecture[idx];
    setArchForm({
      title: a.title,
      image_url: a.image_url,
      caption: a.caption || "",
      description: a.description || "",
    });
    setEditingArchIndex(idx);
  };

  const handleDeleteArch = (idx: number) => {
    setArchitecture(architecture.filter((_, i) => i !== idx));
    if (editingArchIndex === idx) {
      setEditingArchIndex(null);
      setArchForm({ title: "", image_url: "", caption: "", description: "" });
    }
  };

  // -------------------------------------------------------------
  // Link Handlers
  // -------------------------------------------------------------
  const handleSaveLink = () => {
    if (!linkForm.title.trim() || !linkForm.url.trim()) {
      setError("Link title and target URL are required.");
      return;
    }

    if (editingLinkIndex !== null) {
      const updated = [...links];
      updated[editingLinkIndex] = {
        ...updated[editingLinkIndex],
        title: linkForm.title.trim(),
        url: linkForm.url.trim(),
        type: linkForm.type,
      };
      setLinks(updated);
      setEditingLinkIndex(null);
    } else {
      setLinks([
        ...links,
        {
          id: `link-${Date.now()}`,
          title: linkForm.title.trim(),
          url: linkForm.url.trim(),
          type: linkForm.type,
        },
      ]);
    }

    setLinkForm({
      title: "",
      url: "",
      type: "github",
    });
    setError(null);
  };

  const handleEditLink = (idx: number) => {
    const l = links[idx];
    setLinkForm({
      title: l.title,
      url: l.url,
      type: l.type,
    });
    setEditingLinkIndex(idx);
  };

  const handleDeleteLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
    if (editingLinkIndex === idx) {
      setEditingLinkIndex(null);
      setLinkForm({ title: "", url: "", type: "github" });
    }
  };

  // -------------------------------------------------------------
  // Highlights Handlers
  // -------------------------------------------------------------
  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) return;
    setHighlights([...highlights, newHighlightText.trim()]);
    setNewHighlightText("");
  };

  const handleDeleteHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  // -------------------------------------------------------------
  // GLOBAL SAVE TO DATABASE
  // -------------------------------------------------------------
  const handleGlobalSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const parsedTech = technologiesText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const contentPayload = {
        overview: overview.trim(),
        hero_image: heroImage.trim() || undefined,
        videos,
        documents,
        architecture,
        links,
        highlightsList: highlights,
      };

      const primaryGithub = links.find((l) => l.type === "github")?.url || project.githubUrl;

      // Check if project has a numeric DB ID
      if (fullData?.numericId) {
        await saveProjectContentToDatabase(fullData.numericId, {
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          technologies: parsedTech.join(", "),
          status,
          image_url: heroImage.trim(),
          github_url: primaryGithub,
          content: contentPayload,
        });
      } else {
        // Project was static; persist as new DB record
        const res = await fetch("/api/devops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            technologies: parsedTech.join(", "),
            status,
            image_url: heroImage.trim() || "/projects/temporary/sohail-shop-desktop.jpg",
            github_url: primaryGithub || "",
            highlights: JSON.stringify(contentPayload),
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Failed to persist project record.");
        }
      }

      setSuccess("Project content & media saved successfully to database!");
      await onSaved();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Save failed:", err);
      setError(err?.message || "Failed to save project content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-auto rounded-3xl border border-white/10 bg-slate-950 p-5 sm:p-8 text-left shadow-2xl backdrop-blur-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                PROJECT CONTENT & MEDIA MANAGER
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Manage: {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Edit hero images, video sessions, PDF documents, architecture diagrams, and links
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-950/40 text-xs sm:text-sm text-red-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-xs sm:text-sm text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Manager Navigation Tabs */}
        <div className="mt-4 flex gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: "overview", label: "Overview & Meta", icon: Sparkles },
            { id: "videos", label: `Video Sessions (${videos.length})`, icon: Video },
            { id: "documents", label: `Documents (${documents.length})`, icon: FileText },
            { id: "architecture", label: `Architecture (${architecture.length})`, icon: Layers },
            { id: "links", label: `Links (${links.length})`, icon: LinkIcon },
            { id: "highlights", label: `Highlights (${highlights.length})`, icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="mt-4 overflow-y-auto pr-1 flex-1 space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-8 w-8 mx-auto border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-slate-400">Loading project configuration...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Status (Ready, Active, Upcoming)
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="Ready">Ready (Production)</option>
                        <option value="Active">Active (In Development)</option>
                        <option value="Upcoming">Upcoming (Coming Soon)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Hero Image URL
                      </label>
                      <input
                        type="text"
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        placeholder="/projects/temporary/sohail-shop-desktop.jpg"
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Tagline / Catchphrase
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Production-Grade E-Commerce & Multi-Vendor Platform"
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Short Card Description
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Detailed Architectural Overview
                    </label>
                    <textarea
                      rows={4}
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      placeholder="Comprehensive narrative breakdown of the project architecture, deployment specifications, and capabilities..."
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={technologiesText}
                      onChange={(e) => setTechnologiesText(e.target.value)}
                      placeholder="Kubernetes, AWS EKS, Terraform, ArgoCD, Docker"
                      className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO SESSIONS */}
              {activeTab === "videos" && (
                <div className="space-y-6">
                  {/* Form to Add / Edit Video Session */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      <span>
                        {editingVideoIndex !== null
                          ? "Edit Video Session"
                          : "Add New Video Session"}
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Session Title *
                        </label>
                        <input
                          type="text"
                          value={videoForm.title}
                          onChange={(e) =>
                            setVideoForm({ ...videoForm, title: e.target.value })
                          }
                          placeholder="e.g. Multi-Cluster EKS Architecture Walkthrough"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Episode Label
                        </label>
                        <input
                          type="text"
                          value={videoForm.name}
                          onChange={(e) =>
                            setVideoForm({ ...videoForm, name: e.target.value })
                          }
                          placeholder="e.g. Session 01: Core Architecture"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Video Stream URL (YouTube, Vimeo, MP4) *
                        </label>
                        <input
                          type="text"
                          value={videoForm.video_url}
                          onChange={(e) =>
                            setVideoForm({ ...videoForm, video_url: e.target.value })
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={videoForm.duration}
                          onChange={(e) =>
                            setVideoForm({ ...videoForm, duration: e.target.value })
                          }
                          placeholder="e.g. 14:20"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Session Summary / Key Topics
                      </label>
                      <textarea
                        rows={2}
                        value={videoForm.description}
                        onChange={(e) =>
                          setVideoForm({ ...videoForm, description: e.target.value })
                        }
                        placeholder="Key takeaways and architectural details covered in this session..."
                        className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      {editingVideoIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVideoIndex(null);
                            setVideoForm({
                              title: "",
                              name: "",
                              video_url: "",
                              duration: "",
                              description: "",
                            });
                          }}
                          className="px-3 py-1 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveVideo}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-sm"
                      >
                        {editingVideoIndex !== null ? "Update Session" : "Add Session"}
                      </button>
                    </div>
                  </div>

                  {/* Video Sessions List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Configured Video Sessions ({videos.length})
                    </h4>

                    {videos.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-white/10 rounded-xl">
                        No video sessions configured for this project yet.
                      </p>
                    ) : (
                      videos.map((vid, idx) => (
                        <div
                          key={vid.id || idx}
                          className="p-3 rounded-xl border border-white/10 bg-slate-900/40 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="text-emerald-400 font-semibold">
                                {vid.name || `Session ${idx + 1}`}
                              </span>
                              {vid.duration && (
                                <span className="text-slate-400">⏱ {vid.duration}</span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-white truncate">
                              {vid.title}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400 truncate">
                              {vid.video_url}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditVideo(idx)}
                              className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(idx)}
                              className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  {/* Form to Add / Edit Document */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      <span>
                        {editingDocIndex !== null ? "Edit Document" : "Add New Document"}
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Document Title *
                        </label>
                        <input
                          type="text"
                          value={docForm.title}
                          onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                          placeholder="e.g. Production Deployment Runbook & Architecture PDF"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Document Type
                        </label>
                        <select
                          value={docForm.type}
                          onChange={(e) =>
                            setDocForm({ ...docForm, type: e.target.value as any })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        >
                          <option value="pdf">PDF Document</option>
                          <option value="readme">README / Runbook</option>
                          <option value="doc">Engineering Doc</option>
                          <option value="link">External Link</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Document URL (or PDF path)
                      </label>
                      <input
                        type="text"
                        value={docForm.url}
                        onChange={(e) => setDocForm({ ...docForm, url: e.target.value })}
                        placeholder="e.g. /resume.pdf or https://..."
                        className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    {docForm.type === "readme" && (
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Markdown Content
                        </label>
                        <textarea
                          rows={4}
                          value={docForm.content}
                          onChange={(e) =>
                            setDocForm({ ...docForm, content: e.target.value })
                          }
                          placeholder="# Deployment Guidelines..."
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={docForm.description}
                        onChange={(e) =>
                          setDocForm({ ...docForm, description: e.target.value })
                        }
                        placeholder="Summary of document purpose and contents..."
                        className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      {editingDocIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDocIndex(null);
                            setDocForm({
                              title: "",
                              type: "pdf",
                              url: "",
                              content: "",
                              description: "",
                            });
                          }}
                          className="px-3 py-1 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveDoc}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-sm"
                      >
                        {editingDocIndex !== null ? "Update Document" : "Add Document"}
                      </button>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Configured Documents ({documents.length})
                    </h4>

                    {documents.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-white/10 rounded-xl">
                        No documentation attachments configured yet.
                      </p>
                    ) : (
                      documents.map((doc, idx) => (
                        <div
                          key={doc.id || idx}
                          className="p-3 rounded-xl border border-white/10 bg-slate-900/40 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="text-emerald-400 font-semibold uppercase">
                                {doc.type}
                              </span>
                              {doc.url && (
                                <span className="text-slate-400 truncate">{doc.url}</span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-white truncate">
                              {doc.title}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditDoc(idx)}
                              className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(idx)}
                              className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ARCHITECTURE DIAGRAMS */}
              {activeTab === "architecture" && (
                <div className="space-y-6">
                  {/* Form to Add / Edit Diagram */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      <span>
                        {editingArchIndex !== null ? "Edit Diagram" : "Add Architecture Diagram"}
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Diagram Title *
                        </label>
                        <input
                          type="text"
                          value={archForm.title}
                          onChange={(e) =>
                            setArchForm({ ...archForm, title: e.target.value })
                          }
                          placeholder="e.g. AWS Multi-AZ VPC & EKS Topology"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Diagram Image URL *
                        </label>
                        <input
                          type="text"
                          value={archForm.image_url}
                          onChange={(e) =>
                            setArchForm({ ...archForm, image_url: e.target.value })
                          }
                          placeholder="/projects/temporary/sohail-shop-desktop.jpg"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Caption / Explanation
                      </label>
                      <textarea
                        rows={2}
                        value={archForm.caption}
                        onChange={(e) =>
                          setArchForm({ ...archForm, caption: e.target.value })
                        }
                        placeholder="Description of VPC subnets, ingress load balancers, and multi-AZ failover..."
                        className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      {editingArchIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArchIndex(null);
                            setArchForm({
                              title: "",
                              image_url: "",
                              caption: "",
                              description: "",
                            });
                          }}
                          className="px-3 py-1 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveArch}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-sm"
                      >
                        {editingArchIndex !== null ? "Update Diagram" : "Add Diagram"}
                      </button>
                    </div>
                  </div>

                  {/* Diagrams List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Configured Diagrams ({architecture.length})
                    </h4>

                    {architecture.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-white/10 rounded-xl">
                        No architecture diagrams configured yet.
                      </p>
                    ) : (
                      architecture.map((arch, idx) => (
                        <div
                          key={arch.id || idx}
                          className="p-3 rounded-xl border border-white/10 bg-slate-900/40 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-14 rounded-lg bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                              <img
                                src={arch.image_url}
                                alt={arch.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-white truncate">
                                {arch.title}
                              </p>
                              <p className="text-[11px] font-mono text-slate-400 truncate">
                                {arch.caption || arch.image_url}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditArch(idx)}
                              className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArch(idx)}
                              className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: LINKS */}
              {activeTab === "links" && (
                <div className="space-y-6">
                  {/* Form to Add / Edit Link */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      <span>{editingLinkIndex !== null ? "Edit Link" : "Add Project Link"}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Link Title *
                        </label>
                        <input
                          type="text"
                          value={linkForm.title}
                          onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                          placeholder="e.g. GitHub Repository, Live Storefront"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Link Type
                        </label>
                        <select
                          value={linkForm.type}
                          onChange={(e) =>
                            setLinkForm({ ...linkForm, type: e.target.value as any })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                        >
                          <option value="github">GitHub</option>
                          <option value="demo">Live Demo</option>
                          <option value="docs">Documentation</option>
                          <option value="deploy">Infrastructure</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        URL *
                      </label>
                      <input
                        type="text"
                        value={linkForm.url}
                        onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      {editingLinkIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLinkIndex(null);
                            setLinkForm({ title: "", url: "", type: "github" });
                          }}
                          className="px-3 py-1 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveLink}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-sm"
                      >
                        {editingLinkIndex !== null ? "Update Link" : "Add Link"}
                      </button>
                    </div>
                  </div>

                  {/* Links List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Configured Links ({links.length})
                    </h4>

                    {links.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-white/10 rounded-xl">
                        No external links configured yet.
                      </p>
                    ) : (
                      links.map((link, idx) => (
                        <div
                          key={link.id || idx}
                          className="p-3 rounded-xl border border-white/10 bg-slate-900/40 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                              {link.type}
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-white truncate">
                              {link.title}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400 truncate">
                              {link.url}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleEditLink(idx)}
                              className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(idx)}
                              className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: HIGHLIGHTS */}
              {activeTab === "highlights" && (
                <div className="space-y-6">
                  {/* Add Highlight Input */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Key Takeaway / Highlight</span>
                    </h4>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newHighlightText}
                        onChange={(e) => setNewHighlightText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddHighlight();
                          }
                        }}
                        placeholder="e.g. Zero-downtime rolling deployments managed declaratively with ArgoCD"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-sm shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Key Highlights List ({highlights.length})
                    </h4>

                    {highlights.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-white/10 rounded-xl">
                        No highlight bullet points added yet.
                      </p>
                    ) : (
                      highlights.map((h, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-white/10 bg-slate-900/40 flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-200"
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{h}</span>
                          </div>

                          <button
                            onClick={() => handleDeleteHighlight(idx)}
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/30 shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleGlobalSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving to Database..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
