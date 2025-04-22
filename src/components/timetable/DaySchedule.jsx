// src/components/timetable/DaySchedule.jsx

import { FiMapPin, FiClock, FiCalendar } from 'react-icons/fi';

const DaySchedule = ({ todayClasses }) => {
  // Determine current class
  const currentClass = determineCurrentClass(todayClasses?.classes || []);

  if (!todayClasses) {
    return (
      <div className="p-4 text-center text-gray-500">
        No class data available
      </div>
    );
  }

  if (todayClasses.error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading classes: {todayClasses.message}
      </div>
    );
  }

  // Check if today is a holiday or weekend
  if (!todayClasses.dayOrder || todayClasses.classes.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-700 font-medium text-2xl mb-2">No classes today</div>
        <div className="text-gray-500 text-lg mb-4">
          {todayClasses.event && todayClasses.event !== "No event" 
            ? todayClasses.event 
            : "It's a holiday or weekend"}
        </div>
        
        <div className="flex justify-center items-center text-gray-500">
          <FiCalendar className="mr-2" />
          <span>{todayClasses.date} ({todayClasses.day})</span>
        </div>
      </div>
    );
  }

  // Sort classes by time
  const sortedClasses = [...todayClasses.classes].sort((a, b) => {
    const getTimeValue = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    
    return getTimeValue(a.startTime) - getTimeValue(b.startTime);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <FiCalendar className="mr-2 text-primary-500" />
          Today's Schedule
        </h2>
        
        <div className="flex items-center text-gray-700">
          <span className="mr-2">{todayClasses.date} ({todayClasses.day})</span>
          <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {todayClasses.dayOrder}
          </span>
        </div>
      </div>
      
      {todayClasses.event && todayClasses.event !== "No event" && (
        <div className="mb-6 bg-secondary-50 border-l-4 border-secondary-500 text-secondary-700 p-4 rounded-md">
          <div className="font-medium">Special Event</div>
          <div>{todayClasses.event}</div>
        </div>
      )}
      
      <div className="relative">
        {/* Timeline */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200"></div>
        
        <div className="space-y-8 relative">
          {sortedClasses.map((classItem, index) => (
            <div 
              key={index}
              className={`relative pl-12 ${
                currentClass === index ? 'animate-pulse' : ''
              }`}
            >
              {/* Timeline node */}
              <div 
                className={`absolute left-2 top-1.5 w-5 h-5 rounded-full ${
                  currentClass === index 
                    ? 'bg-primary-500 ring-4 ring-primary-100' 
                    : 'bg-gray-300'
                }`}
              ></div>
              
              <div 
                className={`${
                  currentClass === index 
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 bg-white'
                } rounded-lg border p-4 shadow-sm relative before:absolute before:w-3 before:h-3 before:rotate-45 before:left-[-6px] before:top-[10px] ${
                  currentClass === index 
                    ? 'before:bg-primary-50 before:border-l before:border-b before:border-primary-500'
                    : 'before:bg-white before:border-l before:border-b before:border-gray-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium text-lg">
                      {classItem.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {classItem.code} {classItem.slot && `(${classItem.slot})`}
                    </div>
                  </div>
                  
                  <div className={`mt-2 md:mt-0 ${
                    currentClass === index ? 'text-primary-600 font-bold' : 'text-gray-700'
                  }`}>
                    {classItem.startTime} - {classItem.endTime}
                    {currentClass === index && (
                      <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                        NOW
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiMapPin className="mr-1" />
                    <span>{classItem.roomNo || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>{getClassDuration(classItem.startTime, classItem.endTime)}</span>
                  </div>
                  
                  {classItem.courseType && (
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      classItem.courseType === 'Theory' 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {classItem.courseType}
                    </div>
                  )}
                  
                  {classItem.online && (
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Online
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to determine current class
const determineCurrentClass = (classes) => {
  if (!classes.length) return -1;
  
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;
  
  for (let i = 0; i < classes.length; i++) {
    const classItem = classes[i];
    
    const [startTime, startPeriod] = classItem.startTime.split(' ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let startTimeInMinutes = startHour * 60 + startMinute;
    if (startPeriod === 'PM' && startHour !== 12) startTimeInMinutes += 12 * 60;
    if (startPeriod === 'AM' && startHour === 12) startTimeInMinutes = startMinute;
    
    const [endTime, endPeriod] = classItem.endTime.split(' ');
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let endTimeInMinutes = endHour * 60 + endMinute;
    if (endPeriod === 'PM' && endHour !== 12) endTimeInMinutes += 12 * 60;
    if (endPeriod === 'AM' && endHour === 12) endTimeInMinutes = endMinute;
    
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return i;
    }
  }
  
  return -1;
};

// Helper function to calculate class duration
const getClassDuration = (startTime, endTime) => {
  const [startTimeValue, startPeriod] = startTime.split(' ');
  const [endTimeValue, endPeriod] = endTime.split(' ');
  
  const [startHour, startMinute] = startTimeValue.split(':').map(Number);
  const [endHour, endMinute] = endTimeValue.split(':').map(Number);
  
  let startTimeInMinutes = startHour * 60 + startMinute;
  if (startPeriod === 'PM' && startHour !== 12) startTimeInMinutes += 12 * 60;
  if (startPeriod === 'AM' && startHour === 12) startTimeInMinutes = startMinute;
  
  let endTimeInMinutes = endHour * 60 + endMinute;
  if (endPeriod === 'PM' && endHour !== 12) endTimeInMinutes += 12 * 60;
  if (endPeriod === 'AM' && endHour === 12) endTimeInMinutes = endMinute;
  
  const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} mins`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} mins`;
  }
};

export default DaySchedule;