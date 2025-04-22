// src/components/dashboard/UpcomingClasses.jsx
import { FiMapPin, FiClock } from 'react-icons/fi';

const UpcomingClasses = ({ upcomingClasses }) => {
  if (!upcomingClasses) {
    return (
      <div className="p-4 text-center text-gray-500">
        No upcoming class data available
      </div>
    );
  }

  if (upcomingClasses.error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading upcoming classes: {upcomingClasses.message}
      </div>
    );
  }

  // Check if there are any upcoming classes
  const hasUpcomingClasses = Object.values(upcomingClasses.upcomingClasses || {})
    .some(classes => classes && classes.length > 0);

  if (!hasUpcomingClasses) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-700 font-medium mb-1">No upcoming classes</div>
        <div className="text-gray-500 text-sm">You're done for the day!</div>
      </div>
    );
  }

  // Find the nearest upcoming class segment
  const nearestUpcoming = findNearestUpcoming(upcomingClasses.upcomingClasses);
  
  if (!nearestUpcoming) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-700 font-medium mb-1">No upcoming classes</div>
        <div className="text-gray-500 text-sm">You're done for the day!</div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-50 px-3 py-2 rounded-md mb-3">
        <div className="text-sm flex justify-between">
          <span>
            <span className="text-gray-500 mr-2">Current Time:</span>
            <span className="font-medium">{upcomingClasses.currentTime || 'N/A'}</span>
          </span>
          <span className="text-primary-600 font-medium">
            {nearestUpcoming.timeRange}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {nearestUpcoming.classes.map((classItem, index) => (
          <div 
            key={index}
            className="p-3 rounded-md border-l-4 border-secondary-500 bg-secondary-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {classItem.name}
                </h3>
                <div className="text-xs text-gray-500 mt-1">
                  {classItem.code} {classItem.slot && `(${classItem.slot})`}
                </div>
              </div>
              <div className="text-sm font-medium text-secondary-600">
                {classItem.startTime} - {classItem.endTime}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <div className="flex items-center mr-3">
                  <FiMapPin className="mr-1" />
                  <span>{classItem.roomNo || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>
                    {formatMinutesRemaining(classItem.minutesUntil)}
                  </span>
                </div>
              </div>
              
              <div className="text-xs bg-secondary-200 text-secondary-800 px-2 py-1 rounded-full">
                Starting soon
              </div>
            </div>
          </div>
        ))}
        
        {/* Show message about later classes if any */}
        {hasLaterClasses(upcomingClasses.upcomingClasses, nearestUpcoming.key) && (
          <div className="text-center text-sm text-gray-500 mt-2">
            More classes scheduled later today
          </div>
        )}
      </div>
    </div>
  );
};

// Find the nearest upcoming class segment (within 5min, 30min, etc.)
const findNearestUpcoming = (upcomingClasses) => {
  if (!upcomingClasses) return null;
  
  const timeRanges = {
    within5Min: "Within 5 minutes",
    within30Min: "Within 30 minutes",
    within1Hour: "Within 1 hour",
    within2Hours: "Within 2 hours",
    within3Hours: "Within 3 hours",
    within4Hours: "Within 4 hours",
    within5Hours: "Within 5 hours",
    within6Hours: "Within 6 hours",
    within7Hours: "Within 7 hours",
    within8Hours: "Within 8 hours",
    within9Hours: "Within 9 hours",
    within10Hours: "Within 10 hours",
  };
  
  for (const [key, label] of Object.entries(timeRanges)) {
    if (upcomingClasses[key] && upcomingClasses[key].length > 0) {
      return {
        key,
        timeRange: label,
        classes: upcomingClasses[key],
      };
    }
  }
  
  return null;
};

// Check if there are more classes later in the day
const hasLaterClasses = (upcomingClasses, currentKey) => {
  if (!upcomingClasses || !currentKey) return false;
  
  const timeRangeKeys = [
    "within5Min",
    "within30Min",
    "within1Hour",
    "within2Hours",
    "within3Hours",
    "within4Hours",
    "within5Hours",
    "within6Hours",
    "within7Hours",
    "within8Hours",
    "within9Hours",
    "within10Hours",
  ];
  
  const currentIndex = timeRangeKeys.indexOf(currentKey);
  if (currentIndex === -1 || currentIndex === timeRangeKeys.length - 1) return false;
  
  for (let i = currentIndex + 1; i < timeRangeKeys.length; i++) {
    const key = timeRangeKeys[i];
    if (upcomingClasses[key] && upcomingClasses[key].length > 0) {
      return true;
    }
  }
  
  return false;
};

// Format minutes remaining into a readable string
const formatMinutesRemaining = (minutes) => {
  if (!minutes && minutes !== 0) return 'N/A';
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
  }
  
  return `${hours}h ${remainingMinutes}m remaining`;
};

export default UpcomingClasses;