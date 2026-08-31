import GlassPanel from "./GlassPanel";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  title?: string;
}

export function ErrorState({
  title = "Unable to Load Data",
  message = "Unable to load data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <GlassPanel className="p-8 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-xl text-rose-400">
          ⚠️
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition-all duration-200 hover:bg-cyan-500/30 hover:shadow-soft"
        >
          🔄 Retry
        </button>
      </div>
    </GlassPanel>
  );
}

interface EmptyStateProps {
  title?: string;
  message: string;
}

export function EmptyState({
  title = "No Records Found",
  message,
}: EmptyStateProps) {
  return (
    <GlassPanel className="p-8 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-3 text-3xl">📡</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>
      </div>
    </GlassPanel>
  );
}

interface LoadingSkeletonProps {
  label?: string;
}

export function LoadingSkeleton({
  label = "Loading from D1 database...",
}: LoadingSkeletonProps) {
  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 text-sm text-muted">
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>{label}</span>
      </div>
    </GlassPanel>
  );
}
