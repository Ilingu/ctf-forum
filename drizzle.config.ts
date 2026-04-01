import { defineConfig } from "drizzle-kit";

console.log(process.env.DATABASE_URL);

export default defineConfig({
  schema: "./api/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
