import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type GlassPanelProps =
  HTMLAttributes<HTMLDivElement>;

export default function GlassPanel({
  className,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        `
        rounded-panel
        border
        bg-slate-900/60
        border-white/10
        backdrop-blur-xl
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        transition-all
        duration-300
        hover:border-blue-400/20
        hover:shadow-[0_0_25px_rgba(96,165,250,0.15)]
        `,
        className
      )}
      {...props}
    />
  );
}