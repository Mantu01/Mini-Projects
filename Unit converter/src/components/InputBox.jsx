import { useState } from "react"
import countryCode from "./../assests/countryCode"

function InputBox({
  label,
  cOpt,
  io,
  setFrom,
  setTo,
  isDisabled,
  res,
  setVal
}){
  const [flag,setFlag]=useState(countryCode[io.toUpperCase()])
  const txt=setTo?"Output":"Input"
  return (
    <>
      <div className="h-[20vh] w-[40vw] border-2 border-black rounded-3xl flex justify-evenly items-center">
        <div className="flex flex-col items-center text-2xl font-medium">
          <label>{txt}</label>
          {
            isDisabled? <input disabled={true} value={res?res:0} className="h-10 border-2 border-black text-lg rounded-3xl text-center "/>:
            <input type="number"  placeholder={isDisabled?'':"Enter Value"} min={0} 
            onChange={(e)=>setVal(Number(e.target.value))}
            className="h-10 border-2 border-black text-lg rounded-3xl text-center "/>
           
          }
        </div>
        <div className="flex flex-col items-center">
          <p>{label}</p>
          <div
          className="h-20 w-20 bg-cover"
          style={{backgroundImage:flag?`url("https://flagsapi.com/${flag}/flat/64.png")`:`url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR41JLZkqd7yHG1v_tfkt8RANNR7ZKTLimb7Q&s")`}}
          >
          </div>
        </div>
        <select
        className="h-10 w-auto rounded-lg text-center shadow-lg shadow-black"
        value={io}
        onChange={(e)=>setFlag(countryCode[e.target.value.toUpperCase()],setFrom?setFrom(e.target.value):setTo(e.target.value))}
        >
          {
            cOpt.map((currency)=>(
              <option key={currency} value={currency}>
                {currency.toUpperCase()}
              </option>
            ))
          }
        </select>
      </div>
    </>
  )
}
export default InputBox