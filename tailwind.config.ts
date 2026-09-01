import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1815",
        paper: "#FFFFFF",
        cloud: "#FAF8F6",
        ember: {
          50: "#FFF4EC",
          100: "#FFE6D5",
          200: "#FFC9A3",
          300: "#FFA663",
          400: "#FF8A3D",
          500: "#F4600E",
          600: "#D9500A",
          700: "#B33F08",
          800: "#8A3106",
          900: "#5C2004",
        },
        moss: "#2F9E58",
        clay: "#8A8580",
        line: "#EFE9E3",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "20px",
        stub: "16px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26,24,21,0.04), 0 8px 24px -12px rgba(244,96,14,0.18)",
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "punch": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(0.94)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "scan-line": "scan-line 1.8s ease-in-out infinite",
        "pop-in": "pop-in 0.28s cubic-bezier(0.16,1,0.3,1)",
        "punch": "punch 0.28s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
