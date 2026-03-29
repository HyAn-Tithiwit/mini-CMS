import axiosClient from './axiosClient';

export const taxonomyApi = {
  // --- CATEGORY API ---
  // Đã sửa lại thành /category (số ít) khớp với app.js
  getCategories: () => axiosClient.get('/category'),
  createCategory: (data) => axiosClient.post('/category', data),
  updateCategory: (id, data) => axiosClient.put(`/category/${id}`, data),
  deleteCategory: (id) => axiosClient.delete(`/category/${id}`),

  // --- TAG API ---
  // Đã sửa lại thành /tag (số ít) khớp với app.js
  getTags: () => axiosClient.get('/tag'),
  createTag: (data) => axiosClient.post('/tag', data),
  updateTag: (id, data) => axiosClient.put(`/tag/${id}`, data),
  deleteTag: (id) => axiosClient.delete(`/tag/${id}`),
};