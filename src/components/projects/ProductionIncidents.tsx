export default function ProductionIncidents() {
  return (
    <section className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/50 p-5 sm:p-8">
      <h2 className="mb-4 sm:mb-8 text-xl sm:text-3xl font-bold">
        Production Incidents Solved
      </h2>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 bg-slate-900/40">
          <h3 className="font-semibold text-sm sm:text-base text-white">
            PVC Pending
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Diagnosed missing EBS CSI Driver and implemented dynamic storage provisioning.
          </p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 bg-slate-900/40">
          <h3 className="font-semibold text-sm sm:text-base text-white">
            S3 Upload Failures
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Resolved IAM permission conflicts after AWS account migration.
          </p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 bg-slate-900/40">
          <h3 className="font-semibold text-sm sm:text-base text-white">
            Redis Connection Failure
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Fixed service discovery and network policy misconfigurations.
          </p>
        </div>
      </div>
    </section>
  );
}
