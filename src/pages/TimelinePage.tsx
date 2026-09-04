import { useEffect, useState } from "react";
import { fetchApi, isValidTimelinePost, type TimelinePost } from "../lib/api";
import AboutHero from "../components/about/AboutHero";
import AboutStatsStrip from "../components/about/AboutStatsStrip";
import AboutWhoIAm from "../components/about/AboutWhoIAm";
import AboutJourneyTimeline from "../components/about/AboutJourneyTimeline";
import AboutFocusAreas from "../components/about/AboutFocusAreas";
import AboutWhatsNextBanner from "../components/about/AboutWhatsNextBanner";

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelinePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadTimeline = async () => {
      setLoading(true);
      try {
        const data = await fetchApi<TimelinePost>("/api/timeline", isValidTimelinePost);
        if (isMounted) {
          setTimeline(data);
        }
      } catch (err: any) {
        console.warn("Notice: Using authentic local timeline events fallback.", err?.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTimeline();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Full-Width Unified Panoramic About Hero */}
      <AboutHero />

      {/* 2. Sleek Metrics Strip (positioned directly below hero) */}
      <AboutStatsStrip timelineCount={timeline.length > 0 ? timeline.length : 3} loading={loading} />

      {/* 3. Who I Am: Core Identity & Principles */}
      <AboutWhoIAm />

      {/* 4. My Journey: Desktop Horizontal (2023 ── 2024 ── 2025 ── 2026) / Mobile Vertical */}
      <AboutJourneyTimeline dbTimeline={timeline} />

      {/* 5. What I'm Focused On: 4 Capability Cards */}
      <AboutFocusAreas />

      {/* 6. What's Next: Cinematic Closing Chapter */}
      <AboutWhatsNextBanner />
    </div>
  );
}
