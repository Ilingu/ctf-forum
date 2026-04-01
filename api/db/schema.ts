import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  serial,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challenge_id: integer("challenge_id").notNull(),
    solved_at: timestamp("solved_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    points: integer("points").notNull(),
  },
  (t) => [unique("unique_user_challenge").on(t.user_id, t.challenge_id)],
);
