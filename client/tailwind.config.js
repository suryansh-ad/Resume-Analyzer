/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63"
        }
      },
      boxShadow: {
        glass: "0 20px 80px rgba(15, 23, 42, 0.18)",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at top, rgba(34,211,238,0.2), transparent 45%), radial-gradient(circle at 80% 20%, rgba(14,165,233,0.18), transparent 30%)",
      },
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};

