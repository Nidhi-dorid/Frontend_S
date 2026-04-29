import axiosInstance from './axiosInstance';

export const getCities = async () => {
  try {
    const response = await axiosInstance.get('/api/locations/cities');
    return response.data.data ?? response.data; // ← same fix for cities too
  } catch (error) {
    console.warn('Backend cities API failed, using fallback city list', error);
    throw error;
  }
};

export const getZones = async (cityId) => {
  try {
    const response = await axiosInstance.get(`/api/locations/zones/${cityId}`);
    return response.data.data ?? response.data; // ← FIX: zones array nikalo
  } catch (error) {
    console.warn(`Backend zones API failed for cityId ${cityId}`, error);
    throw error;
  }
};