import React, { useMemo, useState } from "react";
import { Shell, DesktopShell } from "../components/Shell";
import { BrandHeader, DesktopTopbar } from "../components/Navigation";
import { useAuth } from "../context/AuthContext";
import { useMatches } from "../context/MatchesContext";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { Icon } from "../components/Icon";

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function DesktopDiscovery() {
  const { profile, profiles, setRoute } = useAuth();
  const { likeProfile } = useMatches();
  const [, setFocusedProfile] = useState<any>(null);

  function skipProfile() {
    // Sandbox skip action (can log or no-op)
  }

  return (
    <DesktopShell>
      <DesktopTopbar title="துணை · Discover Companions" subtitle="Showing profiles with shared interests and cultural signals first" />
      <div className="px-8 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            "Shared signals",
            "Near me",
            "Diaspora born",
            "Sri Lanka local",
            "Jaffna Roots",
            "Values match",
          ].map((chip, index) => (
            <button
              key={chip}
              className={classNames(
                "rounded-full border px-4.5 py-2 text-xs font-bold transition shadow-sm active:scale-95",
                index === 0
                  ? "border-aranyam-crimson bg-aranyam-crimsonLight text-aranyam-crimson"
                  : "border-aranyam-border bg-white text-aranyam-charcoal hover:bg-aranyam-surfaceAlt"
              )}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 2xl:grid-cols-3">
          {profiles.map((item) => {
            const shared = item.interests.filter((interest) => profile.interests.includes(interest));
            return (
              <article key={item.uid} className="overflow-hidden rounded-2xl border border-aranyam-border bg-white shadow-lightSanctuary hover:shadow-md transition-all duration-300 flex flex-col">
                <button
                  className="block h-60 w-full bg-cover bg-center text-left relative overflow-hidden group"
                  style={{ backgroundImage: `linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255,255,255,0.1) 60%), url(${item.image})` }}
                  onClick={() => {
                    setFocusedProfile(item);
                    setRoute("profile");
                  }}
                >
                  <div className="flex h-full flex-col justify-end p-5">
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <VerifiedBadge verified={item.verifiedStatus} />
                      <span className="rounded-full bg-white/80 border border-aranyam-border px-3 py-1 text-[11px] font-bold text-aranyam-charcoal backdrop-blur-sm shadow-sm">{item.city}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-aranyam-espresso leading-none">{item.name}, {item.age}</h3>
                    <p className="text-xs font-semibold text-aranyam-crimson mt-1">{item.country}</p>
                  </div>
                </button>
                <div className="space-y-4 p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Culturally rich labels */}
                    <div className="rounded-xl border border-aranyam-gold/20 bg-aranyam-goldLight p-3.5 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-aranyam-gold">பொருத்தம் · Shared Signals</p>
                      <p className="mt-1 text-xs font-bold text-aranyam-charcoal leading-snug">{(shared.length ? shared : item.interests.slice(0, 3)).join(" • ")}</p>
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-aranyam-charcoal/90">{item.bio}</p>
                    
                    {/* Cultural signals/values */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.values?.map((val) => (
                        <span key={val} className="rounded-full border border-aranyam-border bg-aranyam-surfaceAlt px-2.5 py-1 text-[10px] font-bold text-aranyam-charcoal">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_1.5fr] gap-3 pt-4 border-t border-aranyam-border mt-4">
                    <button className="rounded-xl border border-aranyam-border bg-aranyam-surfaceAlt py-3 text-xs font-bold text-aranyam-charcoal hover:bg-aranyam-surface transition duration-200 active:scale-95" onClick={skipProfile}>
                      Later
                    </button>
                    <button className="rounded-xl bg-aranyam-crimson py-3 text-xs font-bold text-white shadow-md shadow-aranyam-crimson/15 hover:bg-aranyam-crimson/95 transition duration-200 active:scale-95" onClick={() => likeProfile(item)}>
                      Connect with Intent (அன்பு)
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </DesktopShell>
  );
}

export function DiscoveryView() {
  const { profile, profiles } = useAuth();
  const { likeProfile } = useMatches();
  const [activeIndex, setActiveIndex] = useState(0);

  const currentCard = profiles[activeIndex % profiles.length];
  
  const sharedInterests = useMemo(() => {
    if (!currentCard) return [];
    return currentCard.interests.filter((item) => profile.interests.includes(item));
  }, [currentCard, profile.interests]);

  function skipProfile() {
    setActiveIndex((index) => index + 1);
  }

  function handleLike() {
    likeProfile(currentCard);
    setActiveIndex((index) => index + 1);
  }

  return (
    <>
      <Shell showNav>
        <BrandHeader compact />
        <section className="flex flex-1 flex-col px-5 pb-28 text-left">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-aranyam-border bg-white p-3.5 shadow-sm">
            <div>
              <p className="text-[10px] font-semibold text-aranyam-charcoal/50 uppercase tracking-wider">Discovery tuned by</p>
              <p className="text-xs font-bold text-aranyam-crimson">{profile.interests.slice(0, 2).join(" + ")}</p>
            </div>
            <VerifiedBadge verified={profile.verifiedStatus} />
          </div>

          {currentCard && (
            <article className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-aranyam-border bg-white shadow-lightSanctuary">
              <div
                className="h-[43vh] min-h-72 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${currentCard.image})` }}
              >
                {/* Elegant Light Theme Gradient Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent flex flex-col justify-end p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <VerifiedBadge verified={currentCard.verifiedStatus} />
                    <span className="rounded-full bg-white/80 border border-aranyam-border px-3 py-1 text-[11px] font-bold text-aranyam-charcoal backdrop-blur-sm shadow-sm">
                      {currentCard.country}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-aranyam-espresso leading-none">
                    {currentCard.name}, {currentCard.age}
                  </h2>
                  <p className="text-xs font-bold text-aranyam-gold mt-1">{currentCard.city}</p>
                </div>
              </div>

              <div className="space-y-4 p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="rounded-xl border border-aranyam-gold/25 bg-aranyam-goldLight p-3.5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-aranyam-gold">
                      பொருத்தம் · Matched on
                    </p>
                    <p className="mt-1 text-xs font-bold text-aranyam-charcoal">
                      {(sharedInterests.length ? sharedInterests : currentCard.interests.slice(0, 2)).join(" • ")}
                    </p>
                  </div>
                  <p className="line-clamp-3 text-xs font-medium leading-relaxed text-aranyam-charcoal/85">{currentCard.bio}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(currentCard.values || []).map((value) => (
                      <span key={value} className="rounded-full border border-aranyam-border bg-aranyam-surfaceAlt px-2.5 py-1 text-[10px] font-bold text-aranyam-charcoal shadow-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-[1fr_1.35fr] gap-3 border-t border-aranyam-border pt-4">
                  <button
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-aranyam-border bg-aranyam-surfaceAlt text-xs font-bold text-aranyam-charcoal transition active:scale-[0.98] hover:bg-white"
                    onClick={skipProfile}
                  >
                    <Icon name="x" className="h-4 w-4" /> Later
                  </button>
                  <button
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-aranyam-crimson text-xs font-bold text-white shadow-md shadow-aranyam-crimson/20 transition active:scale-[0.98]"
                    onClick={handleLike}
                  >
                    <Icon name="heart" className="h-4 w-4" /> Like with intent
                  </button>
                </div>
              </div>
            </article>
          )}
        </section>
      </Shell>
      <DesktopDiscovery />
    </>
  );
}
