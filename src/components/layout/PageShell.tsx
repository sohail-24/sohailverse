import type { PropsWithChildren } from "react";
import Badge from "../ui/Badge";
import { cn } from "../../lib/utils";

interface PageShellProps extends PropsWithChildren {
  title: string;
  description: string;
  eyebrow?: string;
  className?: string;
}

export default function PageShell({
  title,
  description,
  eyebrow,
  className,
  children,
}: PageShellProps) {
  return (
    <section className={cn("flex flex-col gap-cluster", className)}>
      <header className="max-w-3xl space-y-4">
        {eyebrow ? <Badge variant="neutral">{eyebrow}</Badge> : null}
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

