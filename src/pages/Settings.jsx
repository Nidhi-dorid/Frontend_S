import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield } from 'lucide-react';

const Settings = () => {
  const { user, logoutAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAuth();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your profile and account preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center gap-6">
          <div className="w-24 h-24 bg-brand-orange text-white rounded-full flex items-center justify-center text-4xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User Name'}</h2>
            <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 font-medium text-xs rounded-full">Citizen Account</span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Profile Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {user?.name || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Mail size={16} /> Email Address
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                  {user?.email || 'Not provided'}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <Shield size={16} /> Account Status
                </label>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-green-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Active & Verified
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Danger Zone</h3>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
            >
              Log out of all devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
