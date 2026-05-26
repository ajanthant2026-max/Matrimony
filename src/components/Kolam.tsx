import React from "react";

/**
 * Beautiful, high-fidelity geometric Kolam components designed for
 * the "Thunai Light Kolam v3" theme. Built as responsive SVGs with thin,
 * elegant stroke work.
 */

// A classic, symmetric 4-loop flower-like dot Kolam (Sikku/Kambi Kolam)
export function KolamWatermark({ className = "w-72 h-72 text-aranyam-gold/8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Central Dot Grid */}
      {[20, 35, 50, 65, 80].map((x) =>
        [20, 35, 50, 65, 80].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.75" className="fill-currentColor opacity-60" />
        ))
      )}

      {/* Symmetric loops creating an elegant traditional Kolam pattern */}
      {/* Loop 1: Core flower */}
      <path d="M 50,20 C 40,20 35,35 35,50 C 35,65 40,80 50,80 C 60,80 65,65 65,50 C 65,35 60,20 50,20 Z" />
      <path d="M 20,50 C 20,40 35,35 50,35 C 65,35 80,40 80,50 C 80,60 65,65 50,65 C 35,65 20,60 20,50 Z" />

      {/* Loop 2: Corner loops wrapping the dots */}
      <path d="M 35,20 C 20,20 20,35 35,35 C 50,35 35,50 35,65 C 20,65 20,80 35,80 C 50,80 50,65 65,65 C 80,65 80,80 65,80 C 50,80 65,50 65,35 C 80,35 80,20 65,20 C 50,20 50,35 35,35" />
      <path d="M 50,50 M 35,35 C 35,20 65,20 65,35 C 65,50 80,50 80,65 C 65,65 65,80 50,80 M 50,20 C 50,35 35,35 35,50 C 20,50 20,65 35,65" />

      {/* Decorative outer accents */}
      <path d="M 50,12 L 50,15 M 50,85 L 50,88 M 12,50 L 15,50 M 85,50 L 88,50" />
      <circle cx="50" cy="8" r="1.5" className="fill-currentColor" />
      <circle cx="50" cy="92" r="1.5" className="fill-currentColor" />
      <circle cx="8" cy="50" r="1.5" className="fill-currentColor" />
      <circle cx="92" cy="50" r="1.5" className="fill-currentColor" />
    </svg>
  );
}

// Corner Kolam accents to frame sections elegantly
export function KolamCorner({ className = "w-24 h-24 text-aranyam-gold/20" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Corner Dot Grid */}
      {[10, 25, 40, 55].map((x) =>
        [10, 25, 40, 55].map((y) => {
          if (x + y <= 70) {
            return <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" className="fill-currentColor opacity-50" />;
          }
          return null;
        })
      )}

      {/* Symmetric curves anchoring the corner */}
      <path d="M 10,10 C 25,10 25,25 10,25 C 10,40 25,25 25,10" />
      <path d="M 10,25 C 25,25 25,40 10,40 M 25,10 C 25,25 40,25 40,10" />
      <path d="M 10,55 C 10,45 25,40 25,25 C 40,25 45,10 55,10" />
      
      {/* Outer corner dot */}
      <circle cx="10" cy="10" r="2" className="fill-none stroke-currentColor" strokeWidth="1" />
    </svg>
  );
}

// A beautiful divider featuring a central Kolam flower and symmetric flanking lines
export function KolamDivider({ className = "w-full text-aranyam-gold/30" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-6 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-current opacity-40" />
      <svg
        viewBox="0 0 100 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-24"
        aria-hidden="true"
      >
        {/* Grid dots */}
        <circle cx="38" cy="12" r="0.65" className="fill-currentColor" />
        <circle cx="44" cy="12" r="0.65" className="fill-currentColor" />
        <circle cx="50" cy="12" r="0.65" className="fill-currentColor" />
        <circle cx="56" cy="12" r="0.65" className="fill-currentColor" />
        <circle cx="62" cy="12" r="0.65" className="fill-currentColor" />
        <circle cx="50" cy="6" r="0.65" className="fill-currentColor" />
        <circle cx="50" cy="18" r="0.65" className="fill-currentColor" />

        {/* Central flower loop */}
        <path d="M 50,4 C 44,4 42,12 50,12 C 58,12 56,4 50,4 Z" />
        <path d="M 50,20 C 44,20 42,12 50,12 C 58,12 56,20 50,20 Z" />
        <path d="M 34,12 C 34,6 42,10 50,12 C 42,14 34,12 34,12 Z" />
        <path d="M 66,12 C 66,6 58,10 50,12 C 58,14 66,12 66,12 Z" />

        {/* Flanking wing paths */}
        <path d="M 25,12 C 15,6 10,12 2,12" />
        <path d="M 75,12 C 85,6 90,12 98,12" />
        <circle cx="15" cy="10" r="1" className="fill-currentColor" />
        <circle cx="85" cy="10" r="1" className="fill-currentColor" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-current opacity-40" />
    </div>
  );
}
