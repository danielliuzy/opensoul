import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";

export interface StorageInterface {
  saveSoul(slug: string, version: string, content: string): Promise<string>;
  getSoul(slug: string, version: string): Promise<string | null>;
  deleteSoul(slug: string, version?: string): Promise<void>;
}

export class LocalStorage implements StorageInterface {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir ?? join(homedir(), ".soul", "registry");
    mkdirSync(this.baseDir, { recursive: true });
  }

  async saveSoul(slug: string, version: string, content: string): Promise<string> {
    const filePath = this.filePath(slug, version);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, "utf-8");
    return filePath;
  }

  async getSoul(slug: string, version: string): Promise<string | null> {
    const filePath = this.filePath(slug, version);
    if (!existsSync(filePath)) return null;
    return readFileSync(filePath, "utf-8");
  }

  async deleteSoul(slug: string, version?: string): Promise<void> {
    if (version) {
      const filePath = this.filePath(slug, version);
      if (existsSync(filePath)) unlinkSync(filePath);
    } else {
      const dir = join(this.baseDir, slug);
      if (existsSync(dir)) rmSync(dir, { recursive: true });
    }
  }

  private filePath(slug: string, version: string): string {
    return join(this.baseDir, slug, version, "soul.md");
  }
}
