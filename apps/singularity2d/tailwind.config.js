/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../libs/harmonized-components/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sacred: {
          gold: '#ffd700',
          light: '#ffed4e',
          dark: '#b8860b',
        },
        quantum: {
          blue: '#00ffff',
          purple: '#8a2be2',
          pink: '#ff1493'
        },
        consensus: {
          yes: '#00ff00',
          no: '#ff0000',
          pending: '#ffff00',
          neutral: '#666666'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'sacred-pulse': 'sacred-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'sacred-pulse': {
          '0%, 100%': {
            opacity: '0.6',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'sacred': '0 0 20px rgba(255, 215, 0, 0.4)',
        'consensus-green': '0 0 15px rgba(0, 255, 0, 0.6)',
        'consensus-red': '0 0 15px rgba(255, 0, 0, 0.6)',
        'quantum': '0 0 25px rgba(0, 255, 255, 0.5)',
      },
      clipPath: {
        'pentagon': 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        'hexagon': 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
      },
    },
  },
  plugins: [
    // Custom plugin for clip-path utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.clip-pentagon': {
          'clip-path': 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        },
        '.clip-hexagon': {
          'clip-path': 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};