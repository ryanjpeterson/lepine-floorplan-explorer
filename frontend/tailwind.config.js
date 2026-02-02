/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
      fontFamily: {
        sans: ["Jost", "sans-serif"],
      },
      colors: {
        midnight: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          800: "#243b53",
          900: "#102a43",
        },
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
