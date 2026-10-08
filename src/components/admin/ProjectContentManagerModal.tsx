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
  ImageOff,
  Clock,
  Code2,
  Download,
  Upload,
  Loader2,
  HardDrive,
  RefreshCw,
  Play,
  Film,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  fetchProjectDetailsById,
  saveProjectContentToDatabase,
  invalidateProjectDetailsCache,
  normalizeProjectStatus,
  isDirectVideoUrl,
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
  const [imageSlotErrors, setImageSlotErrors] = useState<Record<number, boolean>>({});

  // Device File Upload State (Persistent binary storage in Neon PostgreSQL)
  interface MediaSlotInfo {
    id?: number;
    filename: string;
    fileSize?: number;
    uploadedAt?: string;
  }
  const [mediaMeta, setMediaMeta] = useState<Record<number, MediaSlotInfo | null>>({});
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<Record<number, string | null>>({});
  const fileInputRefs = React.useRef<Record<number, HTMLInputElement | null>>({});

  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const fetchSlotMetadata = async (slotIdx: number, url: string) => {
    const match = url.match(/\/api\/project-media\/(\d+)/);
    if (!match) return;
    const id = parseInt(match[1], 10);
    try {
      const res = await fetch(`/api/project-media/${id}?meta=true`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setMediaMeta((prev) => ({
            ...prev,
            [slotIdx]: {
              id: data.data.id,
              filename: data.data.filename,
              fileSize: data.data.file_size,
              uploadedAt: data.data.created_at,
            },
          }));
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch metadata for media #${id}`, e);
    }
  };

  const handleDeviceUpload = async (slotIdx: number, file: File) => {
    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const extension = file.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["png", "jpg", "jpeg", "webp"];

    if (!validTypes.includes(file.type) && !validExtensions.includes(extension || "")) {
      setUploadError((prev) => ({
        ...prev,
        [slotIdx]: "Invalid format. Only authentic image files (PNG, JPG/JPEG, WEBP) are allowed.",
      }));
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setUploadError((prev) => ({
        ...prev,
        [slotIdx]: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is 10MB.`,
      }));
      return;
    }

    setUploadingSlot(slotIdx);
    setUploadError((prev) => ({ ...prev, [slotIdx]: null }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      const projId = fullData?.numericId || project.dbId || (typeof project.id === "number" ? project.id : undefined);
      if (projId) {
        formData.append("projectId", String(projId));
      }

      const token = sessionStorage.getItem("sv_admin_token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/project-media", {
        method: "POST",
        headers,
        body: formData,
      });

      const rawText = await res.text().catch(() => "");
      let result: any = {};
      try {
        result = rawText ? JSON.parse(rawText) : {};
      } catch {
        result = {};
      }

      const uploaded = result?.data || (result?.url || result?.id ? result : null);
      const mediaUrl =
        uploaded?.url ||
        (uploaded?.id ? `/api/project-media/${uploaded.id}` : "") ||
        (typeof result?.url === "string" ? result.url : "");

      const isSuccess = res.ok && (result?.success === true || !!mediaUrl);
      if (!isSuccess) {
        throw new Error(
          result?.error ||
          result?.message ||
          (rawText && !rawText.startsWith("<") && rawText.length < 200 ? rawText : `Upload failed (HTTP ${res.status})`)
        );
      }

      // Update gallery images
      setGalleryImages((prev) => {
        const updated = [...prev];
        updated[slotIdx] = mediaUrl;
        return updated;
      });

      // If slot 0, also update heroImage
      if (slotIdx === 0) {
        setHeroImage(mediaUrl);
      }

      // Automatically enable this slot
      setGalleryEnabled((prev) => {
        const next = [...prev];
        next[slotIdx] = true;
        return next;
      });

      // Save metadata
      setMediaMeta((prev) => ({
        ...prev,
        [slotIdx]: {
          id: uploaded?.id || result?.id || (mediaUrl.includes("/api/project-media/") ? parseInt(mediaUrl.split("/api/project-media/")[1], 10) : undefined),
          filename: uploaded?.filename || result?.filename || file.name,
          fileSize: uploaded?.file_size || uploaded?.fileSize || result?.file_size || file.size,
          uploadedAt: uploaded?.created_at || uploaded?.uploadedAt || result?.created_at || new Date().toISOString(),
        },
      }));

      // Clear slot error
      setImageSlotErrors((prev) => ({ ...prev, [slotIdx]: false }));
    } catch (err: any) {
      console.error("Device upload failed:", err);
      setUploadError((prev) => ({
        ...prev,
        [slotIdx]: err?.message || "Failed to upload image from device.",
      }));
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveSlotImage = async (slotIdx: number, deleteFromDb = false) => {
    const currentUrl = galleryImages[slotIdx];
    const meta = mediaMeta[slotIdx];

    if (deleteFromDb && (meta?.id || currentUrl?.includes("/api/project-media/"))) {
      const mediaId = meta?.id || parseInt(currentUrl.split("/api/project-media/")[1], 10);
      if (!isNaN(mediaId) && mediaId > 0) {
        try {
          const token = sessionStorage.getItem("sv_admin_token");
          const headers: Record<string, string> = {};
          if (token) headers["Authorization"] = `Bearer ${token}`;

          await fetch(`/api/project-media/${mediaId}`, {
            method: "DELETE",
            headers,
          });
        } catch (e) {
          console.warn("Media delete error:", e);
        }
      }
    }

    setGalleryImages((prev) => {
      const updated = [...prev];
      updated[slotIdx] = "";
      return updated;
    });
    if (slotIdx === 0) {
      setHeroImage("");
    }
    setMediaMeta((prev) => {
      const updated = { ...prev };
      delete updated[slotIdx];
      return updated;
    });
    setImageSlotErrors((prev) => ({ ...prev, [slotIdx]: false }));
    setUploadError((prev) => ({ ...prev, [slotIdx]: null }));
  };

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

  // Video Device Upload State (Persistent binary storage in Neon PostgreSQL)
  interface VideoSlotMeta {
    id?: number;
    filename: string;
    fileSize?: number;
    uploadedAt?: string;
  }
  const [videoMediaMeta, setVideoMediaMeta] = useState<VideoSlotMeta | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const videoFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previewingVideoUrl, setPreviewingVideoUrl] = useState<string | null>(null);

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
    type: ProjectLinkItem["type"];
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
      setImageSlotErrors({});
      try {
        const details = await fetchProjectDetailsById(project.id, { forceRefresh: true });
        setFullData(details);

        // Populate fields
        setTitle(details.title);
        setCategory(details.category);
        setDescription(details.description);
        setOverview(details.content.overview || details.description);
        setTagline(details.tagline || "");
        setStatus(details.status);
        const resolvedHero =
          details.hero_image ||
          details.content.projectDetail?.images?.image1?.url ||
          details.content.gallery_images?.[0] ||
          "";
        setHeroImage(resolvedHero);
        setTechnologiesText(details.technologies.join(", "));

        // Populate gallery (up to 5 slots)
        const incomingGallery = details.content.gallery_images || [];
        const initialGallery: string[] = [
          incomingGallery[0] || resolvedHero || "",
          incomingGallery[1] || "",
          incomingGallery[2] || "",
          incomingGallery[3] || "",
          incomingGallery[4] || "",
        ];

        // Populate visibility toggles and slots from projectDetail
        const pd = details.content.projectDetail;
        if (pd) {
          const imgs = [
            pd.images?.image1?.url ?? resolvedHero ?? "",
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

        // Fetch metadata for any slots referencing Neon PostgreSQL media
        const activeImgs = pd
          ? [
              pd.images?.image1?.url ?? resolvedHero ?? "",
              pd.images?.image2?.url ?? initialGallery[1] ?? "",
              pd.images?.image3?.url ?? initialGallery[2] ?? "",
              pd.images?.image4?.url ?? initialGallery[3] ?? "",
              pd.images?.image5?.url ?? initialGallery[4] ?? "",
            ]
          : initialGallery;

        activeImgs.forEach((img, idx) => {
          if (img && img.includes("/api/project-media/")) {
            fetchSlotMetadata(idx, img);
          }
        });

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
  // Video Session Handlers & Device Upload Engine
  // -------------------------------------------------------------
  const formatVideoDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds) || seconds <= 0) return "";
    const totalSecs = Math.round(seconds);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const fetchVideoSlotMetadata = async (url: string) => {
    const match = url.match(/\/api\/project-media\/(\d+)/);
    if (!match) {
      setVideoMediaMeta(null);
      return;
    }
    const id = parseInt(match[1], 10);
    try {
      const res = await fetch(`/api/project-media/${id}?meta=true`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setVideoMediaMeta({
            id: data.data.id,
            filename: data.data.filename,
            fileSize: data.data.file_size,
            uploadedAt: data.data.created_at,
          });
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch metadata for video media #${id}`, e);
    }
  };

  const handleDeviceVideoUpload = async (file: File) => {
    // Validate video file type before uploading
    const supportedExtensions = ["mp4", "webm", "mov", "ogg"];
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    const nonVideoExtensions = [
      "png", "jpg", "jpeg", "gif", "webp", "pdf", "svg", "txt", "md",
      "json", "csv", "doc", "docx", "xls", "xlsx", "zip", "tar", "gz"
    ];

    const hasExplicitNonVideoMime =
      file.type &&
      (file.type.startsWith("image/") ||
       file.type.startsWith("text/") ||
       file.type === "application/pdf" ||
       file.type.startsWith("audio/"));

    const isVideoMime = Boolean(file.type && file.type.startsWith("video/"));
    const isSupportedVideoExt = supportedExtensions.includes(extension);

    // Accept only genuine video files
    const isValidVideo =
      !hasExplicitNonVideoMime &&
      !nonVideoExtensions.includes(extension) &&
      (isVideoMime || isSupportedVideoExt);

    if (!isValidVideo) {
      setVideoUploadError("Please select a video file. Supported formats: MP4, WebM, MOV, OGG.");
      return;
    }

    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_SIZE) {
      setVideoUploadError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is 100MB.`);
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadError(null);

    // Try reading duration from video element
    try {
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      const objectUrl = URL.createObjectURL(file);
      videoEl.src = objectUrl;
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        if (videoEl.duration && !videoForm.duration.trim()) {
          const formatted = formatVideoDuration(videoEl.duration);
          if (formatted) {
            setVideoForm((prev) => ({ ...prev, duration: formatted }));
          }
        }
      };
      videoEl.onerror = () => {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
      };
    } catch {
      // Ignore if metadata extraction fails
    }

    // Auto-fill title if empty
    if (!videoForm.title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
      if (cleanName) {
        setVideoForm((prev) => ({ ...prev, title: cleanName }));
      }
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const projId = fullData?.numericId || project.dbId || (typeof project.id === "number" ? project.id : undefined);
      if (projId) {
        formData.append("projectId", String(projId));
      }

      const token = sessionStorage.getItem("sv_admin_token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/project-media", {
        method: "POST",
        headers,
        body: formData,
      });

      const rawText = await res.text().catch(() => "");
      let result: any = {};
      try {
        result = rawText ? JSON.parse(rawText) : {};
      } catch {
        result = {};
      }

      const uploaded = result?.data || (result?.url || result?.id ? result : null);
      const mediaUrl =
        uploaded?.url ||
        (uploaded?.id ? `/api/project-media/${uploaded.id}` : "") ||
        (typeof result?.url === "string" ? result.url : "");

      const isSuccess = res.ok && (result?.success === true || !!mediaUrl);
      if (!isSuccess) {
        throw new Error(
          result?.error ||
          result?.message ||
          (rawText && !rawText.startsWith("<") && rawText.length < 200 ? rawText : `Upload failed (HTTP ${res.status})`)
        );
      }

      // Generate clean session title from filename if empty
      const cleanTitle =
        videoForm.title.trim() ||
        file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim() ||
        "Project Walkthrough Video";
      const sessionName =
        videoForm.name.trim() ||
        `Session ${String(videos.length + 1).padStart(2, "0")}`;

      const newSession: ProjectVideoSession = {
        id: `vid-${Date.now()}`,
        title: cleanTitle,
        name: sessionName,
        video_url: mediaUrl,
        duration: videoForm.duration.trim() || undefined,
        description: videoForm.description.trim() || undefined,
        showInProjectGallery: true,
      };

      // Set video form URL and fields
      setVideoForm((prev) => ({
        ...prev,
        title: cleanTitle,
        name: sessionName,
        video_url: mediaUrl,
      }));

      // Automatically add/update the session in configured video sessions
      setVideos((prev) => {
        // If editing an existing session, replace it
        if (editingVideoIndex !== null && prev[editingVideoIndex]) {
          const updated = [...prev];
          updated[editingVideoIndex] = {
            ...updated[editingVideoIndex],
            title: cleanTitle,
            name: sessionName,
            video_url: mediaUrl,
            duration: videoForm.duration.trim() || updated[editingVideoIndex].duration,
            showInProjectGallery: true,
          };
          return updated;
        }
        // If already exists with this URL, update it
        const existingIdx = prev.findIndex((v) => v.video_url === mediaUrl);
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            title: cleanTitle,
            name: sessionName,
            showInProjectGallery: true,
          };
          return updated;
        }
        return [...prev, newSession];
      });

      // Enable video sessions section visibility
      setVideoSessionsEnabled(true);

      // Store metadata
      setVideoMediaMeta({
        id: uploaded?.id || result?.id || (mediaUrl.includes("/api/project-media/") ? parseInt(mediaUrl.split("/api/project-media/")[1], 10) : undefined),
        filename: uploaded?.filename || result?.filename || file.name,
        fileSize: uploaded?.file_size || uploaded?.fileSize || result?.file_size || file.size,
        uploadedAt: uploaded?.created_at || uploaded?.uploadedAt || result?.created_at || new Date().toISOString(),
      });

      setError(null);
      setVideoUploadError(null);
    } catch (err: any) {
      console.error("Device video upload failed:", err);
      setVideoUploadError(err?.message || "Failed to upload video from device.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleRemoveUploadedVideo = async (deleteFromDb = false) => {
    const currentUrl = videoForm.video_url;
    const meta = videoMediaMeta;

    if (deleteFromDb && (meta?.id || currentUrl?.includes("/api/project-media/"))) {
      const mediaId = meta?.id || parseInt(currentUrl.split("/api/project-media/")[1], 10);
      if (!isNaN(mediaId) && mediaId > 0) {
        try {
          const token = sessionStorage.getItem("sv_admin_token");
          const headers: Record<string, string> = {};
          if (token) headers["Authorization"] = `Bearer ${token}`;

          await fetch(`/api/project-media/${mediaId}`, {
            method: "DELETE",
            headers,
          });
        } catch (e) {
          console.warn("Video media delete error:", e);
        }
      }
    }

    setVideoForm((prev) => ({ ...prev, video_url: "" }));
    setVideoMediaMeta(null);
    setVideoUploadError(null);
  };

  const handleSaveVideo = () => {
    if (!videoForm.title.trim() || !videoForm.video_url.trim()) {
      setError("Video title and Video URL are required.");
      return;
    }

    const isDirect = isDirectVideoUrl(videoForm.video_url);

    if (editingVideoIndex !== null) {
      const updated = [...videos];
      updated[editingVideoIndex] = {
        ...updated[editingVideoIndex],
        title: videoForm.title.trim(),
        name: videoForm.name.trim() || undefined,
        video_url: videoForm.video_url.trim(),
        duration: videoForm.duration.trim() || undefined,
        description: videoForm.description.trim() || undefined,
        showInProjectGallery: isDirect || updated[editingVideoIndex].showInProjectGallery,
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
          showInProjectGallery: isDirect || true,
        },
      ]);
    }

    setVideoSessionsEnabled(true);

    setVideoForm({
      title: "",
      name: "",
      video_url: "",
      duration: "",
      description: "",
    });
    setVideoMediaMeta(null);
    setVideoUploadError(null);
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
    setVideoUploadError(null);
    if (v.video_url?.includes("/api/project-media/")) {
      fetchVideoSlotMetadata(v.video_url);
    } else {
      setVideoMediaMeta(null);
    }
  };

  const handleDeleteVideo = (idx: number) => {
    setVideos(videos.filter((_, i) => i !== idx));
    if (editingVideoIndex === idx) {
      setEditingVideoIndex(null);
      setVideoForm({ title: "", name: "", video_url: "", duration: "", description: "" });
      setVideoMediaMeta(null);
      setVideoUploadError(null);
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

      const primaryHero = (heroImage.trim() || galleryImages[0]?.trim() || "").trim();

      const syncedGallery = [...galleryImages];
      syncedGallery[0] = primaryHero;

      const cleanedGallery = syncedGallery
        .map((img) => img.trim())
        .filter(Boolean)
        .slice(0, 5);

      const effectiveHeroImage = primaryHero || cleanedGallery[0] || "";

      // Ensure any pending video form with a valid URL is committed into videos
      let finalVideos = [...videos];
      if (
        videoForm.video_url.trim() &&
        !finalVideos.some((v) => v.video_url.trim() === videoForm.video_url.trim())
      ) {
        finalVideos.push({
          id: `vid-${Date.now()}`,
          title: videoForm.title.trim() || "Project Walkthrough Video",
          name: videoForm.name.trim() || `Session ${String(finalVideos.length + 1).padStart(2, "0")}`,
          video_url: videoForm.video_url.trim(),
          duration: videoForm.duration.trim() || undefined,
          description: videoForm.description.trim() || undefined,
          showInProjectGallery: true,
        });
      }

      const effectiveVideoSessionsEnabled = videoSessionsEnabled || finalVideos.length > 0;

      const detailPayload: ProjectDetailVisibility = {
        images: {
          image1: { url: primaryHero, enabled: galleryEnabled[0] },
          image2: { url: syncedGallery[1]?.trim() || "", enabled: galleryEnabled[1] },
          image3: { url: syncedGallery[2]?.trim() || "", enabled: galleryEnabled[2] },
          image4: { url: syncedGallery[3]?.trim() || "", enabled: galleryEnabled[3] },
          image5: { url: syncedGallery[4]?.trim() || "", enabled: galleryEnabled[4] },
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
          enabled: effectiveVideoSessionsEnabled,
        },
        architecture: {
          enabled: architectureEnabled,
        },
      };

      const contentPayload = {
        domain: "project" as const,
        overview: overview.trim(),
        tagline: tagline.trim() || undefined,
        hero_image: effectiveHeroImage || undefined,
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
        videos: finalVideos,
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
          image_url: primaryHero,
          github_url:
            primaryGithub !== (fullData.githubUrl || "") ? primaryGithub : undefined,
        };

        await saveProjectContentToDatabase(fullData.numericId, {
          ...coreUpdates,
          content: contentPayload,
        });
      } else {
        // Project was static; persist as new DB record
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            technologies: parsedTech.join(", "),
            status,
            image_url: primaryHero,
            github_url: primaryGithub || "",
            highlights: JSON.stringify(contentPayload),
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || "Failed to persist project record.");
        }

        invalidateProjectDetailsCache();
      }

      if (fullData) {
        setFullData({
          ...fullData,
          hero_image: primaryHero,
          content: {
            ...fullData.content,
            ...contentPayload,
            projectDetail: detailPayload,
          },
        });
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
                        <option value="Live">Live</option>
                        <option value="Ready">Ready (Production)</option>
                        <option value="Active">Active (In Development)</option>
                        <option value="Upcoming">Upcoming (Coming Soon)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-slate-400">
                          Primary Hero Image (Image 1)
                        </label>
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[0]?.click()}
                          disabled={uploadingSlot === 0}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
                        >
                          {uploadingSlot === 0 ? (
                            <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                          ) : (
                            <Upload className="h-3 w-3 text-emerald-400" />
                          )}
                          <span>{uploadingSlot === 0 ? "Uploading..." : "Upload from Device"}</span>
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[0] = el;
                        }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleDeviceUpload(0, f);
                            e.target.value = "";
                          }
                        }}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                      />

                      <input
                        type="text"
                        value={heroImage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeroImage(val);
                          setGalleryImages((prev) => {
                            const updated = [...prev];
                            updated[0] = val;
                            return updated;
                          });
                          if (val.includes("/api/project-media/")) {
                            fetchSlotMetadata(0, val);
                          }
                        }}
                        placeholder="/api/project-media/1 or /projects/temporary/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-900 text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                      />

                      {/* Hero Image preview & metadata card */}
                      {heroImage.trim() && (
                        <div className="mt-2 p-2.5 rounded-xl border border-white/10 bg-slate-950 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                              <img
                                src={heroImage.trim()}
                                alt="Hero preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              {heroImage.includes("/api/project-media/") ? (
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      <HardDrive className="h-2.5 w-2.5" />
                                      <span>Neon DB Media</span>
                                    </span>
                                    {mediaMeta[0]?.filename && (
                                      <span className="text-xs text-white font-mono truncate max-w-[130px]">
                                        {mediaMeta[0].filename}
                                      </span>
                                    )}
                                    {mediaMeta[0]?.fileSize && (
                                      <span className="text-[10px] text-emerald-400 font-mono">
                                        ({formatFileSize(mediaMeta[0].fileSize)})
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-mono text-cyan-400 block truncate">
                                    {heroImage}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-mono text-slate-400 truncate block">
                                  {heroImage}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[0]?.click()}
                              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Replace</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSlotImage(0, false)}
                              className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Clear</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {uploadError[0] && (
                        <p className="mt-1 text-xs text-red-400 font-mono flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{uploadError[0]}</span>
                        </p>
                      )}
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
                      const isUploading = uploadingSlot === slotIdx;
                      const meta = mediaMeta[slotIdx];
                      const isDbMedia = imgVal.includes("/api/project-media/");

                      return (
                        <div
                          key={slotIdx}
                          className={`p-4 rounded-2xl border transition-all ${
                            isEnabled
                              ? "border-white/10 bg-slate-900/40"
                              : "border-white/5 bg-slate-950/40 opacity-70"
                          } space-y-3`}
                        >
                          {/* Hidden native device file input */}
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current[slotIdx] = el;
                            }}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                handleDeviceUpload(slotIdx, f);
                                e.target.value = "";
                              }
                            }}
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                          />

                          {/* Slot Header */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center justify-center font-bold">
                                {slotIdx + 1}
                              </span>
                              <span className="text-xs font-mono font-medium text-slate-300">
                                {isHero ? "Primary Hero Image (Image 1) *" : `Gallery Image ${slotIdx + 1}`}
                              </span>
                              {getLiveStatusBadge(isEnabled, Boolean(imgVal.trim()))}
                              {isDbMedia && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  <HardDrive className="h-2.5 w-2.5" />
                                  <span>Neon DB Media</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Upload from Device button */}
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[slotIdx]?.click()}
                                disabled={isUploading}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
                              >
                                {isUploading ? (
                                  <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                                ) : (
                                  <Upload className="h-3 w-3 text-emerald-400" />
                                )}
                                <span>{isUploading ? "Uploading..." : imgVal ? "Replace from Device" : "Upload from Device"}</span>
                              </button>

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
                                  onClick={() => handleRemoveSlotImage(slotIdx, false)}
                                  className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span>Clear</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Upload Progress Banner */}
                          {isUploading && (
                            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3 animate-pulse">
                              <Loader2 className="h-4 w-4 text-emerald-400 animate-spin shrink-0" />
                              <div className="text-xs font-mono text-emerald-200">
                                <p className="font-semibold">Uploading device image to Neon PostgreSQL...</p>
                                <p className="text-[10px] text-emerald-400/80">Writing binary data (bytea) and registering media endpoint...</p>
                              </div>
                            </div>
                          )}

                          {/* Inline Upload Error */}
                          {uploadError[slotIdx] && (
                            <div className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center gap-2 text-xs font-mono text-red-300">
                              <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                              <span>{uploadError[slotIdx]}</span>
                            </div>
                          )}

                          {/* Main Slot Content */}
                          <div className="flex flex-col sm:flex-row gap-3 items-start">
                            <div className="flex-1 w-full space-y-2">
                              {/* Metadata Card if from DB */}
                              {isDbMedia && (
                                <div className="p-2.5 rounded-xl border border-white/10 bg-slate-950 flex flex-wrap items-center justify-between gap-2">
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono font-medium text-white truncate max-w-[200px]">
                                        {meta?.filename || `media-${imgVal.split("/api/project-media/")[1]}.png`}
                                      </span>
                                      {meta?.fileSize && (
                                        <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                                          {formatFileSize(meta.fileSize)}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                      <span>Endpoint:</span>
                                      <span className="text-cyan-400">{imgVal}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => fileInputRefs.current[slotIdx]?.click()}
                                      className="px-2 py-0.5 rounded text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1 transition-all"
                                    >
                                      <RefreshCw className="h-3 w-3" />
                                      <span>Replace</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSlotImage(slotIdx, true)}
                                      className="px-2 py-0.5 rounded text-xs font-mono text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 flex items-center gap-1 transition-all"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span>Delete Media</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Manual URL input for fallback / compatibility */}
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
                                  if (imageSlotErrors[slotIdx]) {
                                    setImageSlotErrors((prev) => ({ ...prev, [slotIdx]: false }));
                                  }
                                  if (e.target.value.includes("/api/project-media/")) {
                                    fetchSlotMetadata(slotIdx, e.target.value);
                                  }
                                }}
                                placeholder={
                                  isHero
                                    ? "/api/project-media/1 or /projects/temporary/..."
                                    : "Image URL or upload from device"
                                }
                                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-slate-950 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none font-mono"
                              />

                              {!imgVal.trim() && (
                                <div className="p-3 rounded-xl border border-dashed border-white/15 bg-slate-950/40 flex flex-col items-center justify-center gap-2 py-3 text-center">
                                  <ImageIcon className="h-5 w-5 text-slate-500" />
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-medium text-slate-300">No image assigned to this slot</p>
                                    <p className="text-[10px] text-slate-500">
                                      Upload PNG, JPG, or WEBP directly into Neon PostgreSQL database
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefs.current[slotIdx]?.click()}
                                    disabled={isUploading}
                                    className="mt-0.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all"
                                  >
                                    <Upload className="h-3 w-3" />
                                    <span>Upload from Device</span>
                                  </button>
                                </div>
                              )}

                              <div className="flex gap-2 text-[10px] font-mono text-slate-500">
                                <span>Path:</span>
                                {imgVal ? (
                                  <span className="text-emerald-400 truncate max-w-xs">{imgVal}</span>
                                ) : (
                                  <span>Empty slot</span>
                                )}
                              </div>
                            </div>

                            {/* Thumbnail Preview */}
                            {imgVal.trim() && (
                              <div className="shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center shadow-lg relative group">
                                {!imageSlotErrors[slotIdx] ? (
                                  <img
                                    key={imgVal.trim()}
                                    src={imgVal.trim()}
                                    alt={`Slot ${slotIdx + 1} preview`}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                                    referrerPolicy="no-referrer"
                                    onError={() => {
                                      setImageSlotErrors((prev) => ({
                                        ...prev,
                                        [slotIdx]: true,
                                      }));
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-red-950/20 border border-red-500/20 text-red-300">
                                    <ImageOff className="h-4 w-4 text-red-400 shrink-0" />
                                    <span className="text-[9px] font-mono leading-tight mt-0.5">
                                      Unable to load
                                    </span>
                                  </div>
                                )}
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
                      <div className="sm:col-span-2 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="block text-[11px] font-mono text-slate-400">
                            Video Stream / File Source *
                          </label>
                          <button
                            type="button"
                            onClick={() => videoFileInputRef.current?.click()}
                            disabled={isUploadingVideo}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {isUploadingVideo ? (
                              <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                            ) : (
                              <Upload className="h-3 w-3 text-emerald-400" />
                            )}
                            <span>{isUploadingVideo ? "Uploading Video..." : "Upload from Device"}</span>
                          </button>
                        </div>

                        <input
                          type="file"
                          ref={videoFileInputRef}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              handleDeviceVideoUpload(f);
                              e.target.value = "";
                            }
                          }}
                          accept="video/mp4,video/webm,video/quicktime,video/ogg,video/x-matroska,video/*"
                          className="hidden"
                        />

                        <input
                          type="text"
                          value={videoForm.video_url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVideoForm({ ...videoForm, video_url: val });
                            if (val.includes("/api/project-media/")) {
                              fetchVideoSlotMetadata(val);
                            } else {
                              setVideoMediaMeta(null);
                            }
                          }}
                          placeholder="/api/project-media/12 or https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950 text-xs text-white focus:border-emerald-400 focus:outline-none font-mono"
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

                    {/* Upload error banner if any */}
                    {videoUploadError && (
                      <div className="p-2.5 rounded-xl border border-red-500/30 bg-red-950/40 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                        <span>{videoUploadError}</span>
                      </div>
                    )}

                    {/* Uploaded Video metadata card & player preview */}
                    {videoForm.video_url.trim() && (
                      <div className="p-3 rounded-xl border border-white/10 bg-slate-950 space-y-2">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 min-w-0">
                            {videoForm.video_url.includes("/api/project-media/") ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                                <HardDrive className="h-3 w-3" />
                                <span>Neon DB Video</span>
                              </span>
                            ) : isDirectVideoUrl(videoForm.video_url) ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                <Film className="h-3 w-3" />
                                <span>Direct Video File</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                                <Video className="h-3 w-3" />
                                <span>External Stream</span>
                              </span>
                            )}

                            {videoMediaMeta?.filename && (
                              <span className="text-xs text-white font-mono truncate max-w-[200px]">
                                {videoMediaMeta.filename}
                              </span>
                            )}

                            {videoMediaMeta?.fileSize && (
                              <span className="text-[11px] text-emerald-400 font-mono">
                                ({formatFileSize(videoMediaMeta.fileSize)})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => videoFileInputRef.current?.click()}
                              disabled={isUploadingVideo}
                              className="px-2 py-1 rounded-lg border border-white/10 text-slate-300 hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveUploadedVideo(false)}
                              className="px-2 py-1 rounded-lg border border-red-500/30 text-red-400 hover:text-red-300 text-[11px] font-mono transition-colors cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Interactive In-Modal Preview for Uploaded or Direct Videos */}
                        {isDirectVideoUrl(videoForm.video_url) && (
                          <div className="pt-1">
                            <video
                              key={videoForm.video_url}
                              src={videoForm.video_url}
                              controls
                              playsInline
                              className="w-full max-h-48 rounded-lg bg-black border border-white/10 object-contain"
                            >
                              Your browser does not support HTML5 video preview.
                            </video>
                          </div>
                        )}
                      </div>
                    )}

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
                          className="p-3 rounded-xl border border-white/10 bg-slate-900/40 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                                <span className="text-emerald-400 font-semibold">
                                  {vid.name || `Session ${idx + 1}`}
                                </span>
                                {vid.video_url?.includes("/api/project-media/") ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    <HardDrive className="h-2.5 w-2.5" />
                                    <span>Uploaded Video</span>
                                  </span>
                                ) : isDirectVideoUrl(vid.video_url) ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    <Film className="h-2.5 w-2.5" />
                                    <span>Direct Video</span>
                                  </span>
                                ) : null}
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
                                type="button"
                                onClick={() =>
                                  setPreviewingVideoUrl((prev) =>
                                    prev === vid.video_url ? null : vid.video_url
                                  )
                                }
                                title={previewingVideoUrl === vid.video_url ? "Hide Preview" : "Preview Video"}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  previewingVideoUrl === vid.video_url
                                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                                    : "border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                <Play className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditVideo(idx)}
                                title="Edit Session"
                                className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(idx)}
                                title="Delete Session"
                                className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expandable Video Preview Player */}
                          {previewingVideoUrl === vid.video_url && (
                            <div className="pt-2 border-t border-white/10">
                              {isDirectVideoUrl(vid.video_url) ? (
                                <video
                                  key={vid.video_url}
                                  src={vid.video_url}
                                  controls
                                  playsInline
                                  className="w-full max-h-52 rounded-lg bg-black border border-white/10 object-contain"
                                >
                                  Your browser does not support HTML5 video preview.
                                </video>
                              ) : (
                                <div className="p-3 rounded-lg bg-slate-950 border border-white/10 flex items-center justify-between text-xs">
                                  <span className="text-slate-300 truncate">External: {vid.video_url}</span>
                                  <a
                                    href={vid.video_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:underline shrink-0 flex items-center gap-1"
                                  >
                                    <span>Open Stream</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
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
