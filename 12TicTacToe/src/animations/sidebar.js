import gsap from "gsap";



export function animateSidebar(isOpen){

  if(isOpen){
    gsap.to('#modeBox',{
      x:'0',
      duration:1,
    });
  }else{
    gsap.to('#modeBox',{
      x:'-65vw',
      duration:1,
    });
  }
}

export function animateFirst(){
  gsap.from('#modeBox',{
    x:'-60vw',
    duration:1,
  });
}