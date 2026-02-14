import { serve } from "@hono/node-server";
import { createDatabase } from "./storage/sqlite.js";
import { LocalStorage } from "./storage/local.js";
import { createApiApp } from "./app.js";

async function main() {
  const db = await createDatabase();
  const storage = new LocalStorage();

  const app = createApiApp(db, storage);

  const port = parseInt(process.env.PORT ?? "3000", 10);

  serve({ fetch: app.fetch, port }, () => {
    console.log(`Soul.MD API running on http://localhost:${port}`);
  });
}

main();
