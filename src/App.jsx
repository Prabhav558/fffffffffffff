// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Suspense, lazy} from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Loader from './components/common/Loader';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Marks = lazy(() => import('./pages/Marks'));
const Timetable = lazy(() => import('./pages/Timetable'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('csrf_token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><Loader size="large" /></div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="marks" element={<Marks />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;