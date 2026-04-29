import React, { useState, useEffect, useContext } from 'react';
import { getMyReports, upvotePothole, getMapMarkers } from '../api';
import { CityContext } from '../context/CityContext';
import { getCityCenter } from '../lib/cityCoordinates';
import ComplaintCard from '../components/features/ComplaintCard';
import StatusTimeline from '../components/common/StatusTimeline';
import MapView from '../components/features/MapView';
import { Heart, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const MyComplaints = () => {
  const { selectedCityId } = useContext(CityContext);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyReports = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyReports();
      setReports(data);
      if (data.length > 0) {
        setSelectedReport(data[0]);
      }
    } catch {
      toast.error('Failed to load your reports. Please try again later.');
      setReports([]);
      setSelectedReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMapMarkers = React.useCallback(async (cityId) => {
    try {
      const data = await getMapMarkers(cityId);
      setMapMarkers(data);
    } catch {
      console.log('Failed to fetch map markers');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyReports();
  }, [fetchMyReports]);

  useEffect(() => {
    if (selectedCityId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMapMarkers(selectedCityId);
    }
  }, [selectedCityId, fetchMapMarkers]);

  const reportHistory = React.useMemo(() => {
    if (!selectedReport) return [];
    if (selectedReport.history) return selectedReport.history;
    
    // Fallback static history logic moved out of render
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    // Normalize status: backend may send 'in_progress', 'completed', 'pending'
    const normalizedStatus = (selectedReport.status || '').toLowerCase().replace(/_/g, ' ');
    
    return [
      { status: 'Submitted', timestamp: selectedReport.createdAt || now.toISOString(), message: 'Report received' },
      ...(normalizedStatus === 'in progress' ? [{ status: 'In Progress', timestamp: now.toISOString(), message: 'Team is investigating' }] : []),
      ...(normalizedStatus === 'completed' || normalizedStatus === 'resolved' ? [
        { status: 'In Progress', timestamp: yesterday.toISOString(), message: 'Work started' }, 
        { status: 'Resolved', timestamp: now.toISOString(), message: 'Issue has been fixed' }
      ] : [])
    ];
  }, [selectedReport]);

  const handleUpvote = async (id) => {
    try {
      await upvotePothole(id);
      
      // Optimistic update
      setReports(prev => prev.map(r => r.id === id || r._id === id ? { ...r, upvotes: (r.upvotes || r.upvoteCount || 0) + 1 } : r));
      
      if (selectedReport && (selectedReport.id === id || selectedReport._id === id)) {
        setSelectedReport(prev => ({ ...prev, upvotes: (prev.upvotes || prev.upvoteCount || 0) + 1 }));
      }
      toast.success('Upvoted successfully!');
    } catch {
      toast.error('Failed to upvote');
    }
  };

  // Determine markers for the map: highlight selected report
  // Normalize: backend may return latitude/longitude or lat/lng
  const displayMarkers = selectedReport 
    ? [...mapMarkers, {
        lat: selectedReport.latitude ?? selectedReport.lat,
        lng: selectedReport.longitude ?? selectedReport.lng,
        title: selectedReport.title || selectedReport.issueType
      }]
    : mapMarkers;

  const mapCenter = selectedReport && (selectedReport.latitude || selectedReport.lat)
    ? { lat: selectedReport.latitude ?? selectedReport.lat, lng: selectedReport.longitude ?? selectedReport.lng }
    : getCityCenter(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[85vh]">
      {/* Left Panel - List */}
      <div className="w-full lg:w-1/3 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">My Reports</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-gray-50">
          {loading ? (
             <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div></div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div 
                key={report.id || report._id}
                className={`transition-all ${selectedReport && ((selectedReport.id || selectedReport._id) === (report.id || report._id)) ? 'ring-2 ring-brand-orange shadow-md' : ''}`}
              >
                <ComplaintCard 
                  complaint={report} 
                  onClick={setSelectedReport} 
                />
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              You haven't submitted any reports yet.
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Details & Map */}
      {selectedReport ? (
        <div className="w-full lg:w-2/3 flex flex-col gap-6 h-full overflow-y-auto">
          {/* Detail Card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedReport.title || selectedReport.issueType}</h2>
                <div className="flex items-center text-gray-500">
                  <MapPin size={16} className="text-brand-orange mr-1" />
                  <span>{selectedReport.locationName || 'Unknown Zone'}</span>
                </div>
              </div>
              <button 
                onClick={() => handleUpvote(selectedReport.id || selectedReport._id)}
                className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full hover:bg-rose-100 transition-colors font-medium"
              >
                <Heart size={18} fill="currentColor" />
                {selectedReport.upvotes || selectedReport.upvoteCount || 0} Upvotes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {selectedReport.imageUrl || selectedReport.thumbnail ? (
                  <img 
                    src={selectedReport.imageUrl || selectedReport.thumbnail} 
                    alt="Issue" 
                    className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-100"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22400%22%20height%3D%22200%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%239ca3af%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">No Image</div>
                )}
                <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 mb-8">{selectedReport.description || 'No description provided.'}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-6">Progress Tracking</h4>
                <StatusTimeline history={reportHistory} />
              </div>
            </div>
          </div>

          {/* Map for selected report */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden h-64 shrink-0">
            <MapView markers={displayMarkers} center={mapCenter} zoom={14} />
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex w-2/3 bg-white border border-gray-100 rounded-xl shadow-sm items-center justify-center text-gray-400">
           Select a report to view details
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
