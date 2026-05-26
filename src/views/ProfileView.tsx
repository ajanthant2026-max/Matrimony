import React from "react";
import { Shell, DesktopShell } from "../components/Shell";
import { BrandHeader, DesktopTopbar } from "../components/Navigation";
import { useAuth } from "../context/AuthContext";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { Icon } from "../components/Icon";
import { GuidesDashboard } from "../components/GuidesDashboard";

function DevConsole() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState("");
  const [clientId, setClientId] = React.useState(() => localStorage.getItem("aranyam_google_client_id") || "");

  function handleSave() {
    try {
      if (clientId) localStorage.setItem("aranyam_google_client_id", clientId);
      else localStorage.removeItem("aranyam_google_client_id");

      if (config.trim()) {
        const parsed = JSON.parse(config);
        if (parsed.apiKey) {
          localStorage.setItem("aranyam_firebase_config", JSON.stringify(parsed));
        }
      }
      alert("Credentials saved! Reloading application...");
      window.location.reload();
    } catch (e) {
      alert("Invalid JSON format for Firebase config.");
    }
  }

  function handleDisconnect() {
    localStorage.removeItem("aranyam_firebase_config");
    localStorage.removeItem("aranyam_google_client_id");
    alert("Credentials disconnected! Reloading application...");
    window.location.reload();
  }

  return (
    <div className="mt-6 rounded-2xl border border-aranyam-border bg-aranyam-surfaceAlt/60 p-5 shadow-sm text-left">
      <button className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-aranyam-gold" onClick={() => setOpen(!open)}>
        <span>🛠️ Developer Setup Console</span>
        <span>{open ? "▼" : "►"}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-3">
          <textarea
            className="h-28 w-full rounded-xl border border-aranyam-border bg-white p-3 text-xs font-mono text-aranyam-espresso outline-none focus:border-aranyam-gold/50 shadow-inner"
            placeholder={`{\n  "apiKey": "...",\n  "projectId": "..."\n}`}
            value={config}
            onChange={(e) => setConfig(e.target.value)}
          />
          <input
            className="h-10 w-full rounded-xl border border-aranyam-border bg-white px-3 text-xs font-mono text-aranyam-espresso outline-none focus:border-aranyam-gold/50 shadow-inner"
            placeholder="Google OAuth Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="rounded-xl bg-aranyam-gold px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-aranyam-gold/15 active:scale-95 transition" onClick={handleSave}>
              Save Live Credentials
            </button>
            <button className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 shadow-sm active:scale-95 transition" onClick={handleDisconnect}>
              Disconnect Live Firebase
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2 inline align-middle">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.63-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function DesktopProfile({ onOpenGuides }: { onOpenGuides: () => void }) {
  const { profile, authUser, signInWithGoogle, signOut } = useAuth();
  const isGuest = !authUser || authUser.isAnonymous;
  const profileForDetail = profile;
  const shared = profileForDetail.interests.filter((interest) => profile.interests.includes(interest));
  
  return (
    <DesktopShell>
      <div
        className="h-80 bg-cover bg-center border-b border-aranyam-border relative"
        style={{ backgroundImage: `linear-gradient(to top, rgba(252,251,247,1) 0%, rgba(252,251,247,.3) 100%), url(${profileForDetail.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80'})` }}
      >
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 text-left">
          <div>
            <div className="mb-3.5 flex gap-2">
              <VerifiedBadge verified={profileForDetail.verifiedStatus} />
              <span className="rounded-full bg-white/80 border border-aranyam-border px-3 py-1 text-xs font-bold text-aranyam-charcoal backdrop-blur-sm shadow-sm">{profileForDetail.country}</span>
            </div>
            <h2 className="text-4xl font-bold text-aranyam-espresso leading-none">{profileForDetail.name || "Aranyam Member"}, {profileForDetail.age}</h2>
            <p className="mt-2 text-xs font-bold text-aranyam-gold">{profileForDetail.city}</p>
          </div>
          <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-aranyam-gold/30 bg-aranyam-goldLight shadow-sm">
            <span className="text-xl font-bold text-aranyam-crimson">84%</span>
            <span className="text-[9px] font-bold text-aranyam-gold uppercase tracking-wider">match</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 p-8 text-left">
        {isGuest ? (
          <section className="col-span-2 rounded-2xl border-2 border-dashed border-aranyam-gold/30 bg-aranyam-goldLight/40 p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-aranyam-crimsonLight text-aranyam-crimson border border-aranyam-crimson/10 shadow-sm">
              <Icon name="shield" className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-aranyam-crimson uppercase tracking-wider">Upgrade to Secured Sanctuary Profile</h3>
            <p className="mt-2 text-xs leading-relaxed text-aranyam-charcoal/80 max-w-xl mx-auto font-medium">
              Connect your Google account to save your interest signals, liked connections, and mutual sanctuary chats securely across all devices.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => signInWithGoogle()}
                className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-white border border-aranyam-border text-xs font-bold text-aranyam-espresso shadow-sm transition active:scale-[0.98] hover:shadow-lightSanctuary"
              >
                <GoogleIcon /> Sign in with Google
              </button>
              <button
                onClick={() => signOut()}
                className="inline-flex h-11 px-6 items-center justify-center rounded-xl border border-aranyam-border bg-aranyam-surfaceAlt text-xs font-bold text-aranyam-charcoal transition active:scale-[0.98] hover:bg-white"
              >
                Exit Guest Sandbox
              </button>
            </div>
          </section>
        ) : (
          <section className="col-span-2 rounded-2xl border border-green-200 bg-green-50 p-5 flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-green-700 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live Connected Profile
              </h3>
              <p className="text-[11px] font-medium text-green-600/80 mt-1">Your profile is safely stored and synchronized live with Google SSO & Firestore.</p>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition active:scale-[0.98] hover:bg-white shadow-sm"
            >
              Sign Out (Disconnect)
            </button>
          </section>
        )}

        <section className="rounded-2xl border border-aranyam-border bg-white p-5 shadow-sm text-left">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-aranyam-gold">Shared interests</p>
          <div className="flex flex-wrap gap-2">
            {(shared.length ? shared : profileForDetail.interests).map((item) => (
              <span key={item} className="rounded-full border border-aranyam-crimson/30 bg-aranyam-crimsonLight px-3 py-1.5 text-xs font-bold text-aranyam-crimson shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-aranyam-border bg-white p-5 shadow-sm text-left">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-aranyam-gold">Cultural Signals</p>
          <div className="grid grid-cols-2 gap-2">
            {(profileForDetail.values || []).map((item) => (
              <div key={item} className="rounded-xl bg-aranyam-surfaceAlt border border-aranyam-border p-3 text-xs font-bold text-aranyam-charcoal text-center shadow-sm">{item}</div>
            ))}
          </div>
        </section>
        <section className="col-span-2 rounded-2xl border border-aranyam-border bg-white p-5 shadow-sm text-left">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-aranyam-gold">About</p>
          <p className="max-w-3xl text-xs font-medium leading-relaxed text-aranyam-charcoal text-left">{profileForDetail.bio}</p>
        </section>
        <section className="col-span-2 text-left">
          <DevConsole />
        </section>
        <section className="col-span-2 text-left">
          <button
            onClick={onOpenGuides}
            className="flex h-11 w-[260px] items-center justify-center gap-2.5 rounded-xl border border-aranyam-border bg-white text-xs font-bold text-aranyam-espresso shadow-sm transition active:scale-[0.98] hover:shadow-lightSanctuary"
          >
            <Icon name="book" className="h-4 w-4 text-aranyam-gold" />
            <span>Open Dev & Ops Sanctuary</span>
          </button>
        </section>
      </div>
    </DesktopShell>
  );
}

export function ProfileView() {
  const { profile, authUser, signInWithGoogle, signOut } = useAuth();
  const isGuest = !authUser || authUser.isAnonymous;
  const [showGuides, setShowGuides] = React.useState(false);
  
  return (
    <>
      <Shell showNav>
        <BrandHeader compact />
        <section className="space-y-4 px-5 pb-28 text-left">
          <div className="rounded-2xl border border-aranyam-border bg-white p-5 shadow-lightSanctuary text-left">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-aranyam-espresso leading-none">{profile.name || "Aranyam Member"}</h2>
                <p className="text-[11px] font-bold text-aranyam-crimson mt-2 uppercase tracking-wider">{profile.city} · {profile.country}</p>
              </div>
              <VerifiedBadge verified={profile.verifiedStatus} />
            </div>
            <p className="text-xs font-medium leading-relaxed text-aranyam-charcoal/90 text-left">{profile.bio}</p>
          </div>

          {isGuest ? (
            <div className="rounded-2xl border-2 border-dashed border-aranyam-gold/30 bg-aranyam-goldLight/40 p-5 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-aranyam-crimsonLight border border-aranyam-crimson/10 text-aranyam-crimson shadow-sm">
                <Icon name="shield" className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-aranyam-crimson uppercase tracking-wider">Upgrade to Secured Sanctuary</h3>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-aranyam-charcoal/80">
                Connect your Google account to save your interest signals, liked profiles, and mutual sanctuary chats securely across all devices.
              </p>
              <button
                onClick={() => signInWithGoogle()}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white border border-aranyam-border text-xs font-bold text-aranyam-espresso shadow-sm transition active:scale-[0.98] hover:shadow-lightSanctuary"
              >
                <GoogleIcon /> Sign in with Google
              </button>
              <button
                onClick={() => signOut()}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-aranyam-border bg-aranyam-surfaceAlt text-xs font-bold text-aranyam-charcoal transition active:scale-[0.98] hover:bg-white"
              >
                Exit Guest Sandbox
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p>Live Connected Account</p>
              </div>
              <p className="text-[11px] font-semibold text-green-600/80 leading-relaxed">Your profile is safely stored and synchronized live with Google SSO & Firestore.</p>
              <button
                onClick={() => signOut()}
                className="h-10 w-full rounded-xl border border-red-200 bg-red-50 text-xs font-bold text-red-600 transition active:scale-[0.98] hover:bg-white shadow-sm"
              >
                Sign Out (Disconnect Account)
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-aranyam-gold/20 bg-aranyam-goldLight p-4 text-left shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-aranyam-gold">
              <Icon name="lock" className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wider">Fortress privacy controls</p>
            </div>
            <p className="text-xs font-medium leading-relaxed text-aranyam-charcoal/95">
              Profile visibility, photo access, and chat permissions are designed as explicit consent
              moments before deeper sharing.
            </p>
          </div>
          
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-aranyam-gold">Your Interest Signals</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((item) => (
                <span key={item} className="rounded-full border border-aranyam-border bg-white px-3.5 py-1.5 text-xs font-bold text-aranyam-charcoal shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setShowGuides(true)}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-aranyam-border bg-white text-xs font-bold text-aranyam-espresso shadow-sm transition active:scale-[0.98] hover:shadow-lightSanctuary"
          >
            <Icon name="book" className="h-4.5 w-4.5 text-aranyam-gold" />
            <span>Open Dev & Ops Sanctuary</span>
          </button>
          
          <DevConsole />
        </section>
      </Shell>
      <DesktopProfile onOpenGuides={() => setShowGuides(true)} />
      {showGuides && <GuidesDashboard onClose={() => setShowGuides(false)} />}
    </>
  );
}
