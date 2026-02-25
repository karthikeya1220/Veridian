// VC Scout — All TypeScript types and interfaces
// No dependencies, zero imports

export type Sector = "AI Infra" | "DevTools" | "FinTech" | "HealthTech" | "B2B SaaS" | "Climate" | "Security";

export type Stage = "Pre-seed" | "Seed" | "Series A" | "Series B";

export type SignalType = "positive" | "neutral" | "warning";

export interface Signal {
  label: string;
  value: string;
  type: SignalType;
}

export interface Source {
  url: string;
  scrapedAt: string; // ISO 8601
}

export interface EnrichedData {
  summary: string;
  bullets: string[];
  keywords: string[];
  signals: Signal[];
  sources: Source[];
  cachedAt: string; // ISO 8601
}

export interface Company {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  sector: Sector;
  stage: Stage;
  hq: string;
  founded: number;
  employees: string; // e.g. "10-50"
  thesisScore: number; // 0-100
  tags: string[];
  lastSignalDate: string; // ISO 8601
  description: string;
  enriched?: EnrichedData;
  noteIds: string[];
}

export interface Note {
  id: string;
  companyId: string;
  content: string;
  createdAt: string; // ISO 8601
}

export interface SavedList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string; // ISO 8601
}

export interface SearchFilters {
  query: string;
  sector: Sector | "";
  stage: Stage | "";
  hq: string;
  minScore: number;
  maxScore: number;
  tags: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string; // ISO 8601
}
