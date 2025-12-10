/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./types.ts",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b1120",
          800: "#0f172a",
        },
        neon: {
          violet: "#8b5cf6",
          cyan: "#22d3ee",
        },
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-1": "0 24px 80px rgba(79,70,229,0.35)",
        "glow-2": "0 32px 120px rgba(56,189,248,0.35)",
      },
      animation: {
        "float-slow": "float 10s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

