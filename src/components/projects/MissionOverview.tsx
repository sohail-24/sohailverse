export default function MissionOverview() {
  return (
    <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8">
      <h2 className="mb-3 sm:mb-6 text-xl sm:text-3xl font-bold">
        Mission Overview
      </h2>

      <p className="text-xs sm:text-base leading-6 sm:leading-8 text-slate-300">
        SohailShop is a production-grade Django 5 ecommerce platform
        engineered to demonstrate modern DevOps practices across
        containerized, self-managed and cloud-native Kubernetes
        environments.
        <br /><br />
        The application was designed as a modular monolith with
        dedicated domains for authentication, products, orders,
        payments and core services. The platform is containerized
        using Docker, automated through GitHub Actions CI/CD,
        deployed through GitOps workflows with ArgoCD and managed
        using Infrastructure as Code with Terraform.
        <br /><br />
        To gain both operational and production experience, the
        same application was deployed across two Kubernetes
        implementations: a self-managed kubeadm cluster running
        on AWS EC2 and a managed AWS EKS environment.
      </p>
    </section>
  );
}
