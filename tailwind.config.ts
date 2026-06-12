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
    },
  },
  plugins: [],
} satisfies Config;

