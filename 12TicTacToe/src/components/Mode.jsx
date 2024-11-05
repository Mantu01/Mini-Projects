import React from 'react';
import { useDispatch } from 'react-redux';
import { restartGameBoard, setModePvP,setWinner,toggleSidebar } from '../store/ticTacToeSlice';
function Mode() {

  const dispatch = useDispatch();

  return (
    <>
      <div id='modeBox' className='box h-screen w-[65vw] bg-black absolute z-10 left-0 opacity-90 flex flex-col justify-center items-center gap-10'>
        <div className='text-5xl font-bold text-white'>Choose Mode</div>
        <div className='h-20 w-[600px] flex justify-around items-center'>
          <button
          onClick={() => {
            dispatch(setModePvP(true));
            dispatch(toggleSidebar());
            dispatch(setWinner(''));
            dispatch(restartGameBoard());
          }}
          className="h-12 w-60 text-2xl font-bold border-2 border-white active:shadow-inner active:shadow-black active:text-xl bg-[#225fa1] rounded-lg">Player vs Player</button>
          <button 
          onClick={() => {
            dispatch(setModePvP(false));
            dispatch(toggleSidebar());
            dispatch(setWinner(''));
            dispatch(restartGameBoard());
          }}
          className="h-12 w-60 text-2xl font-bold border-2 border-white bg-[#225fa1] rounded-lg active:shadow-inner active:shadow-black active:text-xl">Player vs AI</button>
        </div>
        
      </div>
    </>
  )
}

export default Mode