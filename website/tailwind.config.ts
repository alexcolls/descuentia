
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ebf5ff",
          100: "#d1e6ff",
          200: "#a3ccff",
          300: "#75b2ff",
          400: "#4798ff",
          500: "#1a7eff",
          600: "#0064e6",
          700: "#004db4",
          800: "#003582",
          900: "#001c4f"
        },
        accent: {
          50: "#fff1f3",
          100: "#ffe4e8",
          200: "#ffccd6",
          300: "#ff99ad",
          400: "#ff6683",
          500: "#ff335a",
          600: "#e60041",
          700: "#b40032",
          800: "#820023",
          900: "#4f0015"
        },
        success: "#22c55e",
        warning: "#f97316"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        heading: ["Poppins", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 45px -15px rgba(26, 126, 255, 0.45)",
        card: "0 20px 35px -15px rgba(15, 23, 42, 0.25)"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      }
    }
  },
  plugins: []
};

export default config;
