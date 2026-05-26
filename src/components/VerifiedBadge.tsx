import React from "react";
import { Icon } from "./Icon";

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

export function VerifiedBadge({ verified, className = "" }: { verified: boolean; className?: string }) {
  return (
    <div
      className={classNames(
        "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold shadow-sm transition-all",
        verified
          ? "border-aranyam-gold/30 bg-aranyam-goldLight text-aranyam-gold"
          : "border-aranyam-border bg-aranyam-surfaceAlt text-aranyam-charcoal/50",
        className
      )}
    >
      <Icon name={verified ? "shield" : "lock"} className="h-3.5 w-3.5" />
      {verified ? "Secured" : "Pending"}
    </div>
  );
}
