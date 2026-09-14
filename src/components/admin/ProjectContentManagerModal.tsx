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
  Download,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
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
  type ProjectDetailVisibility,
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
    | "overview"
    | "gallery"
    | "resources"
    | "videos"
    | "documents"
    | "architecture"
    | "links"
    | "highlights"
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

  // Gallery Images State (Up to 5 slots: url + enabled switch)
  const [galleryImages, setGalleryImages] = useState<string[]>(["", "", "", "", ""]);
  const [galleryEnabled, setGalleryEnabled] = useState<boolean[]>([true, true, false, false, false]);

  // Project Resources (Optional) & Switches
  const [gitUrl, setGitUrl] = useState("");
  const [gitEnabled, setGitEnabled] = useState(true);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteEnabled, setWebsiteEnabled] = useState(true);

  const [videoUrl, setVideoUrl] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(false);

  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfEnabled, setPdfEnabled] = useState(false);

  const [documentationUrl, setDocumentationUrl] = useState("");
  const [docContentText, setDocContentText] = useState("");
  const [docEnabled, setDocEnabled] = useState(false);

  // Optional Section Visibility Flags
  const [videoSessionsEnabled, setVideoSessionsEnabled] = useState(false);
  const [architectureEnabled, setArchitectureEnabled] = useState(false);

  // Presentation Flows
  const [implementedFeatures, setImplementedFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [businessFlow, setBusinessFlow] = useState("");
  const [paymentSecurity, setPaymentSecurity] = useState("");
  const [orderDataPreservation, setOrderDataPreservation] = useState("");

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

        // Populate gallery (up to 5 slots)
        const incomingGallery = details.content.gallery_images || [];
        const initialGallery: string[] = [
          incomingGallery[0] || details.hero_image || "",
          incomingGallery[1] || "",
          incomingGallery[2] || "",
          incomingGallery[3] || "",
          incomingGallery[4] || "",
        ];

        // Populate visibility toggles and slots from projectDetail
        const pd = details.content.projectDetail;
        if (pd) {
          const imgs = [
            pd.images?.image1?.url ?? initialGallery[0] ?? "",
            pd.images?.image2?.url ?? initialGallery[1] ?? "",
            pd.images?.image3?.url ?? initialGallery[2] ?? "",
            pd.images?.image4?.url ?? initialGallery[3] ?? "",
            pd.images?.image5?.url ?? initialGallery[4] ?? "",
          ];
          const enabledImgs = [
            pd.images?.image1?.enabled ?? Boolean(imgs[0]),
            pd.images?.image2?.enabled ?? Boolean(imgs[1]),
            pd.images?.image3?.enabled ?? false,
            pd.images?.image4?.enabled ?? false,
            pd.images?.image5?.enabled ?? false,
          ];
          setGalleryImages(imgs);
          setGalleryEnabled(enabledImgs);

          setGitUrl(pd.gitRepository?.url || details.content.git_url || details.githubUrl || "");
          setGitEnabled(pd.gitRepository?.enabled ?? Boolean(details.content.git_url || details.githubUrl));

          setWebsiteUrl(pd.website?.url || details.content.website_url || details.liveUrl || "");
          setWebsiteEnabled(pd.website?.enabled ?? Boolean(details.content.website_url || details.liveUrl));

          setVideoUrl(pd.video?.url || details.content.video_url || "");
          setVideoEnabled(pd.video?.enabled ?? false);

          setPdfUrl(pd.pdf?.url || details.content.pdf_url || "");
          setPdfEnabled(pd.pdf?.enabled ?? false);

          setDocumentationUrl(pd.documentation?.url || details.content.documentation_url || "");
          setDocContentText(pd.documentation?.content || details.content.documentation_content || "");
          setDocEnabled(pd.documentation?.enabled ?? false);

          setVideoSessionsEnabled(pd.videoSessions?.enabled ?? false);
          setArchitectureEnabled(pd.architecture?.enabled ?? false);
        } else {
          setGalleryImages(initialGallery);
          setGalleryEnabled([
            Boolean(initialGallery[0]),
            Boolean(initialGallery[1]),
            Boolean(initialGallery[2]),
            Boolean(initialGallery[3]),
            Boolean(initialGallery[4]),
          ]);
          setGitUrl(details.content.git_url || details.githubUrl || "");
          setGitEnabled(Boolean(details.content.git_url || details.githubUrl));
          setWebsiteUrl(details.content.website_url || details.liveUrl || "");
          setWebsiteEnabled(Boolean(details.content.website_url || details.liveUrl));
          setVideoUrl(details.content.video_url || "");
          setVideoEnabled(Boolean(details.content.video_url));
          setPdfUrl(details.content.pdf_url || "");
          setPdfEnabled(Boolean(details.content.pdf_url));
          setDocumentationUrl(details.content.documentation_url || "");
          setDocContentText(details.content.documentation_content || "");
          setDocEnabled(Boolean(details.content.documentation_url || details.content.documentation_content));
          setVideoSessionsEnabled(details.content.videos?.length > 0);
          setArchitectureEnabled(details.content.architecture?.length > 0);
        }

        setImplementedFeatures(
          details.content.implemented_features && details.content.implemented_features.length > 0
            ? details.content.implemented_features
            : details.content.highlightsList || []
        );
        setBusinessFlow(details.content.business_flow || "");
        setPaymentSecurity(details.content.payment_security || "");
        setOrderDataPreservation(details.content.order_data_preservation || "");

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
  // Feature Handlers
  // -------------------------------------------------------------
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setImplementedFeatures([...implementedFeatures, newFeatureText.trim()]);
    setNewFeatureText("");
  };

  const handleDeleteFeature = (idx: number) => {
    setImplementedFeatures(implementedFeatures.filter((_, i) => i !== idx));
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

      const cleanedGallery = galleryImages
        .map((img) => img.trim())
        .filter(Boolean)
        .slice(0, 5);

      const effectiveHeroImage = cleanedGallery[0] || heroImage.trim() || undefined;

      const detailPayload: ProjectDetailVisibility = {
        images: {
          image1: { url: galleryImages[0]?.trim() || heroImage.trim(), enabled: galleryEnabled[0] },
          image2: { url: galleryImages[1]?.trim() || "", enabled: galleryEnabled[1] },
          image3: { url: galleryImages[2]?.trim() || "", enabled: galleryEnabled[2] },
          image4: { url: galleryImages[3]?.trim() || "", enabled: galleryEnabled[3] },
          image5: { url: galleryImages[4]?.trim() || "", enabled: galleryEnabled[4] },
        },
        gitRepository: {
          url: gitUrl.trim(),
          enabled: gitEnabled,
        },
        website: {
          url: websiteUrl.trim(),
          enabled: websiteEnabled,
        },
        video: {
          url: videoUrl.trim(),
          enabled: videoEnabled,
        },
        pdf: {
          url: pdfUrl.trim(),
          enabled: pdfEnabled,
        },
        documentation: {
          url: documentationUrl.trim(),
          content: docContentText.trim() || undefined,
          enabled: docEnabled,
        },
        videoSessions: {
          enabled: videoSessionsEnabled,
        },
        architecture: {
          enabled: architectureEnabled,
        },
      };

      const contentPayload = {
        overview: overview.trim(),
        tagline: tagline.trim() || undefined,
        hero_image: effectiveHeroImage,
        gallery_images: cleanedGallery,
        git_url: gitUrl.trim() || undefined,
        website_url: websiteUrl.trim() || undefined,
        video_url: videoUrl.trim() || undefined,
        pdf_url: pdfUrl.trim() || undefined,
        documentation_url: documentationUrl.trim() || undefined,
        documentation_content: docContentText.trim() || undefined,
        implemented_features: implementedFeatures,
        business_flow: businessFlow.trim() || undefined,
        payment_security: paymentSecurity.trim() || undefined,
        order_data_preservation: orderDataPreservation.trim() || undefined,
        videos,
        documents,
        architecture,
        links,
        highlightsList: highlights,
        projectDetail: detailPayload,
      };

      const primaryGithub =
        gitEnabled && gitUrl.trim()
          ? gitUrl.trim()
          : (gitEnabled && links.find((l) => l.type === "github")?.url) || "";

      // Check if project has a numeric DB ID
      if (fullData?.numericId) {
        const coreUpdates = {
          title: title.trim() !== fullData.title ? title.trim() : undefined,
          category: category.trim() !== fullData.category ? category.trim() : undefined,
          description: description.trim() !== fullData.description ? description.trim() : undefined,
          technologies:
            parsedTech.join(", ") !== fullData.technologies.join(", ")
              ? parsedTech.join(", ")
              : undefined,
          status: status !== fullData.status ? status : undefined,
          image_url:
            effectiveHeroImage && effectiveHeroImage !== fullData.hero_image
              ? effectiveHeroImage
              : undefined,
          github_url:
            primaryGithub !== (fullData.githubUrl || "") ? primaryGithub : undefined,
        };

        await saveProjectContentToDatabase(fullData.numericId, {
          ...coreUpdates,
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
            image_url: effectiveHeroImage || heroImage.trim() || "/projects/temporary/sohail-shop-desktop.v2.jpg",
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

  const getLiveStatusBadge = (enabled: boolean, hasData: boolean) => {
    if (enabled && hasData) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="h-3 w-3" />
          <span>PUBLICLY VISIBLE</span>
        </span>
      );
    }
    if (!enabled) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-400 border border-white/10">
          <span>HIDDEN (SWITCH OFF)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <AlertCircle className="h-3 w-3" />
        <span>HIDDEN (NO DATA)</span>
      </span>
    );
  };

  const ToggleSwitch = ({
    checked,
    onChange,
    id,
    size = "md",
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    id?: string;
    size?: "sm" | "md";
  }) => {
    const isSm = size === "sm";
    return (
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isSm ? "h-5 w-9" : "h-6 w-11"
        } ${checked ? "bg-emerald-500" : "bg-slate-700"}`}
      >
        <span
          className={`pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isSm
              ? `h-4 w-4 ${checked ? "translate-x-4" : "translate-x-0"}`
              : `h-5 w-5 ${checked ? "translate-x-5" : "translate-x-0"}`
          }`}
        />
      </button>
    );
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
            {
              id: "gallery",
              label: `Gallery (${galleryImages.filter(Boolean).length}/5)`,
              icon: ImageIcon,
            },
            { id: "resources", label: "Resources & Flows", icon: ExternalLink },
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
                        placeholder="/projects/temporary/sohail-shop-desktop.v2.jpg"
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

              {/* TAB: PROJECT GALLERY (1-5 IMAGES) */}
              {activeTab === "gallery" && (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-emerald-400" />
                      <span>Project Presentation Gallery (Up to 5 Images)</span>
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Configure between 1 and 5 project images. Each image slot has an explicit <span className="text-emerald-400 font-semibold">ENABLE / DISABLE</span> switch.
                      The public Project Detail page will display an image <strong className="text-slate-200">ONLY</strong> if its switch is ENABLED and a valid image URL is configured.
                      Disabled slots and empty slots are never rendered.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[0, 1, 2, 3, 4].map((slotIdx) => {
                      const imgVal = galleryImages[slotIdx] || "";
                      const isEnabled = galleryEnabled[slotIdx];
                      const isHero = slotIdx === 0;
                      return (
                        <div
                          key={slotIdx}
                          className={`p-4 rounded-2xl border transition-all ${
                            isEnabled
                              ? "border-white/10 bg-slate-900/40"
                              : "border-white/5 bg-slate-950/40 opacity-70"
                          } space-y-3`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center justify-center font-bold">
                                {slotIdx + 1}
                              </span>
                              <span className="text-xs font-mono font-medium text-slate-300">
                                {isHero ? "Primary Hero Image (Image 1) *" : `Gallery Image ${slotIdx + 1}`}
                              </span>
                              {getLiveStatusBadge(isEnabled, Boolean(imgVal.trim()))}
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Enable / Disable switch */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono text-slate-400">
                                  {isEnabled ? "Enabled" : "Disabled"}
                                </span>
                                <ToggleSwitch
                                  id={`toggle-gallery-${slotIdx + 1}`}
                                  checked={isEnabled}
                                  onChange={(val) => {
                                    const next = [...galleryEnabled];
                                    next[slotIdx] = val;
                                    setGalleryEnabled(next);
                                  }}
                                  size="sm"
                                />
                              </div>

                              {imgVal && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...galleryImages];
                                    updated[slotIdx] = "";
                                    setGalleryImages(updated);
                                  }}
                                  className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span>Clear</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 items-start">
                            <div className="flex-1 w-full space-y-2">
                              <input
                                type="text"
                                value={imgVal}
                                onChange={(e) => {
                                  const updated = [...galleryImages];
                                  updated[slotIdx] = e.target.value;
                                  setGalleryImages(updated);
                                  if (isHero) {
                                    setHeroImage(e.target.value);
                                  }
                                }}
                                placeholder={
                                  isHero
                                    ? "/projects/temporary/fresh-flow-desktop.v2.jpg or https://..."
                                    : "Image URL (leave empty if not needed)"
                                }
                                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                              />
                              <div className="flex gap-2 text-[10px] font-mono text-slate-500">
                                <span>Preview:</span>
                                {imgVal ? (
                                  <span className="text-emerald-400 truncate max-w-xs">{imgVal}</span>
                                ) : (
                                  <span>No image configured</span>
                                )}
                              </div>
                            </div>

                            {imgVal && (
                              <div className="shrink-0 w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                                <img
                                  src={imgVal}
                                  alt={`Slot ${slotIdx + 1} preview`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "/projects/temporary/fresh-flow-desktop.v2.jpg";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: RESOURCES & PRESENTATION FLOWS */}
              {activeTab === "resources" && (
                <div className="space-y-6">
                  {/* Section: Project Resources */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-emerald-400" />
                        <span>Optional Project Resources (Live Page Buttons)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Each resource requires <strong className="text-slate-200">BOTH</strong> an active data/URL <strong className="text-slate-200">AND</strong> the Admin switch set to <span className="text-emerald-400 font-mono">ENABLED</span> to appear on the public Project Detail page. If the switch is OFF, the button is completely hidden from public view.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Git Repository Card */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        gitEnabled ? "border-white/10 bg-slate-950/60" : "border-white/5 bg-slate-950/30 opacity-70"
                      } space-y-2`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <FaGithub className="h-4 w-4 text-slate-300" />
                            <span className="text-xs font-mono font-medium text-slate-200">Git Repository Button</span>
                            {getLiveStatusBadge(gitEnabled, Boolean(gitUrl.trim()))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">{gitEnabled ? "Enabled" : "Disabled"}</span>
                            <ToggleSwitch
                              id="toggle-git-repo"
                              checked={gitEnabled}
                              onChange={setGitEnabled}
                              size="sm"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={gitUrl}
                          onChange={(e) => setGitUrl(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                        />
                      </div>

                      {/* Website / Live URL Card */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        websiteEnabled ? "border-white/10 bg-slate-950/60" : "border-white/5 bg-slate-950/30 opacity-70"
                      } space-y-2`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-cyan-400" />
                            <span className="text-xs font-mono font-medium text-slate-200">Website / Live URL Button</span>
                            {getLiveStatusBadge(websiteEnabled, Boolean(websiteUrl.trim()))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">{websiteEnabled ? "Enabled" : "Disabled"}</span>
                            <ToggleSwitch
                              id="toggle-website"
                              checked={websiteEnabled}
                              onChange={setWebsiteEnabled}
                              size="sm"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://amfruits.com or demo link"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                        />
                      </div>

                      {/* Video Walkthrough Card */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        videoEnabled ? "border-white/10 bg-slate-950/60" : "border-white/5 bg-slate-950/30 opacity-70"
                      } space-y-2`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-rose-400" />
                            <span className="text-xs font-mono font-medium text-slate-200">Video Walkthrough Button</span>
                            {getLiveStatusBadge(videoEnabled, Boolean(videoUrl.trim()))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">{videoEnabled ? "Enabled" : "Disabled"}</span>
                            <ToggleSwitch
                              id="toggle-video"
                              checked={videoEnabled}
                              onChange={setVideoEnabled}
                              size="sm"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... or direct MP4 URL"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                        />
                      </div>

                      {/* PDF Document Card */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        pdfEnabled ? "border-white/10 bg-slate-950/60" : "border-white/5 bg-slate-950/30 opacity-70"
                      } space-y-2`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-mono font-medium text-slate-200">PDF Document Button</span>
                            {getLiveStatusBadge(pdfEnabled, Boolean(pdfUrl.trim()))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">{pdfEnabled ? "Enabled" : "Disabled"}</span>
                            <ToggleSwitch
                              id="toggle-pdf"
                              checked={pdfEnabled}
                              onChange={setPdfEnabled}
                              size="sm"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={pdfUrl}
                          onChange={(e) => setPdfUrl(e.target.value)}
                          placeholder="/resume.pdf or PDF document URL"
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                        />
                      </div>

                      {/* Documentation Card */}
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        docEnabled ? "border-white/10 bg-slate-950/60" : "border-white/5 bg-slate-950/30 opacity-70"
                      } space-y-3`}>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-400" />
                            <span className="text-xs font-mono font-medium text-slate-200">Documentation Button & Section</span>
                            {getLiveStatusBadge(docEnabled, Boolean(documentationUrl.trim() || docContentText.trim()))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-slate-400">{docEnabled ? "Enabled" : "Disabled"}</span>
                            <ToggleSwitch
                              id="toggle-documentation"
                              checked={docEnabled}
                              onChange={setDocEnabled}
                              size="sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono text-slate-400">Documentation External URL</label>
                          <input
                            type="text"
                            value={documentationUrl}
                            onChange={(e) => setDocumentationUrl(e.target.value)}
                            placeholder="https://... or documentation link"
                            className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono text-slate-400">Documentation Content (Markdown / Text)</label>
                          <textarea
                            rows={3}
                            value={docContentText}
                            onChange={(e) => setDocContentText(e.target.value)}
                            placeholder="# Project Documentation..."
                            className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Implemented Features */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 space-y-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Implemented Features</span>
                    </h3>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        placeholder="e.g. Real-time product inventory updates"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                      </button>
                    </div>

                    {implementedFeatures.length > 0 && (
                      <div className="space-y-2 pt-2">
                        {implementedFeatures.map((feat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/5 bg-slate-950 text-xs sm:text-sm text-slate-200"
                          >
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>{feat}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(idx)}
                              className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section: Narrative Presentation Content */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Important Business Flow (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={businessFlow}
                        onChange={(e) => setBusinessFlow(e.target.value)}
                        placeholder="Practical description of the customer ordering and fulfillment workflow..."
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Payment System & Security (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={paymentSecurity}
                        onChange={(e) => setPaymentSecurity(e.target.value)}
                        placeholder="Explanation of payment handling, verification, and transaction protection..."
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Order Data / Historical Records (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={orderDataPreservation}
                        onChange={(e) => setOrderDataPreservation(e.target.value)}
                        placeholder="Explanation of order history preservation, customer record integrity, and receipts..."
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEO SESSIONS */}
              {activeTab === "videos" && (
                <div className="space-y-6">
                  {/* Master Section Toggle */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    videoSessionsEnabled ? "border-white/10 bg-slate-900/60" : "border-white/5 bg-slate-950/40 opacity-75"
                  } flex items-center justify-between gap-3 flex-wrap`}>
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Video className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-white">Video Sessions Section Public Visibility</span>
                        {getLiveStatusBadge(videoSessionsEnabled, videos.length > 0 && videos.some((v) => Boolean(v.video_url?.trim())))}
                      </div>
                      <p className="text-xs text-slate-400">
                        Controls whether the "Video Sessions" section appears on the public Project Detail page. When disabled or empty, the entire section is completely removed from public view with no placeholder or blank space.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{videoSessionsEnabled ? "Enabled" : "Disabled"}</span>
                      <ToggleSwitch
                        id="toggle-video-sessions"
                        checked={videoSessionsEnabled}
                        onChange={setVideoSessionsEnabled}
                      />
                    </div>
                  </div>

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
                  {/* Master Section Toggle */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    docEnabled ? "border-white/10 bg-slate-900/60" : "border-white/5 bg-slate-950/40 opacity-75"
                  } flex items-center justify-between gap-3 flex-wrap`}>
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-white">Documentation & PDF Section Public Visibility</span>
                        {getLiveStatusBadge(docEnabled, documents.length > 0 || Boolean(documentationUrl.trim() || docContentText.trim()))}
                      </div>
                      <p className="text-xs text-slate-400">
                        Controls whether the "README / Documentation" and PDF viewer section appears on the public Project Detail page. When disabled, it is completely hidden.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{docEnabled ? "Enabled" : "Disabled"}</span>
                      <ToggleSwitch
                        id="toggle-doc-section"
                        checked={docEnabled}
                        onChange={setDocEnabled}
                      />
                    </div>
                  </div>

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
                  {/* Master Section Toggle */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    architectureEnabled ? "border-white/10 bg-slate-900/60" : "border-white/5 bg-slate-950/40 opacity-75"
                  } flex items-center justify-between gap-3 flex-wrap`}>
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Layers className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-white">Architecture & Diagrams Section Public Visibility</span>
                        {getLiveStatusBadge(architectureEnabled, architecture.length > 0 && architecture.some((a) => Boolean(a.image_url?.trim())))}
                      </div>
                      <p className="text-xs text-slate-400">
                        Controls whether the "Architecture & Topology" section appears on the public Project Detail page. When disabled or empty, it is completely hidden.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{architectureEnabled ? "Enabled" : "Disabled"}</span>
                      <ToggleSwitch
                        id="toggle-architecture-section"
                        checked={architectureEnabled}
                        onChange={setArchitectureEnabled}
                      />
                    </div>
                  </div>

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
                          placeholder="/projects/temporary/sohail-shop-desktop.v2.jpg"
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
