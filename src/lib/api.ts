import { CHALLENGES } from "./challenges";
import type { User, Submission } from "./types";

export type { User, Submission };
export type { Challenge } from "./challenges";

export const api = {
  getChallenges: () => CHALLENGES,

  getChallenge: (id: number) => CHALLENGES.find((c) => c.id === id),

  registerUser: async (username: string): Promise<User> => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      return res.json();
    } catch (e) {
      throw new Error("Registration failed");
    }
  },

  verifyFlag: async (
    userId: string,
    challengeId: number,
    flag: string,
  ): Promise<{
    success: boolean;
    message: string;
    points?: number;
  }> => {
    try {
      const res = await fetch("/api/verify-flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, challengeId, flag }),
      });
      if (!res.ok) {
        throw new Error("Failed to verify");
      }
      return res.json();
    } catch (e) {
      throw new Error("Failed to verify");
    }
  },

  getUserSubmissions: async (userId: string): Promise<Submission[]> => {
    try {
      const res = await fetch(
        `/api/submissions?userId=${encodeURIComponent(userId)}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch submissions");
      }
      return res.json();
    } catch (e) {
      throw new Error("Failed to fetch submissions");
    }
  },

  isUserExists: async (userId: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `/api/exists?userId=${encodeURIComponent(userId)}`,
      );
      if (!res.ok) return false;
      return await res.json();
    } catch (e) {
      return false;
    }
  },

  getLeaderboard: async (): Promise<
    {
      id: string;
      username: string;
      totalPoints: number;
      solves: Submission[];
    }[]
  > => {
    try {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    } catch (e) {
      throw new Error("Failed to fetch leaderboard");
    }
  },
};
