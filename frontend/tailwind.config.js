/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#ff4d00', // Example accent color
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
