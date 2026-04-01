import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./db/db";
import { users, submissions } from "./db/schema";

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse,
) {
  const allUsers = await db.select().from(users);
  const allSubs = await db.select().from(submissions);

  const userStats = allUsers.map((u) => {
    const userSubs = allSubs
      .filter((s) => s.user_id === u.id)
      .sort(
        (a, b) =>
          new Date(a.solved_at).getTime() - new Date(b.solved_at).getTime(),
      );

    const totalPoints = userSubs.reduce((sum, s) => sum + s.points, 0);

    return {
      id: u.id,
      username: u.username,
      totalPoints,
      solves: userSubs,
    };
  });

  userStats.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.solves.length === 0) return 1;
    if (b.solves.length === 0) return -1;
    const lastA = new Date(a.solves[a.solves.length - 1].solved_at).getTime();
    const lastB = new Date(b.solves[b.solves.length - 1].solved_at).getTime();
    return lastA - lastB;
  });

  res.status(200).json(userStats.slice(0, 20));
}
