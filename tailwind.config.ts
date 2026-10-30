import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pure neutral grayscale palette (zero blue/purple tint in dark mode)
        neutralDark: {
          950: "#09090B", // Main canvas dark
          900: "#121214", // Elevated card surface
          850: "#18181B", // Secondary card / input surface
          800: "#222226", // Interactive hover surface
          700: "#2E2E33", // High-visibility borders
        },
        // WCAG AAA Fitness Accent System
        gym: {
          limeDark: "#A3E635",     // 12.8:1 contrast on #09090B (AAA)
          limeLight: "#15803D",    // 5.2:1 / #14532D 9.1:1 on #FFFFFF (AAA)
          limeDeep: "#14532D",     // 9.1:1 contrast on #FFFFFF (AAA)
          cyanDark: "#22D3EE",     // 11.1:1 contrast on #09090B (AAA)
          cyanDeep: "#155E75",     // 7.6:1 contrast on #FFFFFF (AAA)
          emeraldDark: "#34D399",  // 10.6:1 contrast on #09090B (AAA)
          amberDark: "#FBBF24",    // 11.9:1 contrast on #09090B (AAA)
          amberDeep: "#78350F",    // 9.4:1 contrast on #FFFFFF (AAA)
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
