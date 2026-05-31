import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          deep: "rgb(var(--bg-deep) / <alpha-value>)",
          card: "rgb(var(--bg-card) / <alpha-value>)",
          border: "rgb(var(--bg-border) / <alpha-value>)"
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          dim: "rgb(var(--ink-dim) / <alpha-value>)"
        },
        neon: {
          cyan: "rgb(var(--neon-cyan) / <alpha-value>)",
          violet: "rgb(var(--neon-violet) / <alpha-value>)",
          pink: "rgb(var(--neon-pink) / <alpha-value>)",
          amber: "rgb(var(--neon-amber) / <alpha-value>)"
        }
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
