import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { animateStusPage } from '../animations/statusPage';
import { restartGameBoard, toggleSidebar } from '../store/ticTacToeSlice';

function MatchStatus() {

  const winner=useSelector(state=>state.winner);
  const dispatch=useDispatch();
  const [show,setShow]=React.useState(false);

  React.useEffect(()=>{
    if(winner!='')
      setShow(true);
    animateStusPage(show);
  },[winner]);

  return (
    <>
      <div id='winnerBox' className={`h-[95vh] w-[70vw] bg-[#175671] absolute flex flex-col justify-around items-center bg-opacity-70 backdrop-blur-md shadow-2xl shadow-black rounded-3xl ${show?'':'hidden'} `}>
        <button
        onClick={()=>{
          setShow(false);
          dispatch(toggleSidebar());
        }}
         className='h-12 w-12 bg-black text-3xl pb-1 font-bold text-red-600 absolute top-5 right-10 rounded-full '>x</button>
        <p className='text-6xl font-serif'>{winner}!</p>
        <button
        onClick={()=>{
          dispatch(restartGameBoard());
          setShow(false);
          dispatch(toggleSidebar());
        }}
         className='h-20 w-60 text-5xl font-bold border-2 border-black p-1 px-4 bg-[#225fa1] rounded-lg active:shadow-inner active:shadow-black active:text-4xl '>RESTART</button>
      </div>
    </>
  )
}

export default MatchStatus