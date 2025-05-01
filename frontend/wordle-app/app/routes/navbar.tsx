import { Link, Outlet } from "react-router";
import { animate, createDraggable, createScope, JSAnimation, Scope } from 'animejs';
import { useEffect, useRef } from "react";

// this will just be put in the root of our react router application bg-[#7ab25b]
export default function Navbar() {
  const root = useRef(null);
  const logoRef = useRef(null);

   // ref for animations
   const animationRef = useRef<JSAnimation | null>(null);
  
  return (
    <div ref={root}>
      <div className="navbar h-16 flex flex-row pl-10 items-center bg-black gap-10 p-5">
        {/* Your navbar links here */}
        <img ref={logoRef} className="logo rustle h-10 w-10" src="/letter-r.png"></img>
        <div>
          <Link className="navbar__link text text-white" to="/login">Login</Link>
        </div>
        <div>
          <Link className="navbar__home text text-white" to="/">Home</Link>
        </div>
      </div>
    </div>
  );
}