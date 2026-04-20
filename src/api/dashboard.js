import axiosInstance from './axiosInstance';

export const getSummary = async (cityId) => {
  const response = await axiosInstance.get(`/api/dashboard/summary/${cityId}`);
  return response.data;
};

export const getDashboardZones = async (cityId) => {
  const response = await axiosInstance.get(`/api/dashboard/zones/${cityId}`);
  return response.data;
};

export const getMonthlyReports = async (cityId) => {
  const response = await axiosInstance.get(`/api/dashboard/monthly/${cityId}`);
  return response.data;
};
