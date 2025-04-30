/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "torea-bay": {
          "50": "rgba(239, 244, 254, 1)",
          "100": "rgba(226, 234, 253, 1)",
          "200": "rgba(202, 215, 251, 1)",
          "300": "rgba(171, 189, 246, 1)",
          "400": "rgba(137, 152, 240, 1)",
          "500": "rgba(108, 119, 232, 1)",
          "600": "rgba(80, 80, 219, 1)",
          "700": "rgba(67, 65, 193, 1)",
          "800": "rgba(54, 54, 152, 1)",
          "900": "rgba(51, 52, 124, 1)",
          "950": "rgba(30, 30, 72, 1)",
        },
        "grenadier": {
          "50": "rgba(254, 245, 238, 1)",
          "100": "rgba(253, 232, 215, 1)",
          "200": "rgba(250, 204, 174, 1)",
          "300": "rgba(247, 169, 122, 1)",
          "400": "rgba(243, 123, 68, 1)",
          "500": "rgba(240, 88, 31, 1)",
          "600": "rgba(222, 62, 21, 1)",
          "700": "rgba(186, 45, 20, 1)",
          "800": "rgba(186, 45, 20, 1)", // Note: 800 and 700 have the same value in your list
          "900": "rgba(148, 38, 24, 1)",
          "950": "rgba(120, 33, 22, 1)",
        },
        // Base colors needed for references
        "base": {
          "white": "#FFFFFF",
        },
        "zinc": {
          "50": "#fafafa",
          "100": "#f4f4f5",
          "200": "#e4e4e7",
          "300": "#d4d4d8",
          "400": "#a1a1aa",
          "500": "#71717a",
        },
        "red": {
          "500": "#ef4444",
          "600": "#dc2626",
        },

        // shadcn/ui theme colors
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--focus)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}