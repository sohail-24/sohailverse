import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";
import { fetchApi, isValidAcademyPost, type AcademyPost } from "../lib/api";
import { ErrorState, EmptyState, LoadingSkeleton } from "../components/ui/StatusStates";

export default function AcademyPage() {
  const [skills, setSkills] = useState<AcademyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<AcademyPost>("/api/academy", isValidAcademyPost);
      setSkills(data);
    } catch (err: any) {
      console.error("Failed to load academy data:", err);
      setError(err?.message || "Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  return (
    <PageShell
      eyebrow="Learning Hub"
      title="Building Knowledge, One System at a Time"
      description="A living collection of technologies, certifications, experiments, and lessons shaping my DevOps journey."
    >
      <>
        {/* Learning Stats */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <GlassPanel className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-muted">Technologies</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">
              {loading ? "..." : error ? "-" : skills.length}
            </p>
          </GlassPanel>

          <GlassPanel className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-muted">Projects Built</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">15+</p>
          </GlassPanel>

          <GlassPanel className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-muted">Years Learning</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">3+</p>
          </GlassPanel>

          <GlassPanel className="p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-muted">Certifications</p>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">2</p>
          </GlassPanel>
        </div>

        {/* Skills From Database */}

        <div>
          <h2 className="mb-3 text-xl sm:text-2xl font-semibold">
            Learning Domains
          </h2>

          {loading ? (
            <LoadingSkeleton label="Loading skills from D1 database..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadSkills} />
          ) : skills.length === 0 ? (
            <EmptyState message="No skills found in the academy." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {skills.map((skill) => (
                <GlassPanel
                  key={skill.id}
                  className="p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
                >
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {skill.skill}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-muted">
                    Category: {skill.category}
                  </p>

                  <p className="mt-1.5 text-xs sm:text-sm font-medium text-accent">
                    Level: {skill.level}
                  </p>
                </GlassPanel>
              ))}
            </div>
          )}
        </div>

        {/* Current Focus */}

        <GlassPanel className="p-5 sm:p-8">
          <h2 className="mb-3 text-xl sm:text-2xl font-semibold">
            Current Focus
          </h2>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Badge variant="accent" className="text-xs">Kubernetes</Badge>
            <Badge variant="accent" className="text-xs">GitOps</Badge>
            <Badge variant="accent" className="text-xs">Cloudflare</Badge>
            <Badge variant="accent" className="text-xs">React</Badge>
            <Badge variant="accent" className="text-xs">DevOps Projects</Badge>
          </div>
        </GlassPanel>

        {/* Certifications */}

        <GlassPanel className="p-5 sm:p-8">
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
            Certifications & Training
          </h2>

          <div className="space-y-4 sm:space-y-5">
            <div>
              <h3 className="font-semibold text-base sm:text-lg">
                AWS Solutions Architect Associate Training
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
                Cloud architecture, networking, security,
                and AWS services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg">
                DevOps Engineer Training
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
                Docker, Kubernetes, CI/CD, Linux, Git,
                and automation.
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Learning Timeline */}

        <GlassPanel className="p-5 sm:p-8">
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
            Learning Timeline
          </h2>

          <div className="border-l-2 border-accent pl-4 sm:pl-6 space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-semibold text-base sm:text-lg">
                Engineering Degree
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-muted">
                Electronics & Instrumentation Engineering
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg">
                AWS Learning
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-muted">
                Solutions Architect Associate preparation
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg">
                DevOps Journey
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-muted">
                Docker, Kubernetes, Linux, CI/CD
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg">
                SohailVerse
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-muted">
                Building a personal universe of travel,
                learning, movies and DevOps.
              </p>
            </div>
          </div>
        </GlassPanel>
      </>
    </PageShell>
  );
}