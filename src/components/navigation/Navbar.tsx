import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import MobileMenu from "./MobileMenu";
import { primaryNavItems } from "../../data/navigation";

export function isNavLinkActive(pathname: string, targetPath: string): boolean {
  if (targetPath === "/") {
    return pathname === "/";
  }
  if (targetPath === "/timeline") {
    return pathname === "/timeline" || pathname === "/about";
  }
  if (targetPath === "/projects") {
    return pathname === "/projects" || pathname.startsWith("/projects/");
  }
  if (targetPath === "/cinema") {
    return pathname === "/cinema" || pathname.startsWith("/cinema/");
  }
  if (targetPath === "/devops") {
    return pathname === "/devops" || pathname.startsWith("/devops/");
  }
  if (targetPath === "/admin") {
    return pathname === "/admin" || pathname === "/console" || pathname.startsWith("/admin/") || pathname.startsWith("/console/");
  }
  return pathname === targetPath;
}

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = primaryNavItems;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Left: Brand logo treatment </> sohaildevops */}
        <NavLink to="/" end className="flex items-center gap-2 group flex-shrink-0">
          <span className="font-mono text-base font-bold text-lime-400">&lt;/&gt;</span>
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-lime-300 transition-colors">
            sohail<span className="text-lime-400">devops</span>
          </span>
        </NavLink>

        {/* Center: Editorial navigation with exact 6 destinations */}
        <nav className="hidden items-center gap-5 lg:gap-8 md:flex" aria-label="Primary">
          {navLinks.map((item) => {
            const active = isNavLinkActive(location.pathname, item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                  active
                    ? "text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-lime-400 after:rounded-full after:shadow-[0_0_8px_rgba(163,230,53,0.8)]"
                    : "text-slate-300 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Let's Connect CTA Button & Mobile Trigger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="mailto:mdsohail88008@gmail.com"
            className="relative hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-4 py-1.5 lg:px-5 lg:py-2 text-xs font-semibold text-white shadow-sm transition hover:border-lime-400/50 hover:bg-slate-900 hover:text-lime-300 active:scale-[0.98]"
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
