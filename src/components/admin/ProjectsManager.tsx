import React, { useState, useEffect, useMemo } from "react";
import {
  FolderGit2,
  Plus,
  Search,
  SlidersHorizontal,
  Edit3,
  Trash2,
  ExternalLink,
  GitBranch,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
  Code2,
  Info,
  Layers,
} from "lucide-react";
import { loadUnifiedProjects, type UnifiedProject } from "../projects/projectData";
import type { DevOpsPost } from "./AuthenticatedCMS";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface ProjectsManagerProps {
  devops: DevOpsPost[];
  onRefreshDevops: () => Promise<void>;
}

export default function ProjectsManager({
  devops,
  onRefreshDevops,
}: ProjectsManagerProps) {
  const [projects, setProjects] = useState<UnifiedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search, Filter & Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "database" | "static">("all");
  const [sortBy, setSortBy] = useState<"default" | "title" | "source">("default");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    id: number;
    title: string;
    category: string;
    description: string;
    technologies: string;
    status: string;
  } | null>(null);
  const [deletingProject, setDeletingProject] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [staticInfoProject, setStaticInfoProject] = useState<UnifiedProject | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTechnologies, setFormTechnologies] = useState("");
  const [formStatus, setFormStatus] = useState("Production Ready");

  // Action status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const clearFeedbackAfterDelay = () => {
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  // Load unified projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const list = await loadUnifiedProjects();
      setProjects(list);
    } catch (err) {
      console.error("Failed to load unified projects:", err);
      setFeedback({
        type: "error",
        message: "Failed to load unified project catalog.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [devops]);

  // Helper to determine if a project is backed by a real database record in /api/devops
  const getDatabaseRecordForProject = (project: UnifiedProject): DevOpsPost | undefined => {
    // If ID is numeric, check directly
    if (typeof project.id === "number") {
      return devops.find((d) => d.id === project.id);
    }
    // If project is sohail-shop, it maps to devops record ID 1 or title matching
    if (project.id === "sohail-shop") {
      return devops.find(
        (d) =>
          d.id === 1 ||
          d.title.toLowerCase().includes("sohail") ||
          d.title.toLowerCase().includes("shop")
      );
    }
    // Match by title
    return devops.find(
      (d) =>
        d.title.toLowerCase().includes(String(project.title).toLowerCase()) ||
        String(project.title).toLowerCase().includes(d.title.toLowerCase())
    );
  };

  // Extract categories
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return Array.from(set).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          searchTerm === "" ||
          p.title.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.technologies.some((t) => t.toLowerCase().includes(term));

        const matchesCat =
          selectedCategory === "all" ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();

        const dbRecord = getDatabaseRecordForProject(p);
        const isDb = Boolean(dbRecord);

        const matchesSource =
          sourceFilter === "all" ||
          (sourceFilter === "database" && isDb) ||
          (sourceFilter === "static" && !isDb);

        return matchesSearch && matchesCat && matchesSource;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "source") {
          const aDb = Boolean(getDatabaseRecordForProject(a));
          const bDb = Boolean(getDatabaseRecordForProject(b));
          return Number(bDb) - Number(aDb);
        }
        return 0; // natural order from loadUnifiedProjects()
      });
  }, [projects, searchTerm, selectedCategory, sourceFilter, sortBy, devops]);

  // Handle Add Project
  const handleOpenAdd = () => {
    setFormTitle("");
    setFormCategory("Cloud Native Architecture");
    setFormDescription("");
    setFormTechnologies("");
    setFormStatus("Production Ready");
    setFeedback(null);
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formCategory.trim() || !formDescription.trim()) {
      setFeedback({
        type: "error",
        message: "Please fill in all required fields (Title, Category, Description).",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);
      // Persist to real /api/devops database endpoint
      const res = await fetch("/api/devops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory.trim(),
          description: formDescription.trim(),
          technologies: formTechnologies.trim() || undefined,
          status: formStatus.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || data.data)) {
        setFeedback({
          type: "success",
          message: `Project "${formTitle.trim()}" added to database and unified portfolio.`,
        });
        setIsAddModalOpen(false);
        await onRefreshDevops();
        await fetchProjects();
        clearFeedbackAfterDelay();
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Unable to save this project. Please try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "Connection error occurred while saving project.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Project
  const handleOpenEdit = (project: UnifiedProject) => {
    const dbRecord = getDatabaseRecordForProject(project);
    if (!dbRecord) {
      // Static project definition: cannot be safely persisted without dedicated endpoint
      setStaticInfoProject(project);
      return;
    }

    setEditingProject({
      id: dbRecord.id,
      title: dbRecord.title,
      category: dbRecord.category,
      description: dbRecord.description,
      technologies: dbRecord.technologies || project.technologies.join(", "),
      status: dbRecord.status || "Production Ready",
    });
    setFormTitle(dbRecord.title);
    setFormCategory(dbRecord.category);
    setFormDescription(dbRecord.description);
    setFormTechnologies(dbRecord.technologies || project.technologies.join(", "));
    setFormStatus(dbRecord.status || "Production Ready");
    setFeedback(null);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!formTitle.trim() || !formCategory.trim() || !formDescription.trim()) {
      setFeedback({
        type: "error",
        message: "Please fill in all required fields (Title, Category, Description).",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback(null);
      const res = await fetch(`/api/devops/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory.trim(),
          description: formDescription.trim(),
          technologies: formTechnologies.trim() || null,
          status: formStatus.trim() || "Active",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || data.data)) {
        setFeedback({
          type: "success",
          message: `Project "${formTitle.trim()}" updated successfully in database.`,
        });
        setEditingProject(null);
        await onRefreshDevops();
        await fetchProjects();
        clearFeedbackAfterDelay();
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Unable to save changes to this project. Please try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "Connection error occurred while updating project.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Remove Project
  const handleOpenRemove = (project: UnifiedProject) => {
    const dbRecord = getDatabaseRecordForProject(project);
    if (!dbRecord) {
      setStaticInfoProject(project);
      return;
    }

    setDeletingProject({
      id: dbRecord.id,
      title: dbRecord.title,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/devops/${deletingProject.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || res.status === 200)) {
        setFeedback({
          type: "success",
          message: `Project "${deletingProject.title}" removed from database and portfolio.`,
        });
        setDeletingProject(null);
        await onRefreshDevops();
        await fetchProjects();
        clearFeedbackAfterDelay();
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Unable to remove project. Please try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "Connection error occurred while removing project.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
              : feedback.type === "error"
              ? "bg-red-950/40 border-red-500/30 text-red-200"
              : "bg-cyan-950/40 border-cyan-500/30 text-cyan-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : feedback.type === "error" ? (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          ) : (
            <Info className="h-5 w-5 text-cyan-400 shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-medium flex-1">{feedback.message}</p>
          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Module Header Container */}
      <div className="rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <FolderGit2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Projects Manager
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold">
                  {projects.length} {projects.length === 1 ? "Project" : "Projects"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Manage your flagship applications and cloud project portfolio
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] min-h-[44px] shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Toolbar: Search, Filter, Origin Filter, Sort */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Bar */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, category, description, tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none transition-colors"
            >
              <option value="all">All Categories ({projects.length})</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Origin / Source Filter */}
          <div className="sm:col-span-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none transition-colors"
            >
              <option value="all">All Sources</option>
              <option value="database">Database Records</option>
              <option value="static">Static Definitions</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none transition-colors"
            >
              <option value="default">Default Order</option>
              <option value="title">Title (A → Z)</option>
              <option value="source">Source (Database first)</option>
            </select>
          </div>
        </div>

        {/* Records Library Grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-8 w-8 mx-auto border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                Loading Projects portfolio...
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30">
              <FolderGit2 className="h-10 w-10 mx-auto text-slate-600 mb-3" />
              {projects.length === 0 ? (
                <>
                  <p className="text-base font-semibold text-white">
                    No projects available yet
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                    Get started by adding your first project to the portfolio.
                  </p>
                  <button
                    onClick={handleOpenAdd}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add your first project</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">
                    No projects match your filter criteria
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try clearing search query or adjusting source and category filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSourceFilter("all");
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => {
                const dbRecord = getDatabaseRecordForProject(project);
                const isDatabaseBacked = Boolean(dbRecord);

                return (
                  <div
                    key={String(project.id)}
                    className="group flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-emerald-500/30 transition-all shadow-sm"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {isDatabaseBacked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold">
                            <Database className="h-3 w-3" />
                            Database #{dbRecord!.id}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px]">
                            <Code2 className="h-3 w-3" />
                            Static Definition
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          {project.statusLabel && (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-white/10 text-slate-300 font-mono text-xs">
                              {project.statusLabel}
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-white text-base sm:text-lg group-hover:text-emerald-200 transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Chips */}
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/5 text-[11px] font-mono text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-emerald-300 font-mono transition-colors"
                          >
                            <GitBranch className="h-3 w-3 shrink-0" />
                            <span>Code</span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={`https://${project.liveUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-emerald-300 font-mono transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span>Live App</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-mono text-slate-500">
                        {isDatabaseBacked ? "Persisted in DB" : "Static Code Definition"}
                      </div>
                      <div className="flex items-center gap-2">
                        {isDatabaseBacked ? (
                          <>
                            <button
                              onClick={() => handleOpenEdit(project)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-800/60 hover:bg-slate-700/70 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleOpenRemove(project)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-950/20 hover:bg-red-900/40 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Remove</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setStaticInfoProject(project)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-950/20 hover:bg-amber-900/40 text-xs font-medium text-amber-300 transition-colors"
                          >
                            <Info className="h-3.5 w-3.5" />
                            <span>Definition Info</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/95 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FolderGit2 className="h-4 w-4" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">Add Project</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sohail-Pay Cloud Microservices"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Native Architecture"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Production Ready">Production Ready</option>
                    <option value="Running">Running</option>
                    <option value="Active">Active</option>
                    <option value="In Development">In Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Description & Highlights *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe project architecture, engineering achievements, or system workflow..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, Node.js, PostgreSQL, Docker"
                  value={formTechnologies}
                  onChange={(e) => setFormTechnologies(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal (for database-backed projects) */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/95 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Edit3 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Edit Project</h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Database Record #{editingProject.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="Production Ready">Production Ready</option>
                    <option value="Running">Running</option>
                    <option value="Active">Active</option>
                    <option value="In Development">In Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formTechnologies}
                  onChange={(e) => setFormTechnologies(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Static Definition Info Modal (Explicit NEEDS EVIDENCE transparency) */}
      {staticInfoProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-amber-500/20 bg-slate-950/95 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setStaticInfoProject(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Info className="h-5 w-5" />
              </div>
              <div className="space-y-2 flex-1 pr-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-semibold">
                  NEEDS EVIDENCE
                </div>
                <h3 className="font-display text-lg font-bold text-white leading-snug">
                  Static Flagship Definition: "{staticInfoProject.title}"
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  This project is defined statically in the codebase bundle at{" "}
                  <span className="font-mono text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">
                    src/data/mission-control.ts
                  </span>{" "}
                  and currently does not have a database table or backing REST endpoint.
                </p>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5 text-xs text-slate-400">
                  <p className="font-semibold text-slate-300">Architectural Note:</p>
                  <p>
                    In accordance with strict data integrity rules, fake persistence is disallowed. To allow dynamic editing or removal of this specific flagship project, a dedicated database schema and API route (e.g. <span className="font-mono text-cyan-300">/api/projects</span>) must be provided.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStaticInfoProject(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm font-medium text-white transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for DB-backed projects */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProject)}
        title="Remove this project?"
        itemName={deletingProject?.title}
        itemType="project"
        isDeleting={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProject(null)}
      />
    </section>
  );
}
