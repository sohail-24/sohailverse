import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  FolderGit2,
  Film,
  Terminal,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { primaryNavItems } from "../../data/navigation";
import { isNavLinkActive } from "./Navbar";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/timeline": Compass,
  "/projects": FolderGit2,
  "/cinema": Film,
  "/devops": Terminal,
  "/admin": SlidersHorizontal,
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const location = useLocation();
  const navLinks = primaryNavItems;
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key or window resize to desktop
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    function handleResize() {
      if (window.innerWidth >= 768) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Lightweight backdrop - ensures page remains visible behind while capturing outside clicks */}
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1px] md:hidden"
            aria-hidden="true"
          />

          {/* Compact floating navigation panel anchored below the hamburger button */}
          <motion.div
            key="mobile-nav-panel"
            ref={menuRef}
            id="mobile-navigation"
            role="menu"
            aria-label="Navigation Menu"
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-4 sm:right-6 top-[calc(100%+0.5rem)] z-50 w-56 sm:w-60 max-w-[calc(100vw-2rem)] md:hidden rounded-2xl border border-white/10 bg-slate-950/95 p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.7),0_0_24px_rgba(96,165,250,0.06)] backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation Destinations">
              {navLinks.map((item) => {
                const active = isNavLinkActive(location.pathname, item.path);
                const Icon = navIcons[item.path] || Terminal;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    role="menuitem"
                    onClick={onClose}
                    className={cn(
                      "group relative flex min-h-[44px] items-center justify-between rounded-xl px-3 py-2 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime-400 active:scale-[0.98]",
                      active
                        ? "bg-lime-400/[0.08] border border-lime-400/25 text-white font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                        : "border border-transparent text-slate-300 hover:border-white/5 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Subtle active neon-lime indicator */}
                      {active ? (
                        <span className="h-3.5 w-1 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)] flex-shrink-0" />
                      ) : (
                        <span className="h-3.5 w-1 rounded-full bg-transparent flex-shrink-0" />
                      )}

                      {/* Meaningful destination icon */}
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors duration-150",
                          active
                            ? "text-lime-400"
                            : "text-slate-400 group-hover:text-cyan-300"
                        )}
                      />

                      {/* Destination label */}
                      <span className="truncate tracking-wide">{item.label}</span>
                    </div>

                    {/* Forward arrow micro-interaction */}
                    <ChevronRight
                      className={cn(
                        "h-3.5 w-3.5 flex-shrink-0 transition-all duration-150",
                        active
                          ? "text-lime-400 opacity-90"
                          : "text-slate-500 opacity-0 -translate-x-1 group-hover:opacity-80 group-hover:translate-x-0"
                      )}
                    />
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
