import React from "react";
interface CircularProgressProps {
    percentage: number;
    color: string;
    amount: number;
  }
  
  const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, color , amount }) => {
    const strokeWidth = 8;
    const radius = 50; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center justify-center relative">
        <svg
          className="w-56 h-56"
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="gray"
            strokeWidth={strokeWidth}
            className="opacity-20"
          />
          {/* Progress Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        {/* Text Inside Circle */}
        <div className="absolute text-center">
          <p className="text-lg font-bold" style={{ color }}>{`${percentage}%`}</p>
          <p className="text-sm font-semibold text-gray-700">Amount: {amount}</p>
        </div>
      </div>
    );
  };
  
    export default CircularProgress;