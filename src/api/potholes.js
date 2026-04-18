import axiosInstance from './axiosInstance';

export const reportPothole = async (formData) => {
  const response = await axiosInstance.post('/api/potholes/report', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getMyReports = async () => {
  const response = await axiosInstance.get('/api/potholes/my-reports');
  return response.data;
};

export const upvotePothole = async (id) => {
  const response = await axiosInstance.put(`/api/potholes/${id}/upvote`);
  return response.data;
};

export const getMapMarkers = async (cityId) => {
  const response = await axiosInstance.get(`/api/potholes/map/${cityId}`);
  return response.data;
};
