interface SectionIntroProps {
  eyebrow: string;
  title: string;
  description?: string;
  titleId?: string;
  align?: "left" | "center";
  actions?: React.ReactNode;
}

/**
 * Shared homepage section header — editorial eyebrow + display title,
 * deliberately quieter than the old badge-driven headings.
 */
export default function SectionIntro({
  eyebrow,
  title,
  description,
  titleId,
  align = "left",
  actions,
}: SectionIntroProps) {
  const centered = align === "center";

  return (
    <div
      className={
        centered
          ? "mx-auto max-w-2xl space-y-3 text-center"
          : "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className={centered ? "space-y-3" : "space-y-3 sm:max-w-2xl"}>
        <p className="flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-slate-500">
          {centered ? null : <span aria-hidden="true" className="h-px w-6 bg-lime-300/60" />}
          {eyebrow}
        </p>

        <h2
          id={titleId}
          className="font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-4xl sm:leading-[1.15]"
        >
          {title}
        </h2>

        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
