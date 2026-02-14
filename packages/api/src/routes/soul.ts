import { Hono } from "hono";
import type { Client } from "@libsql/client";
import { parseSoulFile } from "@soulmd/core";
import { slugify } from "../storage/sqlite.js";
import type { StorageInterface } from "../storage/local.js";
import type { SoulRecord, SoulVersionRecord } from "../storage/sqlite.js";
import { requireAuth } from "../middleware/auth.js";

function extractName(soul: ReturnType<typeof parseSoulFile>): string {
  if (soul.frontmatter.name) return soul.frontmatter.name;
  const headingMatch = soul.raw.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].replace(/^SOUL\.md\s*[-–—]\s*/i, "").trim();
  if (soul.sections[0]?.heading) return soul.sections[0].heading;
  return `soul-${soul.hash.slice(0, 8)}`;
}

export function soulRoutes(db: Client, storage: StorageInterface) {
  const app = new Hono();

  // List/search souls (public)
  app.get("/", async (c) => {
    const tag = c.req.query("tag");
    const search = c.req.query("search");
    const sort = c.req.query("sort");
    const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query("limit") ?? "20", 10)));
    const offset = (page - 1) * limit;

    let whereClause = "";
    const params: (string | number)[] = [];

    if (tag) {
      whereClause = " WHERE tags LIKE ?";
      params.push(`%"${tag}"%`);
    } else if (search) {
      whereClause = " WHERE name LIKE ? OR description LIKE ? OR author LIKE ?";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    let orderClause = " ORDER BY updated_at DESC";
    if (sort === "top") {
      orderClause = " ORDER BY rating_avg DESC, rating_count DESC";
    } else if (sort === "popular") {
      orderClause = " ORDER BY rating_count DESC, rating_avg DESC";
    }

    // Get total count
    const countResult = await db.execute({ sql: `SELECT COUNT(*) as total FROM souls${whereClause}`, args: params });
    const total = Number(countResult.rows[0].total);

    // Get paginated results
    const query = `SELECT * FROM souls${whereClause}${orderClause} LIMIT ? OFFSET ?`;
    const result = await db.execute({ sql: query, args: [...params, limit, offset] });

    return c.json({
      data: result.rows.map((s) => ({
        ...s,
        tags: JSON.parse(s.tags as string),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  });

  // Get soul metadata (public)
  app.get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(c.req.query("limit") ?? "10", 10)));
    const offset = (page - 1) * limit;

    const result = await db.execute({ sql: "SELECT * FROM souls WHERE slug = ?", args: [slug] });
    const soul = result.rows[0] as unknown as SoulRecord | undefined;

    if (!soul) {
      return c.json({ error: "Soul not found" }, 404);
    }

    const countResult = await db.execute({
      sql: "SELECT COUNT(*) as total FROM soul_versions WHERE soul_id = ?",
      args: [soul.id],
    });
    const totalVersions = Number(countResult.rows[0].total);

    const versionsResult = await db.execute({
      sql: "SELECT version, content_hash, changelog, created_at FROM soul_versions WHERE soul_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      args: [soul.id, limit, offset],
    });

    return c.json({
      ...soul,
      tags: JSON.parse(soul.tags),
      versions: {
        data: versionsResult.rows,
        pagination: {
          page,
          limit,
          total: totalVersions,
          totalPages: Math.ceil(totalVersions / limit),
        },
      },
    });
  });

  // Get soul content (public)
  app.get("/:slug/content", async (c) => {
    const slug = c.req.param("slug");
    const result = await db.execute({ sql: "SELECT * FROM souls WHERE slug = ?", args: [slug] });
    const soul = result.rows[0] as unknown as SoulRecord | undefined;

    if (!soul) {
      return c.json({ error: "Soul not found" }, 404);
    }

    const content = await storage.getSoul(slug, soul.version);
    if (!content) {
      return c.json({ error: "Soul content not found" }, 404);
    }

    return c.text(content);
  });

  // Upload new soul (requires auth)
  app.post("/", requireAuth, async (c) => {
    const user = c.get("user");
    const body = await c.req.json<{ content: string; changelog?: string }>();
    if (!body.content) {
      return c.json({ error: "Missing 'content' field" }, 400);
    }

    const soul = parseSoulFile(body.content);
    const name = extractName(soul);
    const slug = slugify(name);
    const version = soul.frontmatter.version ?? "0.0.0";
    const author = user.github_username;

    const existingResult = await db.execute({ sql: "SELECT * FROM souls WHERE slug = ?", args: [slug] });
    if (existingResult.rows.length > 0) {
      return c.json({ error: `Soul '${slug}' already exists. Use POST /:slug/versions to publish a new version.` }, 409);
    }

    const tags = JSON.stringify(soul.frontmatter.tags ?? []);
    const filePath = await storage.saveSoul(slug, version, body.content);

    const insertResult = await db.execute({
      sql: "INSERT INTO souls (slug, name, author, description, version, tags) VALUES (?, ?, ?, ?, ?, ?)",
      args: [slug, name, author, soul.frontmatter.description ?? null, version, tags],
    });

    await db.execute({
      sql: "INSERT INTO soul_versions (soul_id, version, content_hash, file_path, changelog) VALUES (?, ?, ?, ?, ?)",
      args: [insertResult.lastInsertRowid!, version, soul.hash, filePath, body.changelog ?? null],
    });

    return c.json({ slug, name, version, hash: soul.hash }, 201);
  });

  // Publish new version (requires auth)
  app.post("/:slug/versions", requireAuth, async (c) => {
    const slug = c.req.param("slug");
    const body = await c.req.json<{ content: string; changelog?: string }>();

    if (!body.content) {
      return c.json({ error: "Missing 'content' field" }, 400);
    }

    const existingResult = await db.execute({ sql: "SELECT * FROM souls WHERE slug = ?", args: [slug] });
    const existing = existingResult.rows[0] as unknown as SoulRecord | undefined;
    if (!existing) {
      return c.json({ error: "Soul not found" }, 404);
    }

    const soul = parseSoulFile(body.content);
    const version = soul.frontmatter.version ?? "0.0.0";
    const name = extractName(soul);
    const filePath = await storage.saveSoul(slug, version, body.content);

    await db.execute({
      sql: "INSERT INTO soul_versions (soul_id, version, content_hash, file_path, changelog) VALUES (?, ?, ?, ?, ?)",
      args: [existing.id, version, soul.hash, filePath, body.changelog ?? null],
    });

    await db.execute({
      sql: "UPDATE souls SET version = ?, updated_at = datetime('now') WHERE id = ?",
      args: [version, existing.id],
    });

    return c.json({ slug, name, version, hash: soul.hash });
  });

  // Rate a soul (requires auth)
  app.post("/:slug/rate", requireAuth, async (c) => {
    const slug = c.req.param("slug");
    const user = c.get("user");
    const body = await c.req.json<{ rating: number }>();

    if (!body.rating || body.rating < 1 || body.rating > 5 || !Number.isInteger(body.rating)) {
      return c.json({ error: "Rating must be an integer between 1 and 5" }, 400);
    }

    const soulResult = await db.execute({ sql: "SELECT * FROM souls WHERE slug = ?", args: [slug] });
    const soul = soulResult.rows[0] as unknown as SoulRecord | undefined;
    if (!soul) {
      return c.json({ error: "Soul not found" }, 404);
    }

    // Upsert rating
    await db.execute({
      sql: "INSERT INTO soul_ratings (soul_id, user_id, rating) VALUES (?, ?, ?) ON CONFLICT(soul_id, user_id) DO UPDATE SET rating = excluded.rating",
      args: [soul.id, user.id, body.rating],
    });

    // Recalculate cached avg/count
    const statsResult = await db.execute({
      sql: "SELECT AVG(rating) as avg, COUNT(*) as count FROM soul_ratings WHERE soul_id = ?",
      args: [soul.id],
    });
    const stats = statsResult.rows[0] as unknown as { avg: number; count: number };

    const avg = Math.round(stats.avg * 10) / 10;
    await db.execute({
      sql: "UPDATE souls SET rating_avg = ?, rating_count = ? WHERE id = ?",
      args: [avg, stats.count, soul.id],
    });

    return c.json({ slug, rating: body.rating, rating_avg: avg, rating_count: stats.count });
  });

  return app;
}
