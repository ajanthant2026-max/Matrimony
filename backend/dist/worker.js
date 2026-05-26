import { Worker } from "bullmq";
import { connection, SYNC_QUEUE_NAME } from "./queue.js";
import { prisma } from "./db.js";
/**
 * Audit-log helper with database outage safety.
 * If PostgreSQL is offline, we cannot write the audit log to DB, so we print to console and proceed.
 * If DB is online, we persist the sync state for full observability.
 */
async function logSyncAudit(entityType, entityId, action, status, attempts, errorMessage) {
    const logMsg = `[SyncAuditLog] ${entityType} | ID: ${entityId} | Action: ${action} | Status: ${status} | Attempt: ${attempts}${errorMessage ? ` | Error: ${errorMessage}` : ""}`;
    if (status === "SUCCESS") {
        console.log(`✅ ${logMsg}`);
    }
    else {
        console.error(`🚨 ${logMsg}`);
    }
    try {
        await prisma.syncAuditLog.create({
            data: {
                entityType,
                entityId,
                action,
                status,
                attempts,
                errorMessage,
            },
        });
    }
    catch (err) {
        console.warn(`⚠️ Unable to write SyncAuditLog to PostgreSQL (Database is likely offline): ${err.message}`);
    }
}
/**
 * Processes sync tasks.
 * Performs operations on PostgreSQL using Prisma.
 * If PostgreSQL is offline or a connection is lost, it throws an error to trigger BullMQ's retry queue.
 */
export async function processSyncJob(job) {
    const { entityType, entityId, action, data } = job.data;
    const attempts = job.attemptsMade + 1;
    try {
        switch (entityType) {
            case "USER":
                await prisma.user.upsert({
                    where: { id: entityId },
                    update: {
                        name: data.name,
                        age: data.age,
                        city: data.city,
                        country: data.country,
                        bio: data.bio,
                        interests: data.interests || [],
                        verifiedStatus: data.verifiedStatus || false,
                        values: data.values || [],
                        image: data.image || null,
                    },
                    create: {
                        id: entityId,
                        name: data.name,
                        age: data.age,
                        city: data.city,
                        country: data.country,
                        bio: data.bio,
                        interests: data.interests || [],
                        verifiedStatus: data.verifiedStatus || false,
                        values: data.values || [],
                        image: data.image || null,
                    },
                });
                break;
            case "LIKE":
                await prisma.like.upsert({
                    where: {
                        fromUserId_toUserId: {
                            fromUserId: data.fromUserId,
                            toUserId: data.toUserId,
                        },
                    },
                    update: {},
                    create: {
                        fromUserId: data.fromUserId,
                        toUserId: data.toUserId,
                    },
                });
                break;
            case "MATCH":
                await prisma.match.upsert({
                    where: { matchId: entityId },
                    update: {
                        status: data.status || "matched",
                    },
                    create: {
                        matchId: entityId,
                        user1Id: data.user1,
                        user2Id: data.user2,
                        status: data.status || "matched",
                    },
                });
                break;
            case "MESSAGE":
                await prisma.message.upsert({
                    where: { id: entityId },
                    update: {
                        text: data.text,
                    },
                    create: {
                        id: entityId,
                        matchId: data.matchId || "unknown",
                        senderId: data.senderId,
                        text: data.text,
                        createdAt: new Date(data.createdAt || Date.now()),
                    },
                });
                break;
            default:
                throw new Error(`Unsupported entity type: ${entityType}`);
        }
        // Success audit logging
        const auditStatus = attempts > 1 ? "RETRIED" : "SUCCESS";
        await logSyncAudit(entityType, entityId, action, auditStatus, attempts);
    }
    catch (error) {
        const errorMsg = error.message;
        // Log failure locally
        await logSyncAudit(entityType, entityId, action, "FAILED", attempts, errorMsg);
        // VERY IMPORTANT: Throwing the error triggers BullMQ retry mechanism
        throw error;
    }
}
// Global reference for worker
export let databaseSyncWorker = null;
export function startSyncWorker() {
    if (databaseSyncWorker)
        return;
    console.log("⚙️ Starting Resilient Database Sync Worker...");
    databaseSyncWorker = new Worker(SYNC_QUEUE_NAME, processSyncJob, {
        connection,
        concurrency: 2, // Process up to 2 tasks in parallel per container
    });
    databaseSyncWorker.on("completed", (job) => {
        console.log(`✨ Sync Job completed successfully: [Job ID: ${job.id}]`);
    });
    databaseSyncWorker.on("failed", (job, err) => {
        if (job) {
            console.warn(`🚨 Sync Job failed: [Job ID: ${job.id}]. Attempts made: ${job.attemptsMade}/${job.opts.attempts}. Next retry in progress. Error: ${err.message}`);
        }
        else {
            console.error(`🚨 Sync Worker encountered a generic failure: ${err.message}`);
        }
    });
    databaseSyncWorker.on("error", (err) => {
        console.error(`💥 Fatal Sync Worker internal error: ${err.message}`);
    });
}
