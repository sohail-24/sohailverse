import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const menuLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/timeline" },
  { label: "Journey", path: "/atlas" },
  { label: "Projects", path: "/devops" },
  { label: "Blog", path: "/academy" },
  { label: "Cinema", path: "/cinema" },
];

/**
 * Dedicated mobile drawer — slides in from the right with a dimmed
 * backdrop, focusable close affordance, Escape + scroll lock.
 * Never a shrunk-down desktop menu.
 */
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[70] md:hidden"
    >
      {/* Backdrop — click to dismiss */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/70 backdrop-blur-sm motion-safe:animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 flex w-[min(21rem,88%)] flex-col border-l border-white/[0.08] bg-[#070b15]/[0.97] px-6 pb-8 pt-4 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl motion-safe:animate-drawer-in">
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-lime-300/25 bg-lime-300/[0.06] font-mono text-[10px] font-bold text-lime-300"
            >
              {"</>"}
            </span>
            <span className="font-display text-sm font-bold text-white">
              sohail<span className="text-lime-300">devops</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <span aria-hidden="true" className="text-base leading-none">✕</span>
          </button>
        </div>

        {/* Real routes, comfortable tap targets */}
        <nav className="mt-4 flex flex-col" aria-label="Mobile primary">
          {menuLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex min-h-[52px] items-center justify-between rounded-xl px-3 text-[15px] font-medium transition-colors duration-150 active:scale-[0.99]",
                  isActive
                    ? "bg-lime-300/[0.08] text-lime-100"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white",
                )
              }
            >
              <span>{item.label}</span>
              <span aria-hidden="true" className="font-mono text-xs text-slate-600">
                →
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/[0.07] pt-5">
          <a
            href="mailto:mdsohail88008@gmail.com"
            onClick={onClose}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-lime-200 active:scale-[0.99]"
          >
            Let&apos;s Connect
          </a>
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-slate-600">
            Hyderabad · India
          </p>
        </div>
      </div>
    </div>
  );
}
