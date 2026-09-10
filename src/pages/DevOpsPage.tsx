import { useEffect, useState } from "react";
import DevOpsHero from "../components/devops/DevOpsHero";
import DevOpsLearningJourney from "../components/devops/DevOpsLearningJourney";
import DevOpsBottomNav from "../components/devops/DevOpsBottomNav";
import { fetchApi, isValidDevOpsProject, type DevOpsProject } from "../lib/api";

export default function DevOpsPage() {
  const [projects, setProjects] = useState<DevOpsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<DevOpsProject>("/api/devops", isValidDevOpsProject);
      setProjects(data);
    } catch (err: any) {
      console.error("Failed to load devops projects:", err);
      setError(err?.message || "Unable to load data. Please try again.");
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
