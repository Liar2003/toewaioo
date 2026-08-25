import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#030508",
        abyss: "#071014",
        panel: "#0A1117",
        neon: "#00F5A0",
        cyan: "#00D9FF",
        warn: "#FFB800",
        danger: "#FF3864",
        frost: "#E8F1F5",
        muted: "#71808A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "neon-sm": "0 0 8px rgba(0,245,160,.35)",
        neon: "0 0 20px rgba(0,245,160,.25), inset 0 0 12px rgba(0,245,160,.06)",
        hud: "inset 0 0 24px rgba(0,217,255,.05)",
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: ".4" },
          "94%": { opacity: "1" },
          "96%": { opacity: ".6" },
          "97%": { opacity: "1" },
        },
        glitchShift: {
          "0%,100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, -1px)" },
          "80%": { transform: "translate(1px, 2px)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1", boxShadow: "0 0 6px currentColor" },
          "50%": { opacity: ".35", boxShadow: "0 0 2px currentColor" },
        },
        borderSweep: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        scanline: "scanline 6s linear infinite",
        flicker: "flicker 5s linear infinite",
        glitchShift: "glitchShift .3s steps(2) infinite",
        pulseDot: "pulseDot 1.6s ease-in-out infinite",
        borderSweep: "borderSweep 4s linear infinite",
        floatY: "floatY 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
