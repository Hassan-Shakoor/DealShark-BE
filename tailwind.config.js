/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5956FC",
        foreground: "#231D4F",
        tertiary: "#3D2C69",
        quaternary: "#514279",
        quinary: "#9889C2",
        subtle: "#A9A9A9",
        secondary: { DEFAULT: "#944479", 500: "#1A1C1E" },
        dark: {
          DEFAULT: "#585858",
          secondary: "#333333",
          foreground: "#272626",
          tertiary: "#767680",
          quaternary: "#3C3C43",
          quinary: "#15191B",
          senary: "#171717",
          septenary: "#1D0528",
        },
        light: {
          DEFAULT: "#F1F1F2",
          foreground: "#C0C0C0",
          secondary: "#EFEFF0",
          tertiary: "#F1F1F2",
          quaternary: "#EAE8E9",
        },
        appleGrey: "#909093",
        blue: { DEFAULT: "#3478F6", secondary: "#0A78B8" },
        danger: "#D44545",
      },
      fontFamily: {
        apfelGrotezk: ["ApfelGrotezk"],
        inter: ["Inter"],
        poppins: ["Poppins"],
        sfPro: ["SFPro"],
      },
      fontSize: {
        xxxs: ["8px", { lineHeight: "12px" }],
      },
      spacing: {
        3.5: "14px",
        4.5: "18px",
        5.5: "22px",
        6.5: "26px",
        7.5: "30px",
        12.5: "50px",
        18.5: "74px",
      },
    },
  },
  plugins: [],
};
