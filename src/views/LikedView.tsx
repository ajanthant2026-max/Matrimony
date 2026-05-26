import React from "react";
import { Shell, DesktopShell } from "../components/Shell";
import { BrandHeader, DesktopTopbar } from "../components/Navigation";
import { useAuth } from "../context/AuthContext";
import { useMatches } from "../context/MatchesContext";
import { Icon } from "../components/Icon";
import { UserProfile } from "../types";

export function ProfileRow({ item, action }: { item: UserProfile; action: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-aranyam-border bg-white p-3.5 shadow-sm hover:shadow-lightSanctuary hover:border-aranyam-crimson/20 transition duration-200 text-left">
      <img className="h-14 w-14 rounded-xl object-cover border border-aranyam-border" src={item.image || ""} alt={item.name} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-bold text-aranyam-espresso text-[15px]">{item.name}, {item.age}</p>
          {item.verifiedStatus && <Icon name="shield" className="h-4 w-4 text-aranyam-gold" />}
        </div>
        <p className="truncate text-xs font-medium text-aranyam-charcoal/60">{item.interests.slice(0, 3).join(" • ")}</p>
        <p className="mt-1.5 text-[10px] font-bold text-aranyam-crimson uppercase tracking-wider">{action}</p>
      </div>
    </div>
  );
}

function DesktopLiked() {
  const { profiles } = useAuth();
  const { liked } = useMatches();

  return (
    <DesktopShell>
      <DesktopTopbar title="அன்பு · Liked with Intent" subtitle="Connections waiting for mutual alignment and consent to chat" />
      <div className="grid grid-cols-2 gap-5 p-8 2xl:grid-cols-3">
        {(liked.length ? liked : profiles.slice(0, 3)).map((item) => (
          <ProfileRow key={item.uid} item={item} action="Awaiting mutual intent" />
        ))}
      </div>
    </DesktopShell>
  );
}

export function LikedView() {
  const { profiles } = useAuth();
  const { liked } = useMatches();

  return (
    <>
      <Shell showNav>
        <BrandHeader compact />
        <section className="space-y-3.5 px-5 pb-28 text-left">
          <h2 className="text-xl font-bold text-aranyam-espresso">Connections you liked</h2>
          {(liked.length ? liked : profiles.slice(0, 2)).map((item) => (
            <ProfileRow key={item.uid} item={item} action="Awaiting mutual intent" />
          ))}
        </section>
      </Shell>
      <DesktopLiked />
    </>
  );
}
