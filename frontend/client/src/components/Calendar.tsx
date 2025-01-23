import React, { useState } from 'react';
import { FaPencilAlt, FaBell } from 'react-icons/fa';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isGreaterThanToday = (day: number) => {
    const today = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Compare only for future days or if the month/year is in the future
    if (
      today.getFullYear() > currentYear ||
      (today.getFullYear() === currentYear && today.getMonth() > currentMonth) ||
      (today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() >= day)
    ) {
      return false;
    }

    return true;
  };

  const getDaysInMonth = () => {
    const days: (number | null)[] = [];
    const leadingSpaces = startOfMonth.getDay();

    for (let i = 0; i < leadingSpaces; i++) {
      days.push(null);
    }

    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth();

  return (
    <div className="mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-blue-500 text-white rounded">
          Prev
        </button>
        <h1 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h1>
        <button onClick={nextMonth} className="px-3 py-1 bg-blue-500 text-white rounded">
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-bold text-gray-600 h-[5vh]">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`relative group p-4 border rounded text-lg ${
                day && new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth()
                  ? 'bg-blue-300 text-white'
                  : 'bg-gray-100'
              } hover:bg-gray-200 transition duration-300`}
          >
            {day || ''}

            {/* Blurred Background on Hover */}
            {day && (
              <div className="absolute inset-0 bg-gray-300 opacity-0 group-hover:backdrop-blur-md group-hover:bg-opacity-50 group-hover:opacity-100 transition duration-300"></div>
            )}

            {/* Pencil or Bell Icon on Hover */}
            {day && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                {isGreaterThanToday(day) ? (
                  <FaBell className="text-blue-500 text-2xl cursor-pointer" />
                ) : (
                  <FaPencilAlt className="text-blue-500 text-2xl cursor-pointer" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
