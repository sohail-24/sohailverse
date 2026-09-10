import { useState, type FormEvent } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
} from "lucide-react";

interface AdminAccessPanelProps {
  password: string;
  setPassword: (val: string) => void;
  loginError: string;
  loginLoading: boolean;
  onSubmit: (e?: FormEvent) => void;
}

export default function AdminAccessPanel({
  password,
  setPassword,
  loginError,
  loginLoading,
  onSubmit,
}: AdminAccessPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-2xl p-5 sm:p-6 lg:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.75),0_0_35px_rgba(14,165,233,0.12)] overflow-hidden">
        {/* Top edge neon rim highlight */}
        <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />

        {/* Ambient interior glow */}
        <div className="absolute -top-16 left-12 w-64 h-24 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header - Strongly Left-Aligned Command Identity */}
        <div className="mb-4 sm:mb-5 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              ADMIN ACCESS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Enter administrator password to access SohailVerse CMS.
          </p>
        </div>

        {/* Access Form - Wide Responsive Command Bar */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Password Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <KeyRound className="h-4 w-4 text-slate-500" />
              </div>

              <input
                id="admin-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/15 bg-slate-900/90 pl-10 pr-11 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/25 transition-all duration-200 min-h-[46px]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Login Action Button */}
            <button
              type="submit"
              disabled={loginLoading || !password}
              className="group sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-lime-400 hover:from-cyan-400 hover:to-lime-300 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_24px_rgba(6,182,212,0.35)] hover:shadow-[0_0_32px_rgba(6,182,212,0.5)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none min-h-[46px] whitespace-nowrap cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login to Admin Console</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* Validation / Error Alert */}
          {loginError && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-950/60 p-2.5 text-xs sm:text-sm text-red-300 flex items-center gap-2 animate-shake"
            >
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}
        </form>

        {/* Capabilities & Security row */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Add</span>
            <span className="text-cyan-400">·</span>
            <span className="text-slate-300">Edit</span>
            <span className="text-lime-400">·</span>
            <span className="text-slate-300">Delete Content</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Secure Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
