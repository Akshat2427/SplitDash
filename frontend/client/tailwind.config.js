/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 
  theme: {
    extend: {
      fontFamily: {
        righteous: ['Righteous', 'sans-serif'],
        acme: ['Acme', 'sans-serif'],
      },
     
    },
  },
  plugins: [],
}

