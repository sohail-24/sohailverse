import GlassPanel from "../ui/GlassPanel";

interface MissionManifestoProps {
  statement: string;
}

export default function MissionManifesto({ statement }: MissionManifestoProps) {
  return (
    <section>
      <GlassPanel className="border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(247,251,255,0.58))] px-6 py-8 text-center shadow-soft sm:px-8">
        <p className="mx-auto max-w-4xl font-display text-2xl font-semibold tracking-tight text-[#081521] sm:text-3xl">
          {statement}
        </p>
      </GlassPanel>
    </section>
  );
}

