import { useEffect, useState } from "react";
import { fetchApi, isValidTimelinePost, type TimelinePost } from "../lib/api";
import AboutHero from "../components/about/AboutHero";
import AboutWhoIAm from "../components/about/AboutWhoIAm";
import AboutJourneyTimeline from "../components/about/AboutJourneyTimeline";
import AboutBuilderMindset from "../components/about/AboutBuilderMindset";
import AboutWhatsNextBanner from "../components/about/AboutWhatsNextBanner";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelinePost[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadTimeline = async () => {
      try {
        const data = await fetchApi<TimelinePost>("/api/timeline", isValidTimelinePost);
        if (isMounted) {
          setTimeline(data);
        }
      } catch (err: any) {
        console.warn("Notice: Using authentic local timeline events fallback.", err?.message);
      }
    };

    loadTimeline();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Full-Width Unified Panoramic About Hero with Text Overlay */}
      <AboutHero />

      {/* 2. Who I Am: Core Identity & Principles */}
      <AboutWhoIAm />

      {/* 3. My Journey: 2023 → 2026 Chronology */}
      <AboutJourneyTimeline dbTimeline={timeline} />

      {/* 4. Builder Mindset: 4 Principles & Philosophical Quote */}
      <AboutBuilderMindset />

      {/* 5. Now I'm Ready For What's Next: Final Closing Section & Call to Action */}
      <AboutWhatsNextBanner />
    </div>
  );
}
