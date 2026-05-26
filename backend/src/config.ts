import dotenv from "dotenv";
import path from "path";

// Load local .env if available
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "8080", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  
  // PostgreSQL URL (Prisma connects to this)
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/aranyam_matrimony",
  
  // Redis URL (Upstash or local Redis)
  redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  
  // Firebase configuration
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "matrimony-5eae0",
  
  // Local development auth bypass (helpful for testing without live tokens)
  bypassAuthLocal: process.env.BYPASS_AUTH_LOCAL === "true" || process.env.NODE_ENV !== "production",
};

// Validate that critical production variables are set
if (config.nodeEnv === "production") {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ Warning: DATABASE_URL is not set in production. Falling back to default.");
  }
  if (!process.env.REDIS_URL) {
    console.warn("⚠️ Warning: REDIS_URL is not set in production. Falling back to default.");
  }
}
