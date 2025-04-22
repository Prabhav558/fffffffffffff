// src/components/attendance/AttendanceCard.jsx
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const AttendanceCard = ({ course }) => {
  const attendancePercentage = parseFloat(course.attendancePercentage);
  const isSafe = attendancePercentage >= 75;
  
  // Calculate classes that can be missed while still maintaining 75%
  const calculateAllowedAbsences = () => {
    const totalClasses = parseInt(course.hoursConducted);
    const presentClasses = totalClasses - parseInt(course.hoursAbsent);
    
    // Formula: (present_classes) / (total_classes + future_classes) >= 0.75
    // Solving for future_classes (max classes that can be missed)
    const maxMissable = Math.floor((presentClasses / 0.75) - totalClasses);
    
    return Math.max(0, maxMissable);
  };
  
  // Calculate classes needed to attend to reach 75%
  const calculateClassesNeeded = () => {
    const totalClasses = parseInt(course.hoursConducted);
    const presentClasses = totalClasses - parseInt(course.hoursAbsent);
    
    // Formula: (present_classes + needed_classes) / (total_classes + needed_classes) >= 0.75
    // Solving for needed_classes
    const classesNeeded = Math.ceil((0.75 * totalClasses - presentClasses) / 0.25);
    
    return Math.max(0, classesNeeded);
  };

  return (
    <div className={`card ${isSafe ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg truncate" title={course.courseTitle}>
            {course.courseTitle}
          </h3>
          <p className="text-gray-500 text-sm">
            {course.courseCode} - {course.category}
          </p>
        </div>
        <span className={`text-lg font-bold ${isSafe ? 'text-green-600' : 'text-red-600'}`}>
          {attendancePercentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${isSafe ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(100, attendancePercentage)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <span className="text-gray-600">Conducted:</span>
          <span className="float-right font-medium">{course.hoursConducted}</span>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <span className="text-gray-600">Present:</span>
          <span className="float-right font-medium">
            {parseInt(course.hoursConducted) - parseInt(course.hoursAbsent)}
          </span>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <span className="text-gray-600">Absent:</span>
          <span className="float-right font-medium">{course.hoursAbsent}</span>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <span className="text-gray-600">Faculty:</span>
          <span className="float-right font-medium">{course.facultyName.split(',')[0]}</span>
        </div>
      </div>
      
      <div className={`mt-4 p-3 rounded-md text-sm ${
        isSafe ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}>
        {isSafe ? (
          <div className="flex items-start">
            <FiCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p>Your attendance is good. You can miss up to <strong>{calculateAllowedAbsences()}</strong> more classes and still maintain 75% attendance.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start">
            <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p>You need to attend <strong>{calculateClassesNeeded()}</strong> more consecutive classes to reach 75% attendance.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCard;