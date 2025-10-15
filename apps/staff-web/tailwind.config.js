/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f8f8d',
        'primary-dark': '#1a7573',
        'primary-light': '#24a39f',
      },
    },
  },
  plugins: [],
}
