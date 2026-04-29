import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities, getSummary, getDashboardZones, getMapMarkers } from '../api';
import { CityContext } from '../context/CityContext';
import { getCityCenter } from '../lib/cityCoordinates';
import { FileText, Clock, Wrench, CheckCircle, Map as MapIcon, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/common/StatCard';
import ComplaintCard from '../components/features/ComplaintCard';
import MapView from '../components/features/MapView';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedCityId, setSelectedCityId } = useContext(CityContext);
  const [cities, setCities] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, high: 0, medium: 0, low: 0 });
  const [zones, setZones] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = React.useCallback(async () => {
    try {
      const data = await getCities();
      setCities(data);
      if (data.length > 0 && !selectedCityId) {
        setSelectedCityId(data[0].id || data[0]._id);
      }
    } catch {
      toast.error('Failed to load cities');
    }
  }, [selectedCityId, setSelectedCityId]);

  const fetchDashboardData = React.useCallback(async (cityId) => {
    setLoading(true);
    try {
      const [summaryData, zonesData, markersData] = await Promise.all([
        getSummary(cityId).catch(() => ({ total: 0, pending: 0, inProgress: 0, completed: 0, high: 0, medium: 0, low: 0 })),
        getDashboardZones(cityId).catch(() => []),
        getMapMarkers(cityId).catch(() => [])
      ]);
      setSummary(summaryData);
      setZones(zonesData);
      setMarkers(markersData);
    } catch {
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    if (selectedCityId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDashboardData(selectedCityId);
    }
  }, [selectedCityId, fetchDashboardData]);

  const chartData = React.useMemo(() => {
    if (!zones || zones.length === 0) return [];
    
    // Sort by reports in descending order and get top 5
    const sortedZones = [...zones].sort((a, b) => (b.totalPotholes || 0) - (a.totalPotholes || 0));
    
    return sortedZones
      .slice(0, 5)
      .map(z => ({
        name: z.zoneName ? z.zoneName.replace(' Zone', '').substring(0, 15) : 'Unknown',
        reports: z.totalPotholes || 0,
      }));
  }, [zones]);

  // Get map center based on selected city
  const selectedCityName = cities.find(c => (c.id || c._id) == selectedCityId)?.name;
  const mapCenter = getCityCenter(selectedCityName);

  return (
    <div className="space-y-6 max-h-full pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Monitor city issues and resolution progress</p>
        </div>
        
        <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex items-center">
          <MapIcon size={20} className="text-gray-400 ml-2 mr-3" />
          <select 
            value={selectedCityId || ''}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="border-none bg-transparent outline-none pr-4 text-gray-700 font-medium cursor-pointer"
          >
            {cities.map(c => (
              <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
        </div>
      ) : (
        <>
          {/* Stat Cards — mapped to real backend fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Reports" value={summary.total || summary.totalPotholes || 0} colorClass="bg-blue-100 text-blue-600" icon={<FileText size={24} />} />
            <StatCard title="Pending" value={summary.pending || 0} colorClass="bg-yellow-100 text-yellow-600" icon={<Clock size={24} />} />
            <StatCard title="In Progress" value={summary.inProgress || 0} colorClass="bg-orange-100 text-orange-600" icon={<Wrench size={24} />} />
            <StatCard title="Resolved" value={summary.completed || 0} colorClass="bg-green-100 text-green-600" icon={<CheckCircle size={24} />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zone-wise Complaints */}
            <div className="lg:col-span-2 bg-gray-50 rounded-xl space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Zone-wise Summary</h2>
              <div className="space-y-4">
                {zones.length > 0 ? (
                  zones.map((zone, index) => (
                    <ComplaintCard key={zone.zoneName || index} complaint={{
                      title: zone.zoneName,
                      locationName: zone.city,
                      status: zone.totalPotholes > 0
                        ? (zone.pending > 0 ? 'Pending' : zone.inProgress > 0 ? 'In Progress' : 'Resolved')
                        : 'No Reports',
                      issueType: `${zone.totalPotholes} total reports`,
                    }} onClick={() => navigate('/my-complaints')} />
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                    No zone data found for this city.
                  </div>
                )}
              </div>
            </div>

            {/* Map & Chart */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-80">
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Live Map</h2>
                <div className="flex-1 rounded-lg overflow-hidden relative">
                  <MapView markers={markers} center={mapCenter} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-80 flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                  <BarChart2 size={20} className="text-brand-orange"/>
                  Zone Reports
                </h2>
                <div className="w-full" style={{ height: 250 }}>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="99%" height={240} debounce={50}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} angle={-30} textAnchor="end" height={60} interval={0} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} />
                        <Bar dataKey="reports" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No report data available for this city.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
