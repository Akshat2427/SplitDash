import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-6  py-4 bg-transparent ">
      {/* Logo */}
      <div className="flex items-center">
        {/* <img 
          src="lgo.png" // Replace 'logo.png' with your logo file path
          alt="Logo" 
          className="h-10 w-36 mr-2" 
        /> */}
        <h1 className='font-righteous text-5xl text-white'>SplitDash</h1>
      </div>

      {/* Features in the center */}
    

      {/* Login Button */}
      <button className="px-7 py-3 font-bold text-xl bg-white text-purple-500 rounded-lg  hover:bg-purple-800">
      <NavLink to="/register">Login</NavLink>
      </button>
    </nav>
  );
};

export default Navbar;
