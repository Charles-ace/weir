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
        brand: {
          "black-v2": "#0E0E0E",
          "black-v2-700": "#161616",
          "blue-v2": "#3773FF",
          "white-v2": "#FDFCFC",
          "grey-v2": "#2F2F2F",
          "grey-v2-400": "#B0B0B0",
          "turquoise-v2": "#03BFD4",
          "orange-v2": "#F38600",
          "purple-v2": "#885FFF",
        },
      },
      gridTemplateColumns: {
        "24": "repeat(24, minmax(0, 1fr))",
      },
    },
  },
  safelist: [
    "grid-cols-24",
    "grid-cols-12",
    "grid-cols-10",
    "col-span-2",
    "col-span-3",
    "col-span-4",
  ],
  plugins: [],
};
export default config;
