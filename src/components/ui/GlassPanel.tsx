import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type GlassPanelProps = HTMLAttributes<HTMLDivElement>;

export default function GlassPanel({ className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-white/60 bg-white/[0.65] shadow-glass backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
