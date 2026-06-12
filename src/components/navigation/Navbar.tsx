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
      <GlassPanel className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <NavLink to="/" end className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent-strong shadow-soft">
              SV
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold tracking-tight text-ink">
                {profile.productName}
              </p>
              <p className="truncate text-sm text-muted">{profile.name}</p>
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
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/90 text-ink shadow-soft"
                    : "text-muted hover:bg-white/65 hover:text-ink",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-2 text-sm text-muted shadow-soft md:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
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

