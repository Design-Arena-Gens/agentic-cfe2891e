import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0f172a",
        accent: "#22d3ee",
        aurora: "#a855f7"
      },
      boxShadow: {
        glow: "0 0 80px rgba(34, 211, 238, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
