/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0D4F8B",
        teal: "#1AB87A",
        amber: "#E0A020",
        red: "#C0392B",
      },
    },
  },
  plugins: [],
}
