import type {
  SoulListResponse,
  SoulDetailResponse,
  RateResponse,
  UploadResponse,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("soulmd_token");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `API error ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as T;
}

export function listSouls(params: {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  tag?: string;
}): Promise<SoulListResponse> {
  const sp = new URLSearchParams();
  if (params.search) sp.set("search", params.search);
  if (params.sort) sp.set("sort", params.sort);
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.tag) sp.set("tag", params.tag);
  const qs = sp.toString();
  return apiFetch<SoulListResponse>(`/souls${qs ? `?${qs}` : ""}`);
}

export function getSoul(slug: string): Promise<SoulDetailResponse> {
  return apiFetch<SoulDetailResponse>(`/souls/${slug}`);
}

export function getSoulContent(slug: string): Promise<string> {
  return apiFetch<string>(`/souls/${slug}/content`);
}

export function rateSoul(
  slug: string,
  rating: number
): Promise<RateResponse> {
  return apiFetch<RateResponse>(`/souls/${slug}/rate`, {
    method: "POST",
    body: JSON.stringify({ rating }),
  });
}

export function uploadSoul(
  content: string,
  changelog?: string
): Promise<UploadResponse> {
  return apiFetch<UploadResponse>("/souls", {
    method: "POST",
    body: JSON.stringify({ content, changelog }),
  });
}

export function getLoginUrl(): string {
  return `${API_URL}/auth/github`;
}
