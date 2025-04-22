// src/components/calendar/DayOrderView.jsx
import React from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';

const DayOrderView = ({ day }) => {
  if (!day) {
    return (
      <div className="p-4 text-center text-gray-500">
        No day data available
      </div>
    );
  }

  const isWeekend = ['Sunday', 'Saturday'].includes(day.day);
  
  return (
    <div>
      <div className="mb-6">
        <div className="text-xl font-bold">{day.date}</div>
        <div className="text-gray-600">{day.day}</div>
      </div>
      
      <div className="space-y-4">
        {/* Day Order */}
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <FiClock className="text-primary-500" />
          </div>
          <div>
            <div className="font-medium text-gray-700">Day Order</div>
            {day.dayOrder ? (
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {day.dayOrder}
                </span>
              </div>
            ) : (
              <div className="text-gray-500 mt-1">
                {isWeekend ? "Weekend" : "No classes scheduled"}
              </div>
            )}
          </div>
        </div>
        
        {/* Event */}
        <div className="flex items-start">
          <div className="mr-3 mt-1">
            <FiCalendar className="text-secondary-500" />
          </div>
          <div>
            <div className="font-medium text-gray-700">Event</div>
            {day.event && day.event !== "No event" ? (
              <div className="mt-1 text-secondary-700">
                {day.event}
              </div>
            ) : (
              <div className="text-gray-500 mt-1">No events scheduled</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Classes Schedule Information */}
      {day.dayOrder && (
        <div className="mt-6 p-3 bg-gray-50 rounded-md">
          <div className="font-medium mb-2">Classes Schedule</div>
          <div className="text-sm text-gray-600">
            To view your class schedule for this day, check the{" "}
            <a 
              href="/timetable" 
              className="text-primary-600 hover:underline font-medium"
            >
              Timetable
            </a>{" "}
            section.
          </div>
        </div>
      )}
      
      {/* Check Attendance Button (if it's not a weekend/holiday) */}
      {day.dayOrder && (
        <div className="mt-4">
          <a 
            href="/attendance" 
            className="block w-full text-center btn btn-primary py-2"
          >
            Check Attendance
          </a>
        </div>
      )}
    </div>
  );
};

export default DayOrderView;