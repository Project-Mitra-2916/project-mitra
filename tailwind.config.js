/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
        rubikmono: ['Rubik Mono One', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
