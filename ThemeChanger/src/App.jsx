import { useEffect, useState } from "react";
import { ThemeProvider } from "./Context/themeContext";
import ThemeBtn from "./Conponents/ThemeBtn";
import Card from "./Conponents/Card";

function App() {

  const [theme,setTheme]=useState("light")

  const toggleTheme=(e)=>{
    setTheme((prevTheme) => prevTheme === "dark" ? "light" : "dark");
  }

  useEffect(()=>{
    const html=document.querySelector("html")
    html.classList.remove("dark","light")
    html.classList.add(theme)
  },[theme])

  return (
    <ThemeProvider value={{theme,toggleTheme}}>
      <div className="h-screen w-full flex flex-col items-center dark:bg-slate-800 justify-center gap-5">
        <ThemeBtn/>
        <Card/>
      </div>
    </ThemeProvider>
  )
}

export default App
