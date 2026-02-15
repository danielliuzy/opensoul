import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { parse, stringify } from "yaml";

export interface SoulConfig {
  registry_url: string;
  soul_path: string;
  skills_path: string;
}

function defaultConfig(): SoulConfig {
  return {
    registry_url: "https://opensoul-api.zyliu-daniel.workers.dev",
    soul_path: join(homedir(), ".openclaw", "workspace", "SOUL.md"),
    skills_path: join(homedir(), ".openclaw", "skills"),
  };
}

function configPath(): string {
  return join(homedir(), ".soulrc.yaml");
}

export function loadConfig(): SoulConfig {
  const path = configPath();
  const defaults = defaultConfig();
  if (!existsSync(path)) {
    saveConfig(defaults);
    return { ...defaults };
  }
  const raw = readFileSync(path, "utf-8");
  const parsed = parse(raw) as Partial<SoulConfig>;
  return { ...defaults, ...parsed };
}

export function saveConfig(config: SoulConfig): void {
  const path = configPath();
  writeFileSync(path, stringify(config), "utf-8");
}

export function getConfigValue(key: string): string | undefined {
  const config = loadConfig();
  const record = config as unknown as Record<string, unknown>;
  return record[key] as string | undefined;
}

export function setConfigValue(key: string, value: string): void {
  const config = loadConfig();
  const record = config as unknown as Record<string, string>;
  record[key] = value;
  saveConfig(config);
}
