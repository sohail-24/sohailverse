import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { primaryNavItems } from "../../data/navigation";
import { isNavLinkActive } from "./Navbar";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const location = useLocation();
  const navLinks = primaryNavItems;

  if (!open) return null;

  return (
    <div
      id="mobile-navigation"
      className="mx-4 mt-2 max-w-7xl md:hidden transition-all duration-300"
    >
      <div className="space-y-4 rounded-2xl border border-white/15 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-lime-400">&lt;/&gt;</span>
            <span className="font-display text-base font-bold text-white">sohailverse</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-500/10 px-2.5 py-0.5 text-xs text-lime-400">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
            <span>Active</span>
          </div>
        </div>

        <nav className="grid grid-cols-1 gap-1.5 sm:grid-cols-2" aria-label="Mobile primary">
          {navLinks.map((item) => {
            const active = isNavLinkActive(location.pathname, item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex min-h-[44px] items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 active:scale-[0.98]",
                  active
                    ? "border border-lime-400/40 bg-lime-500/15 text-lime-200 font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    : "border border-white/5 bg-slate-900/60 text-slate-300 hover:border-white/15 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <span>{item.label}</span>
                <span
                  className={cn(
                    "text-xs transition-transform",
                    active ? "text-lime-400 font-bold" : "text-slate-500"
                  )}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-2 border-t border-white/10">
          <a
            href="mailto:mdsohail88008@gmail.com"
            onClick={onClose}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 border border-lime-400/40 py-2.5 text-xs font-bold text-lime-300 transition hover:bg-slate-800"
          >
            <span>Let&apos;s Connect 🚀</span>
          </a>
        </div>
      </div>
    </div>
  );
}
