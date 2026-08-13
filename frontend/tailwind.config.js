/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EAE6D6",
        paperDark: "#DDD7C1",
        ink: "#1F2B1A",
        forest: "#2F5233",
        forestDark: "#1F3922",
        turmeric: "#E3A72C",
        beet: "#7A2E3A",
        crate: "#8B6F47",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
