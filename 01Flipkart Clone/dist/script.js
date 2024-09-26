let circle=document.querySelectorAll(".circle");
let slider=document.querySelector("#slider");
let sponsorer=document.querySelector("#img");
img.classList.add("bg-cover")
let flag=true;
let cnt1=0,cnt2=0;
setInterval(function() {
  if(flag){
      circle[cnt1].style.background="none";
    cnt1++
    if(cnt1===9)
      cnt1=0;
    circle[cnt1].style.backgroundColor="white";
    setImg(img1(cnt1),slider);
  }
  else{
    if(cnt2===10000)
      cnt2=0;
    sponsore.classList.remove("bg-cover");
    setImg(img2(cnt2%6),sponsore);
    sponsore.classList.add("bg-cover");
    cnt2++;
  }
  flag=!flag;
}, 1500);function setImg(img,screen) {
  screen.style.backgroundImage=`url(images/${img})`;
}
function img1(cnt) {
  if(cnt===0)
    return "IPhone.jpg";
  else if(cnt===1)
    return "oppo.jpeg";
  else if(cnt===2)
    return "speaker.jpeg";
  else if(cnt===3)
    return "nothing.jpeg";
  else if(cnt===4)
    return "laptop.jpeg";
  else if(cnt===5)
    return "earphone.jpg";
  else if(cnt===6)
    return "fan.jpg";
  else if(cnt===7)
    return "tv.jpeg";
  else
    return "watch.jpeg";
}
function img2(cnt) {
  if(cnt===0)
    return "adidas.jpeg";
  else if(cnt===1)
    return "boult.jpeg";
  else if(cnt===2)
    return "glucond.jpeg";
  else if(cnt===3)
    return "noise.jpeg";
  else if(cnt===4)
    return "beat.jpeg";
  else
    return "acer.jpeg";
}
let isOff=true;
let status=document.querySelector("#on_off");
let btn=querySelector("#switch");
status.addEventListener("click",()=>{
  if(isOff){
    status.classList.add("flex-col");
    status.classList.remove("flex-row");
    btn.innerText="ON";
  }else{
    status.classList.add("flex-row");
    status.classList.remove("flex-col");
    btn.innerText="OFF";
  }
} );