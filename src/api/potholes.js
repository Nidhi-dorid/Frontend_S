import axiosInstance from './axiosInstance';

export const reportPothole = async (formData) => {
  const response = await axiosInstance.post('/api/potholes/report', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMyReports = async () => {
  const response = await axiosInstance.get('/api/potholes/my-reports');
  // Normalize backend PotholeResponse fields to match UI expectations
  return (response.data || []).map(r => ({
    ...r,
    // Map coordinate fields
    lat: r.latitude ?? r.lat,
    lng: r.longitude ?? r.lng,
    // Generate display fields from backend data
    title: r.zoneName ? `${(r.severity || 'Issue').charAt(0).toUpperCase() + (r.severity || 'issue').slice(1)} - ${r.zoneName}` : `Report #${r.id}`,
    locationName: r.zoneName && r.city ? `${r.zoneName}, ${r.city}` : r.zoneName || r.city || 'Unknown',
    issueType: r.severity ? `${r.severity} severity` : 'Pothole',
    description: r.notes || `Reported by ${r.reportedByName || 'citizen'}. Status: ${(r.status || 'pending').replace(/_/g, ' ')}.`,
    thumbnail: r.imageUrl,
    upvotes: r.upvoteCount ?? r.upvotes ?? 0,
    // Normalize status for display (in_progress → In Progress)
    status: r.status ? r.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Pending'
  }));
};

export const upvotePothole = async (id) => {
  const response = await axiosInstance.put(`/api/potholes/${id}/upvote`);
  return response.data;
};

export const getMapMarkers = async (cityId) => {
  try {
    const response = await axiosInstance.get(`/api/potholes/map/${cityId}`);
    // Normalize field names: backend returns latitude/longitude, frontend uses lat/lng
    return (response.data || []).map(m => ({
      ...m,
      lat: m.latitude ?? m.lat,
      lng: m.longitude ?? m.lng,
      title: m.zoneName || m.title
    }));
  } catch (error) {
    console.warn(`Map markers API failed for cityId ${cityId}, using fallback`, error);
    return [];
  }
};
