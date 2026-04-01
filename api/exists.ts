import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./db/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const userId = req.query.userId;
  if (typeof userId !== "string") {
    return res.status(400).json({ error: "Missing userId" });
  }

  const rows = await db.select().from(users).where(eq(users.id, userId));
  res.status(200).json(rows.length > 0);
}
