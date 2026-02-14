import { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";

export interface StorageInterface {
  saveSoul(slug: string, content: string): Promise<string>;
  getSoul(slug: string): Promise<string | null>;
  deleteSoul(slug: string): Promise<void>;
}

export class LocalStorage implements StorageInterface {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir ?? join(homedir(), ".soul", "registry");
    mkdirSync(this.baseDir, { recursive: true });
  }

  async saveSoul(slug: string, content: string): Promise<string> {
    const filePath = this.filePath(slug);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, "utf-8");
    return filePath;
  }

  async getSoul(slug: string): Promise<string | null> {
    const filePath = this.filePath(slug);
    if (!existsSync(filePath)) return null;
    return readFileSync(filePath, "utf-8");
  }

  async deleteSoul(slug: string): Promise<void> {
    const dir = join(this.baseDir, slug);
    if (existsSync(dir)) rmSync(dir, { recursive: true });
  }

  private filePath(slug: string): string {
    return join(this.baseDir, slug, "soul.md");
  }
}
