import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebar:true,
  winner:'',
  modePvP:true,             // modePvP means player vs player
  gameBoard:Array(9).fill().map(()=>[null,true]),
  
}

export const ticTacToeSlice = createSlice({
  name: "ticTacToe",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar =!state.sidebar;
    },
    setWinner:(state,action) => {
      state.winner = action.payload;
    },
    toggleMatchStarted:(state) => {
      state.matchStarted = !state.matchStarted;
    },
    setModePvP:(state,action) => {
      state.modePvP = action.payload;
    },
    updateGameBoard:(state,action) => {
      state.gameBoard[action.payload.index][0] = action.payload.value;
      state.gameBoard[action.payload.index][1] = true;
    },
    restartGameBoard:(state)=>{
      state.gameBoard = Array(9).fill().map(()=>[null,true]);
      state.winner='';
    },
    disableBoard:(state)=>{
      state.gameBoard = state.gameBoard.map((ele)=>[ele[0],true]);
    },
    enableBoard:(state)=>{
       state.gameBoard = state.gameBoard.map((ele)=>[ele[0],ele[0]?true:false]);
    },
  }
});

export const { toggleSidebar,setWinner,toggleMatchStarted,setModePvP,updateGameBoard,restartGameBoard,disableBoard,enableBoard } = ticTacToeSlice.actions;

export default ticTacToeSlice.reducer;