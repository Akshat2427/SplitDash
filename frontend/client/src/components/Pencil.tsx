import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const HoverPencil: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative group w-64 h-64 bg-gray-300 rounded-lg overflow-hidden shadow-md">
        {/* The blurred background effect */}
        <div className="absolute inset-0 bg-gray-400 group-hover:backdrop-blur-md group-hover:bg-opacity-50 transition duration-300"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-bold text-lg">
          Hover Over Me
        </div>

        {/* Pencil Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <FaPencilAlt className="text-white text-4xl" />
        </div>
      </div>
    </div>
  );
};

export default HoverPencil;
