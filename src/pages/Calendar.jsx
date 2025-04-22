// src/pages/Calendar.jsx
import { useState, useEffect } from 'react';
import { academicService } from '../services/api';
import { FiArrowLeft, FiArrowRight, FiCalendar } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import CalendarView from '../components/calendar/CalendarView';
import DayOrderView from '../components/calendar/DayOrderView';

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [calendar, setCalendar] = useState(null);
  const [error, setError] = useState(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const data = await academicService.getCalendar();
        setCalendar(data);
        
        // Set initial month index and selected day
        if (data && !data.error) {
          setCurrentMonthIndex(data.index || 0);
          setSelectedDay(data.today || null);
        }
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Failed to load calendar data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  const nextMonth = () => {
    if (calendar && calendar.calendar) {
      setCurrentMonthIndex((prev) => 
        prev < calendar.calendar.length - 1 ? prev + 1 : prev
      );
    }
  };

  const prevMonth = () => {
    setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

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

  if (!calendar || !calendar.calendar || calendar.calendar.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No calendar data available.</p>
      </div>
    );
  }

  const currentMonth = calendar.calendar[currentMonthIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Academic Calendar</h1>
        <p className="text-gray-600 mt-1">
          View academic schedule, events, and day orders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="md:col-span-2 card bg-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              disabled={currentMonthIndex === 0}
              className={`p-2 rounded-full ${
                currentMonthIndex === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-bold">{currentMonth.month}</h2>
            
            <button
              onClick={nextMonth}
              disabled={currentMonthIndex === calendar.calendar.length - 1}
              className={`p-2 rounded-full ${
                currentMonthIndex === calendar.calendar.length - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          <CalendarView 
            month={currentMonth} 
            today={calendar.today} 
            onSelectDay={handleDaySelect}
            selectedDay={selectedDay}
          />
        </div>
        
        {/* Day Details */}
        <div className="card bg-white">
          <div className="flex items-center mb-4">
            <FiCalendar className="h-5 w-5 text-primary-500 mr-2" />
            <h2 className="text-xl font-bold">Day Details</h2>
          </div>
          
          {selectedDay ? (
            <DayOrderView day={selectedDay} />
          ) : (
            <div className="text-center p-6 text-gray-500">
              Select a day to view details
            </div>
          )}
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="card bg-white">
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Day</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Day Order</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {getUpcomingEvents(calendar).map((event, index) => (
                <tr key={index} className={event.isToday ? 'bg-primary-50' : ''}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {event.date}
                    {event.isToday && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Today
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{event.day}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {event.dayOrder ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.dayOrder}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {event.event !== "No event" ? (
                      <span className="text-primary-600 font-medium">{event.event}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to get upcoming events
const getUpcomingEvents = (calendar) => {
  if (!calendar || !calendar.calendar) return [];
  
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  
  const events = [];
  
  // Find events from current month and next month
  const currentMonthIndex = calendar.index || 0;
  const monthsToCheck = [
    calendar.calendar[currentMonthIndex],
    calendar.calendar[currentMonthIndex + 1]
  ].filter(Boolean);
  
  monthsToCheck.forEach(month => {
    if (!month || !month.days) return;
    
    month.days.forEach(day => {
      // Check if this is an event or has a day order
      if (
        (day.event && day.event !== "No event") || 
        day.dayOrder
      ) {
        // Get the month and year from the month title
        const monthName = month.month.split("'")[0].trim();
        const yearStr = month.month.split("'")[1];
        const year = yearStr ? parseInt("20" + yearStr) : todayYear;
        
        // Get month number from name
        const monthMap = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const monthNum = monthMap[monthName] || todayMonth;
        
        // Check if this day is today or in the future
        const eventDate = new Date(year, monthNum, parseInt(day.date));
        const isToday = 
          todayDate === parseInt(day.date) && 
          todayMonth === monthNum && 
          todayYear === year;
        
        if (isToday || eventDate > today) {
          events.push({
            ...day,
            isToday,
            monthName,
            year
          });
        }
      }
    });
  });
  
  // Sort events by date
  events.sort((a, b) => {
    const aMonth = a.monthName;
    const bMonth = b.monthName;
    const aMonthNum = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }[aMonth] || 0;
    const bMonthNum = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    }[bMonth] || 0;
    
    if (aMonthNum !== bMonthNum) return aMonthNum - bMonthNum;
    return parseInt(a.date) - parseInt(b.date);
  });
  
  // Limit to 10 events
  return events.slice(0, 10);
};

export default Calendar;