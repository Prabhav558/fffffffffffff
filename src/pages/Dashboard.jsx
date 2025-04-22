// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/api';
import { FiClock, FiCalendar, FiActivity, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import AttendanceOverview from '../components/dashboard/AttendanceOverview';
import MarksOverview from '../components/dashboard/MarksOverview';
import TodayClasses from '../components/dashboard/TodayClasses';
import UpcomingClasses from '../components/dashboard/UpcomingClasses';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getAllData();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  // Calculate current time to display greeting
  const hours = new Date().getHours();
  let greeting = 'Good evening';
  if (hours < 12) greeting = 'Good morning';
  else if (hours < 18) greeting = 'Good afternoon';

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white p-6 rounded-lg shadow-card">
        <h1 className="text-2xl font-bold text-gray-800">
          {greeting}, {user?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to your academic dashboard. Here's a summary of your academic information.
        </p>
        
        {dashboardData?.academic?.dayOrder && (
          <div className="mt-4 flex items-center">
            <FiCalendar className="text-primary-500 mr-2" />
            <span className="font-medium mr-2">Today:</span>
            <span>
              {dashboardData.academic.dayOrder.date} ({dashboardData.academic.dayOrder.day}) - 
              {dashboardData.academic.dayOrder.dayOrder ? 
                <span className="font-medium ml-1">{dashboardData.academic.dayOrder.dayOrder}</span> : 
                'No classes today'
              }
            </span>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/attendance" className="card card-hover bg-white p-4 flex flex-col items-center justify-center text-center h-32">
          <FiCheckCircle className="h-8 w-8 text-primary-500 mb-2" />
          <h3 className="font-medium">Attendance</h3>
          <p className="text-sm text-gray-500 mt-1">Track your attendance</p>
        </Link>
        
        <Link to="/marks" className="card card-hover bg-white p-4 flex flex-col items-center justify-center text-center h-32">
          <FiBarChart2 className="h-8 w-8 text-secondary-500 mb-2" />
          <h3 className="font-medium">Marks</h3>
          <p className="text-sm text-gray-500 mt-1">View your academic performance</p>
        </Link>
        
        <Link to="/timetable" className="card card-hover bg-white p-4 flex flex-col items-center justify-center text-center h-32">
          <FiClock className="h-8 w-8 text-primary-500 mb-2" />
          <h3 className="font-medium">Timetable</h3>
          <p className="text-sm text-gray-500 mt-1">Check your class schedule</p>
        </Link>
        
        <Link to="/calendar" className="card card-hover bg-white p-4 flex flex-col items-center justify-center text-center h-32">
          <FiCalendar className="h-8 w-8 text-secondary-500 mb-2" />
          <h3 className="font-medium">Calendar</h3>
          <p className="text-sm text-gray-500 mt-1">View academic calendar</p>
        </Link>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="card bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FiClock className="mr-2 text-primary-500" /> Today's Classes
            </h2>
            <Link to="/timetable" className="text-sm text-primary-500 hover:underline">
              View Timetable
            </Link>
          </div>
          
          <TodayClasses 
            todayClasses={dashboardData?.classes?.todayClasses} 
          />
        </div>

        {/* Upcoming Classes */}
        <div className="card bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FiActivity className="mr-2 text-secondary-500" /> Upcoming Classes
            </h2>
          </div>
          
          <UpcomingClasses 
            upcomingClasses={dashboardData?.classes?.upcomingClasses} 
          />
        </div>

        {/* Attendance Overview */}
        <div className="card bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FiCheckCircle className="mr-2 text-primary-500" /> Attendance Overview
            </h2>
            <Link to="/attendance" className="text-sm text-primary-500 hover:underline">
              View Details
            </Link>
          </div>
          
          <AttendanceOverview 
            attendance={dashboardData?.academic?.attendance} 
          />
        </div>

        {/* Marks Overview */}
        <div className="card bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FiBarChart2 className="mr-2 text-secondary-500" /> Marks Overview
            </h2>
            <Link to="/marks" className="text-sm text-primary-500 hover:underline">
              View Details
            </Link>
          </div>
          
          <MarksOverview 
            marks={dashboardData?.academic?.marks} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;