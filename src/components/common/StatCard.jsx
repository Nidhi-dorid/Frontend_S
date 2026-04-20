import React from 'react';

const StatCard = ({ title, value, colorClass, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-opacity-10 ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
