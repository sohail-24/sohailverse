import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
import { profile } from "../../data/profile";
import { cn } from "../../lib/utils";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import GlassPanel from "../ui/GlassPanel";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div
      id="mobile-navigation"
      className={cn("mx-auto mt-3 w-full max-w-7xl lg:hidden", open ? "block" : "hidden")}
    >
      <GlassPanel className="space-y-5 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="font-display text-lg font-semibold text-ink">{profile.productName}</p>
            <p className="text-sm text-muted">{profile.motto}</p>
          </div>
          <Badge variant="neutral">{profile.status}</Badge>
        </div>

        <nav className="grid gap-2" aria-label="Mobile primary">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "border-accent/25 bg-accent-soft/80 text-accent-strong shadow-soft"
                    : "border-white/60 bg-white/[0.65] text-ink hover:border-accent/20 hover:bg-white",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={onClose}>
            Dismiss
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
