// src/components/attendance/AttendancePredictor.jsx
import { useState, useEffect } from 'react';
import { FiArrowRight, FiCheck, FiX } from 'react-icons/fi';

const AttendancePredictor = ({ attendance }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [scenario, setScenario] = useState('present'); // 'present' or 'absent'
  const [numClasses, setNumClasses] = useState(5);
  const [prediction, setPrediction] = useState(null);
  const [courseData, setCourseData] = useState(null);

  // Reset prediction when course changes
  useEffect(() => {
    setPrediction(null);
    if (selectedCourse && attendance) {
      const course = attendance.find(c => c.courseCode === selectedCourse);
      if (course) {
        setCourseData(course);
      }
    } else {
      setCourseData(null);
    }
  }, [selectedCourse, attendance]);

  const handlePrediction = () => {
    if (!courseData) return;
    
    const conducted = parseInt(courseData.hoursConducted);
    const absent = parseInt(courseData.hoursAbsent);
    const present = conducted - absent;
    
    let newConducted = conducted + numClasses;
    let newPresent = present;
    
    if (scenario === 'present') {
      newPresent += numClasses;
    } 
    // No need for newAbsent variable at all since we're calculating with present count
    
    const currentPercentage = parseFloat(courseData.attendancePercentage);
    const newPercentage = (newPresent / newConducted) * 100;
    
    setPrediction({
      course: courseData.courseTitle,
      currentPercentage,
      newPercentage,
      change: newPercentage - currentPercentage,
      isBetter: newPercentage > currentPercentage,
      isAbove75: newPercentage >= 75,
      scenario,
      numClasses,
    });
  };

  // Calculate classes needed to reach 75%
  const calculateClassesNeeded = () => {
    if (!courseData) return { needed: 0, possible: true };
    
    const conducted = parseInt(courseData.hoursConducted);
    const absent = parseInt(courseData.hoursAbsent);
    const present = conducted - absent;
    
    // Formula: (present + x) / (conducted + x) >= 0.75
    // x = (0.75 * conducted - present) / 0.25
    const classesNeeded = Math.ceil((0.75 * conducted - present) / 0.25);
    
    // Check if it's mathematically possible to reach 75%
    // If absent/conducted > 0.25, then no matter how many classes attended in future,
    // cannot reach 75% without some absences being revoked
    const possible = absent / conducted <= 0.25;
    
    return { needed: Math.max(0, classesNeeded), possible };
  };

  if (!attendance || attendance.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        No attendance data available for prediction
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Use this tool to predict how your attendance percentage will change based on your future attendance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {/* Course Selection */}
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input"
              >
                <option value="">-- Select a course --</option>
                {attendance.map((course) => (
                  <option key={course.courseCode} value={course.courseCode}>
                    {course.courseTitle} ({parseFloat(course.attendancePercentage).toFixed(1)}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Scenario Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I will be...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setScenario('present')}
                  className={`flex items-center justify-center p-4 rounded-md border ${
                    scenario === 'present'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiCheck className={`mr-2 ${scenario === 'present' ? 'text-green-500' : ''}`} />
                  <span>Present in classes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScenario('absent')}
                  className={`flex items-center justify-center p-4 rounded-md border ${
                    scenario === 'absent'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FiX className={`mr-2 ${scenario === 'absent' ? 'text-red-500' : ''}`} />
                  <span>Absent in classes</span>
                </button>
              </div>
            </div>

            {/* Number of Classes */}
            <div>
              <label htmlFor="numClasses" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Classes
              </label>
              <input
                id="numClasses"
                type="number"
                min="1"
                max="50"
                value={numClasses}
                onChange={(e) => setNumClasses(parseInt(e.target.value) || 1)}
                className="input"
              />
            </div>

            {/* Calculate Button */}
            <div>
              <button
                onClick={handlePrediction}
                disabled={!selectedCourse}
                className={`btn btn-primary w-full ${!selectedCourse ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Calculate Prediction
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-3">Results</h3>
          
          {courseData && (
            <div className="mb-4">
              <div className="text-sm text-gray-500">Current Attendance</div>
              <div className={`text-xl font-bold ${
                parseFloat(courseData.attendancePercentage) >= 75
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {parseFloat(courseData.attendancePercentage).toFixed(1)}%
              </div>
              
              <div className="mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Classes Conducted:</span>
                  <span className="float-right font-medium">{courseData.hoursConducted}</span>
                </div>
                <div>
                  <span className="text-gray-500">Classes Attended:</span>
                  <span className="float-right font-medium">
                    {parseInt(courseData.hoursConducted) - parseInt(courseData.hoursAbsent)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Classes Missed:</span>
                  <span className="float-right font-medium">{courseData.hoursAbsent}</span>
                </div>
              </div>
              
              {parseFloat(courseData.attendancePercentage) < 75 && (
                <div className="mt-3 text-sm">
                  <div className="font-medium text-primary-600">To reach 75%:</div>
                  {calculateClassesNeeded().possible ? (
                    <div>
                      You need to attend <span className="font-bold">{calculateClassesNeeded().needed}</span> consecutive classes.
                    </div>
                  ) : (
                    <div className="text-red-600">
                      It's not mathematically possible to reach 75% with future attendance alone.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {prediction && (
            <div className="border-t border-gray-200 pt-3">
              <div className="text-sm text-gray-500">Predicted Attendance</div>
              <div className={`text-xl font-bold ${
                prediction.isAbove75 ? 'text-green-600' : 'text-red-600'
              }`}>
                {prediction.newPercentage.toFixed(1)}%
              </div>
              
              <div className={`mt-2 text-sm ${
                prediction.isBetter ? 'text-green-600' : 'text-red-600'
              }`}>
                {prediction.isBetter ? '↑' : '↓'} {Math.abs(prediction.change).toFixed(1)}% change
              </div>
              
              <div className="mt-3 bg-gray-100 p-2 rounded text-sm">
                {prediction.scenario === 'present' ? (
                  <div>
                    If you attend the next <span className="font-bold">{prediction.numClasses}</span> classes,
                    your attendance will {prediction.isAbove75 ? 'reach' : 'still be below'} the required 75%.
                  </div>
                ) : (
                  <div>
                    If you miss the next <span className="font-bold">{prediction.numClasses}</span> classes,
                    your attendance will {prediction.isAbove75 ? 'still be above' : 'fall below'} the required 75%.
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!courseData && (
            <div className="text-sm text-gray-500 text-center p-4">
              Select a course to see prediction results
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePredictor;