import { writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadConfig } from "./config.js";

const SKILL_DIR_NAME = "opensoul";

function skillsDir(): string {
  return loadConfig().skills_path;
}

function skillDir(): string {
  return join(skillsDir(), SKILL_DIR_NAME);
}

function skillPath(): string {
  return join(skillDir(), "SKILL.md");
}

export function isSkillInstalled(): boolean {
  return existsSync(skillPath());
}

export function getSkillPath(): string {
  return skillPath();
}

export function installSkill(): { path: string; updated: boolean } {
  const dir = skillDir();
  const path = skillPath();
  const updated = existsSync(path);

  mkdirSync(dir, { recursive: true });
  writeFileSync(path, SKILL_CONTENT, "utf-8");

  return { path, updated };
}

export function uninstallSkill(): boolean {
  if (!existsSync(skillPath())) return false;

  rmSync(skillDir(), { recursive: true });
  return true;
}

// Bundled SKILL.md content — kept in sync with packages/openclaw-skill/SKILL.md
const SKILL_CONTENT = `---
name: opensoul
description: Search, browse, and swap bot personality (SOUL.md) files from the Soul.MD registry
metadata: {"openclaw":{"requires":{"bins":["soul"]},"primaryEnv":null},"install":[{"id":"npm","kind":"node","package":"opensoul","bins":["soul"],"label":"Install via npm"}]}
---

You can manage the bot's personality by swapping SOUL.md files from the OpenSoul registry.

## Available actions

### Possess — swap soul
When the user asks to change personality/soul:
1. Search for it: \`soul search <query> --no-interactive\`
2. Summon it from the registry: \`soul summon <slug>\`
3. Possess your bot: \`soul possess <name> --yes\`

### Check current soul
Run \`soul status\` to see what soul is currently loaded.

### Exorcise — restore original
If the user wants to go back to their original personality: \`soul exorcise\`

### Browse souls
To show available souls: \`soul search --top --no-interactive\` or \`soul search <query> --no-interactive\`

### List cached souls
To show locally cached souls: \`soul list\`

## Important notes

- Always use \`--no-interactive\` with \`soul search\` since you cannot use interactive TUI controls.
- Always use \`--yes\` with \`soul possess\` to skip the confirmation prompt.
- After possessing a soul, let the user know they can use \`soul exorcise\` to restore their original personality.
- The soul takes effect on the next conversation — the current conversation is not affected.
`;
