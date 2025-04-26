/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5956FC",
        secondary: { DEFAULT: "#944479", 500: "#1A1C1E" },
      },
      fontFamily: {
        apfelGrotezk: ["ApfelGrotezk"],
        brockmann: ["Brockmann"],
        inter: ["Inter"],
      },
    },
  },
  plugins: [],
};
