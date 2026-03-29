import axiosClient from './axiosClient';

export const interactionApi = {
  // --- BÌNH LUẬN (Đã sửa thành /comment số ít) ---
  getCommentsByPost: (postId) => axiosClient.get(`/comment/${postId}`),
  addComment: (data) => axiosClient.post(`/comment`, data),
  updateComment: (commentId, data) => axiosClient.patch(`/comment/${commentId}`, data),
  deleteComment: (commentId) => axiosClient.delete(`/comment/${commentId}`),

  // --- TƯƠNG TÁC LIKE/DISLIKE ---
  likeComment: (commentId) => axiosClient.post(`/reaction/${commentId}`),
  unlikeComment: (commentId) => axiosClient.delete(`/reaction/${commentId}`),

  // --- LƯU TRỮ (BOOKMARK) ---
  getBookmarks: () => axiosClient.get('/bookmark'),
  addBookmark: (postId) => axiosClient.post(`/bookmark/${postId}`),
  removeBookmark: (bookmarkId) => axiosClient.delete(`/bookmark/${bookmarkId}`),
};