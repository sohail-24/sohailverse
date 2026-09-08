import { useState } from "react";
import DevOpsVideoCard from "./DevOpsVideoCard";
import DevOpsVideoModal from "./DevOpsVideoModal";
import { featuredVideos } from "../../data/devopsData";
import type { FeaturedVideo } from "../../types/devops";

export default function DevOpsVideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<FeaturedVideo | null>(null);

  return (
    <section id="devops-videos" className="w-full scroll-mt-24 pt-8 sm:pt-10" aria-labelledby="featured-videos-heading">
      {/* Section Header with View All Link matching reference */}
      <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8 text-left">
        <div>
          <h2 id="featured-videos-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Featured Learning Videos
          </h2>
          <p className="mt-1 sm:mt-2 text-sm text-slate-400 font-normal">
            Bite-sized visual lessons breaking down core engineering concepts without unnecessary fluff.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelectedVideo(featuredVideos[0])}
          className="text-xs sm:text-sm font-semibold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
        >
          <span>View All</span>
          <span>→</span>
        </button>
      </div>

      {/* 3 Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {featuredVideos.map((video) => (
          <DevOpsVideoCard
            key={video.id}
            video={video}
            onClick={() => setSelectedVideo(video)}
          />
        ))}
      </div>

      {/* Video Lesson Modal */}
      <DevOpsVideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
}
