import { Hono } from "hono";
import type { Client } from "@libsql/client";

export function userRoutes(db: Client) {
  const app = new Hono();

  // Get user profile (public)
  app.get("/:username", async (c) => {
    const username = c.req.param("username");
    const result = await db.execute({
      sql: "SELECT id, github_username as username, avatar_url as avatar FROM users WHERE github_username = ?",
      args: [username],
    });
    const user = result.rows[0];
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json(user);
  });

  // Get souls by author (public)
  app.get("/:username/souls", async (c) => {
    const username = c.req.param("username");
    const page = Math.max(1, parseInt(c.req.query("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query("limit") ?? "20", 10)));
    const offset = (page - 1) * limit;

    const countResult = await db.execute({
      sql: "SELECT COUNT(*) as total FROM souls s JOIN users u ON s.user_id = u.id WHERE u.github_username = ?",
      args: [username],
    });
    const total = Number(countResult.rows[0].total);

    const result = await db.execute({
      sql: "SELECT s.*, u.github_username as author FROM souls s JOIN users u ON s.user_id = u.id WHERE u.github_username = ? ORDER BY s.created_at DESC LIMIT ? OFFSET ?",
      args: [username, limit, offset],
    });

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

  return app;
}
