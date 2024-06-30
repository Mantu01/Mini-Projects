const form=document.querySelector("form");
const result=document.querySelector("#result");
function notValid(n) {
  return n<=0 || n==="" || Number.isNaN(n);
}
form.addEventListener("submit",(e)=>{
  e.preventDefault();
  const w=parseFloat(document.querySelector("#weight").value);
  const h=parseFloat(document.querySelector("#height").value);
  const bmi=w/(h*h);
  if(notValid(w) && notValid(h))
    result.innerText="Please!, enter valid height and weight.";
  else if(notValid(h))
    result.innerText="Please!, enter valid height.";
  else if(notValid(w))
    result.innerText="Please!, enter valid weight.";
  else
    result.innerText=`${bmi.toFixed(2)}`;
});