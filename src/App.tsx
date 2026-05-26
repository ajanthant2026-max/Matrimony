import React, { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { WelcomeView } from "./views/WelcomeView";
import { DiscoveryView } from "./views/DiscoveryView";
import { LikedView } from "./views/LikedView";
import { ChatsView } from "./views/ChatsView";
import { ProfileView } from "./views/ProfileView";

function LoadingSplash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0E0E10] text-[#FDFBF7]">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#D4AF37]/20 border-t-[#D4AF37]" />
      <p className="text-sm text-[#FDFBF7]/50">Restoring your session…</p>
    </div>
  );
}

function AppContent() {
  const { route, onboardingStep, authLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route, onboardingStep]);

  if (authLoading) return <LoadingSplash />;
  if (route === "welcome") return <WelcomeView />;
  if (route === "liked") return <LikedView />;
  if (route === "chats") return <ChatsView />;
  if (route === "profile") return <ProfileView />;
  return <DiscoveryView />;
}

export default function App() {
  return <AppContent />;
}
