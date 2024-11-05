
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCog, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Importing icons

const Sidebar = ({onlogout}) => {
  return (
    <div className="fixed top-0 left-0 h-full bg-violet-400 text-white z-40 w-52 md:w-64">
      <div className="flex flex-col justify-between items-start p-4 h-full">
        <nav className="flex-grow">
          <ul className="space-y-4 mt-20">
            <li>
              <Link to="/dashboard" className="flex items-center text-white p-2 rounded">
                <FaTachometerAlt className="mr-4" />
                <span>Dashboard</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/settings" className="flex items-center text-white p-2 rounded">
                <FaCog className="mr-4" />
                <span>Settings</span>
              </Link>
            </li> */}
            {/* <li>
              <Link to="/profile" className="flex items-center text-white p-2 rounded">
                <FaUserCircle className="mr-4" />
                <span>Profile</span>
              </Link>
            </li> */}
            <li>
              <Link to="/" onClick={onlogout} className="flex items-center text-white p-2 rounded">
                <FaSignOutAlt className="mr-4" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
