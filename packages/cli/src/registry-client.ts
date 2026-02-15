import { loadConfig } from "./config.js";

export interface RegistrySoul {
  slug: string;
  label: string;
  name: string;
  author: string;
  description: string | null;
  tags: string[];
  rating_avg?: number;
  rating_count?: number;
  created_at: string;
  updated_at: string;
}

export class RegistryClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? loadConfig().registry_url;
  }

  async search(query?: string, sort?: string, page?: number, limit?: number): Promise<{ data: RegistrySoul[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (sort) params.set("sort", sort);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    const url = `${this.baseUrl}/api/v1/souls${qs ? `?${qs}` : ""}`;

    const res = await fetch(url).catch(() => {
      throw new Error(`Failed to connect to registry at ${this.baseUrl}. Is it reachable?`);
    });

    if (!res.ok) {
      throw new Error(`Registry returned HTTP ${res.status}`);
    }

    return res.json() as Promise<{ data: RegistrySoul[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>;
  }

  async getMeta(id: string): Promise<RegistrySoul> {
    const url = `${this.baseUrl}/api/v1/souls/${id}`;

    const res = await fetch(url).catch(() => {
      throw new Error(`Failed to connect to registry at ${this.baseUrl}. Is it reachable?`);
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Soul '${id}' not found in registry`);
      }
      throw new Error(`Registry returned HTTP ${res.status}`);
    }

    return res.json() as Promise<RegistrySoul>;
  }

  async getContent(id: string): Promise<string> {
    const url = `${this.baseUrl}/api/v1/souls/${id}/content`;

    const res = await fetch(url).catch(() => {
      throw new Error(`Failed to connect to registry at ${this.baseUrl}. Is it reachable?`);
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Soul '${id}' not found in registry`);
      }
      throw new Error(`Registry returned HTTP ${res.status}`);
    }

    return res.text();
  }

  async trackDownload(id: string): Promise<void> {
    const url = `${this.baseUrl}/api/v1/souls/${id}/download`;
    await fetch(url, { method: "POST" }).catch(() => {});
  }
}
