import React from 'react';
import { CheckCircle2, MapPin, Circle } from 'lucide-react';

const StatusTimeline = ({ history = [] }) => {
  const getIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'submitted': return <CheckCircle2 className="text-status-submitted bg-white" size={24} />;
      case 'in progress': return <MapPin className="text-status-inprogress bg-white" size={24} />;
      case 'resolved': return <CheckCircle2 className="text-status-resolved bg-white" size={24} />;
      default: return <Circle className="text-gray-300 bg-white" size={24} />;
    }
  };

  return (
    <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-4">
      {history.map((step, index) => (
        <div key={index} className="relative pl-6">
          <div className="absolute -left-[13px] top-0">
            {getIcon(step.status)}
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 capitalize">{step.status}</h5>
            <p className="text-sm text-gray-500">{new Date(step.timestamp).toLocaleString()}</p>
            {step.message && <p className="text-sm text-gray-700 mt-1">{step.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
