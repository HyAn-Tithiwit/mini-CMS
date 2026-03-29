import axiosClient from './axiosClient';

export const postApi = {
  // --- PUBLIC/READER ---
  getPosts: (params) => axiosClient.get('/posts', { params }), 
  getDetailPost: (id) => axiosClient.get(`/posts/${id}`), 
  searchByKeyword: (keyword) => axiosClient.get(`/posts/search/${keyword}`),
  searchByCategory: (categorySlug) => axiosClient.get(`/posts/category/${categorySlug}`),
  searchByTag: (tagSlug) => axiosClient.get(`/posts/tag/${tagSlug}`),

  // --- AUTHOR/ADMIN ---
  // SỬA Ở ĐÂY: Bỏ ép cứng headers. Để Axios tự động sinh boundary cho file upload
  createPostByAuthor: (data) => axiosClient.post('/posts', data), 
  createPostByAdmin: (data) => axiosClient.post('/posts', data), 
  updatePost: (id, data) => axiosClient.put(`/posts/${id}`, data),
  deletePost: (id) => axiosClient.delete(`/posts/${id}`),

  // --- EDITOR ROLE ---
  getEditorPosts: () => axiosClient.get('/editor'), 
  getEditorPostDetail: (id) => axiosClient.get(`/editor/${id}`),
  approvePost: (id) => axiosClient.put(`/editor/approve/${id}`),
  rejectPost: (id) => axiosClient.put(`/editor/reject/${id}`),
};