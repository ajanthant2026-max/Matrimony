import { UserProfile, MatchRecord } from "../types";

// Load Backend Gateway URL from Vite env or fallback
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://127.0.0.1:8080";

/**
 * Fires synchronization API requests to our resilient Express backend.
 * Uses a soft fail-safe approach: if the backend is down, it prints a warning,
 * but allows the client app to continue functioning fully via Firebase's real-time client!
 */
export const backendSync = {
  /**
   * Syncs user profiles to PostgreSQL database via Gateway
   */
  async syncProfile(profile: UserProfile): Promise<boolean> {
    try {
      console.log(`📡 Syncing profile [${profile.name}] to relational backend...`);
      const response = await fetch(`${BACKEND_URL}/api/sync/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": profile.uid, // Sandboxed header auth
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const resData = await response.json();
      console.log("✅ Profile sync enqueued on backend message queue:", resData);
      return true;
    } catch (error) {
      console.warn("⚠️ Fail-Safe: Relational backend sync is currently unavailable. Operating solely on Firebase. Error:", (error as Error).message);
      return false;
    }
  },

  /**
   * Syncs swipe / likes to PostgreSQL database
   */
  async syncSwipe(fromUserId: string, toUserId: string): Promise<boolean> {
    try {
      console.log(`📡 Syncing swipe [${fromUserId} -> ${toUserId}] to relational backend...`);
      const response = await fetch(`${BACKEND_URL}/api/sync/swipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": fromUserId,
        },
        body: JSON.stringify({ fromUserId, toUserId }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const resData = await response.json();
      console.log("✅ Swipe sync enqueued on backend message queue:", resData);
      return true;
    } catch (error) {
      console.warn("⚠️ Fail-Safe: Relational backend sync is currently unavailable. Operating solely on Firebase. Error:", (error as Error).message);
      return false;
    }
  },

  /**
   * Syncs successful pairings to PostgreSQL database
   */
  async syncMatch(matchRecord: MatchRecord): Promise<boolean> {
    try {
      console.log(`📡 Syncing match [${matchRecord.matchId}] to relational backend...`);
      const response = await fetch(`${BACKEND_URL}/api/sync/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": matchRecord.user1 || "",
        },
        body: JSON.stringify({
          matchId: matchRecord.matchId,
          user1: matchRecord.user1,
          user2: matchRecord.user2,
          status: matchRecord.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const resData = await response.json();
      console.log("✅ Match sync enqueued on backend message queue:", resData);
      return true;
    } catch (error) {
      console.warn("⚠️ Fail-Safe: Relational backend sync is currently unavailable. Operating solely on Firebase. Error:", (error as Error).message);
      return false;
    }
  },

  /**
   * Archives chat message logs to PostgreSQL database
   */
  async syncMessage(messageId: string, matchId: string, senderId: string, text: string, createdAt: any): Promise<boolean> {
    try {
      console.log(`📡 Archiving message [${messageId}] to relational backend...`);
      const response = await fetch(`${BACKEND_URL}/api/sync/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": senderId,
        },
        body: JSON.stringify({
          id: messageId,
          matchId,
          senderId,
          text,
          createdAt: typeof createdAt?.toDate === "function" ? createdAt.toDate().toISOString() : new Date(createdAt).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const resData = await response.json();
      console.log("✅ Message archive enqueued on backend message queue:", resData);
      return true;
    } catch (error) {
      console.warn("⚠️ Fail-Safe: Relational backend sync is currently unavailable. Operating solely on Firebase. Error:", (error as Error).message);
      return false;
    }
  }
};
