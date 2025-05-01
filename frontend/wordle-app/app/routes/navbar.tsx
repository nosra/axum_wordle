import { Link, Outlet } from "react-router";

// this will just be put in the root of our react router application bg-[#7ab25b]
export default function Navbar() {
  return (
    <div>
      <div className="navbar h-16 flex flex-row pl-10 items-center bg-black gap-10 p-5">
        {/* Your navbar links here */}
        <img className="h-10 w-10" src="/letter-r.png"></img>
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