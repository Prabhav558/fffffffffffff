import { defineConfig } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4fe',
          100: '#d9e4fd',
          200: '#bcd1fb',
          300: '#8eb3f8',
          400: '#5a8cf4',
          500: '#4a6cf7',
          600: '#2c4ad9',
          700: '#293cbc',
          800: '#263499',
          900: '#23337a',
        },
        secondary: {
          50: '#f5f2ff',
          100: '#ece6ff',
          200: '#dcd0ff',
          300: '#c8afff',
          400: '#ac83ff',
          500: '#8c6dff',
          600: '#7a41ff',
          700: '#6a2bef',
          800: '#5925c6',
          900: '#4b239f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 0 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    // Custom plugin for additional utilities if needed
    plugin(function({ addUtilities, addComponents }) {
      addUtilities({
        '.btn': {
          '@apply px-4 py-2 rounded-md font-semibold transition-colors': {},
        },
        '.btn-primary': {
          '@apply bg-primary-500 text-white hover:bg-primary-600': {},
        },
        '.input': {
          '@apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500': {},
        },
        '.card': {
          '@apply bg-white shadow-md rounded-lg p-4': {},
        },
      });
    }),
  ],
});