import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        signal: {
          black: "#080b09",
          panel: "#0d120f",
          panel2: "#111813",
          line: "#243329",
          text: "#edf3ee",
          muted: "#a7b2aa",
          dim: "#77857d",
          green: "#9bd8b3",
          olive: "#b7c49b",
          amber: "#c8b77b",
          danger: "#d08a8a"
        }
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        console: "0 18px 70px rgba(0, 0, 0, 0.22)",
        glow: "0 0 28px rgba(155, 216, 179, 0.08)"
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
