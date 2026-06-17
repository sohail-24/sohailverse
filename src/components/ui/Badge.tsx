import type {
  HTMLAttributes,
} from "react";

import { cn } from "../../lib/utils";

type BadgeVariant =
  | "accent"
  | "neutral"
  | "subtle";

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<
  BadgeVariant,
  string
> = {
  accent:
    "bg-blue-500/15 text-blue-300 border border-blue-400/20",

  neutral:
    "bg-slate-800/80 text-slate-200 border border-slate-700",

  subtle:
    "bg-slate-900/60 text-slate-400 border border-slate-800",
};

export default function Badge({
  className,
  variant = "subtle",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        `
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        uppercase
        tracking-[0.2em]
        `,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}