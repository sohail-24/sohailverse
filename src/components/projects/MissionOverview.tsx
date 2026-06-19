export default function MissionOverview() {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
      <h2 className="mb-6 text-3xl font-bold">
        Mission Overview
      </h2>

      <p className="leading-8 text-slate-300">
        SohailShop is a production-grade ecommerce platform
        built during my internship at Visys Cloud Technologies.

        The goal was to design, build, containerize,
        deploy and operate a complete application across
        multiple infrastructure environments.

        The platform includes custom authentication,
        product catalog management, inventory tracking,
        cart and checkout workflows, PostgreSQL persistence,
        Redis caching, CI/CD automation and GitOps delivery.

        What makes this project unique is that the same
        application was deployed on both a self-managed
        Kubernetes cluster using kubeadm and a managed
        AWS EKS platform, providing deep understanding
        of Kubernetes from cluster internals to
        cloud-native production operations.
      </p>
    </section>
  );
}