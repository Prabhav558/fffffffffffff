import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const WeeklyTimetable = ({ timetable }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = timetable?.schedule?.[selectedDayIndex] ?? null;

  // Group classes by time slot using useMemo
  const timeSlots = useMemo(() => {
    const slots = [];
    const slotMap = {};

    if (!selectedDay?.table) return slots;

    selectedDay.table.forEach(classItem => {
      const key = `${classItem.startTime}-${classItem.endTime}`;
      if (!slotMap[key]) {
        slotMap[key] = {
          startTime: classItem.startTime,
          endTime: classItem.endTime,
          classes: []
        };
        slots.push(slotMap[key]);
      }
      slotMap[key].classes.push(classItem);
    });

    const getTimeValue = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    return slots.sort((a, b) => getTimeValue(a.startTime) - getTimeValue(b.startTime));
  }, [selectedDay]);

  // Return early if no timetable data is available
  if (!timetable || !timetable.schedule || timetable.schedule.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No timetable data available
      </div>
    );
  }

  const nextDay = () => {
    setSelectedDayIndex((prev) => (prev + 1) % timetable.schedule.length);
  };

  const prevDay = () => {
    setSelectedDayIndex((prev) =>
      prev === 0 ? timetable.schedule.length - 1 : prev - 1
    );
  };

  return (
    <div>
      {/* Day selector */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevDay}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-xl font-bold">
          {selectedDay.dayOrder}
        </div>

        <button
          onClick={nextDay}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Timetable grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-100 text-left py-3 px-4 font-semibold text-gray-700 border-b">Time</th>
              <th className="bg-gray-100 text-left py-3 px-4 font-semibold text-gray-700 border-b">Subject</th>
              <th className="bg-gray-100 text-left py-3 px-4 font-semibold text-gray-700 border-b">Room</th>
              <th className="bg-gray-100 text-left py-3 px-4 font-semibold text-gray-700 border-b">Slot</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.length > 0 ? (
              timeSlots.map((slot, slotIndex) => (
                <tr
                  key={slotIndex}
                  className={slotIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="py-3 px-4 border-b text-gray-700">
                    <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {slot.classes.map((classItem, classIndex) => (
                      <div key={classIndex} className={`mb-1 last:mb-0 ${
                        classItem.courseType === 'Practical' ? 'text-secondary-700' : ''
                      }`}>
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-xs text-gray-500">{classItem.code}</div>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {slot.classes.map((classItem, classIndex) => (
                      <div key={classIndex} className="mb-1 last:mb-0">
                        <div className={`${
                          classItem.online ? 'text-green-600' : 'text-gray-700'
                        }`}>
                          {classItem.online ? 'Online' : classItem.roomNo || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {slot.classes.map((classItem, classIndex) => (
                      <div key={classIndex} className="mb-1 last:mb-0">
                        <div className={`inline-block px-2 py-1 text-xs rounded-full ${
                          classItem.courseType === 'Theory'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-secondary-100 text-secondary-800'
                        }`}>
                          {classItem.slot}
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No classes scheduled for this day
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
          <span>Theory Class</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-secondary-500 mr-2"></div>
          <span>Practical Class</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetable;
