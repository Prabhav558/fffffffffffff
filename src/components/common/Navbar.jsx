// src/components/common/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={onMenuClick}
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-500">SRM Academia</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {/* Notifications */}
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
              <FiBell className="h-5 w-5" />
            </button>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center overflow-hidden">
                      {user?.photoBase64 ? (
                        <img 
                          src={user.photoBase64} 
                          alt={user?.name || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-medium">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                    <span className="ml-2 text-gray-700 hidden md:block">
                      {user?.name || 'User'}
                    </span>
                    <FiChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </div>
                </button>
              </div>
              
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={logout}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;