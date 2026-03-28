import axiosClient from './axiosClient';

export const postApi = {
  // --- PUBLIC/READER ---
  // Gọi GET /api/posts/
  getPosts: (params) => axiosClient.get('/posts', { params }), 
  
  // Gọi GET /api/posts/:id
  getDetailPost: (id) => axiosClient.get(`/posts/${id}`), 
  
  // Các API tìm kiếm khớp với file post.route.js của Backend
  searchByKeyword: (keyword) => axiosClient.get(`/posts/search/${keyword}`),
  searchByCategory: (categorySlug) => axiosClient.get(`/posts/category/${categorySlug}`),
  searchByTag: (tagSlug) => axiosClient.get(`/posts/tag/${tagSlug}`),

  // --- AUTHOR/ADMIN ---
  // Frontend không cần chia ra createPostByAdmin hay createPostByAuthor nữa
  // Vì backend dùng chung 1 route POST /api/posts/
  createPostByAuthor: (data) => axiosClient.post('/posts', data), 
  createPostByAdmin: (data) => axiosClient.post('/posts', data), 
  
  updatePost: (id, data) => axiosClient.put(`/posts/${id}`, data),
  deletePost: (id) => axiosClient.delete(`/posts/${id}`),

  // --- CÁC TÍNH NĂNG CHỜ BACKEND BỔ SUNG (Tạm thời map chung để không lỗi UI) ---
  submitToReview: (id) => axiosClient.put(`/posts/${id}`), 
  getPostsWithReviewStatus: () => axiosClient.get('/posts'),
  publishPost: (id) => axiosClient.put(`/posts/${id}`),
  rejectPost: (id) => axiosClient.put(`/posts/${id}`),
};