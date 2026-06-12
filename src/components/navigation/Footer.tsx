import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
import { profile } from "../../data/profile";
import GlassPanel from "../ui/GlassPanel";

export default function Footer() {
  return (
    <footer className="px-4 pb-6 sm:px-6 lg:px-8">
      <GlassPanel className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-display text-lg font-semibold tracking-tight text-ink">
            {profile.productName}
          </p>
          <p className="max-w-xl text-sm leading-6 text-muted">{profile.motto}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-muted/80">
            {profile.name} · Phase 1 scaffold
          </p>
        </div>

        <div className="space-y-3">
          <nav className="flex flex-wrap gap-3" aria-label="Footer">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className="text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {profile.name}. Built for SohailVerse v2.0.
          </p>
        </div>
      </GlassPanel>
    </footer>
  );
}

