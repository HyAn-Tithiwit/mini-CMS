import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data), // Đảm bảo Backend route là /auth/login, nếu khác hãy sửa lại
  register: (data) => axiosClient.post('/auth/register', data),
  forgotPassword: (data) => axiosClient.post('/auth/forgotPassword', data),
  resetPassword: (data) => axiosClient.post('/auth/resetPassword', data),
};