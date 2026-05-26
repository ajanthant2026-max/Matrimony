import { dbService } from "./db.js";
import { startGatewayServer } from "./gateway.js";
import { startSyncWorker, databaseSyncWorker } from "./worker.js";
async function bootstrap() {
    console.log("🚀 ==============================================");
    console.log("🚀 Starting Aranyam Matrimony Scale-Ready Backend");
    console.log("🚀 ==============================================");
    // 1. Establish PostgreSQL database connection pool gracefully
    await dbService.connectGracefully();
    // 2. Start the background queue consumer worker
    startSyncWorker();
    // 3. Start the REST API Gateway
    const gatewayServer = startGatewayServer();
    /**
     * Graceful Shutdown Handler
     */
    async function shutdown(signal) {
        console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);
        // Stop accepting new API requests
        gatewayServer.close(() => {
            console.log("🌐 Express API Gateway server closed.");
        });
        // Close BullMQ worker processing
        if (databaseSyncWorker) {
            try {
                await databaseSyncWorker.close();
                console.log("⚙️ Background Queue Worker stopped.");
            }
            catch (err) {
                console.error("Error stopping Queue Worker during shutdown:", err);
            }
        }
        // Disconnect PostgreSQL connection pool
        await dbService.disconnect();
        console.log("👋 Graceful shutdown complete. Exiting process safely.");
        process.exit(0);
    }
    // Bind OS termination signals
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}
bootstrap().catch((error) => {
    console.error("💥 Fatal system bootstrap error:", error);
    process.exit(1);
});
