import React from 'react'
import Player from './Player';
import {useDispatch, useSelector} from 'react-redux'
import { disableBoard, enableBoard, restartGameBoard, setWinner, toggleSidebar, updateGameBoard } from '../store/ticTacToeSlice';
import { checkWinner,botMove, isDraw } from '../utils/ticTacToe';

function Card() {

  const gameBoard=useSelector(state=>state.gameBoard);
  const dispatch=useDispatch();
  const [isFirstTurn,setIsFirstTurn]=React.useState(Math.random()>=0.5);
  const [MatchStarted,setMatchStarted]=React.useState('START');
  const modePvP=useSelector(state=>state.modePvP);

  React.useEffect(()=>{
    if(!modePvP) {
      if(isFirstTurn){
        dispatch(enableBoard());
      }else{
        dispatch(disableBoard());
        setTimeout(()=>{
          dispatch(updateGameBoard({value:isFirstTurn?'X':'0',index:botMove(gameBoard)}));
          setIsFirstTurn(prev=>!prev);
        },1000)
      }
    }
    let isWin=checkWinner(gameBoard);
    if(isWin){
      let player='';
      if(isFirstTurn){
        if(modePvP)
          player='Player 2';
        else
          player='Computer';
      }else player='Player 1';
      dispatch(setWinner(`${player} is the winner`));
      dispatch(disableBoard());
      setMatchStarted('START');
    }

    if(!isWin && isDraw(gameBoard)){
      dispatch(setWinner('Match is Drawed'));
      dispatch(disableBoard());
      setMatchStarted('START');
    }
  },[isFirstTurn]);

  const handleClick= (index)=>{
    dispatch(updateGameBoard({value:isFirstTurn?'X':'0',index}));
    setIsFirstTurn(prev=>!prev);
  }

  return (
    <>
      <div className="min-h-[450px] min-w-[400px] h-[90vh] w-2/3  bg-gradient-to-b from-[#C9E3E2] via-[#77eaee] to-[#1a93ae] shadow-2xl shadow-black flex items-center justify-evenly px-20">
        <Player no={1} ani={isFirstTurn && MatchStarted=='FINISH'} />
        <div className='h-full w-1/2 flex flex-col items-center justify-between pb-10 pt-3'>
          <p className="text-4xl font-bold border-b-2 border-black">TIC TAC TOE</p>
          <div className="h-[430px] w-[430px] bg-white shadow-2xl shadow-black grid grid-cols-3 grid-flow-row place-items-center gap-0.5 p-2">
            {
              gameBoard.map((ele, index) => (
                <button
                onClick={()=>handleClick(index)}
                disabled={ele[1]}
                key={index}
                className='text-8xl font-bold font- flex justify-center items-center h-[120px] w-[120px] shadow-inner shadow-black rounded-2xl'
                >{ele[0]}</button>
              ))
            }
          </div>
          <button
          onClick={()=>{
            setMatchStarted(prev=>prev=='START'?'FINISH':'START');
              MatchStarted === 'START' ? dispatch(enableBoard()):(() => {
                dispatch(restartGameBoard());
                dispatch(setWinner('none is the winner'));
              })();
          }}
          className="h-20 w-60 text-5xl active:text-4xl font-bold border-2 border-black p-1 px-4 bg-[#225fa1] rounded-lg active:shadow-inner active:shadow-black">{MatchStarted}</button>
        </div>
        <Player no={modePvP?2:3} ani={!isFirstTurn && MatchStarted=='FINISH'} />
      </div>
    </>
  )
}

export default Card