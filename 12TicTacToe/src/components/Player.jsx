import React from 'react'

function Player(props) {
  const image=props.no!=3?'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8y4wQzs57ERm7zfqqovNN3zBtUvDIk9E5RNOecVDTRkU6qckLwi_Q4dTZ5rmR3SzJNcc&usqp=CAU':'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUs3TpCOfdQigVqB3bfKj_S9w0S_pxGtxQMpS5qJBzZVU7po0VwH7zrmrM74ce7mgW_nE&usqp=CAU';
  let playerName=props.no==1?'Player 1':'Player 2';
  if(props.no==3) playerName='Computer';
  return (
    <>
      <div className='w-52 h-60 flex flex-col justify-between items-center'>
        <div 
          className='h-32 w-32 bg-slate-700 bg-cover rounded-full flex justify-center items-center'
          style={{ backgroundImage: `url(${image})` }}
          >
            <div className={`h-[140px] w-44 ${props.ani?'animate-spin':'hidden'} border-[10px] border-blue-700 border-dotted rounded-full  border-l-0`} ></div>
          </div>
        <p className='text-3xl font-bold'>{playerName}</p>
        <p className='h-10 w-10 text-3xl font-bold border-2 border-black shadow-inner shadow-black text-center'> {props.no==1?'X':'0'}</p>
      </div>
    </>

  )
}

export default Player