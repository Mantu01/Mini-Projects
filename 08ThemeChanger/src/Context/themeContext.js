import React from "react";

export const themeContext=React.createContext();

export const ThemeProvider= themeContext.Provider

export const useTheme=()=>{
  return React.useContext(themeContext)
}