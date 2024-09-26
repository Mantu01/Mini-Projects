import { useState,useEffect } from "react"
import imageList from "./assests/imageList"
import InputBox from "./components/InputBox"
import useCurrencyInfo from "./hooks/useCurrencyInfo"
function App() {
  const [unit,setUnit]=useState("currencyExchange")
  const [from,setFrom]=useState("usd")
  const [to,setTo]=useState("inr")
  const currencyInfo=useCurrencyInfo(from)
  const currencyOptions=Object.keys(currencyInfo)
  const [res,setRes]=useState(0)
  const [val,setVal]=useState(0)
  useEffect(()=>{
    if(val<0)
      setRes("Enter valid value")
    else
      setRes((val*currencyInfo[to]).toFixed(2))
  },[val,to,from])
  return (
    <>
      <div
      className="w-full h-screen flex justify-center items-center"
      style={{backgroundImage:imageList[unit]}}
      >
        <div className="h-[60vh] w-[60vw] bg-slate-300 opacity-90 shadow-2xl flex flex-col justify-evenly items-center border-2 rounded-3xl pb-10">
          <select
          className="h-8 w-[30vw] text-center bg-blue-200 border-2 border-black rounded-3xl"
          onChange={(e)=>setUnit(e.target.value)}
          >
            <option value="currencyExchange">Currency</option>
            <option value="mass">Mass</option>
            <option value="length">Length</option>
            <option value="numberSystem">Number System</option>
            <option value="temperature">Temperature</option>
          </select>
          <InputBox label="FROM" cOpt={currencyOptions} io={from} setFrom={setFrom} isDisabled={false} setVal={setVal}/>
          <InputBox label="TO" cOpt={currencyOptions} io={to}  setTo={setTo} isDisabled={true} res={res}/>
        </div>
      </div>
    </>
  )
}

export default App
