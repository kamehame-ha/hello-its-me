/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./html/*.html", "./public/**/*"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}

