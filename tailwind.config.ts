import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    extend: {
      colors : {
        "landing-pink" : "#E02DC3",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      sans: ['var(--font-roboto)', 'sans-serif'],
      inter: ['var(--font-inter)', 'sans-serif'],
      kdam: ['var(--font-kdam)', 'sans-serif'],
      segoe: ['Segoe UI', 'sans-serif'],
      poppins: ['var(--font-poppins)', 'sans-serif'],
      snigelt : ['var(--font-sniglet)' , 'sans-serif']
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'zl' : "1470px",
      '2xl': '1536px',
    },
  },
  darkMode: "class",
  plugins: [nextui()]};
export default config;
