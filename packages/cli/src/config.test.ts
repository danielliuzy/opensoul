import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadConfig, saveConfig, getConfigValue, setConfigValue } from "./config.js";

let tmpDir: string;
let originalHome: string;

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "opensoul-config-test-"));
  originalHome = process.env.HOME!;
  process.env.HOME = tmpDir;
});

afterEach(() => {
  process.env.HOME = originalHome;
  rmSync(tmpDir, { recursive: true });
});

describe("loadConfig", () => {
  it("creates default config when none exists", () => {
    const config = loadConfig();
    expect(config.registry_url).toBeDefined();
    // Should have created the file
    expect(existsSync(join(tmpDir, ".soulrc.yaml"))).toBe(true);
  });

  it("loads existing config", () => {
    const config = loadConfig();
    config.registry_url = "https://custom.example.com";
    saveConfig(config);

    const reloaded = loadConfig();
    expect(reloaded.registry_url).toBe("https://custom.example.com");
  });

  it("merges defaults with partial config", () => {
    const config = loadConfig();
    expect(config.registry_url).toBeDefined();
  });
});

describe("getConfigValue", () => {
  it("returns a config value by key", () => {
    const value = getConfigValue("registry_url");
    expect(value).toContain("opensoul-api");
  });

  it("returns undefined for unknown key", () => {
    const value = getConfigValue("nonexistent_key");
    expect(value).toBeUndefined();
  });
});

describe("setConfigValue", () => {
  it("sets and persists a config value", () => {
    setConfigValue("registry_url", "https://custom.example.com");
    expect(getConfigValue("registry_url")).toBe("https://custom.example.com");
  });

  it("adds new keys", () => {
    setConfigValue("custom_key", "custom_value");
    expect(getConfigValue("custom_key")).toBe("custom_value");
  });
});
