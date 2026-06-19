export default function ProductionIncidents() {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8">
      <h2 className="mb-8 text-3xl font-bold">
        Production Incidents Solved
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 p-6">
          <h3 className="font-semibold">
            PVC Pending
          </h3>

          <p className="mt-3 text-slate-400">
            Diagnosed missing EBS CSI Driver and
            implemented dynamic storage provisioning.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          <h3 className="font-semibold">
            S3 Upload Failures
          </h3>

          <p className="mt-3 text-slate-400">
            Resolved IAM permission conflicts after
            AWS account migration.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-6">
          <h3 className="font-semibold">
            Redis 500 Errors
          </h3>

          <p className="mt-3 text-slate-400">
            Fixed infrastructure dependency issues
            affecting application availability.
          </p>
        </div>
      </div>
    </section>
  );
}