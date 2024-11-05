
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Nav = ({ onlogout }) => {
  return (
    <nav className="bg-violet-400 p-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-semibold">
        WeatherApp
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onlogout}
              className="text-white hover:bg-gray-300 transition-colors"
            >
              <FaUserCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

