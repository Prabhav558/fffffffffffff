// src/pages/Marks.jsx
import { useState, useEffect, useMemo } from 'react';
import { academicService } from '../services/api';
import { FiSearch, FiFilter, FiBarChart2 } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import CourseMarksCard from '../components/marks/CourseMarksCard';
import MarksChart from '../components/marks/MarksChart';

const Marks = () => {
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'theory', 'practical'

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        setLoading(true);
        const data = await academicService.getMarks();
        setMarks(data);
      } catch (err) {
        console.error('Error fetching marks data:', err);
        setError('Failed to load marks data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  // Calculate overall statistics
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

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    if (!marks?.marks) return [];
    
    return marks.marks
      .filter(course => {
        // Apply search filter
        const matchesSearch = 
          course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Apply type filter
        if (filterType === 'theory' && course.courseType !== 'Theory') return false;
        if (filterType === 'practical' && course.courseType !== 'Practical') return false;
        
        return matchesSearch;
      })
      .sort((a, b) => {
        // Sort by performance (lowest first)
        const aPercent = parseFloat(a.overall.scored) / parseFloat(a.overall.total) * 100;
        const bPercent = parseFloat(b.overall.scored) / parseFloat(b.overall.total) * 100;
        return aPercent - bPercent;
      });
  }, [marks, searchTerm, filterType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <button 
          className="mt-2 text-sm font-medium text-red-700 underline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!marks || !marks.marks || marks.marks.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No marks data available.</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Marks</h1>
          <p className="text-gray-600 mt-1">
            View and analyze your academic performance
          </p>
        </div>
        
        <div className="bg-white rounded-full py-1 px-3 border border-gray-300 mt-4 md:mt-0">
          <span className="text-sm mr-2">Reg. Number:</span>
          <span className="font-medium">{marks.regNumber}</span>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Card */}
        <div className="card bg-white">
          <h2 className="text-lg font-bold mb-4">Overall Performance</h2>
          
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Total Score</div>
                <div className="text-2xl font-bold">
                  {stats.totalScored.toFixed(1)} / {stats.totalMax.toFixed(1)}
                </div>
              </div>
              <div className={`text-3xl font-bold ${getGradeColor(stats.overallPercentage)}`}>
                {stats.overallPercentage.toFixed(1)}%
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full bg-primary-500`}
                style={{ width: `${Math.min(100, stats.overallPercentage)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Best and Worst Performance */}
          <div className="space-y-3">
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
        </div>
        
        {/* Marks Chart */}
        <div className="card bg-white md:col-span-2">
          <h2 className="text-lg font-bold mb-4">Performance Distribution</h2>
          <MarksChart marks={marks.marks} />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-md text-sm ${
              filterType === 'all' 
                ? 'bg-gray-200 text-gray-800 font-medium' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilterType('theory')}
            className={`px-3 py-2 rounded-md text-sm ${
              filterType === 'theory' 
                ? 'bg-primary-100 text-primary-800 font-medium' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Theory
          </button>
          <button
            onClick={() => setFilterType('practical')}
            className={`px-3 py-2 rounded-md text-sm ${
              filterType === 'practical' 
                ? 'bg-secondary-100 text-secondary-800 font-medium' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Practical
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseMarksCard key={course.courseCode} course={course} />
          ))
        ) : (
          <div className="col-span-full text-center p-8">
            <p className="text-gray-600">No courses match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marks;