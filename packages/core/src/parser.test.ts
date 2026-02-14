import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseSoulFile } from "./parser.js";

const fixturesDir = resolve(import.meta.dirname, "../../../fixtures");

describe("parseSoulFile", () => {
  it("parses a soul file", () => {
    const raw = readFileSync(resolve(fixturesDir, "ride-or-die.soul.md"), "utf-8");
    const soul = parseSoulFile(raw);

    expect(soul.sections.length).toBeGreaterThan(0);
    expect(soul.sections[0].heading).toBeTruthy();
    expect(soul.hash).toHaveLength(64);
    expect(soul.raw).toBe(raw);
  });

  it("parses file with no sections", () => {
    const raw = "Just some text with no headings.";
    const soul = parseSoulFile(raw);

    expect(soul.sections).toHaveLength(0);
  });

  it("produces consistent hashes", () => {
    const raw = readFileSync(resolve(fixturesDir, "ride-or-die.soul.md"), "utf-8");
    const soul1 = parseSoulFile(raw);
    const soul2 = parseSoulFile(raw);

    expect(soul1.hash).toBe(soul2.hash);
  });

  it("produces different hashes for different content", () => {
    const raw1 = readFileSync(resolve(fixturesDir, "ride-or-die.soul.md"), "utf-8");
    const raw2 = readFileSync(resolve(fixturesDir, "chaos-goblin.soul.md"), "utf-8");
    const soul1 = parseSoulFile(raw1);
    const soul2 = parseSoulFile(raw2);

    expect(soul1.hash).not.toBe(soul2.hash);
  });
});
