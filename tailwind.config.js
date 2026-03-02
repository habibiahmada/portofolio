import typography from '@tailwindcss/typography';
import tailwindcssAnimate from 'tailwindcss-animate';

const config = {
  // Optimized content paths for proper CSS purging
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    // Exclude test files and node_modules
    "!./src/**/*.test.{js,ts,jsx,tsx}",
    "!./src/**/*.spec.{js,ts,jsx,tsx}",
    "!./node_modules/**",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 300ms cubic-bezier(0.87, 0, 0.13, 1)",
        "accordion-up": "accordion-up 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      }
    },
  },
  plugins: [
    typography,
    tailwindcssAnimate,
  ],
}

export default config;