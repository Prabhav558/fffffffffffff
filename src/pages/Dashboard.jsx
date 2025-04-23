// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/api';
import { 
  FiClock, FiCalendar, FiActivity, FiCheckCircle, 
  FiBarChart2, FiArrowRight, FiBookOpen, FiMapPin 
} from 'react-icons/fi';
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
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-lg text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {greeting}, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-white text-opacity-90">
              Welcome to your academic dashboard. Here's your academic overview.
            </p>
            
            {dashboardData?.academic?.dayOrder && (
              <div className="mt-4 flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-2 w-fit">
                <FiCalendar className="mr-2" />
                <span className="font-medium mr-1">Today:</span>
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
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-opacity-90 transition">
              <FiBookOpen size={16} />
              <span>Study Resources</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg font-medium hover:bg-opacity-30 transition">
              <FiActivity size={16} />
              <span>AI Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/attendance" className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all flex flex-col items-center text-center h-32 justify-center group">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <FiCheckCircle className="h-6 w-6" />
          </div>
          <h3 className="font-medium">Attendance</h3>
          <p className="text-xs text-gray-500 mt-1">Track your attendance</p>
        </Link>
        
        <Link to="/marks" className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all flex flex-col items-center text-center h-32 justify-center group">
          <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary-600 group-hover:text-white transition-colors">
            <FiBarChart2 className="h-6 w-6" />
          </div>
          <h3 className="font-medium">Marks</h3>
          <p className="text-xs text-gray-500 mt-1">View your performance</p>
        </Link>
        
        <Link to="/timetable" className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all flex flex-col items-center text-center h-32 justify-center group">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <FiClock className="h-6 w-6" />
          </div>
          <h3 className="font-medium">Timetable</h3>
          <p className="text-xs text-gray-500 mt-1">Check your schedule</p>
        </Link>
        
        <Link to="/calendar" className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all flex flex-col items-center text-center h-32 justify-center group">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <FiCalendar className="h-6 w-6" />
          </div>
          <h3 className="font-medium">Calendar</h3>
          <p className="text-xs text-gray-500 mt-1">View academic calendar</p>
        </Link>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-3">
                <FiClock className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Today's Classes</h2>
            </div>
            <Link to="/timetable" className="group flex items-center text-sm text-primary-600 hover:text-primary-700">
              <span>View Timetable</span>
              <FiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <TodayClasses 
            todayClasses={dashboardData?.classes?.todayClasses} 
          />
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mr-3">
                <FiActivity className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Upcoming Classes</h2>
            </div>
          </div>
          
          <UpcomingClasses 
            upcomingClasses={dashboardData?.classes?.upcomingClasses} 
          />
        </div>

        {/* Attendance Overview */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3">
                <FiCheckCircle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Attendance Overview</h2>
            </div>
            <Link to="/attendance" className="group flex items-center text-sm text-primary-600 hover:text-primary-700">
              <span>View Details</span>
              <FiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <AttendanceOverview 
            attendance={dashboardData?.academic?.attendance} 
          />
        </div>

        {/* Marks Overview */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3">
                <FiBarChart2 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Marks Overview</h2>
            </div>
            <Link to="/marks" className="group flex items-center text-sm text-primary-600 hover:text-primary-700">
              <span>View Details</span>
              <FiArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <MarksOverview 
            marks={dashboardData?.academic?.marks} 
          />
        </div>
      </div>
      
      {/* Academic resources section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
              <FiBookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Academic Resources</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 hover:bg-primary-50 rounded-lg p-4 cursor-pointer transition-colors group border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Study Materials</h3>
              <FiArrowRight className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Access lecture notes, textbooks, and reference materials
            </p>
          </div>
          
          <div className="bg-gray-50 hover:bg-secondary-50 rounded-lg p-4 cursor-pointer transition-colors group border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Past Papers</h3>
              <FiArrowRight className="text-gray-400 group-hover:text-secondary-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Practice with previous year question papers
            </p>
          </div>
          
          <div className="bg-gray-50 hover:bg-purple-50 rounded-lg p-4 cursor-pointer transition-colors group border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Assignment Help</h3>
              <FiArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Get guidance for your assignments and projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;