import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import MobileMenu from "./MobileMenu";

/**
 * Premium navbar — fixed height (4rem), transparent over the hero and
 * glass-blurred once scrolled. Real routes only:
 * Home · About (/timeline) · Journey (/atlas) · Blog (/academy) · Connect.
 */
const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/timeline" },
  { label: "Journey", path: "/atlas" },
  { label: "Blog", path: "/academy" },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-white/[0.06] bg-[#050811]/80 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink to="/" end className="group flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-lime-300/25 bg-lime-300/[0.06] font-mono text-[11px] font-bold text-lime-300 transition-colors group-hover:border-lime-300/45"
          >
            {"</>"}
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            sohail<span className="text-lime-300">devops</span>
          </span>
        </NavLink>

        {/* Desktop navigation — generous, quiet spacing */}
        <nav className="hidden items-center gap-8 md:flex lg:gap-10" aria-label="Primary">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "relative py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-slate-400 hover:text-white",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-0 right-0 h-px origin-left bg-gradient-to-r from-lime-300 to-cyan-300 transition-opacity duration-200",
                      isActive ? "opacity-90" : "opacity-0",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="mailto:mdsohail88008@gmail.com"
            className="hidden items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/[0.05] px-5 py-2 text-[13px] font-semibold text-lime-100 transition-all duration-200 hover:border-lime-300/50 hover:bg-lime-300/[0.1] hover:text-lime-50 active:scale-[0.98] sm:inline-flex"
          >
            Let&apos;s Connect
          </a>

          {/* Mobile trigger — animated hamburger */}
          <button
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute block h-[1.5px] w-4 rounded-full bg-white transition-all duration-200",
                menuOpen ? "rotate-45" : "-translate-y-[3px]",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute block h-[1.5px] w-4 rounded-full bg-white transition-all duration-200",
                menuOpen ? "-rotate-45" : "translate-y-[3px]",
              )}
            />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
