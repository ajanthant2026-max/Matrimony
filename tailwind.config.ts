import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aranyam: {
          // New Light Theme Tokens
          bg: "#FCFBF7",       // Ivory base background
          surface: "#FFFFFF",  // Pure white card surfaces
          surfaceAlt: "#FAF6EE", // Warm wheat background elements
          espresso: "#2D2520",  // Rich warm dark brown (primary text)
          crimson: "#9E1C1C",   // Auspicious deep crimson (primary accents/buttons)
          crimsonLight: "#FDF1F1",
          gold: "#C29624",      // High contrast metallic gold
          goldLight: "#FBF5E6", // Golden-tinged highlights
          charcoal: "#4B423D",  // Secondary text
          border: "#EBE6DD",    // Soft warm dividers
          
          // Legacy dark theme tokens (retaining for compatibility/fallback during refactoring)
          black: "#0E0E10",
          surfaceDark: "#111113",
          maroon: "#7D0A0A",
          goldLegacy: "#D4AF37",
          cream: "#FDFBF7",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "Noto Sans Tamil", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sanctuary: "0 24px 80px rgba(0, 0, 0, 0.45)",
        lightSanctuary: "0 10px 30px rgba(45, 37, 32, 0.06), 0 1px 3px rgba(45, 37, 32, 0.02)",
        glow: "0 4px 20px rgba(158, 28, 28, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
