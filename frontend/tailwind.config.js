/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        blue: {
          50: '#E9F2FF',
          100: '#CCE0FF',
          200: '#A6C8FF',
          300: '#7AA7FF',
          400: '#4C84F0',
          500: '#1E67D5',
          600: '#0052CC',
          700: '#0747A6',
          800: '#09326C',
          900: '#091E42',
        },
        brand: {
          50: '#E9F2FF',
          100: '#CCE0FF',
          200: '#A6C8FF',
          300: '#7AA7FF',
          400: '#4C84F0',
          500: '#1E67D5',
          600: '#0052CC',
          700: '#0747A6',
          800: '#09326C',
          900: '#091E42',
        },
      },
      boxShadow: {
        low: '0 1px 2px rgba(9, 30, 66, 0.08), 0 0 0 1px rgba(9, 30, 66, 0.06)',
        mid: '0 8px 24px rgba(9, 30, 66, 0.12), 0 0 0 1px rgba(9, 30, 66, 0.08)',
      },
    },
  },
  plugins: [],
}
