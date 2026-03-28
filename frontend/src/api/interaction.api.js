import axiosClient from './axiosClient';

export const interactionApi = {
  // --- COMMENTS ---
  getCommentsInPost: (postId) => axiosClient.get(`/comments/get-comments-in-post/${postId}`),
  createComment: (data) => axiosClient.post('/comments/create-comment', data),
  updateComment: (id, data) => axiosClient.put(`/comments/update-comment/${id}`, data),
  deleteComment: (id) => axiosClient.delete(`/comments/delete-comment/${id}`),

  // --- REACTIONS ---
  createReact: (data) => axiosClient.post('/reactions/create-react', data),
  deleteReact: (id) => axiosClient.delete(`/reactions/delete-reaction/${id}`),

  // --- BOOKMARKS ---
  saveBookmark: (postId) => axiosClient.post(`/bookmarks/Save-bookmark/${postId}`),
  deleteBookmark: (id) => axiosClient.delete(`/bookmarks/delete-bookmark/${id}`),
  viewBookmarked: () => axiosClient.get('/bookmarks/view-bookmarked'),
};