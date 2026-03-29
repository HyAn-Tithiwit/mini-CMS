import React, { useState, useEffect, useCallback } from 'react';
import { interactionApi } from '../api/interaction.api';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  // State cho tính năng Sửa
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // State chặn click Like liên tục
  const [loadingLike, setLoadingLike] = useState({});

  // 1. Hàm load danh sách bình luận
  const loadComments = useCallback(async () => {
    try {
      const res = await interactionApi.getCommentsByPost(postId);
      setComments(res.data || []);
    } catch (err) {
      console.error("Lỗi tải bình luận:", err);
    }
  }, [postId]);

  // 2. Tự động load khi vào trang
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isMounted) {
        await loadComments();
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [loadComments]);

  // 3. Hàm gửi bình luận mới
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await interactionApi.addComment({
        post: postId,
        user: user?._id || user?.id,
        content: newComment
      });
      setNewComment('');
      loadComments();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi bình luận");
    }
  };

  // 4. Hàm xóa bình luận
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bình luận này?")) return;
    try {
      await interactionApi.deleteComment(id);
      setComments(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Không thể xóa bình luận");
    }
  };

  // 5. Logic Sửa bình luận
  const handleStartEdit = (comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;
    try {
      await interactionApi.updateComment(id, { content: editContent });
      setEditingId(null);
      loadComments();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật");
    }
  };

  // 6. Logic Toggle Like (Thích/Bỏ thích)
  const handleLike = async (commentId) => {
    if (!user) return alert("Vui lòng đăng nhập để thực hiện tính năng này!");
    
    if (loadingLike[commentId]) return;
    setLoadingLike(prev => ({ ...prev, [commentId]: true }));

    try {
      // Thử Like
      await interactionApi.likeComment(commentId);
    } catch (err) {
      // Nếu lỗi 400 (Đã like rồi) -> Thử Unlike
      if (err.response && err.response.status === 400) {
        try {
          await interactionApi.unlikeComment(commentId);
        } catch (unErr) {
          console.error("Lỗi khi Unlike:", unErr);
        }
      } else {
        console.error("Lỗi hệ thống khi Like:", err);
      }
    } finally {
      await loadComments();
      setLoadingLike(prev => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        💬 Bình luận ({comments.length})
      </h3>

      {/* Form gửi bình luận mới */}
      {user ? (
        <form onSubmit={handleSendComment} style={{ marginBottom: '30px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px', display: 'block' }}
          />
          <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Gửi bình luận
          </button>
        </form>
      ) : (
        <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px' }}>Vui lòng đăng nhập để bình luận.</p>
      )}

      {/* Danh sách bình luận */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {comments.map((c) => (
          <div key={c._id} style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong style={{ color: '#007bff' }}>{c.user?.username || 'Bạn đọc'}</strong>
              <span style={{ fontSize: '12px', color: '#999' }}>
                {new Date(c.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>

            {/* Hiển thị nội dung hoặc ô nhập để sửa */}
            {editingId === c._id ? (
              <div style={{ marginBottom: '10px' }}>
                <textarea 
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #007bff', minHeight: '60px', display: 'block' }}
                />
                <div style={{ marginTop: '5px' }}>
                  <button onClick={() => handleUpdate(c._id)} style={{ color: 'green', marginRight: '15px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Lưu</button>
                  <button onClick={() => setEditingId(null)} style={{ color: '#666', border: 'none', background: 'none', cursor: 'pointer' }}>Hủy</button>
                </div>
              </div>
            ) : (
              <p style={{ margin: '0 0 15px 0', lineHeight: '1.6', color: '#333' }}>{c.content}</p>
            )}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              {/* Nút Like */}
              <button
                onClick={() => handleLike(c._id)}
                disabled={loadingLike[c._id]}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: loadingLike[c._id] ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#666',
                  padding: '5px 0'
                }}
              >
                <span style={{ fontSize: '18px' }}>👍</span> 
                {c.reactionCount || 0} Thích
              </button>

              {/* Nút Sửa/Xóa nếu là chủ sở hữu */}
              {(user?._id === c.user || user?._id === c.user?._id) && editingId !== c._id && (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => handleStartEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', fontSize: '13px' }}>Sửa</button>
                  <button onClick={() => handleDelete(c._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontSize: '13px' }}>Xóa</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}