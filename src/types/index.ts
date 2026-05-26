export type ViteEnv = {
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_MEASUREMENT_ID?: string;
};

export type UserProfile = {
  uid: string;
  name: string;
  age: number;
  city: string;
  country: string;
  bio: string;
  interests: string[];
  verifiedStatus: boolean;
  values?: string[];
  image?: string;
  updatedAt?: unknown;
};

export type MatchRecord = {
  matchId: string;
  user1?: string;
  user2?: string;
  status: "liked" | "matched";
  profile: UserProfile;
  createdAt?: unknown;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  createdAt: unknown;
};

export type AppRoute = "welcome" | "discover" | "liked" | "chats" | "profile";

export type IconName = "discover" | "heart" | "chat" | "user" | "shield" | "check" | "x" | "send" | "lock" | "book" | "activity" | "refresh";
