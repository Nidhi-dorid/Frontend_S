import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://pothole-backend-gbud.onrender.com',
});

// Request interceptor to attach Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to unwrap backend's { success, data: ... } wrapper
axiosInstance.interceptors.response.use(
  (response) => {
    // If backend wraps response in { success, data }, extract the inner data
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
