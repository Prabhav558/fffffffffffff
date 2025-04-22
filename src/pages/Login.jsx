// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/common/Loader';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [credentials, setCredentials] = useState({
    account: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Form validation
      if (!credentials.account || !credentials.password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      // Ensure email has @srmist.edu.in domain
      if (!credentials.account.includes('@')) {
        setCredentials({
          ...credentials,
          account: `${credentials.account}@srmist.edu.in`,
        });
      }

      const result = await login(credentials);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex">
      {/* Left side with form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">SRM Academia</h1>
          <h2 className="mt-4 text-center text-xl font-medium text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 flex items-center bg-red-50 text-red-700 p-3 rounded-md">
                <FiAlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                  Registration Number / Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="account"
                    name="account"
                    type="text"
                    autoComplete="email"
                    required
                    value={credentials.account}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="RA2111026010001 or user@srmist.edu.in"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary py-3 flex justify-center items-center"
                >
                  {loading ? <Loader size="small" className="mr-2" /> : null}
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-center text-sm text-gray-500">
                This is an unofficial app and not affiliated with SRM University. Use at your own discretion.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side with illustration */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary-500 to-secondary-500">
        <div className="flex flex-col justify-center items-center h-full text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Welcome to SRM Academia</h2>
          <p className="text-xl max-w-md text-center mb-8">
            Your all-in-one solution for managing your academic life at SRM University.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-2xl">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Attendance Tracker</h3>
              <p>Monitor your attendance and stay on top of attendance requirements.</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Marks Analysis</h3>
              <p>View your marks and analyze your academic performance.</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Timetable</h3>
              <p>Access your class schedule and never miss a lecture.</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Calendar</h3>
              <p>Keep track of important academic dates and events.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;