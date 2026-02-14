import { createClient, type Client } from "@libsql/client";

export interface SoulRecord {
  id: number;
  slug: string;
  name: string;
  author: string;
  description: string | null;
  version: string;
  tags: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface SoulVersionRecord {
  id: number;
  soul_id: number;
  version: string;
  content_hash: string;
  file_path: string;
  changelog: string | null;
  created_at: string;
}

export interface UserRecord {
  id: number;
  github_id: number;
  github_username: string;
  avatar_url: string | null;
  created_at: string;
  last_login: string;
}

export interface SoulRatingRecord {
  id: number;
  soul_id: number;
  user_id: number;
  rating: number;
  created_at: string;
}

export async function createDatabase(url?: string, authToken?: string): Promise<Client> {
  const client = createClient({
    url: url ?? "file:local.db",
    authToken,
  });

  await migrate(client);
  return client;
}

async function migrate(client: Client): Promise<void> {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      github_id INTEGER UNIQUE NOT NULL,
      github_username TEXT NOT NULL,
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS souls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT,
      version TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      rating_avg REAL NOT NULL DEFAULT 0,
      rating_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS soul_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      soul_id INTEGER NOT NULL REFERENCES souls(id) ON DELETE CASCADE,
      version TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      file_path TEXT NOT NULL,
      changelog TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(soul_id, version)
    );

    CREATE TABLE IF NOT EXISTS soul_ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      soul_id INTEGER NOT NULL REFERENCES souls(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(soul_id, user_id)
    );
  `);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
