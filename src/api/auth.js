import axiosInstance from './axiosInstance';

export const login = async (email, password) => {
  const response = await axiosInstance.post('/api/auth/login', { email, password });
  return response.data;
};

export const register = async ({ name, email, password, phone, cityId }) => {
  const response = await axiosInstance.post('/api/auth/register', {
    name,
    email,
    password,
    phone,
    cityId: Number(cityId),
  });
  return response.data;
};
