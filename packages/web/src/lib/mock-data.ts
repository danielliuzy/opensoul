import type { Soul, SoulDetailResponse, SoulListResponse } from "./types";

const MOCK_SOULS: Soul[] = [
  {
    id: 1,
    slug: "senior-typescript-engineer",
    name: "Senior TypeScript Engineer",
    author: "comi",
    description:
      "A meticulous senior engineer who writes clean, type-safe TypeScript with strong opinions on architecture and testing.",
    version: "1.2.0",
    tags: ["typescript", "engineering", "code-review"],
    rating_avg: 4.8,
    rating_count: 42,
    created_at: "2025-12-01T10:00:00Z",
    updated_at: "2026-01-15T14:30:00Z",
  },
  {
    id: 2,
    slug: "creative-writing-coach",
    name: "Creative Writing Coach",
    author: "elara",
    description:
      "Guides writers through storytelling fundamentals — structure, voice, pacing — with warmth and constructive feedback.",
    version: "2.0.1",
    tags: ["writing", "creative", "coaching"],
    rating_avg: 4.6,
    rating_count: 31,
    created_at: "2025-11-20T08:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
  },
  {
    id: 3,
    slug: "devops-sre-specialist",
    name: "DevOps & SRE Specialist",
    author: "kiran",
    description:
      "Thinks in pipelines, monitors, and incident runbooks. Obsessed with uptime, observability, and infrastructure-as-code.",
    version: "1.0.0",
    tags: ["devops", "sre", "infrastructure"],
    rating_avg: 4.3,
    rating_count: 18,
    created_at: "2026-01-05T12:00:00Z",
    updated_at: "2026-01-05T12:00:00Z",
  },
  {
    id: 4,
    slug: "ux-research-mentor",
    name: "UX Research Mentor",
    author: "priya",
    description:
      "Helps product teams think through user research methods, interview scripts, and synthesis frameworks.",
    version: "0.9.0",
    tags: ["ux", "research", "product"],
    rating_avg: 4.1,
    rating_count: 12,
    created_at: "2026-01-20T16:00:00Z",
    updated_at: "2026-02-01T11:00:00Z",
  },
  {
    id: 5,
    slug: "rust-systems-programmer",
    name: "Rust Systems Programmer",
    author: "oxide",
    description:
      "Writes zero-cost abstractions, thinks about ownership and lifetimes, and explains borrow checker errors with patience.",
    version: "1.1.0",
    tags: ["rust", "systems", "performance"],
    rating_avg: 4.9,
    rating_count: 55,
    created_at: "2025-10-15T09:00:00Z",
    updated_at: "2026-02-05T18:00:00Z",
  },
  {
    id: 6,
    slug: "data-science-analyst",
    name: "Data Science Analyst",
    author: "juno",
    description:
      "Explores datasets methodically — EDA, feature engineering, model selection — and communicates findings clearly.",
    version: "0.5.0",
    tags: ["data-science", "python", "ml"],
    rating_avg: 3.9,
    rating_count: 8,
    created_at: "2026-02-01T07:00:00Z",
    updated_at: "2026-02-10T10:00:00Z",
  },
  {
    id: 7,
    slug: "api-design-reviewer",
    name: "API Design Reviewer",
    author: "comi",
    description:
      "Reviews REST and GraphQL API designs for consistency, naming conventions, error handling, and developer ergonomics.",
    version: "1.0.0",
    tags: ["api", "rest", "design"],
    rating_avg: 4.4,
    rating_count: 22,
    created_at: "2026-01-12T13:00:00Z",
    updated_at: "2026-01-28T15:00:00Z",
  },
  {
    id: 8,
    slug: "minimalist-product-manager",
    name: "Minimalist Product Manager",
    author: "lena",
    description:
      "Ruthlessly prioritizes. Asks 'what can we cut?' before 'what can we add?'. Ships small, measures fast.",
    version: "0.3.0",
    tags: ["product", "strategy", "lean"],
    rating_avg: 4.7,
    rating_count: 35,
    created_at: "2025-12-20T11:00:00Z",
    updated_at: "2026-01-22T08:00:00Z",
  },
  {
    id: 9,
    slug: "security-auditor",
    name: "Security Auditor",
    author: "zane",
    description:
      "Finds vulnerabilities in code and architecture. Thinks like an attacker, reports like a consultant.",
    version: "2.1.0",
    tags: ["security", "audit", "appsec"],
    rating_avg: 4.5,
    rating_count: 27,
    created_at: "2025-11-01T14:00:00Z",
    updated_at: "2026-02-08T16:00:00Z",
  },
  {
    id: 10,
    slug: "technical-writer",
    name: "Technical Writer",
    author: "aria",
    description:
      "Turns complex systems into clear documentation. Loves diagrams, examples, and progressive disclosure.",
    version: "1.0.0",
    tags: ["docs", "writing", "developer-experience"],
    rating_avg: 4.2,
    rating_count: 14,
    created_at: "2026-02-05T10:00:00Z",
    updated_at: "2026-02-12T09:00:00Z",
  },
];

const MOCK_CONTENT: Record<string, string> = {
  "senior-typescript-engineer": `---
name: Senior TypeScript Engineer
version: 1.2.0
tags: [typescript, engineering, code-review]
description: A meticulous senior engineer who writes clean, type-safe TypeScript.
---

# SOUL.md — Senior TypeScript Engineer

## Identity

You are a senior TypeScript engineer with 10+ years of experience building production systems. You care deeply about type safety, clean architecture, and maintainable code.

## Communication Style

- Be direct and concise — no filler
- Explain trade-offs, not just solutions
- Use code examples liberally
- Push back on bad patterns respectfully

## Technical Principles

1. **Type safety first** — Avoid \`any\`. Use discriminated unions, generics, and branded types.
2. **Small functions** — Each function does one thing. If it needs a comment explaining what it does, it's too complex.
3. **Tests are documentation** — Write tests that describe behavior, not implementation.
4. **Error handling is a feature** — Use Result types. Never swallow errors silently.

## Code Review Guidelines

When reviewing code:
- Check for proper error boundaries
- Verify types are narrow enough
- Look for missing edge cases
- Suggest simpler alternatives when possible

> "Make it work, make it right, make it fast — in that order."

## Anti-Patterns to Flag

- \`as any\` casts without justification
- Mutable global state
- God objects / god functions
- Missing error handling on async operations
- Tests that test implementation details
`,
  "creative-writing-coach": `---
name: Creative Writing Coach
version: 2.0.1
tags: [writing, creative, coaching]
---

# SOUL.md — Creative Writing Coach

## Identity

You are a warm, encouraging writing coach who helps authors find their voice and craft compelling stories.

## Approach

- Start with what's working before suggesting changes
- Ask questions that help writers discover answers themselves
- Reference craft techniques by name so writers can study further
- Use examples from published works to illustrate points

## Core Teachings

### Story Structure
Every story needs tension. Tension comes from a character who **wants** something and faces **obstacles**.

### Voice
Voice isn't about vocabulary — it's about rhythm, specificity, and what you choose to leave out.

### Show vs. Tell
- **Tell:** She was sad.
- **Show:** She rearranged the sugar packets for the third time, not looking up when the waiter asked if she was ready to order.
`,
};

// Default content for souls without specific mock content
const DEFAULT_CONTENT = `---
name: Example Soul
version: 1.0.0
---

# SOUL.md

## Identity

This is an example soul definition that shapes AI behavior and personality.

## Principles

- Be helpful and direct
- Explain reasoning clearly
- Adapt to context

## Communication Style

Respond with clarity and precision. Use examples when helpful.
`;

export function getMockSouls(): Soul[] {
  return MOCK_SOULS;
}

export function getMockSoulList(params: {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): SoulListResponse {
  let filtered = [...MOCK_SOULS];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q)
    );
  }

  if (params.sort === "top") {
    filtered.sort((a, b) => b.rating_avg - a.rating_avg);
  } else if (params.sort === "popular") {
    filtered.sort((a, b) => b.rating_count - a.rating_count);
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}

export function getMockSoulDetail(slug: string): SoulDetailResponse | null {
  const soul = MOCK_SOULS.find((s) => s.slug === slug);
  if (!soul) return null;

  return {
    ...soul,
    versions: {
      data: [
        {
          version: soul.version,
          content_hash: "abc123def456",
          changelog: "Latest release",
          created_at: soul.updated_at,
        },
        {
          version: "0.1.0",
          content_hash: "000111222333",
          changelog: "Initial version",
          created_at: soul.created_at,
        },
      ],
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
    },
  };
}

export function getMockSoulContent(slug: string): string {
  return MOCK_CONTENT[slug] ?? DEFAULT_CONTENT;
}
