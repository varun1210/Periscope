import { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

import { FaHouse } from "react-icons/fa6";
import { FaLaptop, FaSignOutAlt } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

import {
  AuthContext,
  AuthDispatchContext,
  UserContext,
} from "../utils/contexts";

export default function Navbar() {
  const authState = useContext(AuthContext);
  const dispatch = useContext(AuthDispatchContext);
  const { user } = useContext(UserContext);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownActive, setProfileDropdownActive] = useState(false);

  const baseLinkClasses =
    "text-white text-lg flex flex-row items-center transition-all duration-300 hover:text-green-100 hover:bg-green-600 hover:bg-opacity-30 px-2.5 py-2 rounded-lg font-medium";
  const activeLinkClasses =
    "font-bold text-green-100 bg-green-800 bg-opacity-80 shadow-lg";
  const dropdownButtonClasses =
    "text-white text-lg flex flex-row items-center transition-all duration-300 hover:text-green-100 hover:bg-green-600 hover:bg-opacity-30 px-2.5 py-2 rounded-lg font-medium";

  const toggleDropdown = () => {
    setProfileDropdownActive((currentValue) => !currentValue);
  };

  const handleLogout = () => {
    dispatch({ action: "LOGOUT" });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setProfileDropdownActive(false);
    }
  };

  useEffect(() => {
    if (profileDropdownActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownActive]);

  if (!authState.loggedIn) return <></>;

  if (!user) return <div>Loading Navbar...</div>;

  return (
    <nav className="bg-green-700 bg-gradient-to-l p-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div>
          <Link
            to="/home"
            className="text-white text-xl flex flex-row items-center"
          >
            PERISCOPE
          </Link>
        </div>
        <div className="flex space-x-6 items-center">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <FaHouse className="mr-1 text-sm" />
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
          >
            <FaLaptop className="mr-1 text-sm" />
            Jobs
          </NavLink>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className={dropdownButtonClasses}>
              <IoPerson className="mr-1 text-sm" />
              {user?.name}
            </button>

            {profileDropdownActive && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-green-900 hover:bg-green-100 transition-colors border-b border-gray-100 rounded-t-lg"
                  onClick={() => setProfileDropdownActive(false)}
                >
                  <IoPerson className="inline mr-2" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-green-900 hover:bg-green-100 transition-colors rounded-b-lg"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}