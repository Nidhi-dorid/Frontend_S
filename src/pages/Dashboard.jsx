import React, { useEffect, useState, useContext } from 'react';
import { getCities, getSummary, getDashboardZones, getMapMarkers, getMonthlyReports } from '../api';
import { CityContext } from '../context/CityContext';
import { FileText, Clock, Wrench, CheckCircle, Map as MapIcon, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/common/StatCard';
import ComplaintCard from '../components/features/ComplaintCard';
import MapView from '../components/features/MapView';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { selectedCityId, setSelectedCityId } = useContext(CityContext);
  const [cities, setCities] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = React.useCallback(async () => {
    try {
      const data = await getCities();
      setCities(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && !selectedCityId) {
        setSelectedCityId(data[0].id || data[0]._id);
      }
    } catch {
      toast.error('Failed to load cities');
    }
  }, [selectedCityId, setSelectedCityId]);

  const fetchDashboardData = React.useCallback(async (cityId) => {
    setLoading(true);
    try {
      const [summaryData, zonesData, markersData, monthlyData] = await Promise.all([
        getSummary(cityId).catch(() => ({ total: 0, pending: 0, inProgress: 0, resolved: 0 })),
        getDashboardZones(cityId).catch(() => []),
        getMapMarkers(cityId).catch(() => []),
        getMonthlyReports(cityId).catch(() => [])
      ]);
      setSummary(summaryData || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
      setRecentComplaints(Array.isArray(zonesData) ? zonesData : []);
      setMarkers(Array.isArray(markersData) ? markersData : []);
      setChartData(Array.isArray(monthlyData) ? monthlyData : []);
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
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Reports" value={summary.total || 0} colorClass="bg-blue-100 text-blue-600" icon={<FileText size={24} />} />
            <StatCard title="Pending" value={summary.pending || 0} colorClass="bg-yellow-100 text-yellow-600" icon={<Clock size={24} />} />
            <StatCard title="In Progress" value={summary.inProgress || 0} colorClass="bg-orange-100 text-orange-600" icon={<Wrench size={24} />} />
            <StatCard title="Resolved" value={summary.resolved || 0} colorClass="bg-green-100 text-green-600" icon={<CheckCircle size={24} />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Complaints */}
            <div className="lg:col-span-2 bg-gray-50 rounded-xl space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Recent Complaints</h2>
              <div className="space-y-4">
                {recentComplaints.length > 0 ? (
                  recentComplaints.map((complaint, index) => (
                    <ComplaintCard key={complaint.id || index} complaint={complaint} />
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                    No recent complaints found for this city.
                  </div>
                )}
              </div>
            </div>

            {/* Map & Chart */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col h-80">
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Live Map</h2>
                <div className="flex-1 rounded-lg overflow-hidden relative">
                  <MapView markers={markers} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-80 flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                  <BarChart2 size={20} className="text-brand-orange"/>
                  Monthly Reports
                </h2>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} />
                      <Bar dataKey="reports" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
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
