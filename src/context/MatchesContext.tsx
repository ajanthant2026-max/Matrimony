import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { MatchRecord, ChatMessage, UserProfile } from "../types";
import { useAuth } from "./AuthContext";
import { backendSync } from "../utils/backendSync";

interface MatchesContextType {
  liked: UserProfile[];
  matches: MatchRecord[];
  activeChat: MatchRecord | null;
  setActiveChat: (chat: MatchRecord | null) => void;
  messages: ChatMessage[];
  likeProfile: (target: UserProfile | undefined) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [liked, setLiked] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [activeChat, setActiveChat] = useState<MatchRecord | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      senderId: "profile_anjali",
      text: "Vanakkam. Your Tamil literature note made me smile.",
      createdAt: new Date(),
    },
  ]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !activeChat?.matchId) return;

    const messagesQuery = query(
      collection(db, "chats", activeChat.matchId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as ChatMessage));
    });

    return unsubscribe;
  }, [activeChat?.matchId]);

  async function likeProfile(target: UserProfile | undefined) {
    if (!target) return;
    const isMatch = liked.length % 2 === 0;
    const matchId = [profile.uid, target.uid].sort().join("_");
    const matchRecord: MatchRecord = {
      matchId,
      user1: profile.uid,
      user2: target.uid,
      status: isMatch ? "matched" : "liked",
      profile: target,
      createdAt: isFirebaseConfigured ? serverTimestamp() : new Date(),
    };

    setLiked((current) => [target, ...current.filter((item) => item.uid !== target.uid)]);
    if (isMatch) {
      setMatches((current) => [matchRecord, ...current.filter((item) => item.matchId !== matchId)]);
      setActiveChat(matchRecord);
    }

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "matches", matchId), matchRecord, { merge: true });
    }

    // Sync to PostgreSQL via message bus (fail-safe)
    backendSync.syncSwipe(profile.uid, target.uid);
    if (isMatch) {
      backendSync.syncMatch(matchRecord);
    }
  }

  async function sendMessage(text: string) {
    text = text.trim();
    if (!text || !activeChat) return;

    const message = {
      id: `local_${Date.now()}`,
      senderId: profile.uid,
      text,
      createdAt: new Date(),
    };

    if (isFirebaseConfigured && db) {
      const docRef = await addDoc(collection(db, "chats", activeChat.matchId, "messages"), {
        senderId: profile.uid,
        text,
        createdAt: serverTimestamp(),
      });
      // Archive to PostgreSQL replica via message bus
      backendSync.syncMessage(docRef.id, activeChat.matchId, profile.uid, text, new Date());
    } else {
      setMessages((current) => [...current, message]);
      // Archive to PostgreSQL replica via message bus
      backendSync.syncMessage(message.id, activeChat.matchId, profile.uid, text, message.createdAt);
    }
  }

  return (
    <MatchesContext.Provider
      value={{
        liked,
        matches,
        activeChat,
        setActiveChat,
        messages,
        likeProfile,
        sendMessage,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (context === undefined) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
}
