// src/components/common/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiBarChart2, 
  FiUser,
  FiX 
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', path: '/', icon: FiHome },
  { name: 'Attendance', path: '/attendance', icon: FiCheckCircle },
  { name: 'Marks', path: '/marks', icon: FiBarChart2 },
  { name: 'Timetable', path: '/timetable', icon: FiClock },
  { name: 'Calendar', path: '/calendar', icon: FiCalendar },
  { name: 'Profile', path: '/profile', icon: FiUser },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 z-30 md:z-0 h-full w-64 transform transition-transform duration-300 ease-in-out 
          bg-white border-r border-gray-200 md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex justify-between items-center p-4 md:hidden">
            <span className="text-xl font-bold text-primary-500">SRM Academia</span>
            <button 
              onClick={onClose} 
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
                  ${isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>© 2025 SRM Academia</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;