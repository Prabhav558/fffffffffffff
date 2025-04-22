// src/components/dashboard/MarksOverview.jsx
import { useMemo } from 'react';
import { FiFileText } from 'react-icons/fi';

const MarksOverview = ({ marks }) => {
  // Calculate overall percentage and stats
  const stats = useMemo(() => {
    if (!marks?.marks || marks.marks.length === 0) {
      return { 
        overallPercentage: 0, 
        totalScored: 0, 
        totalMax: 0,
        highestCourse: null,
        lowestCourse: null 
      };
    }
    
    let totalScored = 0;
    let totalMax = 0;
    let highest = { score: 0, course: null };
    let lowest = { score: 100, course: null };
    
    marks.marks.forEach(course => {
      const scored = parseFloat(course.overall.scored);
      const total = parseFloat(course.overall.total);
      
      if (isNaN(scored) || isNaN(total) || total === 0) return;
      
      totalScored += scored;
      totalMax += total;
      
      const percentage = (scored / total) * 100;
      
      if (percentage > highest.score) {
        highest = { score: percentage, course };
      }
      
      if (percentage < lowest.score && percentage > 0) {
        lowest = { score: percentage, course };
      }
    });
    
    return {
      overallPercentage: totalMax > 0 ? (totalScored / totalMax) * 100 : 0,
      totalScored,
      totalMax,
      highestCourse: highest.course,
      lowestCourse: lowest.course
    };
  }, [marks]);

  // Get the latest test results
  const recentTests = useMemo(() => {
    if (!marks?.marks || marks.marks.length === 0) return [];
    
    // Flatten all tests from all courses
    const allTests = marks.marks.flatMap(course => 
      course.testPerformance.map(test => ({
        courseName: course.courseName,
        courseCode: course.courseCode,
        courseType: course.courseType,
        ...test
      }))
    );
    
    // Sort by most recent (assuming the last tests in the array are more recent)
    return allTests.slice(-4).reverse();
  }, [marks]);

  if (!marks || !marks.marks) {
    return (
      <div className="p-4 text-center text-gray-500">
        No marks data available
      </div>
    );
  }

  // Function to determine grade color
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div>
      {/* Overall Grade */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-gray-500">Overall Score</div>
          <div className="text-3xl font-bold">
            {stats.totalScored.toFixed(1)} / {stats.totalMax.toFixed(1)}
          </div>
        </div>
        <div className={`text-3xl font-bold ${getGradeColor(stats.overallPercentage)}`}>
          {stats.overallPercentage.toFixed(1)}%
        </div>
      </div>

      {/* Best & Worst Performance */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {stats.highestCourse && (
          <div className="bg-green-50 p-3 rounded-md">
            <div className="text-xs text-green-700 font-medium">Highest Performance</div>
            <div className="text-sm font-medium truncate" title={stats.highestCourse.courseName}>
              {stats.highestCourse.courseName}
            </div>
            <div className="text-green-600 font-bold">
              {(parseFloat(stats.highestCourse.overall.scored) / parseFloat(stats.highestCourse.overall.total) * 100).toFixed(1)}%
            </div>
          </div>
        )}
        
        {stats.lowestCourse && (
          <div className="bg-red-50 p-3 rounded-md">
            <div className="text-xs text-red-700 font-medium">Lowest Performance</div>
            <div className="text-sm font-medium truncate" title={stats.lowestCourse.courseName}>
              {stats.lowestCourse.courseName}
            </div>
            <div className="text-red-600 font-bold">
              {(parseFloat(stats.lowestCourse.overall.scored) / parseFloat(stats.lowestCourse.overall.total) * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Recent Test Results */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Test Results:</h3>
        
        {recentTests.length > 0 ? (
          <div className="space-y-2">
            {recentTests.map((test, index) => {
              const scored = parseFloat(test.marks.scored);
              const total = parseFloat(test.marks.total);
              const percentage = total > 0 ? (scored / total) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="mr-3 p-2 bg-gray-100 rounded-md">
                    <FiFileText className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium truncate" title={test.courseName}>
                      {test.courseName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {test.test}
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${getGradeColor(percentage)}`}>
                    {test.marks.scored === "Abs" ? "Absent" : `${test.marks.scored}/${test.marks.total}`}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No test data available</div>
        )}
      </div>
    </div>
  );
};

export default MarksOverview;