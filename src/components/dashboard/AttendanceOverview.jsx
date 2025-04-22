// src/components/dashboard/AttendanceOverview.jsx
import { useMemo } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const AttendanceOverview = ({ attendance }) => {
  // Calculate overall attendance
  const overallAttendance = useMemo(() => {
    if (!attendance?.attendance || attendance.attendance.length === 0) return 0;
    
    const total = attendance.attendance.reduce((sum, course) => {
      const conductedNum = parseFloat(course.hoursConducted) || 0;
      const absentNum = parseFloat(course.hoursAbsent) || 0;
      const presentHours = conductedNum - absentNum;
      
      return {
        conducted: sum.conducted + conductedNum,
        present: sum.present + presentHours,
      };
    }, { conducted: 0, present: 0 });
    
    return total.conducted > 0 ? (total.present / total.conducted) * 100 : 0;
  }, [attendance]);

  // Sort courses by attendance percentage (lowest first)
  const sortedCourses = useMemo(() => {
    if (!attendance?.attendance) return [];
    
    return [...attendance.attendance]
      .sort((a, b) => parseFloat(a.attendancePercentage) - parseFloat(b.attendancePercentage))
      .slice(0, 4); // Show only 4 courses
  }, [attendance]);

  if (!attendance || !attendance.attendance) {
    return (
      <div className="p-4 text-center text-gray-500">
        No attendance data available
      </div>
    );
  }

  return (
    <div>
      {/* Overall Attendance */}
      <div className="mb-4 flex justify-center">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-32 h-32">
            {/* Background circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
              strokeDasharray="100, 100"
            />
            {/* Progress circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={overallAttendance >= 75 ? "#10b981" : "#ef4444"}
              strokeWidth="3"
              strokeDasharray={`${overallAttendance}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold">{overallAttendance.toFixed(1)}%</span>
            <span className="text-xs text-gray-500">Overall</span>
          </div>
        </div>
      </div>

      {/* Status message */}
      <div className={`text-center mb-4 p-2 rounded-md ${
        overallAttendance >= 75 
          ? 'bg-green-50 text-green-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        {overallAttendance >= 75 ? (
          <div className="flex items-center justify-center">
            <FiCheckCircle className="mr-1" />
            <span>You're meeting the attendance requirement!</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <FiAlertCircle className="mr-1" />
            <span>Your attendance is below the required 75%</span>
          </div>
        )}
      </div>

      {/* Individual courses */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Courses Requiring Attention:</h3>
        
        {sortedCourses.length > 0 ? (
          sortedCourses.map((course) => (
            <div key={course.courseCode} className="flex items-center">
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium truncate" title={course.courseTitle}>
                    {course.courseTitle}
                  </span>
                  <span className={parseFloat(course.attendancePercentage) >= 75 ? 'text-green-600' : 'text-red-600'}>
                    {parseFloat(course.attendancePercentage).toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      parseFloat(course.attendancePercentage) >= 75 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${course.attendancePercentage}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  Present: {parseInt(course.hoursConducted) - parseInt(course.hoursAbsent)}/{course.hoursConducted} hours
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No course data available</div>
        )}
      </div>
    </div>
  );
};

export default AttendanceOverview;