// themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    isDarkMode: false,
    colors: {
      light: {
        background: "#FFFFFF",
        text: "#000000",
        primary: "#007BFF",
        secondary: "#6C757D",
      },
      dark: {
        background: "#121212",
        text: "#FFFFFF",
        primary: "#BB86FC",
        secondary: "#03DAC6",
      },
    },
  },
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
