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
} from "react-icons/si";
import { FaAws, FaGithub } from "react-icons/fa";
import {
  fetchProjectDetailsById,
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
  return <Code2 className="text-cyan-400" />;
}

export default function ProjectInformationPage() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<FullProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active video session in player
  const [activeVideo, setActiveVideo] = useState<ProjectVideoSession | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Active document selected in documentation viewer
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  // Lightbox for architecture diagrams / hero image
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    caption?: string;
  } | null>(null);

  // Active navigation section
  const [activeSection, setActiveSection] = useState<
    "overview" | "videos" | "docs" | "architecture" | "links"
  >("overview");

  const overviewRef = useRef<HTMLDivElement>(null);
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
      setLoading(true);
      setError(null);
      const data = await fetchProjectDetailsById(id);
      setProject(data);
      if (data.content.videos.length > 0) {
        setActiveVideo(data.content.videos[0]);
      }
    } catch (err: any) {
      console.error("Failed to load project information:", err);
      setError(err?.message || "Unable to retrieve project information.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loadData]);

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

  const scrollToSection = (section: "overview" | "videos" | "docs" | "architecture" | "links") => {
    setActiveSection(section);
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    if (section === "overview") targetRef = overviewRef;
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
  const activeDoc = content.documents[selectedDocIndex] || null;

  // Status styling
  const statusStyles = {
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
  }[project.status];

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

          {/* Action Links (GitHub, Live App) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <FaGithub className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Source Code</span>
              </a>
            )}

            {project.liveUrl && (
              <a
                href={
                  project.liveUrl.startsWith("http")
                    ? project.liveUrl
                    : `https://${project.liveUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>Live App</span>
                <ExternalLink className="h-3.5 w-3.5" />
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

          {content.videos.length > 0 && (
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

          {content.documents.length > 0 && (
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

          {content.architecture.length > 0 && (
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

        {/* =========================================================================
            SECTION 1: OVERVIEW & HERO IMAGE
           ========================================================================= */}
        <section ref={overviewRef} id="section-overview" className="space-y-6 sm:space-y-8">
          {/* Hero Image Container */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950 overflow-hidden shadow-2xl group">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-900">
              <img
                src={project.hero_image}
                alt={`${project.title} Hero View`}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/projects/temporary/sohail-shop-desktop.jpg";
                }}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-80" />

              {/* Lightbox Zoom Button */}
              <button
                onClick={() =>
                  setLightboxImage({
                    url: project.hero_image,
                    title: project.title,
                    caption: project.tagline || project.description,
                  })
                }
                aria-label="View full screen preview"
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Enlarge</span>
              </button>
            </div>
          </div>

          {/* Description & Technical Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" />
                <span>System Overview</span>
              </h2>

              <div className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-light space-y-3">
                <p>{content.overview || project.description}</p>
              </div>

              {/* Highlights Checkmarks */}
              {content.highlightsList && content.highlightsList.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
                    Key Highlights & Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {content.highlightsList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-xl border border-white/5 bg-slate-900/40 text-xs sm:text-sm text-slate-200"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Technologies Arsenal Column */}
            <div className="lg:col-span-4 space-y-4">
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

                <div className="pt-3 border-t border-white/5 space-y-2 text-xs font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-slate-200">{project.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-slate-200">{project.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: VIDEO SESSIONS (Reusing Cinema/DevOps Video Player)
           ========================================================================= */}
        {content.videos.length > 0 && (
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
        {content.documents.length > 0 && (
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
        {content.architecture.length > 0 && (
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
                          "/projects/temporary/sohail-shop-desktop.jpg";
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
        {content.links.length > 0 && (
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
              {content.links.map((link) => (
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
        )}

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
