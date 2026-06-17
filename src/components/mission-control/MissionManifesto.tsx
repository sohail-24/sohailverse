import GlassPanel from "../ui/GlassPanel";

interface MissionManifestoProps {
  statement: string;
}

export default function MissionManifesto({ statement }: MissionManifestoProps) {
  return (
    <section>
      <GlassPanel
        className="
          border-white/10
          bg-gradient-to-br
          from-slate-950/80
          via-indigo-950/70
          to-slate-900/80
          px-6
          py-8
          text-center
          shadow-soft
          sm:px-8
        "
      >
        <p
          className="
            mx-auto
            max-w-4xl
            font-display
            text-2xl
            font-semibold
            tracking-tight
            text-white
            sm:text-3xl
          "
        >
          {statement}
        </p>
      </GlassPanel>
    </section>
  );
}

