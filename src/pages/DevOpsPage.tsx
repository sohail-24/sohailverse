import PageShell from "../components/layout/PageShell";
import GlassPanel from "../components/ui/GlassPanel";
import Badge from "../components/ui/Badge";

const technologies = [
  "AWS",
  "Docker",
  "Kubernetes",
  "Linux",
  "Git",
  "GitHub",
  "Cloudflare",
  "Jenkins",
];

const projects = [
  {
    name: "SohailVerse",
    stack: "React + Cloudflare",
    description:
      "Personal universe platform combining travel, learning, movies, and DevOps.",
  },
  {
    name: "School Management System",
    stack: "Django + DevOps",
    description:
      "Full-stack academic management platform with deployment planning.",
  },
  {
    name: "Kubernetes Cluster",
    stack: "Kubeadm + Calico",
    description:
      "Multi-node cluster built for learning orchestration and networking.",
  },
  {
    name: "GitOps Experiments",
    stack: "ArgoCD",
    description:
      "Learning declarative deployments and Git-driven infrastructure.",
  },
];

export default function DevOpsPage() {
  return (
    <PageShell
      eyebrow="DevOps Forge"
      title="Building Systems That Scale"
      description="A collection of cloud, automation, infrastructure, and platform engineering projects shaping my DevOps journey."
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Technologies</p>
          <p className="mt-2 text-4xl font-bold">8+</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Projects</p>
          <p className="mt-2 text-4xl font-bold">10+</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Cloud Platforms</p>
          <p className="mt-2 text-4xl font-bold">2</p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm text-muted">Years Learning</p>
          <p className="mt-2 text-4xl font-bold">3+</p>
        </GlassPanel>
      </div>

      {/* Technologies */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Technology Stack
        </h2>

        <div className="flex flex-wrap gap-3">
          {technologies.map((tech) => (
            <Badge key={tech} variant="accent">
              {tech}
            </Badge>
          ))}
        </div>
      </GlassPanel>

      {/* Current Focus */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          Current Focus
        </h2>

        <div className="flex flex-wrap gap-3">
          <Badge variant="accent">Kubernetes</Badge>
          <Badge variant="accent">GitOps</Badge>
          <Badge variant="accent">Cloudflare Workers</Badge>
          <Badge variant="accent">Cloudflare D1</Badge>
          <Badge variant="accent">React</Badge>
          <Badge variant="accent">Platform Engineering</Badge>
        </div>
      </GlassPanel>

      {/* Projects */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          Featured Projects
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <GlassPanel
              key={project.name}
              className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lifted"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {project.name}
                </h3>

                <span className="text-sm text-muted">
                  {project.stack}
                </span>
              </div>

              <p className="mt-4 leading-7 text-muted">
                {project.description}
              </p>
            </GlassPanel>
          ))}
        </div>
      </div>

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
              Cloud architecture, networking, security, and AWS services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">
              DevOps Engineer Training
            </h3>

            <p className="text-muted">
              Docker, Kubernetes, Linux, Git, CI/CD, and automation.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Journey Timeline */}
      <GlassPanel className="p-8">
        <h2 className="mb-6 text-2xl font-semibold">
          DevOps Journey
        </h2>

        <div className="border-l-2 border-accent pl-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold">
              Engineering Degree
            </h3>

            <p className="text-muted">
              Electronics & Instrumentation Engineering
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              AWS Learning
            </h3>

            <p className="text-muted">
              Cloud foundations and architecture concepts.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              DevOps Training
            </h3>

            <p className="text-muted">
              Docker, Kubernetes, Linux, Git, and CI/CD.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Building SohailVerse
            </h3>

            <p className="text-muted">
              Applying cloud and DevOps concepts through real projects.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Philosophy */}
      <GlassPanel className="p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Why DevOps?
        </h2>

        <p className="leading-8 text-muted">
          DevOps combines development, automation, cloud computing,
          and operations into a single discipline focused on building
          reliable systems. I enjoy creating solutions that are scalable,
          repeatable, and continuously improving through automation.
        </p>
      </GlassPanel>
    </PageShell>
  );
}