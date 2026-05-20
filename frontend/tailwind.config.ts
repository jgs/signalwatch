import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        signal: {
          black: "#f4f7f2",
          panel: "#ffffff",
          panel2: "#f6f8f4",
          line: "#d8e0d8",
          text: "#111b16",
          muted: "#526057",
          dim: "#748176",
          green: "#3f6f4d",
          olive: "#4f7e5c",
          amber: "#9b7a2f",
          danger: "#a85b5b"
        }
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        console: "0 18px 70px rgba(17, 27, 22, 0.08)",
        glow: "0 0 28px rgba(79, 126, 92, 0.08)"
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
