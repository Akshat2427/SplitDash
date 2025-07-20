import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaHistory, FaPlus, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";

interface Props {}

function Aside(props: Props) {
  const user = useSelector((state: any) => state.user);
  return (
    <aside className="w-[13vw] text-blue-500 p-6">
      <div className="fixed flex flex-col items-center">
        {/* Profile Image and Name */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={user.photo} // Replace with the actual image path from user store
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-md transition-transform duration-300 hover:scale-110 hover:ring-4 hover:ring-blue-500"
          />
        </div>

        {/* Navigation Links */}
        <ul className="space-y-6 w-full">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `font-semibold flex items-center px-4 py-2 rounded-md ${
                  isActive ? "bg-blue-500 text-white" : "text-blue-500"
                } hover:bg-blue-500 hover:text-white transition-all duration-300`
              }
            >
              <FaTachometerAlt className="mr-2" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `font-semibold flex items-center px-4 py-2 rounded-md ${
                  isActive ? "bg-blue-500 text-white" : "text-blue-500"
                } hover:bg-blue-500 hover:text-white transition-all duration-300`
              }
            >
              <FaUser className="mr-2" /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `font-semibold flex items-center px-4 py-2 rounded-md ${
                  isActive ? "bg-blue-500 text-white" : "text-blue-500"
                } hover:bg-blue-500 hover:text-white transition-all duration-300`
              }
            >
              <FaHistory className="mr-2" /> History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/addData"
              className={({ isActive }) =>
                `font-semibold flex items-center px-4 py-2 rounded-md ${
                  isActive ? "bg-blue-500 text-white" : "text-blue-500"
                } hover:bg-blue-500 hover:text-white transition-all duration-300`
              }
            >
              <FaPlus className="mr-2" /> Add Data
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/partner"
              className={({ isActive }) =>
                `font-semibold flex items-center px-4 py-2 rounded-md ${
                  isActive ? "bg-blue-500 text-white" : "text-blue-500"
                } hover:bg-blue-500 hover:text-white transition-all duration-300`
              }
            >
              <FaHeart className="mr-2" /> Partner
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Aside;
