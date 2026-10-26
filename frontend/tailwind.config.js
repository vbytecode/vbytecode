/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        secondary: "#818CF8",
        cta: "#10B981",
        ink: "#1E1B4B",
        canvas: "#F5F3FF",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(99, 102, 241, 0.12)",
        lift: "0 20px 40px rgba(30, 27, 75, 0.08)",
      },
      animation: {
        marquee: "marquee var(--duration, 30s) linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "border-spin": "border-spin 6s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "border-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
}
