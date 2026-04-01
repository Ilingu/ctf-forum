import type { VercelRequest, VercelResponse } from "@vercel/node";
import { users } from "./db/schema";
import { db } from "./db/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username } = req.body ?? {};
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Invalid username" });
  }

  const [newUser] = await db.insert(users).values({ username }).returning();
  res.status(200).json(newUser);
}
