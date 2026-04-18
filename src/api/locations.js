import axiosInstance from './axiosInstance';

export const getCities = async () => {
  const response = await axiosInstance.get('/api/locations/cities');
  return response.data;
};

export const getZones = async (cityId) => {
  const response = await axiosInstance.get(`/api/locations/zones/${cityId}`);
  return response.data;
};
