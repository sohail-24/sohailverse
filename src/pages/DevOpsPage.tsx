import { useEffect, useState } from "react";
import DevOpsHero from "../components/devops/DevOpsHero";
import DevOpsLearningJourney from "../components/devops/DevOpsLearningJourney";
import DevOpsBottomNav from "../components/devops/DevOpsBottomNav";
import { fetchApi, getCachedApi, isValidDevOpsProject, getFallbackForEndpoint, type DevOpsProject } from "../lib/api";
import { isDevOpsRecord } from "../lib/projectDomain";

export default function DevOpsPage() {
  const cached = getCachedApi<DevOpsProject>("/api/devops");
  const fallback = (getFallbackForEndpoint("devops") as DevOpsProject[]) || [];
  const initialData = cached && cached.length > 0 ? cached : fallback;
  const initialProjects = initialData.filter(isDevOpsRecord);

  const [projects, setProjects] = useState<DevOpsProject[]>(initialProjects);
  const [loading, setLoading] = useState(initialProjects.length === 0);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    if (projects.length === 0) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject);
      if (data && data.length > 0) {
        setProjects(data.filter(isDevOpsRecord));
      }
    } catch (err: any) {
      console.error("Failed to load devops projects:", err);
      if (projects.length === 0) {
        setError(err?.message || "Unable to load data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="flex flex-col gap-10 sm:gap-14 lg:gap-16 pb-20 md:pb-12 w-full animate-fadeIn">
      {/* 1. Hero Section + Aesthetic Desk Visual + Stats Strip */}
      <DevOpsHero projectsCount={projects.length} />

      {/* 2. Your Learning Journey (The 5 DevOps Pillars: Notes, Networking, AWS, DevOps, Learn & Test Projects) */}
      <DevOpsLearningJourney projects={projects} />

      {/* 3. Mobile-specific Sticky Bottom Navigation */}
      <DevOpsBottomNav />
    </div>
  );
}
