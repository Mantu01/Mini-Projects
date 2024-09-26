let display=document.querySelector("#display");
setInterval(()=>{
  let date=new Date();
  display.innerText=`${date.toLocaleTimeString()}`;
}, 1000);