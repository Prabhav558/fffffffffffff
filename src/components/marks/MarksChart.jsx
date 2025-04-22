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

const MarksChart = ({ marks }) => {
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
    if (!marks || marks.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Sort courses by type and then alphabetically
    const sortedCourses = [...marks].sort((a, b) => {
      if (a.courseType !== b.courseType) {
        return a.courseType === 'Theory' ? -1 : 1;
      }
      return a.courseName.localeCompare(b.courseName);
    });

    // Get top 8 courses (or all if less than 8)
    const coursesToShow = sortedCourses.slice(0, 8);

    return {
      labels: coursesToShow.map(course => {
        // Truncate long course names
        const shortName = course.courseName.length > 15
          ? course.courseName.substring(0, 15) + '...'
          : course.courseName;
        return shortName;
      }),
      datasets: [
        {
          label: 'Marks Percentage',
          data: coursesToShow.map(course => {
            const scored = parseFloat(course.overall.scored);
            const total = parseFloat(course.overall.total);
            return total > 0 ? (scored / total) * 100 : 0;
          }),
          backgroundColor: coursesToShow.map(course => {
            const scored = parseFloat(course.overall.scored);
            const total = parseFloat(course.overall.total);
            const percentage = total > 0 ? (scored / total) * 100 : 0;
            
            if (percentage >= 90) return 'rgba(16, 185, 129, 0.8)'; // Green
            if (percentage >= 80) return 'rgba(59, 130, 246, 0.8)'; // Blue
            if (percentage >= 70) return 'rgba(234, 179, 8, 0.8)';  // Yellow
            if (percentage >= 60) return 'rgba(249, 115, 22, 0.8)'; // Orange
            return 'rgba(239, 68, 68, 0.8)';                        // Red
          }),
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Grade S (90%)',
          data: coursesToShow.map(() => 90),
          type: 'line',
          borderColor: 'rgba(16, 185, 129, 0.8)',  // Green
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
        {
          label: 'Grade A (80%)',
          data: coursesToShow.map(() => 80),
          type: 'line',
          borderColor: 'rgba(59, 130, 246, 0.8)',  // Blue
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
        {
          label: 'Pass Mark (40%)',
          data: coursesToShow.map(() => 40),
          type: 'line',
          borderColor: 'rgba(239, 68, 68, 0.8)',  // Red
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        },
      ],
    };
  }, [marks]);

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
            if (context.dataset.type === 'line') {
              return `${context.dataset.label}: ${context.raw}%`;
            }
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

  if (!marks || marks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No marks data available for chart
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default MarksChart;