import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'btn',
    'btn-primary',
    'btn-secondary',
    'btn-outline',
    'btn-accent',
    'btn-neutral',
    'btn-info',
    'btn-success',
    'btn-warning',
    'btn-error',
    'font-sans'
    // Add more individually if needed
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
        gray: {
          50: '#f9fafb',
          100: '#f4f5f7',
          200: '#e5e7eb',
          300: '#d2d6dc',
          400: '#9fa6b2',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 0 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [daisyui],
}
