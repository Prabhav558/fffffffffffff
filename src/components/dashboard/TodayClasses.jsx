// src/components/dashboard/TodayClasses.jsx
import { FiMapPin, FiClock } from 'react-icons/fi';

const TodayClasses = ({ todayClasses }) => {
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
      <div className="p-4 text-center">
        <div className="text-gray-700 font-medium mb-1">No classes today</div>
        <div className="text-gray-500 text-sm">
          {todayClasses.event && todayClasses.event !== "No event" 
            ? todayClasses.event 
            : "It's a holiday or weekend"}
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

  // Determine current class
  const currentClass = determineCurrentClass(sortedClasses);

  return (
    <div>
      <div className="mb-3 bg-gray-50 px-3 py-2 rounded-md">
        <div className="text-sm">
          <span className="text-gray-500 mr-2">Day Order:</span>
          <span className="font-medium">{todayClasses.dayOrder}</span>
        </div>
        {todayClasses.event && todayClasses.event !== "No event" && (
          <div className="text-xs text-primary-600 mt-1">
            {todayClasses.event}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sortedClasses.map((classItem, index) => (
          <div 
            key={index}
            className={`p-3 rounded-md border-l-4 ${
              currentClass === index
                ? 'bg-primary-50 border-primary-500'
                : 'bg-white border-gray-200'
            }`}
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
              <div className={`text-sm font-medium ${
                currentClass === index ? 'text-primary-600' : 'text-gray-700'
              }`}>
                {classItem.startTime} - {classItem.endTime}
              </div>
            </div>
            
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <div className="flex items-center mr-3">
                <FiMapPin className="mr-1" />
                <span>{classItem.roomNo || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1" />
                <span>{getClassDuration(classItem.startTime, classItem.endTime)}</span>
              </div>
            </div>
          </div>
        ))}
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
  return `${durationInMinutes} mins`;
};

export default TodayClasses;