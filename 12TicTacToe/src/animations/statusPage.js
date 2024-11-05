import gsap from 'gsap';

export function animateStusPage(show){
 if(show){
  gsap.to('#winnerBox',{
    scale:0,
    duration:1
  });
 }else{
  gsap.to('#winnerBox',{
    scale:1,
    duration:1
  });
 }
}