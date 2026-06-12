import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

type AcademyPost = {
  id: number;
  skill: string;
  category: string;
  level: string;
};

export default function AcademyPage() {
  const [skills, setSkills] = useState<AcademyPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://sohailverse-api.sohailkhan88008.workers.dev/api/academy"
    )
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load academy data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell
      eyebrow="Learning Hub"
      title="Building Knowledge, One System at a Time"
      description="A living collection of technologies, certifications, experiments, and lessons shaping my DevOps journey."
    >
      <>
        {/* Learning Stats */}

        <div className="grid gap-4 md:grid-cols-4">
          <GlassPanel className="p-6">
            <p className="text-sm text-muted">Technologies</p>
            <p className="mt-2 text-4xl font-bold">
              {skills.length}
            </p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-sm text-muted">Projects Built</p>
            <p className="mt-2 text-4xl font-bold">15+</p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-sm text-muted">Years Learning</p>
            <p className="mt-2 text-4xl font-bold">3+</p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <p className="text-sm text-muted">Certifications</p>
            <p className="mt-2 text-4xl font-bold">2</p>
          </GlassPanel>
        </div>

        {/* Skills From Database */}

        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            Learning Domains
          </h2>

          {loading ? (
            <GlassPanel className="p-6">
              Loading skills...
            </GlassPanel>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {skills.map((skill) => (
                <GlassPanel
                  key={skill.id}
                  className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
                >
                  <h3 className="text-xl font-semibold">
                    {skill.skill}
                  </h3>

                  <p className="mt-3 text-muted">
                    Category: {skill.category}
                  </p>

                  <p className="mt-2 text-sm text-accent">
                    Level: {skill.level}
                  </p>
                </GlassPanel>
              ))}
            </div>
          )}
        </div>

        {/* Current Focus */}

        <GlassPanel className="p-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Current Focus
          </h2>

          <div className="flex flex-wrap gap-3">
            <Badge variant="accent">Kubernetes</Badge>
            <Badge variant="accent">GitOps</Badge>
            <Badge variant="accent">Cloudflare</Badge>
            <Badge variant="accent">React</Badge>
            <Badge variant="accent">DevOps Projects</Badge>
          </div>
        </GlassPanel>

        {/* Certifications */}

        <GlassPanel className="p-8">
          <h2 className="mb-6 text-2xl font-semibold">
            Certifications & Training
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">
                AWS Solutions Architect Associate Training
              </h3>

              <p className="text-muted">
                Cloud architecture, networking, security,
                and AWS services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                DevOps Engineer Training
              </h3>

              <p className="text-muted">
                Docker, Kubernetes, CI/CD, Linux, Git,
                and automation.
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Learning Timeline */}

        <GlassPanel className="p-8">
          <h2 className="mb-6 text-2xl font-semibold">
            Learning Timeline
          </h2>

          <div className="border-l-2 border-accent pl-6 space-y-8">
            <div>
              <h3 className="font-semibold text-lg">
                Engineering Degree
              </h3>

              <p className="text-muted">
                Electronics & Instrumentation Engineering
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                AWS Learning
              </h3>

              <p className="text-muted">
                Solutions Architect Associate preparation
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                DevOps Journey
              </h3>

              <p className="text-muted">
                Docker, Kubernetes, Linux, CI/CD
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                SohailVerse
              </h3>

              <p className="text-muted">
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