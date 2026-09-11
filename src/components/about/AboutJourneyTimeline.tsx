import { motion } from "framer-motion";
import {
  GraduationCap,
  Plane,
  Building2,
  ShoppingCart,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import type { TimelinePost } from "../../lib/api";

interface AboutJourneyTimelineProps {
  timeline?: TimelinePost[];
  dbTimeline?: TimelinePost[];
}

interface JourneyMilestone {
  id?: number;
  year: string;
  stage: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: typeof GraduationCap;
  isSpecialHighlight?: boolean;
  isContinuing?: boolean;
  specialBadges?: string[];
  tagLabel?: string;
  tags?: string[];
  note?: string;
  theme: {
    text: string;
    stageBg: string;
    stageBorder: string;
    stageText: string;
    nodeBg: string;
    nodeBorder: string;
    nodeRing: string;
    nodeGlow: string;
    cardBorder: string;
    cardBg: string;
    lineColor: string;
  };
}

const TIMELINE_THEMES = [
  // 0: Emerald (Education & Academic Foundation)
  {
    text: "text-emerald-400",
    stageBg: "bg-emerald-500/10",
    stageBorder: "border-emerald-500/30",
    stageText: "text-emerald-400",
    nodeBg: "bg-emerald-500/15",
    nodeBorder: "border-emerald-400",
    nodeRing: "ring-emerald-400/30",
    nodeGlow: "shadow-[0_0_20px_rgba(52,211,153,0.35)]",
    cardBorder: "border-white/10 hover:border-emerald-500/35",
    cardBg: "bg-slate-900/60 hover:bg-slate-900/80",
    lineColor: "from-emerald-400",
  },
  // 1: Cyan (Exploration, Travel & AWS Genesis)
  {
    text: "text-cyan-400",
    stageBg: "bg-cyan-500/10",
    stageBorder: "border-cyan-500/30",
    stageText: "text-cyan-400",
    nodeBg: "bg-cyan-500/15",
    nodeBorder: "border-cyan-400",
    nodeRing: "ring-cyan-400/30",
    nodeGlow: "shadow-[0_0_20px_rgba(34,211,238,0.35)]",
    cardBorder: "border-white/10 hover:border-cyan-500/35",
    cardBg: "bg-slate-900/60 hover:bg-slate-900/80",
    lineColor: "from-cyan-400",
  },
  // 2: Purple (Hands-on DevOps Internship / Visys)
  {
    text: "text-purple-400",
    stageBg: "bg-purple-500/10",
    stageBorder: "border-purple-500/30",
    stageText: "text-purple-400",
    nodeBg: "bg-purple-500/15",
    nodeBorder: "border-purple-400",
    nodeRing: "ring-purple-400/30",
    nodeGlow: "shadow-[0_0_20px_rgba(192,132,252,0.35)]",
    cardBorder: "border-purple-500/30 hover:border-purple-500/50",
    cardBg: "bg-slate-900/60 hover:bg-slate-900/80",
    lineColor: "from-purple-400",
  },
  // 3: Lime (Flagship Real-World Product / Fresh Flow - Real Users & Transactions)
  {
    text: "text-lime-400",
    stageBg: "bg-lime-500/15",
    stageBorder: "border-lime-400/40",
    stageText: "text-lime-400",
    nodeBg: "bg-lime-500/20",
    nodeBorder: "border-lime-400",
    nodeRing: "ring-lime-400/40",
    nodeGlow: "shadow-[0_0_26px_rgba(163,230,53,0.45)]",
    cardBorder: "border-lime-400/40 hover:border-lime-400/70",
    cardBg: "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-lime-950/30 hover:to-lime-950/40",
    lineColor: "from-lime-400",
  },
  // 4: Sky (Kubernetes Platform Engineering / SohailShop)
  {
    text: "text-sky-400",
    stageBg: "bg-sky-500/10",
    stageBorder: "border-sky-500/30",
    stageText: "text-sky-400",
    nodeBg: "bg-sky-500/15",
    nodeBorder: "border-sky-400",
    nodeRing: "ring-sky-400/30",
    nodeGlow: "shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    cardBorder: "border-sky-500/25 hover:border-sky-400/50",
    cardBg: "bg-slate-900/65 hover:bg-slate-900/85",
    lineColor: "from-sky-400",
  },
];

export default function AboutJourneyTimeline({
  timeline,
  dbTimeline,
}: AboutJourneyTimelineProps) {
  const posts = timeline || dbTimeline || [];

  // Sort posts chronologically: year ascending, then event_date/created_at ascending, then id ascending
  const sortedPosts = [...posts].sort((a, b) => {
    const yearA = parseInt(
      a.year || (a.event_date ? a.event_date.slice(0, 4) : (a.created_at ? a.created_at.slice(0, 4) : "2026")),
      10
    );
    const yearB = parseInt(
      b.year || (b.event_date ? b.event_date.slice(0, 4) : (b.created_at ? b.created_at.slice(0, 4) : "2026")),
      10
    );
    if (yearA !== yearB) return yearA - yearB;
    const dateA = a.event_date || a.created_at || "";
    const dateB = b.event_date || b.created_at || "";
    if (dateA && dateB) return dateA.localeCompare(dateB);
    return (a.id || 0) - (b.id || 0);
  });

  // Preserve database records: internal platform test records like "Timeline CMS Created" remain in Neon,
  // while the public About page focuses on the verified engineering progression.
  const careerPosts = sortedPosts.filter(
    (p) => !(p.title || "").toLowerCase().includes("timeline cms")
  );

  const milestones: JourneyMilestone[] = careerPosts.map((post) => {
    let year = post.year ? post.year.trim() : null;
    if (!year) {
      const yearMatch = post.created_at ? post.created_at.match(/\b(19\d\d|20\d\d)\b/) : null;
      year = yearMatch ? yearMatch[1] : (post.created_at ? post.created_at.slice(0, 4) : "2026");
    }

    const titleLower = (post.title || "").toLowerCase();
    const isFreshFlow = titleLower.includes("fresh flow");
    const isSohailShop = titleLower.includes("sohail-shop") || titleLower.includes("sohailshop");
    const isVisys = titleLower.includes("visys");
    const isEducation = year === "2023" || titleLower.includes("bachelor") || titleLower.includes("engineering degree");
    const isSaudi = year === "2024" || titleLower.includes("saudi");

    let subtitle: string | undefined;
    let specialBadges: string[] | undefined;
    let note: string | undefined;
    let tagLabel: string | undefined;
    let tags: string[] | undefined;
    let theme = TIMELINE_THEMES[0];
    let icon = GraduationCap;
    let isSpecialHighlight = false;
    let isContinuing = false;

    if (isEducation) {
      theme = TIMELINE_THEMES[0]; // Emerald
      icon = GraduationCap;
      subtitle = "Muffakham Jah College of Engineering and Technology · 2019 — 2023";
      specialBadges = ["B.E. DEGREE"];
    } else if (isSaudi) {
      theme = TIMELINE_THEMES[1]; // Cyan
      icon = Plane;
      subtitle = "International Exploration & Cloud Transition";
      specialBadges = ["AWS & DEVOPS GENESIS"];
      tagLabel = "Focus";
      tags = [
        "AWS Cloud",
        "DevOps Fundamentals",
        "Cloud Infrastructure",
        "Linux",
        "Automation",
        "Continuous Learning",
      ];
      note = "Catalyzed the focused shift from engineering foundations into cloud and DevOps systems";
    } else if (isVisys) {
      theme = TIMELINE_THEMES[2]; // Purple
      icon = Building2;
      subtitle = "Visys Cloud Technologies · 6-Month Industry Internship";
      specialBadges = ["6-MONTH DEVOPS INTERNSHIP"];
      tagLabel = "Hands-on";
      tags = [
        "AWS",
        "Docker",
        "Kubernetes / EKS",
        "Terraform",
        "Ansible",
        "Linux",
        "CI/CD (GitHub Actions, Jenkins)",
        "Helm",
        "ArgoCD",
      ];
      note = "Hands-on cloud infrastructure provisioning, Kubernetes orchestration, and deployment automation";
      isContinuing = true;
    } else if (isSohailShop) {
      theme = TIMELINE_THEMES[4]; // Sky
      icon = Terminal;
      subtitle = "Django E-Commerce & GitOps Deployment Architecture";
      specialBadges = ["KUBERNETES & GITOPS"];
      tagLabel = "Architecture";
      tags = [
        "Kubernetes (kubeadm & EKS)",
        "Docker",
        "Terraform",
        "Helm",
        "ArgoCD GitOps",
        "GitHub Actions",
        "PostgreSQL",
        "Redis",
      ];
      note = "Production deployments across both self-managed and managed Kubernetes environments";
    } else if (isFreshFlow) {
      theme = TIMELINE_THEMES[3]; // Lime
      icon = ShoppingCart;
      subtitle = "Live Production Grocery Logistics Platform";
      specialBadges = ["REAL USERS & REAL TRANSACTIONS"];
      tagLabel = "Production";
      tags = [
        "Real Users",
        "Real Transactions",
        "Cloud Infrastructure",
        "Order Routing",
        "API Design",
      ];
      note = "Transition from learning & internship into operating a live product serving real users";
      isSpecialHighlight = true;
    }

    return {
      id: post.id,
      year: year || "2026",
      stage: post.category || "Milestone",
      title: post.title,
      subtitle,
      description: post.description,
      icon,
      isSpecialHighlight,
      isContinuing,
      specialBadges,
      tagLabel,
      tags,
      note,
      theme,
    };
  });

  const years = milestones.map((m) => parseInt(m.year, 10)).filter((y) => !isNaN(y));
  const minYear = years.length > 0 ? Math.min(...years) : 2023;
  const maxYear = years.length > 0 ? Math.max(...years) : 2026;
  const chronologyText =
    milestones.length > 0
      ? minYear === maxYear
        ? `Chronology · ${minYear}`
        : `Chronology · ${minYear} — ${maxYear}`
      : "Chronology · 2023 — 2026";

  return (
    <section id="about-my-journey" className="py-8 sm:py-14">
      {/* Section Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              My Journey
            </h2>
            <div className="w-8 h-1 bg-lime-400 rounded-full mt-2" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
            {chronologyText}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP TIMELINE (md: and up): Spacious Vertical Spine with Left Metadata */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative">
        {/* Continuous Central-Left Spine Rail */}
        <div className="absolute top-6 bottom-8 left-[180px] lg:left-[210px] w-[2px] bg-gradient-to-b from-emerald-400 via-cyan-400 via-purple-400 via-lime-400 to-sky-400 opacity-40 pointer-events-none" />

        {/* Fading Tail indicating open-ended continuation */}
        <div className="absolute -bottom-2 left-[180px] lg:left-[210px] w-[2px] h-10 bg-gradient-to-b from-lime-400 to-transparent opacity-40 pointer-events-none" />

        {milestones.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-md">
            <p className="text-sm font-mono text-slate-400">No timeline milestones found in database.</p>
          </div>
        ) : (
          <div className="space-y-8 lg:space-y-10">
            {milestones.map((m, idx) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.id || m.year + idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="relative flex items-start group"
                >
                  {/* 1. Left Column: Year & Stage Classification */}
                  <div className="w-[180px] lg:w-[210px] pr-8 text-right shrink-0 pt-2">
                    <div className="font-mono text-xl lg:text-2xl font-black tracking-tight">
                      <span className={m.theme.text}>{m.year}</span>
                    </div>
                    <div className="mt-1.5 inline-flex items-center">
                      <span
                        className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${m.theme.stageBg} ${m.theme.stageBorder} ${m.theme.stageText}`}
                      >
                        {m.stage}
                      </span>
                    </div>
                  </div>

                  {/* 2. Center Node on the Spine Rail */}
                  <div className="relative z-10 shrink-0 -ml-[22px] lg:-ml-[24px]">
                    <div
                      className={`w-11 h-11 lg:w-12 lg:h-12 rounded-full ${m.theme.nodeBg} border-2 ${m.theme.nodeBorder} ${m.theme.nodeGlow} ring-4 ${m.theme.nodeRing} flex items-center justify-center bg-slate-950 transition-all duration-300 group-hover:scale-110 shadow-lg`}
                    >
                      <Icon className={`w-5 h-5 ${m.theme.text}`} />
                    </div>
                  </div>

                  {/* 3. Right Column: Milestone Card */}
                  <div className="flex-1 pl-6 lg:pl-8">
                    <div
                      className={`relative rounded-2xl border ${m.theme.cardBorder} ${m.theme.cardBg} backdrop-blur-md p-6 transition-all duration-300 shadow-xl`}
                    >
                      {/* Left triangular pointer notch towards the node */}
                      <div
                        className={`absolute -left-[7px] top-4 w-3.5 h-3.5 bg-slate-900 border-l border-b ${m.theme.cardBorder} rotate-45 pointer-events-none`}
                      />

                      {/* Card Header & Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-lg lg:text-xl font-bold text-white tracking-tight leading-snug">
                            {m.title}
                          </h3>
                          {m.subtitle && (
                            <p className="text-xs font-mono text-slate-400 mt-1">
                              {m.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Special Badges */}
                        {m.specialBadges && (
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {m.specialBadges.map((badge) => (
                              <span
                                key={badge}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider uppercase border shadow-sm ${
                                  m.isSpecialHighlight
                                    ? "bg-lime-400/15 border-lime-400/40 text-lime-400"
                                    : m.year === "2023"
                                    ? "bg-emerald-400/15 border-emerald-400/40 text-emerald-400"
                                    : m.year === "2024"
                                    ? "bg-cyan-400/15 border-cyan-400/40 text-cyan-400"
                                    : m.isContinuing
                                    ? "bg-purple-400/15 border-purple-400/40 text-purple-400"
                                    : "bg-sky-400/15 border-sky-400/40 text-sky-400"
                                }`}
                              >
                                {m.isSpecialHighlight && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                                )}
                                {m.isContinuing && (
                                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                )}
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Story Description */}
                      <p className="text-sm lg:text-base text-slate-300/90 leading-relaxed font-normal mt-3">
                        {m.description}
                      </p>

                      {/* Scannable Skills / Focus Tags */}
                      {m.tags && m.tags.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                          {m.tagLabel && (
                            <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider mr-1">
                              {m.tagLabel}:
                            </span>
                          )}
                          {m.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Context Note */}
                      {m.note && (
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                          {m.isSpecialHighlight ? (
                            <span className="text-lime-400 font-semibold italic">
                              &bull; {m.note}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">
                              &bull; {m.note}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MOBILE TIMELINE (< md:): Compact Single Vertical Timeline                 */}
      {/* ========================================================================= */}
      <div className="md:hidden relative pl-2">
        {/* Continuous Left Spine Rail */}
        <div className="absolute top-5 bottom-6 left-[18px] w-[2px] bg-gradient-to-b from-emerald-400 via-cyan-400 via-purple-400 via-lime-400 to-sky-400 opacity-40 pointer-events-none" />

        {/* Fading Tail for Mobile */}
        <div className="absolute -bottom-1 left-[18px] w-[2px] h-8 bg-gradient-to-b from-lime-400 to-transparent opacity-40 pointer-events-none" />

        {milestones.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6 text-center backdrop-blur-md">
            <p className="text-xs font-mono text-slate-400">No timeline milestones found in database.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {milestones.map((m, idx) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.id || m.year + idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-25px" }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="relative flex items-start gap-3.5 group"
                >
                  {/* Milestone Circular Node on Rail */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <div
                      className={`w-9 h-9 rounded-full ${m.theme.nodeBg} border-2 ${m.theme.nodeBorder} ${m.theme.nodeGlow} ring-2 ${m.theme.nodeRing} flex items-center justify-center bg-slate-950`}
                    >
                      <Icon className={`w-4 h-4 ${m.theme.text}`} />
                    </div>
                  </div>

                  {/* Milestone Mobile Card */}
                  <div
                    className={`relative flex-1 rounded-xl border ${m.theme.cardBorder} ${m.theme.cardBg} backdrop-blur-md p-4 transition-all duration-300 shadow-md`}
                  >
                    {/* Left triangular pointer notch towards the node */}
                    <div
                      className={`absolute -left-[5px] top-3.5 w-2.5 h-2.5 bg-slate-900 border-l border-b ${m.theme.cardBorder} rotate-45 pointer-events-none`}
                    />

                    {/* Year & Stage Header */}
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                      <span className={`font-mono text-xs font-bold tracking-wider ${m.theme.text}`}>
                        {m.year}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${m.theme.stageBg} ${m.theme.stageBorder} ${m.theme.stageText}`}
                      >
                        {m.stage}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-display text-sm font-bold text-white leading-snug">
                      {m.title}
                    </h3>
                    {m.subtitle && (
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5 mb-1.5">
                        {m.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-xs text-slate-300/85 leading-relaxed font-normal mt-1">
                      {m.description}
                    </p>

                    {/* Special Badges on Mobile */}
                    {m.specialBadges && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                        {m.specialBadges.map((badge) => (
                          <span
                            key={badge}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${
                              m.isSpecialHighlight
                                ? "bg-lime-400/15 border-lime-400/40 text-lime-400"
                                : m.year === "2023"
                                ? "bg-emerald-400/15 border-emerald-400/40 text-emerald-400"
                                : m.year === "2024"
                                ? "bg-cyan-400/15 border-cyan-400/40 text-cyan-400"
                                : m.isContinuing
                                ? "bg-purple-400/15 border-purple-400/40 text-purple-400"
                                : "bg-sky-400/15 border-sky-400/40 text-sky-400"
                            }`}
                          >
                            {m.isSpecialHighlight && (
                              <CheckCircle2 className="w-3 h-3 text-lime-400" />
                            )}
                            {m.isContinuing && (
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                            )}
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tags on Mobile */}
                    {m.tags && m.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2.5 pt-2 border-t border-white/10">
                        {m.tagLabel && (
                          <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase mr-1">
                            {m.tagLabel}:
                          </span>
                        )}
                        {m.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mobile note */}
                    {m.note && (
                      <p className={`text-[11px] font-mono italic mt-2 ${m.isSpecialHighlight ? "text-lime-400/90" : "text-slate-400"}`}>
                        &bull; {m.note}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
