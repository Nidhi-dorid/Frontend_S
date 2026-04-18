import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const ComplaintCard = ({ complaint, onClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return 'bg-status-submitted text-white';
      case 'pending': return 'bg-status-pending text-white';
      case 'in progress': return 'bg-status-inprogress text-white';
      case 'resolved': return 'bg-status-resolved text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick && onClick(complaint)}
    >
      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
        {complaint.thumbnail ? (
          <img src={complaint.thumbnail} alt={complaint.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{complaint.title || complaint.issueType}</h4>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin size={14} className="mr-1 text-brand-orange" />
          <span className="truncate">{complaint.locationName || 'Unknown Location'}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(complaint.status)}`}>
          {complaint.status}
        </div>
        {complaint.status?.toLowerCase() !== 'in progress' && (
          <button className="text-sm text-status-submitted hover:underline font-medium flex items-center">
            View Details <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
