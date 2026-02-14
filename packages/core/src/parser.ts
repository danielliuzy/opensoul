import matter from "gray-matter";
import { createHash } from "node:crypto";
import type { SoulFile, SoulFrontmatter, SoulSection } from "./types.js";

export function parseSoulFile(raw: string): SoulFile {
  const { data, content } = matter(raw);
  const frontmatter = data as SoulFrontmatter;
  const sections = parseSections(content);
  const hash = createHash("sha256").update(raw).digest("hex");

  return { frontmatter, sections, raw, hash };
}

function parseSections(content: string): SoulSection[] {
  const sections: SoulSection[] = [];
  const lines = content.split("\n");
  let currentHeading: string | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      if (currentHeading !== null) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join("\n").trim(),
        });
      }
      currentHeading = headingMatch[1].trim();
      currentContent = [];
    } else if (currentHeading !== null) {
      currentContent.push(line);
    }
  }

  if (currentHeading !== null) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join("\n").trim(),
    });
  }

  return sections;
}
