import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FDF5EF",
    },
    secondary: {
      main: "#DDDACF",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
});

// Dark Mode Theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E1E1E",
    },
    secondary: {
      main: "#34332F",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
    },
  },
});
