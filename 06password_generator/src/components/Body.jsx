import { useCallback, useEffect, useState, useRef } from "react"
function Body({color}){
  const [pass,setPass]=useState("")
  const [charNo,setCharNo]=useState(8)
  const [numAllowed,setNumAllowed]=useState(false);
  const [charAllowed,setCharAllowed]=useState(false);
  const charRef=useRef(null);

  const passwordGenerator = useCallback(()=>{
    let pass=""
    let str="ABCDEFGHIJKLMNOPQWESTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if(numAllowed)
      str+="12345678"
    if(charAllowed)
      str+="!@#$%^&*()_+<>?[{}]"
    for(let i=0;i<charNo;i++)
      pass+=str.charAt(Math.floor(Math.random()*str.length))
    setPass(pass)
  },[charNo,numAllowed,charAllowed])

  useEffect(()=>{
    passwordGenerator()
  },[charNo,numAllowed,charAllowed])

  return(
    <>
      <div className="h-[100vh] w-full bg-slate-600 flex flex-col items-center gap-20" style={{backgroundColor:color}}>
        <h1 className="h-10 text-4xl bg-opacity-40 bg-white p-4 pt-0 m-4 rounded-2xl">Password Generator</h1>
        <div className="text-2xl h-[35vh] w-[40vw] bg-slate-300 border-2 shadow-2xl flex flex-col items-center gap-5 p-5">
          <div className="h-10 w-full bg-white p-3 pr-0 rounded-3xl flex justify-center items-center border-2 border-black">
            <input className="h-9 w-full" type="text" value={pass} ref={charRef} />
            <button className="text-lg h-10 w-20 bg-orange-400 rounded-r-2xl border-2 border-black active:bg-black active:text-white" onClick={()=>{
              charRef.current?.select();
              window.navigator.clipboard.writeText(pass)
            }}>Copy</button>
          </div>
          <div>
            <input type="range" min="1" max="100" onChange={(e)=>setCharNo(e.target.value)} value={charNo} readOnly />
            <label className="m-4">Length : {charNo}</label>
          </div>
          <div>
            <input type="checkbox" defaultChecked={numAllowed} onChange={()=>{
              setNumAllowed((prev)=>!prev)
            }} />
            <label className="m-4">Numbers</label>
          </div>
          <div>
            <input type="checkbox" defaultChecked={charAllowed} onChange={()=>{
              setCharAllowed((prev)=>!prev)
            }} />
            <label className="m-4">Character</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default Body