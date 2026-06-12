import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "accent" | "neutral" | "subtle";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: "bg-accent-soft/90 text-accent-strong",
  neutral: "bg-white/80 text-muted",
  subtle: "bg-white/[0.55] text-muted",
};

export default function Badge({ className, variant = "subtle", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
