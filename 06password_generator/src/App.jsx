import Body from "./components/Body"
import Footer from "./components/Footer"
import { useState } from 'react'

function App() {
  const [color,setColor]=useState("white");
  return (
    <>
      <Body color={color}/>
      <Footer setColor={setColor}/>
    </>
  )
}

export default App
