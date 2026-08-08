/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bgDark: '#04040c',
        bgDarkCard: 'rgba(10, 11, 28, 0.75)',
        accentPurple: '#8b5cf6',
        accentBlue: '#3b82f6',
        accentGold: '#f59e0b',
        accentPink: '#ec4899',
      },
      fontFamily: {
        sans: ['var(--font-body, Inter)', 'sans-serif'],
        display: ['var(--font-display, Space Grotesk)', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px rgba(139, 92, 246, 0.25), 0 0 50px rgba(59, 130, 246, 0.15)',
        glowHover: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.25)',
        glowGold: '0 0 25px rgba(245, 158, 11, 0.25), 0 0 50px rgba(251, 191, 36, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
