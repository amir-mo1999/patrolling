const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      ...colors,
      // light mode
      primary_color: "#FDF5EF",
      secondary_color: "#DDDACF",
      primary_text: "#333333",
      secondary_text: "#666666",

      // dark mode
      dark_primary_color: "#1E1E1E", // Dark background color
      dark_secondary_color: "#34332F", // Slightly lighter than the background color
      dark_primary_text: "#FFFFFF", // White text color for dark mode
      dark_secondary_text: "#CCCCCC",
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        html: { color: theme("colors.gray.200") },
      });
    }),
  ],
};
