import type { DevOpsProject } from "../lib/api";

export type { DevOpsProject };

export interface LearningPathChip {
  label: string;
  iconName:
    | "monitor"
    | "shield"
    | "network"
    | "cloud"
    | "lock"
    | "flask"
    | "terminal"
    | "git"
    | "k8s"
    | "book"
    | "file"
    | "code"
    | "check"
    | "chart";
}

export interface LearningPathStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  accentColor: "cyan" | "orange" | "lime" | "purple" | "amber";
  chips: LearningPathChip[];
  summary: string;
  mentalModel: string;
  architectureDiagram?: string;
  coreConcepts: {
    topic: string;
    description: string;
    details: string[];
  }[];
  essentialCommands: {
    command: string;
    explanation: string;
  }[];
}

export interface FeaturedVideo {
  id: string;
  title: string;
  category: "Networking" | "AWS" | "DevOps";
  duration: string;
  thumbnailStyle: "network" | "aws" | "docker";
  description: string;
  takeaway: string;
  chapters: {
    timestamp: string;
    title: string;
  }[];
  keyCommands: string[];
}

export interface DevOpsNote {
  id: string;
  title: string;
  subtitle: string;
  category: "Networking" | "AWS" | "DevOps & Linux";
  accentColor: "pink" | "lime" | "cyan";
  tags: string[];
  lastUpdated: string;
  summary: string;
  cheatSheets: {
    title: string;
    snippet: string;
    description: string;
  }[];
  keyPrinciples: string[];
  pdf_url?: string;
}
