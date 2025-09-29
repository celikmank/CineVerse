/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", md: "1.5rem", lg: "2rem" },
    },
    extend: {
      colors: {
        // Netflix official colors
        brand: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#E50914", // Netflix Red
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          DEFAULT: "#E50914",
        },
        // Dark Netflix theme
        dark: {
          50: "#404040",
          100: "#1a1a1a", // Main background
          200: "#141414", // Card background
          300: "#0f0f0f", // Darker elements
          400: "#0a0a0a",
          500: "#000000",
          DEFAULT: "#141414",
        },
        // Accent colors
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047", // Gold
          400: "#facc15",
          500: "#eab308",
          DEFAULT: "#fde047",
        }
      },
      fontFamily: {
        'netflix': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: "0 4px 16px rgba(229, 9, 20, 0.15)",
        netflix: "0 8px 32px rgba(229, 9, 20, 0.3)",
        glow: "0 0 20px rgba(229, 9, 20, 0.5)",
      },
      aspectRatio: {
        '16/9': '16 / 9',
        'poster': '2 / 3',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}