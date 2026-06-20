export default function MissionOverview() {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
      <h2 className="mb-6 text-3xl font-bold">
        Mission Overview
      </h2>

      <p className="leading-8 text-slate-300">
        SohailShop is a production-grade Django 5 ecommerce platform
        engineered to demonstrate modern DevOps practices across
        containerized, self-managed and cloud-native Kubernetes
        environments.

        The application was designed as a modular monolith with
        dedicated domains for authentication, products, orders,
        payments and core services. The platform is containerized
        using Docker, automated through GitHub Actions CI/CD,
        deployed through GitOps workflows with ArgoCD and managed
        using Infrastructure as Code with Terraform.

        To gain both operational and production experience, the
        same application was deployed across two Kubernetes
        implementations: a self-managed kubeadm cluster running
        on AWS EC2 and a managed AWS EKS environment.

        The project integrates PostgreSQL for persistence, Redis
        for caching, Helm for Kubernetes templating and AWS
        services including IAM, S3 and EBS. Through this project
        I developed practical experience in Kubernetes
        architecture, cloud infrastructure, CI/CD automation,
        GitOps delivery and production troubleshooting.
      </p>
    </section>
  );
}