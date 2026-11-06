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
        // Text-safe bronze: 5.0:1 on mist and 5.4:1 on white (the old #B88A2B was 2.9:1 and failed WCAG for labels and links)
        brass: "#8A6418",
        // Filled rating stars: 3.6:1 on mist, enough to tell filled from empty (deep-gold was 2.1:1)
        "star-gold": "#A9781F",
        mist: "#FAF7F0",
        slate: "#56627D",
        line: "#E7E1D5",
        "canvas-cream": "#F5E9D4",
        ruby: "#EA2261",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        sohne: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
