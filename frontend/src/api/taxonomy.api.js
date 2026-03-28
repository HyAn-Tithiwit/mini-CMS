import axiosClient from './axiosClient';

export const taxonomyApi = {
  // --- CATEGORY ---
  getCategories: () => axiosClient.get('/categories'), 
  createCategory: (data) => axiosClient.post('/categories/create-category', data),
  deleteCategory: (id) => axiosClient.delete(`/categories/delete-category/${id}`),
  
  // --- TAG (Thêm hàm getTags vào đây) ---
  getTags: () => axiosClient.get('/tags'), // Phía Backend cần cung cấp API GET này
  createTag: (data) => axiosClient.post('/tags/create-tag', data),
  deleteTag: (id) => axiosClient.delete(`/tags/delete-tag/${id}`),
};