import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { submissions } from "./db/schema.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const userId = req.query.userId;
  if (typeof userId !== "string") {
    return res.status(400).json({ error: "Missing userId" });
  }

  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.user_id, userId));

  res.status(200).json(rows);
}
