import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";
import { profile } from "../../data/profile";
import GlassPanel from "../ui/GlassPanel";

export default function Footer() {
  return (
    <footer className="px-4 pb-6 sm:px-6 lg:px-8">
      <GlassPanel
        className="
          mx-auto
          w-full
          max-w-7xl
          px-6
          py-6
          bg-slate-950/60
          border-white/10
          backdrop-blur-xl
        "
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          {/* Left Side */}
          <div className="space-y-3">
            <p className="font-display text-lg font-semibold tracking-tight text-white">
              {profile.productName}
            </p>

            <p className="max-w-xl text-sm leading-6 text-slate-400">
              {profile.motto}
            </p>

            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              {profile.name} · Phase 2 Universe
            </p>
          </div>

          {/* Right Side */}
          <div className="space-y-4">

            <nav
              className="flex flex-wrap gap-4"
              aria-label="Footer"
            >
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className="
                    text-sm
                    font-medium
                    text-slate-400
                    transition-all
                    duration-300
                    hover:text-blue-300
                  "
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} {profile.name}
              </p>

              <p className="text-sm text-slate-500">
                Built for SohailVerse v2.0
              </p>

            </div>

          </div>

        </div>
      </GlassPanel>
    </footer>
  );
}