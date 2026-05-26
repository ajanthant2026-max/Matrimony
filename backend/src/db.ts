import { PrismaClient } from "@prisma/client";
import { config } from "./config.js";

class ResilientDatabase {
  public prisma: PrismaClient;
  private isConnected: boolean = false;
  private connectionRetries: number = 0;
  private maxRetries: number = 5;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
      log: config.nodeEnv === "development" ? ["query", "info", "warn", "error"] : ["error", "warn"],
    });
  }

  /**
   * Safe check to test if PostgreSQL database is reachable.
   * This is used during bootup and by health checks.
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Execute a simple fast query to verify connection
      await this.prisma.$queryRaw`SELECT 1`;
      this.isConnected = true;
      this.connectionRetries = 0;
      return true;
    } catch (error) {
      this.isConnected = false;
      console.error("❌ PostgreSQL Connection Failed:", (error as Error).message);
      return false;
    }
  }

  /**
   * Bootstraps the database connection.
   * If it fails, logs warning but does not exit the process, keeping the Gateway online!
   */
  async connectGracefully(): Promise<void> {
    console.log("🔌 Initializing PostgreSQL connection...");
    const ok = await this.checkConnection();
    if (ok) {
      console.log("✅ PostgreSQL is online and connected!");
    } else {
      console.warn("⚠️ PostgreSQL is currently OFFLINE. The API Gateway will remain online, and all database writes will be safely buffered in Upstash Redis!");
    }
  }

  /**
   * Returns current database operational status.
   */
  getStatus() {
    return {
      connected: this.isConnected,
      databaseUrl: config.databaseUrl.split("@")[1] || "localhost", // Redact credentials
    };
  }

  /**
   * Gracefully shuts down the Prisma connection pool.
   */
  async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      console.log("🔌 PostgreSQL connection pool gracefully disconnected.");
    } catch (error) {
      console.error("Error disconnecting from PostgreSQL:", error);
    }
  }
}

export const dbService = new ResilientDatabase();
export const prisma = dbService.prisma;
export default dbService;
