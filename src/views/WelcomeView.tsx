import React, { useState } from "react";
import { Shell } from "../components/Shell";
import { BrandHeader } from "../components/Navigation";
import { useAuth } from "../context/AuthContext";
import { interests, PRODUCT_TAMIL, seedProfiles, TAMIL_GLOSSARY } from "../data/mockData";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { Icon } from "../components/Icon";
import { KolamCorner, KolamWatermark, KolamDivider } from "../components/Kolam";

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline mr-2 align-middle">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.63-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function FirebaseDevConsole() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState("");
  const [clientId, setClientId] = React.useState(() => {
    try { return localStorage.getItem("aranyam_google_client_id") || ""; } catch { return ""; }
  });
  const [error, setError] = React.useState("");
  const isLive = Boolean((() => { try { return localStorage.getItem("aranyam_firebase_config"); } catch { return null; } })());

  function handleSave() {
    try {
      setError("");
      if (clientId.trim()) localStorage.setItem("aranyam_google_client_id", clientId.trim());
      else localStorage.removeItem("aranyam_google_client_id");

      if (config.trim()) {
        let parsed: any;
        const cleaned = config.trim();
        if (cleaned.includes("apiKey:") && !cleaned.startsWith("{")) {
          const match = cleaned.match(/\{[\s\S]*\}/);
          if (match) {
            const jsonStr = match[0].replace(/([a-zA-Z0-9]+)\s*:/g, '"$1":').replace(/'/g, '"').replace(/,\s*([}\]])/g, '$1');
            parsed = JSON.parse(jsonStr);
          }
        } else {
          parsed = JSON.parse(cleaned);
        }
        if (!parsed?.apiKey || !parsed?.projectId) { setError("Config must include apiKey and projectId."); return; }
        localStorage.setItem("aranyam_firebase_config", JSON.stringify(parsed));
      }
      window.location.reload();
    } catch {
      setError("Invalid format. Paste the JSON object from Firebase console.");
    }
  }

  function handleDisconnect() {
    localStorage.removeItem("aranyam_firebase_config");
    localStorage.removeItem("aranyam_google_client_id");
    window.location.reload();
  }

  return (
    <div className="mt-4 rounded-xl border border-dashed border-aranyam-border bg-aranyam-surfaceAlt/60 shadow-sm">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-aranyam-charcoal/70"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-1.5">🛠️ Developer · Connect Live Firebase</span>
        <span className="flex items-center gap-2">
          {isLive && <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[9px] font-bold text-green-600 shadow-sm border border-green-200">LIVE</span>}
          {open ? "▼" : "►"}
        </span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-aranyam-border p-4">
          <p className="text-[11px] font-medium text-aranyam-charcoal/70">Paste your Firebase Config JSON to switch from Sandbox to Live Firebase + Google SSO.</p>
          <textarea
            className="h-28 w-full rounded-xl border border-aranyam-border bg-white p-3 text-xs font-mono text-aranyam-espresso outline-none focus:border-aranyam-gold/50 shadow-inner"
            placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "...",\n  "projectId": "..."\n}`}
            value={config}
            onChange={(e) => setConfig(e.target.value)}
          />
          <input
            className="h-10 w-full rounded-xl border border-aranyam-border bg-white px-3 text-xs font-mono text-aranyam-espresso outline-none focus:border-aranyam-gold/50 shadow-inner"
            placeholder="Google OAuth Client ID (optional)"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              className="flex-1 rounded-xl bg-aranyam-gold py-2.5 text-xs font-bold text-white shadow-md shadow-aranyam-gold/15 active:scale-95 transition"
              onClick={handleSave}
            >
              Activate Live Config
            </button>
            {isLive && (
              <button
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 shadow-sm active:scale-95 transition"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TamilGlossaryBanner() {
  return (
    <section className="my-6 rounded-2xl border border-aranyam-border bg-white p-5 shadow-lightSanctuary relative overflow-hidden text-left">
      <div className="absolute right-0 top-0 opacity-[0.035] text-aranyam-gold pointer-events-none">
        <KolamCorner className="w-20 h-20 transform rotate-90" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-aranyam-gold mb-3">சங்கத் தமிழ் · Meaningful Vocabulary</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TAMIL_GLOSSARY.map((item) => (
          <div key={item.word} className="rounded-xl border border-aranyam-border bg-aranyam-bg/40 p-3 hover:bg-aranyam-goldLight/30 transition duration-200">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-aranyam-crimson">{item.word}</span>
              <span className="text-xs font-bold text-aranyam-gold">({item.transliteration})</span>
              <span className="text-xs font-bold text-aranyam-espresso ml-auto">{item.meaning}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-aranyam-charcoal/80">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DesktopWelcome() {
  const { startDesktopSandbox, signInWithGoogle } = useAuth();
  return (
    <main className="hidden min-h-screen bg-aranyam-bg text-aranyam-espresso lg:block relative overflow-hidden">
      {/* Decorative corner Kolams */}
      <div className="absolute top-4 left-4 opacity-[0.08] text-aranyam-gold pointer-events-none">
        <KolamCorner className="w-28 h-28" />
      </div>
      <div className="absolute bottom-4 right-4 opacity-[0.08] text-aranyam-gold pointer-events-none">
        <KolamCorner className="w-28 h-28 transform rotate-180" />
      </div>

      <nav className="flex h-20 items-center justify-between border-b border-aranyam-border bg-white px-10 relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-aranyam-gold">ATTNAM Labs</p>
          <h1 className="text-xl font-bold text-aranyam-espresso">
            Aranyam <span className="text-aranyam-crimson">{PRODUCT_TAMIL}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-aranyam-charcoal/70">
          <span>துணை · Discover</span>
          <span className="mx-3 h-1.5 w-1.5 rounded-full bg-aranyam-gold" />
          <span>அறம் · Safety</span>
          <span className="mx-3 h-1.5 w-1.5 rounded-full bg-aranyam-gold" />
          <span>அகம் · Sanctuary</span>
        </div>
      </nav>

      <section className="grid min-h-[calc(100vh-5rem)] grid-cols-[minmax(0,1fr)_430px] gap-12 px-10 py-10 xl:px-16 relative z-10">
        <div className="flex flex-col justify-center text-left">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-aranyam-gold flex items-center gap-2">
            <span className="inline-block h-1.5 w-8 bg-aranyam-gold rounded-full" />
            பொருத்தம் · Interest-first matrimony
          </p>
          <h2 className="max-w-3xl text-5xl font-bold leading-[1.1] text-aranyam-espresso">
            Find alignment before the checklist enters the room.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-aranyam-charcoal">
            Aranyam connects Sri Lankan Tamil local and diaspora communities through shared interests,
            life values, verified safety, and culturally fluent privacy. Guided by traditional respect.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              className="rounded-xl bg-aranyam-crimson px-8 py-4 text-sm font-bold text-white shadow-md shadow-aranyam-crimson/15 hover:bg-aranyam-crimson/95 transition active:scale-95" 
              onClick={() => startDesktopSandbox({ name: "", city: "" })}
            >
              Begin in Sandbox Mode
            </button>
            <button 
              className="rounded-xl bg-white border border-aranyam-border text-aranyam-espresso px-8 py-4 text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-lightSanctuary hover:bg-aranyam-surface transition active:scale-95" 
              onClick={() => signInWithGoogle()}
            >
              <GoogleIcon /> Sign in with Google
            </button>
          </div>

          <div className="mt-4 max-w-2xl">
            <FirebaseDevConsole />
          </div>

          {/* Expanded Tamil words banner */}
          <TamilGlossaryBanner />

          <div className="grid max-w-3xl grid-cols-3 gap-4 mt-2">
            {[
              { title: "Shared interests first", desc: "துணை - Align on literature, arts, music and cooking before family checklists.", icon: "discover" as const },
              { title: "Verified sanctuary", desc: "அரண்யம் - Absolute privacy, protected photo visibility, and identity checks.", icon: "shield" as const },
              { title: "Tamil cultural fluency", desc: "அகம் - Respectful layout custom-tailored for local and diaspora experiences.", icon: "lock" as const }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-aranyam-border bg-white p-4 shadow-sm hover:shadow-lightSanctuary transition duration-200">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-aranyam-crimsonLight text-aranyam-crimson shadow-sm border border-aranyam-crimson/10">
                  <Icon name={item.icon} className="h-4.5 w-4.5" />
                </div>
                <p className="text-sm font-bold text-aranyam-espresso">{item.title}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-aranyam-charcoal/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative h-[530px] w-full flex justify-center items-center">
            {/* Elegant Kolam background watermark behind cards */}
            <div className="absolute opacity-[0.06] text-aranyam-gold z-0 animate-spin-slow">
              <KolamWatermark className="w-96 h-96" />
            </div>

            {seedProfiles.map((item, index) => (
              <div
                key={item.uid}
                className="absolute overflow-hidden rounded-2xl border border-aranyam-border bg-white shadow-lightSanctuary hover:shadow-md transition duration-300 z-10 text-left"
                style={{
                  width: 310,
                  right: index * 24 + 10,
                  top: index * 34 + 20,
                  transform: `rotate(${index === 0 ? -3 : index === 1 ? 2 : 5}deg)`,
                  opacity: index === 2 ? 0.75 : 1,
                }}
              >
                <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-aranyam-espresso">{item.name}, {item.age}</p>
                    <VerifiedBadge verified={item.verifiedStatus} />
                  </div>
                  <div className="rounded-xl border border-aranyam-gold/20 bg-aranyam-goldLight p-3.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-aranyam-gold">Shared signals</p>
                    <p className="mt-1 text-xs font-bold text-aranyam-charcoal">{item.interests.slice(0, 3).join(", ")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function InterestSelector() {
  const { profile, setProfile, completeOnboarding } = useAuth();
  
  function toggleInterest(label: string) {
    setProfile((current) => ({
      ...current,
      interests: current.interests.includes(label)
        ? current.interests.filter((item) => item !== label)
        : [...current.interests, label],
    }));
  }

  return (
    <div className="flex flex-1 flex-col text-left">
      <div className="mb-5 mt-4">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-aranyam-border">
          <div
            className="h-full rounded-full bg-aranyam-crimson transition-all duration-300"
            style={{ width: `${Math.min(100, (profile.interests.length / 6) * 100)}%` }}
          />
        </div>
        <h2 className="text-2xl font-bold text-aranyam-espresso flex items-center gap-2">
          Choose your cultural signals.
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-aranyam-charcoal/80">
          These shape your discovery feed around Tamil heritage, values, literature, and lifestyle alignments.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-24">
        {interests.map((interest) => {
          const selected = profile.interests.includes(interest.label);
          return (
            <button
              key={interest.label}
              className={classNames(
                "min-h-28 rounded-xl border p-3.5 text-left transition active:scale-[0.98] duration-200",
                selected
                  ? "border-aranyam-crimson bg-aranyam-crimsonLight shadow-sm"
                  : "border-aranyam-border bg-white hover:border-aranyam-gold/50"
              )}
              onClick={() => toggleInterest(interest.label)}
            >
              <div className={classNames("mb-3 h-8 w-8 rounded-lg bg-gradient-to-br shadow-sm", interest.tone)} />
              <p className="text-[13px] font-bold text-aranyam-espresso">{interest.label}</p>
              <p className="mt-1 text-[11px] font-semibold text-aranyam-gold">{interest.tamil}</p>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-0 -mx-5 mt-auto border-t border-aranyam-border bg-white/96 px-5 py-4 backdrop-blur-md z-20">
        <button
          className="h-12 w-full rounded-xl bg-aranyam-crimson text-sm font-bold text-white shadow-md shadow-aranyam-crimson/25 disabled:cursor-not-allowed disabled:opacity-40 transition active:scale-[0.98]"
          disabled={profile.interests.length < 3}
          onClick={() => completeOnboarding({ name: "", city: "" })}
        >
          Enter the Sanctuary (துணை)
        </button>
        <p className="mt-2.5 text-center text-xs font-semibold text-aranyam-charcoal/50">
          Select at least 3 signals · {profile.interests.length} selected
        </p>
      </div>
    </div>
  );
}

export function WelcomeView() {
  const { onboardingStep, signUpWithEmail, continueAsGuest, signInWithGoogle, status } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "Sydney" });

  return (
    <>
      <Shell>
        <BrandHeader />
        <section className="flex flex-1 flex-col px-5 pb-6 text-left">
          {onboardingStep === 0 ? (
            <div className="flex flex-1 flex-col">
              <div className="mt-4 overflow-hidden rounded-2xl border border-aranyam-border bg-white shadow-lightSanctuary relative">
                {/* Embedded corner Kolam watermark */}
                <div className="absolute right-0 top-0 opacity-[0.04] text-aranyam-gold pointer-events-none">
                  <KolamCorner className="w-20 h-20" />
                </div>
                
                <div className="h-44 bg-[linear-gradient(135deg,rgba(158,28,28,0.06),rgba(252,251,247,0.92)),url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center border-b border-aranyam-border" />
                <div className="space-y-2.5 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-aranyam-crimson">Sacred Sanctuary · அரண்யம்</p>
                  <h2 className="text-xl font-bold leading-snug text-aranyam-espresso">
                    Meet through shared values, not a cold database.
                  </h2>
                  <p className="text-xs leading-relaxed text-aranyam-charcoal">
                    A privacy-first interest matrimony experience custom tailored for Sri Lankan Tamil local and diaspora communities.
                  </p>
                </div>
              </div>

              {/* Onboarding mini Tamil terms showcase */}
              <div className="mt-4 rounded-xl bg-aranyam-goldLight border border-aranyam-gold/20 px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-aranyam-charcoal">
                <span>துணை (Companion)</span>
                <span className="text-aranyam-gold">•</span>
                <span>பொருத்தம் (Value Match)</span>
                <span className="text-aranyam-gold">•</span>
                <span>அகம் (Inner Life)</span>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  className="h-11 w-full rounded-xl border border-aranyam-border bg-white px-4 text-xs font-bold text-aranyam-espresso outline-none transition focus:border-aranyam-crimson/50 shadow-inner"
                  placeholder="Display name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
                <input
                  className="h-11 w-full rounded-xl border border-aranyam-border bg-white px-4 text-xs font-bold text-aranyam-espresso outline-none transition focus:border-aranyam-crimson/50 shadow-inner"
                  placeholder="Email for Firebase signup"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
                <input
                  className="h-11 w-full rounded-xl border border-aranyam-border bg-white px-4 text-xs font-bold text-aranyam-espresso outline-none transition focus:border-aranyam-crimson/50 shadow-inner"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
                <input
                  className="h-11 w-full rounded-xl border border-aranyam-border bg-white px-4 text-xs font-bold text-aranyam-espresso outline-none transition focus:border-aranyam-crimson/50 shadow-inner"
                  placeholder="City (e.g. Sydney, Toronto, Jaffna)"
                  value={form.city}
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                />
              </div>

              <div className="mt-6 space-y-3 pt-4">
                <button
                  className="h-11 w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-aranyam-border text-xs font-bold text-aranyam-espresso shadow-sm transition active:scale-[0.98] hover:shadow-lightSanctuary"
                  onClick={() => signInWithGoogle(form)}
                >
                  <GoogleIcon /> Sign in with Google
                </button>
                <button
                  className="h-11 w-full rounded-xl bg-aranyam-crimson text-xs font-bold text-white shadow-md shadow-aranyam-crimson/15 transition active:scale-[0.98]"
                  onClick={() => signUpWithEmail(form)}
                >
                  Create Protected Profile
                </button>
                <button
                  className="h-11 w-full rounded-xl border border-aranyam-border bg-aranyam-surfaceAlt text-xs font-bold text-aranyam-charcoal transition active:scale-[0.98]"
                  onClick={() => continueAsGuest(form)}
                >
                  Preview in Sandbox Mode
                </button>
                <p className="text-center text-[10px] font-bold text-aranyam-gold tracking-wider uppercase">{status}</p>
              </div>
              <FirebaseDevConsole />
            </div>
          ) : (
            <InterestSelector />
          )}
        </section>
      </Shell>
      <DesktopWelcome />
    </>
  );
}
