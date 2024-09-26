import { useState,useEffect } from "react";

function useCurrencyInfo(currency){
  const [data,setData]=useState([])
  useEffect(()=>{
    let fetchDa = async ()=>{
      let promise=await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
      let d=await promise.json();
      setData(d[currency]);
    }
    fetchDa()
  },[currency])
  return data;
}
export default useCurrencyInfo