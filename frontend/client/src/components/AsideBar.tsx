import React from "react";
import { NavLink } from "react-router-dom";

interface Props {}

function Aside(props: Props) {
  return (
    <aside className="w-[13vw] bg-black text-white p-6">
      <div className="fixed">
        {/* Logo/Title */}
        <h2 className="text-2xl font-bold mb-8 text-blue-400">SplitDash</h2>

        {/* Navigation Links */}
        <ul className="space-y-6">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `font-semibold ${
                  isActive ? "text-blue-300" : "text-blue-100"
                } hover:text-gray-300`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `font-semibold ${
                  isActive ? "text-blue-300" : "text-blue-100"
                } hover:text-gray-300`
              }
            >
              Profile
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/reminder"
              className={({ isActive }) =>
                `font-semibold ${
                  isActive ? "text-blue-300" : "text-blue-100"
                } hover:text-gray-300`
              }
            >
              Reminder 
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `font-semibold ${
                  isActive ? "text-blue-300" : "text-blue-100"
                } hover:text-gray-300`
              }
            >
              History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/addData"
              className={({ isActive }) =>
                `font-semibold ${
                  isActive ? "text-blue-300" : "text-blue-100"
                } hover:text-gray-300`
              }
            >
              Add Data
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Aside;
