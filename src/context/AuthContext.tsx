import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInAnonymously, updateProfile, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, getDoc, limit, onSnapshot, query, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../firebase";
import { UserProfile, AppRoute } from "../types";
import { seedProfiles } from "../data/mockData";
import { backendSync } from "../utils/backendSync";

type AuthUser = { uid: string; displayName?: string | null; isAnonymous?: boolean };

interface AuthContextType {
  route: AppRoute;
  setRoute: (route: AppRoute) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  authUser: AuthUser | null;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  profiles: UserProfile[];
  status: string;
  signUpWithEmail: (form: { name: string; email: string; password: string; city: string }) => Promise<void>;
  continueAsGuest: (form: { name: string; city: string }) => Promise<void>;
  signInWithGoogle: (form?: { name?: string; email?: string; city?: string }) => Promise<void>;
  startDesktopSandbox: (form: { name: string; city: string }) => void;
  completeOnboarding: (form: { name: string; city: string }) => Promise<void>;
  authLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialProfile(): UserProfile {
  return {
    uid: `mock_${Date.now()}`,
    name: "Aranyam Guest",
    age: 28,
    city: "Sydney",
    country: "Australia · Diaspora",
    bio: "I value warmth, clarity, and a relationship that leaves both people more themselves.",
    interests: ["Tamil literature", "Travel", "Ilaiyaraaja", "Diaspora identity"],
    verifiedStatus: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<AppRoute>("welcome");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>(getInitialProfile());
  const [profiles, setProfiles] = useState<UserProfile[]>(seedProfiles);
  const [status, setStatus] = useState(isFirebaseConfigured ? "Connecting to Firebase..." : "Sandbox mode");

  // Track whether we've finished the initial auth check so we don't flash the welcome screen
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      const guestUid = `mock_${Date.now()}`;
      setAuthUser({ uid: guestUid, displayName: "Aranyam Guest", isAnonymous: true });
      setAuthLoading(false);
      return;
    }

    // Capture incoming Google Redirect Auth returns on load
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("🔥 Successfully signed in via Google Redirect!", result.user);
        }
      })
      .catch((err) => {
        console.error("❌ Google redirect sign-in failed:", err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        setStatus("Firebase connected");
        setAuthLoading(false); // Hide loading spinner instantly once Auth resolves!

        // Load Firestore profile in the background asynchronously
        if (db) {
          try {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
              // Returning user — load their saved profile
              const savedProfile = snap.data() as UserProfile;
              const loadedProfile = { ...savedProfile, uid: user.uid };
              setProfile(loadedProfile);
              // Sync back to SQL replica in background
              backendSync.syncProfile(loadedProfile);
              setRoute("discover");
            } else {
              // New user — pre-fill from Google account and route to discover
              setProfile((current) => ({
                ...current,
                uid: user.uid,
                name: user.displayName || current.name,
                image: user.photoURL || current.image,
              }));
              setRoute("discover");
            }
          } catch (e) {
            console.error("Firestore profile fetch error:", e);
            // Move forward on error
            setProfile((current) => ({
              ...current,
              uid: user.uid,
              name: user.displayName || current.name,
              image: user.photoURL || current.image,
            }));
            setRoute("discover");
          }
        }
      } else {
        // Not logged in — default to Guest
        const guestUid = `mock_${Date.now()}`;
        setAuthUser({ uid: guestUid, displayName: "Aranyam Guest", isAnonymous: true });
        setStatus("Firebase ready");
        setAuthLoading(false); // Hide loading spinner instantly for guests!
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const usersQuery = query(collection(db, "users"), limit(20));
    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const firebaseProfiles = snapshot.docs
          .map((item) => ({ uid: item.id, ...item.data() }) as UserProfile)
          .filter((item) => item.uid !== authUser?.uid && item.name);
        if (firebaseProfiles.length) setProfiles(firebaseProfiles);
      },
      () => setProfiles(seedProfiles)
    );

    return unsubscribe;
  }, [authUser?.uid]);

  async function signUpWithEmail(form: { name: string; email: string; password: string; city: string }) {
    const name = form.name.trim() || "Aranyam Member";
    setProfile((current) => ({ ...current, name, city: form.city.trim() || current.city }));

    if (!isFirebaseConfigured || !auth || !form.email || !form.password) {
      setAuthUser({ uid: profile.uid, displayName: name, isAnonymous: true });
      setOnboardingStep(1);
      setStatus("Sandbox profile active");
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(credential.user, { displayName: name });
      setAuthUser(credential.user);
      setOnboardingStep(1);
    } catch (error) {
      console.error(error);
    }
  }

  async function continueAsGuest(form: { name: string; city: string }) {
    const name = form.name.trim() || "Aranyam Guest";
    setProfile((current) => ({ ...current, name, city: form.city.trim() || current.city }));

    if (!isFirebaseConfigured || !auth) {
      setAuthUser({ uid: profile.uid, displayName: name, isAnonymous: true });
      setOnboardingStep(1);
      return;
    }

    try {
      const credential = await signInAnonymously(auth);
      setAuthUser(credential.user);
      setOnboardingStep(1);
    } catch (error) {
      console.error(error);
    }
  }

  async function signInWithGoogle(form?: { name?: string; email?: string; city?: string }) {
    if (!isFirebaseConfigured || !auth) {
      setStatus("Simulating Google Sign-In (Sandbox)...");
      setAuthLoading(true);
      
      // Simulate Google OAuth popup delay
      setTimeout(() => {
        const uid = `sandbox_google_${Date.now()}`;
        const name = form?.name?.trim() || "Kathir";
        const email = form?.email?.trim() || "kathir.diaspora@aranyam.attnam.io";
        const city = form?.city?.trim() || "Sydney";
        
        setAuthUser({
          uid,
          displayName: name,
          isAnonymous: false,
        });
        
        setProfile({
          uid,
          name,
          age: 28,
          city,
          country: "Australia · Diaspora",
          bio: "I value Jaffna cooking, Carnatic music, and slow living. Let's build a secure sanctuary.",
          interests: [],
          verifiedStatus: true,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        });
        
        setOnboardingStep(1);
        setStatus("Signed in as " + name + " (Sandbox)");
        setAuthLoading(false);
      }, 800);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        setStatus("Redirecting to Google Sign-In...");
        await signInWithRedirect(auth, provider);
      } else {
        setStatus("Connecting to Google...");
        await signInWithPopup(auth, provider);
      }
      // onAuthStateChanged will handle routing and profile loading
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setStatus("Google Sign-In failed");
    }
  }

  function startDesktopSandbox(form: { name: string; city: string }) {
    const name = form.name.trim() || "Aranyam Guest";
    const uid = authUser?.uid || profile.uid;
    setAuthUser((current) => current || { uid, displayName: name, isAnonymous: true });
    setProfile((current) => ({
      ...current,
      uid,
      name,
      city: form.city.trim() || current.city,
      interests: current.interests.length
        ? current.interests
        : ["Tamil literature", "Travel", "Ilaiyaraaja", "Diaspora identity"],
    }));
    setRoute("discover");
  }

  async function completeOnboarding(form: { name: string; city: string }) {
    const uid = authUser?.uid || profile.uid;
    const userRecord = {
      ...profile,
      uid,
      name: profile.name || form.name || "Aranyam Member",
      city: form.city || profile.city,
      updatedAt: isFirebaseConfigured ? serverTimestamp() : new Date(),
    };
    setProfile(userRecord);

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "users", uid), userRecord, { merge: true });
    }

    // Sync to Postgres via message bus (fail-safe)
    backendSync.syncProfile(userRecord);

    setRoute("discover");
  }

  async function signOut() {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error("Sign Out Error:", error);
      }
    }

    // Reset back to Guest state
    const guestUid = `mock_${Date.now()}`;
    setAuthUser({ uid: guestUid, displayName: "Aranyam Guest", isAnonymous: true });
    setProfile({
      uid: guestUid,
      name: "Aranyam Guest",
      age: 28,
      city: "Sydney",
      country: "Australia · Diaspora",
      bio: "I value warmth, clarity, and a relationship that leaves both people more themselves.",
      interests: ["Tamil literature", "Travel", "Ilaiyaraaja", "Diaspora identity"],
      verifiedStatus: true,
    });
    setRoute("discover");
    setStatus("Sandbox guest active");
  }

  return (
    <AuthContext.Provider
      value={{
        route,
        setRoute,
        onboardingStep,
        setOnboardingStep,
        authUser,
        profile,
        setProfile,
        profiles,
        status,
        signUpWithEmail,
        continueAsGuest,
        signInWithGoogle,
        startDesktopSandbox,
        completeOnboarding,
        authLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
