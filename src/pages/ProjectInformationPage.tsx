import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Play,
  FileText,
  Download,
  Layers,
  CheckCircle2,
  Maximize2,
  X,
  Code2,
  Sparkles,
  GitBranch,
  Calendar,
  Eye,
  Info,
  ShieldCheck,
  History,
  Image as ImageIcon,
  Terminal,
  Cpu,
  Workflow,
  FileSearch,
  Lock,
  Shield,
  HardDrive,
  Database,
  Server,
  ArrowDown,
  ShoppingCart,
  Store,
  CreditCard,
  Mail,
} from "lucide-react";
import {
  SiKubernetes,
  SiDocker,
  SiTerraform,
  SiPostgresql,
  SiDjango,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiRedis,
  SiArgo,
  SiGithubactions,
  SiFlutter,
  SiFirebase,
  SiNodedotjs,
  SiVite,
  SiReactrouter,
  SiTrpc,
  SiReactquery,
  SiHono,
  SiZod,
  SiDrizzle,
  SiNginx,
  SiCloudflare,
} from "react-icons/si";
import { FaAws, FaGithub } from "react-icons/fa";
import {
  fetchProjectDetailsById,
  getCachedProjectDetailsById,
  getProjectVideoEmbedUrl,
  type FullProjectData,
  type ProjectVideoSession,
  type ProjectDocument,
  type ProjectArchitectureDiagram,
} from "../lib/projectContent";
import { LoadingSkeleton } from "../components/ui/StatusStates";

/**
 * Returns a branded icon for technology badges
 */
function getTechBadgeIcon(name: string) {
  const n = name.toLowerCase().trim();
  if (n.includes("react")) return <SiReact className="text-cyan-400" />;
  if (n.includes("next")) return <SiNextdotjs className="text-white" />;
  if (n.includes("typescript") || n === "ts") return <SiTypescript className="text-blue-400" />;
  if (n.includes("tailwind")) return <SiTailwindcss className="text-cyan-300" />;
  if (n.includes("postgres") || n.includes("pg") || n.includes("neon")) return <SiPostgresql className="text-sky-400" />;
  if (n.includes("docker")) return <SiDocker className="text-blue-400" />;
  if (n.includes("kube") || n.includes("k8s")) return <SiKubernetes className="text-blue-400" />;
  if (n.includes("terraform")) return <SiTerraform className="text-purple-400" />;
  if (n.includes("django")) return <SiDjango className="text-emerald-400" />;
  if (n.includes("python")) return <SiDjango className="text-amber-400" />;
  if (n.includes("aws") || n.includes("eks") || n.includes("s3")) return <FaAws className="text-amber-400" />;
  if (n.includes("redis")) return <SiRedis className="text-rose-400" />;
  if (n.includes("argo")) return <SiArgo className="text-orange-400" />;
  if (n.includes("github") || n.includes("git")) return <SiGithubactions className="text-slate-300" />;
  if (n.includes("flutter")) return <SiFlutter className="text-cyan-400" />;
  if (n.includes("firebase")) return <SiFirebase className="text-amber-400" />;
  if (n.includes("node")) return <SiNodedotjs className="text-emerald-400" />;
  if (n.includes("vite")) return <SiVite className="text-purple-400" />;
  if (n.includes("router")) return <SiReactrouter className="text-red-400" />;
  if (n.includes("trpc")) return <SiTrpc className="text-blue-400" />;
  if (n.includes("query") || n.includes("tanstack")) return <SiReactquery className="text-rose-400" />;
  if (n.includes("hono")) return <SiHono className="text-orange-400" />;
  if (n.includes("zod")) return <SiZod className="text-blue-500" />;
  if (n.includes("drizzle")) return <SiDrizzle className="text-lime-400" />;
  if (n.includes("nginx")) return <SiNginx className="text-emerald-400" />;
  if (n.includes("cloudflare")) return <SiCloudflare className="text-orange-400" />;
  if (n.includes("razorpay")) return <CreditCard className="text-blue-400" />;
  if (n.includes("resend")) return <Mail className="text-white" />;
  return <Code2 className="text-cyan-400" />;
}

export default function ProjectInformationPage() {
  const { id } = useParams<{ id: string }>();

  const initialProject = id ? getCachedProjectDetailsById(id) : null;
  const [project, setProject] = useState<FullProjectData | null>(initialProject);
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState<string | null>(null);

  // Active video session in player
  const [activeVideo, setActiveVideo] = useState<ProjectVideoSession | null>(() => {
    return initialProject && initialProject.content.videos.length > 0 ? initialProject.content.videos[0] : null;
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Active document selected in documentation viewer
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  // Active gallery image selected (1 to 5 images)
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);

  // Lightbox for architecture diagrams / hero image
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    caption?: string;
  } | null>(null);

  // Active navigation section
  const [activeSection, setActiveSection] = useState<
    "overview" | "planes" | "capabilities" | "persistence" | "videos" | "docs" | "architecture" | "links"
  >("overview");

  const overviewRef = useRef<HTMLDivElement>(null);
  const planesRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const persistenceRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    if (!id) {
      setError("No project ID specified.");
      setLoading(false);
      return;
    }

    try {
      // If we don't already have project data, show loading
      if (!project) {
        setLoading(true);
      }
      setError(null);
      const data = await fetchProjectDetailsById(id);
      setProject(data);
      if (data.content.videos.length > 0 && !activeVideo) {
        setActiveVideo(data.content.videos[0]);
      }
    } catch (err: any) {
      console.error("Failed to load project information:", err);
      if (!project) {
        setError(err?.message || "Unable to retrieve project information.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, project, activeVideo]);

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  // Handle escape key for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVideoModalOpen(false);
        setLightboxImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToSection = (
    section:
      | "overview"
      | "planes"
      | "capabilities"
      | "persistence"
      | "videos"
      | "docs"
      | "architecture"
      | "links"
  ) => {
    setActiveSection(section);
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    if (section === "overview") targetRef = overviewRef;
    if (section === "planes") targetRef = planesRef;
    if (section === "capabilities") targetRef = capabilitiesRef;
    if (section === "persistence") targetRef = persistenceRef;
    if (section === "videos") targetRef = videosRef;
    if (section === "docs") targetRef = docsRef;
    if (section === "architecture") targetRef = architectureRef;
    if (section === "links") targetRef = linksRef;

    if (targetRef && targetRef.current) {
      const yOffset = -80;
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050811] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <LoadingSkeleton label="Loading Project Information Dossier..." />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#050811] text-white py-20 px-4">
        <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="h-12 w-12 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Info className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Project Information Unavailable</h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            {error || `No project found matching identifier "${id}".`}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold transition-all shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { content } = project;
  const detail = content.projectDetail;
  const activeDoc = content.documents[selectedDocIndex] || null;

  // Project Gallery (up to 5 images) — Only include images where enabled === true AND valid URL
  const enabledImages: string[] = [];
  if (detail?.images) {
    if (detail.images.image1?.enabled && detail.images.image1?.url?.trim()) {
      enabledImages.push(detail.images.image1.url.trim());
    }
    if (detail.images.image2?.enabled && detail.images.image2?.url?.trim()) {
      enabledImages.push(detail.images.image2.url.trim());
    }
    if (detail.images.image3?.enabled && detail.images.image3?.url?.trim()) {
      enabledImages.push(detail.images.image3.url.trim());
    }
    if (detail.images.image4?.enabled && detail.images.image4?.url?.trim()) {
      enabledImages.push(detail.images.image4.url.trim());
    }
    if (detail.images.image5?.enabled && detail.images.image5?.url?.trim()) {
      enabledImages.push(detail.images.image5.url.trim());
    }
  } else {
    // Fallback if no projectDetail schema
    if (content.gallery_images && content.gallery_images.length > 0) {
      enabledImages.push(
        ...content.gallery_images.filter((img) => typeof img === "string" && img.trim().length > 0)
      );
    } else if (project.hero_image) {
      enabledImages.push(project.hero_image);
    }
  }

  const galleryList = enabledImages.slice(0, 5);
  const activeImage = galleryList[selectedGalleryIndex] || galleryList[0] || null;

  const isAmFruits =
    project.id === "fresh-flow" ||
    project.id === "5" ||
    project.title.toLowerCase().replace(/[^a-z0-9]/g, "").includes("amfruits") ||
    project.title.toLowerCase().includes("am fruit");

  // Optional project resources: Must have valid content AND enabled === true
  // For AM Fruits, the GitHub repository link is COMPLETELY removed per explicit directive.
  const gitUrl = isAmFruits
    ? ""
    : (
        detail?.gitRepository?.enabled
          ? (detail.gitRepository.url || content.git_url || project.githubUrl || "")
          : ""
      ).trim();

  const websiteUrl = (
    isAmFruits
      ? "https://amfruits.shop"
      : (
          detail?.website?.enabled
            ? (detail.website.url || content.website_url || project.liveUrl || "")
            : ""
        )
  ).trim();

  const videoUrl = (
    detail?.video?.enabled
      ? (detail.video.url || content.video_url || "")
      : ""
  ).trim();

  const pdfUrl = (
    detail?.pdf?.enabled
      ? (detail.pdf.url || content.pdf_url || "")
      : ""
  ).trim();

  const docUrl = (
    detail?.documentation?.enabled
      ? (detail.documentation.url || content.documentation_url || "")
      : ""
  ).trim();

  const docContent = (
    detail?.documentation?.enabled
      ? (detail.documentation.content || content.documentation_content || "")
      : ""
  ).trim();

  const hasAnyResource = Boolean(gitUrl || websiteUrl || videoUrl || pdfUrl || docUrl);

  const isSohailShop =
    project.id === "sohail-shop" ||
    project.id === "1" ||
    project.title.toLowerCase().replace(/[^a-z0-9]/g, "") === "sohailshop";

  // Video Sessions: Must be enabled AND have at least one valid video URL
  const isVideoSessionsVisible = Boolean(
    detail?.videoSessions?.enabled &&
    content.videos.length > 0 &&
    content.videos.some((v) => v.video_url && v.video_url.trim().length > 0)
  );

  // Documentation section: Must be enabled AND have documents or content
  const isDocumentsSectionVisible = Boolean(
    detail?.documentation?.enabled &&
    (content.documents.length > 0 || docUrl || docContent)
  );

  // Architecture diagrams: Must be enabled AND have at least one diagram
  const isArchitectureVisible = Boolean(
    detail?.architecture?.enabled &&
    content.architecture.length > 0 &&
    content.architecture.some((a) => a.image_url && a.image_url.trim().length > 0)
  );

  // Flagship Case Study Sections
  const hasPlanesSection = Boolean(
    content.execution_planes && content.execution_planes.length > 0
  );
  const hasCapabilitiesSection = Boolean(
    content.system_capabilities && content.system_capabilities.length > 0
  );
  const hasPersistenceSection = Boolean(content.persistence_architecture);

  const hasMultipleSections = Boolean(
    hasPlanesSection ||
    hasCapabilitiesSection ||
    hasPersistenceSection ||
    isVideoSessionsVisible ||
    isDocumentsSectionVisible ||
    isArchitectureVisible ||
    content.links.length > 0
  );

  // Implemented features
  const implementedFeatures = (
    content.implemented_features && content.implemented_features.length > 0
      ? content.implemented_features
      : content.highlightsList
  )?.filter((f): f is string => typeof f === "string" && f.trim().length > 0) || [];

  // Status styling
  const statusStyles = {
    Live: {
      badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    },
    Ready: {
      badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
      dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
    },
    Active: {
      badge: "bg-amber-500/15 border-amber-500/30 text-amber-300",
      dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse",
    },
    Upcoming: {
      badge: "bg-sky-500/15 border-sky-500/30 text-sky-300",
      dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
    },
  }[project.status] || {
    badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  };

  return (
    <div
      id="project-information-page"
      className="relative min-h-screen bg-[#050811] text-slate-100 overflow-x-hidden pb-20"
    >
      {/* Background Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-6xl opacity-20 blur-[140px] bg-gradient-to-b from-cyan-500/30 via-blue-600/20 to-transparent"
      />

      {/* =========================================================================
          1. HEADER & BREADCRUMB NAVIGATION
          - Back to Projects: Strictly routes to /projects (NEVER /devops)
          - Project Title, Status Badge, Category Badge, Action Links
         ========================================================================= */}
      <header className="relative z-10 border-b border-white/[0.08] bg-[#050811]/90 backdrop-blur-md sticky top-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Back to Projects */}
          <Link
            to="/projects"
            id="back-to-projects-link"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-400 hover:text-cyan-300 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
          </Link>

          {/* Action Links (GitHub, Live App) - strictly guarded by Admin visibility */}
          <div className="flex items-center gap-2 sm:gap-3">
            {gitUrl && (
              <a
                href={gitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <FaGithub className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Source Code</span>
              </a>
            )}

            {websiteUrl && (
              <a
                href={
                  websiteUrl.startsWith("http")
                    ? websiteUrl
                    : `https://${websiteUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Live App ↗</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14">
        {/* =========================================================================
            2. PROJECT TITLE BAR & STATUS
           ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status Badge: Ready, Active, Upcoming */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium ${statusStyles.badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusStyles.dot}`} />
              <span>{project.status}</span>
            </span>

            {/* Category Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-slate-300">
              {project.category}
            </span>

            {project.isDatabaseBacked && (
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                Verified Production Record
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          {project.tagline && (
            <p className="text-base sm:text-lg font-light text-cyan-200/90 leading-relaxed max-w-3xl">
              {project.tagline}
            </p>
          )}
        </section>

        {/* =========================================================================
            3. STICKY SUB-NAVIGATION PILLS
            - Overview | Video Sessions | Documentation | Architecture | Project Links
           ========================================================================= */}
        {hasMultipleSections && (
          <nav
            aria-label="Project section navigation"
            className="sticky top-[57px] sm:top-[65px] z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-2.5 bg-[#050811]/95 backdrop-blur-md border-y border-white/[0.08] flex items-center gap-2 overflow-x-auto no-scrollbar"
          >
            <button
              onClick={() => scrollToSection("overview")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === "overview"
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                  : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
              }`}
            >
              Overview
            </button>

            {hasPlanesSection && (
              <button
                onClick={() => scrollToSection("planes")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeSection === "planes"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <span>Execution Planes</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-[11px] font-mono text-cyan-200">
                  3
                </span>
              </button>
            )}

            {hasCapabilitiesSection && (
              <button
                onClick={() => scrollToSection("capabilities")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === "capabilities"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                Deep Inspector & Intelligence
              </button>
            )}

            {hasPersistenceSection && (
              <button
                onClick={() => scrollToSection("persistence")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === "persistence"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                Persistence Architecture
              </button>
            )}

            {isVideoSessionsVisible && (
              <button
                onClick={() => scrollToSection("videos")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeSection === "videos"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                <span>Video Sessions</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-[11px] font-mono text-cyan-200">
                  {content.videos.length}
                </span>
              </button>
            )}

            {isDocumentsSectionVisible && (
              <button
                onClick={() => scrollToSection("docs")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === "docs"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                Documentation / PDF
              </button>
            )}

            {isArchitectureVisible && (
              <button
                onClick={() => scrollToSection("architecture")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === "architecture"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                Architecture Diagrams
              </button>
            )}

            {content.links.length > 0 && (
              <button
                onClick={() => scrollToSection("links")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === "links"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                    : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                }`}
              >
                Project Links
              </button>
            )}
          </nav>
        )}

        {/* =========================================================================
            SECTION 1: HERO IMAGE, GALLERY, OVERVIEW, RESOURCES & CORE PRESENTATION
            - Clean, expandable presentation page structure for AM Fruits and all projects
            - Supports up to 5 project images with thumbnail selector
            - Optional project resources (Git, Website, Video, PDF, Documentation)
            - Implemented Features, Important Business Flow, Payment System & Security, Order Data / Historical Records
           ========================================================================= */}
        <section ref={overviewRef} id="section-overview" className="space-y-8 sm:space-y-10">
          {/* Main Hero Project Image Container - only rendered when at least 1 image is enabled */}
          {galleryList.length > 0 && activeImage && (
            <div className="space-y-4">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl group">
                <img
                  src={activeImage}
                  alt={`${project.title} Preview`}
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/projects/temporary/fresh-flow-desktop.v2.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Lightbox Zoom Button */}
                <button
                  onClick={() =>
                    setLightboxImage({
                      url: activeImage,
                      title: `${project.title} — Image ${selectedGalleryIndex + 1}`,
                      caption: project.tagline || project.description,
                    })
                  }
                  aria-label="View full screen preview"
                  className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-md"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Enlarge</span>
                </button>
              </div>

              {/* Project Gallery (1 to 5 images) */}
              {galleryList.length > 1 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Project Gallery ({galleryList.length} images)</span>
                    </span>
                    <span>
                      Viewing {selectedGalleryIndex + 1} of {galleryList.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1">
                    {galleryList.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedGalleryIndex(idx)}
                        className={`relative shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-xl overflow-hidden border transition-all ${
                          selectedGalleryIndex === idx
                            ? "border-cyan-400 ring-2 ring-cyan-400/30 scale-[1.02]"
                            : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery view ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "/projects/temporary/fresh-flow-desktop.v2.jpg";
                          }}
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-200">
                          {idx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Core Engineering Philosophy Callout Banner */}
          {content.core_philosophy && (
            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 p-5 sm:p-6 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-10 w-10 shrink-0 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> Core Engineering Philosophy
                  </span>
                  <p className="font-display text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                    "{content.core_philosophy}"
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pt-1">
                    Strict verification standard: every diagnostic, structural analysis, and recommended remediation must trace directly to concrete codebase artifacts, package manifests, and git history. Zero speculative hallucination or unverified mutations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Two Kubernetes Environments & Engineering Evolution Flow (SohailShop Special Section) */}
          {isSohailShop && (
            <div className="space-y-6 sm:space-y-8">
              {/* Section Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                    Dual-Cluster Deployment Architecture
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Two Kubernetes Environments
                </h2>
                <p className="text-sm text-slate-300 font-light max-w-3xl">
                  I built the same application and learned deployment across two Kubernetes environments.
                </p>
              </div>

              {/* Side-by-side 2 Environment Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* Box 1: Self-Managed Kubernetes — kubeadm */}
                <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                          <SiKubernetes className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                            SELF-MANAGED
                          </span>
                          <span className="text-xs font-mono text-slate-400">kubeadm</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[11px] font-mono text-cyan-300">
                        EC2 Cluster
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white tracking-tight">
                      Self-Managed Kubernetes — kubeadm
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      First deployed the application on a self-managed Kubernetes cluster using kubeadm, learning cluster networking, storage, workloads, and reverse-proxy behavior.
                    </p>

                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                        Documented Points:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300 font-light">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>1 Control Plane + Worker Nodes</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>Calico CNI</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>local-path storage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>Django Deployment</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>PostgreSQL StatefulSet + PVC</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>Redis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>Nginx-based media serving</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Real media issue */}
                  <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-semibold text-amber-300 block mb-0.5 font-mono text-[11px] uppercase tracking-wider">
                      Real Media Issue Solved:
                    </span>
                    Media files initially failed because Gunicorn cannot directly serve media. Nginx was introduced to serve media separately.
                  </div>
                </div>

                {/* Box 2: AWS EKS */}
                <div className="rounded-2xl border border-amber-500/20 bg-slate-900/50 backdrop-blur-sm p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <FaAws className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                            AWS MANAGED
                          </span>
                          <span className="text-xs font-mono text-slate-400">EKS</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-[11px] font-mono text-amber-300">
                        AWS Cloud
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white tracking-tight">
                      AWS EKS
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      The same application architecture was then implemented on AWS EKS using Terraform and AWS-native infrastructure.
                    </p>

                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                        Documented Points:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300 font-light">
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>Amazon EKS</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>Terraform-managed infrastructure</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>EKS Node Group</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>IAM / IRSA</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>ALB Ingress</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>PostgreSQL → EBS</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>Media → S3</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Real S3 issue */}
                  <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-semibold text-amber-300 block mb-0.5 font-mono text-[11px] uppercase tracking-wider">
                      Real S3 Issue Solved:
                    </span>
                    S3 uploads returned HTTP 500 because of a bucket mismatch after an AWS account change. The environment configuration and IAM role were corrected.
                  </div>
                </div>
              </div>

              {/* Engineering Evolution Flow */}
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-6 sm:p-7 space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-cyan-400" />
                    <span>Project Evolution</span>
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                    Engineering Evolution Flow
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-light">
                    Clear conceptual progression from monolithic backend to automated cloud-native Kubernetes deployment.
                  </p>
                </div>

                {/* Conceptual Flow Sequence */}
                <div className="flex flex-col items-center max-w-md mx-auto py-2 w-full">
                  {/* Step 1 */}
                  <div className="w-full text-center p-3 sm:p-3.5 rounded-xl border border-white/10 bg-slate-800/80 shadow-sm">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Stage 01</div>
                    <div className="text-sm sm:text-base font-semibold text-white">Django Backend</div>
                  </div>

                  <div className="py-2 text-cyan-400/70 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4" />
                  </div>

                  {/* Step 2 */}
                  <div className="w-full text-center p-3 sm:p-3.5 rounded-xl border border-white/10 bg-slate-800/80 shadow-sm">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Stage 02</div>
                    <div className="text-sm sm:text-base font-semibold text-white">Docker + Nginx + Gunicorn</div>
                  </div>

                  <div className="py-2 text-cyan-400/70 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4" />
                  </div>

                  {/* Step 3 */}
                  <div className="w-full text-center p-3 sm:p-3.5 rounded-xl border border-white/10 bg-slate-800/80 shadow-sm">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Stage 03</div>
                    <div className="text-sm sm:text-base font-semibold text-white">EC2 Deployment</div>
                  </div>

                  <div className="py-2 text-cyan-400/70 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4" />
                  </div>

                  {/* Step 4 */}
                  <div className="w-full text-center p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/30 shadow-sm">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Stage 04 · Self-Managed Cluster</div>
                    <div className="text-sm sm:text-base font-semibold text-cyan-200">Self-Managed Kubernetes</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">(kubeadm + Calico)</div>
                  </div>

                  <div className="py-2 text-cyan-400/70 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4" />
                  </div>

                  {/* Step 5 */}
                  <div className="w-full text-center p-3 sm:p-3.5 rounded-xl border border-white/10 bg-slate-800/80 shadow-sm">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Stage 05</div>
                    <div className="text-sm sm:text-base font-semibold text-white">Helm + GitHub Actions</div>
                  </div>

                  <div className="py-2 text-cyan-400/70 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4" />
                  </div>

                  {/* Step 6 */}
                  <div className="w-full text-center p-3 sm:p-3.5 rounded-xl border border-white/10 bg-slate-800/80 shadow-sm">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Stage 06</div>
                    <div className="text-sm sm:text-base font-semibold text-white">ArgoCD GitOps</div>
                  </div>

                  <div className="py-2 text-cyan-400/70 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4" />
                  </div>

                  {/* Step 7 */}
                  <div className="w-full text-center p-3 sm:p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/30 shadow-sm">
                    <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">Stage 07 · Production Cloud-Native</div>
                    <div className="text-sm sm:text-base font-semibold text-amber-200">AWS EKS</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">(Terraform + ALB + S3)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Overview */}
          {(content.overview || project.description) && !isAmFruits && (
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <span>Project Overview</span>
              </h2>
              <div className="text-sm sm:text-base text-slate-300 leading-relaxed font-light whitespace-pre-line space-y-3">
                {content.overview || project.description}
              </div>
            </div>
          )}

          {/* =========================================================================
              AM FRUITS DEDICATED ARCHITECTURE & BUSINESS SYSTEM
             ========================================================================= */}
          {isAmFruits && (
            <div className="space-y-6 sm:space-y-8">
              {/* 1. Project Overview & Two-Sided Platform */}
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                      B2B WHOLESALE COMMERCE PLATFORM
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <span>Project Overview</span>
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                  AM Fruits is a B2B wholesale fruit and grocery platform designed to make wholesale buying easier for business customers while giving the supplier one system to manage the business.
                </p>

                {/* Core Concept Callout Banner */}
                <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 flex items-center justify-between gap-4 flex-wrap text-xs sm:text-sm font-mono">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <ShoppingCart className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-white">Buyer</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-cyan-200">Buy products</span>
                  </div>
                  <div className="h-4 w-px bg-white/10 hidden sm:block" />
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Store className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-white">Owner/Admin</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-emerald-200">Manage business</span>
                  </div>
                </div>

                {/* Two Sides: Buyer vs Owner/Admin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
                  {/* Buyer Side */}
                  <div className="p-5 rounded-2xl border border-cyan-500/20 bg-slate-900/60 space-y-3 hover:border-cyan-500/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                          Buyer Capabilities
                        </h3>
                        <span className="text-[11px] font-mono text-cyan-400">Customer Procurement Workflow</span>
                      </div>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-light">
                      {[
                        "Browse/search wholesale products",
                        "Cart",
                        "Checkout",
                        "Orders",
                        "Online payment",
                        "Order tracking",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Owner/Admin Side */}
                  <div className="p-5 rounded-2xl border border-emerald-500/20 bg-slate-900/60 space-y-3 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Store className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                          Owner / Admin Operations
                        </h3>
                        <span className="text-[11px] font-mono text-emerald-400">Supplier Business Management</span>
                      </div>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300 font-light">
                      {[
                        "Products",
                        "Categories",
                        "Inventory",
                        "Warehouses",
                        "Customers",
                        "Orders",
                        "Invoices",
                        "Delivery areas",
                        "Shipping methods",
                        "Reports",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Technical Architecture */}
              <div className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                    Technical Architecture
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Frontend", value: "React 19 + TypeScript + Vite", icon: <SiReact className="text-cyan-400" /> },
                    { label: "API", value: "tRPC", icon: <SiTrpc className="text-blue-400" /> },
                    { label: "Backend", value: "Node.js + Hono", icon: <SiHono className="text-orange-400" /> },
                    { label: "Database", value: "Neon PostgreSQL + Drizzle ORM", icon: <SiPostgresql className="text-sky-400" /> },
                    { label: "Validation", value: "Zod", icon: <SiZod className="text-blue-500" /> },
                    { label: "Payments", value: "Razorpay", icon: <CreditCard className="text-blue-400" /> },
                    { label: "Email", value: "Resend", icon: <Mail className="text-white" /> },
                    { label: "Deployment", value: "Docker + Nginx + AWS EC2 + Cloudflare", icon: <SiDocker className="text-blue-400" /> },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-slate-900/60 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white leading-snug font-mono">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Business Flow Card */}
              <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-3.5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-cyan-400" />
                    <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
                      End-to-End Business Flow
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Architectural Pipeline</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap py-1">
                  {[
                    { label: "Business", color: "border-slate-700 bg-slate-800/90 text-slate-200" },
                    { label: "Buyer/Admin", color: "border-cyan-500/30 bg-cyan-950/40 text-cyan-300" },
                    { label: "React", color: "border-sky-500/30 bg-sky-950/40 text-sky-300" },
                    { label: "tRPC", color: "border-blue-500/30 bg-blue-950/40 text-blue-300" },
                    { label: "Hono", color: "border-orange-500/30 bg-orange-950/40 text-orange-300" },
                    { label: "Drizzle", color: "border-lime-500/30 bg-lime-950/40 text-lime-300" },
                    { label: "Neon", color: "border-emerald-500/30 bg-emerald-950/40 text-emerald-300" },
                    { label: "Razorpay/Resend", color: "border-purple-500/30 bg-purple-950/40 text-purple-300" },
                    { label: "Docker", color: "border-blue-500/30 bg-blue-950/40 text-blue-300" },
                    { label: "Nginx", color: "border-teal-500/30 bg-teal-950/40 text-teal-300" },
                    { label: "AWS", color: "border-amber-500/30 bg-amber-950/40 text-amber-300" },
                    { label: "Cloudflare", color: "border-orange-500/30 bg-orange-950/40 text-orange-300" },
                  ].map((node, idx, arr) => (
                    <React.Fragment key={node.label}>
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium shadow-sm ${node.color}`}>
                        {node.label}
                      </span>
                      {idx < arr.length - 1 && (
                        <span className="text-slate-500 text-xs font-mono select-none px-0.5">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 4. Key Engineering Features */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                    Key Engineering Features
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Role-based access for buyers and administrators",
                    "PostgreSQL business data model",
                    "Product and inventory management",
                    "Cart and order lifecycle",
                    "Order-item snapshots preserving historical transaction data",
                    "Razorpay payment integration with server-side payment verification",
                    "Resend transactional email notifications",
                    "Docker-based production deployment",
                    "Nginx reverse proxy",
                    "Cloudflare production domain/DNS",
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-slate-900/40 text-xs sm:text-sm text-slate-200 hover:border-emerald-500/30 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Core Business Flow */}
              <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-3.5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight">
                      Core Business Flow
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">Commerce Lifecycle</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
                  {[
                    "Product",
                    "Cart",
                    "Checkout",
                    "Payment",
                    "Order",
                    "Invoice",
                    "Inventory",
                  ].map((step, idx, arr) => (
                    <React.Fragment key={step}>
                      <div className="px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-xs sm:text-sm font-mono text-cyan-200 whitespace-nowrap flex items-center gap-2 shadow-sm">
                        <span className="text-[10px] text-cyan-400 font-bold">0{idx + 1}</span>
                        <span className="font-medium">{step}</span>
                      </div>
                      {idx < arr.length - 1 && (
                        <span className="text-slate-500 text-xs font-mono select-none px-0.5">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 6. Production Architecture */}
              <div className="p-6 sm:p-7 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                      Production Architecture
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">Live Infrastructure Topology</span>
                </div>

                {/* Vertical Ingress Architecture Diagram */}
                <div className="max-w-md mx-auto space-y-2 py-1">
                  {[
                    { title: "Customer", desc: "Browser / Client Application", color: "border-slate-700 bg-slate-800/80 text-white" },
                    { title: "Cloudflare", desc: "Edge CDN, DNS & DDoS Protection", color: "border-orange-500/30 bg-orange-950/20 text-orange-200" },
                    { title: "Nginx", desc: "Reverse Proxy, Rate Limiting & SSL Termination", color: "border-teal-500/30 bg-teal-950/20 text-teal-200" },
                    { title: "Docker / Node.js + Hono", desc: "Containerized Backend API & Application Server on AWS EC2", color: "border-cyan-500/30 bg-cyan-950/20 text-cyan-200" },
                    { title: "Neon PostgreSQL", desc: "Serverless Database with Drizzle ORM", color: "border-sky-500/30 bg-sky-950/20 text-sky-200" },
                  ].map((tier, idx, arr) => (
                    <React.Fragment key={tier.title}>
                      <div className={`p-3 rounded-xl border text-center space-y-0.5 ${tier.color}`}>
                        <div className="text-xs sm:text-sm font-bold font-mono">{tier.title}</div>
                        <div className="text-[11px] font-light opacity-80">{tier.desc}</div>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex justify-center text-cyan-400/60 py-0.5">
                          <ArrowDown className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* External Services */}
                <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/60 space-y-1">
                    <span className="font-mono font-semibold text-cyan-300 block">External Service: Razorpay</span>
                    <p className="text-slate-300 font-light leading-relaxed">
                      Handles secure checkout payments with server-side HMAC-SHA256 signature verification.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-white/5 bg-slate-900/60 space-y-1">
                    <span className="font-mono font-semibold text-purple-300 block">External Service: Resend</span>
                    <p className="text-slate-300 font-light leading-relaxed">
                      Transactional email delivery dispatching order receipts, invoices, and operational alerts.
                    </p>
                  </div>
                </div>
              </div>

              {/* 7. Strong Short Closing */}
              <div className="p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-900/40 backdrop-blur-sm">
                <p className="text-xs sm:text-sm md:text-base text-cyan-100/90 font-light leading-relaxed italic text-center">
                  &ldquo;AM Fruits connects the complete wholesale business workflow — from product discovery and purchasing to payment, order management, invoicing, inventory, and supplier operations — in one production-oriented platform.&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Project Resources (Optional) */}
          {hasAnyResource && (
            <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                <span>Project Resources</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                {gitUrl && (
                  <a
                    href={gitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-slate-800/80 hover:bg-slate-700 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-colors"
                  >
                    <FaGithub className="h-4 w-4 text-slate-300" />
                    <span>Git Repository</span>
                  </a>
                )}
                {websiteUrl && (
                  <a
                    href={websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/50 text-xs sm:text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-colors shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4 text-cyan-400" />
                    <span>{isAmFruits ? "Live App ↗" : "Website"}</span>
                  </a>
                )}
                {videoUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/50 text-xs sm:text-sm font-medium text-rose-300 hover:text-rose-200 transition-colors shadow-sm"
                  >
                    <Play className="h-4 w-4 text-rose-400" />
                    <span>Video</span>
                  </a>
                )}
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-950/40 hover:bg-amber-900/50 text-xs sm:text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors shadow-sm"
                  >
                    <Download className="h-4 w-4 text-amber-400" />
                    <span>PDF</span>
                  </a>
                )}
                {docUrl && (
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 text-xs sm:text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-purple-400" />
                    <span>Documentation</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Implemented Features */}
          {!isAmFruits && implementedFeatures.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Implemented Features</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {implementedFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-slate-900/40 text-xs sm:text-sm text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Business Flow */}
          {!isAmFruits && content.business_flow && content.business_flow.trim() && (
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-2.5">
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Important Business Flow</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {content.business_flow}
              </p>
            </div>
          )}

          {/* Payment System & Security */}
          {!isSohailShop && !isAmFruits && content.payment_security && content.payment_security.trim() && (
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-2.5">
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Payment System & Security</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {content.payment_security}
              </p>
            </div>
          )}

          {/* Order Data / Historical Records */}
          {!isAmFruits && content.order_data_preservation && content.order_data_preservation.trim() && (
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm space-y-2.5">
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <History className="h-4 w-4 text-cyan-400" />
                <span>Order Data / Historical Records</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
                {content.order_data_preservation}
              </p>
            </div>
          )}

          {/* Technologies Arsenal */}
          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm space-y-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Technology Stack</span>
            </h3>

            <div className="flex flex-wrap gap-2 pt-1">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-slate-800/80 text-xs font-mono text-slate-200 hover:border-cyan-500/40 transition-colors"
                >
                  {getTechBadgeIcon(tech)}
                  <span>{tech}</span>
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="text-slate-200 font-medium">{project.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-slate-200 font-medium">{project.status}</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FLAGSHIP CASE STUDY SECTION: THREE ISOLATED EXECUTION PLANES
           ========================================================================= */}
        {hasPlanesSection && content.execution_planes && (
          <section ref={planesRef} id="section-planes" className="space-y-6 pt-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                    SYSTEM ARCHITECTURE & EXECUTION BOUNDARIES
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  Three Isolated Execution Planes
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-xs">
                <Lock className="h-3.5 w-3.5" />
                <span>Strict Plane Isolation Enforced</span>
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-4xl">
              To protect host systems from unintended mutations, Sohail-Studio strictly decouples advisory artificial intelligence from shell execution and multi-stage workflow automation. AI chat is architecturally prohibited from directly mutating disk or executing commands without human confirmation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
              {content.execution_planes.map((plane, idx) => {
                const isAdvisory = plane.type === "advisory";
                const isInteractive = plane.type === "interactive";

                return (
                  <div
                    key={plane.name}
                    className={`relative rounded-2xl border p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between transition-all ${
                      isAdvisory
                        ? "border-cyan-500/30 bg-slate-900/50 hover:border-cyan-500/50"
                        : isInteractive
                        ? "border-emerald-500/30 bg-slate-900/50 hover:border-emerald-500/50"
                        : "border-purple-500/30 bg-slate-900/50 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border ${
                            isAdvisory
                              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                              : isInteractive
                              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                              : "border-purple-400/30 bg-purple-400/10 text-purple-300"
                          }`}
                        >
                          {isAdvisory && <Cpu className="h-3 w-3" />}
                          {isInteractive && <Terminal className="h-3 w-3" />}
                          {!isAdvisory && !isInteractive && <Workflow className="h-3 w-3" />}
                          <span>{plane.badge}</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          PLANE 0{idx + 1}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-bold text-white tracking-tight">
                          {plane.name}
                        </h3>
                        <p
                          className={`text-xs font-mono font-medium mt-0.5 ${
                            isAdvisory
                              ? "text-cyan-400"
                              : isInteractive
                              ? "text-emerald-400"
                              : "text-purple-400"
                          }`}
                        >
                          {plane.role}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {plane.description}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                          Core Capabilities
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300 font-light">
                          {plane.capabilities.map((cap, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2">
                              <span
                                className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                                  isAdvisory
                                    ? "bg-cyan-400"
                                    : isInteractive
                                    ? "bg-emerald-400"
                                    : "bg-purple-400"
                                }`}
                              />
                              <span>{cap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10">
                      <div className="rounded-xl bg-black/40 border border-white/5 p-3 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5 text-amber-400" />
                          Boundary Enforcement
                        </span>
                        <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                          {plane.securityBoundary}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
            FLAGSHIP CASE STUDY SECTION: DEEP INSPECTOR & INTELLIGENCE
           ========================================================================= */}
        {hasCapabilitiesSection && content.system_capabilities && (
          <section ref={capabilitiesRef} id="section-capabilities" className="space-y-6 pt-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                  SYSTEM CAPABILITIES & EMPIRICAL DIAGNOSTICS
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Deep Inspector & Project Intelligence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {content.system_capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                        {cap.tagline}
                      </span>
                      <FileSearch className="h-4 w-4 text-cyan-400" />
                    </div>

                    <h3 className="font-display text-lg font-bold text-white tracking-tight">
                      {cap.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {cap.description}
                    </p>

                    {cap.evidenceSource && (
                      <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          Grounding Evidence Sources
                        </span>
                        <p className="text-xs font-mono text-cyan-300/90 leading-relaxed">
                          {cap.evidenceSource}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Key Engineering Protocols
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-light">
                      {cap.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            FLAGSHIP CASE STUDY SECTION: PERSISTENCE ARCHITECTURE
           ========================================================================= */}
        {hasPersistenceSection && content.persistence_architecture && (
          <section ref={persistenceRef} id="section-persistence" className="space-y-6 pt-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                  DATA ARCHITECTURE & DURABILITY MODEL
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Persistence Architecture
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Implementation Card */}
              <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/50 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-mono font-medium">
                    <HardDrive className="h-3.5 w-3.5" />
                    <span>{content.persistence_architecture.currentStatus}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">ACTIVE RUNTIME</span>
                </div>

                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  Local-First In-Memory & Structured File Engine
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {content.persistence_architecture.currentDescription}
                </p>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Storage Engine Specifications
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300 font-light">
                    {content.persistence_architecture.currentStorage.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Future Roadmap Card */}
              <div className="p-6 rounded-2xl border border-blue-500/30 bg-slate-900/50 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 text-xs font-mono font-medium">
                    <Database className="h-3.5 w-3.5" />
                    <span>{content.persistence_architecture.roadmapStatus}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">DISTRIBUTED EVOLUTION</span>
                </div>

                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  Cloud SQL & PostgreSQL Telemetry Sync
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {content.persistence_architecture.roadmapDescription}
                </p>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Target Distributed Infrastructure
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300 font-light">
                    {content.persistence_architecture.roadmapStorage.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Server className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 2: VIDEO SESSIONS (Reusing Cinema/DevOps Video Player)
           ========================================================================= */}
        {isVideoSessionsVisible && (
          <section ref={videosRef} id="section-videos" className="space-y-6 pt-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                    VIDEO MASTERCLASS & WALKTHROUGHS
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  Video Sessions
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {content.videos.length} {content.videos.length === 1 ? "Session" : "Sessions"} Available
              </span>
            </div>

            {/* In-Page Video Player */}
            {activeVideo && (
              <div className="rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-slate-950 p-3 sm:p-5 shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-3 sm:space-y-4">
                {/* Embed Container */}
                <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-white/10">
                  {getProjectVideoEmbedUrl(activeVideo.video_url) ? (
                    <iframe
                      src={getProjectVideoEmbedUrl(activeVideo.video_url)!}
                      title={activeVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                      <Play className="h-12 w-12 text-cyan-400 mb-3" />
                      <p className="text-white font-semibold">{activeVideo.title}</p>
                      <a
                        href={activeVideo.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-all"
                      >
                        <span>Open Video Stream</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Video Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div>
                    {activeVideo.name && (
                      <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider block">
                        {activeVideo.name}
                      </span>
                    )}
                    <h3 className="font-display text-base sm:text-lg font-bold text-white">
                      {activeVideo.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeVideo.duration && (
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-white/10 text-xs font-mono text-slate-300">
                        ⏱ {activeVideo.duration}
                      </span>
                    )}
                    <a
                      href={activeVideo.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-cyan-300 hover:underline px-2 py-1"
                    >
                      <span>External Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {activeVideo.description && (
                  <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed pt-1">
                    {activeVideo.description}
                  </p>
                )}
              </div>
            )}

            {/* Video Session Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
              {content.videos.map((vid, idx) => {
                const isCurrent = activeVideo?.id === vid.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setActiveVideo(vid);
                      scrollToSection("videos");
                    }}
                    className={`group relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isCurrent
                        ? "border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                        : "border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-white/20"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="text-cyan-400 font-semibold">
                          {vid.name || `Session ${String(idx + 1).padStart(2, "0")}`}
                        </span>
                        {vid.duration && <span>{vid.duration}</span>}
                      </div>

                      <h4 className="font-display text-sm font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                        {vid.title}
                      </h4>

                      {vid.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {vid.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className={isCurrent ? "text-cyan-300 font-semibold" : "text-slate-500"}>
                        {isCurrent ? "Currently Playing" : "Click to Play"}
                      </span>
                      <Play
                        className={`h-3.5 w-3.5 transition-transform group-hover:scale-125 ${
                          isCurrent ? "text-cyan-400 fill-cyan-400" : "text-slate-400"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 3: README / DOCUMENTATION & PDF VIEWER
           ========================================================================= */}
        {isDocumentsSectionVisible && (
          <section ref={docsRef} id="section-docs" className="space-y-6 pt-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                  DOCUMENTATION & RUNBOOKS
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                README / Documentation
              </h2>
            </div>

            {/* Document Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-2">
              {content.documents.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedDocIndex === idx
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                      : "text-slate-400 hover:text-white border border-transparent hover:bg-white/5"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>{doc.title}</span>
                  <span className="uppercase text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10">
                    {doc.type}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Document Viewport */}
            {activeDoc && (
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950 p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      {activeDoc.title}
                    </h3>
                    {activeDoc.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{activeDoc.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeDoc.url && (
                      <>
                        <a
                          href={activeDoc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Open in New Tab</span>
                        </a>
                        <a
                          href={activeDoc.url}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Render PDF or Markdown Content */}
                {activeDoc.type === "pdf" && activeDoc.url ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900 aspect-[4/3] sm:aspect-[16/10] max-h-[600px]">
                    <iframe
                      src={`${activeDoc.url}#toolbar=1`}
                      title={activeDoc.title}
                      className="w-full h-full"
                    />
                  </div>
                ) : activeDoc.content ? (
                  <div className="p-4 sm:p-6 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[500px]">
                    {activeDoc.content}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 font-mono text-xs space-y-2">
                    <p>Document URL: {activeDoc.url || "Attached with deployment repository"}</p>
                    {activeDoc.url && (
                      <a
                        href={activeDoc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-cyan-400 hover:underline"
                      >
                        Inspect documentation external link →
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            SECTION 4: ARCHITECTURE & SYSTEM DIAGRAMS
           ========================================================================= */}
        {isArchitectureVisible && (
          <section ref={architectureRef} id="section-architecture" className="space-y-6 pt-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                  SYSTEM BLUEPRINTS & SCHEMATICS
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Architecture & Diagrams
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {content.architecture.map((diagram) => (
                <div
                  key={diagram.id}
                  onClick={() =>
                    setLightboxImage({
                      url: diagram.image_url,
                      title: diagram.title,
                      caption: diagram.caption || diagram.description,
                    })
                  }
                  className="group cursor-pointer rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/80 overflow-hidden shadow-lg transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={diagram.image_url}
                      alt={diagram.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/projects/temporary/sohail-shop-desktop.v2.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 text-xs font-mono text-cyan-300 border border-cyan-500/40 shadow-xl">
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Inspect Diagram</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-1.5">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {diagram.title}
                    </h3>
                    {diagram.caption && (
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                        {diagram.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 5: PROJECT LINKS & REPOSITORIES
           ========================================================================= */}
        {(() => {
          const linksToRender = isAmFruits
            ? content.links
                .filter(
                  (link) =>
                    link.type !== "github" &&
                    !link.title.toLowerCase().includes("git") &&
                    !link.url.toLowerCase().includes("github.com")
                )
                .map((link) =>
                  link.type === "demo" || link.type === "live"
                    ? { ...link, title: "Live App ↗", url: "https://amfruits.shop" }
                    : link
                )
            : content.links;

          if (isAmFruits && !linksToRender.some((l) => l.url === "https://amfruits.shop")) {
            linksToRender.unshift({
              id: "link-amfruits-live-ecosystem",
              title: "Live App ↗",
              url: "https://amfruits.shop",
              type: "live",
            });
          }

          if (linksToRender.length === 0) return null;

          return (
            <section ref={linksRef} id="section-links" className="space-y-6 pt-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
                    EXTERNAL ECOSYSTEM
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  Project Links & Resources
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {linksToRender.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 rounded-2xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                        {link.type}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
                        {link.title}
                      </h4>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Bottom Back to Projects Button */}
        <div className="pt-8 border-t border-white/10 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-sm font-medium text-slate-200 hover:text-white transition-all shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to All Projects</span>
          </Link>
        </div>
      </main>

      {/* =========================================================================
          LIGHTBOX MODAL FOR IMAGES / DIAGRAMS
         ========================================================================= */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full rounded-3xl border border-white/20 bg-slate-950 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">
                {lightboxImage.title}
              </h3>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-auto rounded-xl flex items-center justify-center bg-black/40">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            {lightboxImage.caption && (
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {lightboxImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
