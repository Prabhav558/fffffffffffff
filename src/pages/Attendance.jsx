// src/pages/Attendance.jsx
import { useState, useEffect, useMemo } from 'react';
import { academicService } from '../services/api';
import { FiSearch, FiFilter, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import AttendanceCard from '../components/attendance/AttendanceCard';
import AttendanceChart from '../components/attendance/AttendanceChart';
import AttendancePredictor from '../components/attendance/AttendancePredictor';

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'safe', 'danger'

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const data = await academicService.getAttendance();
        setAttendance(data);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

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

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    if (!attendance?.attendance) return [];
    
    return attendance.attendance
      .filter(course => {
        // Apply search filter
        const matchesSearch = 
          course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Apply status filter
        const attendancePercentage = parseFloat(course.attendancePercentage);
        if (filterStatus === 'safe' && attendancePercentage < 75) return false;
        if (filterStatus === 'danger' && attendancePercentage >= 75) return false;
        
        return matchesSearch;
      })
      .sort((a, b) => {
        // Sort by attendance percentage (lowest first)
        return parseFloat(a.attendancePercentage) - parseFloat(b.attendancePercentage);
      });
  }, [attendance, searchTerm, filterStatus]);

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

  if (!attendance || !attendance.attendance) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No attendance data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your class attendance
          </p>
        </div>
        
        <div className="bg-white rounded-full py-1 px-3 border border-gray-300 mt-4 md:mt-0">
          <span className="text-sm mr-2">Reg. Number:</span>
          <span className="font-medium">{attendance.regNumber}</span>
        </div>
      </div>

      {/* Overall Stats and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Attendance Card */}
        <div className="card bg-white">
          <h2 className="text-lg font-bold mb-4">Overall Attendance</h2>
          
          <div className="flex justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-40 h-40">
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
                <span className="text-4xl font-bold">{overallAttendance.toFixed(1)}%</span>
                <span className="text-sm text-gray-500">Overall</span>
              </div>
            </div>
          </div>
          
          <div className={`text-center p-3 rounded-md ${
            overallAttendance >= 75 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {overallAttendance >= 75 ? (
              <div className="flex items-center justify-center">
                <FiCheckCircle className="mr-2" />
                <span>You're meeting the attendance requirement (75%)</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FiAlertCircle className="mr-2" />
                <span>Your attendance is below the required 75%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Attendance Chart */}
        <div className="card bg-white md:col-span-2">
          <h2 className="text-lg font-bold mb-4">Attendance Distribution</h2>
          <AttendanceChart attendance={attendance.attendance} />
        </div>
      </div>

      {/* Attendance Predictor */}
      <div className="card bg-white">
        <h2 className="text-lg font-bold mb-4">Attendance Predictor</h2>
        <AttendancePredictor attendance={attendance.attendance} />
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
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-2 rounded-md text-sm ${
              filterStatus === 'all' 
                ? 'bg-gray-200 text-gray-800 font-medium' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilterStatus('danger')}
            className={`px-3 py-2 rounded-md text-sm ${
              filterStatus === 'danger' 
                ? 'bg-red-100 text-red-800 font-medium' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Below 75%
          </button>
          <button
            onClick={() => setFilterStatus('safe')}
            className={`px-3 py-2 rounded-md text-sm ${
              filterStatus === 'safe' 
                ? 'bg-green-100 text-green-800 font-medium' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Above 75%
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <AttendanceCard key={course.courseCode} course={course} />
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

export default Attendance;