// src/components/profile/ProfileDetails.jsx
import React from 'react';
import { FiUser, FiBookOpen, FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi';

const ProfileDetails = ({ user, profile }) => {
  if (!user || !profile) {
    return (
      <div className="card bg-white p-6">
        <div className="text-gray-500">No profile data available</div>
      </div>
    );
  }

  // Transform profile object to organized sections
  const sections = [
    {
      title: 'Personal Information',
      icon: <FiUser className="text-primary-500" />,
      items: [
        { label: 'Name', value: profile.name },
        { label: 'Registration Number', value: profile.regNumber || user.regNumber },
        { label: 'Date of Birth', value: profile.date_of_birth },
        { label: 'Gender', value: profile.gender },
        { label: 'Email', value: profile.email || user.email },
        { label: 'Mobile', value: user.mobile || profile.mobile }
      ].filter(item => item.value)
    },
    {
      title: 'Academic Information',
      icon: <FiBookOpen className="text-primary-500" />,
      items: [
        { label: 'Program', value: user.program || profile.program },
        { label: 'Department', value: user.department || profile.department },
        { label: 'Semester', value: user.semester ? `Semester ${user.semester}` : profile.semester },
        { label: 'Section', value: user.section || profile.section },
        { label: 'Batch', value: user.batch || profile.batch },
        { label: 'Year', value: user.year !== undefined ? `Year ${user.year}` : profile.year },
        { label: 'Status', value: profile.status || 'Active' }
      ].filter(item => item.value)
    }
  ];

  // Add address section if there's any address information
  const addressItems = [
    { label: 'Street', value: profile.permanent_address || profile.address },
    { label: 'City', value: profile.city },
    { label: 'State', value: profile.state },
    { label: 'Postal Code', value: profile.postal_code || profile.pincode },
    { label: 'Country', value: profile.country || 'India' }
  ].filter(item => item.value);

  if (addressItems.length > 0) {
    sections.push({
      title: 'Address',
      icon: <FiMapPin className="text-primary-500" />,
      items: addressItems
    });
  }

  // Add advisors section if there are any
  if (user.advisors && user.advisors.length > 0) {
    sections.push({
      title: 'Academic Advisors',
      icon: <FiUsers className="text-primary-500" />,
      items: user.advisors.map(advisor => ({
        label: advisor.role,
        value: (
          <div>
            <div>{advisor.name}</div>
            <div className="text-sm text-gray-500">
              {advisor.email && <span className="mr-2">{advisor.email}</span>}
              {advisor.phone && <span>Tel: {advisor.phone}</span>}
            </div>
          </div>
        )
      }))
    });
  }

  return (
    <div className="card bg-white p-6">
      <h2 className="text-xl font-bold mb-6">Profile Information</h2>
      
      <div className="space-y-8">
        {sections.map((section, sIndex) => (
          <div key={sIndex}>
            <div className="flex items-center mb-4 pb-1 border-b border-gray-200">
              <div className="mr-2">{section.icon}</div>
              <h3 className="text-lg font-medium">{section.title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item, iIndex) => (
                <div key={iIndex} className="space-y-1">
                  <div className="text-sm text-gray-500">{item.label}</div>
                  <div className="font-medium">
                    {item.value || <span className="text-gray-400">Not provided</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Last Login Info */}
      <div className="mt-8 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
        <FiCalendar className="mr-2" />
        <span>Last login: Today at {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default ProfileDetails;