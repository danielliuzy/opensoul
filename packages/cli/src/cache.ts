import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";

interface CacheEntry {
  name: string;
  label?: string;
  file: string;
  hash: string;
  cachedAt: string;
  lastUsedAt?: string;
}

interface CacheIndex {
  entries: CacheEntry[];
}

function getCacheDir(): string {
  return join(homedir(), ".soul", "cache");
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

function matchesEntry(entry: CacheEntry, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.name.toLowerCase() === q ||
    (entry.label != null && entry.label.toLowerCase() === q)
  );
}

export function cacheSoul(name: string, content: string, hash: string, label?: string): string {
  const dir = getCacheDir();
  mkdirSync(dir, { recursive: true });

  const filename = `${(label ?? name).toLowerCase().replace(/\s+/g, "-")}.soul.md`;
  const filePath = join(dir, filename);
  writeFileSync(filePath, content, "utf-8");

  const index = loadIndex();
  const existing = index.entries.findIndex(
    (e) => e.name === name || (label != null && e.label === label)
  );
  const entry: CacheEntry = {
    name,
    label,
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

export function getCached(query: string): { content: string; entry: CacheEntry } | null {
  const index = loadIndex();
  const entry = index.entries.find((e) => matchesEntry(e, query));
  if (!entry) return null;

  const filePath = join(getCacheDir(), entry.file);
  if (!existsSync(filePath)) return null;

  return { content: readFileSync(filePath, "utf-8"), entry };
}

export function touchCached(query: string): void {
  const index = loadIndex();
  const entry = index.entries.find((e) => matchesEntry(e, query));
  if (entry) {
    entry.lastUsedAt = new Date().toISOString();
    saveIndex(index);
  }
}

export function removeCached(query: string): boolean {
  const index = loadIndex();
  const idx = index.entries.findIndex((e) => matchesEntry(e, query));
  if (idx === -1) return false;

  const entry = index.entries[idx];
  const filePath = join(getCacheDir(), entry.file);
  if (existsSync(filePath)) {
    rmSync(filePath);
  }

  index.entries.splice(idx, 1);
  saveIndex(index);
  return true;
}
