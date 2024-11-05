import React from 'react';
import { animateFirst, animateSidebar } from '../animations/sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/ticTacToeSlice';
import gsap from 'gsap';

function Menu() {

  const isOpen = useSelector(state=>state.sidebar);
  const dispatch = useDispatch();

  const image=isOpen?"https://w7.pngwing.com/pngs/70/87/png-transparent-round-red-and-white-x-mark-screenshot-area-trademark-symbol-brand-sign-error-trademark-logo-desktop-wallpaper.png":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpLFuD0AgwhNdgUstKmQ1kVeuQ0xlqOXESFg&s";

  React.useEffect(()=>{
    animateFirst();
  },[]);

  React.useEffect(()=>{
    animateSidebar(isOpen);
  },[isOpen]);

  return (
    <>
      <button 
       onClick={()=>dispatch(toggleSidebar())}
       className='h-10 w-10 fixed top-5 left-5 z-20 border-2 border-black active:shadow-inner shadow-black'>
        <img src={image} />
      </button>
    </>
  )
}

export default Menu