import "dotenv/config";
import app from "./app";
import { verifyConnection } from "./db/db_connection";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  try {
    // Verify database connection before starting server
    const isConnected = await verifyConnection();

    if (!isConnected) {
      throw new Error("Could not establish database connection");
    }

    console.log("Database connected successfully");

    Bun.serve({
      port: PORT,
      fetch: app.fetch,
    });

    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();