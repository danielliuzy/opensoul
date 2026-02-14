import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { loadConfig } from "./config.js";

interface CacheEntry {
  name: string;
  file: string;
  hash: string;
  cachedAt: string;
}

interface CacheIndex {
  entries: CacheEntry[];
}

function getCacheDir(): string {
  const config = loadConfig();
  return config.cache_dir;
}

function indexPath(): string {
  return join(getCacheDir(), "index.json");
}

function loadIndex(): CacheIndex {
  const path = indexPath();
  if (!existsSync(path)) {
    return { entries: [] };
  }
  return JSON.parse(readFileSync(path, "utf-8"));
}

function saveIndex(index: CacheIndex): void {
  const dir = getCacheDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(indexPath(), JSON.stringify(index, null, 2), "utf-8");
}

export function cacheSoul(name: string, content: string, hash: string): string {
  const dir = getCacheDir();
  mkdirSync(dir, { recursive: true });

  const filename = `${name.toLowerCase().replace(/\s+/g, "-")}.soul.md`;
  const filePath = join(dir, filename);
  writeFileSync(filePath, content, "utf-8");

  const index = loadIndex();
  const existing = index.entries.findIndex((e) => e.name === name);
  const entry: CacheEntry = {
    name,
    file: filename,
    hash,
    cachedAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    index.entries[existing] = entry;
  } else {
    index.entries.push(entry);
  }

  saveIndex(index);
  return filePath;
}

export function listCached(): CacheEntry[] {
  return loadIndex().entries;
}

export function getCached(name: string): { content: string; entry: CacheEntry } | null {
  const index = loadIndex();
  const entry = index.entries.find(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  if (!entry) return null;

  const filePath = join(getCacheDir(), entry.file);
  if (!existsSync(filePath)) return null;

  return { content: readFileSync(filePath, "utf-8"), entry };
}
