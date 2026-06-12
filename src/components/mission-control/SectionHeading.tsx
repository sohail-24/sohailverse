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
      <Badge className="bg-white/[0.85] text-[#081521]" variant="neutral">
        {eyebrow}
      </Badge>
      <div className="space-y-3">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[#081521] sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
      </div>
    </div>
  );
}
