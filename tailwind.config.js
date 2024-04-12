/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: "#61b477",
        // primary: "#7be697",
        secondary: "#eafa84",
        focus: "#99e73d",
        background: "#111827",
      },
    },
  },
  plugins: [],
};
