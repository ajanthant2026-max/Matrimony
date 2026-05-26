import React, { ReactNode } from "react";
import { BottomNav, DesktopSidebar, DesktopRightPanel } from "./Navigation";
import { KolamWatermark } from "./Kolam";

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

export function Shell({ children, showNav = false }: { children: ReactNode; showNav?: boolean }) {
  return (
    <main className="min-h-screen bg-aranyam-bg text-aranyam-espresso antialiased lg:hidden relative overflow-hidden">
      {/* Soft Kolam Watermark Backdrop */}
      <div className="absolute inset-x-0 -top-8 flex justify-center pointer-events-none opacity-[0.035] text-aranyam-gold">
        <KolamWatermark className="w-80 h-80" />
      </div>
      
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden border-x border-aranyam-border bg-aranyam-bg shadow-lightSanctuary relative z-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-48 max-w-[430px] bg-[radial-gradient(circle_at_50%_0%,rgba(194,150,36,0.06),transparent_68%)]" />
        <div className="relative flex min-h-screen flex-col">
          {children}
          {showNav && <BottomNav />}
        </div>
      </div>
    </main>
  );
}

export function DesktopShell({ children, rightPanel = true }: { children: ReactNode; rightPanel?: boolean }) {
  return (
    <main className="hidden min-h-screen bg-aranyam-bg text-aranyam-espresso antialiased lg:block">
      <div className="grid min-h-screen grid-cols-[232px_minmax(0,1fr)_320px] xl:grid-cols-[254px_minmax(0,1fr)_340px] gap-0">
        <DesktopSidebar />
        <section className={classNames("min-h-screen overflow-y-auto bg-aranyam-surfaceAlt border-r border-aranyam-border", !rightPanel && "col-span-2")}>
          {children}
        </section>
        {rightPanel && <DesktopRightPanel />}
      </div>
    </main>
  );
}
