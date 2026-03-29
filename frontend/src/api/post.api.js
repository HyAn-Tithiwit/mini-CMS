import axiosClient from './axiosClient';

export const postApi = {
  // --- PUBLIC/READER ---
  getPosts: (params) => axiosClient.get('/posts', { params }), 
  getDetailPost: (id) => axiosClient.get(`/posts/${id}`), 
  searchByKeyword: (keyword) => axiosClient.get(`/posts/search/${keyword}`),
  searchByCategory: (categorySlug) => axiosClient.get(`/posts/category/${categorySlug}`),
  searchByTag: (tagSlug) => axiosClient.get(`/posts/tag/${tagSlug}`),

  // --- AUTHOR/ADMIN ---
  // SỬA Ở ĐÂY: Thêm header multipart/form-data để Backend nhận được file ảnh
  createPostByAuthor: (data) => axiosClient.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }), 
  createPostByAdmin: (data) => axiosClient.post('/posts', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }), 
  updatePost: (id, data) => axiosClient.put(`/posts/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePost: (id) => axiosClient.delete(`/posts/${id}`),
  

  // --- CÁC TÍNH NĂNG CHỜ BACKEND BỔ SUNG ---
  submitToReview: (id) => axiosClient.put(`/posts/${id}`), 
  getPostsWithReviewStatus: () => axiosClient.get('/posts'),
  publishPost: (id) => axiosClient.put(`/posts/${id}`),
  rejectPost: (id) => axiosClient.put(`/posts/${id}`),
};