import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#667085",
        line: "#e5e7eb",
        brand: "#2563eb"
      },
      boxShadow: {
        soft: "0 18px 50px -30px rgba(15, 23, 42, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
