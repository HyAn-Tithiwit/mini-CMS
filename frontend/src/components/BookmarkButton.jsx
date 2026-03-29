import React, { useState, useEffect } from 'react';
import { interactionApi } from '../../../api/interaction.api';

export default function BookmarkButton({ postId, initialBookmarks = [] }) {
  // Tìm xem bài viết này đã được bookmark chưa trong danh sách ban đầu
  const [bookmarkId, setBookmarkId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra xem postId này có trong danh sách bookmark của user không
    const found = initialBookmarks.find(b => b.post === postId || b.post?._id === postId);
    if (found) setBookmarkId(found._id);
  }, [postId, initialBookmarks]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (bookmarkId) {
        // Nếu đã có ID -> Thực hiện XÓA
        await interactionApi.removeBookmark(bookmarkId);
        setBookmarkId(null);
        alert("Đã bỏ lưu bài viết!");
      } else {
        // Nếu chưa có -> Thực hiện THÊM
        const res = await interactionApi.addBookmark(postId);
        // Backend trả về: { data: { _id: "...", post: "...", user: "..." } }
        setBookmarkId(res.data._id);
        alert("Đã lưu vào danh sách đọc sau!");
      }
    } catch (error) {
      console.error(error);
      alert("Thao tác thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={loading}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        border: '1px solid #007bff',
        backgroundColor: bookmarkId ? '#007bff' : '#fff',
        color: bookmarkId ? '#fff' : '#007bff',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: 'bold'
      }}
    >
      {loading ? '...' : bookmarkId ? '🔖 Đã lưu' : '🔖 Lưu bài viết'}
    </button>
  );
}