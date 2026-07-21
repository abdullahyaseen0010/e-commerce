import type { Config } from "tailwindcss";

// src/styles/tailwind.config.ts
// NOTE: Tailwind looks for this file at the project root by default.
// Since it lives in src/styles/, point to it explicitly, e.g. in postcss.config.js:
//   plugins: { tailwindcss: { config: "./src/styles/tailwind.config.ts" }, autoprefixer: {} }

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Swap these hexes for VISAC's actual brand values when you have them.
        brand: {
          50: "#f2f6fb",
          100: "#dfe9f5",
          200: "#b9cfe8",
          300: "#8caed6",
          400: "#5c87bd",
          500: "#3a67a3",
          600: "#2c5083",
          700: "#254269",
          800: "#213758",
          900: "#1e2f4a",
          950: "#141d30",
        },
        accent: {
          400: "#f2994a",
          500: "#e2792e",
          600: "#c05f1e",
        },
        neutral: {
          50: "#f8f8f7",
          100: "#efeeec",
          200: "#dedcd8",
          300: "#c2bfb9",
          400: "#9a968e",
          500: "#77736b",
          600: "#5c5952",
          700: "#494640",
          800: "#332f2a",
          900: "#211e1a",
        },
        success: "#2f9e5c",
        warning: "#d1a218",
        danger: "#d1483a",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.1rem" }],
        sm: ["0.875rem", { lineHeight: "1.3rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.6rem" }],
        xl: ["1.25rem", { lineHeight: "1.7rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "3.2rem" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        "header": "4.5rem",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 29, 48, 0.06), 0 2px 8px rgba(20, 29, 48, 0.06)",
        "card-hover": "0 4px 12px rgba(20, 29, 48, 0.10), 0 2px 4px rgba(20, 29, 48, 0.08)",
        modal: "0 20px 40px rgba(20, 29, 48, 0.18)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        skeleton: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.25s ease-out",
        "toast-in": "toast-in 0.2s ease-out",
        skeleton: "skeleton 1.4s ease-in-out infinite",
      },
      aspectRatio: {
        product: "3 / 4",
        banner: "16 / 6",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;