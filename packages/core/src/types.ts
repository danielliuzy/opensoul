export interface SoulFrontmatter {
  name: string;
  version: string;
  author: string;
  description?: string;
  tags?: string[];
  "compatible-skills"?: string[];
  license?: string;
  [key: string]: unknown;
}

export interface SoulSection {
  heading: string;
  content: string;
}

export interface SoulFile {
  frontmatter: SoulFrontmatter;
  sections: SoulSection[];
  raw: string;
  hash: string;
}
export interface SwapRequest {
  content: string;
  name?: string;
  slug?: string;
}

export interface SwapResponse {
  success: boolean;
  soul: {
    name: string;
    version: string;
    hash: string;
  };
  previous?: {
    name: string;
    version: string;
    hash: string;
  };
  swappedAt: string;
}

export interface BotStatus {
  running: boolean;
  currentSoul: {
    name: string;
    version: string;
    hash: string;
    loadedAt: string;
  } | null;
  activeSkills: string[];
  uptime: number;
}

export interface HistoryEntry {
  soul: {
    name: string;
    version: string;
    hash: string;
  };
  action: "swap" | "rollback";
  timestamp: string;
}
