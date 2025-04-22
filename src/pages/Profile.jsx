// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { FiUser, FiMail, FiPhone, FiBookOpen, FiMapPin } from 'react-icons/fi';
import Loader from '../components/common/Loader';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileDetails from '../components/profile/ProfileDetails';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

  if (!profile || !user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your profile and account details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <ProfileCard user={user} profile={profile} />
        </div>
        
        {/* Profile Details */}
        <div className="md:col-span-2">
          <ProfileDetails user={user} profile={profile} />
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;