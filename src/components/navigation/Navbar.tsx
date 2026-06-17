import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { navigation } from "../../data/navigation";
import { profile } from "../../data/profile";
import { cn } from "../../lib/utils";
import GlassPanel from "../ui/GlassPanel";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 px-4 pb-2 pt-4 sm:px-6 lg:px-8">
      <GlassPanel
        className="
        mx-auto
        flex
        w-full
        max-w-7xl
        items-center
        justify-between
        gap-4
        px-4
        py-3
        sm:px-6
        bg-slate-950/70
        border-white/10
      "
      >
        <div className="flex min-w-0 items-center gap-3">
          <NavLink to="/" end className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-sm font-bold text-white shadow-lg">
              SV
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold tracking-tight text-white">
                {profile.productName}
              </p>
              <p className="truncate text-sm text-slate-400">{profile.name}</p>
            </div>
          </NavLink>
          <Badge className="hidden md:inline-flex" variant="accent">
            v2.0
          </Badge>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105",
                  isActive
                    ? `
                        bg-gradient-to-r
                        from-blue-500/20
                        to-indigo-500/20
                        text-blue-300
                        border
                        border-blue-400/20
                        shadow-[0_0_25px_rgba(59,130,246,0.35)]
                      `
                    : `
                        text-slate-400
                        hover:text-white
                        hover:bg-slate-800/60
                      `



                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className="
            hidden
            md:flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-700
            bg-slate-900/70
            px-3
            py-2
            text-sm
            text-slate-300
          "
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{profile.status}</span>
          </div>

          <Button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            className="lg:hidden"
            size="sm"
            variant="secondary"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </Button>
        </div>
      </GlassPanel>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

