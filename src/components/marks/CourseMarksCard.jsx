// src/components/marks/CourseMarksCard.jsx
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiBarChart2 } from 'react-icons/fi';

const CourseMarksCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate percentage
  const scoredTotal = parseFloat(course.overall.scored);
  const maxTotal = parseFloat(course.overall.total);
  const percentage = maxTotal > 0 ? (scoredTotal / maxTotal) * 100 : 0;
  
  // Function to determine grade color
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };
  
  // Function to determine grade letter
  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'S';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'E';
    return 'F';
  };

  return (
    <div className={`card border-l-4 ${
      course.courseType === 'Theory' 
        ? 'border-primary-500' 
        : 'border-secondary-500'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg truncate" title={course.courseName}>
            {course.courseName}
          </h3>
          <p className="text-gray-500 text-sm flex items-center">
            {course.courseCode}
            <span className="mx-2">•</span>
            <span className={course.courseType === 'Theory' ? 'text-primary-600' : 'text-secondary-600'}>
              {course.courseType}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xl font-bold ${getGradeColor(percentage)}`}>
            {percentage.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-500">
            Grade: <span className={`font-bold ${getGradeColor(percentage)}`}>{getGradeLetter(percentage)}</span>
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              course.courseType === 'Theory'
                ? 'bg-primary-500'
                : 'bg-secondary-500'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>
          Overall: <span className="font-medium">{course.overall.scored} / {course.overall.total}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <>
              <span className="mr-1">Hide Details</span>
              <FiChevronUp />
            </>
          ) : (
            <>
              <span className="mr-1">Show Details</span>
              <FiChevronDown />
            </>
          )}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="font-medium mb-2">Test Breakdown</h4>
          
          {course.testPerformance && course.testPerformance.length > 0 ? (
            <div className="space-y-3">
              {course.testPerformance.map((test, index) => {
                const testScored = test.marks.scored === "Abs" ? 0 : parseFloat(test.marks.scored);
                const testTotal = parseFloat(test.marks.total);
                const testPercentage = test.marks.scored === "Abs" ? 0 : (testScored / testTotal) * 100;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{test.test}</span>
                      <span className={`font-medium ${
                        test.marks.scored === "Abs" 
                          ? 'text-red-600' 
                          : getGradeColor(testPercentage)
                      }`}>
                        {test.marks.scored === "Abs" ? "Absent" : `${test.marks.scored} / ${test.marks.total}`}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          test.marks.scored === "Abs" 
                            ? 'bg-red-500' 
                            : course.courseType === 'Theory'
                              ? 'bg-primary-500'
                              : 'bg-secondary-500'
                        }`}
                        style={{ width: `${Math.min(100, testPercentage)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 py-2">
              No test data available
            </div>
          )}
          
          {/* Performance Insights */}
          {course.testPerformance && course.testPerformance.length > 0 && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm">
              <h4 className="font-medium mb-2 text-gray-700">Performance Insights</h4>
              
              {(() => {
                const testCount = course.testPerformance.length;
                const absents = course.testPerformance.filter(t => t.marks.scored === "Abs").length;
                
                // Calculate highest and lowest scores
                let highest = { score: 0, test: null };
                let lowest = { score: 100, test: null };
                
                course.testPerformance.forEach(test => {
                  if (test.marks.scored === "Abs") return;
                  
                  const scored = parseFloat(test.marks.scored);
                  const total = parseFloat(test.marks.total);
                  const testPercentage = (scored / total) * 100;
                  
                  if (testPercentage > highest.score) {
                    highest = { score: testPercentage, test };
                  }
                  
                  if (testPercentage < lowest.score) {
                    lowest = { score: testPercentage, test };
                  }
                });
                
                return (
                  <div className="space-y-2">
                    {absents > 0 && (
                      <div className="text-red-600">
                        You were absent for {absents} out of {testCount} tests.
                      </div>
                    )}
                    
                    {highest.test && (
                      <div className="text-green-600">
                        Best performance: {highest.test.test} ({highest.score.toFixed(1)}%)
                      </div>
                    )}
                    
                    {lowest.test && lowest.score < highest.score && (
                      <div className="text-orange-600">
                        Needs improvement: {lowest.test.test} ({lowest.score.toFixed(1)}%)
                      </div>
                    )}
                    
                    {percentage < 60 && (
                      <div className="text-primary-600 font-medium">
                        Focus on improving to reach at least a C grade (60%).
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseMarksCard;