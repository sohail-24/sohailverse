import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "hsl(var(--color-canvas) / <alpha-value>)",
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        panel: "hsl(var(--color-panel) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        ink: "hsl(var(--color-ink) / <alpha-value>)",
        muted: "hsl(var(--color-muted) / <alpha-value>)",
        accent: {
          DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
          soft: "hsl(var(--color-accent-soft) / <alpha-value>)",
          strong: "hsl(var(--color-accent-strong) / <alpha-value>)",
        },
        success: "hsl(var(--color-success) / <alpha-value>)",
        warning: "hsl(var(--color-warning) / <alpha-value>)",
      },
      spacing: {
        gutter: "var(--space-gutter)",
        card: "var(--space-card)",
        cluster: "var(--space-cluster)",
        section: "var(--space-section)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        glass: "var(--shadow-glass)",
        lifted: "var(--shadow-lifted)",
      },
      borderRadius: {
        panel: "var(--radius-panel)",
      },
      backgroundImage: {
        atmosphere:
          "radial-gradient(circle at top left, rgba(103, 184, 255, 0.24), transparent 34%), radial-gradient(circle at top right, rgba(17, 168, 154, 0.16), transparent 30%), linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(244, 248, 255, 0.98))",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "photo-in": {
          "0%": { opacity: "0", transform: "scale(1.035)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        drift: {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "100%": { transform: "translate3d(2.5rem, -1.75rem, 0) scale(1.07)" },
        },
        "drift-alt": {
          "0%": { transform: "translate3d(0, 0, 0) scale(1.05)" },
          "100%": { transform: "translate3d(-2.25rem, 1.5rem, 0) scale(1)" },
        },
        "scroll-line": {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "35%": { transform: "scaleY(1)", opacity: "1" },
          "100%": { transform: "scaleY(1)", opacity: "0" },
        },
        "drawer-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "photo-in": "photo-in 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) both",
        drift: "drift 24s ease-in-out infinite alternate",
        "drift-alt": "drift-alt 30s ease-in-out infinite alternate",
        "scroll-line": "scroll-line 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "drawer-in": "drawer-in 0.35s cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "fade-in": "fade-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;

