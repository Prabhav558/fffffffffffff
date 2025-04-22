import { useMemo, useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,  // Add this import
  LineElement,   // Add this import
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ALL necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,   // Register point element
  LineElement,    // Register line element
  Title,
  Tooltip,
  Legend
);

const AttendanceChart = ({ attendance }) => {
  const chartRef = useRef(null);

  // Cleanup on unmount to prevent canvas reuse errors
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Prepare data for chart
  const chartData = useMemo(() => {
    if (!attendance || attendance.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Sort courses by attendance percentage
    const sortedCourses = [...attendance].sort(
      (a, b) => parseFloat(a.attendancePercentage) - parseFloat(b.attendancePercentage)
    );

    // Get top 8 courses (or all if less than 8)
    const coursesToShow = sortedCourses.slice(0, 8);

    return {
      labels: coursesToShow.map(course => {
        // Truncate long course names
        const shortName = course.courseTitle.length > 15
          ? course.courseTitle.substring(0, 15) + '...'
          : course.courseTitle;
        return shortName;
      }),
      datasets: [
        {
          label: 'Attendance Percentage',
          data: coursesToShow.map(course => parseFloat(course.attendancePercentage)),
          backgroundColor: coursesToShow.map(course => 
            parseFloat(course.attendancePercentage) >= 75 
              ? 'rgba(74, 108, 247, 0.8)'  // Primary color
              : 'rgba(239, 68, 68, 0.8)'   // Red color
          ),
          borderColor: coursesToShow.map(course => 
            parseFloat(course.attendancePercentage) >= 75 
              ? 'rgb(74, 108, 247)'      // Primary color
              : 'rgb(239, 68, 68)'       // Red color
          ),
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Required (75%)',
          data: coursesToShow.map(() => 75),
          type: 'line',
          borderColor: 'rgba(140, 109, 255, 0.8)',  // Secondary color
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
      ],
    };
  }, [attendance]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Courses',
        },
      },
    },
  };

  if (!attendance || attendance.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No attendance data available for chart
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default AttendanceChart;