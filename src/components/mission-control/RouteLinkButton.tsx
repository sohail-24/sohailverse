import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface RouteLinkButtonProps {
  children: ReactNode;
  className?: string;
  to: string;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClasses = {
  primary:
    "bg-[#081521] text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#10283d] focus-visible:ring-[#081521]/15",
  secondary:
    "border border-white/70 bg-white/80 text-[#081521] shadow-soft hover:-translate-y-0.5 hover:bg-white focus-visible:ring-[#2F6BFF]/20",
  ghost:
    "border border-white/60 bg-white/[0.55] text-[#081521] hover:border-[#2F6BFF]/20 hover:bg-white/80 focus-visible:ring-[#2F6BFF]/20",
};

export default function RouteLinkButton({
  children,
  className,
  to,
  variant = "primary",
}: RouteLinkButtonProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
