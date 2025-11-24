/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f9f0',
          100: '#e6f3dc',
          200: '#cfe7bd',
          300: '#b0d894',
          400: '#91c96d',
          500: '#73BF44',
          600: '#5da332',
          700: '#4a8328',
          800: '#3c6920',
          900: '#2f531a',
          DEFAULT: '#73BF44',
        },
        secondary: '#FFFFFF',
        accent: '#f4f9f0',
        border: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
