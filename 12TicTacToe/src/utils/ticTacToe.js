
const winnerPossibilities = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

export function checkWinner(gameBoard){
  let isWinner = false;
  winnerPossibilities.forEach((ele)=>{
    if(gameBoard[ele[0]][0] && gameBoard[ele[0]][0]==gameBoard[ele[1]][0] && gameBoard[ele[1]][0]==gameBoard[ele[2]][0] ){
      isWinner = true;
      return;
    }
  });
  return isWinner;
}

export function isDraw(gameBoard){
  let isDraw = true;
  gameBoard.forEach((ele)=>{
    if(!ele[0]){
      isDraw = false;
    }
  });
  return isDraw;
}

export function botMove(gameBoard){
  let randomIndex = Math.floor(Math.random()*9);
  while(gameBoard[randomIndex][0]){
    randomIndex = Math.floor(Math.random()*9);
  }
  return randomIndex;
}