import Badge from "../ui/Badge";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <Badge variant="accent">
        {eyebrow}
      </Badge>

      <div className="space-y-3">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>

        <p className="text-base leading-7 text-slate-400 sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}