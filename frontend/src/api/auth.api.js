import axiosClient from './axiosClient';

export const authApi = {
  // --- AUTHENTICATION ---
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data), 
  refreshToken: (data) => axiosClient.post('/auth/refresh-token', data),
  logout: (data) => axiosClient.post('/auth/logout', data),
  
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
  
  // --- USER PROFILE (Khớp với file route của Backend) ---
  getUserInfo: () => axiosClient.get('/user/get-user-info'), 
  
  // --- ADMIN ROLE ---
  getAllUsers: () => axiosClient.get('/admin/users'),
  getUserById: (id) => axiosClient.get(`/admin/users/${id}`),
  updateUserStatus: (id, statusData) => axiosClient.patch(`/admin/users/${id}/status`, statusData),
  updateUserRole: (id, roleData) => axiosClient.patch(`/admin/users/${id}/role`, roleData),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
};