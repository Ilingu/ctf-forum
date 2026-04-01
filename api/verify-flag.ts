import type { VercelRequest, VercelResponse } from "@vercel/node";
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { users, submissions } from "./db/schema";
import { CHALLENGES } from "../src/lib/challenges";

const FLAGS: Record<number, string> = {
  1: "flag{h0la_b13nv3nue_d4ns_l3_ctf}",
  2: "flag{l3s_d3vs_0ubl13nt_t0uj0urs_d3s_s3cr3ts}",
  3: "flag{rgrggr}",
  4: "flag{l3_chiffre_de_c3sar_est_un_classique}",
  5: "flag{cy_erse_urit_}",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, challengeId, flag } = req.body ?? {};

  if (
    typeof userId !== "string" ||
    typeof challengeId !== "number" ||
    typeof flag !== "string"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid payload." });
  }

  // Check user exists
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    return res
      .status(200)
      .json({ success: false, message: "Utilisateur non trouvé." });
  }

  // Check already solved
  const existing = await db
    .select({ id: submissions.id })
    .from(submissions)
    .where(
      and(
        eq(submissions.user_id, userId),
        eq(submissions.challenge_id, challengeId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    return res
      .status(200)
      .json({ success: false, message: "Tu as déjà résolu ce challenge." });
  }

  // Verify flag
  const normalizedFlag = flag.trim().toLowerCase();
  if (normalizedFlag !== FLAGS[challengeId]) {
    return res
      .status(200)
      .json({ success: false, message: "Mauvais flag, réessaie." });
  }

  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) {
    return res
      .status(200)
      .json({ success: false, message: "Challenge inconnu." });
  }

  await db.insert(submissions).values({
    user_id: userId,
    challenge_id: challengeId,
    points: challenge.points,
  });

  return res
    .status(200)
    .json({ success: true, points: challenge.points, message: "Bravo !" });
}
