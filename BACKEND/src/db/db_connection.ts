import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString =
  process.env.DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DB_URL or DATABASE_URL environment variable");
}

const client = postgres(connectionString);

export const db = drizzle({
  client,
});

// Verify database connection
export async function verifyConnection() {
  try {
    await db.execute(`SELECT 1`);

    console.log("✓ Database connection established successfully");
    return true;
  } catch (err) {
    console.error("✗ Database connection failed:", err);
    return false;
  }
}