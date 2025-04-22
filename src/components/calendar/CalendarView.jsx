import React from 'react';

const CalendarView = ({ month, today, selectedDay, onSelectDay }) => {
  if (!month || !month.days || month.days.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No calendar data available
      </div>
    );
  }

  // Calculate days in week grid
  const getDaysGrid = () => {
    // Validate month and days
    if (!month || !month.days || month.days.length === 0) {
      return [];
    }
    
    const days = [...month.days];
    
    // Find first day of month
    const firstDay = days[0];
    if (!firstDay || !firstDay.day) {
      console.error('Invalid first day data:', firstDay);
      return [];
    }
    
    const firstDayOfWeek = getDayIndex(firstDay.day);
    if (isNaN(firstDayOfWeek) || firstDayOfWeek < 0) {
      console.error('Invalid first day of week:', firstDayOfWeek);
      return [];
    }
    
    // Initialize grid with empty cells for days before the first day
    const grid = Array(firstDayOfWeek).fill(null);
    
    // Add actual days
    grid.push(...days);
    
    // Fill remaining cells to complete weeks
    const totalCells = grid.length;
    const completeWeeks = Math.ceil(totalCells / 7) * 7;
    const remainingCells = completeWeeks - totalCells;
    
    for (let i = 0; i < remainingCells; i++) {
      grid.push(null);
    }
    
    return grid;
  };
  // Convert day name to index (0 = Sunday, 1 = Monday, etc.)
  const getDayIndex = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(dayName);
  };
  
  // Check if a day is today
  const isToday = (day) => {
    if (!today || !day) return false;
    return day.date === today.date && day.day === today.day;
  };
  
  // Check if a day is selected
  const isSelected = (day) => {
    if (!selectedDay || !day) return false;
    return day.date === selectedDay.date && day.day === selectedDay.day;
  };
  
  // Get CSS class for day cell
  const getDayClass = (day) => {
    if (!day) return 'bg-gray-50';
    
    let className = 'cursor-pointer hover:bg-gray-100';
    
    // Today's styling
    if (isToday(day)) {
      className += ' bg-primary-50 border border-primary-500';
    }
    
    // Selected day styling
    if (isSelected(day)) {
      className += ' bg-primary-100 border border-primary-600';
    }
    
    // Day with event styling
    if (day.event && day.event !== 'No event') {
      className += ' bg-secondary-50';
    }
    
    return className;
  };
  
  const daysGrid = getDaysGrid();
  
  return (
    <div>
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 text-center text-xs font-semibold text-gray-700">
        <div className="bg-white py-2">Sun</div>
        <div className="bg-white py-2">Mon</div>
        <div className="bg-white py-2">Tue</div>
        <div className="bg-white py-2">Wed</div>
        <div className="bg-white py-2">Thu</div>
        <div className="bg-white py-2">Fri</div>
        <div className="bg-white py-2">Sat</div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysGrid.map((day, index) => (
          <div 
            key={index} 
            className={`bg-white aspect-square min-h-[80px] p-1 ${getDayClass(day)}`}
            onClick={() => day && onSelectDay(day)}
          >
            {day ? (
              <div className="h-full">
                <div className="flex justify-between">
                  <span 
                    className={`inline-block h-6 w-6 rounded-full text-center text-sm font-medium leading-6 ${
                      isToday(day) ? 'bg-primary-500 text-white' : ''
                    }`}
                  >
                    {day.date}
                  </span>
                  
                  {day.dayOrder && (
                    <span className="text-xs px-1 rounded bg-blue-100 text-blue-800">
                      {day.dayOrder}
                    </span>
                  )}
                </div>
                
                {day.event && day.event !== 'No event' && (
                  <div className="mt-1 overflow-hidden text-xs">
                    <div className="truncate text-secondary-600">
                      {day.event}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary-500 mr-1"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-blue-100 mr-1"></div>
          <span>Day Order</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded bg-secondary-50 mr-1"></div>
          <span>Event</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;