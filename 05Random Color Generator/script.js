const screen=document.querySelector("#screen");
const start =document.querySelector("#start");
const stop =document.querySelector("#stop");
function randomColor() {
  let Rcolor="#";
  const hex="0123456789abcdef";
  for (let i = 0; i < 6; i++)
    Rcolor+=hex[Math.floor(Math.random()*16)];
  return Rcolor;
}
let ColorSet;
function setColor() {
  ColorSet=setInterval(changeColor,1000);
  function changeColor() {
    screen.style.backgroundColor=randomColor();
  }
}
function stopColor() {
  clearInterval(ColorSet);
}
start.addEventListener("click",setColor);
stop.addEventListener("click",stopColor);