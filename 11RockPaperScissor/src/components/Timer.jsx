import React from 'react'

function Timer() {
  const [timer,setTimer]=React.useState(5);
    
  return (
    <div className='h-24 w-24 bg-white rounded-full flex justify-center items-center'>
      <p className='text-4xl'>{}</p>
    </div>
  )
}

export default Timer