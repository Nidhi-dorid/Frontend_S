import React from 'react';
import { MapPin, ChevronRight, Road } from 'lucide-react';

const ComplaintCard = ({ complaint, onClick }) => {
  const getStatusColor = (status) => {
    const s = status?.toLowerCase().replace(/_/g, ' ');
    switch (s) {
      case 'submitted': return 'bg-status-submitted text-white';
      case 'pending': return 'bg-status-pending text-white';
      case 'in progress': return 'bg-status-inprogress text-white';
      case 'resolved':
      case 'completed': return 'bg-status-resolved text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div 
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick && onClick(complaint)}
    >
      <div className="w-16 h-16 rounded-lg bg-brand-bg overflow-hidden flex-shrink-0">
        {complaint.thumbnail || complaint.imageUrl ? (
          <img 
            src={complaint.thumbnail || complaint.imageUrl} 
            alt={complaint.title || 'Complaint'} 
            className="w-full h-full object-cover" 
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20fill%3D%22%239ca3af%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-orange">
            <Road size={28} />
          </div>
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
        {complaint.status?.toLowerCase().replace(/_/g, ' ') !== 'in progress' && (
          <button className="text-sm text-status-submitted hover:underline font-medium flex items-center">
            View Details <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
