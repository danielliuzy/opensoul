import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export interface AuthUser {
  id: number;
  github_id: number;
  github_username: string;
}

type AuthEnv = {
  Variables: {
    user: AuthUser;
  };
};

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return c.json({ error: "Server misconfigured: JWT_SECRET not set" }, 500);
  }

  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Authentication required" }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const payload = await verify(token, jwtSecret, "HS256") as unknown as AuthUser;
    c.set("user", {
      id: payload.id,
      github_id: payload.github_id,
      github_username: payload.github_username,
    });
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});
