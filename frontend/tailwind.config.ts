import type { Config } from "tailwindcss";

const config: Config = {
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
        dusk: {
          bg: "#04060A",
          card: "#0C0F17",
          panel: "#10131C",
          surface: "#101010",
          jet: "#2E2D30",
          cornflower: "#71B1FF",
          gray: "#E2DFE9",
          magnolia: "#EDEAF3",
          smokey: "#101010",
          granite: "#636167",
          taupe: "#908E94",
          metallic: "#A8A5AF",
          warning: "#ED254E",
          attention: "#FFCF23",
          success: "#71B1FF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
