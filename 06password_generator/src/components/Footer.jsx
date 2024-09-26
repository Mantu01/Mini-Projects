export default function Footer({setColor}){
  return (
    <>
      <div className="h-20 w-full bg-slate-500 absolute bottom-0 flex justify-around items-center">
				<button className="text-2xl h-10 w-24 bg-red-800 rounded-3xl " 
				onClick={()=>setColor("#991b1b")}
				>Red</button>
				<button className="text-2xl h-10 w-24 bg-blue-800 rounded-3xl "
				onClick={()=>setColor("#1e40af")}
				>Blue</button>
				<button className="text-2xl h-10 w-24 bg-green-800 rounded-3xl " 
				onClick={()=>setColor("#166534")}
				>Green</button>
				<button className="text-2xl h-10 w-24 bg-pink-600 rounded-3xl " 
				onClick={()=>setColor("#db2777")}
				>Pink</button>
				<button className="text-2xl h-10 w-24 bg-yellow-400 rounded-3xl "
				onClick={()=>setColor("#facc15")}
				>Yellow</button>
				<button className="text-2xl h-10 w-24 bg-black rounded-3xl text-white "
				onClick={()=>setColor("#000")}
				>Black</button>
				<button className="text-2xl h-10 w-24 bg-white rounded-3xl "
				onClick={()=>setColor("#fff")}
				>White</button>
			</div>
    </>
  )
}