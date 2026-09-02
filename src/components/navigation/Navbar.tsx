import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/timeline" },
    { label: "Journey", path: "/atlas" },
    { label: "Blog", path: "/academy" },
    { label: "Contact", path: "mailto:mdsohail88008@gmail.com", external: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: Brand logo treatment </> sohaildevops */}
        <NavLink to="/" end className="flex items-center gap-2 group">
          <span className="font-mono text-base font-bold text-lime-400">&lt;/&gt;</span>
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-lime-300 transition-colors">
            sohail<span className="text-lime-400">devops</span>
          </span>
        </NavLink>

        {/* Center: Editorial navigation */}
        <nav className="hidden items-center gap-7 lg:gap-9 md:flex" aria-label="Primary">
          {navLinks.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.path}
                className="relative py-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative py-1 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-lime-400 after:rounded-full after:shadow-[0_0_8px_rgba(163,230,53,0.8)]"
                      : "text-slate-300 hover:text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Right: Let's Connect CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:mdsohail88008@gmail.com"
            className="relative hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:border-lime-400/50 hover:bg-slate-900 hover:text-lime-300 active:scale-[0.98]"
          >
            {/* Glowing online green dot */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500 shadow-[0_0_8px_rgba(163,230,53,1)]"></span>
            </span>
            <span>Let&apos;s Connect</span>
            <span className="text-xs">🚀</span>
          </a>

          {/* Mobile Menu Button with Hamburger */}
          <button
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-white/15 bg-slate-950 text-white hover:bg-slate-900 transition"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? (
              <span className="font-mono text-xs font-bold">✕</span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
