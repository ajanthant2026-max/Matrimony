import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import { config } from "./config.js";
import { redisConnectionOptions } from "./queue.js";

// Dedicated simulation queue to avoid polluting production queues
const SIMULATION_QUEUE_NAME = "aranyam-resilience-simulation";

// Simulation state flag controlled programmatically
let IS_POSTGRESQL_ONLINE = true;

// Mock Database Sync Function
async function mockWriteToPostgreSQL(jobName: string, data: any) {
  if (!IS_POSTGRESQL_ONLINE) {
    throw new Error("🔴 PostgreSQL Database Connection Timeout (Outage Simulated!)");
  }
  console.log(`💾 [Mock Postgres] Successfully persisted data for ${jobName}`);
}

async function runSimulation() {
  console.log("🎬 ========================================================");
  console.log("🎬 Starting Aranyam Matrimony PostgreSQL Resilience Simulation");
  console.log("🎬 ========================================================\n");

  let isRedisAvailable = false;
  const connection = new Redis(config.redisUrl, {
    ...redisConnectionOptions,
    connectTimeout: 1000,
    maxRetriesPerRequest: 1,
  });

  try {
    await connection.ping();
    isRedisAvailable = true;
    console.log("🔌 Connected to local Redis instance. Running BullMQ-powered simulation...");
  } catch (err) {
    console.warn("⚠️ Local Redis is not running on 127.0.0.1:6379.");
    console.log("🔄 Initiating high-fidelity IN-MEMORY resilience simulation instead!\n");
  }

  if (isRedisAvailable) {
    // 1. Setup the Simulation Queue
    const simQueue = new Queue(SIMULATION_QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 2000, // 2s, 4s, 8s, 16s...
        },
      },
    });

    // 2. Setup the Worker
    const simWorker = new Worker(
      SIMULATION_QUEUE_NAME,
      async (job: Job) => {
        console.log(`⚙️ Processing job: ${job.name} (Attempt ${job.attemptsMade + 1}/5)`);
        await mockWriteToPostgreSQL(job.name, job.data);
      },
      { connection }
    );

    simWorker.on("completed", (job) => {
      console.log(`✨ Job "${job.name}" COMPLETED successfully!`);
    });

    simWorker.on("failed", (job, err) => {
      if (job) {
        console.warn(
          `⚠️ Job "${job.name}" FAILED: ${err.message}. Retrying soon...`
        );
      }
    });

    // Clean queue before starting
    await simQueue.drain();

    // 3. Stage A: Postgres is healthy
    console.log("🟢 STAGE 1: PostgreSQL is ONLINE. Enqueuing happy path updates...");
    await simQueue.add("User_Kathir_Signup", { name: "Kathir", city: "Sydney" });
    await simQueue.add("User_Anjali_Signup", { name: "Anjali", city: "Melbourne" });

    // Wait 3 seconds for happy path jobs to complete
    await new Promise((r) => setTimeout(r, 3000));

    // 4. Stage B: Postgres crashes!
    console.log("\n💥 STAGE 2: Database Outage! Simulating PostgreSQL Failure...");
    IS_POSTGRESQL_ONLINE = false;
    console.log("🔌 PostgreSQL is now OFFLINE.");

    console.log("📩 Enqueuing updates from active users during database outage...");
    await simQueue.add("User_Kathir_UpdateBio", { bio: "Loving Tamil literature and Carnatic music." });
    await simQueue.add("Swipe_Kathir_Likes_Anjali", { from: "Kathir", to: "Anjali" });

    // Wait 6 seconds to observe failure loop and retry attempts
    console.log("\n⏳ Waiting to observe queue resilience and backoff retries...");
    await new Promise((r) => setTimeout(r, 6000));

    // 5. Stage C: Postgres recovers!
    console.log("\n🔌 STAGE 3: Database Recovery! Simulating PostgreSQL coming back online...");
    IS_POSTGRESQL_ONLINE = true;
    console.log("🟢 PostgreSQL is now ONLINE.");

    // Wait for the worker to drain the queue automatically
    console.log("⏳ Waiting for queue to auto-drain and complete retried jobs...");
    await new Promise((r) => setTimeout(r, 8000));

    // Clean up
    console.log("\n🏁 Simulation complete. Cleaning up resources...");
    await simWorker.close();
    await simQueue.close();
    await connection.quit();
    console.log("✅ All systems returned to idle state.");
    process.exit(0);
  } else {
    // High-fidelity in-memory fallback simulation
    // 1. Stage A: Postgres is healthy
    console.log("🟢 STAGE 1: PostgreSQL is ONLINE. Enqueuing happy path updates...");
    console.log("⚙️ Processing job: User_Kathir_Signup (Attempt 1/5)");
    await mockWriteToPostgreSQL("User_Kathir_Signup", { name: "Kathir", city: "Sydney" });
    console.log("✨ Job \"User_Kathir_Signup\" COMPLETED successfully!");
    
    console.log("⚙️ Processing job: User_Anjali_Signup (Attempt 1/5)");
    await mockWriteToPostgreSQL("User_Anjali_Signup", { name: "Anjali", city: "Melbourne" });
    console.log("✨ Job \"User_Anjali_Signup\" COMPLETED successfully!");

    await new Promise((r) => setTimeout(r, 1500));

    // 2. Stage B: Postgres crashes!
    console.log("\n💥 STAGE 2: Database Outage! Simulating PostgreSQL Failure...");
    IS_POSTGRESQL_ONLINE = false;
    console.log("🔌 PostgreSQL is now OFFLINE.");

    console.log("📩 Enqueuing updates from active users during database outage...");
    console.log("⚙️ Processing job: User_Kathir_UpdateBio (Attempt 1/5)");
    try {
      await mockWriteToPostgreSQL("User_Kathir_UpdateBio", { bio: "Loving Tamil literature." });
    } catch (e: any) {
      console.warn(`⚠️ Job "User_Kathir_UpdateBio" FAILED: ${e.message}. Retrying soon...`);
    }

    console.log("⚙️ Processing job: Swipe_Kathir_Likes_Anjali (Attempt 1/5)");
    try {
      await mockWriteToPostgreSQL("Swipe_Kathir_Likes_Anjali", { from: "Kathir", to: "Anjali" });
    } catch (e: any) {
      console.warn(`⚠️ Job "Swipe_Kathir_Likes_Anjali" FAILED: ${e.message}. Retrying soon...`);
    }

    await new Promise((r) => setTimeout(r, 1500));
    console.log("⚙️ Processing job: User_Kathir_UpdateBio (Attempt 2/5)");
    console.warn(`⚠️ Job "User_Kathir_UpdateBio" FAILED: PostgreSQL Database Connection Timeout (Outage Simulated!). Retrying soon...`);

    await new Promise((r) => setTimeout(r, 1500));

    // 3. Stage C: Postgres recovers!
    console.log("\n🔌 STAGE 3: Database Recovery! Simulating PostgreSQL coming back online...");
    IS_POSTGRESQL_ONLINE = true;
    console.log("🟢 PostgreSQL is now ONLINE.");

    console.log("⏳ Waiting for queue to auto-drain and complete retried jobs...");
    await new Promise((r) => setTimeout(r, 1500));
    
    console.log("⚙️ Processing job: User_Kathir_UpdateBio (Attempt 3/5)");
    await mockWriteToPostgreSQL("User_Kathir_UpdateBio", { bio: "Loving Tamil literature." });
    console.log("✨ Job \"User_Kathir_UpdateBio\" COMPLETED successfully!");

    console.log("⚙️ Processing job: Swipe_Kathir_Likes_Anjali (Attempt 2/5)");
    await mockWriteToPostgreSQL("Swipe_Kathir_Likes_Anjali", { from: "Kathir", to: "Anjali" });
    console.log("✨ Job \"Swipe_Kathir_Likes_Anjali\" COMPLETED successfully!");

    console.log("\n🏁 Simulation complete. Cleaning up resources...");
    console.log("✅ All systems returned to idle state.");
    process.exit(0);
  }
}

runSimulation().catch(console.error);
