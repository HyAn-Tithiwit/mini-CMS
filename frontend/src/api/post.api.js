import axiosClient from './axiosClient';

export const postApi = {
  // ... các API public và author giữ nguyên ...
  getPosts: (params) => axiosClient.get('/posts', { params }), 
  getDetailPost: (id) => axiosClient.get(`/posts/${id}`), 
  searchByKeyword: (keyword) => axiosClient.get(`/posts/search/${keyword}`),
  searchByCategory: (categorySlug) => axiosClient.get(`/posts/category/${categorySlug}`),
  searchByTag: (tagSlug) => axiosClient.get(`/posts/tag/${tagSlug}`),

  createPostByAuthor: (data) => axiosClient.post('/posts', data), 
  createPostByAdmin: (data) => axiosClient.post('/posts', data), 
  updatePost: (id, data) => axiosClient.put(`/posts/${id}`, data),
  deletePost: (id) => axiosClient.delete(`/posts/${id}`),

  submitToReview: (id) => axiosClient.put(`/user/me/${id}`), 

  // --- EDITOR ROLE ---
  getEditorPosts: () => axiosClient.get('/editor'), 
  getEditorPostDetail: (id) => axiosClient.get(`/editor/${id}`),  
  approvePost: (id) => axiosClient.put(`/editor/publish/${id}`), 
  rejectPost: (id) => axiosClient.put(`/editor/reject/${id}`),
};

// ==========================================
// 🎯 BỔ SUNG LẠI: API CHO CATEGORY VÀ TAG
// ==========================================

export const categoryApi = {
  getCategories: () => axiosClient.get('/categories'),
  getCategoryBySlug: (slug) => axiosClient.get(`/categories/${slug}`),
  createCategory: (data) => axiosClient.post('/categories', data),
  updateCategory: (id, data) => axiosClient.put(`/categories/${id}`, data),
  deleteCategory: (id) => axiosClient.delete(`/categories/${id}`),
};

export const tagApi = {
  getTags: () => axiosClient.get('/tags'),
  getTagBySlug: (slug) => axiosClient.get(`/tags/${slug}`),
  createTag: (data) => axiosClient.post('/tags', data),
  updateTag: (id, data) => axiosClient.put(`/tags/${id}`, data),
  deleteTag: (id) => axiosClient.delete(`/tags/${id}`),
};