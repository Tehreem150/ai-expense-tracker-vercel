/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ important if Navbar is inside src
  ],
  theme: {
   extend: {
  animation: {
    gradient: "gradient 6s ease infinite",
  },
  keyframes: {
    gradient: {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
  },
}

  },
  plugins: [],
};
