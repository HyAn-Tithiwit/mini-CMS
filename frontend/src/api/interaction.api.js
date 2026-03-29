import axiosClient from './axiosClient';

export const interactionApi = {
  // --- BÌNH LUẬN (Đã sửa thành /comment số ít) ---
  getCommentsByPost: (postId) => axiosClient.get(`/comment/${postId}`),
  addComment: (postId, data) => axiosClient.post(`/comment/${postId}`, data),
  deleteComment: (commentId) => axiosClient.delete(`/comment/${commentId}`),

  // --- TƯƠNG TÁC LIKE/DISLIKE ---
  getReactions: (postId) => axiosClient.get(`/reaction/${postId}`),
  reactToPost: (data) => axiosClient.post(`/reaction`, data),

  // --- LƯU TRỮ (BOOKMARK) ---
  getBookmarks: () => axiosClient.get(`/bookmark`),
  toggleBookmark: (postId) => axiosClient.post(`/bookmark/toggle/${postId}`),
};