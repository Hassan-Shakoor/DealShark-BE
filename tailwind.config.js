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
        dark: {
          DEFAULT: "#585858",
          secondary: "#333333",
          foreground: "#272626",
          tertiary: "#767680",
          quaternary: "#3C3C43",
        },
        light: {
          DEFAULT: "#F1F1F2",
          foreground: "#C0C0C0",
          secondary: "#EFEFF0",
        },
        appleGrey: "#909093",
      },
      fontFamily: {
        apfelGrotezk: ["ApfelGrotezk"],
        brockmann: ["Brockmann"],
        inter: ["Inter"],
      },
      spacing: {
        6.5: "1.625rem",
        7.5: "1.875rem",
      },
    },
  },
  plugins: [],
};
