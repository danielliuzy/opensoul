export interface Soul {
  id: number;
  slug: string;
  name: string;
  author: string;
  description: string | null;
  version: string;
  tags: string[];
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface SoulVersion {
  version: string;
  content_hash: string;
  changelog: string | null;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SoulListResponse {
  data: Soul[];
  pagination: Pagination;
}

export interface SoulDetailResponse extends Soul {
  versions: {
    data: SoulVersion[];
    pagination: Pagination;
  };
}

export interface RateResponse {
  slug: string;
  rating: number;
  rating_avg: number;
  rating_count: number;
}

export interface UploadResponse {
  slug: string;
  name: string;
  version: string;
  hash: string;
}

export interface User {
  id: number;
  username: string;
  avatar: string;
}
