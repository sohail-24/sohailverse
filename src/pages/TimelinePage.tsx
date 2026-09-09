import { useEffect, useState, useCallback } from "react";
import { fetchApi, isValidTimelinePost, type TimelinePost } from "../lib/api";
import { LoadingSkeleton, ErrorState } from "../components/ui/StatusStates";
import AboutHero from "../components/about/AboutHero";
import AboutWhoIAm from "../components/about/AboutWhoIAm";
import AboutJourneyTimeline from "../components/about/AboutJourneyTimeline";
import AboutBuilderMindset from "../components/about/AboutBuilderMindset";
import AboutWhatsNextBanner from "../components/about/AboutWhatsNextBanner";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelinePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTimeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi<TimelinePost>("/api/timeline", isValidTimelinePost);
      setTimeline(data);
    } catch (err: any) {
      console.error("Failed to load timeline milestones:", err);
      setError(err?.message || "Unable to load timeline milestones from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Full-Width Unified Panoramic About Hero with Text Overlay */}
      <AboutHero />

      {/* 2. Who I Am: Core Identity & Principles */}
      <AboutWhoIAm />

      {/* 3. My Journey: Chronology */}
      {loading ? (
        <section className="py-8 sm:py-14 max-w-4xl mx-auto w-full px-4">
          <LoadingSkeleton label="Loading timeline milestones from Neon database..." />
        </section>
      ) : error ? (
        <section className="py-8 sm:py-14 max-w-4xl mx-auto w-full px-4">
          <ErrorState
            title="Timeline Unavailable"
            message={error}
            onRetry={loadTimeline}
          />
        </section>
      ) : (
        <AboutJourneyTimeline timeline={timeline} dbTimeline={timeline} />
      )}

      {/* 4. Builder Mindset: 4 Principles & Philosophical Quote */}
      <AboutBuilderMindset />

      {/* 5. Now I'm Ready For What's Next: Final Closing Section & Call to Action */}
      <AboutWhatsNextBanner />
    </div>
  );
}
