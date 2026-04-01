import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL!;

// prepare: false est recommandé pour le connection pooler de Supabase (pgBouncer en mode transaction)
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
