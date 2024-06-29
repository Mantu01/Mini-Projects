let PopUp=document.querySelector("#background");
PopUp.style.display="none";
let colors=document.querySelectorAll(".color");
let rod1=document.querySelector("#rod-part1");
let rod2=document.querySelector("#rod-part2");
let curve1=document.querySelector("#curve-part1");
let curve2=document.querySelector("#curve-part2");
let status1=document.querySelector("#on-off1");
let status2=document.querySelector("#on-off2");
let prev1=document.querySelector("#prev1");
let prev2=document.querySelector("#prev2");
let choose1=document.querySelector("#choose-color1");
let choose2=document.querySelector("#choose-color2");
let next1=document.querySelector("#next1");
let next2=document.querySelector("#next2");
let isBulbOn1=false;
let isBulbOn2=false;
let cnt1=0,cnt2=0;
let btns1=[prev1,choose1,next1];
let btns2=[prev2,choose2,next2];
function disableButton(btns) {
  btns.forEach((btn)=>{
    btn.disabled=true;
    btn.classList.add("inactive");
    btn.classList.remove("hoverbtn");
  });
}
function setBulbOn(cnt){
  
}
function enableButton(btns){
  btns.forEach((btn)=>{
    btn.disabled=false;
    btn.classList.remove("inactive");
    btn.classList.add("hoverbtn");
  });
}
function setBulbOn(choose,cnt,rod,curve){
  if(cnt%8==0){
    rod.style.backgroundColor="red";
    rod.style.boxShadow="20px 20px 250px 80px red";
    curve.style.backgroundColor="red";
    curve.style.boxShadow="20px 20px 250px 80px red";
    choose.innerText="Red";
  }
  else if(cnt%8==1){
    rod.style.backgroundColor="blue";
    rod.style.boxShadow="20px 20px 250px 80px blue";
    curve.style.backgroundColor="blue";
    curve.style.boxShadow="20px 20px 250px 80px blue";
    choose.innerText="Blue";
  }
  else if(cnt%8==2){
    rod.style.backgroundColor="yellow";
    rod.style.boxShadow="20px 20px 250px 80px yellow";
    curve.style.backgroundColor="yellow";
    curve.style.boxShadow="20px 20px 250px 80px yellow";
    choose.innerText="Yellow";
  }
  else if(cnt%8==3){
    rod.style.backgroundColor="green";
    rod.style.boxShadow="20px 20px 250px 80px green";
    curve.style.backgroundColor="green";
    curve.style.boxShadow="20px 20px 250px 80px green";
    choose.innerText="Green";
  }
  else if(cnt%8==4){
    rod.style.backgroundColor="pink";
    rod.style.boxShadow="20px 20px 250px 80px pink";
    curve.style.backgroundColor="pink";
    curve.style.boxShadow="20px 20px 250px 80px pink";
    choose.innerText="Pink";
  }
  else if(cnt%8==5){
    rod.style.backgroundColor="orange";
    rod.style.boxShadow="20px 20px 250px 80px orange";
    curve.style.backgroundColor="orange";
    curve.style.boxShadow="20px 20px 250px 80px orange";
    choose.innerText="Orange";
  }
  else if(cnt%8==6){
    rod.style.backgroundColor="purple";
    rod.style.boxShadow="20px 20px 250px 80px purple";
    curve.style.backgroundColor="purple";
    curve.style.boxShadow="20px 20px 250px 80px purple";
    choose.innerText="Purple";
  }
  else{
    rod.style.backgroundColor="brown";
    rod.style.boxShadow="20px 20px 250px 80px brown";
    curve.style.backgroundColor="brown";
    curve.style.boxShadow="20px 20px 250px 80px brown";
    choose.innerText="Brown";
  }
}
disableButton(btns1);
disableButton(btns2)
status1.addEventListener("click",()=>{
  if(isBulbOn1){
    status1.innerText="Turn ON";
    disableButton(btns1);
    rod1.style.backgroundColor="";
    curve1.style.backgroundColor="";
    rod1.style.boxShadow="";
    curve1.style.boxShadow="";
    choose1.innerText="Disabled";
  }
  else{
    status1.innerText="Turn OFF";
    enableButton(btns1);
    setBulbOn(choose1,cnt1,rod1,curve1);
    choose1.innerText="Choose Color";
  }
  isBulbOn1=!isBulbOn1;
});
status2.addEventListener("click",()=>{
  if(isBulbOn2){
    status2.innerText="Turn ON";
    disableButton(btns2);
    rod2.style.backgroundColor="";
    curve2.style.backgroundColor="";
    rod2.style.boxShadow="";
    curve2.style.boxShadow="";
    choose2.innerText="Disabled";
  }
  else{
    status2.innerText="Turn OFF";
    enableButton(btns2);
    setBulbOn(choose2,cnt2,rod2,curve2);
    choose2.innerText="Choose Color"
  }
  isBulbOn2=!isBulbOn2;
});
prev1.addEventListener("click",()=>{
  if(cnt1==0)
    cnt1=8;
  cnt1--;
  setBulbOn(choose1,cnt1,rod1,curve1);
});
prev2.addEventListener("click",()=>{
  if(cnt2==0)
    cnt2=8;
  cnt2--;
  setBulbOn(choose2,cnt2,rod2,curve2);
});
next1.addEventListener("click",()=>{
  cnt1++;
  setBulbOn(choose1,cnt1,rod1,curve1);
});
next2.addEventListener("click",()=>{
  cnt2++;
  setBulbOn(choose2,cnt2,rod2,curve2);
});
let isOne=false;
choose1.addEventListener("click",()=>{
  PopUp.style.display="";
  isOne=true;
});
choose2.addEventListener("click",()=>{
  PopUp.style.display="";
  isOne=false;
});
colors.forEach((color,idx)=>{
  color.addEventListener("click",()=>{
    if(isOne){
      cnt1=idx;
      setBulbOn(choose1,idx,rod1,curve1);
    }
    else{
      cnt2=idx;
      setBulbOn(choose2,idx,rod2,curve2);
    }
    PopUp.style.display="none";
  });
});