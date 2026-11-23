export type ProjectStatus =
  | "ativo"
  | "ativo-fase"
  | "concluído"
  | "experimental"
  | "laboratório"
  | "construção";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  statusLabel: string;
  vision: string;
  bullets: string[];
  stack: string[];
  metrics: ProjectMetric[];
  maturity: number; // 1-5, drives node radius in constellation
  // Street-Tech & Creative Brutalism Extensions
  taglineHandwritten?: string;
  tapeStyle?: "caution" | "amber" | "blueprint" | "default";
  badgeSticker?: string;
  isFeaturedPillar?: boolean;
  image?: string;
  links?: ProjectLinks;
}

export interface ArsenalItem {
  name: string;
  level: string;
  category?: "frontend" | "backend" | "systems" | "ai-tools";
}

export interface JourneyEntry {
  year: string;
  title: string;
  description: string;
}

export interface Principle {
  id: string;
  title: string;
  description: string;
}

export interface SitePerson {
  name: string;
  nickname: string;
  position: string;
  anchor: string;
  anchorHighlight: string;
  sub: string;
  statusPill: string;
  handwrittenNote?: string;
}

export interface Contact {
  github: string;
  githubLabel: string;
  cta: string;
  linkedin?: string;
  linkedinLabel?: string;
}

export interface SiteData {
  person: SitePerson;
  projects: Project[];
  arsenal: ArsenalItem[];
  journey: JourneyEntry[];
  principles: Principle[];
  contact: Contact;
}
