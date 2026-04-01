import type { VercelRequest, VercelResponse } from "@vercel/node";
import { CHALLENGES } from "../src/lib/challenges.js";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json(CHALLENGES);
}
