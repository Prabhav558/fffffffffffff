// src/components/profile/ProfileCard.jsx
import React from 'react';
import { FiMail, FiPhone, FiBookOpen } from 'react-icons/fi';

const ProfileCard = ({ user, profile }) => {
  if (!user || !profile) {
    return (
      <div className="card bg-white text-center p-6">
        <div className="text-gray-500">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="card bg-white overflow-hidden">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      
      {/* Profile Picture */}
      <div className="flex justify-center -mt-16">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
            {user?.photoBase64 ? (
              <img 
                src={user.photoBase64} 
                alt={profile.name || 'User'} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600">
                <span className="text-4xl font-medium">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
        <p className="text-gray-600 mb-4">{profile.regNumber || user.regNumber}</p>
        
        <div className="space-y-3 text-left">
          {user.mobile && (
            <div className="flex items-center text-gray-700">
              <FiPhone className="mr-3 text-primary-500 flex-shrink-0" />
              <span>{user.mobile}</span>
            </div>
          )}
          
          {profile.email && (
            <div className="flex items-center text-gray-700">
              <FiMail className="mr-3 text-primary-500 flex-shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
          )}
          
          {user.program && (
            <div className="flex items-center text-gray-700">
              <FiBookOpen className="mr-3 text-primary-500 flex-shrink-0" />
              <span>{user.program}</span>
            </div>
          )}
        </div>
        
        {/* Batch and Year Info */}
        <div className="mt-6 flex justify-center space-x-2">
          {user.batch && (
            <div className="px-3 py-1 bg-primary-100 rounded-full text-primary-800 text-sm font-medium">
              Batch {user.batch}
            </div>
          )}
          
          {user.year !== undefined && (
            <div className="px-3 py-1 bg-secondary-100 rounded-full text-secondary-800 text-sm font-medium">
              Year {user.year}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;