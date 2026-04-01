export interface User {
  id: string;
  username: string;
  created_at: string;
}

export interface Submission {
  id: number;
  user_id: string;
  challenge_id: number;
  solved_at: string;
  points: number;
}
