import type {
  CurrentSignal,
  HeroContent,
  HeroOrbitStat,
  HeroParticle,
  HeroRoute,
  LiveStatusItem,
  MissionTone,
  TimelinePreviewItem,
  WorldGateway,
  WorldNode,
  WorldRoute,
} from "../types/mission-control";

export const missionPalette: Record<MissionTone | "deepSpace" | "cloudWhite", string> = {
  deepSpace: "#081521",
  cloudWhite: "#F7FBFF",
  orbitBlue: "#2F6BFF",
  auroraCyan: "#68E6FF",
  horizonTeal: "#12A594",
  signalCoral: "#FF6B57",
};

export const heroContent: HeroContent = {
  eyebrow: "Mission Control",
  title: "A Personal Universe of Travel, Learning, Movies & DevOps",
  subtitle: "Explore the worlds that shape my journey.",
};

export const heroOrbitStats: HeroOrbitStat[] = [
  {
    label: "Cities connected",
    value: "5",
    tone: "orbitBlue",
  },
  {
    label: "Active worlds",
    value: "4",
    tone: "auroraCyan",
  },
  {
    label: "Mode",
    value: "Local Mock Data",
    tone: "horizonTeal",
  },
];

export const heroParticles: HeroParticle[] = [
  {
    id: "particle-hyd",
    x: 820,
    y: 250,
    radius: 8,
    opacity: 0.85,
    duration: "8s",
    delay: "0s",
    tone: "orbitBlue",
  },
  {
    id: "particle-ria",
    x: 610,
    y: 310,
    radius: 10,
    opacity: 0.8,
    duration: "10s",
    delay: "1.2s",
    tone: "horizonTeal",
  },
  {
    id: "particle-dxb",
    x: 710,
    y: 180,
    radius: 9,
    opacity: 0.82,
    duration: "9s",
    delay: "0.7s",
    tone: "auroraCyan",
  },
  {
    id: "particle-lon",
    x: 500,
    y: 220,
    radius: 7,
    opacity: 0.78,
    duration: "11s",
    delay: "1.8s",
    tone: "signalCoral",
  },
  {
    id: "particle-sin",
    x: 980,
    y: 330,
    radius: 8,
    opacity: 0.76,
    duration: "10s",
    delay: "0.4s",
    tone: "auroraCyan",
  },
  {
    id: "particle-route",
    x: 920,
    y: 140,
    radius: 6,
    opacity: 0.7,
    duration: "12s",
    delay: "2s",
    tone: "orbitBlue",
  },
];

export const heroRoutes: HeroRoute[] = [
  {
    id: "hero-route-lon-ria",
    from: [460, 250],
    to: [635, 300],
    tone: "signalCoral",
  },
  {
    id: "hero-route-ria-dxb",
    from: [635, 300],
    to: [725, 195],
    tone: "horizonTeal",
  },
  {
    id: "hero-route-dxb-hyd",
    from: [725, 195],
    to: [845, 255],
    tone: "orbitBlue",
  },
  {
    id: "hero-route-hyd-sin",
    from: [845, 255],
    to: [980, 335],
    tone: "auroraCyan",
  },
  {
    id: "hero-route-lon-hyd",
    from: [460, 250],
    to: [845, 255],
    tone: "orbitBlue",
  },
];

export const liveStatusItems: LiveStatusItem[] = [
  {
    id: "status-destination",
    label: "Current Destination",
    value: "Hyderabad",
    note: "Home base for building the next chapter.",
    tone: "orbitBlue",
  },
  {
    id: "status-learning",
    label: "Current Learning",
    value: "Kubernetes",
    note: "Deepening orchestration and platform thinking.",
    tone: "horizonTeal",
  },
  {
    id: "status-movie",
    label: "Current Movie",
    value: "Interstellar",
    note: "Still unmatched for scale, wonder, and systems.",
    tone: "signalCoral",
  },
  {
    id: "status-project",
    label: "Current Project",
    value: "SohailVerse",
    note: "Designing a digital universe with premium clarity.",
    tone: "auroraCyan",
  },
];

export const worldNodes: WorldNode[] = [
  {
    id: "hyderabad",
    name: "Hyderabad",
    country: "India",
    summary: "Home base for building, learning, and shaping the living system behind SohailVerse.",
    x: 790,
    y: 270,
    tone: "orbitBlue",
  },
  {
    id: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    summary: "A chapter defined by growth, scale, and new perspectives on work, culture, and ambition.",
    x: 642,
    y: 228,
    tone: "horizonTeal",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    summary: "A high-energy connection point between movement, architecture, and global momentum.",
    x: 690,
    y: 236,
    tone: "auroraCyan",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    summary: "A city of museums, cinema, and design references that expands the creative frame.",
    x: 536,
    y: 164,
    tone: "signalCoral",
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    summary: "A benchmark for precision, infrastructure, and urban systems executed with intent.",
    x: 908,
    y: 342,
    tone: "auroraCyan",
  },
];

export const worldRoutes: WorldRoute[] = [
  {
    id: "route-london-riyadh",
    from: "london",
    to: "riyadh",
    tone: "signalCoral",
  },
  {
    id: "route-riyadh-dubai",
    from: "riyadh",
    to: "dubai",
    tone: "horizonTeal",
  },
  {
    id: "route-dubai-hyderabad",
    from: "dubai",
    to: "hyderabad",
    tone: "orbitBlue",
  },
  {
    id: "route-hyderabad-singapore",
    from: "hyderabad",
    to: "singapore",
    tone: "auroraCyan",
  },
  {
    id: "route-london-hyderabad",
    from: "london",
    to: "hyderabad",
    tone: "orbitBlue",
  },
];

export const worldGateways: WorldGateway[] = [
  {
    id: "gateway-atlas",
    title: "Atlas",
    description: "Travel stories, routes, and destinations mapped as part of a larger personal journey.",
    metricLabel: "Tracked destinations",
    metricValue: "05",
    href: "/atlas",
    cta: "Explore Atlas",
    tone: "orbitBlue",
  },
  {
    id: "gateway-academy",
    title: "Academy",
    description: "A living knowledge hub where topics, systems, and lessons connect over time.",
    metricLabel: "Active learning threads",
    metricValue: "12",
    href: "/academy",
    cta: "Enter Academy",
    tone: "horizonTeal",
  },
  {
    id: "gateway-cinema",
    title: "Cinema",
    description: "Movies, moods, and reviews organized as a personal observatory of storytelling.",
    metricLabel: "Featured films",
    metricValue: "18",
    href: "/cinema",
    cta: "Open Cinema",
    tone: "signalCoral",
  },
  {
    id: "gateway-devops",
    title: "DevOps",
    description: "Projects, infrastructure thinking, and operating systems built with clarity and intent.",
    metricLabel: "Active build systems",
    metricValue: "04",
    href: "/devops",
    cta: "Open DevOps Forge",
    tone: "auroraCyan",
  },
];

export const currentSignals: CurrentSignal[] = [
  {
    id: "signal-travel",
    title: "Latest Travel Update",
    kicker: "Route Journal",
    summary: "Mapping recent movement across Hyderabad, Riyadh, and Dubai into a living travel layer.",
    meta: "Updated 2 days ago",
    tone: "orbitBlue",
  },
  {
    id: "signal-learning",
    title: "Latest Learning Topic",
    kicker: "Learning Signal",
    summary: "Kubernetes patterns, cluster mental models, and cleaner infrastructure abstractions are in focus.",
    meta: "Studying this week",
    tone: "horizonTeal",
  },
  {
    id: "signal-cinema",
    title: "Latest Movie Added",
    kicker: "Cinema Signal",
    summary: "Interstellar remains the current north star for scale, emotion, and systems-level imagination.",
    meta: "Added to observatory",
    tone: "signalCoral",
  },
  {
    id: "signal-devops",
    title: "Latest DevOps Build",
    kicker: "Forge Signal",
    summary: "SohailVerse v2 is being shaped as a premium front-end shell with room for future cloud systems.",
    meta: "Build in progress",
    tone: "auroraCyan",
  },
];

export const timelinePreview: TimelinePreviewItem[] = [
  {
    id: "timeline-2024",
    year: "2024",
    title: "Saudi Arabia",
    description: "A chapter of movement, perspective, and place-based growth.",
    tone: "horizonTeal",
  },
  {
    id: "timeline-2025",
    year: "2025",
    title: "DevOps Learning",
    description: "Deepening infrastructure, orchestration, and platform thinking.",
    tone: "orbitBlue",
  },
  {
    id: "timeline-2026",
    year: "2026",
    title: "SohailVerse Build",
    description: "Turning a personal universe into a polished digital operating surface.",
    tone: "signalCoral",
  },
];

export const missionManifesto =
  "SohailVerse is a living record of exploration, learning, systems, and stories.";

