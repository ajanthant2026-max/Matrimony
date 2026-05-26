import { Queue, QueueEvents } from "bullmq";
import { Redis } from "ioredis";
import { config } from "./config.js";
// Safe options for Redis (especially TLS-enabled Upstash endpoints)
export const redisConnectionOptions = {
    maxRetriesPerRequest: null, // BullMQ required
    enableReadyCheck: false, // Fix for Upstash serverless Redis
};
// Initialize sharing Redis connection
let redisClient;
try {
    redisClient = new Redis(config.redisUrl, redisConnectionOptions);
    redisClient.on("connect", () => {
        console.log("🔌 Connected to Redis / Upstash Message Bus");
    });
    redisClient.on("error", (err) => {
        console.error("❌ Redis Connection Error:", err.message);
    });
}
catch (error) {
    console.error("Failed to initialize Redis client:", error);
    // Fail-soft mock so the compiler and app don't completely crash locally
    redisClient = {};
}
export const connection = redisClient;
// Sync Queue Name
export const SYNC_QUEUE_NAME = "aranyam-database-sync";
// Initialize BullMQ Queue
export let syncQueue = null;
export let queueEvents = null;
try {
    syncQueue = new Queue(SYNC_QUEUE_NAME, {
        connection,
        defaultJobOptions: {
            attempts: 10, // Try up to 10 times
            backoff: {
                type: "exponential",
                delay: 5000, // Start with 5 seconds delay, then 10s, 20s, 40s, 80s...
            },
            removeOnComplete: true, // Keep Redis memory clean!
            removeOnFail: false, // Keep failures for Dead-Letter inspection
        },
    });
    queueEvents = new QueueEvents(SYNC_QUEUE_NAME, { connection });
    queueEvents.on("failed", ({ jobId, failedReason }) => {
        console.warn(`⚠️ Job ${jobId} failed: ${failedReason}. Will retry with exponential backoff.`);
    });
}
catch (error) {
    console.error("Failed to initialize BullMQ Queue:", error);
}
/**
 * Publishes a synchronization transaction event to the message bus queue.
 */
export async function enqueueSync(payload) {
    if (!syncQueue) {
        console.error("❌ Cannot enqueue sync: Queue is not initialized.");
        return false;
    }
    try {
        const jobName = `${payload.entityType}_${payload.action}_${payload.entityId}`;
        await syncQueue.add(jobName, payload);
        console.log(`✉️ Message published to Queue: [${payload.entityType}] ${payload.action} for ID ${payload.entityId}`);
        return true;
    }
    catch (error) {
        console.error("❌ Failed to publish message to queue:", error.message);
        return false;
    }
}
