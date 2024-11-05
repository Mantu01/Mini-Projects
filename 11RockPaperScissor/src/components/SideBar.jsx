import React from 'react'

function SideBar() {
  const [show,setShow]=React.useState(true);
  return (
    <div>
      <button className='h-8 w-8 rounded-xl bg-white fixed m-2 z-10' onClick={()=>setShow(!show)}></button>
      <div className={`h-screen w-[40vw] bg-black bg-opacity-70 absolute ${!show?'-translate-x-full':''} duration-1000`}></div>
    </div>
  )
}

export default SideBar