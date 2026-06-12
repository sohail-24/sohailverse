import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-ink/90 focus-visible:ring-ink/10",
  secondary:
    "border border-white/70 bg-white/80 text-ink shadow-soft hover:-translate-y-0.5 hover:bg-white focus-visible:ring-accent/20",
  ghost: "bg-transparent text-ink hover:bg-white/60 focus-visible:ring-accent/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "md", type = "button", variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;

