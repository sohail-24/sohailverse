export type MissionTone = "orbitBlue" | "auroraCyan" | "horizonTeal" | "signalCoral";

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface HeroOrbitStat {
  label: string;
  value: string;
  tone: MissionTone;
}

export interface HeroParticle {
  id: string;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  duration: string;
  delay: string;
  tone: MissionTone;
}

export interface HeroRoute {
  id: string;
  from: [number, number];
  to: [number, number];
  tone: MissionTone;
}

export interface LiveStatusItem {
  id: string;
  label: string;
  value: string;
  note: string;
  tone: MissionTone;
}

export interface WorldNode {
  id: string;
  name: string;
  country: string;
  summary: string;
  x: number;
  y: number;
  tone: MissionTone;
}

export interface WorldRoute {
  id: string;
  from: string;
  to: string;
  tone: MissionTone;
}

export interface WorldGateway {
  id: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  href: string;
  cta: string;
  tone: MissionTone;
}

export interface CurrentSignal {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  meta: string;
  tone: MissionTone;
}

export interface TimelinePreviewItem {
  id: string;
  year: string;
  title: string;
  description: string;
  tone: MissionTone;
}

