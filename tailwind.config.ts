import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // 品牌色
        primary: {
          light: "#4f46e5",
          DEFAULT: "#4f46e5",
          dark: "#6366f1",
        },
        // 背景色
        surface: {
          light: "#ffffff",
          dark: "#1a1a1a",
        },
        surfaceSecondary: {
          light: "#f5f5f5",
          dark: "#242424",
        },
        // 边框色
        border: {
          light: "#e5e5e5",
          dark: "#404040",
        },
      },
    },
  },
  plugins: [],
};
export default config;
