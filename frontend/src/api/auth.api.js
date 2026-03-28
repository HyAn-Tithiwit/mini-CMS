import axiosClient from './axiosClient';

export const authApi = {
  // --- AUTHENTICATION ---
  register: (data) => axiosClient.post('/auth/register', data),
  loginAdmin: (data) => axiosClient.post('/auth/login/admin', data),
  loginReader: (data) => axiosClient.post('/auth/login/reader', data),
  logout: () => axiosClient.post('/auth/logout'),
  
  // --- USER PROFILE ---
  getUserInfo: () => axiosClient.get('/users/get-user-info'),
  upgradeToAuthor: () => axiosClient.put('/users/update-role-to-author'),
  
  // --- ADMIN ROLE (Quản lý User) ---
  getAllUsers: () => axiosClient.get('/users/get-all-user'),
  getUserById: (id) => axiosClient.get(`/users/get-user-byID/${id}`),
  updateUserStatus: (id, statusData) => axiosClient.patch(`/users/update-status-byID/${id}`, statusData),
  deleteUser: (id) => axiosClient.delete(`/users/delete-user-by/${id}`),
};