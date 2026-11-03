import type { Config } from "tailwindcss";

// Palette is taken from the Elevate HQ business card: deep navy, warm gold, white.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A1530",
        navy: "#10203F",
        gold: "#F2CC73",
        "deep-gold": "#D4A53A",
        brass: "#B88A2B",
        mist: "#FAF7F0",
        slate: "#56627D",
        line: "#E7E1D5",
        "canvas-cream": "#F5E9D4",
        ruby: "#EA2261",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "var(--font-sans)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        sohne: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
