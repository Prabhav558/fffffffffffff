// src/pages/Timetable.jsx
import { useState, useEffect } from 'react';
import { academicService, classService } from '../services/api';
import { FiCalendar, FiClock } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import DaySchedule from '../components/timetable/DaySchedule';
import WeeklyTimetable from '../components/timetable/WeeklyTimetable';

const Timetable = () => {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);
  const [todayClasses, setTodayClasses] = useState(null);
  const [dayOrder, setDayOrder] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('today'); // 'today', 'weekly'

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        setLoading(true);
        const [timetableData, todayClassesData, dayOrderData] = await Promise.all([
          academicService.getTimetable(),
          classService.getTodayClasses(),
          academicService.getDayOrder(),
        ]);
        
        setTimetable(timetableData);
        setTodayClasses(todayClassesData);
        setDayOrder(dayOrderData);
      } catch (err) {
        console.error('Error fetching timetable data:', err);
        setError('Failed to load timetable data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableData();
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

  if (!timetable) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No timetable data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Timetable</h1>
          <p className="text-gray-600 mt-1">
            View your class schedules and timings
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setView('today')}
            className={`px-4 py-2 rounded-md text-sm flex items-center ${
              view === 'today' 
                ? 'bg-primary-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiClock className="mr-2" />
            Today's Classes
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`px-4 py-2 rounded-md text-sm flex items-center ${
              view === 'weekly' 
                ? 'bg-primary-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiCalendar className="mr-2" />
            Weekly View
          </button>
        </div>
      </div>

      {/* Batch Information */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-white rounded-full py-1 px-3 border border-gray-300">
          <span className="text-sm mr-2">Reg. Number:</span>
          <span className="font-medium">{timetable.regNumber}</span>
        </div>
        <div className="bg-white rounded-full py-1 px-3 border border-gray-300">
          <span className="text-sm mr-2">Batch:</span>
          <span className="font-medium">{timetable.batch}</span>
        </div>
        {dayOrder && (
          <div className="bg-white rounded-full py-1 px-3 border border-gray-300">
            <span className="text-sm mr-2">Today:</span>
            <span className="font-medium">
              {dayOrder.dayOrder || 'No Classes'}
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="card bg-white">
        {view === 'today' ? (
          <DaySchedule todayClasses={todayClasses} />
        ) : (
          <WeeklyTimetable timetable={timetable} />
        )}
      </div>
    </div>
  );
};

export default Timetable;