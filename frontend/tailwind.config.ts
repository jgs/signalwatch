import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        signal: {
          black: "#040605",
          panel: "#070a08",
          panel2: "#0a0f0c",
          line: "#1a2b21",
          text: "#d8ded9",
          muted: "#7f8b83",
          dim: "#536059",
          green: "#89e3ad",
          olive: "#9aa56f",
          amber: "#b6a16d",
          danger: "#c87878"
        }
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        console: "0 24px 90px rgba(0, 0, 0, 0.28)",
        glow: "0 0 30px rgba(137, 227, 173, 0.08)"
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.9" }
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(137, 227, 173, 0.42)" },
          "70%": { boxShadow: "0 0 0 8px rgba(137, 227, 173, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(137, 227, 173, 0)" }
        }
      },
      animation: {
        breathe: "breathe 2.8s ease-in-out infinite",
        pulseRing: "pulseRing 2.4s ease-out infinite"
      }
    }
  },
  plugins: []
};

export default config;

